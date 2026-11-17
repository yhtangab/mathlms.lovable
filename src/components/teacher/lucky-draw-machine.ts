import * as THREE from "three";
import gsap from "gsap";

/** 3D lucky-draw machine adapted from the class reference page. */

const CSS = `
.ld-root{position:relative;height:100%;overflow:hidden;background:#241838;color:#f6efe2;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.ld-root button,.ld-root input,.ld-root textarea{font-family:inherit}
.ld-root button:disabled{opacity:.4;cursor:not-allowed}
.ld-root button:focus-visible,.ld-root input:focus-visible,.ld-root textarea:focus-visible{outline:2px solid #2fd3e0;outline-offset:2px}
.ld-root .ld-stage{position:absolute;inset:0}
.ld-root .ld-panel{position:absolute;top:16px;left:16px;bottom:16px;width:min(310px,calc(100% - 32px));z-index:10;background:rgba(22,16,38,.62);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,226,160,.16);border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:12px;transition:transform .5s,opacity .4s}
.ld-root .ld-panel.is-hidden{transform:translateX(calc(-100% - 40px));opacity:0;pointer-events:none}
.ld-root .ld-head{display:flex;justify-content:space-between;align-items:center}
.ld-root .ld-head h1{font-size:22px;color:#ffe2a0}
.ld-root .ld-icon{width:36px;height:36px;border-radius:10px;border:1px solid rgba(255,226,160,.16);background:rgba(255,255,255,.05);color:#fff;font-size:17px;cursor:pointer}
.ld-root .ld-open{position:absolute;top:18px;left:18px;z-index:9;display:none}
.ld-root .ld-small{font-size:13px;color:#a59cbc}
.ld-root textarea{flex:1;min-height:140px;resize:none;padding:12px;border-radius:12px;border:1px solid rgba(255,226,160,.16);background:rgba(6,4,14,.6);color:#fff;font-size:15px;line-height:1.7;outline:none}
.ld-root .ld-btn{padding:11px;border-radius:12px;border:none;font-weight:700;font-size:14px;cursor:pointer;background:linear-gradient(160deg,#ffe8b0,#e8b04b 55%,#c9832a);color:#2b1700}
.ld-root .ld-check{display:flex;gap:8px;align-items:center;font-size:14px;cursor:pointer}
.ld-root .ld-check input{accent-color:#e8b04b;width:17px;height:17px}
.ld-root .ld-history{list-style:none;max-height:170px;overflow:auto;display:flex;flex-direction:column;gap:6px;font-size:13px;margin:0;padding:0}
.ld-root .ld-history li{padding:7px 10px;border-radius:10px;background:rgba(255,255,255,.05);line-height:1.5}
.ld-root .ld-history li b{color:#ffe2a0}
.ld-root .ld-history li s{color:#ff7a8a}
.ld-root .ld-history:empty::before{content:"Winners will be listed here";color:rgba(165,156,188,.6)}
.ld-root .ld-status{position:absolute;top:20px;left:50%;transform:translateX(-50%);z-index:5;padding:8px 18px;border-radius:99px;font-size:13px;color:#ffe2a0;background:rgba(10,7,20,.55);border:1px solid rgba(255,226,160,.16);white-space:nowrap}
.ld-root .ld-controls{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);z-index:6;display:flex;gap:12px;align-items:center;padding:10px 12px;border-radius:99px;background:rgba(16,11,28,.6);border:1px solid rgba(255,226,160,.16);backdrop-filter:blur(10px)}
.ld-root .ld-num{display:flex;flex-direction:column;align-items:center;font-size:11px;color:#a59cbc;gap:2px}
.ld-root .ld-num input{width:58px;padding:6px;border-radius:10px;border:1px solid rgba(255,226,160,.16);background:rgba(0,0,0,.35);color:#fff;font-size:17px;font-weight:700;text-align:center}
.ld-root .ld-result{font-size:12px;color:#ffe2a0;min-width:72px;text-align:center}
.ld-root .ld-start{padding:15px 36px;border-radius:99px;border:none;cursor:pointer;font-size:18px;font-weight:900;letter-spacing:.06em;color:#2b1700;background:linear-gradient(170deg,#fff1c9,#f2c062 40%,#d8892c);box-shadow:0 10px 30px rgba(232,150,60,.4)}
.ld-root .ld-reset{padding:13px 20px;border-radius:99px;cursor:pointer;font-size:15px;font-weight:700;color:#fff;background:transparent;border:1px solid rgba(255,226,160,.3)}
.ld-root .ld-winner{position:absolute;left:0;right:0;bottom:156px;text-align:center;pointer-events:none;z-index:4;visibility:hidden;padding:0 16px}
.ld-root .ld-wtitle{font-size:16px;letter-spacing:.4em;color:#ffe2a0;margin-bottom:8px;text-shadow:0 0 16px rgba(255,190,90,.6)}
.ld-root .ld-wnames{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 28px}
.ld-root .ld-wnames span{display:inline-block;font-family:Georgia,"Times New Roman",serif;font-weight:900;line-height:1.1;background:linear-gradient(180deg,#fffaf0,#ffe2a0 40%,#f0a63e 72%,#b86a1c);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 20px rgba(255,180,80,.5)) drop-shadow(0 4px 0 rgba(110,52,0,.6))}
.ld-root .ld-rewards{position:absolute;left:50%;bottom:100px;transform:translateX(-50%);z-index:8;display:flex;flex-wrap:wrap;justify-content:center;gap:8px;max-width:min(920px,calc(100% - 32px))}
.ld-root .ld-coin{padding:8px 14px;border:none;border-radius:999px;cursor:pointer;font-weight:800;font-size:14px;color:#2b1700;background:linear-gradient(160deg,#fff1c9,#e8b04b 55%,#c9832a);box-shadow:0 8px 20px rgba(232,150,60,.35)}
.ld-root .ld-coin:disabled{opacity:.55;cursor:default}
.ld-root .ld-toast{position:absolute;left:50%;top:64px;transform:translateX(-50%);z-index:30;padding:10px 18px;border-radius:12px;background:rgba(20,14,34,.9);border:1px solid rgba(255,226,160,.16);font-size:14px;opacity:0;transition:opacity .3s;pointer-events:none}
@container (max-width:700px){
  .ld-root .ld-controls{bottom:14px;gap:8px;padding:8px}
  .ld-root .ld-start{padding:13px 20px;font-size:15px}
  .ld-root .ld-reset{padding:11px 12px;font-size:13px}
  .ld-root .ld-result{display:none}
  .ld-root .ld-winner{bottom:148px}
  .ld-root .ld-rewards{bottom:92px}
}
`;

