// The full Itqan logo as instanced two-tone capsules, sampled from the official
// logo file. Based on design_handoff_itqan_website/site/shared/itqan-logo3d.js and
// logo-voxels.js (README › 3D logo): the sampling, scroll scene, lights and timings
// are unchanged; the owner asked for capsules instead of box voxels (ADR-015).
// Loaded with a dynamic import, so three.js is only fetched on pages that use it.
import {
  ACESFilmicToneMapping,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  DynamicDrawUsage,
  Euler,
  Group,
  HemisphereLight,
  InstancedBufferAttribute,
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

/**
 * A capsule lying along Z, built as two halves that share a seam ring at z = 0
 * (the ring is duplicated so the colour edge is crisp). `aTone` is 0 on the
 * front half (+Z, facing the viewer) and 1 on the back half. Normals are the
 * exact cylinder/sphere normals, so a six-sided capsule still shades round.
 * Triangles per capsule: 2 × radial × (3 + 2 × capRings).
 */
export function createCapsuleGeometry(radius: number, halfLength: number, radial: number, capRings: number) {
  const straight = halfLength - radius;
  // Profile from the seam to the edge of the tip: [radius, z, normalR, normalZ].
  const profile: [number, number, number, number][] = [
    [radius, 0, 1, 0],
    [radius, straight, 1, 0],
  ];
  for (let i = 1; i <= capRings; i++) {
    const a = ((i / (capRings + 1)) * Math.PI) / 2;
    profile.push([radius * Math.cos(a), straight + radius * Math.sin(a), Math.cos(a), Math.sin(a)]);
  }
  const positions: number[] = [];
  const normals: number[] = [];
  const tones: number[] = [];
  const index: number[] = [];
  for (const [sign, tone] of [
    [1, 0],
    [-1, 1],
  ] as const) {
    const base = positions.length / 3;
    for (const [r, z, nr, nz] of profile)
      for (let k = 0; k < radial; k++) {
        const t = (k / radial) * Math.PI * 2;
        positions.push(r * Math.cos(t), r * Math.sin(t), sign * z);
        normals.push(nr * Math.cos(t), nr * Math.sin(t), sign * nz);
        tones.push(tone);
      }
    const tip = positions.length / 3;
    positions.push(0, 0, sign * halfLength);
    normals.push(0, 0, sign);
    tones.push(tone);
    const at = (ring: number, k: number) => base + ring * radial + (k % radial);
    for (let ring = 0; ring < profile.length - 1; ring++)
      for (let k = 0; k < radial; k++) {
        const a = at(ring, k), b = at(ring, k + 1), c = at(ring + 1, k + 1), d = at(ring + 1, k);
        // Counter-clockwise seen from outside; the mirrored back half flips the winding.
        if (sign > 0) index.push(a, b, c, a, c, d);
        else index.push(a, c, b, a, d, c);
      }
    const last = profile.length - 1;
    for (let k = 0; k < radial; k++) {
      if (sign > 0) index.push(at(last, k), at(last, k + 1), tip);
      else index.push(at(last, k), tip, at(last, k + 1));
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute("normal", new BufferAttribute(new Float32Array(normals), 3));
  geometry.setAttribute("aTone", new BufferAttribute(new Float32Array(tones), 1));
  geometry.setIndex(index);
  return geometry;
}

type Quality = { radial: number; capRings: number; maxPixelRatio: number; antialias: boolean };

/**
 * Picks geometry detail and resolution for the device (ADR-015). A capsule is
 * only 4–11 device pixels across, so six sides read as round everywhere; the
 * extra cap ring (rounder ends while turning) is kept for desktops only.
 */
function pickQuality(): Quality {
  const touch = matchMedia("(pointer: coarse)").matches;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowEnd = (memory !== undefined && memory <= 2) || (navigator.hardwareConcurrency ?? 8) <= 2;
  if (lowEnd) return { radial: 6, capRings: 0, maxPixelRatio: 1, antialias: false };
  if (touch) return { radial: 6, capRings: 0, maxPixelRatio: 1.5, antialias: false };
  return { radial: 6, capRings: 1, maxPixelRatio: 1.75, antialias: true };
}

export type Logo3DOptions = {
  /** "scene": driven by scroll through `sceneEl`. "inview": assembles when visible, follows the pointer. */
  mode: "scene" | "inview";
  sceneEl?: HTMLElement | null;
  logoSrc: string;
  /** Called if the browser drops the WebGL context (e.g. a backgrounded mobile tab). */
  onLost?: () => void;
  /** Always use the dark-ground colours, whatever the site theme (the brand sheet's ink panel). */
  onInk?: boolean;
};

/**
 * Mounts the capsule logo into `host` (absolutely positioned, fills it).
 * Resolves to a disposer, or `null` when WebGL 2 is unavailable so the caller
 * can show the static logo instead.
 */
export async function mountLogo3D(host: HTMLElement, { mode, sceneEl, logoSrc, onLost, onInk }: Logo3DOptions): Promise<(() => void) | null> {
  const img = new Image();
  img.src = logoSrc;
  await img.decode();

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const quality = pickQuality();
  // Create the WebGL 2 context here, so an unsupported or blocklisted GPU just
  // returns null (the caller shows the flat logo) instead of three.js throwing.
  // "default" power preference: a hero animation should not wake a laptop's discrete GPU.
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", { alpha: true, antialias: quality.antialias, depth: true, stencil: false, powerPreference: "default" });
  if (!context) return null;
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, context });
  } catch {
    return null;
  }
  let pixelRatio = Math.min(devicePixelRatio, quality.maxPixelRatio);
  const minPixelRatio = Math.min(1, pixelRatio);
  renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
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
  // Capsule: 0.9 of a grid cell wide, ~2.4 cells long (the box voxels were 0.86 × 2.6).
  const geometry = createCapsuleGeometry(s * 0.45, s * 1.2, quality.radial, quality.capRings);
  const back = new InstancedBufferAttribute(new Float32Array(N * 3), 3);
  geometry.setAttribute("aBack", back);
  const material = new MeshStandardMaterial({ roughness: 0.32, metalness: 0.02 });
  // Two tones in one draw call: the front half takes the instance colour, the back half `aBack`.
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float aTone;\nattribute vec3 aBack;")
      .replace("#include <color_vertex>", "#include <color_vertex>\n#ifdef USE_INSTANCING_COLOR\n\tvColor.rgb = mix( instanceColor.rgb, aBack, aTone );\n#endif");
  };
  material.customProgramCacheKey = () => "itqan-capsule";
  const mesh = new InstancedMesh(geometry, material, N);
  mesh.instanceMatrix.setUsage(DynamicDrawUsage);
  const group = new Group();
  group.add(mesh);
  scene.add(group);

  const home = new Float32Array(N * 3);
  const scatter = new Float32Array(N * 3);
  const rnd = new Float32Array(N);
  const tilt = new Float32Array(N * 2);
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
    tilt[n * 2] = Math.random() - 0.5;
    tilt[n * 2 + 1] = Math.random() - 0.5;
  });

  // Set when something outside the animation changes (size, theme), so a still scene redraws once.
  let dirty = true;

  // Front: brand colour (plum letters read as bone on the dark theme, as before).
  // Back: white, except bone-fronted letters on dark, whose back half is plum.
  const colour = () => {
    const dark = onInk || document.documentElement.dataset.theme !== "light";
    const white = new Color(0xf4f1ec);
    const plum = new Color(0x52276f);
    const front: Record<BrandColour, Color> = { lime: new Color(0xbcd155), sky: new Color(0x1ea9e0), plum: dark ? new Color(0xf1ece6) : plum };
    const rear: Record<BrandColour, Color> = { lime: white, sky: white, plum: dark ? plum : white };
    grid.cells.forEach((q, n) => {
      mesh.setColorAt(n, front[q.c]);
      const c = rear[q.c];
      back.setXYZ(n, c.r, c.g, c.b);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    back.needsUpdate = true;
    dirty = true;
  };
  colour();
  addEventListener("itqan-theme", colour);

  const size = () => {
    dirty = true;
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

  let dead = false;
  const onContextLost = (e: Event) => {
    e.preventDefault();
    dead = true;
    onLost?.();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  const m4 = new Matrix4(), q4 = new Quaternion(), e4 = new Euler(), v3 = new Vector3(), sc = new Vector3();
  let started: number | null = null;
  let lastP = -1;
  let settled = false;
  let frame = 0;
  let previous = 0;
  let slowSum = 0;
  let slowCount = 0;

  const tick = (now: number) => {
    if (dead) return;
    requestAnimationFrame(tick);
    if (!visible) {
      previous = 0;
      return;
    }
    if (started === null) started = now;
    const t = (now - started) / 1000;
    let p = 0;
    if (mode === "scene" && sceneEl) {
      const b = sceneEl.getBoundingClientRect();
      p = clamp(-b.top / Math.max(1, b.height - innerHeight));
    }
    const moving = !(settled && Math.abs(p - lastP) < 1e-4);
    // Once assembled, not scrolling and the pointer has settled, only the slow float
    // is left (a fraction of a pixel per frame): draw it at 30 fps. With reduced
    // motion nothing moves, so draw only when the size or theme changes.
    const still = !moving && (reduce || (Math.abs(mx - cx) < 1e-3 && Math.abs(my - cy) < 1e-3));
    frame++;
    if (still && !dirty && (reduce || frame % 2)) {
      previous = 0;
      return;
    }
    dirty = false;

    // Frame-time watchdog: if rendering averages over 24 ms, lower the resolution in steps.
    if (previous && frame > 30 && moving) {
      slowSum += now - previous;
      if (++slowCount === 45) {
        if (slowSum / slowCount > 24 && pixelRatio > minPixelRatio) {
          pixelRatio = Math.max(minPixelRatio, pixelRatio - 0.25);
          renderer.setPixelRatio(pixelRatio);
          size();
        }
        slowSum = 0;
        slowCount = 0;
      }
    }
    previous = now;

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
    if (moving) {
      let done = true;
      for (let n = 0; n < N; n++) {
        const h = home[n * 3]!;
        const r = rnd[n]!;
        const k0 = reduce ? 1 : clamp((t - 0.15 - r * 0.55 - (h / W + 0.5) * 0.45) / 1.05);
        const k = 1 - Math.pow(1 - k0, 3);
        if (k0 < 1) done = false;
        v3.set(h + scatter[n * 3]! * (1 - k), home[n * 3 + 1]! + scatter[n * 3 + 1]! * (1 - k), scatter[n * 3 + 2]! * (1 - k) + (r - 0.5) * 0.9 * split);
        // Tumble in from the scatter; while the logo turns and spreads, each capsule
        // also tilts a little (spilled pills), then realigns at rest.
        e4.set((1 - k) * r * 7 + split * tilt[n * 2]! * 1.1, (1 - k) * 4 + split * tilt[n * 2 + 1]! * 1.1, 0);
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
    canvas.removeEventListener("webglcontextlost", onContextLost);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    canvas.remove();
  };
}
