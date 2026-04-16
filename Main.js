(function () {
  "use strict";

  // ═══ MOBILE DETECTION + BUDGETS ═══
  const IS_MOBILE =
    /Mobi|Android/i.test(navigator.userAgent) || innerWidth < 768;
  const STAR_COUNT = IS_MOBILE ? 350 : 800;
  const EPARTS_MAX = IS_MOBILE ? 12 : 35;
  const EPARTS_CHANCE = IS_MOBILE ? 0.08 : 0.18;
  const DEBRIS_DOTS = IS_MOBILE ? 500 : 1200;

  // ═══ CONSTANTS ═══
  const N = 20,
    G = "rgba(212,165,74,";
  const RINGS = [
    { ids: [0, 1, 2, 3, 4], r: 0.55, spd: 8 },
    { ids: [5, 6, 7, 8, 9, 10, 11], r: 0.78, spd: 5 },
    { ids: [12, 13, 14, 15, 16, 17, 18, 19], r: 0.93, spd: 3 },
  ];
  const DUR = { DARK: 80, CHARGE: 160, EXPLODE: 380, EXPAND: 120 };
  const BRANDS = [
    "YAHOO",
    "AOL",
    "NAPSTER",
    "ALTAVISTA",
    "NETSCAPE",
    "LYCOS",
    "GEOCITIES",
    "ASK JEEVES",
    "EXCITE",
    "MYSPACE",
    "FRIENDSTER",
    "ICQ",
    "LIMEWIRE",
    "REALPLAYER",
    "WEBCRAWLER",
    "HOTBOT",
    "DOGPILE",
    "INFOSEEK",
    "COMPUSERVE",
    "PRODIGY",
    "MOZILLA",
    "IE6",
    "FLASH",
    "JAVA",
    "HTML",
    "HTTP",
    "TCP/IP",
    "DNS",
    "FTP",
    "SMTP",
    "RSS",
    "XML",
    "CSS",
    "PHP",
    "MYSQL",
    "APACHE",
    "LINUX",
  ];

  let W,
    H,
    cx,
    cy,
    fr = 0,
    pt = 0,
    phase = 4,
    shk = 0;

  let stars = [],
    debris = [],
    smoke = [],
    eParts = [],
    flares = [],
    targets = [],
    els = [];
  let mouse = { x: -100, y: -100, tx: -100, ty: -100 };
  let trailPts = [];

  // FIX: cached DOM refs — never queried inside the animation loop
  let elGlows = [],
    elBoxes = [],
    elSizes = [];

  // FIX: offscreen nebula canvas — painted every 3 frames, blitted with drawImage
  let nebCanvas,
    nebCtx,
    nebDirty = true,
    nebFrameSkip = 0;

  // FIX: FPS cap — consistent 60fps on 60/90/120/144Hz displays
  const TARGET_FRAME_MS = 1000 / 60;
  let lastFrameTime = 0;

  // FIX: rAF guard — prevents double-fire
  let rafId = null;

  let bgPhase = 0,
    bgTimer = 0;

  // ═══ DOM REFERENCES ═══
  const wrap = document.getElementById("wrap");
  const cBg = document.getElementById("cBg"),
    cFx = document.getElementById("cFx");
  const bg = cBg.getContext("2d"),
    fx = cFx.getContext("2d");

  const vBg1 = document.getElementById("vBg1") || { style: {} };

  const cursorEl = document.getElementById("cursor"),
    dotEl = document.getElementById("cursorDot");
  const trailCanvas = document.getElementById("glowTrail"),
    trailCtx = trailCanvas.getContext("2d");

  // ═══ CURSOR MODULE ═══
  document.addEventListener("mousemove", (e) => {
    mouse.tx = e.clientX;
    mouse.ty = e.clientY;
  });

  document.querySelectorAll("a,.nav-cta,.sb1,.sb2").forEach((el) => {
    el.addEventListener("mouseenter", () => cursorEl.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursorEl.classList.remove("hover"));
  });

  function init() {
    els = [];
    elGlows = [];
    elBoxes = [];
    elSizes = [];
    for (let i = 0; i < N; i++) {
      const el = document.getElementById("n" + i);
      els.push(el);
      elGlows.push(el ? el.querySelector(".nd-glow") : null);
      elBoxes.push(el ? el.querySelector(".nd-box") : null);
    }
    resize();
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);

    setTimeout(() => {
      vBg1.style.opacity = "1";
      for (let i = 0; i < N; i++) {
        posIcon(i, targets[i].x, targets[i].y);
        showIcon(i, 1);
      }
      document.getElementById("sun").classList.add("on");
    }, 300);
  }

  function updateCursor() {
    mouse.x += (mouse.tx - mouse.x) * 0.12;
    mouse.y += (mouse.ty - mouse.y) * 0.12;
    cursorEl.style.left = mouse.x + "px";
    cursorEl.style.top = mouse.y + "px";
    dotEl.style.left = mouse.tx + "px";
    dotEl.style.top = mouse.ty + "px";

    // Trail
    // FIX: trailCanvas is sized in resize() only — NOT here every frame
    trailPts.push({ x: mouse.tx, y: mouse.ty, a: 1 });
    if (trailPts.length > 25) trailPts.shift();
    trailCtx.clearRect(0, 0, W, H);
    for (let i = 0; i < trailPts.length; i++) {
      const p = trailPts[i];
      p.a *= 0.88;
      if (p.a < 0.01) continue;
      const g = trailCtx.createRadialGradient(
        p.x,
        p.y,
        0,
        p.x,
        p.y,
        12 + i * 0.5,
      );
      g.addColorStop(0, `rgba(212,165,74,${p.a * 0.15})`);
      g.addColorStop(1, "transparent");
      trailCtx.beginPath();
      trailCtx.arc(p.x, p.y, 12 + i * 0.5, 0, 6.28);
      trailCtx.fillStyle = g;
      trailCtx.fill();
    }
  }

  // ═══ RESIZE ═══
  function resize() {
    W = cBg.width = cFx.width = innerWidth;
    H = cBg.height = cFx.height = innerHeight;
    cx = W / 2;
    cy = H / 2;

    // FIX: trail canvas sized here — never in updateCursor()
    trailCanvas.width = W;
    trailCanvas.height = H;

    // Rebuild stars using mobile-aware budget
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++)
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 0.5 + 0.1,
        b: Math.random() * 0.2 + 0.02,
        a: 0,
        tw: (Math.random() - 0.5) * 0.003,
      });

    flares = [];
    for (let i = 0; i < 12; i++)
      flares.push({
        a: (i / 12) * 6.28,
        l: 50 + Math.random() * 90,
        s: 0.002 + Math.random() * 0.004,
        p: Math.random() * 6.28,
        w: 2 + Math.random() * 5,
      });

    // Rebuild icon targets — clamp orbit radii to keep icons on screen
    targets = new Array(N);
    const base = Math.min(W, H) / 2;
    // On small screens reduce the horizontal spread to prevent clipping
    const xScale = W < 600 ? 1.15 : W < 900 ? 1.3 : 1.45;
    const yScale = W < 600 ? 0.95 : W < 900 ? 0.78 : 0.82;
    for (const r of RINGS) {
      const c = r.ids.length;
      for (let i = 0; i < c; i++) {
        const a = (i / c) * 6.28 - 1.57;
        targets[r.ids[i]] = {
          x: cx + Math.cos(a) * base * r.r * xScale,
          y: cy + Math.sin(a) * base * r.r * yScale,
        };
      }
    }

    // FIX: cache element sizes here — no offsetWidth reads inside the render loop
    const dynSz = Math.round(Math.min(Math.min(W, H) * 0.065, 76));
    const dynH = Math.round(dynSz * 1.18);
    for (let i = 0; i < N; i++) {
      if (els[i]) {
        elSizes[i] = {
          w: els[i].offsetWidth || dynSz,
          h: els[i].offsetHeight || dynH,
        };
      }
    }

    // FIX: rebuild offscreen nebula canvas to match new viewport size
    nebCanvas = document.createElement("canvas");
    nebCanvas.width = W;
    nebCanvas.height = H;
    nebCtx = nebCanvas.getContext("2d");
    nebDirty = true;
  }

  // ═══ NEBULA DATA ═══
  const NEBS = [
    // Purple + Magenta
    [
      { x: 0.22, y: 0.28, s: 0.5, r: 120, g: 30, b: 200, a: 0.22 },
      { x: 0.78, y: 0.22, s: 0.4, r: 200, g: 30, b: 140, a: 0.18 },
      { x: 0.25, y: 0.75, s: 0.4, r: 20, g: 50, b: 200, a: 0.14 },
      { x: 0.5, y: 0.5, s: 0.12, r: 200, g: 130, b: 40, a: 0.15 },
      { x: 0.5, y: 0.5, s: 0.06, r: 212, g: 165, b: 74, a: 0.2 },
      { x: 0.85, y: 0.6, s: 0.25, r: 15, g: 130, b: 160, a: 0.08 },
      { x: 0.6, y: 0.15, s: 0.2, r: 180, g: 25, b: 100, a: 0.08 },
      { x: 0.1, y: 0.6, s: 0.18, r: 150, g: 20, b: 120, a: 0.06 },
    ],
    // Red Cosmos
    [
      { x: 0.3, y: 0.35, s: 0.5, r: 180, g: 20, b: 40, a: 0.22 },
      { x: 0.75, y: 0.25, s: 0.4, r: 160, g: 30, b: 80, a: 0.16 },
      { x: 0.2, y: 0.7, s: 0.35, r: 200, g: 50, b: 30, a: 0.12 },
      { x: 0.5, y: 0.5, s: 0.2, r: 200, g: 120, b: 30, a: 0.14 },
      { x: 0.5, y: 0.5, s: 0.08, r: 230, g: 160, b: 50, a: 0.2 },
      { x: 0.8, y: 0.65, s: 0.3, r: 140, g: 20, b: 60, a: 0.1 },
      { x: 0.15, y: 0.2, s: 0.2, r: 180, g: 15, b: 50, a: 0.08 },
      { x: 0.65, y: 0.12, s: 0.2, r: 160, g: 30, b: 60, a: 0.06 },
    ],
  ];

  let nebIdx = 0,
    nebFade = 0;

  // ═══ BACKGROUND ═══
  // FIX: nebula painted to offscreen canvas every 3 frames only,
  // then blitted with a single drawImage call — replaces 9+ gradient fillRects per frame
  function paintNebulaOffscreen() {
    const n1 = NEBS[nebIdx % NEBS.length],
      n2 = NEBS[(nebIdx + 1) % NEBS.length];

    const base = nebCtx.createRadialGradient(
      cx,
      cy * 0.85,
      0,
      cx,
      cy,
      Math.max(W, H) * 0.75,
    );
    base.addColorStop(0, "#180838");
    base.addColorStop(0.3, "#100628");
    base.addColorStop(0.6, "#0a041c");
    base.addColorStop(1, "#030110");
    nebCtx.fillStyle = base;
    nebCtx.fillRect(0, 0, W, H);

    function drawScheme(clouds, alpha) {
      for (const c of clouds) {
        const g = nebCtx.createRadialGradient(
          W * c.x,
          H * c.y,
          0,
          W * c.x,
          H * c.y,
          Math.max(W, H) * c.s,
        );
        g.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${c.a * alpha})`);
        g.addColorStop(0.35, `rgba(${c.r},${c.g},${c.b},${c.a * alpha * 0.5})`);
        g.addColorStop(0.7, `rgba(${c.r},${c.g},${c.b},${c.a * alpha * 0.12})`);
        g.addColorStop(1, "transparent");
        nebCtx.fillStyle = g;
        nebCtx.fillRect(0, 0, W, H);
      }
    }

    drawScheme(n1, 1 - nebFade);
    drawScheme(n2, nebFade);

    const v = nebCtx.createRadialGradient(
      cx,
      cy,
      0,
      cx,
      cy,
      Math.max(W, H) * 0.6,
    );
    v.addColorStop(0, "transparent");
    v.addColorStop(0.55, "rgba(3,1,10,.1)");
    v.addColorStop(1, "rgba(3,1,10,.6)");
    nebCtx.fillStyle = v;
    nebCtx.fillRect(0, 0, W, H);

    nebDirty = false;
  }

  function paintCosmos() {
    if (phase < 3) {
      bg.fillStyle = "#030110";
      bg.fillRect(0, 0, W, H);
      return;
    }
    nebFade += 0.004;
    if (nebFade >= 1) {
      nebFade = 0;
      nebIdx++;
    }
    nebFrameSkip++;
    if (nebDirty || nebFrameSkip >= 3) {
      paintNebulaOffscreen();
      nebFrameSkip = 0;
    }
    bg.drawImage(nebCanvas, 0, 0);
  }

  // ═══ STARS ═══
  function drawStars(o) {
    for (const s of stars) {
      s.a += s.tw;
      if (s.a > s.b + 0.06 || s.a < 0.01) s.tw *= -1;
      bg.beginPath();
      bg.arc(s.x, s.y, s.r, 0, 6.28);
      bg.fillStyle = `rgba(220,225,255,${Math.max(0, s.a * (o || 1))})`;
      bg.fill();
    }
  }

  // ═══ DRAWING MODULES ═══
  function drawTendril(x1, y1, x2, y2, idx, alpha, width, hi) {
    const dx = x2 - x1,
      dy = y2 - y1,
      d = Math.hypot(dx, dy);
    if (d < 15) return;
    const steps = Math.max(10, (d / 14) | 0),
      px = -dy / d,
      py = dx / d,
      a = Math.min(0.9, alpha * (hi || 1));
    fx.beginPath();
    fx.moveTo(x1, y1);
    for (let i = 1; i <= steps; i++) {
      const t = i / steps,
        bx = x1 + dx * t,
        by = y1 + dy * t;
      const w =
        Math.sin(t * 5 + fr * 0.003 + idx * 2) *
          22 *
          (1 - Math.abs(t - 0.5) * 1.8) +
        Math.sin(t * 9 + fr * 0.005 + idx * 3) * 8 * t;
      fx.lineTo(bx + px * w, by + py * w);
    }
    const g = fx.createLinearGradient(x1, y1, x2, y2);
    g.addColorStop(0, G + a + ")");
    g.addColorStop(0.3, G + a * 0.55 + ")");
    g.addColorStop(1, G + a * 0.12 + ")");
    fx.strokeStyle = g;
    fx.lineWidth = width;
    fx.stroke();
    fx.save();
    fx.globalAlpha = 0.2;
    fx.strokeStyle = G + a * 0.15 + ")";
    fx.lineWidth = width * 4;
    fx.stroke();
    fx.restore();
  }

  function drawFlares(int) {
    for (const f of flares) {
      const a = f.a + Math.sin(fr * 0.001 + f.p) * 0.4,
        l = (f.l + Math.sin(fr * 0.002 + f.p) * 35) * int;
      fx.beginPath();
      fx.moveTo(cx, cy);
      fx.quadraticCurveTo(
        cx + Math.cos(a + 0.35) * l * 0.55,
        cy + Math.sin(a + 0.35) * l * 0.55,
        cx + Math.cos(a) * l,
        cy + Math.sin(a) * l,
      );
      const g = fx.createLinearGradient(
        cx,
        cy,
        cx + Math.cos(a) * l,
        cy + Math.sin(a) * l,
      );
      g.addColorStop(0, G + 0.12 * int + ")");
      g.addColorStop(1, "transparent");
      fx.strokeStyle = g;
      fx.lineWidth = f.w * int;
      fx.stroke();
    }
  }

  function drawCorona(i) {
    for (let r = 200; r > 0; r -= 5) {
      fx.beginPath();
      fx.arc(cx, cy, r, 0, 6.28);
      fx.fillStyle = G + (1 - r / 200) * 0.04 * i + ")";
      fx.fill();
    }
    fx.beginPath();
    fx.arc(cx, cy, 6, 0, 6.28);
    fx.fillStyle = `rgba(255,240,180,${0.3 * i})`;
    fx.shadowColor = "rgba(212,165,74,.4)";
    fx.shadowBlur = 25;
    fx.fill();
    fx.shadowBlur = 0;
  }

  // ═══ ICON HELPERS ═══
  // FIX: elSizes — no offsetWidth reads inside the animation loop
  function posIcon(id, x, y) {
    const e = els[id];
    if (!e) return;
    const sz = elSizes[id] || { w: 76, h: 90 };
    e.style.left = x - sz.w / 2 + "px";
    e.style.top = y - sz.h / 2 + "px";
  }

  // FIX: elGlows cached ref — no querySelector inside the animation loop
  function showIcon(id, o) {
    const e = els[id];
    if (!e) return;
    e.style.opacity = Math.min(1, o);
    if (o > 0.5) {
      if (elGlows[id]) elGlows[id].style.opacity = ".2";
      e.classList.add("live");
    }
  }

  function applyShake() {
    if (shk > 0.1) {
      wrap.style.transform = `translate(${(Math.random() - 0.5) * shk}px,${(Math.random() - 0.5) * shk}px)`;
      shk *= 0.93;
    } else {
      wrap.style.transform = "";
      shk = 0;
    }
  }

  // ═══ MAGNETIC ICONS ═══
  // FIX: elSizes + elBoxes — no offsetWidth or querySelector in loop
  function applyMagnetic() {
    if (phase < 4) return;
    for (let i = 0; i < N; i++) {
      const el = els[i];
      if (!el || !el.classList.contains("live")) continue;

      const sz = elSizes[i] || { w: 80, h: 90 };
      const ix = parseFloat(el.style.left || 0) + sz.w / 2;
      const iy = parseFloat(el.style.top || 0) + sz.h / 2;
      const dx = mouse.tx - ix,
        dy = mouse.ty - iy,
        d = Math.hypot(dx, dy);
      const box = elBoxes[i];

      if (d < 150 && d > 1) {
        const pull = Math.max(0, (150 - d) / 150) * 10;
        if (box)
          box.style.transform = `translate(${(dx / d) * pull}px,${(dy / d) * pull}px) scale(1.05)`;
      } else {
        if (box) box.style.transform = "";
      }
    }
  }

  // ═══ MAIN LOOP ═══
  // FIX: timestamp-based FPS cap — consistent 60fps on all refresh rates
  // FIX: rafId stored — single rAF chain, no double-fire
  function tick(timestamp) {
    rafId = requestAnimationFrame(tick);
    const elapsed = timestamp - lastFrameTime;
    if (elapsed < TARGET_FRAME_MS - 1) return;
    lastFrameTime = timestamp - (elapsed % TARGET_FRAME_MS);
    fr++;
    pt++;
    fx.clearRect(0, 0, W, H);
    bg.clearRect(0, 0, W, H);
    paintCosmos();
    applyShake();
    updateCursor();
    applyMagnetic();
    switch (phase) {
      case 0:
        pDark();
        break;
      case 1:
        pCharge();
        break;
      case 2:
        pExplode();
        break;
      case 3:
        pExpand();
        break;
      case 4:
        pLive();
        break;
    }
  }

  // ═══ PHASES ═══
  function pDark() {
    drawStars(Math.min(1, pt / DUR.DARK));
    if (pt >= DUR.DARK) {
      phase = 1;
      pt = 0;
    }
  }

  function pCharge() {
    drawStars(1);
    const p = Math.min(1, pt / DUR.CHARGE),
      sc = 0.3 + p * 1.5,
      gl = p * p * p;

    for (let i = 0; i < 6; i++) {
      const r = (40 + i * 28) * sc;
      fx.beginPath();
      fx.arc(
        cx,
        cy,
        r,
        fr * (0.02 + p * 0.05) + i * 1.05,
        fr * (0.02 + p * 0.05) + i * 1.05 + 0.5 + p * 1.2,
      );
      fx.strokeStyle = G + (0.06 + gl * 0.1) + ")";
      fx.lineWidth = 1.5 + p * 2;
      fx.stroke();
    }

    for (let r = 250 * sc; r > 0; r -= 4) {
      fx.beginPath();
      fx.arc(cx, cy, r, 0, 6.28);
      fx.fillStyle = G + (1 - r / (250 * sc)) * (0.015 + gl * 0.04) + ")";
      fx.fill();
    }

    if (p > 0.25) {
      for (let i = 0; i < Math.floor(p * 18); i++) {
        const a = fr * 0.01 + i * 2.39,
          d = (1 - p) * 320 + 40;
        fx.beginPath();
        fx.arc(
          cx + Math.cos(a) * d * sc,
          cy + Math.sin(a) * d * sc * 0.7,
          1 + p * 2,
          0,
          6.28,
        );
        fx.fillStyle = `rgba(255,220,120,${p * 0.25})`;
        fx.fill();
      }
    }

    const vib = p > 0.85 ? (Math.random() - 0.5) * p * 5 : 0;
    fx.save();
    fx.translate(cx + vib, cy + vib);
    fx.scale(sc, sc);
    fx.globalAlpha = Math.min(1, p * 2.5);
    [
      { s: -0.4, e: 0.9, c: "#4285F4" },
      { s: 0.9, e: 1.6, c: "#34A853" },
      { s: 1.6, e: 2.3, c: "#FBBC05" },
      { s: 2.3, e: 2.7, c: "#EA4335" },
    ].forEach((sg) => {
      fx.beginPath();
      fx.arc(0, 0, 70, sg.s, sg.e);
      fx.strokeStyle = sg.c;
      fx.lineWidth = 24;
      fx.stroke();
    });
    fx.beginPath();
    fx.moveTo(0, 0);
    fx.lineTo(70, 0);
    fx.strokeStyle = "#4285F4";
    fx.lineWidth = 20;
    fx.stroke();
    fx.font = '700 14px "JetBrains Mono",monospace';
    fx.textAlign = "center";
    fx.fillStyle = `rgba(255,255,255,${0.4 * p})`;
    fx.fillText("THE SEARCH ALGORITHM", 0, 110);
    fx.restore();

    if (pt > DUR.CHARGE - 25) {
      const tp = (pt - (DUR.CHARGE - 25)) / 25;
      fx.fillStyle = `rgba(255,245,220,${tp * 0.2})`;
      fx.fillRect(0, 0, W, H);
      fx.beginPath();
      fx.arc(cx, cy, Math.max(0, 300 * (1 - tp)), 0, 6.28);
      fx.strokeStyle = `rgba(255,220,100,${tp * 0.35})`;
      fx.lineWidth = 3;
      fx.stroke();
    }

    if (pt >= DUR.CHARGE) {
      phase = 2;
      pt = 0;
      shk = 35;
      debris = [];
      // FIX: DEBRIS_DOTS respects mobile budget
      for (let i = 0; i < DEBRIS_DOTS; i++) {
        const a = Math.random() * 6.28,
          sp = 0.5 + Math.random() * 22;
        debris.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0,
          ml: 30 + Math.random() * 120,
          r: 0.3 + Math.random() * 3,
          br: Math.random() > 0.5,
          type: "dot",
        });
      }
      for (let i = 0; i < BRANDS.length; i++) {
        const a = (i / BRANDS.length) * 6.28 + Math.random() * 0.3,
          sp = 3 + Math.random() * 12;
        debris.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 0,
          ml: 80 + Math.random() * 120,
          r: 0,
          type: "brand",
          label: BRANDS[i],
          color: `hsl(${30 + Math.random() * 30},${70 + Math.random() * 30}%,${60 + Math.random() * 20}%)`,
          sz: 8 + Math.random() * 6,
        });
      }
    }
  }

  function pExplode() {
    const p = pt / DUR.EXPLODE;
    drawStars(1);

    if (pt === 1) {
      try {
        // vBang.currentTime = 0;
        // vBang.play().catch(() => {});
      } catch (e) {}
      vBg1.style.opacity = "0";
    }

    if (pt < 80) shk = Math.max(shk, (1 - pt / 80) * 25);
    if (pt < 30) {
      fx.fillStyle = `rgba(255,250,235,${1 - pt / 30})`;
      fx.fillRect(0, 0, W, H);
    }

    const fbR = Math.min(W, pt * 13),
      fbA = Math.max(0, 0.8 - p);
    for (let i = 7; i >= 0; i--) {
      const r = fbR * (1 - i * 0.07);
      const g = fx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, r));
      const h = [55, 45, 30, 18, 10, 4, 1, 0][i],
        s = [210, 180, 140, 90, 50, 20, 8, 2][i];
      g.addColorStop(0, `rgba(255,${s},${h},${fbA * (1 - i * 0.09)})`);
      g.addColorStop(0.45, `rgba(255,${s >> 1},${h >> 1},${fbA * 0.25})`);
      g.addColorStop(1, "transparent");
      fx.fillStyle = g;
      fx.fillRect(0, 0, W, H);
    }

    for (let i = 0; i < 12; i++) {
      const rT = Math.max(0, (pt - i * 4) / 180);
      if (rT > 0 && rT < 1) {
        fx.beginPath();
        fx.arc(cx, cy, rT * Math.max(W, H) * 0.9, 0, 6.28);
        fx.strokeStyle = `rgba(255,200,100,${(1 - rT) * 0.25})`;
        fx.lineWidth = 2.5 - i * 0.15;
        fx.stroke();
      }
    }

    // ── BIG BANG text — fully responsive, never overflows ──
    if (pt > 12 && pt < 90) {
      const ta = pt < 30 ? (pt - 12) / 18 : Math.max(0, 1 - (pt - 50) / 40);

      // Cap font size to 11% of the narrower screen dimension
      const bbSize = Math.min(W * 0.11, Math.min(140, 50 + pt * 2));
      // Sub-label scales with screen, max 16px
      const subSize = Math.min(W * 0.028, Math.min(16, 8 + pt * 0.1));
      // Vertical spacing relative to BIG BANG size
      const bbOffsetY = -(bbSize * 0.28);
      const subOffsetY = bbSize * 0.52;

      fx.save();
      fx.translate(cx, cy);

      fx.font = `900 ${bbSize}px "Playfair Display",serif`;
      fx.textAlign = "center";
      fx.textBaseline = "middle";
      fx.shadowColor = `rgba(255,180,50,${ta * 0.6})`;
      fx.shadowBlur = 60;
      fx.fillStyle = `rgba(255,215,70,${ta * 0.85})`;
      fx.fillText("BIG BANG", 0, bbOffsetY);

      fx.shadowBlur = 0;
      fx.font = `400 ${subSize}px "JetBrains Mono",monospace`;
      fx.fillStyle = `rgba(212,165,74,${ta * 0.4})`;
      fx.fillText("THE BIRTH OF THE SEARCH UNIVERSE", 0, subOffsetY);

      fx.restore();
    }

    for (const d of debris) {
      d.x += d.vx;
      d.y += d.vy;
      d.vx *= 0.985;
      d.vy *= 0.985;
      d.life++;
      const f = Math.max(0, 1 - d.life / d.ml);
      if (d.type === "dot") {
        fx.beginPath();
        fx.moveTo(d.x, d.y);
        fx.lineTo(d.x - d.vx * 5, d.y - d.vy * 5);
        fx.strokeStyle = d.br
          ? `rgba(255,255,200,${f * 0.5})`
          : `rgba(255,180,60,${f * 0.25})`;
        fx.lineWidth = d.r * f * 1.5;
        fx.stroke();
        fx.beginPath();
        fx.arc(d.x, d.y, Math.max(0.1, d.r * f * 1.2), 0, 6.28);
        fx.fillStyle = d.br
          ? `rgba(255,255,220,${f})`
          : `rgba(255,200,100,${f * 0.6})`;
        fx.fill();
      } else {
        fx.save();
        fx.globalAlpha = f * 0.7;
        fx.font = `700 ${Math.max(1, d.sz * f)}px "JetBrains Mono",monospace`;
        fx.textAlign = "center";
        fx.textBaseline = "middle";
        fx.fillStyle = d.color;
        fx.shadowColor = d.color;
        fx.shadowBlur = 8 * f;
        fx.fillText(d.label, d.x, d.y);
        fx.shadowBlur = 0;
        fx.restore();
      }
    }
    debris = debris.filter((d) => d.life < d.ml);

    if (pt > 160 && pt < 280 && fr % 4 === 0) {
      for (let i = 0; i < 3; i++) {
        const a = Math.random() * 6.28,
          r = 40 + Math.random() * 180;
        smoke.push({
          x: cx + Math.cos(a) * r,
          y: cy + Math.sin(a) * r,
          r: 20 + Math.random() * 50,
          a: 0.04 + Math.random() * 0.04,
          life: 0,
          ml: 180 + Math.random() * 200,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.15,
        });
      }
    }

    for (const s of smoke) {
      s.x += s.vx;
      s.y += s.vy;
      s.life++;
      fx.beginPath();
      fx.arc(s.x, s.y, s.r, 0, 6.28);
      fx.fillStyle = `rgba(30,15,5,${Math.max(0, 1 - s.life / s.ml) * s.a})`;
      fx.fill();
    }

    // ── THE ORIGIN IS BORN text — fully responsive, never overflows ──
    if (pt > 200 && pt < 340) {
      const ta =
        pt < 240
          ? (pt - 200) / 40
          : pt > 300
            ? Math.max(0, 1 - (pt - 300) / 40)
            : 1;

      // Cap to 4.5% of screen width, absolute max 56px
      const obSize = Math.min(W * 0.045, 56);

      fx.save();
      fx.translate(cx, cy);
      fx.font = `900 ${obSize}px "Playfair Display",serif`;
      fx.textAlign = "center";
      fx.textBaseline = "middle";
      fx.shadowColor = `rgba(212,165,74,${ta * 0.3})`;
      fx.shadowBlur = 35;
      fx.fillStyle = `rgba(255,240,200,${ta * 0.65})`;
      fx.fillText("THE ORIGIN IS BORN", 0, 0);
      fx.shadowBlur = 0;
      fx.restore();
    }

    // if (pt > 310) {
    //   vBang.style.opacity = Math.max(0, 1 - (pt - 310) / 70) + "";
    //   vBg1.style.opacity = "1";
    // }

    // if (pt >= DUR.EXPLODE) {
    //   phase = 3;
    //   pt = 0;
    //   smoke = [];
    //   try {
    //     vBang.classList.remove("on");
    //     vBang.pause();
    //   } catch (e) {}
    // }
  }

  function pExpand() {
    drawStars(1);
    const p = Math.min(1, pt / DUR.EXPAND),
      ease = 1 - Math.pow(1 - p, 4);

    if (pt === 1) vBg1.style.opacity = "1";

    const si = Math.min(1, p * 1.6);
    drawCorona(si);
    drawFlares(si * 0.7);

    for (let i = 0; i < N; i++) {
      const t2 = Math.min(1, Math.max(0, (ease - i * 0.013) / 0.55)),
        e2 = 1 - Math.pow(1 - t2, 3);
      const px = cx + (targets[i].x - cx) * e2,
        py = cy + (targets[i].y - cy) * e2;
      posIcon(i, px, py);
      showIcon(i, t2 * 2.5);

      if (t2 > 0 && t2 < 0.9) {
        const tr = 12 + t2 * 35,
          dx = targets[i].x - cx,
          dy = targets[i].y - cy,
          d = Math.hypot(dx, dy);
        if (d > 0) {
          fx.beginPath();
          fx.moveTo(px, py);
          fx.lineTo(px - (dx / d) * tr, py - (dy / d) * tr);
          const tg = fx.createLinearGradient(
            px,
            py,
            px - (dx / d) * tr,
            py - (dy / d) * tr,
          );
          tg.addColorStop(0, `rgba(255,220,120,${(1 - t2) * 0.55})`);
          tg.addColorStop(1, "transparent");
          fx.strokeStyle = tg;
          fx.lineWidth = 3 * (1 - t2);
          fx.stroke();
        }
      }
    }

    if (p > 0.3) {
      const tA = Math.min(1, (p - 0.3) / 0.7);
      for (let i = 0; i < N; i++) {
        try {
          const e = els[i];
          // FIX: elSizes — no offsetWidth read
          const expSz = elSizes[i] || { w: 76, h: 90 };
          const px = parseFloat(e.style.left) + expSz.w / 2,
            py = parseFloat(e.style.top) + expSz.h / 2;
          drawTendril(cx, cy, px, py, i, 0.28 * tA, 2 * tA);
        } catch (ex) {}
      }
    }

    if (p > 0.6 && !document.getElementById("sun").classList.contains("on"))
      document.getElementById("sun").classList.add("on");

    if (pt >= DUR.EXPAND) {
      phase = 4;
      pt = 0;
      try {
        skipBtn.classList.remove("on");
      } catch (e) {}
    }
  }

  function pLive() {
    drawStars(1);
    const t = pt,
      cp = 0.7 + Math.sin(t * 0.01) * 0.3;
    drawCorona(cp);
    drawFlares(cp * 0.65);

    for (let i = 0; i < 4; i++) {
      const rr = (t * 0.12 + i * 80) % 320;
      fx.beginPath();
      fx.arc(cx, cy, rr, 0, 6.28);
      fx.strokeStyle = G + Math.max(0, (1 - rr / 320) * 0.05) + ")";
      fx.lineWidth = 0.5;
      fx.stroke();
    }

    const mx = (mouse.tx / W - 0.5) * 2,
      my = (mouse.ty / H - 0.5) * 2;
    const base = Math.min(W, H) / 2;
    const xScale = W < 600 ? 1.15 : W < 900 ? 1.3 : 1.45;
    const yScale = W < 600 ? 0.95 : W < 900 ? 0.78 : 0.82;

    // Icon orbit positions
    for (const ring of RINGS) {
      const n = ring.ids.length;
      for (let i = 0; i < n; i++) {
        const id = ring.ids[i],
          a = (i / n) * 6.28 - 1.57 + t * 0.0003 * ring.spd;
        const depth = ring.r;
        const parX = mx * 15 * (1 - depth * 0.5),
          parY = my * 10 * (1 - depth * 0.5);
        const px =
          cx +
          Math.cos(a) * base * ring.r * xScale +
          Math.sin(t * 0.003 + id * 1.7) * 5 +
          parX;
        const py =
          cy +
          Math.sin(a) * base * ring.r * yScale +
          Math.cos(t * 0.003 + id * 2.1) * 4 +
          parY;

        posIcon(id, px, py);

        // FIX: cached elGlows ref — no querySelector in loop
        if (elGlows[id])
          elGlows[id].style.opacity =
            0.18 + Math.sin(t * 0.008 + id) * 0.06 + "";

        let hi = 1;
        for (const e of eParts)
          if (e.idx === id && e.p > 0.1 && e.p < 0.9) hi = 2.8;
        drawTendril(cx, cy, px, py, id, 0.28 * hi, 2 * Math.min(hi, 1.5), hi);
      }
    }

    // Ring-to-ring tendrils
    // FIX: elSizes — no offsetWidth reads
    for (const ring of RINGS) {
      const ids = ring.ids,
        n = ids.length;
      for (let i = 0; i < n; i++) {
        try {
          const aEl = els[ids[i]],
            bEl = els[ids[(i + 1) % n]];
          const aSz = elSizes[ids[i]] || { w: 76, h: 90 };
          const bSz = elSizes[ids[(i + 1) % n]] || { w: 76, h: 90 };
          drawTendril(
            parseFloat(aEl.style.left) + aSz.w / 2,
            parseFloat(aEl.style.top) + aSz.h / 2,
            parseFloat(bEl.style.left) + bSz.w / 2,
            parseFloat(bEl.style.top) + bSz.h / 2,
            ids[i] + 20,
            0.035,
            0.5,
          );
        } catch (ex) {}
      }
    }

    // FIX: EPARTS_CHANCE + EPARTS_MAX respect mobile budget
    if (Math.random() < EPARTS_CHANCE)
      eParts.push({
        idx: Math.floor(Math.random() * N),
        p: 0,
        spd: 0.004 + Math.random() * 0.009,
        sz: 1.5 + Math.random() * 2,
      });
    if (eParts.length > EPARTS_MAX)
      eParts.splice(0, eParts.length - EPARTS_MAX);
    eParts = eParts.filter((e) => e.p < 1);

    for (const e of eParts) {
      e.p += e.spd;
      try {
        const el = els[e.idx];
        // FIX: elSizes — no offsetWidth read
        const eSz = elSizes[e.idx] || { w: 76, h: 90 };
        const tx = parseFloat(el.style.left) + eSz.w / 2,
          ty = parseFloat(el.style.top) + eSz.h / 2;
        const dx = tx - cx,
          dy = ty - cy,
          dist = Math.hypot(dx, dy);
        if (dist < 15) continue;

        const ppx = -dy / dist,
          ppy = dx / dist;
        const bpx = cx + dx * e.p,
          bpy = cy + dy * e.p;
        const wave =
          Math.sin(e.p * 5 + fr * 0.003 + e.idx * 2) *
            22 *
            (1 - Math.abs(e.p - 0.5) * 1.8) +
          Math.sin(e.p * 9 + fr * 0.005 + e.idx * 3) * 8 * e.p;
        const px = bpx + ppx * wave,
          py = bpy + ppy * wave;
        const fade =
          e.p < 0.08 ? e.p / 0.08 : e.p > 0.85 ? (1 - e.p) / 0.15 : 1;

        const eg = fx.createRadialGradient(px, py, 0, px, py, e.sz * 8);
        eg.addColorStop(0, `rgba(255,215,90,${0.5 * fade})`);
        eg.addColorStop(1, "transparent");
        fx.beginPath();
        fx.arc(px, py, e.sz * 8, 0, 6.28);
        fx.fillStyle = eg;
        fx.fill();
        fx.beginPath();
        fx.arc(px, py, e.sz * 1.2, 0, 6.28);
        fx.fillStyle = `rgba(255,240,160,${0.9 * fade})`;
        fx.fill();

        if (e.p > 0.85) {
          const arrP = (e.p - 0.85) / 0.15;
          const fg = fx.createRadialGradient(tx, ty, 0, tx, ty, 60);
          fg.addColorStop(0, G + 0.7 * (1 - arrP) + ")");
          fg.addColorStop(0.3, G + 0.3 * (1 - arrP) + ")");
          fg.addColorStop(1, "transparent");
          fx.beginPath();
          fx.arc(tx, ty, 60, 0, 6.28);
          fx.fillStyle = fg;
          fx.fill();
          fx.beginPath();
          fx.arc(tx, ty, Math.max(0, 8 * (1 - arrP)), 0, 6.28);
          fx.fillStyle = `rgba(255,240,180,${0.6 * (1 - arrP)})`;
          fx.fill();
          // FIX: cached elGlows ref — no querySelector
          if (elGlows[e.idx])
            elGlows[e.idx].style.opacity = 0.15 + 0.4 * (1 - arrP) + "";
        }
      } catch (ex) {}
    }
  }

  const skipBtn = document.getElementById("skip");

  function skipIntro() {
    phase = 3;
    pt = 0;
    smoke = [];
    debris = [];
    vBg1.style.opacity = "1";
    try {
      // vBang.classList.remove("on");
      // vBang.pause();
    } catch (e) {}
    for (let i = 0; i < N; i++) {
      posIcon(i, targets[i].x, targets[i].y);
      showIcon(i, 1);
    }
    document.getElementById("sun").classList.add("on");
    skipBtn.classList.remove("on");
  }
  window.skipIntro = skipIntro;

  // ═══ SCROLL REVEAL ═══
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("vis");
          if (e.target.classList.contains("timeline")) {
            e.target.querySelectorAll(".tl-item").forEach((item, i) => {
              setTimeout(
                () => item.classList.add("vis"),
                parseInt(item.dataset.delay || 0) + i * 120,
              );
            });
          }
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // ═══ SECTION VIDEO LAZY PLAY ═══
  // FIX: section videos play only when visible, pause when scrolled away
  // stops all 3 videos decoding simultaneously on page load
  const vidObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const vid = entry.target;
        if (entry.isIntersecting) {
          if (vid.paused) vid.play().catch(() => {});
        } else {
          if (!vid.paused) vid.pause();
        }
      });
    },
    { threshold: 0.1 },
  );
  document.querySelectorAll(".sec-vid").forEach((v) => vidObserver.observe(v));

  window.addEventListener("resize", resize);
  init();
})();
