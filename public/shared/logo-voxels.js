// Samples the official logo PNG into a voxel grid snapped to the three brand colours.
// Used by the site's scroll-driven 3D logo and by the downloadable model (brand/Logo3D.html).
export const KEYS = ["lime", "plum", "sky"];
const RGB = { lime: [188, 209, 85], plum: [82, 39, 111], sky: [30, 169, 224] };
export function sampleLogo(img, cols) {
  // Coverage sampling: render at 4× and fill a voxel when ≥18% of its area is ink, so thin strokes ("Fueling wellness") survive.
  const S = 4, rows = Math.round(cols * img.height / img.width), W = cols * S, H = rows * S;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const x = c.getContext("2d", { willReadFrequently: true });
  x.drawImage(img, 0, 0, W, H);
  const d = x.getImageData(0, 0, W, H).data, cells = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    let n = 0, r = 0, g = 0, b = 0;
    for (let v = 0; v < S; v++) for (let u = 0; u < S; u++) {
      const k = ((j * S + v) * W + (i * S + u)) * 4;
      if (d[k + 3] > 90) { n++; r += d[k]; g += d[k + 1]; b += d[k + 2]; }
    }
    if (n < S * S * 0.18) continue;
    r /= n; g /= n; b /= n;
    let best = "plum", bd = Infinity;
    for (const key of KEYS) { const p = RGB[key], dd = (p[0] - r) ** 2 + (p[1] - g) ** 2 + (p[2] - b) ** 2; if (dd < bd) { bd = dd; best = key; } }
    cells.push({ i, j, c: best });
  }
  return { cols, rows, cells };
}
// Merged, export-friendly group: one named mesh per brand colour.
export function buildLogoGroup(THREE, grid, opts = {}) {
  const W = opts.width ?? 1.6, s = W / grid.cols, H = grid.rows * s, depth = s * (opts.depth ?? 2.4), f = 1 - (opts.gap ?? 0.12);
  const colours = { lime: 0xbcd155, plum: 0x52276f, sky: 0x1ea9e0 };
  const tpl = new THREE.BoxGeometry(s * f, s * f, depth).toNonIndexed();
  const tp = tpl.attributes.position.array, tn = tpl.attributes.normal.array, V = tp.length;
  const group = new THREE.Group(); group.name = "itqan-logo";
  for (const key of KEYS) {
    const cs = grid.cells.filter(q => q.c === key); if (!cs.length) continue;
    const pos = new Float32Array(cs.length * V), nor = new Float32Array(cs.length * V);
    cs.forEach((q, n) => {
      const ox = (q.i + 0.5) * s - W / 2, oy = H - (q.j + 0.5) * s, o = n * V;
      for (let v = 0; v < V; v += 3) { pos[o + v] = tp[v] + ox; pos[o + v + 1] = tp[v + 1] + oy; pos[o + v + 2] = tp[v + 2]; nor[o + v] = tn[v]; nor[o + v + 1] = tn[v + 1]; nor[o + v + 2] = tn[v + 2]; }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    const m = new THREE.MeshStandardMaterial({ color: colours[key], roughness: 0.4, metalness: 0.05 }); m.name = "itqan-" + key;
    const mesh = new THREE.Mesh(g, m); mesh.name = "logo-" + key; group.add(mesh);
  }
  return group;
}
