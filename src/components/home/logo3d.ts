// The full Itqan logo as instanced voxels, sampled from the official logo file.
// Port of design_handoff_itqan_website/site/shared/itqan-logo3d.js and
// logo-voxels.js (README › 3D logo); behaviour and constants are unchanged.
// Loaded with a dynamic import, so three.js is only fetched on pages that use it.
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  Color,
  DirectionalLight,
  DynamicDrawUsage,
  Euler,
  Group,
  HemisphereLight,
  InstancedMesh,
  MathUtils,
  Matrix4,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Quaternion,
  SRGBColorSpace,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

type BrandColour = "lime" | "plum" | "sky";
type Grid = { cols: number; rows: number; cells: { i: number; j: number; c: BrandColour }[] };

const RGB: Record<BrandColour, [number, number, number]> = { lime: [188, 209, 85], plum: [82, 39, 111], sky: [30, 169, 224] };
const KEYS = Object.keys(RGB) as BrandColour[];

/**
 * Coverage sampling: render at 4× and fill a voxel when ≥18% of its area is
 * ink, so thin strokes ("Fueling wellness") survive; snap to the brand colours.
 */
export function sampleLogo(img: HTMLImageElement, cols: number): Grid {
  const S = 4;
  const rows = Math.round((cols * img.naturalHeight) / img.naturalWidth);
  const W = cols * S;
  const H = rows * S;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { cols, rows, cells: [] };
  ctx.drawImage(img, 0, 0, W, H);
  const d = ctx.getImageData(0, 0, W, H).data;
  const cells: Grid["cells"] = [];
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      let n = 0, r = 0, g = 0, b = 0;
      for (let v = 0; v < S; v++)
        for (let u = 0; u < S; u++) {
          const k = ((j * S + v) * W + (i * S + u)) * 4;
          if ((d[k + 3] ?? 0) > 90) {
            n++;
            r += d[k] ?? 0;
            g += d[k + 1] ?? 0;
            b += d[k + 2] ?? 0;
          }
        }
      if (n < S * S * 0.18) continue;
      r /= n;
      g /= n;
      b /= n;
      let best: BrandColour = "plum";
      let bestDist = Infinity;
      for (const key of KEYS) {
        const [pr, pg, pb] = RGB[key];
        const dist = (pr - r) ** 2 + (pg - g) ** 2 + (pb - b) ** 2;
        if (dist < bestDist) {
          bestDist = dist;
          best = key;
        }
      }
      cells.push({ i, j, c: best });
    }
  return { cols, rows, cells };
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export type Logo3DOptions = {
  /** "scene": driven by scroll through `sceneEl`. "inview": assembles when visible, follows the pointer. */
  mode: "scene" | "inview";
  sceneEl?: HTMLElement | null;
  logoSrc: string;
};