const R = 3;
const C = new THREE.Vector3(0, 3.6, 0);
const GRAV = 14;
const MAX_BALLS = 100;
const MAX_DRAW = 10;
const EXIT = new THREE.Vector3(0, -0.6, 0.8).normalize();
const LIGHT = Math.PI * 2.4;
const COLORS: ReadonlyArray<readonly [string, string]> = [
  ["#ff4d6d", "#a3123a"],
  ["#ffb627", "#c26a00"],
  ["#2ee6a6", "#0b8a6a"],
  ["#3fa9ff", "#1846b8"],
  ["#b86bff", "#5b1fb0"],
  ["#ff7a3d", "#b8370b"],
  ["#ff5fc8", "#a01a7d"],
  ["#25d0e0", "#0a6f8a"],
  ["#c4e538", "#5f8a00"],
  ["#ffd34d", "#b88a00"],
  ["#7a8cff", "#2d3bb0"],
  ["#ff8fa3", "#c23452"],
];
const CONF_COLORS = [
  "#ffd34d",
  "#ff4d6d",
  "#2ee6a6",
  "#3fa9ff",
  "#b86bff",
  "#ff7a3d",
  "#fff6e0",
  "#25d0e0",
];

export interface LuckyDrawHandle {
  setNames(names: string[]): void;
  dispose(): void;
}

