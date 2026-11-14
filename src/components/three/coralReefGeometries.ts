import * as THREE from 'three';

// Procedural helpers
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const V3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const mulb = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const nz = (x: number, y: number, z: number) =>
  Math.sin(x * 3.1 + 1.3) * Math.sin(y * 2.7 + 0.4) * Math.sin(z * 3.3 + 2.1);

const jc = (c: number[], r: () => number, a = 0.06): [number, number, number] => [
  clamp(c[0] + (r() - 0.5) * a, 0, 1),
  clamp(c[1] + (r() - 0.5) * a, 0, 1),
  clamp(c[2] + (r() - 0.5) * a, 0, 1),
];

const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

const UPV = V3(0, 1, 0);

type GeometryItem = [
  THREE.BufferGeometry,
  THREE.Matrix4,
  [number, number, number] | ((x: number, y: number, z: number) => [number, number, number])
];

function mrg(items: GeometryItem[]): THREE.BufferGeometry {
  const pos: number[] = [];
  const col: number[] = [];
  for (const [g0, m, c] of items) {
    const g = g0.index ? g0.toNonIndexed() : g0.clone();
    g.applyMatrix4(m);
    const p = g.attributes.position;
    const ca = g.attributes.color;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const y = p.getY(i);
      const z = p.getZ(i);
      pos.push(x, y, z);
      if (ca) {
        col.push(ca.getX(i), ca.getY(i), ca.getZ(i));
      } else {
        const cc = typeof c === 'function' ? c(x, y, z) : c;
        col.push(cc[0], cc[1], cc[2]);
      }
    }
  }
  const G = new THREE.BufferGeometry();
  G.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  G.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  G.computeVertexNormals();
  return G;
}

function seg(
  it: GeometryItem[],
  a: THREE.Vector3,
  b: THREE.Vector3,
  r0: number,
  r1: number,
  c: [number, number, number] | ((x: number, y: number, z: number) => [number, number, number]),
  rs = 6
) {
  const d = b.clone().sub(a);
  const L = d.length();
  if (L < 1e-4) return;
  const qq = new THREE.Quaternion().setFromUnitVectors(UPV, d.clone().normalize());
  const mat = new THREE.Matrix4().compose(
    a.clone().add(b).multiplyScalar(0.5),
    qq,
    V3(1, 1, 1)
  );
  it.push([new THREE.CylinderGeometry(r1, r0, L, rs, 1), mat, c]);
}

function brn(
  it: GeometryItem[],
  p: THREE.Vector3,
  d: THREE.Vector3,
  L: number,
  r: number,
  dep: number,
  rnd: () => number,
  pal: (dep: number, q: () => number) => [number, number, number],
  o: { n: number; pn: number; sp: number; up: number; sh: number; tp: number; vr?: number }
) {
  const e = p.clone().addScaledVector(d, L);
  seg(it, p, e, r, Math.max(r * o.tp, 0.006), pal(dep, rnd), 7);
  if (dep > 0) {
    const n = o.n + (rnd() < o.pn ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const nd = d
        .clone()
        .add(
          V3(
            (rnd() - 0.5) * o.sp,
            (rnd() - 0.3) * o.sp * 0.4 + o.up,
            (rnd() - 0.5) * o.sp
          )
        )
        .normalize();
      brn(
        it,
        e,
        nd,
        L * (o.sh + rnd() * 0.2),
        r * o.tp,
        dep - 1,
        rnd,
        pal,
        o
      );
    }
  }
}

