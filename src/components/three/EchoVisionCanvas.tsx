'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PrototypeComponent } from '@/types/reefsight';
import { formatRupiah } from '@/lib/utils';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  FileCode,
  DollarSign,
  Activity,
  Waves,
  Eye,
  X,
  Radio,
  Send,
  Sparkles,
} from 'lucide-react';
import { CORAL_SPECIES_3D, createSchoolOfFish, createMacrobenthos } from './coralReefGeometries';

type ViewMode3D = 'hardware' | 'coral_reef' | 'island_3d' | 'simulation';

interface Props {
  onSelectComponent?: (comp: PrototypeComponent | null) => void;
  selectedComponentId?: number | null;
  scenario?: 'healthy' | 'bleaching' | 'low_fish' | 'degradation';
}

export default function EchoVisionCanvas({
  onSelectComponent,
  selectedComponentId,
  scenario = 'healthy',
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Active 3D Mode
  const [viewMode, setViewMode] = useState<ViewMode3D>('hardware');

  // Hardware State
  const [components, setComponents] = useState<PrototypeComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExploded, setIsExploded] = useState(false);
  const [selectedComp, setSelectedComp] = useState<PrototypeComponent | null>(null);
  const [totalBom, setTotalBom] = useState<number>(5250000);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [jsonCopied, setJsonCopied] = useState<boolean>(false);

  // Coral Reef 3D State
  const [selectedCoralId, setSelectedCoralId] = useState<string | null>('acropora-millepora');

  // Island 12 Buoys State
  const [selectedStationId, setSelectedStationId] = useState<string>('ASIK-01');

  // Simulation State
  const [simScenario, setSimScenario] = useState<'normal' | 'thermal' | 'turbidity' | 'recovery'>('normal');

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupMapRef = useRef<{ [key: number]: THREE.Group }>({});
  const compMapRef = useRef<{ [key: number]: PrototypeComponent }>({});
  const fishGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const cameraAngleRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 3, radius: 3.5 });

  // Load Hardware JSON Data
  useEffect(() => {
    fetch('/data/echovision_prototype_3d.json')
      .then((res) => res.json())
      .then((data) => {
        setComponents(data.components || []);
        if (data.total_bom_rp) setTotalBom(data.total_bom_rp);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load 3d hardware json:', err);
        setLoading(false);
      });
  }, []);

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { theta, phi, radius } = cameraAngleRef.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(0, -0.1, 0);
  };

  // Build Scene based on active viewMode
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    if (width === 0 || height === 0) return;

    // 1. Scene & Renderer setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    cameraRef.current = camera;
    cameraAngleRef.current = {
      theta: viewMode === 'island_3d' ? Math.PI / 3 : Math.PI / 4,
      phi: viewMode === 'island_3d' ? Math.PI / 3.5 : Math.PI / 2.8,
      radius: viewMode === 'island_3d' ? 12.0 : viewMode === 'coral_reef' ? 4.2 : 3.4,
    };
    updateCameraPosition();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lighting & Environment
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0b3f56, 1.1);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(6, 12, 6);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0x0e7490, 0.6);
    scene.add(ambientLight);

    // MODE 1: ECHOVISION HARDWARE PROTOTYPE
    if (viewMode === 'hardware' && components.length > 0) {
      // Water column & Seabed
      const waterMat = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const waterSurface = new THREE.Mesh(new THREE.CircleGeometry(1.6, 48), waterMat);
      waterSurface.rotation.x = -Math.PI / 2;
      scene.add(waterSurface);

      const waterCol = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.6, 1.8, 48, 1, true),
        new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.14, side: THREE.DoubleSide })
      );
      waterCol.position.y = -0.9;
      scene.add(waterCol);

      const bed = new THREE.Mesh(
        new THREE.CircleGeometry(1.6, 48),
        new THREE.MeshStandardMaterial({ color: 0xc4b595, roughness: 1 })
      );
      bed.rotation.x = -Math.PI / 2;
      bed.position.y = -1.8;
      scene.add(bed);

      // Build 16 hardware components
      groupMapRef.current = {};
      compMapRef.current = {};

      const solarTex = (() => {
        const c = document.createElement('canvas');
        c.width = c.height = 128;
        const ctx = c.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#1b3a78';
          ctx.fillRect(0, 0, 128, 128);
          ctx.strokeStyle = '#8fb0e8';
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
        return new THREE.CanvasTexture(c);
      })();

      components.forEach((comp) => {
        const compGroup = new THREE.Group();
        compGroup.userData = {
          id: comp.id,
          explode: comp.explode || [0, 0, 0],
        };
        groupMapRef.current[comp.id] = compGroup;
        compMapRef.current[comp.id] = comp;

        comp.parts.forEach((p: any) => {
          let geo: THREE.BufferGeometry;
          const s = p.size || [0.1, 0.1, 0.1];
          if (p.type === 'cylinder') geo = new THREE.CylinderGeometry(s[0], s[0], s[1], 24);
          else if (p.type === 'box') geo = new THREE.BoxGeometry(...s);
          else if (p.type === 'sphere') geo = new THREE.SphereGeometry(s[0], 24, 16);
          else if (p.type === 'torus') geo = new THREE.TorusGeometry(s[0], s[1], 10, 32);
          else if (p.type === 'tube' && p.points) {
            const pts = p.points.map((pt: any) => new THREE.Vector3(...pt));
            geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, s[0], 6);
          } else if (p.from && p.to) {
            const A = new THREE.Vector3(...p.from);
            const B = new THREE.Vector3(...p.to);
            geo = new THREE.CylinderGeometry(s[0], s[0], A.distanceTo(B), 8);
          } else {
            geo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
          }

          const op = p.opacity == null ? 1 : p.opacity;
          const mat = new THREE.MeshStandardMaterial({
            color: p.texture ? 0xffffff : p.color || 0x8d969b,
            map: p.texture ? solarTex : null,
            roughness: 0.45,
            metalness: p.metal || 0.1,
            transparent: op < 1,
            opacity: op,
            depthWrite: op >= 1,
          });

          const mesh = new THREE.Mesh(geo, mat);
          if (p.type === 'rod' && p.from && p.to) {
            const A = new THREE.Vector3(p.from[0], p.from[1], p.from[2]);
            const B = new THREE.Vector3(p.to[0], p.to[1], p.to[2]);
            mesh.position.copy(A).add(B).multiplyScalar(0.5);
            mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.sub(A).normalize());
          } else if (p.pos) {
            mesh.position.set(p.pos[0], p.pos[1], p.pos[2]);
            if (p.rot) {
              mesh.rotation.set(
                (p.rot[0] * Math.PI) / 180,
                (p.rot[1] * Math.PI) / 180,
                (p.rot[2] * Math.PI) / 180
              );
            }
          }
          if (p.edges) {
            mesh.add(
              new THREE.LineSegments(
                new THREE.EdgesGeometry(geo),
                new THREE.LineBasicMaterial({ color: 0x38bdf8 })
              )
            );
          }
          mesh.userData = { id: comp.id };
          compGroup.add(mesh);
        });

        scene.add(compGroup);
      });
    }

    // MODE 2: CORAL REEF ECOSYSTEM 3D
    if (viewMode === 'coral_reef') {
      // Sandy seabed with natural bathymetric slope
      const bedGeo = new THREE.PlaneGeometry(16, 16, 32, 32);
      bedGeo.rotateX(-Math.PI / 2);
      const bedMat = new THREE.MeshStandardMaterial({
        color: 0xcdb88c,
        roughness: 0.95,
      });
      const seabed = new THREE.Mesh(bedGeo, bedMat);
      seabed.position.y = -0.6;
      scene.add(seabed);

      // Render the 8 coral species arranged in an organic reef cluster
      CORAL_SPECIES_3D.forEach((coralSpec, idx) => {
        const coralGeo = coralSpec.generate();
        const coralMat = new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.75,
          metalness: 0.05,
        });
        const coralMesh = new THREE.Mesh(coralGeo, coralMat);
        const angle = (idx / CORAL_SPECIES_3D.length) * Math.PI * 2;
        const radius = 1.35;
        coralMesh.position.set(Math.cos(angle) * radius, -0.6, Math.sin(angle) * radius);
        coralMesh.scale.setScalar(0.85);
        coralMesh.userData = { coralId: coralSpec.id, name: coralSpec.name };
        scene.add(coralMesh);
      });

      // School of swimming reef fishes
      const fishGroup = createSchoolOfFish(16);
      fishGroup.position.y = 0.2;
      fishGroupRef.current = fishGroup;
      scene.add(fishGroup);

      // Macrobenthos (Linckia Star & Urchin)
      const benthos = createMacrobenthos();
      benthos.position.y = -0.58;
      scene.add(benthos);
    }

    // MODE 3: 12 TITIK ASIK PULAU TUNDA 3D
    if (viewMode === 'island_3d') {
      // 3D Ocean Surface
      const ocean = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshStandardMaterial({ color: 0x1e7ba8, roughness: 0.4 })
      );
      ocean.rotation.x = -Math.PI / 2;
      ocean.position.y = -0.1;
      scene.add(ocean);

      // Procedural Island Shape (Pulau Tunda central landmass)
      const islandShape = new THREE.Shape();
      const points = [
        [-3.2, 0.4],
        [-2.4, 0.9],
        [-1.2, 1.3],
        [0.4, 1.4],
        [1.8, 1.1],
        [2.9, 0.6],
        [3.3, -0.2],
        [2.6, -1.0],
        [1.2, -1.3],
        [-0.6, -1.4],
        [-2.2, -1.1],
        [-3.1, -0.4],
      ];
      islandShape.moveTo(points[0][0], points[0][1]);
      points.slice(1).forEach((pt) => islandShape.lineTo(pt[0], pt[1]));

      const islandGeo = new THREE.ExtrudeGeometry(islandShape, { depth: 0.45, bevelEnabled: false });
      islandGeo.rotateX(-Math.PI / 2);
      const islandMat = new THREE.MeshStandardMaterial({ color: 0x4f8a48, roughness: 0.8 });
      const islandMesh = new THREE.Mesh(islandGeo, islandMat);
      islandMesh.position.y = 0;
      scene.add(islandMesh);

      // 12 Buoy Deployment Stations in a ring around the island (simulating the 12 ASIK points)
      for (let i = 1; i <= 12; i++) {
        const code = `ASIK-${String(i).padStart(2, '0')}`;
        const angle = ((i - 1) / 12) * Math.PI * 2;
        const radius = 4.2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const buoyGroup = new THREE.Group();
        buoyGroup.position.set(x, 0, z);

        // Yellow floating buoy
        const buoy = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.18, 0.28, 16),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 })
        );
        buoy.position.y = 0.14;
        buoyGroup.add(buoy);

        // Antenna mast
        const mast = new THREE.Mesh(
          new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8),
          new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        mast.position.y = 0.45;
        buoyGroup.add(mast);

        // Beacon light
        const beacon = new THREE.Mesh(
          new THREE.SphereGeometry(0.04, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        beacon.position.y = 0.72;
        buoyGroup.add(beacon);

        // Mooring line to seabed
        const mooring = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.008, 1.8, 6),
          new THREE.MeshBasicMaterial({ color: 0x94a3b8 })
        );
        mooring.position.y = -0.9;
        buoyGroup.add(mooring);

        buoyGroup.userData = { stationCode: code, index: i };
        scene.add(buoyGroup);
      }
    }

    // MODE 4: ECOLOGICAL SIMULATION
    if (viewMode === 'simulation') {
      // Water body
      const waterColor =
        simScenario === 'thermal'
          ? 0xef4444
          : simScenario === 'turbidity'
          ? 0xb45309
          : 0x0ea5e9;
      const ocean = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 16),
        new THREE.MeshBasicMaterial({ color: waterColor, transparent: true, opacity: 0.25, side: THREE.DoubleSide })
      );
      ocean.rotation.x = -Math.PI / 2;
      scene.add(ocean);

      // Central Smart Buoy
      const buoy = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.4, 24),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 })
      );
      buoy.position.y = 0.2;
      scene.add(buoy);

      // Acoustic Cone Scanning
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(2.2, 2.8, 32, 1, true),
        new THREE.MeshBasicMaterial({
          color: simScenario === 'thermal' ? 0xf43f5e : 0x10b981,
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      cone.position.y = -1.4;
      scene.add(cone);

      // Coral seabed response
      const bed = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 16),
        new THREE.MeshStandardMaterial({
          color: simScenario === 'thermal' ? 0xfef08a : 0x047857,
          roughness: 0.9,
        })
      );
      bed.rotation.x = -Math.PI / 2;
      bed.position.y = -2.8;
      scene.add(bed);
    }

    // 3. Animation Loop
    let animId: number;
    let prev = performance.now();
    const ZERO = new THREE.Vector3(0, 0, 0);

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min((now - prev) / 1000, 0.1);
      prev = now;

      // Hardware explode lerp
      if (viewMode === 'hardware') {
        const k = 1 - Math.exp(-dt * 4.5);
        for (const id in groupMapRef.current) {
          const g = groupMapRef.current[id];
          const target = isExploded ? new THREE.Vector3(...(g.userData.explode || [0, 0, 0])) : ZERO;
          g.position.lerp(target, k);
        }
      }

      // Fish swimming rotation
      if (viewMode === 'coral_reef' && fishGroupRef.current) {
        fishGroupRef.current.children.forEach((f) => {
          f.userData.angle += f.userData.speed * dt * 0.4;
          const a = f.userData.angle;
          const r = f.userData.radius;
          f.position.x = Math.cos(a) * r;
          f.position.z = Math.sin(a) * r;
          f.position.y = f.userData.baseY + Math.sin(now * 0.003 + f.userData.radius) * 0.06;
          f.rotation.y = -a + Math.PI / 2;
        });
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // 4. Pointer controls (Orbit & Touch)
    const dom = mountRef.current;
    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMousePosRef.current.x;
      const dy = e.clientY - prevMousePosRef.current.y;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };

      cameraAngleRef.current.theta -= dx * 0.006;
      cameraAngleRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2.05, cameraAngleRef.current.phi - dy * 0.005)
      );
      updateCameraPosition();
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.003;
      cameraAngleRef.current.radius = Math.max(
        1.2,
        Math.min(25.0, cameraAngleRef.current.radius + zoomFactor)
      );
      updateCameraPosition();
    };

    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    const resizeObserver = new ResizeObserver(() => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      if (w === 0 || h === 0) return;
      rendererRef.current.setSize(w, h);
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
    });
    resizeObserver.observe(dom);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [viewMode, components, isExploded, simScenario]);

  const handleSelectHardwareComp = (comp: PrototypeComponent) => {
    setSelectedComp(comp);
    onSelectComponent?.(comp);
    // Focus camera
    cameraAngleRef.current.radius = 2.4;
    updateCameraPosition();
  };

  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify({ components, total_bom_rp: totalBom }, null, 2));
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  };

  const activeCoral = CORAL_SPECIES_3D.find((c) => c.id === selectedCoralId) || CORAL_SPECIES_3D[0];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#061e2d] via-[#09293b] to-[#041520] border border-cyan-500/30 shadow-2xl">
      {/* Top Multi-Mode 3D Tab Switcher */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-auto z-20 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 shadow-xl text-xs font-bold text-white">
          <button
            type="button"
            onClick={() => setViewMode('hardware')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              viewMode === 'hardware'
                ? 'bg-orange-500 text-white shadow-sm ring-1 ring-orange-400'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <DollarSign size={13} className="text-white" />
            <span>EchoVision 3D Hardware</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('coral_reef')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              viewMode === 'coral_reef'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-sm ring-1 ring-cyan-400'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sparkles size={13} />
            <span>Coral Reef Explorer (3D)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('island_3d')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              viewMode === 'island_3d'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Compass size={13} />
            <span>12 Titik ASIK (3D)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('simulation')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              viewMode === 'simulation'
                ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Activity size={13} />
            <span>Simulasi Kondisi</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-[480px] sm:h-[580px] lg:h-[660px] cursor-grab active:cursor-grabbing block"
      />

      {/* Bottom Floating Controls based on active mode */}
      {viewMode === 'hardware' && (
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsExploded(!isExploded)}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 ${
                isExploded
                  ? 'bg-orange-500 text-white ring-2 ring-orange-300'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Layers size={14} />
              <span>{isExploded ? 'Gabungkan Komponen' : 'Mode Terurai (Exploded)'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                cameraAngleRef.current = { theta: Math.PI / 4, phi: Math.PI / 2.8, radius: 3.4 };
                updateCameraPosition();
              }}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={14} />
              <span>Reset Tampilan</span>
            </button>

            <button
              type="button"
              onClick={() => setShowJsonModal(true)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileCode size={14} />
              <span>Lihat JSON Model</span>
            </button>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-xs text-white shadow-lg pointer-events-auto flex items-center gap-3">
            <span className="text-slate-400 font-semibold">Total BOM (16 Komponen):</span>
            <span className="text-base font-black text-cyan-300 font-mono">
              Rp {totalBom.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      )}

      {/* Coral Species Selection & Pinned Profile Drawer in Mode 2 */}
      {viewMode === 'coral_reef' && (
        <>
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center gap-2 max-w-full overflow-x-auto pb-1">
            {CORAL_SPECIES_3D.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCoralId(c.id)}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-md ${
                  selectedCoralId === c.id
                    ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300'
                    : 'bg-slate-900/90 text-slate-300 border border-slate-700 hover:bg-slate-800'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {activeCoral && (
            <div className="absolute top-20 right-4 z-20 w-[min(22rem,calc(100%-2rem))] p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 text-xs text-white shadow-2xl space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h4 className="text-sm font-black text-cyan-300 italic">{activeCoral.name}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold">{activeCoral.form}</span>
                </div>
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: '#' + activeCoral.colorHex.toString(16) }} />
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status Lokal:</span>
                  <span className="font-bold text-slate-200">{activeCoral.tundaStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Suhu Optimal:</span>
                  <span className="font-bold text-amber-300 font-mono">{activeCoral.tempRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kedalaman:</span>
                  <span className="font-bold text-cyan-300 font-mono">{activeCoral.depthRange}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Mode 4: Ecological Condition Scenario Buttons */}
      {viewMode === 'simulation' && (
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'normal', label: 'Kondisi Normal (Sehat)', col: 'bg-emerald-600' },
              { id: 'thermal', label: 'Thermal Stress (+1.8°C)', col: 'bg-rose-600' },
              { id: 'turbidity', label: 'High Turbidity (>10 NTU)', col: 'bg-amber-600' },
              { id: 'recovery', label: 'Pemulihan Pasca-Stress', col: 'bg-cyan-600' },
            ].map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => setSimScenario(sc.id as any)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  simScenario === sc.id
                    ? `${sc.col} text-white ring-2 ring-white`
                    : 'bg-slate-900/90 text-slate-300 border border-slate-700 hover:bg-slate-800'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* JSON Viewer Modal for Hardware Model */}
      {showJsonModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Model 3D dalam JSON"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowJsonModal(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[85dvh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Model 3D dalam Format JSON</h3>
                <p className="text-xs text-slate-400">
                  Data geometri procedural EchoVision Prototype (echovision_prototype_3d.json).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <textarea
              readOnly
              value={JSON.stringify({ components, total_bom_rp: totalBom }, null, 2)}
              className="w-full h-80 rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-cyan-300 focus:outline-none resize-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={copyJsonToClipboard}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-2"
              >
                <span>{jsonCopied ? 'Tersalin ke Clipboard!' : 'Salin JSON'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