export function mountLuckyDraw(
  root: HTMLElement,
  options: { names: string[]; onWinners: (names: string[]) => void },
): LuckyDrawHandle {
  ensureStyle();
  root.classList.add("ld-root");
  root.style.containerType = "size";
  root.replaceChildren();
  root.innerHTML = `
    <div class="ld-stage"></div>
    <aside class="ld-panel">
      <div class="ld-head"><h1>Lucky Draw</h1><button type="button" class="ld-icon" data-close aria-label="Hide sidebar">✕</button></div>
      <label class="ld-small" for="ld-names">Participants (one name per line)</label>
      <textarea id="ld-names" spellcheck="false"></textarea>
      <div class="ld-small">Total <b data-total>0</b> · In machine <b data-left>0</b></div>
      <button type="button" class="ld-btn" data-update>Update list</button>
      <label class="ld-check"><input type="checkbox" data-remove checked> Remove winners from the machine</label>
      <div class="ld-small">History</div>
      <ol class="ld-history"></ol>
      <div class="ld-small">Keys: Space = start, R = reset, H = sidebar</div>
    </aside>
    <button type="button" class="ld-icon ld-open" data-open aria-label="Show sidebar">☰</button>
    <div class="ld-status">Ready</div>
    <div class="ld-winner"><div class="ld-wtitle">WINNER</div><div class="ld-wnames"></div></div>
    <div class="ld-rewards"></div>
    <div class="ld-controls">
      <button type="button" class="ld-reset" data-reset>Reset</button>
      <label class="ld-num">Draw<input type="number" data-draw min="1" max="10" value="1" aria-label="Draw"></label>
      <label class="ld-num">Eliminate<input type="number" data-elim min="0" max="9" value="0" aria-label="Eliminate"></label>
      <span class="ld-result">1 winner</span>
      <button type="button" class="ld-start" data-start>Start</button>
    </div>
    <div class="ld-toast"></div>
  `;

  const ui = {
    names: must<HTMLTextAreaElement>(root, "textarea"),
    update: must<HTMLButtonElement>(root, "[data-update]"),
    remove: must<HTMLInputElement>(root, "[data-remove]"),
    total: must<HTMLElement>(root, "[data-total]"),
    left: must<HTMLElement>(root, "[data-left]"),
    history: must<HTMLOListElement>(root, ".ld-history"),
    start: must<HTMLButtonElement>(root, "[data-start]"),
    reset: must<HTMLButtonElement>(root, "[data-reset]"),
    status: must<HTMLElement>(root, ".ld-status"),
    drawN: must<HTMLInputElement>(root, "[data-draw]"),
    elimN: must<HTMLInputElement>(root, "[data-elim]"),
    result: must<HTMLElement>(root, ".ld-result"),
    panel: must<HTMLElement>(root, ".ld-panel"),
    open: must<HTMLButtonElement>(root, "[data-open]"),
    close: must<HTMLButtonElement>(root, "[data-close]"),
    winner: must<HTMLElement>(root, ".ld-winner"),
    wTitle: must<HTMLElement>(root, ".ld-wtitle"),
    wNames: must<HTMLElement>(root, ".ld-wnames"),
    rewards: must<HTMLElement>(root, ".ld-rewards"),
    toast: must<HTMLElement>(root, ".ld-toast"),
    stage: must<HTMLElement>(root, ".ld-stage"),
  };

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  } catch {
    root.replaceChildren();
    const msg = document.createElement("p");
    msg.style.padding = "24px";
    msg.textContent = "This browser cannot show the 3D lucky draw.";
    root.append(msg);
    return { setNames() {}, dispose() {} };
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  ui.stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x241838);
  scene.fog = new THREE.FogExp2(0x241838, 0.012);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = new THREE.Scene();
  env.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(20, 32, 16),
      new THREE.MeshBasicMaterial({ color: 0x15121f, side: THREE.BackSide }),
    ),
  );
  const panel = (x: number, y: number, z: number, w: number, h: number, c: number) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }),
    );
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  panel(0, 12, 4, 12, 4, 0xffffff);
  panel(-12, 4, -4, 4, 9, 0xff5fa0);
  panel(12, 4, -4, 4, 9, 0x5fe6ff);
  panel(0, 3, 14, 9, 3, 0xffe2b0);
  const envTarget = pmrem.fromScene(env, 0.04);
  scene.environment = envTarget.texture;
  pmrem.dispose();

  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const HOME = { pos: V(0, 4.8, 14.5), target: V(0, 3.1, 0) };
  const cam = { pos: HOME.pos.clone(), target: HOME.target.clone(), fit: 1 };
  const fx = { sway: 1, shake: 0, party: 0 };
  function camTo(
    pos: THREE.Vector3,
    target: THREE.Vector3,
    duration: number,
    ease = "power2.inOut",
    useFit = 1,
  ) {
    gsap.to(cam.pos, { x: pos.x, y: pos.y, z: pos.z, duration, ease });
    gsap.to(cam.target, { x: target.x, y: target.y, z: target.z, duration, ease });
    gsap.to(cam, { fit: useFit, duration, ease });
  }
  function fitFactor() {
    const a = root.clientWidth / Math.max(root.clientHeight, 1);
    return a >= 1.2 ? 1 : Math.min(2.1, 1.2 / a);
  }

  function dotTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    if (!g) return new THREE.CanvasTexture(c);
    const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, "#fff");
    rg.addColorStop(0.35, "rgba(255,255,255,.5)");
    rg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  function ballTexture(name: string, i: number) {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const g = c.getContext("2d");
    const pair = COLORS[i % COLORS.length] ?? ["#ffd34d", "#b88a00"];
    const [a, b] = pair;
    if (g) {
      const grd = g.createLinearGradient(0, 0, 0, 512);
      grd.addColorStop(0, b);
      grd.addColorStop(0.5, a);
      grd.addColorStop(1, b);
      g.fillStyle = grd;
      g.fillRect(0, 0, 1024, 512);
      for (const cx of [256, 768]) {
        g.fillStyle = "#fffaf0";
        g.beginPath();
        g.ellipse(cx, 256, 170, 100, 0, 0, Math.PI * 2);
        g.fill();
        g.lineWidth = 10;
        g.strokeStyle = b;
        g.beginPath();
        g.ellipse(cx, 256, 158, 88, 0, 0, Math.PI * 2);
        g.stroke();
        let size = 120;
        g.font = `900 ${size}px system-ui, sans-serif`;
        while (g.measureText(name).width > 250 && size > 44) {
          size -= 4;
          g.font = `900 ${size}px system-ui, sans-serif`;
        }
        const w = g.measureText(name).width;
        g.save();
        g.translate(cx, 262);
        if (w > 250) g.scale(250 / w, 1);
        g.fillStyle = "#241634";
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(name, 0, 0);
        g.restore();
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  }

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(45, 96),
    new THREE.MeshStandardMaterial({
      color: 0x4a3b68,
      roughness: 0.32,
      metalness: 0.35,
      envMapIntensity: 0.85,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  const glowRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.9, 0.03, 12, 160),
    new THREE.MeshBasicMaterial({ color: 0xff4fa0, transparent: true }),
  );
  glowRing.rotation.x = -Math.PI / 2;
  glowRing.position.y = 0.02;
  scene.add(glowRing);

  scene.add(new THREE.AmbientLight(0xfff6e8, 0.85 * LIGHT));
  scene.add(new THREE.HemisphereLight(0xfff4d2, 0x6a4e8a, 0.55 * LIGHT));
  const key = new THREE.SpotLight(0xfff3e0, 1.6 * LIGHT, 0, Math.PI / 7.5, 0.55);
  key.position.set(3, 15, 7);
  key.target.position.copy(C);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0003;
  const rimL = new THREE.SpotLight(0xff3d8b, 1.2 * LIGHT, 0, Math.PI / 6, 0.6);
  rimL.position.set(-10, 9, -5);
  rimL.target.position.copy(C);
  const rimR = new THREE.SpotLight(0x2fd3e0, 1.2 * LIGHT, 0, Math.PI / 6, 0.6);
  rimR.position.set(10, 9, -5);
  rimR.target.position.copy(C);
  const innerLight = new THREE.PointLight(0xffd27a, 0.8 * LIGHT, 8);
  innerLight.position.set(0, 2, 0);
  const winSpot = new THREE.SpotLight(0xfff0d0, 0, 0, Math.PI / 6, 0.5);
  winSpot.position.set(0, 11, 13);
  winSpot.target.position.set(0, 2.6, 6.4);
  scene.add(
    key,
    key.target,
    rimL,
    rimL.target,
    rimR,
    rimR.target,
    innerLight,
    winSpot,
    winSpot.target,
  );

  const beams: { mat: THREE.ShaderMaterial; base: THREE.Color }[] = [];
  function addBeam(from: THREE.Vector3, to: THREE.Vector3, radius: number, color: number) {
    const dir = new THREE.Vector3().subVectors(to, from);
    const h = dir.length();
    dir.normalize();
    const mat = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL1,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 0.2 } },
      vertexShader: `varying float vY; varying vec3 vN; varying vec3 vV;
        void main(){ vY = uv.y; vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `uniform vec3 uColor; uniform float uOpacity; varying float vY; varying vec3 vN; varying vec3 vV;
        void main(){ float a = uOpacity * pow(vY,1.6) * pow(abs(dot(vN,vV)),2.0); gl_FragColor = vec4(uColor*a, a); }`,
    });
    const m = new THREE.Mesh(new THREE.ConeGeometry(radius, h, 48, 1, true), mat);
    m.quaternion.setFromUnitVectors(V(0, 1, 0), dir.clone().negate());
    m.position.copy(from).addScaledVector(dir, h / 2);
    scene.add(m);
    beams.push({ mat, base: new THREE.Color(color) });
  }
  addBeam(V(-10, 16, -6), V(-2, 0, 0), 4.2, 0xff3d8b);
  addBeam(V(10, 16, -6), V(2, 0, 0), 4.2, 0x2fd3e0);
  addBeam(V(0, 18, -9), V(0, 0, -1), 5, 0xffc870);

  const brass = new THREE.MeshStandardMaterial({ color: 0xd9a443, metalness: 1, roughness: 0.22 });
  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x1b1626,
    metalness: 0.85,
    roughness: 0.3,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.28,
    roughness: 0,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0,
    envMapIntensity: 2,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(2.25, 2.55, 0.38, 96), darkMetal);
  base.position.y = 0.19;
  base.castShadow = base.receiveShadow = true;
  scene.add(base);
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.85, 0.7, 64), brass);
  column.position.y = 0.72;
  scene.add(column);
  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(Math.sqrt(R * R - (C.y - 0.98) ** 2), 0.09, 20, 120),
    brass,
  );
  collar.rotation.x = Math.PI / 2;
  collar.position.y = 0.98;
  scene.add(collar);

  const machine = new THREE.Group();
  machine.position.copy(C);
  scene.add(machine);
  const glass = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 64), glassMat);
  glass.renderOrder = 1;
  machine.add(glass);
  const fresnel = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.005, 96, 64),
    new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL1,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0-abs(dot(vN,vV)),3.0)*0.7; gl_FragColor = vec4(vec3(0.55,0.85,1.0)*f, f); }`,
    }),
  );
  fresnel.renderOrder = 2;
  machine.add(fresnel);
  const rotor = new THREE.Group();
  machine.add(rotor);
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(R + 0.03, 0.035, 12, 200), brass);
    ring.rotation.y = (i * Math.PI) / 3;
    ring.castShadow = true;
    rotor.add(ring);
  }
  const equator = new THREE.Mesh(new THREE.TorusGeometry(R + 0.05, 0.07, 16, 200), brass);
  equator.rotation.x = Math.PI / 2;
  machine.add(equator);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.45, 0.3, 48), brass);
  cap.position.y = R + 0.1;
  machine.add(cap);
  const gem = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 32, 24),
    new THREE.MeshBasicMaterial({ color: 0xffd27a }),
  );
  gem.position.y = R + 0.38;
  machine.add(gem);
  const nozzleMat = new THREE.MeshBasicMaterial({
    color: 0x5fe6ff,
    transparent: true,
    opacity: 0.25,
  });
  const nozzle = new THREE.Mesh(new THREE.CircleGeometry(0.75, 48), nozzleMat);
  nozzle.rotation.x = -Math.PI / 2;
  nozzle.position.y = -R + 0.2;
  machine.add(nozzle);

  const TUBE = [
    C.clone().addScaledVector(EXIT, R - 0.12),
    C.clone().addScaledVector(EXIT, R + 0.5),
    V(0, 0.98, 3.65),
    V(0, 0.82, 4.45),
    V(0, 0.9, 5.05),
  ];
  let tube: THREE.Mesh | null = null;
  const exitRing = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.07, 16, 64), brass);
  exitRing.position.copy(C).addScaledVector(EXIT, R);
  exitRing.quaternion.setFromUnitVectors(V(0, 0, 1), EXIT);
  scene.add(exitRing);
  function rebuildTube(radius: number) {
    if (tube) {
      scene.remove(tube);
      tube.geometry.dispose();
    }
    tube = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(TUBE),
        100,
        Math.max(radius * 1.3, 0.32),
        24,
        false,
      ),
      glassMat,
    );
    tube.renderOrder = 1;
    scene.add(tube);
  }

  const DOT = dotTexture();
  const JET_N = 300;
  const jetPos = new Float32Array(JET_N * 3);
  const jetSpd = new Float32Array(JET_N);
  function respawnJet(i: number, anyY: boolean) {
    const ang = Math.random() * Math.PI * 2;
    const rr = Math.sqrt(Math.random()) * 1.1;
    jetPos[i * 3] = Math.cos(ang) * rr;
    jetPos[i * 3 + 2] = Math.sin(ang) * rr;
    jetPos[i * 3 + 1] = anyY ? -R + Math.random() * R * 1.8 : -R + 0.25;
    jetSpd[i] = 4 + Math.random() * 6;
  }
  for (let i = 0; i < JET_N; i++) respawnJet(i, true);
  const jetGeo = new THREE.BufferGeometry();
  jetGeo.setAttribute("position", new THREE.BufferAttribute(jetPos, 3));
  const jetMat = new THREE.PointsMaterial({
    map: DOT,
    size: 0.09,
    color: 0x9feaff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const jet = new THREE.Points(jetGeo, jetMat);
  machine.add(jet);

  const CONF_N = 500;
  const confetti = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.075, 0.13),
    new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.45, metalness: 0.35 }),
    CONF_N,
  );
  confetti.frustumCulled = false;
  const conf: {
    p: THREE.Vector3;
    v: THREE.Vector3;
    r: THREE.Vector3;
    w: THREE.Vector3;
    life: number;
    ph: number;
  }[] = [];
  const _m = new THREE.Matrix4();
  const _q = new THREE.Quaternion();
  const _s = new THREE.Vector3();
  const _e = new THREE.Euler();
  for (let i = 0; i < CONF_N; i++) {
    confetti.setColorAt(i, new THREE.Color(CONF_COLORS[i % CONF_COLORS.length] ?? "#fff6e0"));
    conf.push({
      p: V(0, 0, 0),
      v: V(0, 0, 0),
      r: V(0, 0, 0),
      w: V(0, 0, 0),
      life: 99,
      ph: Math.random() * 10,
    });
    confetti.setMatrixAt(i, _m.makeScale(0, 0, 0));
  }
  scene.add(confetti);
  let confNext = 0;
  function burst(origin: THREE.Vector3, bias: THREE.Vector3, count: number, power: number) {
    for (let k = 0; k < count; k++) {
      const d = conf[confNext];
      confNext = (confNext + 1) % CONF_N;
      if (!d) continue;
      d.p.copy(origin);
      d.v
        .set(Math.random() - 0.5, Math.random() * 0.6 + 0.2, Math.random() - 0.5)
        .normalize()
        .add(bias)
        .normalize()
        .multiplyScalar(power * (0.5 + Math.random() * 0.6));
      d.r.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      d.w.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14);
      d.life = 0;
    }
  }
  function updateConfetti(dt: number, t: number) {
    for (let i = 0; i < CONF_N; i++) {
      const d = conf[i];
      if (!d || d.life > 5) continue;
      d.life += dt;
      d.v.y -= 7 * dt;
      d.v.multiplyScalar(1 - Math.min(1, 1.7 * dt));
      d.p.addScaledVector(d.v, dt);
      d.p.x += Math.sin(t * 4 + d.ph) * 0.5 * dt;
      d.r.addScaledVector(d.w, dt);
      _e.set(d.r.x, d.r.y, d.r.z);
      _q.setFromEuler(_e);
      _s.setScalar(d.life > 5 ? 0 : Math.min(1, 5 - d.life));
      confetti.setMatrixAt(i, _m.compose(d.p, _q, _s));
    }
    confetti.instanceMatrix.needsUpdate = true;
  }

  interface Ball {
    name: string;
    mesh: THREE.Mesh;
    mat: THREE.MeshPhysicalMaterial;
    r: number;
    pos: THREE.Vector3;
    vel: THREE.Vector3;
    spinV: THREE.Vector3;
    kin: boolean;
    out: boolean;
    removed: boolean;
    inDrum: boolean;
    eliminated: boolean;
  }
  const ballGeo = new THREE.SphereGeometry(1, 48, 32);
  let balls: Ball[] = [];
  let ballR = 0.5;
  let shown: Ball[] = [];
  let busy = false;
  let round = 0;
  let pending: string[] | null = null;
  let alive = true;
  const sim = { spin: 0, jet: 0 };

  function rebuildBalls(names: string[]) {
    for (const b of balls) {
      scene.remove(b.mesh);
      b.mat.map?.dispose();
      b.mat.dispose();
      gsap.killTweensOf(b.mesh.scale);
      gsap.killTweensOf(b.mesh.position);
      gsap.killTweensOf(b.mat);
    }
    ballR = THREE.MathUtils.clamp(R * Math.cbrt(0.16 / Math.max(names.length, 1)), 0.22, 0.58);
    balls = names.map((name, i) => {
      const mat = new THREE.MeshPhysicalMaterial({
        map: ballTexture(name, i),
        roughness: 0.26,
        metalness: 0.04,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        emissive: 0xff0033,
        emissiveIntensity: 0,
      });
      const mesh = new THREE.Mesh(ballGeo, mat);
      mesh.castShadow = true;
      mesh.quaternion.setFromEuler(
        new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
      );
      scene.add(mesh);
      return {
        name,
        mesh,
        mat,
        r: ballR,
        pos: V(0, 0, 0),
        vel: V(0, 0, 0),
        spinV: V(0, 0, 0),
        kin: false,
        out: false,
        removed: false,
        inDrum: true,
        eliminated: false,
      };
    });
    shown = [];
    rebuildTube(ballR);
    scatter(balls);
    refreshCounts();
  }
  function scatter(list: Ball[]) {
    const lim = R - ballR - 0.2;
    list.forEach((b, i) => {
      do {
        b.pos
          .set(
            (Math.random() - 0.5) * 1.6 * lim,
            Math.random() * lim * 0.9,
            (Math.random() - 0.5) * 1.6 * lim,
          )
          .add(C);
      } while (b.pos.distanceTo(C) > lim);
      b.vel.set((Math.random() - 0.5) * 2, -Math.random() * 2, (Math.random() - 0.5) * 2);
      b.mesh.position.copy(b.pos);
      b.mesh.visible = true;
      gsap.fromTo(
        b.mesh.scale,
        { x: 0, y: 0, z: 0 },
        { x: b.r, y: b.r, z: b.r, duration: 0.6, delay: i * 0.02, ease: "back.out(2)" },
      );
    });
  }

  const tmp = V(0, 0, 0);
  const n = V(0, 0, 0);
  const wallV = V(0, 0, 0);
  const rel = V(0, 0, 0);
  const vt = V(0, 0, 0);
  const q = new THREE.Quaternion();
  function stepPhysics(dt: number) {
    const list = balls.filter((b) => !b.removed && (b.kin ? b.inDrum : !b.out));
    const SUB = 5;
    const h = dt / SUB;
    const spin = sim.spin * 0.55;
    const jetS = sim.jet;
    for (let s = 0; s < SUB; s++) {
      for (const b of list) {
        if (b.kin) continue;
        b.vel.y -= GRAV * h;
        if (jetS > 0.001) {
          tmp.subVectors(b.pos, C);
          const low = THREE.MathUtils.clamp(0.35 - tmp.y / R, 0, 1.35);
          b.vel.y += jetS * (6 + 34 * low * Math.random() + (Math.random() - 0.5) * 40) * h;
          b.vel.x += (-tmp.z * 1.8 + (Math.random() - 0.5) * 70) * jetS * h;
          b.vel.z += (tmp.x * 1.8 + (Math.random() - 0.5) * 70) * jetS * h;
        }
        b.vel.multiplyScalar(Math.max(0, 1 - (jetS > 0.01 ? 0.25 : 0.6) * h));
        b.pos.addScaledVector(b.vel, h);
      }
      for (let i = 0; i < list.length; i++) {
        const a = list[i];
        if (!a) continue;
        for (let j = i + 1; j < list.length; j++) {
          const b = list[j];
          if (!b || (a.kin && b.kin)) continue;
          tmp.subVectors(b.pos, a.pos);
          const rs = a.r + b.r;
          const d2 = tmp.lengthSq();
          if (d2 >= rs * rs || d2 < 1e-10) continue;
          const d = Math.sqrt(d2);
          const ov = rs - d;
          n.copy(tmp).divideScalar(d);
          const wa = a.kin ? 0 : b.kin ? 1 : 0.5;
          const wb = b.kin ? 0 : a.kin ? 1 : 0.5;
          a.pos.addScaledVector(n, -ov * wa);
          b.pos.addScaledVector(n, ov * wb);
          const rv = rel.subVectors(b.vel, a.vel).dot(n);
          if (rv < 0) {
            const imp = -(1 + (rv > -0.8 ? 0.05 : 0.82)) * rv;
            a.vel.addScaledVector(n, -imp * wa);
            b.vel.addScaledVector(n, imp * wb);
          }
        }
      }
      for (const b of list) {
        if (b.kin) continue;
        tmp.subVectors(b.pos, C);
        const d = tmp.length();
        const maxD = R - 0.05 - b.r;
        if (d <= maxD) continue;
        n.copy(tmp).divideScalar(d || 1);
        b.pos.copy(C).addScaledVector(n, maxD);
        wallV.set(spin * tmp.z, 0, -spin * tmp.x);
        rel.copy(b.vel).sub(wallV);
        const vn = rel.dot(n);
        if (vn > 0) rel.addScaledVector(n, -(1 + (vn < 1.2 ? 0 : 0.5)) * vn);
        vt.copy(rel).addScaledVector(n, -rel.dot(n));
        rel.addScaledVector(vt, -Math.min(1, 6 * h));
        b.vel.copy(rel).add(wallV);
        b.spinV.lerp(tmp.crossVectors(vt, n).divideScalar(b.r), 0.3);
      }
    }
    for (const b of list) {
      if (b.kin) continue;
      if (b.vel.length() > 15) b.vel.setLength(15);
      b.spinV.multiplyScalar(Math.max(0, 1 - 0.6 * dt));
      const w = b.spinV.length();
      if (w > 1e-4) {
        q.setFromAxisAngle(tmp.copy(b.spinV).divideScalar(w), w * dt);
        b.mesh.quaternion.premultiply(q);
      }
      b.mesh.position.copy(b.pos);
    }
  }

  function randInt(k: number) {
    const a = new Uint32Array(1);
    crypto.getRandomValues(a);
    return (a[0] ?? 0) % k;
  }
  function shuffle<T>(arr: T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      const left = a[i];
      const right = a[j];
      if (left === undefined || right === undefined) continue;
      a[i] = right;
      a[j] = left;
    }
    return a;
  }
  const available = () => balls.filter((b) => !b.removed && !b.out);
  const setStatus = (t: string) => {
    ui.status.textContent = t;
  };
  let toastTimer = 0;
  function toast(t: string) {
    ui.toast.textContent = t;
    ui.toast.style.opacity = "1";
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      ui.toast.style.opacity = "0";
    }, 2200);
  }
  function refreshCounts() {
    ui.total.textContent = String(balls.length);
    ui.left.textContent = String(balls.filter((b) => !b.removed && !b.out).length);
  }
  function report(names: string[]) {
    if (alive) options.onWinners(names);
  }
  function setBusy(v: boolean) {
    busy = v;
    ui.start.disabled = v;
    ui.reset.disabled = v;
    ui.update.disabled = v;
    if (!v) {
      setStatus(shown.length ? "Press Start to draw again" : `Ready · ${available().length} balls`);
      if (pending) {
        const next = pending;
        pending = null;
        applyNames(next);
      }
    }
  }
  function updateResultLabel() {
    const x = +ui.drawN.value || 0;
    const e = +ui.elimN.value || 0;
    const w = x - e;
    ui.result.textContent = w > 0 ? `${w} winner${w > 1 ? "s" : ""}` : "—";
  }
  function layout(count: number) {
    const sp = Math.min(2.2, 9 / Math.max(count, 1));
    const radius = sp * 0.4;
    const slots: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) slots.push(V((i - (count - 1) / 2) * sp, 2.6, 6.4));
    const t = Math.tan(THREE.MathUtils.degToRad(20));
    const width = (count - 1) * sp + 2 * radius + 1.6;
    const d = Math.max(width / 2 / (t * camera.aspect), (2 * radius) / (0.6 * t), 5.5);
    const target = V(0, 2.6 - d * t * 0.3, 6.4);
    return { slots, r: radius, target, camPos: V(0, target.y + 0.3, 6.4 + d) };
  }
  function faceQuat(pos: THREE.Vector3, lookAt: THREE.Vector3) {
    const o = new THREE.Object3D();
    o.position.copy(pos);
    o.lookAt(lookAt);
    return o.quaternion.clone();
  }
  function slotAt(slots: THREE.Vector3[], index: number): THREE.Vector3 {
    const slot = slots[index];
    if (!slot) throw new Error("Lucky draw slot missing");
    return slot;
  }
  function extractTo(b: Ball, slot: THREE.Vector3, radius: number, camPos: THREE.Vector3) {
    return new Promise<void>((res) => {
      b.kin = true;
      b.inDrum = true;
      b.out = true;
      b.vel.set(0, 0, 0);
      const curve = new THREE.CatmullRomCurve3(
        [
          b.pos.clone(),
          C.clone().addScaledVector(EXIT, R * 0.5),
          ...TUBE,
          V(slot.x * 0.5, 1.7, 5.8),
          slot,
        ],
        false,
        "centripetal",
      );
      const qFace = faceQuat(slot, camPos);
      const prev = b.pos.clone();
      const p = { t: 0 };
      const axis = V(0, 0, 0);
      const down = V(0, -1, 0);
      const step = V(0, 0, 0);
      let qFrom: THREE.Quaternion | null = null;
      gsap.to(p, {
        t: 1,
        duration: 3,
        ease: "power1.inOut",
        onUpdate() {
          curve.getPointAt(p.t, b.pos);
          b.inDrum = p.t < 0.25;
          if (p.t < 0.72) {
            step.subVectors(b.pos, prev);
            const L = step.length();
            if (L > 1e-5) {
              axis.crossVectors(step, down).normalize();
              q.setFromAxisAngle(axis, L / b.r);
              b.mesh.quaternion.premultiply(q);
            }
          } else {
            qFrom ??= b.mesh.quaternion.clone();
            const k = (p.t - 0.72) / 0.28;
            b.mesh.quaternion.slerpQuaternions(qFrom, qFace, k);
            b.mesh.scale.setScalar(b.r + (radius - b.r) * k);
          }
          prev.copy(b.pos);
          b.mesh.position.copy(b.pos);
        },
        onComplete() {
          b.inDrum = false;
          burst(slot.clone(), V(0, 1, 0), 30, 4);
          res();
        },
      });
    });
  }
  function eliminate(b: Ball) {
    setStatus(`Eliminated: ${b.name}`);
    const tl = gsap.timeline();
    tl.to(b.mat, { emissiveIntensity: 0.9, duration: 0.12, yoyo: true, repeat: 5 })
      .to(b.mesh.position, { x: "+=0.12", duration: 0.05, yoyo: true, repeat: 9 }, 0)
      .set(b.mat, { emissiveIntensity: 0.6 })
      .to(b.mesh.position, { y: -1, duration: 0.8, ease: "power2.in" })
      .to(b.mesh.scale, { x: 0, y: 0, z: 0, duration: 0.8, ease: "power2.in" }, "<");
    return tl.then(() => {
      b.mesh.visible = false;
      b.eliminated = true;
    });
  }
  function showWinners(ws: Ball[], outs: Ball[]) {
    ui.wTitle.textContent = ws.length > 1 ? "WINNERS" : "WINNER";
    ui.wNames.replaceChildren();
    const size =
      ws.length === 1
        ? "clamp(54px,10vw,128px)"
        : ws.length <= 3
          ? "clamp(36px,6vw,80px)"
          : "clamp(24px,3.8vw,50px)";
    for (const b of ws) {
      const s = document.createElement("span");
      s.textContent = b.name;
      s.style.fontSize = size;
      ui.wNames.appendChild(s);
    }
    gsap.set(ui.winner, { visibility: "visible", opacity: 1 });
    gsap.fromTo(
      ui.wTitle,
      { opacity: 0, letterSpacing: "1em" },
      { opacity: 1, letterSpacing: "0.4em", duration: 0.8 },
    );
    gsap.fromTo(
      Array.from(ui.wNames.children),
      { opacity: 0, y: 50, scale: 0.4 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(2)", stagger: 0.12 },
    );
    const P = V(0, 2.6, 6.4);
    burst(P, V(0, 0.8, 0.3), 180, 9);
    burst(V(-5, 0.8, 6.4), V(0.9, 1.4, 0), 120, 11);
    burst(V(5, 0.8, 6.4), V(-0.9, 1.4, 0), 120, 11);
    gsap.to(winSpot, { intensity: 1.6 * LIGHT, duration: 0.8 });
    round += 1;
    const li = document.createElement("li");
    const title = document.createElement("b");
    title.textContent = `Round ${round}: `;
    const names = document.createElement("span");
    names.textContent = ws.map((b) => b.name).join(", ");
    li.append(title, names);
    if (outs.length) {
      li.append(document.createElement("br"));
      const struck = document.createElement("s");
      struck.textContent = `Out: ${outs.map((b) => b.name).join(", ")}`;
      li.append(struck);
    }
    ui.history.appendChild(li);
    ui.history.scrollTop = 1e6;
    report(ws.map((b) => b.name));
  }
  function backToDrum(b: Ball) {
    gsap.killTweensOf(b.mesh.scale);
    gsap.killTweensOf(b.mesh.position);
    gsap.killTweensOf(b.mat);
    b.kin = false;
    b.out = false;
    b.eliminated = false;
    b.inDrum = true;
    b.mat.emissiveIntensity = 0;
    b.pos.set(C.x + (Math.random() - 0.5), C.y + R - b.r - 0.4, C.z + (Math.random() - 0.5));
    b.vel.set(0, -1, 0);
    b.mesh.position.copy(b.pos);
    b.mesh.visible = true;
    gsap.fromTo(
      b.mesh.scale,
      { x: 0, y: 0, z: 0 },
      { x: b.r, y: b.r, z: b.r, duration: 0.5, ease: "back.out(2)" },
    );
  }
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  async function clearStage() {
    gsap.to(ui.winner, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => gsap.set(ui.winner, { visibility: "hidden" }),
    });
    gsap.to(winSpot, { intensity: 0, duration: 0.5 });
    report([]);
    for (const b of shown) {
      if (!b.eliminated && ui.remove.checked) {
        b.removed = true;
        gsap.to(b.mesh.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.5,
          ease: "back.in(2)",
          onComplete: () => {
            b.mesh.visible = false;
          },
        });
      } else backToDrum(b);
    }
    shown = [];
    camTo(HOME.pos, HOME.target, 1.2);
    gsap.to(fx, { sway: 1, duration: 1.5 });
    refreshCounts();
    await wait(800);
  }
  async function startDraw() {
    if (!alive || busy) return;
    const X = Math.floor(+ui.drawN.value);
    const N = Math.floor(+ui.elimN.value) || 0;
    if (!(X >= 1 && X <= MAX_DRAW)) {
      toast(`Draw must be between 1 and ${MAX_DRAW}`);
      return;
    }
    if (N < 0 || N >= X) {
      toast("Eliminate must be smaller than Draw");
      return;
    }
    setBusy(true);
    if (shown.length) await clearStage();
    const pool = available();
    if (X > pool.length) {
      setBusy(false);
      toast(`Only ${pool.length} ball(s) left in the machine`);
      return;
    }
    setStatus("Mixing...");
    gsap.to(fx, { sway: 0, party: 1, shake: 1, duration: 1 });
    gsap.to(sim, { spin: 3.2, jet: 1, duration: 0.9, ease: "power2.in" });
    camTo(V(0.8, 4.3, 10.6), V(0, 3.4, 0), 3.5, "sine.inOut");
    await wait(3500);
    if (!alive) return;
    setStatus("Slowing down...");
    gsap.to(sim, { jet: 0, duration: 1.1 });
    gsap.to(sim, { spin: 0.4, duration: 1.6 });
    gsap.to(fx, { shake: 0, party: 0, duration: 1.2 });
    await wait(900);
    if (!alive) return;
    const picked = shuffle(pool).slice(0, X);
    const view = layout(X);
    setStatus(`Drawing ${X} ball${X > 1 ? "s" : ""}...`);
    camTo(view.camPos, view.target, 2.6, "power2.inOut", 0);
    shown = picked.slice();
    refreshCounts();
    await Promise.all(
      picked.map((b, i) =>
        wait(i * 650).then(() => extractTo(b, slotAt(view.slots, i), view.r, view.camPos)),
      ),
    );
    if (!alive) return;
    gsap.to(sim, { spin: 0, duration: 1.5 });
    let winners = picked;
    let outs: Ball[] = [];
    if (N > 0) {
      await wait(700);
      if (!alive) return;
      outs = shuffle(picked).slice(0, N);
      for (const b of outs) {
        await eliminate(b);
        await wait(250);
        if (!alive) return;
      }
      winners = picked.filter((b) => !outs.includes(b));
      const next = layout(winners.length);
      winners.forEach((b, i) => {
        const s = next.slots[i];
        if (!s) return;
        const q0 = b.mesh.quaternion.clone();
        const q1 = faceQuat(s, next.camPos);
        const k = { v: 0 };
        gsap.to(b.mesh.position, { x: s.x, y: s.y, z: s.z, duration: 1, ease: "power2.inOut" });
        gsap.to(b.mesh.scale, {
          x: next.r,
          y: next.r,
          z: next.r,
          duration: 1,
          ease: "power2.inOut",
        });
        gsap.to(k, {
          v: 1,
          duration: 1,
          onUpdate: () => b.mesh.quaternion.slerpQuaternions(q0, q1, k.v),
        });
      });
      camTo(next.camPos, next.target, 1.2, "power2.inOut", 0);
      await wait(1100);
      if (!alive) return;
    }
    showWinners(winners, outs);
    setBusy(false);
    setStatus(
      `${winners.length > 1 ? "Winners" : "Winner"}: ${winners.map((b) => b.name).join(", ")}`,
    );
  }
  async function resetAll() {
    if (!alive || busy) return;
    setBusy(true);
    gsap.to(ui.winner, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => gsap.set(ui.winner, { visibility: "hidden" }),
    });
    gsap.to(winSpot, { intensity: 0, duration: 0.5 });
    gsap.to(sim, { spin: 0, jet: 0, duration: 0.4 });
    gsap.to(fx, { sway: 1, shake: 0, party: 0, duration: 1 });
    camTo(HOME.pos, HOME.target, 1.2);
    report([]);
    for (const b of balls) {
      gsap.killTweensOf(b.mesh.scale);
      gsap.killTweensOf(b.mesh.position);
      gsap.killTweensOf(b.mat);
      b.removed = false;
      b.out = false;
      b.kin = false;
      b.eliminated = false;
      b.inDrum = true;
      b.mat.emissiveIntensity = 0;
    }
    shown = [];
    scatter(balls);
    refreshCounts();
    await wait(700);
    if (alive) setBusy(false);
  }
  function cleanNames(list: string[]) {
    return list
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, MAX_BALLS);
  }
  function sameNames(list: string[]) {
    return list.length === balls.length && list.every((name, i) => balls[i]?.name === name);
  }
  function applyNames(list: string[]) {
    ui.names.value = list.join("\n");
    gsap.to(ui.winner, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => gsap.set(ui.winner, { visibility: "hidden" }),
    });
    gsap.to(winSpot, { intensity: 0, duration: 0.5 });
    camTo(HOME.pos, HOME.target, 1.2);
    gsap.to(fx, { sway: 1, duration: 1 });
    rebuildBalls(list);
    report([]);
    setStatus(list.length ? `Ready · ${list.length} balls` : "The list is empty");
  }
  async function updateList() {
    if (!alive || busy) return;
    let list = cleanNames(ui.names.value.split("\n"));
    const rawCount = ui.names.value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean).length;
    if (rawCount > MAX_BALLS) {
      toast(`Max ${MAX_BALLS} names. Using the first ${MAX_BALLS}.`);
      list = list.slice(0, MAX_BALLS);
    }
    applyNames(list);
    toast(list.length ? `Updated: ${list.length} balls` : "The list is empty");
  }
  function setNames(names: string[]) {
    const list = cleanNames(names);
    if (sameNames(list) && ui.names.value.trim() === list.join("\n")) return;
    if (busy) {
      pending = list;
      return;
    }
    applyNames(list);
  }

  const clock = new THREE.Clock();
  const offset = V(0, 0, 0);
  const rainbow = new THREE.Color();
  let frame = 0;
  function animate() {
    if (!alive) return;
    frame = requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 1 / 30);
    const t = clock.elapsedTime;
    stepPhysics(dt);
    rotor.rotation.y += sim.spin * dt;
    jetMat.opacity = sim.jet * 0.85;
    nozzleMat.opacity = 0.25 + sim.jet * 0.75;
    if (sim.jet > 0.01) {
      for (let i = 0; i < JET_N; i++) {
        const yIndex = i * 3 + 1;
        jetPos[yIndex] = (jetPos[yIndex] ?? 0) + (jetSpd[i] ?? 0) * dt * (0.6 + sim.jet);
        const x = jetPos[i * 3] ?? 0;
        const y = jetPos[yIndex] ?? 0;
        const z = jetPos[i * 3 + 2] ?? 0;
        if (y > R * 0.85 || x * x + y * y + z * z > (R - 0.1) ** 2) respawnJet(i, false);
      }
      const position = jetGeo.attributes["position"];
      if (position) position.needsUpdate = true;
    }
    const breathe = 0.5 + 0.5 * Math.sin(t * 1.6);
    innerLight.intensity =
      LIGHT * (0.5 + breathe * 0.5 + fx.party * 1.5 * Math.abs(Math.sin(t * 9)));
    const glowMat = glowRing.material;
    if (glowMat instanceof THREE.MeshBasicMaterial) glowMat.opacity = 0.4 + breathe * 0.5;
    gem.scale.setScalar(1 + breathe * 0.15);
    rimL.intensity = LIGHT * (1.2 + fx.party * 1.5 * (0.5 + 0.5 * Math.sin(t * 11)));
    rimR.intensity = LIGHT * (1.2 + fx.party * 1.5 * (0.5 + 0.5 * Math.sin(t * 11 + Math.PI)));
    beams.forEach((bm, i) => {
      rainbow.setHSL((t * 0.35 + i * 0.3) % 1, 0.9, 0.6);
      const colorUniform = bm.mat.uniforms["uColor"];
      const opacityUniform = bm.mat.uniforms["uOpacity"];
      if (colorUniform?.value instanceof THREE.Color)
        colorUniform.value.copy(bm.base).lerp(rainbow, fx.party);
      if (opacityUniform) opacityUniform.value = 0.15 + breathe * 0.05 + fx.party * 0.12;
    });
    updateConfetti(dt, t);
    const fit = 1 + (fitFactor() - 1) * cam.fit;
    offset.subVectors(cam.pos, cam.target).multiplyScalar(fit);
    camera.position.copy(cam.target).add(offset);
    camera.position.x +=
      Math.sin(t * 0.23) * 0.7 * fx.sway + (Math.sin(t * 37) + Math.sin(t * 23)) * 0.03 * fx.shake;
    camera.position.y +=
      Math.sin(t * 0.31) * 0.25 * fx.sway + (Math.sin(t * 41) + Math.cos(t * 29)) * 0.03 * fx.shake;
    camera.lookAt(cam.target);
    renderer.render(scene, camera);
  }
  function resize() {
    const w = Math.max(root.clientWidth, 1);
    const h = Math.max(root.clientHeight, 1);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  function togglePanel(show?: boolean) {
    const next = show ?? ui.panel.classList.contains("is-hidden");
    ui.panel.classList.toggle("is-hidden", !next);
    ui.open.style.display = next ? "none" : "block";
  }
  let pointerInside = false;
  function onEnter() {
    pointerInside = true;
  }
  function onLeave() {
    pointerInside = false;
  }
  function onKey(e: KeyboardEvent) {
    const active = document.activeElement;
    if (
      active instanceof HTMLElement &&
      ["TEXTAREA", "INPUT", "SELECT", "BUTTON"].includes(active.tagName)
    )
      return;
    if (!pointerInside && !root.contains(active)) return;
    if (e.code === "Space") {
      e.preventDefault();
      void startDraw();
    } else if (e.key.toLowerCase() === "r") void resetAll();
    else if (e.key.toLowerCase() === "h") togglePanel();
  }
  ui.start.addEventListener("click", () => void startDraw());
  ui.reset.addEventListener("click", () => void resetAll());
  ui.update.addEventListener("click", () => void updateList());
  ui.close.addEventListener("click", () => togglePanel(false));
  ui.open.addEventListener("click", () => togglePanel(true));
  ui.drawN.addEventListener("input", updateResultLabel);
  ui.elimN.addEventListener("input", updateResultLabel);
  root.addEventListener("pointerenter", onEnter);
  root.addEventListener("pointerleave", onLeave);
  window.addEventListener("keydown", onKey);
  const observer = new ResizeObserver(() => resize());
  observer.observe(root);

  applyNames(cleanNames(options.names));
  updateResultLabel();
  resize();
  if (root.clientWidth < 760) togglePanel(false);
  setBusy(false);
  animate();

  return {
    setNames,
    dispose() {
      alive = false;
      cancelAnimationFrame(frame);
      window.clearTimeout(toastTimer);
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([cam.pos, cam.target, cam, fx, sim, winSpot, ui.winner, ui.wTitle]);
      for (const b of balls) {
        gsap.killTweensOf([b.mesh.scale, b.mesh.position, b.mat, b.mesh.quaternion]);
        b.mat.map?.dispose();
      }
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) geometries.add(mesh.geometry);
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((item) => materials.add(item));
        else if (material) materials.add(material);
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      envTarget.dispose();
      DOT.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      root.replaceChildren();
    },
  };
}

function ensureStyle() {
  if (document.getElementById("ld-draw-style")) return;
  const style = document.createElement("style");
  style.id = "ld-draw-style";
  style.textContent = CSS;
  document.head.append(style);
}

function must<T extends Element>(root: HTMLElement, selector: string): T {
  const node = root.querySelector(selector);
  if (!node) throw new Error(`Lucky draw is missing ${selector}`);
  return node as T;
}