/** Mounts the voxel logo into `host` (absolutely positioned, fills it). Returns a disposer. */
export async function mountLogo3D(host: HTMLElement, { mode, sceneEl, logoSrc }: Logo3DOptions): Promise<() => void> {
  const img = new Image();
  img.src = logoSrc;
  await img.decode();

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(pointer: coarse)").matches;
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ antialias: !touch, alpha: true, powerPreference: "high-performance" });
  } catch {
    return () => {}; // No WebGL: the hero simply shows its text.
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, touch ? 1.5 : 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const canvas = renderer.domElement;
  Object.assign(canvas.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
  canvas.setAttribute("aria-hidden", "true");
  host.append(canvas);

  const scene = new Scene();
  const cam = new PerspectiveCamera(32, 1, 0.05, 50);
  cam.position.set(0, 0, 3.2);
  scene.add(new HemisphereLight(0xffffff, 0x30203a, 1.45));
  const key = new DirectionalLight(0xffffff, 2.3);
  key.position.set(1.5, 2, 3);
  scene.add(key);
  const rimSky = new PointLight(0x1ea9e0, 9, 7);
  rimSky.position.set(2.2, 0.4, -1);
  scene.add(rimSky);
  const rimLime = new PointLight(0xbcd155, 7, 7);
  rimLime.position.set(-2.2, 1, -1);
  scene.add(rimLime);

  const cols = innerWidth < 700 ? 110 : 150;
  const grid = sampleLogo(img, cols);
  const N = grid.cells.length;
  const W = 1.6;
  const s = W / cols;
  const H = grid.rows * s;
  const geometry = new BoxGeometry(s * 0.86, s * 0.86, s * 2.6);
  const material = new MeshStandardMaterial({ roughness: 0.36, metalness: 0.08 });
  const mesh = new InstancedMesh(geometry, material, N);
  mesh.instanceMatrix.setUsage(DynamicDrawUsage);
  const group = new Group();
  group.add(mesh);
  scene.add(group);

  const home = new Float32Array(N * 3);
  const scatter = new Float32Array(N * 3);
  const rnd = new Float32Array(N);
  grid.cells.forEach((q, n) => {
    home[n * 3] = (q.i + 0.5) * s - W / 2;
    home[n * 3 + 1] = H / 2 - (q.j + 0.5) * s;
    const a = Math.random() * 6.283;
    const b = Math.acos(2 * Math.random() - 1);
    const R = 1.4 + Math.random() * 2;
    scatter[n * 3] = Math.sin(b) * Math.cos(a) * R;
    scatter[n * 3 + 1] = Math.sin(b) * Math.sin(a) * R;
    scatter[n * 3 + 2] = Math.cos(b) * R;
    rnd[n] = Math.random();
  });

  // Plum voxels read as bone on the dark theme and plum on the light theme.
  const colour = () => {
    const dark = document.documentElement.dataset.theme !== "light";
    const map: Record<BrandColour, Color> = { lime: new Color(0xbcd155), sky: new Color(0x1ea9e0), plum: new Color(dark ? 0xf1ece6 : 0x52276f) };
    grid.cells.forEach((q, n) => mesh.setColorAt(n, map[q.c]));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };
  colour();
  addEventListener("itqan-theme", colour);

  const size = () => {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
  };
  size();
  const ro = new ResizeObserver(size);
  ro.observe(host);

  let visible = true;
  const io = new IntersectionObserver((es) => (visible = es[0]?.isIntersecting ?? true));
  io.observe(host);

  let mx = 0, my = 0, cx = 0, cy = 0;
  const onPointer = (e: PointerEvent) => {
    mx = e.clientX / innerWidth - 0.5;
    my = e.clientY / innerHeight - 0.5;
  };
  addEventListener("pointermove", onPointer, { passive: true });

  const m4 = new Matrix4(), q4 = new Quaternion(), e4 = new Euler(), v3 = new Vector3(), sc = new Vector3();
  let started: number | null = null;
  let lastP = -1;
  let settled = false;
  let dead = false;

  const tick = (now: number) => {
    if (dead) return;
    requestAnimationFrame(tick);
    if (!visible) return;
    if (started === null) started = now;
    const t = (now - started) / 1000;
    let p = 0;
    if (mode === "scene" && sceneEl) {
      const b = sceneEl.getBoundingClientRect();
      p = clamp(-b.top / Math.max(1, b.height - innerHeight));
    }
    const visH = 2 * cam.position.z * Math.tan(MathUtils.degToRad(cam.fov / 2));
    const visW = visH * cam.aspect;
    const wide = cam.aspect > 1.15;
    const mid = mode === "scene" ? smooth(0.04, 0.55, p) : 0;
    const fitA =
      mode === "scene"
        ? Math.min((visW * (wide ? 0.44 : 0.84)) / W, (visH * (wide ? 0.6 : 0.3)) / H)
        : Math.min((visW * 0.8) / W, (visH * 0.8) / H);
    const fitB = Math.min((visW * 0.74) / W, (visH * 0.6) / H);
    const x0 = mode === "scene" && wide ? visW * 0.23 : 0;
    const y0 = mode === "scene" && !wide ? -visH * 0.27 : 0;
    cx += (mx - cx) * 0.05;
    cy += (my - cy) * 0.05;
    group.position.set(x0 * (1 - mid), y0 * (1 - mid) + (reduce ? 0 : Math.sin(t * 0.7) * 0.012), 0);
    group.scale.setScalar(fitA + (fitB - fitA) * mid);
    group.rotation.y = reduce ? 0 : -0.3 * (1 - mid) + mid * Math.PI * 2 + cx * 0.45;
    group.rotation.x = reduce ? 0 : Math.sin(mid * Math.PI) * 0.22 + cy * 0.25;
    const split = reduce ? 0 : Math.sin(mid * Math.PI);
    if (!(settled && Math.abs(p - lastP) < 1e-4)) {
      let done = true;
      for (let n = 0; n < N; n++) {
        const h = home[n * 3]!;
        const r = rnd[n]!;
        const k0 = reduce ? 1 : clamp((t - 0.15 - r * 0.55 - (h / W + 0.5) * 0.45) / 1.05);
        const k = 1 - Math.pow(1 - k0, 3);
        if (k0 < 1) done = false;
        v3.set(h + scatter[n * 3]! * (1 - k), home[n * 3 + 1]! + scatter[n * 3 + 1]! * (1 - k), scatter[n * 3 + 2]! * (1 - k) + (r - 0.5) * 0.9 * split);
        e4.set((1 - k) * r * 7, (1 - k) * 4, 0);
        q4.setFromEuler(e4);
        sc.setScalar(Math.max(0.001, k));
        m4.compose(v3, q4, sc);
        mesh.setMatrixAt(n, m4);
      }
      mesh.instanceMatrix.needsUpdate = true;
      settled = done;
      lastP = p;
    }
    renderer.render(scene, cam);
  };
  requestAnimationFrame(tick);

  return () => {
    dead = true;
    ro.disconnect();
    io.disconnect();
    removeEventListener("itqan-theme", colour);
    removeEventListener("pointermove", onPointer);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    canvas.remove();
  };
}
