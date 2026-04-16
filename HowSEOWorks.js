/* ═══════════════════════════════════════════════════════
   HowSEOWorks.js  |  RSM — Redesigned
   GSAP · ScrollTrigger · Hero Canvas · Counter Animations
   ═══════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─────────────────────────────────────
     DATA
  ───────────────────────────────────── */
  const GOOGLE_STEPS = [
    { n: "01", text: "User types a <strong>query</strong> into Google search" },
    { n: "02", text: "Google scans its <strong>index of billions of pages</strong>" },
    { n: "03", text: "<strong>200+ ranking signals</strong> are evaluated simultaneously" },
    { n: "04", text: "<strong>E-E-A-T, backlinks, content quality</strong> determine position" },
    { n: "05", text: "A <strong>ranked list of 10 blue links</strong> appears — user clicks one" },
  ];
  const AI_STEPS = [
    { n: "01", text: "User asks a <strong>natural language question</strong> to ChatGPT or Gemini" },
    { n: "02", text: "AI searches for <strong>authoritative, structured content</strong> on the web" },
    { n: "03", text: "AI evaluates <strong>source credibility, AEO structure, entity clarity</strong>" },
    { n: "04", text: "AI <strong>synthesises one answer</strong> — citing 2–4 sources by name" },
    { n: "05", text: "User <strong>never visits your site</strong> — unless you're the cited source" },
  ];
  const METHODS = [
    { icon: "🔍", color: "#4f8fff", title: "Audit",
      desc: "Deep crawl, technical health, competitor gap analysis, and surface coverage map.", tag: "Foundation" },
    { icon: "🗺️", color: "#06d6a0", title: "Strategy",
      desc: "Custom roadmap covering all 20 surfaces. Priorities set by ROI potential, not convention.", tag: "Direction" },
    { icon: "⚙️", color: "#a855f7", title: "Execute",
      desc: "Schema, content clusters, authority links, GBP, AEO structure. Everything in parallel.", tag: "Momentum" },
    { icon: "📊", color: "#d4a54a", title: "Monitor",
      desc: "Rank tracking, AI citation monitoring, Core Web Vitals, and surface coverage reporting.", tag: "Visibility" },
    { icon: "∞",  color: "#f97316", title: "Compound",
      desc: "Each month's work amplifies the last. Authority, content, and citations compound — indefinitely.", tag: "Growth" },
  ];
  const ROI_DATA = [
    { label: "Organic SEO", w: 92, color: "#06d6a0", val: "5.7x" },
    { label: "Content",     w: 65, color: "#d4a54a", val: "3.8x" },
    { label: "Social",      w: 42, color: "#a855f7", val: "2.4x" },
    { label: "Email",       w: 38, color: "#4f8fff", val: "2.1x" },
    { label: "PPC / Ads",   w: 17, color: "#ec4899", val: "1.0x" },
  ];

  /* ─────────────────────────────────────
     1. SCROLL PROGRESS
  ───────────────────────────────────── */
  function initScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    if (!bar) return;
    let tick = false;
    window.addEventListener("scroll", () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => {
        const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        bar.style.width = (pct * 100) + "%";
        tick = false;
      });
    }, { passive: true });
  }

  /* ─────────────────────────────────────
     2. CURSOR + GLOW TRAIL
  ───────────────────────────────────── */
  function initCursor() {
    const cursor    = document.getElementById("cursor");
    const cursorDot = document.getElementById("cursorDot");
    const trail     = document.getElementById("glowTrail");
    if (!cursor || !cursorDot || !trail) return;

    const ctx = trail.getContext("2d");
    let W = window.innerWidth, H = window.innerHeight;
    trail.width = W; trail.height = H;
    let mx = -200, my = -200, cx = -200, cy = -200;
    const pts = [];

    window.addEventListener("resize", () => {
      W = window.innerWidth; H = window.innerHeight;
      trail.width = W; trail.height = H;
    });
    document.addEventListener("mousemove", e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + "px"; cursor.style.top = my + "px";
      cursorDot.style.left = mx + "px"; cursorDot.style.top = my + "px";
    });
    document.querySelectorAll("a,button,.ai-card,.meth-step,.roi-wrap").forEach(el => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
    });
    (function loop() {
      requestAnimationFrame(loop);
      cx += (mx - cx) * 0.1; cy += (my - cy) * 0.1;
      pts.push({ x: cx, y: cy });
      if (pts.length > 28) pts.shift();
      ctx.clearRect(0, 0, W, H);
      for (let i = 1; i < pts.length; i++) {
        const t = i / pts.length;
        ctx.beginPath();
        ctx.moveTo(pts[i-1].x, pts[i-1].y);
        ctx.lineTo(pts[i].x, pts[i].y);
        ctx.strokeStyle = `rgba(212,165,74,${t * 0.18})`;
        ctx.lineWidth = t * 2.5;
        ctx.lineCap = "round";
        ctx.stroke();
      }
    })();
  }

  /* ─────────────────────────────────────
     3. HERO CANVAS — particle field
  ───────────────────────────────────── */
  function initHeroCanvas() {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H;
    const particles = [];
    const COLORS = ["#4f8fff", "#d4a54a", "#06d6a0", "#a855f7", "#ec4899"];

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width  = W; canvas.height = H;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * 1400, y: Math.random() * 900,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        size: 1.5 + Math.random() * 2.5, color: COLORS[i % COLORS.length],
        a: 0.06 + Math.random() * 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.007 + Math.random() * 0.012
      });
    }

    // Horizontal scan lines
    const LINES = Array.from({ length: 6 }, (_, i) => ({
      y: 0.12 + i * 0.155, progress: Math.random(),
      speed: 0.0007 + Math.random() * 0.001,
      color: COLORS[i % COLORS.length]
    }));

    let mx = W / 2, my = H / 2;
    document.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });

    (function draw() {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      LINES.forEach(line => {
        line.progress += line.speed;
        if (line.progress > 1) line.progress = 0;
        const y = line.y * H;
        const x = line.progress * W;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y);
        ctx.strokeStyle = line.color + "07"; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = line.color + "55"; ctx.fill();
      });

      particles.forEach(p => {
        const dx = p.x - mx, dy = p.y - my;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.35;
          p.vx += (dx / dist) * force * 0.04;
          p.vy += (dy / dist) * force * 0.04;
        }
        p.vx *= 0.98; p.vy *= 0.98;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
        p.pulse += p.pulseSpeed;
        const alpha = p.a * (0.5 + 0.5 * Math.sin(p.pulse));
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
        ctx.restore();
      });
    })();
  }

  /* ─────────────────────────────────────
     4. GSAP HERO ENTRANCE
  ───────────────────────────────────── */
  function initHeroGSAP() {
    if (typeof gsap === "undefined") return;

    const tl = gsap.timeline({ delay: 0.3 });

    // Eyebrow
    tl.from("#heroEyebrow", {
      opacity: 0, x: -20, duration: 0.6, ease: "power3.out"
    });

    // Title lines stagger
    tl.from(".hero-line", {
      opacity: 0, y: 60, stagger: 0.12, duration: 0.9,
      ease: "power4.out"
    }, "-=0.3");

    // Sub + btns
    tl.from("#heroSub", {
      opacity: 0, y: 20, duration: 0.7, ease: "power2.out"
    }, "-=0.4");
    tl.from("#heroBtns", {
      opacity: 0, y: 20, duration: 0.6, ease: "power2.out"
    }, "-=0.4");

    // Ring scene
    tl.from("#heroRingScene", {
      opacity: 0, scale: 0.7, rotation: -30, duration: 1.2,
      ease: "elastic.out(1, 0.6)"
    }, "-=0.8");

    // Orbit labels stagger
    tl.from(".orbit-label", {
      opacity: 0, scale: 0, stagger: 0.1, duration: 0.5,
      ease: "back.out(2)"
    }, "-=0.6");

    // Stats
    tl.from(".hero-stat-row", {
      opacity: 0, x: 30, stagger: 0.12, duration: 0.6,
      ease: "power3.out"
    }, "-=0.5");

    // Animate stat counters
    document.querySelectorAll(".hsr-num").forEach(el => {
      const target = parseInt(el.dataset.count);
      const decimal = el.dataset.decimal || "";
      gsap.to({ val: 0 }, {
        val: target, duration: 2, delay: 0.8,
        ease: "power2.out",
        onUpdate: function () {
          el.textContent = Math.round(this.targets()[0].val) + decimal;
        }
      });
    });
  }

  /* ─────────────────────────────────────
     5. GSAP SCROLL ANIMATIONS
  ───────────────────────────────────── */
  function initScrollGSAP() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      // Fallback: make everything visible
      document.querySelectorAll(".gsap-up,.gsap-card-left,.gsap-card-right").forEach(el => {
        el.style.opacity = 1; el.style.transform = "none";
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Generic up reveals
    document.querySelectorAll(".gsap-up").forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      });
    });

    // Card reveals
    gsap.to(".gsap-card-left", {
      opacity: 1, x: 0, duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: ".ai-dual", start: "top 80%", once: true }
    });
    gsap.to(".gsap-card-right", {
      opacity: 1, x: 0, duration: 0.9, delay: 0.15,
      ease: "power3.out",
      scrollTrigger: { trigger: ".ai-dual", start: "top 80%", once: true }
    });

    // Footer reveals
    const footerEls = document.querySelectorAll(".hw-reveal");
    footerEls.forEach(el => {
      const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { el.classList.add("visible"); io.disconnect(); }
      }, { threshold: 0.1 });
      io.observe(el);
    });
  }

  /* ─────────────────────────────────────
     6. AI STEPS INJECTION + ANIMATE
  ───────────────────────────────────── */
  function injectAiSteps(containerId, steps) {
    const container = document.getElementById(containerId);
    if (!container) return;
    steps.forEach(s => {
      const el = document.createElement("div");
      el.className = "ai-step-item";
      el.innerHTML = `<div class="ai-step-num">${s.n}</div><div class="ai-step-txt">${s.text}</div>`;
      container.appendChild(el);
    });
  }

  function initAiSteps() {
    injectAiSteps("aiGoogleSteps", GOOGLE_STEPS);
    injectAiSteps("aiPlatformSteps", AI_STEPS);

    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const items = document.querySelectorAll(".ai-step-item");
        items.forEach((el, i) => {
          setTimeout(() => {
            el.style.transition = `opacity 0.5s ${i * 55}ms cubic-bezier(0.16,1,0.3,1), transform 0.5s ${i * 55}ms cubic-bezier(0.16,1,0.3,1)`;
            el.classList.add("vis");
          }, 80);
        });
        io.disconnect();
      }
    }, { threshold: 0.1 });
    const section = document.getElementById("ai");
    if (section) io.observe(section);
  }

  /* ─────────────────────────────────────
     7. METHODOLOGY STEPS
  ───────────────────────────────────── */
  function initMethodology() {
    const stepsEl = document.getElementById("methSteps");
    if (!stepsEl) return;

    METHODS.forEach((m, i) => {
      const el = document.createElement("div");
      el.className = "meth-step";
      el.innerHTML = `
        <div class="meth-node" style="border-color:${m.color}40">
          <span>${m.icon}</span>
          <div class="meth-node-ring" style="border-color:${m.color}"></div>
        </div>
        <div class="meth-num">0${i+1}</div>
        <div class="meth-title">${m.title}</div>
        <div class="meth-desc">${m.desc}</div>
        <div class="meth-tag" style="background:${m.color}10;border:1px solid ${m.color}20;color:${m.color}90;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;padding:4px 9px;border-radius:3px;margin-top:10px;">${m.tag}</div>
      `;
      stepsEl.appendChild(el);
    });

    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        stepsEl.querySelectorAll(".meth-step").forEach((el, i) => {
          setTimeout(() => el.classList.add("vis"), i * 110);
        });
        const fill = document.getElementById("methConnFill");
        if (fill) setTimeout(() => fill.style.width = "100%", 300);
        io.disconnect();
      }
    }, { threshold: 0.12 });
    const wrap = document.getElementById("methStepsWrap");
    if (wrap) io.observe(wrap);
  }

  /* ─────────────────────────────────────
     8. ROI BARS
  ───────────────────────────────────── */
  function initROI() {
    const container = document.getElementById("roiBarsWrap");
    if (!container) return;

    const barsDiv = document.createElement("div");
    barsDiv.className = "roi-bars";
    ROI_DATA.forEach(r => {
      const row = document.createElement("div");
      row.className = "roi-bar-row";
      row.innerHTML = `
        <div class="rbl">${r.label}</div>
        <div class="rbt"><div class="rbf" data-w="${r.w}" style="background:${r.color}"></div></div>
        <div class="rbv" style="color:${r.color}">${r.val}</div>
      `;
      barsDiv.appendChild(row);
    });
    container.appendChild(barsDiv);

    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll(".rbf").forEach((fill, i) => {
          setTimeout(() => { fill.style.width = fill.dataset.w + "%"; }, i * 130 + 200);
        });
        io.disconnect();
      }
    }, { threshold: 0.3 });
    const roiWrap = document.getElementById("roiWrap");
    if (roiWrap) io.observe(roiWrap);
  }

  /* ─────────────────────────────────────
     9. GSAP RING HOVER PARALLAX
  ───────────────────────────────────── */
  function initRingParallax() {
    const scene = document.getElementById("heroRingScene");
    if (!scene || typeof gsap === "undefined") return;
    document.addEventListener("mousemove", e => {
      const xPct = (e.clientX / window.innerWidth - 0.5) * 20;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 12;
      gsap.to(scene, {
        rotationY: xPct, rotationX: -yPct,
        duration: 1.2, ease: "power2.out",
        transformPerspective: 800
      });
    });
  }

  /* ─────────────────────────────────────
     10. GSAP MARQUEE  (CSS handles it — just ensures it works)
  ───────────────────────────────────── */

  /* ─────────────────────────────────────
     INIT
  ───────────────────────────────────── */
  function init() {
    initScrollProgress();
    initCursor();
    initHeroCanvas();
    initHeroGSAP();
    initScrollGSAP();
    initAiSteps();
    initMethodology();
    initROI();
    initRingParallax();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();

})();