function blob(
  rnd: () => number,
  o: {
    amp: number;
    hf: number;
    sy: number;
    col: [[number, number, number], [number, number, number]];
    ws?: number;
    hs?: number;
    lump?: number;
    edge?: number;
    hex?: [number, number];
  }
): THREE.BufferGeometry {
  const g = new THREE.SphereGeometry(1, o.ws || 24, o.hs || 16);
  const p = g.attributes.position;
  const c: number[] = [];
  const k = rnd() * 10;
  const b1 = o.col[0];
  const b2 = o.col[1];
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i);
    let y = p.getY(i);
    let z = p.getZ(i);
    const a = Math.atan2(z, x);
    const y0 = y;
    let hv = 0;
    let n =
      1 +
      o.amp * nz(x * 2.2 + k, y * 2.2, z * 2.2) +
      o.hf * Math.sin(x * 15 + k) * Math.sin(y * 13) * Math.sin(z * 15) +
      (o.lump
        ? o.lump * Math.max(0, Math.sin(x * 5 + k) * Math.sin(z * 5) * Math.sin(y * 4 + 1))
        : 0);
    if (o.edge) n *= 1 + o.edge * Math.sin(3 * a + k) + o.edge * 0.5 * Math.sin(7 * a + k * 2);
    if (o.hex && y0 > 0.05) {
      const q = o.hex[0];
      hv = (Math.cos(q * x) + Math.cos(q * (-0.5 * x + 0.866 * z)) + Math.cos(q * (-0.5 * x - 0.866 * z))) / 3;
      n *= 1 - o.hex[1] * Math.max(-0.3, hv);
    }
    x *= n;
    z *= n;
    y *= n * o.sy;
    if (y < 0) y *= 0.2;
    p.setXYZ(i, x, y, z);
    const m = clamp(0.5 + 0.5 * nz(x * 4 + k, y * 4, z * 4), 0, 1);
    for (let j = 0; j < 3; j++) {
      c.push(clamp(b1[j] + (b2[j] - b1[j]) * m + (rnd() - 0.5) * 0.03, 0, 1));
    }
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3));
  g.computeVertexNormals();
  return g;
}

