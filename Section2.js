/* ═══════════════════════════════════════════════════
   SECTION 2 — EVOLUTION CHAKRA
   Extracted & modularised from rsm-section2-chakra.html
   All canvas / video IDs prefixed with "chakra" so they
   never conflict with Main.js or the hero canvases.
═══════════════════════════════════════════════════ */
(function () {
  "use strict";

  var CFG = {
    arms: [
      { yr: "1998", t: "GOOGLE BORN",       d: "PageRank — links become currency",      col: "#4285F4" },
      { yr: "2004", t: "LOCAL SEARCH",      d: "Maps & near me reshape discovery",      col: "#34A853" },
      { yr: "2011", t: "SCHEMA ERA",        d: "Structured data gives context",         col: "#14b8a6" },
      { yr: "2015", t: "MOBILE FIRST",      d: "Mobile overtakes desktop",              col: "#f59e0b" },
      { yr: "2019", t: "E-E-A-T",           d: "Trust becomes the signal",              col: "#ec4899" },
      { yr: "2023", t: "AI SEARCH",         d: "ChatGPT rewrites discovery",            col: "#10a37f" },
      { yr: "2024", t: "AI OVERVIEWS",      d: "Google adds AI to results",             col: "#a855f7" },
      { yr: "2025", t: "SEARCH EVERYWHERE", d: "20 surfaces — one cosmos",              col: "#d4a54a" }
    ],
    outerKw: ["AEO", "AIO", "E-E-A-T", "LOCAL SEO", "SCHEMA", "AI SEARCH", "GOOGLE", "TRUST", "GBP", "CONTENT", "VOICE", "LINKS"],
    ringTxt: ["· SEARCH ENGINE OPTIMIZATION ", "· ANSWER ENGINE · AI OVERVIEW ", "· DIGITAL MARKETING · SCHEMA · E-E-A-T "]
  };

  /* ── Element references (prefixed IDs) ── */
  var bgC = document.getElementById("chakraBg"),  bg = bgC.getContext("2d");
  var ltC = document.getElementById("chakraLt"),  lt = ltC.getContext("2d");
  var fxC = document.getElementById("chakraFx"),  fx = fxC.getContext("2d");
  var vid = document.getElementById("chakraVid");

  var W = 0, H = 0, cx = 0, cy = 0, fr = 0, mx = -999, my = -999;
  var phase = 0, eO = 0, aO = 0, kwO = 0, mob = false, tab = false, dpr = 1;
  var bolts = [], warpStars = [], cosmicClouds = [];

  /* ── Init / resize ── */
  function init() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    bgC.width = ltC.width = fxC.width = W * dpr;
    bgC.height = ltC.height = fxC.height = H * dpr;
    bgC.style.width = ltC.style.width = fxC.style.width = W + "px";
    bgC.style.height = ltC.style.height = fxC.style.height = H + "px";
    bg.setTransform(dpr, 0, 0, dpr, 0, 0);
    lt.setTransform(dpr, 0, 0, dpr, 0, 0);
    fx.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* Cosmic cloud particles */
    cosmicClouds = [];
    var cc = mob ? 25 : tab ? 50 : 80;
    for (var i = 0; i < cc; i++) cosmicClouds.push({
      a: Math.random() * Math.PI * 2,
      z: Math.random() * 800 + 200,
      r: 30 + Math.random() * 60,
      hue: Math.floor(Math.random() * 4),
      wobble: Math.random() * Math.PI * 2,
      wobSpd: 0.002 + Math.random() * 0.003
    });

    /* Warp / twinkling stars */
    warpStars = [];
    var wc = mob ? 150 : tab ? 300 : 500;
    for (var i = 0; i < wc; i++) {
      var ct = 0, rn = Math.random();
      if (rn > 0.92) ct = 1;
      else if (rn > 0.86) ct = 2;
      else if (rn > 0.82) ct = 3;
      warpStars.push({ x: Math.random() * W, y: Math.random() * H, z: Math.random() * 500 + 50, pz: Math.random() * 100, col: ct });
    }
    // cx = W / 2; cy = H / 2;
    mob = W < 768; tab = W >= 768 && W < 1024;
    cx = W / 2 ; 
    cy = mob ? H * 0.42 : H / 2 ; 
  }

  window.addEventListener("resize", init);

  /* Mouse / touch tracking — global so it works while scrolling */
  document.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; });
  document.addEventListener("touchmove", function (e) { mx = e.touches[0].clientX; my = e.touches[0].clientY; }, { passive: true });
  document.addEventListener("touchstart", function (e) { mx = e.touches[0].clientX; my = e.touches[0].clientY; }, { passive: true });

  init();

  /* Fade video in */
  try { vid.play().catch(function () {}); } catch (e) {}
  setTimeout(function () { vid.classList.add("on"); }, 300);

  /* ═══ DEEP SPACE NEBULA + ACID STORM ═══ */
  function drawBg() {
    bg.fillStyle = "rgba(2,1,10,.14)";
    bg.fillRect(0, 0, W, H);
    var t = fr * 0.0004;

    /* Twinkling starfield */
    for (var i = 0; i < warpStars.length; i++) {
      var s = warpStars[i];
      s.pz += s.z * 0.01;
      var twinkle = Math.sin(s.pz) * Math.sin(s.pz * 1.7) * 0.5 + 0.5;
      var bright = twinkle * (0.08 + s.z * 0.0002);
      var sz = s.z * 0.003 + 0.3;
      var col;
      if (s.col === 1) col = "180,140,255";
      else if (s.col === 2) col = "100,255,200";
      else if (s.col === 3) col = "255,130,200";
      else col = "210,220,255";
      bg.beginPath(); bg.arc(s.x, s.y, sz, 0, 6.28);
      bg.fillStyle = "rgba(" + col + "," + bright + ")"; bg.fill();
      if (sz > 1.2 && twinkle > 0.75) {
        bg.globalAlpha = bright * 0.4;
        bg.beginPath(); bg.moveTo(s.x - sz * 4, s.y); bg.lineTo(s.x + sz * 4, s.y);
        bg.strokeStyle = "rgba(" + col + ",1)"; bg.lineWidth = 0.3; bg.stroke();
        bg.beginPath(); bg.moveTo(s.x, s.y - sz * 3); bg.lineTo(s.x, s.y + sz * 3); bg.stroke();
        bg.globalAlpha = 1;
      }
    }

    /* Acid light colour storm — vivid electric nebula clouds */
    bg.save(); bg.globalCompositeOperation = "screen";
    var storms = [
      { x: 0.18, y: 0.3,  r: 0.3,  h: 275, s: 80, l: 30, pulse: t * 3.2 },
      { x: 0.82, y: 0.25, r: 0.28, h: 170, s: 85, l: 28, pulse: t * 2.8 + 1 },
      { x: 0.3,  y: 0.75, r: 0.25, h: 320, s: 75, l: 26, pulse: t * 3.5 + 2 },
      { x: 0.72, y: 0.65, r: 0.22, h: 145, s: 85, l: 24, pulse: t * 2.5 + 3 },
      { x: 0.5,  y: 0.42, r: 0.2,  h: 38,  s: 80, l: 26, pulse: t * 3   + 4 },
      { x: 0.4,  y: 0.55, r: 0.18, h: 220, s: 85, l: 26, pulse: t * 2.2 + 5 }
    ];
    for (var i = 0; i < storms.length; i++) {
      var st = storms[i];
      var sx2 = W * (st.x + Math.sin(st.pulse) * 0.04 + Math.sin(st.pulse * 1.7) * 0.02);
      var sy2 = H * (st.y + Math.cos(st.pulse * 0.8) * 0.03 + Math.cos(st.pulse * 2.1) * 0.015);
      var intensity = 0.045 + Math.sin(st.pulse) * 0.015 + Math.sin(st.pulse * 2.3) * 0.008;
      var cloudR = Math.max(W, H) * st.r;
      var cg = bg.createRadialGradient(sx2, sy2, 0, sx2, sy2, cloudR);
      cg.addColorStop(0, "hsla(" + st.h + "," + st.s + "%," + st.l + "%," + (intensity * 2) + ")");
      cg.addColorStop(0.2, "hsla(" + st.h + "," + st.s + "%," + (st.l * 0.8) + "%," + (intensity * 1.2) + ")");
      cg.addColorStop(0.5, "hsla(" + st.h + "," + (st.s * 0.7) + "%," + (st.l * 0.5) + "%," + (intensity * 0.6) + ")");
      cg.addColorStop(1, "transparent");
      bg.fillStyle = cg; bg.fillRect(0, 0, W, H);
      /* Secondary wisp */
      var wx = sx2 + Math.cos(st.pulse * 1.3) * cloudR * 0.3;
      var wy = sy2 + Math.sin(st.pulse * 0.9) * cloudR * 0.25;
      var wg = bg.createRadialGradient(wx, wy, 0, wx, wy, cloudR * 0.5);
      wg.addColorStop(0, "hsla(" + ((st.h + 20) % 360) + "," + st.s + "%," + (st.l + 5) + "%," + (intensity * 1.2) + ")");
      wg.addColorStop(1, "transparent");
      bg.fillStyle = wg; bg.fillRect(0, 0, W, H);
      /* Third wisp */
      var w2x = sx2 - Math.sin(st.pulse * 1.1) * cloudR * 0.35;
      var w2y = sy2 + Math.cos(st.pulse * 0.7) * cloudR * 0.2;
      var w2g = bg.createRadialGradient(w2x, w2y, 0, w2x, w2y, cloudR * 0.45);
      w2g.addColorStop(0, "hsla(" + ((st.h + 40) % 360) + "," + st.s + "%," + (st.l + 3) + "%," + (intensity * 0.8) + ")");
      w2g.addColorStop(1, "transparent");
      bg.fillStyle = w2g; bg.fillRect(0, 0, W, H);
      /* Fourth wisp */
      var w3x = sx2 + Math.cos(st.pulse * 2) * cloudR * 0.5;
      var w3y = sy2 - Math.sin(st.pulse * 1.5) * cloudR * 0.4;
      var w3g = bg.createRadialGradient(w3x, w3y, 0, w3x, w3y, cloudR * 0.3);
      w3g.addColorStop(0, "hsla(" + st.h + "," + (st.s * 0.8) + "%," + (st.l + 8) + "%," + (intensity * 0.5) + ")");
      w3g.addColorStop(1, "transparent");
      bg.fillStyle = w3g; bg.fillRect(0, 0, W, H);
      /* Internal lightning flashes inside the cloud */
      if (Math.random() < 0.004) {
        var flashR = cloudR * (0.3 + Math.random() * 0.4);
        var flashX = sx2 + (Math.random() - 0.5) * cloudR * 0.5;
        var flashY = sy2 + (Math.random() - 0.5) * cloudR * 0.4;
        var fg = bg.createRadialGradient(flashX, flashY, 0, flashX, flashY, flashR);
        fg.addColorStop(0, "hsla(" + st.h + ",70%,70%,.2)");
        fg.addColorStop(0.3, "hsla(" + st.h + ",60%,50%,.15)");
        fg.addColorStop(0.6, "hsla(" + st.h + ",50%,35%,.05)");
        fg.addColorStop(1, "transparent");
        bg.fillStyle = fg; bg.fillRect(0, 0, W, H);
        var bx2 = flashX, by2 = flashY;
        bg.beginPath(); bg.moveTo(bx2, by2);
        for (var j = 0; j < 4 + Math.floor(Math.random() * 5); j++) {
          bx2 += (Math.random() - 0.5) * 40; by2 += 8 + Math.random() * 15;
          bg.lineTo(bx2, by2);
        }
        bg.strokeStyle = "hsla(" + st.h + ",60%,80%,.4)"; bg.lineWidth = 2; bg.stroke();
        bg.strokeStyle = "hsla(" + st.h + ",40%,95%,.2)"; bg.lineWidth = 0.5; bg.stroke();
      }
    }
    bg.restore();

    /* Dense nebula wave bands */
    bg.save(); bg.globalCompositeOperation = "screen";
    for (var band = 0; band < 3; band++) {
      var bandY = H * (0.25 + band * 0.25);
      var bandH = H * 0.12;
      bg.beginPath(); bg.moveTo(0, bandY);
      for (var x = 0; x <= W; x += 6) {
        var wave = Math.sin(x * 0.004 + t * 5 + band * 2) * bandH * 0.6
                 + Math.sin(x * 0.009 + t * 3.5 - band) * bandH * 0.3
                 + Math.sin(x * 0.002 + t * 7 + band * 4) * bandH * 0.2;
        bg.lineTo(x, bandY + wave);
      }
      bg.lineTo(W, bandY + bandH); bg.lineTo(0, bandY + bandH); bg.closePath();
      var bandHue = [280, 165, 330][band];
      var bg2 = bg.createLinearGradient(0, bandY - bandH, 0, bandY + bandH);
      bg2.addColorStop(0, "transparent");
      bg2.addColorStop(0.35, "hsla(" + bandHue + ",70%,25%,.03)");
      bg2.addColorStop(0.5,  "hsla(" + bandHue + ",75%,28%,.04)");
      bg2.addColorStop(0.65, "hsla(" + bandHue + ",70%,25%,.03)");
      bg2.addColorStop(1, "transparent");
      bg.fillStyle = bg2; bg.fill();
    }
    bg.restore();

    /* Centre warmth — golden glow from chakra */
    var cg2 = bg.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.3);
    cg2.addColorStop(0, "rgba(100,65,15,.1)"); cg2.addColorStop(1, "transparent");
    bg.fillStyle = cg2; bg.fillRect(0, 0, W, H);
  }

  /* ═══ LIGHTNING ═══ */
  function spawnBolt() {
    var sx = Math.random() * W, segs = [], x = sx, y = 0, ty = H * (0.3 + Math.random() * 0.5);
    while (y < ty) {
      var nx = x + (Math.random() - 0.5) * 90, ny = y + 8 + Math.random() * 22;
      segs.push({ x1: x, y1: y, x2: nx, y2: ny, br: false });
      if (Math.random() < 0.22 && segs.length > 2) {
        var bx = nx, by = ny;
        for (var b = 0; b < 2 + Math.floor(Math.random() * 5); b++) {
          var bnx = bx + (Math.random() - 0.5) * 55 + (Math.random() > 0.5 ? 15 : -15);
          var bny = by + 6 + Math.random() * 16;
          segs.push({ x1: bx, y1: by, x2: bnx, y2: bny, br: true }); bx = bnx; by = bny;
        }
      }
      x = nx; y = ny;
    }
    bolts.push({ s: segs, life: 0, ml: 20 + Math.floor(Math.random() * 15) });
  }

  function drawLightning() {
    lt.clearRect(0, 0, W, H);
    for (var b = bolts.length - 1; b >= 0; b--) {
      var bo = bolts[b]; bo.life++;
      if (bo.life > bo.ml) { bolts.splice(b, 1); continue; }
      var fade = bo.life < 3 ? 1 : Math.max(0, 1 - (bo.life - 3) / (bo.ml - 3));
      if (bo.life <= 2) { lt.fillStyle = "rgba(150,140,200," + (fade * 0.07) + ")"; lt.fillRect(0, 0, W, H); }
      for (var s = 0; s < bo.s.length; s++) {
        var sg = bo.s[s], jx = (Math.random() - 0.5) * 2 * fade, jy = (Math.random() - 0.5) * 2 * fade;
        lt.beginPath(); lt.moveTo(sg.x1 + jx, sg.y1 + jy); lt.lineTo(sg.x2 + jx, sg.y2 + jy);
        lt.strokeStyle = "rgba(170,155,235," + (fade * (sg.br ? 0.18 : 0.3)) + ")"; lt.lineWidth = sg.br ? 8 : 16; lt.stroke();
        lt.beginPath(); lt.moveTo(sg.x1 + jx, sg.y1 + jy); lt.lineTo(sg.x2 + jx, sg.y2 + jy);
        lt.strokeStyle = "rgba(225,215,255," + (fade * (sg.br ? 0.35 : 0.6)) + ")"; lt.lineWidth = sg.br ? 2 : 3.5; lt.stroke();
        if (!sg.br && fade > 0.4) {
          lt.beginPath(); lt.moveTo(sg.x1 + jx, sg.y1 + jy); lt.lineTo(sg.x2 + jx, sg.y2 + jy);
          lt.strokeStyle = "rgba(255,250,255," + (fade * 0.3) + ")"; lt.lineWidth = 1; lt.stroke();
        }
      }
    }
    if (Math.random() < (mob ? 0.003 : 0.005)) spawnBolt();
  }

  /* ═══ MAIN RENDER LOOP ═══ */
  function tick() {
    if (paused) return;
    fr++;
    var skipBg = mob && fr % 3 !== 0;
    if (!skipBg) drawBg();
    drawLightning();
    fx.clearRect(0, 0, W, H);

    var R = Math.min(W, H) * (mob ? 0.36 : 0.43), cR0 = R * 0.2, spin = fr * 0.002;

    /* 4-phase intro: disc → arms → keywords → title */
    if (phase === 0)      { eO = Math.min(1, fr / 120);        if (eO >= 1) phase = 1; }
    else if (phase === 1) { aO = Math.min(1, (fr - 120) / 70); if (aO >= 1) phase = 2; }
    else if (phase === 2) { kwO = Math.min(1, (fr - 190) / 60); if (kwO >= 1) phase = 3; }
    var cR = cR0 * (0.3 + eO * 0.7);

    /* Mouse parallax */
    var pX = (mx > 0 ? (mx / W - 0.5) : 0) * 12;
    var pY = (mx > 0 ? (my / H - 0.5) : 0) * 9;
    var ocx = cx + pX, ocy = cy + pY;

    /* Chakra rings with text */
    if (eO > 0.3) {
      for (var rn = 0; rn < 3; rn++) {
        var r = cR * 1.6 + rn * (R * 0.22), sg = mob ? 10 + rn * 3 : 14 + rn * 5;
        var sp = spin * (2.2 - rn * 0.5) * (rn % 2 ? -1 : 1);
        fx.save(); fx.translate(ocx, ocy); fx.rotate(sp);
        for (var s = 0; s < sg; s++) {
          var a = (s / sg) * Math.PI * 2;
          fx.beginPath(); fx.arc(0, 0, r, a + 0.1, a + (Math.PI * 2 / sg) - 0.1);
          fx.strokeStyle = "rgba(212,165,74," + (0.25 + rn * 0.06) * eO + ")"; fx.lineWidth = 3; fx.stroke();
        }
        if (!mob) {
          fx.font = "700 " + (10 + rn * 2) + 'px "JetBrains Mono",monospace';
          fx.fillStyle = "rgba(212,165,74," + (0.35 + rn * 0.05) * eO + ")";
          fx.textAlign = "center"; fx.textBaseline = "middle";
          var txt = CFG.ringTxt[rn], cs = 0.038 - rn * 0.003;
          for (var ch = 0; ch < txt.length; ch++) {
            var ca = ch * cs;
            fx.save(); fx.translate(Math.cos(ca) * (r + 1), Math.sin(ca) * (r + 1));
            fx.rotate(ca + Math.PI / 2); fx.fillText(txt[ch], 0, 0); fx.restore();
          }
        }
        fx.restore();
      }
    }

    /* Outer keyword orbit track */
    var kwTrackR = R * 0.82;
    if (kwO > 0.01) {
      fx.beginPath(); fx.arc(ocx, ocy, kwTrackR, 0, 6.28);
      fx.strokeStyle = "rgba(212,165,74," + kwO * 0.06 + ")"; fx.lineWidth = 1; fx.stroke();
      fx.beginPath(); fx.arc(ocx, ocy, kwTrackR, 0, 6.28);
      fx.strokeStyle = "rgba(212,165,74," + kwO * 0.02 + ")"; fx.lineWidth = 6; fx.stroke();
    }

    /* 8 Arms */
    var actI = -1;
    for (var i = 0; i < 8; i++) {
      var arm = CFG.arms[i], ba = (i / 8) * Math.PI * 2 - Math.PI / 2, ang = ba + spin * 0.5;
      var aL = cR + (R - cR) * (phase >= 1 ? aO : 0); if (aL < cR + 3) continue;
      var sx = ocx + Math.cos(ang) * cR * 0.9, sy = ocy + Math.sin(ang) * cR * 0.7;
      var ex = ocx + Math.cos(ang) * aL, ey = ocy + Math.sin(ang) * aL * 0.82;
      var d = Math.hypot(mx - ex, my - ey), act = d < (mob ? 50 : 70) && aO > 0.5; if (act) actI = i;
      var al = act ? 1 : 0.6;
      /* Triple glow on arm line */
      fx.beginPath(); fx.moveTo(sx, sy); fx.lineTo(ex, ey);
      fx.strokeStyle = arm.col + (act ? "28" : "0e"); fx.lineWidth = act ? 40 : 20; fx.stroke();
      fx.beginPath(); fx.moveTo(sx, sy); fx.lineTo(ex, ey);
      fx.strokeStyle = arm.col + (act ? "55" : "22"); fx.lineWidth = act ? 18 : 8; fx.stroke();
      var g = fx.createLinearGradient(sx, sy, ex, ey);
      g.addColorStop(0, "rgba(212,165,74," + al * 0.85 + ")");
      g.addColorStop(0.3, arm.col + (act ? "ee" : "99")); g.addColorStop(1, arm.col + (act ? "ff" : "bb"));
      fx.beginPath(); fx.moveTo(sx, sy); fx.lineTo(ex, ey); fx.strokeStyle = g; fx.lineWidth = act ? 8 : 5; fx.stroke();
      /* Connector line */
      fx.beginPath(); fx.moveTo(sx, sy); fx.lineTo(ex, ey);
      fx.strokeStyle = "rgba(255,255,255," + (act ? 0.12 : 0.04) + ")"; fx.lineWidth = act ? 2 : 1; fx.stroke();
      /* Pulses along arm */
      var pc = mob ? 2 : 3;
      for (var p = 0; p < pc; p++) {
        var pt = (fr * 0.006 + i * 0.35 + p * 0.33) % 1, pf = Math.sin(pt * 3.14);
        var px2 = sx + (ex - sx) * pt, py2 = sy + (ey - sy) * pt, ps = act ? 16 : 8;
        var pg = fx.createRadialGradient(px2, py2, 0, px2, py2, ps);
        pg.addColorStop(0, "rgba(255,220,100," + (act ? 0.85 : 0.4) * pf + ")"); pg.addColorStop(1, "transparent");
        fx.beginPath(); fx.arc(px2, py2, ps, 0, 6.28); fx.fillStyle = pg; fx.fill();
      }
      /* Node at arm tip */
      var nR = (act ? 18 : 12) * Math.min(1, aO * 2), nG = act ? 90 : 45;
      var ng = fx.createRadialGradient(ex, ey, 0, ex, ey, nG);
      ng.addColorStop(0, arm.col + (act ? "dd" : "88")); ng.addColorStop(0.5, arm.col + (act ? "44" : "18")); ng.addColorStop(1, "transparent");
      fx.beginPath(); fx.arc(ex, ey, nG, 0, 6.28); fx.fillStyle = ng; fx.fill();
      fx.beginPath(); fx.arc(ex, ey, nR, 0, 6.28); fx.fillStyle = act ? arm.col : "rgba(212,165,74,.7)";
      if (act) { fx.shadowColor = arm.col; fx.shadowBlur = 55; } fx.fill(); fx.shadowBlur = 0;
      if (act) {
        fx.beginPath(); fx.arc(ex, ey, 26, 0, 6.28); fx.strokeStyle = arm.col + "aa"; fx.lineWidth = 2; fx.stroke();
        fx.beginPath(); fx.arc(ex, ey, 40, 0, 6.28); fx.strokeStyle = arm.col + "55"; fx.lineWidth = 1; fx.stroke();
      }
      /* Text label — always faces viewer */
      if (aO < 0.35) continue;
      var tF = Math.min(1, (aO - 0.35) * 3);
      var tOff = act ? (mob ? 45 : 62) : (mob ? 28 : 40);
      var tx = ex + Math.cos(ang) * tOff, ty2 = ey + Math.sin(ang) * tOff * 0.82;
      fx.textAlign = "center"; fx.textBaseline = "middle";
      /* Year */
      fx.font = "700 " + (act ? (mob ? 24 : 32) : (mob ? 14 : 18)) + 'px "JetBrains Mono",monospace';
      fx.fillStyle = act ? "#ffe080" : "rgba(212,165,74," + tF + ")";
      fx.fillText(arm.yr, tx, ty2 + (act ? -18 : -7));
      /* Title */
      fx.font = "600 " + (act ? (mob ? 14 : 20) : (mob ? 10 : 13)) + 'px "Outfit",sans-serif';
      fx.fillStyle = act ? "#fff" : "rgba(255,255,255," + tF * 0.85 + ")";
      fx.fillText(arm.t, tx, ty2 + (act ? 4 : 7));
      /* Description on hover */
      if (act && !mob) { fx.font = '400 12px "Outfit",sans-serif'; fx.fillStyle = "rgba(255,255,255,.85)"; fx.fillText(arm.d, tx, ty2 + 22); }
    }

    /* Outer keywords on orbit track */
    if (kwO > 0.01) {
      var kwC = mob ? 6 : CFG.outerKw.length;
      for (var i = 0; i < kwC; i++) {
        var ka = spin * 0.3 + i * (Math.PI * 2 / kwC);
        var kx = ocx + Math.cos(ka) * kwTrackR, ky = ocy + Math.sin(ka) * kwTrackR * 0.82;
        var kA = kwO;
        var kDist = Math.hypot(mx - kx, my - ky), kHot = Math.max(0, 1 - kDist / 100);
        /* Chain tendril to centre */
        var wave = Math.sin(fr * 0.004 + i * 1.5) * 18;
        var tmx = ocx + (kx - ocx) * 0.5 + wave, tmy = ocy + (ky - ocy) * 0.5 - wave;
        fx.beginPath(); fx.moveTo(ocx, ocy); fx.quadraticCurveTo(tmx, tmy, kx, ky);
        fx.strokeStyle = "rgba(212,165,74," + kA * 0.07 + ")"; fx.lineWidth = 8; fx.stroke();
        fx.beginPath(); fx.moveTo(ocx, ocy); fx.quadraticCurveTo(tmx, tmy, kx, ky);
        fx.strokeStyle = "rgba(212,165,74," + kA * (0.16 + kHot * 0.14) + ")"; fx.lineWidth = 2.5; fx.stroke();
        fx.beginPath(); fx.moveTo(ocx, ocy); fx.quadraticCurveTo(tmx, tmy, kx, ky);
        fx.strokeStyle = "rgba(212,165,74," + kA * (0.28 + kHot * 0.2) + ")"; fx.lineWidth = 1; fx.stroke();
        /* Pulse bead along tendril */
        var tPt = (fr * 0.003 + i * 0.25) % 1;
        var tPx = ocx + (kx - ocx) * tPt + wave * (1 - tPt) * 0.4;
        var tPy = ocy + (ky - ocy) * tPt - wave * (1 - tPt) * 0.4;
        fx.beginPath(); fx.arc(tPx, tPy, 3 + kHot * 3, 0, 6.28);
        fx.fillStyle = "rgba(255,215,80," + Math.sin(tPt * 3.14) * 0.25 * kA + ")"; fx.fill();
        /* Hover glow */
        if (kHot > 0.1) {
          fx.beginPath(); fx.arc(kx, ky, 20 + kHot * 14, 0, 6.28);
          fx.fillStyle = "rgba(212,165,74," + kHot * 0.07 + ")"; fx.fill();
        }
        /* Dot on track */
        fx.beginPath(); fx.arc(kx, ky, 4 + kHot * 3, 0, 6.28);
        fx.fillStyle = "rgba(212,165,74," + kA * (0.5 + kHot * 0.4) + ")";
        if (kHot > 0.3) { fx.shadowColor = "#d4a54a"; fx.shadowBlur = 14; } fx.fill(); fx.shadowBlur = 0;
        /* Keyword text */
        var kSz = mob ? 10 : 12 + Math.round(kHot * 4);
        fx.font = "700 " + kSz + 'px "JetBrains Mono",monospace';
        fx.textAlign = "center"; fx.textBaseline = "middle";
        fx.fillStyle = "rgba(212,165,74," + kA * (0.6 + kHot * 0.35) + ")";
        fx.fillText(CFG.outerKw[i], kx, ky - 14);
      }
    }

    /* Centre disc */
    fx.save(); fx.translate(ocx, ocy);
    var breathe = 1 + Math.sin(fr * 0.006) * 0.012; fx.scale(breathe, breathe);
    /* Bloom */
    for (var g2 = 4; g2 > 0; g2--) {
      fx.beginPath(); fx.arc(0, 0, cR + g2 * 22, 0, 6.28);
      fx.fillStyle = "rgba(212,165,74," + eO * 0.04 * (5 - g2) + ")"; fx.fill();
    }
    /* Dark disc */
    fx.beginPath(); fx.arc(0, 0, cR, 0, 6.28);
    var df = fx.createRadialGradient(0, 0, 0, 0, 0, cR);
    df.addColorStop(0, "rgba(8,4,20,.96)"); df.addColorStop(0.85, "rgba(4,2,12,.97)"); df.addColorStop(1, "rgba(12,6,25,.9)");
    fx.fillStyle = df; fx.fill();
    /* Golden outer ring */
    fx.beginPath(); fx.arc(0, 0, cR, 0, 6.28);
    fx.strokeStyle = "#d4a54a"; fx.lineWidth = 3.5; fx.shadowColor = "#d4a54a"; fx.shadowBlur = 40; fx.stroke(); fx.shadowBlur = 0;
    /* Inner ring */
    fx.beginPath(); fx.arc(0, 0, cR * 0.78, 0, 6.28);
    fx.strokeStyle = "rgba(212,165,74," + eO * 0.3 + ")"; fx.lineWidth = 1.5; fx.stroke();
    /* Outer teeth */
    fx.save(); fx.rotate(fr * 0.005);
    for (var i = 0; i < 20; i++) {
      var a = (i / 20) * Math.PI * 2, bv = 0.35 + Math.sin(fr * 0.01 + i * 1.2) * 0.12;
      fx.beginPath(); fx.moveTo(Math.cos(a) * (cR - 3), Math.sin(a) * (cR - 3));
      fx.lineTo(Math.cos(a) * (cR + 11), Math.sin(a) * (cR + 11));
      fx.strokeStyle = "rgba(212,165,74," + bv * eO + ")"; fx.lineWidth = 2.5; fx.stroke();
    } fx.restore();
    /* Inner teeth */
    fx.save(); fx.rotate(-fr * 0.008);
    for (var i = 0; i < 12; i++) {
      var a = (i / 12) * Math.PI * 2;
      fx.beginPath(); fx.moveTo(Math.cos(a) * (cR * 0.45), Math.sin(a) * (cR * 0.45));
      fx.lineTo(Math.cos(a) * (cR * 0.78), Math.sin(a) * (cR * 0.78));
      fx.strokeStyle = "rgba(212,165,74," + eO * 0.18 + ")"; fx.lineWidth = 1.5; fx.stroke();
    } fx.restore();
    /* SEO text */
    if (eO > 0.3) {
      var sf = Math.min(1, (eO - 0.3) * 2.5), sP = 0.6 + Math.sin(fr * 0.012) * 0.4;
      var seoSz = mob ? 30 : 44 + Math.sin(fr * 0.008) * 3;
      fx.font = "900 " + seoSz + 'px "Playfair Display",serif';
      fx.textAlign = "center"; fx.textBaseline = "middle";
      fx.shadowColor = "rgba(212,165,74," + sf * 0.6 * sP + ")"; fx.shadowBlur = 40;
      fx.fillStyle = "rgba(212,165,74," + sf * (0.8 + sP * 0.2) + ")";
      fx.fillText("SEO", 0, 0); fx.shadowBlur = 0;
      /* Shimmer sweep */
      var shX = (fr * 0.8 % 400) - 200;
      fx.save(); fx.beginPath(); fx.arc(0, 0, cR * 0.7, 0, 6.28); fx.clip();
      var sh = fx.createLinearGradient(shX - 25, 0, shX + 25, 0);
      sh.addColorStop(0, "transparent");
      sh.addColorStop(0.45, "rgba(255,240,180," + sf * 0.15 + ")");
      sh.addColorStop(0.5,  "rgba(255,250,220," + sf * 0.22 + ")");
      sh.addColorStop(0.55, "rgba(255,240,180," + sf * 0.15 + ")");
      sh.addColorStop(1, "transparent");
      fx.fillStyle = sh; fx.fillRect(-cR, -cR, cR * 2, cR * 2); fx.restore();
    }
    fx.restore();

    /* Title arc + text */
    if (eO > 0.5) {
      var lf = Math.min(1, (eO - 0.5) * 3);
      var arcR = cR + 30;
      fx.beginPath(); fx.arc(ocx, ocy, arcR, Math.PI * 1.15, Math.PI * 1.85);
      fx.strokeStyle = "rgba(212,165,74," + lf * 0.2 + ")"; fx.lineWidth = 1.5; fx.stroke();
      fx.beginPath(); fx.arc(ocx, ocy, arcR, Math.PI * 1.15, Math.PI * 1.85);
      fx.strokeStyle = "rgba(212,165,74," + lf * 0.06 + ")"; fx.lineWidth = 6; fx.stroke();
      var ty = ocy + cR + (mob ? 38 : 55);
      fx.textAlign = "center";
      fx.font = "900 " + (mob ? 24 : 36) + 'px "Playfair Display",serif';
      fx.fillStyle = "rgba(212,165,74," + lf + ")";
      fx.shadowColor = "rgba(212,165,74,.35)"; fx.shadowBlur = 15;
      fx.fillText("THE EVOLUTION", ocx, ty); fx.shadowBlur = 0;
      fx.font = "400 " + (mob ? 10 : 13) + 'px "JetBrains Mono",monospace';
      fx.fillStyle = "rgba(255,255,255," + lf * 0.55 + ")";
      var subTxt = "OF THE SEARCH COSMOS";
      var subW = fx.measureText(subTxt).width;
      var subY = ty + (mob ? 18 : 24);
      fx.fillText(subTxt, ocx, subY);
      fx.strokeStyle = "rgba(212,165,74," + lf * 0.3 + ")"; fx.lineWidth = 1;
      fx.beginPath(); fx.moveTo(ocx - subW / 2 - 12, subY - 6); fx.lineTo(ocx - subW / 2 - 18, subY); fx.lineTo(ocx - subW / 2 - 12, subY + 6); fx.stroke();
      fx.beginPath(); fx.moveTo(ocx + subW / 2 + 12, subY - 6); fx.lineTo(ocx + subW / 2 + 18, subY); fx.lineTo(ocx + subW / 2 + 12, subY + 6); fx.stroke();
    }

    /* Outer pulses */
    for (var i = 0; i < 3; i++) {
      var r = R + 8 + (fr * 0.05 + i * 22) % 50;
      var a2 = Math.max(0, 1 - (r - R - 8) / 50) * 0.18;
      fx.beginPath(); fx.arc(ocx, ocy, r, 0, 6.28);
      fx.strokeStyle = "rgba(212,165,74," + a2 + ")"; fx.lineWidth = 1.5; fx.stroke();
    }

    requestAnimationFrame(tick);
  }

  /* ── Pause when tab is hidden ── */
  var paused = false;
  document.addEventListener("visibilitychange", function () {
    paused = document.hidden;
    if (!paused) requestAnimationFrame(tick);
  });

  /* ── Also pause when the section scrolls out of view (saves GPU) ── */
  if (typeof IntersectionObserver !== "undefined") {
    var section = document.getElementById("evolution");
    var io = new IntersectionObserver(function (entries) {
      var wasP = paused;
      paused = !entries[0].isIntersecting || document.hidden;
      if (wasP && !paused) requestAnimationFrame(tick);
    }, { threshold: 0.05 });
    if (section) io.observe(section);
  }

  requestAnimationFrame(tick);
})();