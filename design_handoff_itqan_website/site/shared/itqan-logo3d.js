// <itqan-logo3d mode="scene|inview"> — the full Itqan logo as instanced voxels sampled from assets/brand/logo.png.
// scene: reads scroll progress from the closest [data-scene] ancestor (assemble → turn + depth split → settle centred).
// inview: assembles when visible, then follows the pointer.
(function () {
  if (customElements.get("itqan-logo3d")) return;
  const tag = document.currentScript || [...document.scripts].find(s => /itqan-logo3d\.js/.test(s.src));
  const here = tag && tag.src ? tag.src : new URL("../shared/itqan-logo3d.js", location.href).href;
  const T = "https://unpkg.com/three@0.184.0/build/three.module.js";
  const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ss = (a, b, v) => { const t = cl((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  class ItqanLogo3D extends HTMLElement {
    connectedCallback() {
      if (this._i) return; this._i = 1;
      Object.assign(this.style, { display: "block", position: "absolute", inset: "0", pointerEvents: "none" });
      const p = this.parentElement; if (p && getComputedStyle(p).position === "static") p.style.position = "relative";
      const img = new Image(); const imgReady = new Promise((res, rej) => { img.onload = () => res(img); img.onerror = () => rej(new Error("logo image failed")); }); img.src = new URL("../assets/brand/logo.png", here).href;
      Promise.all([import(T), import(new URL("./logo-voxels.js?v=8", here).href), imgReady])
        .then(([THREE, V, im]) => this.boot(THREE, V, im)).catch(e => console.warn("itqan-logo3d: " + (e && e.message || e)));
    }
    disconnectedCallback() { this._dead = 1; this._ro && this._ro.disconnect(); this._io && this._io.disconnect(); this.r && this.r.dispose(); this._th && removeEventListener("itqan-theme", this._th); }
    boot(THREE, V, img) {
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const touch = matchMedia("(pointer: coarse)").matches;
      let r; try { r = this.r = new THREE.WebGLRenderer({ antialias: !touch, alpha: true, powerPreference: "high-performance" }); } catch (e) { console.warn("itqan-logo3d: WebGL unavailable"); return; }
      r.setPixelRatio(Math.min(devicePixelRatio, touch ? 1.5 : 1.75)); r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
      Object.assign(r.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
      r.domElement.setAttribute("aria-hidden", "true");
      let root = this;
      try { root = this.shadowRoot || this.attachShadow({ mode: "open" }); const st = document.createElement("style"); st.textContent = ":host{display:block;position:absolute;inset:0;pointer-events:none}canvas{position:absolute;inset:0;width:100%;height:100%;display:block}"; root.append(st); } catch (e) { root = this; }
      root.append(r.domElement);
      if (root === this) { this._mo = new MutationObserver(() => { if (!r.domElement.isConnected) this.append(r.domElement); }); this._mo.observe(this, { childList: true }); }
      const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, 1, 0.05, 50); cam.position.set(0, 0, 3.2);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x30203a, 1.45));
      const key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(1.5, 2, 3); scene.add(key);
      const r1 = new THREE.PointLight(0x1ea9e0, 9, 7); r1.position.set(2.2, 0.4, -1); scene.add(r1);
      const r2 = new THREE.PointLight(0xbcd155, 7, 7); r2.position.set(-2.2, 1, -1); scene.add(r2);
      const cols = +(this.getAttribute("cols") || (innerWidth < 700 ? 110 : 150));
      const grid = V.sampleLogo(img, cols), N = grid.cells.length, W = 1.6, s = W / cols, H = grid.rows * s;
      const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(s * 0.86, s * 0.86, s * 2.6), new THREE.MeshStandardMaterial({ roughness: 0.36, metalness: 0.08 }), N);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      const group = new THREE.Group(); group.add(mesh); scene.add(group);
      const home = new Float32Array(N * 3), scat = new Float32Array(N * 3), rnd = new Float32Array(N);
      grid.cells.forEach((q, n) => {
        home[n * 3] = (q.i + 0.5) * s - W / 2; home[n * 3 + 1] = H / 2 - (q.j + 0.5) * s;
        const a = Math.random() * 6.283, b = Math.acos(2 * Math.random() - 1), R = 1.4 + Math.random() * 2;
        scat[n * 3] = Math.sin(b) * Math.cos(a) * R; scat[n * 3 + 1] = Math.sin(b) * Math.sin(a) * R; scat[n * 3 + 2] = Math.cos(b) * R; rnd[n] = Math.random();
      });
      const colour = () => {
        const dark = document.documentElement.dataset.theme !== "light";
        const map = { lime: new THREE.Color(0xbcd155), sky: new THREE.Color(0x1ea9e0), plum: new THREE.Color(dark ? 0xf1ece6 : 0x52276f) };
        grid.cells.forEach((q, n) => mesh.setColorAt(n, map[q.c])); mesh.instanceColor.needsUpdate = true;
      };
      colour(); this._th = colour; addEventListener("itqan-theme", colour);
      const size = () => { const w = this.clientWidth || 1, h = this.clientHeight || 1; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
      size(); this._ro = new ResizeObserver(size); this._ro.observe(this);
      let vis = true, started = null; this._io = new IntersectionObserver(es => { vis = es[0].isIntersecting; }); this._io.observe(this);
      let mx = 0, my = 0, cx = 0, cy = 0;
      addEventListener("pointermove", e => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
      const sceneEl = this.closest("[data-scene]"), mode = this.getAttribute("mode") || (sceneEl ? "scene" : "inview");
      const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), e4 = new THREE.Euler(), v3 = new THREE.Vector3(), sc = new THREE.Vector3();
      let lastP = -1, settled = false;
      const tick = now => {
        if (this._dead) return; requestAnimationFrame(tick); if (!vis) return;
        if (started === null) started = now;
        const t = (now - started) / 1000;
        let p = 0; if (mode === "scene" && sceneEl) { const b = sceneEl.getBoundingClientRect(); p = cl(-b.top / Math.max(1, b.height - innerHeight)); }
        const visH = 2 * cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)), visW = visH * cam.aspect, wide = cam.aspect > 1.15;
        const mid = mode === "scene" ? ss(0.04, 0.55, p) : 0;
        const fitA = mode === "scene" ? Math.min(visW * (wide ? 0.44 : 0.84) / W, visH * (wide ? 0.6 : 0.3) / H) : Math.min(visW * 0.8 / W, visH * 0.8 / H);
        const fitB = Math.min(visW * 0.74 / W, visH * 0.6 / H);
        const x0 = mode === "scene" && wide ? visW * 0.23 : 0, y0 = mode === "scene" && !wide ? -visH * 0.27 : 0;
        cx += (mx - cx) * 0.05; cy += (my - cy) * 0.05;
        group.position.set(x0 * (1 - mid), y0 * (1 - mid) + (reduce ? 0 : Math.sin(t * 0.7) * 0.012), 0);
        group.scale.setScalar(fitA + (fitB - fitA) * mid);
        group.rotation.y = reduce ? 0 : (-0.3 * (1 - mid) + mid * Math.PI * 2) + cx * 0.45;
        group.rotation.x = reduce ? 0 : Math.sin(mid * Math.PI) * 0.22 + cy * 0.25;
        const split = reduce ? 0 : Math.sin(mid * Math.PI);
        if (!(settled && Math.abs(p - lastP) < 1e-4)) {
          let done = true;
          for (let n = 0; n < N; n++) {
            const h = home[n * 3], k0 = reduce ? 1 : cl((t - 0.15 - rnd[n] * 0.55 - (h / W + 0.5) * 0.45) / 1.05), k = 1 - Math.pow(1 - k0, 3);
            if (k0 < 1) done = false;
            v3.set(h + scat[n * 3] * (1 - k), home[n * 3 + 1] + scat[n * 3 + 1] * (1 - k), scat[n * 3 + 2] * (1 - k) + (rnd[n] - 0.5) * 0.9 * split);
            e4.set((1 - k) * rnd[n] * 7, (1 - k) * 4, 0); q4.setFromEuler(e4); sc.setScalar(Math.max(0.001, k));
            m4.compose(v3, q4, sc); mesh.setMatrixAt(n, m4);
          }
          mesh.instanceMatrix.needsUpdate = true; settled = done; lastP = p;
        }
        r.render(scene, cam);
      };
      requestAnimationFrame(tick);
    }
  }
  customElements.define("itqan-logo3d", ItqanLogo3D);
})();