// 8 Pulau Tunda Coral Species Procedural Generators
export const CORAL_SPECIES_3D = [
  {
    id: 'acropora-millepora',
    name: 'Acropora millepora',
    form: 'Branching (Corymbose)',
    tundaStatus: 'Umum di Terumbu Karang Pulau Tunda',
    tempRange: '26.0°C – 29.0°C',
    depthRange: '3 – 12 m',
    colorHex: 0x58c49e,
    generate: () => {
      const r = mulb(42);
      const it: GeometryItem[] = [];
      for (let k = 0; k < 18; k++) {
        const a = r() * 6.28;
        const d = Math.sqrt(r()) * 0.32;
        brn(
          it,
          V3(Math.cos(a) * d, 0, Math.sin(a) * d),
          V3(Math.cos(a) * 0.35, 1, Math.sin(a) * 0.35).normalize(),
          0.18,
          0.032,
          2,
          r,
          (dp, q) => jc(dp ? [0.45, 0.65, 0.52] : [0.35, 0.77, 0.62], q, 0.05),
          { n: 2, pn: 0.45, sp: 1.1, up: 0.45, sh: 0.8, tp: 0.7 }
        );
      }
      return mrg(it);
    },
  },
  {
    id: 'acropora-nobilis',
    name: 'Acropora nobilis',
    form: 'Branching (Staghorn)',
    tundaStatus: 'Dominan di Lereng Terumbu (Reef Slope)',
    tempRange: '26.0°C – 29.5°C',
    depthRange: '4 – 18 m',
    colorHex: 0xd4a373,
    generate: () => {
      const r = mulb(88);
      const it: GeometryItem[] = [];
      for (let k = 0; k < 5; k++) {
        const a = k * 1.25 + r() * 0.4;
        brn(
          it,
          V3(Math.cos(a) * 0.1, 0, Math.sin(a) * 0.1),
          V3(Math.cos(a) * 0.45, 1, Math.sin(a) * 0.45).normalize(),
          0.52,
          0.052,
          2,
          r,
          (dp, q) => jc(dp ? [0.66, 0.52, 0.38] : [0.82, 0.75, 0.62], q, 0.05),
          { n: 2, pn: 0.35, sp: 0.55, up: 0.4, sh: 0.75, tp: 0.72 }
        );
      }
      return mrg(it);
    },
  },
  {
    id: 'isopora-palifera',
    name: 'Isopora palifera',
    form: 'Digitate / Submassive',
    tundaStatus: 'Tahan Arus Kuat di Punggung Karang (Reef Crest)',
    tempRange: '26.5°C – 29.8°C',
    depthRange: '2 – 10 m',
    colorHex: 0xb5a886,
    generate: () => {
      const r = mulb(105);
      const it: GeometryItem[] = [
        [blob(r, { amp: 0.1, hf: 0.03, sy: 0.22, col: [[0.6, 0.55, 0.42], [0.5, 0.5, 0.38]] }), new THREE.Matrix4().makeScale(0.9, 0.9, 0.9), [0.6, 0.55, 0.42]],
      ];
      for (let k = 0; k < 20; k++) {
        const a = r() * 6.28;
        const d = Math.sqrt(r()) * 0.7;
        const y = 0.2 * Math.sqrt(Math.max(0, 1 - d * d));
        const b = V3(Math.cos(a) * d, y * 0.9, Math.sin(a) * d);
        const e = b.clone().add(V3(Math.cos(a) * 0.05 * r(), 0.15 + r() * 0.12, Math.sin(a) * 0.05));
        seg(it, b, e, 0.06, 0.052, jc([0.7, 0.64, 0.46], r, 0.06), 7);
      }
      return mrg(it);
    },
  },
  {
    id: 'montipora-capricornis',
    name: 'Montipora capricornis',
    form: 'Foliose (Plating / Lembaran)',
    tundaStatus: 'Membentuk Kanopi Bertingkat di Kedalaman Sedang',
    tempRange: '25.5°C – 28.5°C',
    depthRange: '5 – 20 m',
    colorHex: 0x8b5cf6,
    generate: () => {
      const r = mulb(210);
      const it: GeometryItem[] = [];
      for (let layer = 0; layer < 4; layer++) {
        const g = new THREE.CylinderGeometry(0.55 + layer * 0.12, 0.3 + layer * 0.08, 0.04, 24, 1, true);
        const m = new THREE.Matrix4().makeTranslation(0, 0.08 * layer, 0);
        it.push([g, m, jc([0.55, 0.4, 0.75], r, 0.05)]);
      }
      return mrg(it);
    },
  },
  {
    id: 'favites-sp',
    name: 'Favites sp.',
    form: 'Massive (Karang Otak)',
    tundaStatus: 'Koloni Kubah Padat & Tahan Fluktuasi Sedimentasi',
    tempRange: '26.0°C – 30.0°C',
    depthRange: '2 – 22 m',
    colorHex: 0xec4899,
    generate: () => {
      const r = mulb(314);
      return blob(r, {
        amp: 0.18,
        hf: 0.06,
        sy: 0.75,
        hex: [16, 0.35],
        col: [[0.78, 0.42, 0.55], [0.65, 0.32, 0.45]],
        ws: 28,
        hs: 18,
      });
    },
  },
  {
    id: 'goniastrea-sp',
    name: 'Goniastrea sp.',
    form: 'Submassive / Honeycomb',
    tundaStatus: 'Takson Dominan dalam Riset Terumbu Karang Pulau Tunda',
    tempRange: '26.0°C – 29.5°C',
    depthRange: '2 – 18 m',
    colorHex: 0x14b8a6,
    generate: () => {
      const r = mulb(512);
      return blob(r, {
        amp: 0.12,
        hf: 0.04,
        sy: 0.65,
        hex: [14, 0.3],
        col: [[0.2, 0.68, 0.62], [0.15, 0.52, 0.48]],
        ws: 28,
        hs: 18,
      });
    },
  },
  {
    id: 'fungia-sp',
    name: 'Fungia sp.',
    form: 'Solitary (Karang Jamur)',
    tundaStatus: 'Koloni Tunggal Bebas Bergerak di Rataan Pasir/Terumbu',
    tempRange: '26.0°C – 29.0°C',
    depthRange: '3 – 16 m',
    colorHex: 0xf59e0b,
    generate: () => {
      const g = new THREE.CylinderGeometry(0.45, 0.38, 0.07, 32);
      const pos = g.attributes.position;
      const c: number[] = [];
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const d = Math.hypot(x, z);
        pos.setY(i, pos.getY(i) + (0.45 - d) * 0.12);
        c.push(0.85, 0.65, 0.25);
      }
      g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3));
      g.computeVertexNormals();
      return g;
    },
  },
  {
    id: 'pocillopora-nigrescens',
    name: 'Pocillopora nigrescens',
    form: 'Caespitose Bush',
    tundaStatus: 'Habitat Utama Asosiasi Ikan Damselfish (Chromis viridis)',
    tempRange: '27.0°C – 29.5°C',
    depthRange: '2 – 14 m',
    colorHex: 0x38bdf8,
    generate: () => {
      const r = mulb(777);
      const it: GeometryItem[] = [];
      for (let k = 0; k < 14; k++) {
        const a = r() * 6.28;
        const d = Math.sqrt(r()) * 0.28;
        brn(
          it,
          V3(Math.cos(a) * d, 0, Math.sin(a) * d),
          V3(Math.cos(a) * 0.25, 1, Math.sin(a) * 0.25).normalize(),
          0.16,
          0.03,
          2,
          r,
          (dp, q) => jc(dp ? [0.35, 0.58, 0.78] : [0.55, 0.78, 0.95], q, 0.05),
          { n: 2, pn: 0.5, sp: 0.9, up: 0.5, sh: 0.78, tp: 0.7 }
        );
      }
      return mrg(it);
    },
  },
];

