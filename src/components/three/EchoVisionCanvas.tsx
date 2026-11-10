'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PrototypeComponent } from '@/types/reefsight';
import { formatRupiah } from '@/lib/utils';
import { Layers, ZoomIn, ZoomOut, RotateCcw, AlertCircle, CheckCircle2, DollarSign, Activity } from 'lucide-react';

interface Props {
  onSelectComponent?: (comp: PrototypeComponent | null) => void;
  selectedComponentId?: number | null;
  scenario?: 'healthy' | 'bleaching' | 'low_fish' | 'degradation';
}

export default function EchoVisionCanvas({
  onSelectComponent,
  selectedComponentId,
  scenario = 'healthy'
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [components, setComponents] = useState<PrototypeComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [exploded, setExploded] = useState(0); // 0 to 1
  const [totalBom, setTotalBom] = useState<number>(2120000);
  const [selectedComp, setSelectedComp] = useState<PrototypeComponent | null>(null);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupMapRef = useRef<{ [key: number]: THREE.Group }>({});
  const compMapRef = useRef<{ [key: number]: PrototypeComponent }>({});
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 3, radius: 2.8 });

  // Load 3D JSON Data
  useEffect(() => {
    fetch('/data/echovision_prototype_3d.json')
      .then(res => res.json())
      .then(data => {
        setComponents(data.components || []);
        if (data.total_bom_rp) setTotalBom(data.total_bom_rp);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load 3d json:', err);
        setLoading(false);
      });
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current || components.length === 0) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPosition();

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e3a5f, 1.2);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x0ea5e9, 0.8);
    fillLight.position.set(-5, -2, -5);
    scene.add(fillLight);

    // Simulated Water Surface & Seabed
    const waterGroup = new THREE.Group();
    const waterMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const waterSurface = new THREE.Mesh(new THREE.CircleGeometry(1.6, 64), waterMat);
    waterSurface.rotation.x = -Math.PI / 2;
    waterSurface.position.y = 0; // Waterline Y = 0

    // Water Column cylinder
    const waterColMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const waterColumn = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 1.8, 64, 1, true), waterColMat);
    waterColumn.position.y = -0.9;

    // Seabed
    const seabedMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.9,
      metalness: 0.1
    });
    const seabed = new THREE.Mesh(new THREE.CircleGeometry(1.6, 64), seabedMat);
    seabed.rotation.x = -Math.PI / 2;
    seabed.position.y = -1.8;

    waterGroup.add(waterSurface, waterColumn, seabed);
    scene.add(waterGroup);

    // Helper function to create solar panel texture
    function createSolarTexture() {
      const cv = document.createElement('canvas');
      cv.width = 128;
      cv.height = 128;
      const ctx = cv.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0f2952';
        ctx.fillRect(0, 0, 128, 128);
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;
        for (let i = 0; i <= 128; i += 21) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 128);
          ctx.moveTo(0, i);
          ctx.lineTo(128, i);
          ctx.stroke();
        }
      }
      return new THREE.CanvasTexture(cv);
    }
    const solarTex = createSolarTexture();

    // Helper: Build 3D mesh from part JSON
    function buildPartMesh(part: any) {
      let geo: THREE.BufferGeometry;
      const s = part.size || [0.1, 0.1, 0.1];

      if (part.type === 'cylinder') {
        geo = new THREE.CylinderGeometry(s[0], s[0], s[1], 32);
      } else if (part.type === 'box') {
        geo = new THREE.BoxGeometry(s[0], s[1], s[2]);
      } else if (part.type === 'sphere') {
        geo = new THREE.SphereGeometry(s[0], 32, 16);
      } else if (part.type === 'torus') {
        geo = new THREE.TorusGeometry(s[0], s[1], 16, 48);
      } else if (part.type === 'tube' && part.points) {
        const pts = part.points.map((p: any) => new THREE.Vector3(p[0] || 0, p[1] || 0, p[2] || 0));
        geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, s[0], 8, false);
      } else if (part.from && part.to) {
        const A = new THREE.Vector3(part.from[0] || 0, part.from[1] || 0, part.from[2] || 0);
        const B = new THREE.Vector3(part.to[0] || 0, part.to[1] || 0, part.to[2] || 0);
        const dist = A.distanceTo(B);
        geo = new THREE.CylinderGeometry(s[0], s[0], dist, 12);
      } else {
        geo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      }

      const opacity = part.opacity !== undefined ? part.opacity : 1;
      const mat = new THREE.MeshStandardMaterial({
        color: part.texture ? 0xffffff : (part.color || 0xcccccc),
        map: part.texture === 'solar' ? solarTex : null,
        roughness: 0.35,
        metalness: part.metal || 0.1,
        transparent: opacity < 1,
        opacity: opacity,
        depthWrite: opacity >= 1
      });

      const mesh = new THREE.Mesh(geo, mat);

      if (part.type === 'rod' && part.from && part.to) {
        const A = new THREE.Vector3(part.from[0] || 0, part.from[1] || 0, part.from[2] || 0);
        const B = new THREE.Vector3(part.to[0] || 0, part.to[1] || 0, part.to[2] || 0);
        mesh.position.copy(A).add(B).multiplyScalar(0.5);
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
      } else if (part.pos) {
        mesh.position.set(part.pos[0] || 0, part.pos[1] || 0, part.pos[2] || 0);
        if (part.rot) {
          mesh.rotation.set(
            ((part.rot[0] || 0) * Math.PI) / 180,
            ((part.rot[1] || 0) * Math.PI) / 180,
            ((part.rot[2] || 0) * Math.PI) / 180
          );
        }
      }

      if (part.edges) {
        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(geo),
          new THREE.LineBasicMaterial({ color: 0x38bdf8 })
        );
        mesh.add(edges);
      }

      return mesh;
    }

    // Build Components
    groupMapRef.current = {};
    compMapRef.current = {};

    components.forEach(comp => {
      const compGroup = new THREE.Group();
      compGroup.userData = {
        id: comp.id,
        explode: comp.explode || [0, 0, 0],
        basePos: new THREE.Vector3(0, 0, 0)
      };

      compMapRef.current[comp.id] = comp;
      groupMapRef.current[comp.id] = compGroup;

      comp.parts.forEach(part => {
        const mesh = buildPartMesh(part);
        mesh.userData = { compId: comp.id };
        compGroup.add(mesh);
      });

      scene.add(compGroup);
    });

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle buoy water bobbing motion
      const bobbingY = Math.sin(elapsed * 1.5) * 0.015;
      const rockingZ = Math.sin(elapsed * 0.9) * 0.01;

      // Apply bobbing to root if not dragging
      waterSurface.position.y = Math.sin(elapsed * 1.2) * 0.005;

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, [components]);

  // Handle Scenario lighting color shift
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    
    // Adjust background / ambient tint based on ecological scenario
    if (scenario === 'healthy') {
      scene.fog = new THREE.FogExp2(0x0a2540, 0.08);
    } else if (scenario === 'bleaching') {
      scene.fog = new THREE.FogExp2(0x2d251e, 0.1);
    } else if (scenario === 'low_fish') {
      scene.fog = new THREE.FogExp2(0x131f2b, 0.12);
    } else if (scenario === 'degradation') {
      scene.fog = new THREE.FogExp2(0x261a1a, 0.14);
    }
  }, [scenario]);

  // Update Camera Orbit Position
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { theta, phi, radius } = cameraAngleRef.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(0, 0, 0);
  };

  // Mouse Orbit Drag Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };

    cameraAngleRef.current.theta -= deltaX * 0.008;
    cameraAngleRef.current.phi = Math.max(
      0.15,
      Math.min(Math.PI - 0.15, cameraAngleRef.current.phi - deltaY * 0.008)
    );
    updateCameraPosition();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    cameraAngleRef.current.radius = Math.max(
      1.2,
      Math.min(6.0, cameraAngleRef.current.radius + e.deltaY * 0.003)
    );
    updateCameraPosition();
  };

  // Handle Explode Animation/Slider
  const handleExplodeChange = (val: number) => {
    setExploded(val);
    Object.keys(groupMapRef.current).forEach(idStr => {
      const group = groupMapRef.current[Number(idStr)];
      if (group && group.userData.explode) {
        const ex = group.userData.explode;
        group.position.set(ex[0] * val, ex[1] * val, ex[2] * val);
      }
    });
  };

  // Click Raycaster for Selecting Component
  const handleClick = (e: React.MouseEvent) => {
    if (!mountRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
    for (const hit of intersects) {
      if (hit.object.userData && hit.object.userData.compId) {
        const comp = compMapRef.current[hit.object.userData.compId];
        if (comp) {
          setSelectedComp(comp);
          if (onSelectComponent) onSelectComponent(comp);
          highlightComponent(comp.id);
          return;
        }
      }
    }
  };

  const highlightComponent = (id: number) => {
    Object.keys(groupMapRef.current).forEach(key => {
      const g = groupMapRef.current[Number(key)];
      const isTarget = Number(key) === id;
      g.traverse((child: any) => {
        if (child.isMesh && child.material) {
          if (isTarget) {
            child.material.emissive = new THREE.Color(0x06b6d4);
            child.material.emissiveIntensity = 0.5;
          } else {
            child.material.emissive = new THREE.Color(0x000000);
            child.material.emissiveIntensity = 0;
          }
        }
      });
    });
  };

  const resetView = () => {
    cameraAngleRef.current = { theta: Math.PI / 4, phi: Math.PI / 3, radius: 2.8 };
    updateCameraPosition();
    handleExplodeChange(0);
    setSelectedComp(null);
    if (onSelectComponent) onSelectComponent(null);
    highlightComponent(-1);
  };

  return (
    <div className="relative w-full h-[600px] lg:h-[700px] bg-gradient-to-b from-slate-950 via-[#061b2e] to-slate-950 rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl">
      {/* 3D Canvas Mounting Area */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-30">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-cyan-200">Memuat Model 3D EchoVision...</p>
          </div>
        </div>
      )}

      {/* Floating Header Info */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-3 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-xs uppercase tracking-wider font-bold text-cyan-400">EchoVision 3D Hardware</h2>
          </div>
          <p className="text-sm font-semibold text-white mt-1">Prototipe Pemantau Nirawak Terpadu</p>
          <p className="text-xs text-slate-400 mt-0.5">BOM Hardware Total: <span className="text-emerald-400 font-bold">{formatRupiah(totalBom)}</span></p>
        </div>
      </div>

      {/* Floating Controls Overlay */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={resetView}
          title="Reset Sudut Pandang"
          className="p-2.5 bg-slate-900/80 hover:bg-cyan-900/50 backdrop-blur-md border border-cyan-500/30 text-cyan-300 rounded-lg transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            cameraAngleRef.current.radius = Math.max(1.2, cameraAngleRef.current.radius - 0.4);
            updateCameraPosition();
          }}
          title="Zoom In"
          className="p-2.5 bg-slate-900/80 hover:bg-cyan-900/50 backdrop-blur-md border border-cyan-500/30 text-cyan-300 rounded-lg transition-all"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            cameraAngleRef.current.radius = Math.min(5.5, cameraAngleRef.current.radius + 0.4);
            updateCameraPosition();
          }}
          title="Zoom Out"
          className="p-2.5 bg-slate-900/80 hover:bg-cyan-900/50 backdrop-blur-md border border-cyan-500/30 text-cyan-300 rounded-lg transition-all"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Explode Slider & Hint */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-none">
        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-xl px-4 py-2.5 text-xs text-slate-300 pointer-events-auto flex items-center gap-3">
          <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Putar: Drag Mouse · Zoom: Scroll · Klik Komponen untuk Detail
          </span>
        </div>

        <div className="bg-slate-900/85 backdrop-blur-md border border-cyan-500/30 rounded-xl px-4 py-2 pointer-events-auto flex items-center gap-3">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-300 font-medium">Bongkar (Explode):</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={exploded}
            onChange={(e) => handleExplodeChange(parseFloat(e.target.value))}
            className="w-28 md:w-36 accent-cyan-400 cursor-pointer"
          />
          <span className="text-xs text-cyan-400 font-mono w-8">{Math.round(exploded * 100)}%</span>
        </div>
      </div>

      {/* Selected Component Detail Card */}
      {selectedComp && (
        <div className="absolute top-20 left-4 max-w-sm w-[calc(100vw-32px)] md:w-80 bg-slate-900/90 backdrop-blur-xl border border-cyan-400/50 rounded-2xl p-4 text-white shadow-2xl z-20 animate-in fade-in slide-in-from-left duration-200">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800">
                Komponen #{selectedComp.id}
              </span>
              <h3 className="text-base font-bold text-white mt-1.5">{selectedComp.name}</h3>
            </div>
            <button
              onClick={() => {
                setSelectedComp(null);
                highlightComponent(-1);
              }}
              className="text-slate-400 hover:text-white text-lg p-1"
            >
              ×
            </button>
          </div>

          <p className="text-xs font-mono text-cyan-300 mt-1">{selectedComp.spec}</p>

          <div className="my-2.5 p-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block font-medium">Estimasi Biaya Komponen (BOM):</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
              <DollarSign className="w-3.5 h-3.5" /> {formatRupiah(selectedComp.price_rp || 0)}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedComp.function || selectedComp.role || selectedComp.description}
          </p>
        </div>
      )}
    </div>
  );
}