// Procedural Reef Fishes Generator
export function createSchoolOfFish(count = 14): THREE.Group {
  const group = new THREE.Group();
  const fishColors = [0x06b6d4, 0xf59e0b, 0xec4899, 0x10b981];

  for (let i = 0; i < count; i++) {
    const fish = new THREE.Group();
    const col = fishColors[i % fishColors.length];
    const bodyMat = new THREE.MeshStandardMaterial({
      color: col,
      roughness: 0.4,
      metalness: 0.2,
    });

    // Body
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.16, 6), bodyMat);
    body.rotation.z = Math.PI / 2;
    fish.add(body);

    // Tail fin
    const tail = new THREE.Mesh(
      new THREE.BoxGeometry(0.01, 0.08, 0.04),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
    );
    tail.position.x = -0.09;
    fish.add(tail);

    const radius = 1.4 + (i % 5) * 0.35;
    const angle = (i / count) * Math.PI * 2;
    fish.position.set(Math.cos(angle) * radius, 0.2 + (i % 4) * 0.18, Math.sin(angle) * radius);
    fish.rotation.y = -angle + Math.PI / 2;
    fish.userData = { radius, angle, speed: 0.6 + (i % 3) * 0.25, baseY: fish.position.y };

    group.add(fish);
  }

  return group;
}

// Procedural Macrobenthos (Linckia Blue Sea Star & Urchin)
export function createMacrobenthos(): THREE.Group {
  const group = new THREE.Group();

  // Linckia laevigata (Blue Sea Star)
  const star = new THREE.Group();
  const blueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.6 });
  for (let arm = 0; arm < 5; arm++) {
    const a = (arm * Math.PI * 2) / 5;
    const armMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.025, 0.14, 6), blueMat);
    armMesh.position.set(Math.cos(a) * 0.07, 0.01, Math.sin(a) * 0.07);
    armMesh.quaternion.setFromUnitVectors(UPV, V3(Math.cos(a), 0, Math.sin(a)));
    star.add(armMesh);
  }
  star.add(new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), blueMat));
  star.position.set(0.65, 0.01, 0.45);
  group.add(star);

  // Diadema setosum (Sea Urchin with spines)
  const urchin = new THREE.Group();
  const urchinMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
  urchin.add(new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), urchinMat));
  for (let s = 0; s < 28; s++) {
    const u = Math.random() * 2 - 1;
    const a = Math.random() * Math.PI * 2;
    const rad = Math.sqrt(1 - u * u);
    const dir = V3(rad * Math.cos(a), Math.abs(u) * 0.8 + 0.2, rad * Math.sin(a)).normalize();
    const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.005, 0.18, 4), urchinMat);
    spine.position.copy(dir.clone().multiplyScalar(0.08));
    spine.quaternion.setFromUnitVectors(UPV, dir);
    urchin.add(spine);
  }
  urchin.position.set(-0.7, 0.02, -0.4);
  group.add(urchin);

  return group;
}
