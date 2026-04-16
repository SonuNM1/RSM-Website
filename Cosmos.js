/* ═══════════════════════════════════════════════════════
   COSMOS.JS  |  RSM SEO Cosmos Page
   Systems: Cursor · Parallax · Hero 3D · Surfaces ·
            Journey Storytelling · Stack · Counters ·
            Scroll Reveal · Scroll Progress
   ═══════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─────────────────────────────────────────
     1. SCROLL PROGRESS BAR
  ───────────────────────────────────────── */
  function initScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    if (!bar) return;
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const pct =
            window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight);
          bar.style.width = pct * 100 + "%";
          ticking = false;
        });
      },
      { passive: true },
    );
  }

  /* ─────────────────────────────────────────
     2. CUSTOM CURSOR + GLOW TRAIL
  ───────────────────────────────────────── */
  function initCursor() {
    const cursor = document.getElementById("cursor");
    const cursorDot = document.getElementById("cursorDot");
    const trail = document.getElementById("glowTrail");
    if (!cursor || !cursorDot || !trail) return;

    const ctx = trail.getContext("2d");
    let W = window.innerWidth,
      H = window.innerHeight;
    trail.width = W;
    trail.height = H;

    let mx = -200,
      my = -200,
      cx = -200,
      cy = -200;
    const pts = [];

    window.addEventListener("resize", () => {
      W = window.innerWidth;
      H = window.innerHeight;
      trail.width = W;
      trail.height = H;
    });
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";
      cursorDot.style.left = mx + "px";
      cursorDot.style.top = my + "px";
    });
    document
      .querySelectorAll("a, button, .surface-card, .metric-card, .stack-layer")
      .forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
        el.addEventListener("mouseleave", () =>
          cursor.classList.remove("hover"),
        );
      });

    (function loop() {
      requestAnimationFrame(loop);
      cx += (mx - cx) * 0.1;
      cy += (my - cy) * 0.1;
      pts.push({ x: cx, y: cy });
      if (pts.length > 30) pts.shift();
      ctx.clearRect(0, 0, W, H);
      for (let i = 1; i < pts.length; i++) {
        const t = i / pts.length;
        ctx.beginPath();
        ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
        ctx.lineTo(pts[i].x, pts[i].y);
        ctx.strokeStyle = `rgba(212,165,74,${t * 0.2})`;
        ctx.lineWidth = t * 2.8;
        ctx.lineCap = "round";
        ctx.stroke();
      }
    })();
  }

  /* ─────────────────────────────────────────
     3. PARALLAX ON SCROLL
     Disabled on touch/small screens to prevent jank
  ───────────────────────────────────────── */
  function initParallax() {
    // Skip on touch devices or screens narrower than 900px
    if (window.innerWidth < 900 || window.matchMedia("(hover: none)").matches)
      return;

    const els = document.querySelectorAll("[data-parallax]");
    if (!els.length) return;
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const sy = window.scrollY;
          els.forEach((el) => {
            const factor = parseFloat(el.dataset.parallax) || 0.2;
            el.style.transform = `translateY(${sy * factor}px)`;
          });
          ticking = false;
        });
      },
      { passive: true },
    );
  }

  /* ─────────────────────────────────────────
     4. HERO LOAD ANIMATION
  ───────────────────────────────────────── */
  function initHeroLoad() {
    // Trigger mask reveals + eyebrow after a short delay
    setTimeout(() => {
      document.body.classList.add("hero-loaded");
    }, 200);
  }

  /* ─────────────────────────────────────────
     5. THREE.JS SPHERE HERO
  ───────────────────────────────────────── */
  function initHeroSphere() {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas || typeof THREE === "undefined") return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 3.2;

    function resize() {
      const W = canvas.parentElement.offsetWidth;
      const H = canvas.parentElement.offsetHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    /* Fibonacci sphere */
    const N = 220,
      phi_g = Math.PI * (3 - Math.sqrt(5));
    const pos = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = phi_g * i;
      pos.push(r * Math.cos(t), y, r * Math.sin(t));
    }

    /* Points */
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    const ptMat = new THREE.PointsMaterial({
      color: 0xd4a54a,
      size: 0.019,
      transparent: true,
      opacity: 0.72,
    });

    /* Lines */
    const lp = [];
    for (let i = 0; i < N; i++)
      for (let j = i + 1; j < N; j++) {
        const dx = pos[i * 3] - pos[j * 3],
          dy = pos[i * 3 + 1] - pos[j * 3 + 1],
          dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < 0.22)
          lp.push(
            pos[i * 3],
            pos[i * 3 + 1],
            pos[i * 3 + 2],
            pos[j * 3],
            pos[j * 3 + 1],
            pos[j * 3 + 2],
          );
      }
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", new THREE.Float32BufferAttribute(lp, 3));
    const lMat = new THREE.LineBasicMaterial({
      color: 0xd4a54a,
      transparent: true,
      opacity: 0.08,
    });

    /* Accent nodes */
    const aIdx = [0, 22, 44, 66, 88, 110, 132, 154, 176, 198],
      aPos = [];
    for (const i of aIdx) aPos.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
    const aGeo = new THREE.BufferGeometry();
    aGeo.setAttribute("position", new THREE.Float32BufferAttribute(aPos, 3));
    const aMat = new THREE.PointsMaterial({
      color: 0xffeebb,
      size: 0.048,
      transparent: true,
      opacity: 0.9,
    });

    /* Core glow */
    const cGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const cMat = new THREE.MeshBasicMaterial({
      color: 0xd4a54a,
      transparent: true,
      opacity: 0.22,
    });

    const group = new THREE.Group();
    group.add(new THREE.Points(ptGeo, ptMat));
    group.add(new THREE.LineSegments(lGeo, lMat));
    group.add(new THREE.Points(aGeo, aMat));
    group.add(new THREE.Mesh(cGeo, cMat));
    scene.add(group);

    let tX = 0,
      tY = 0,
      cX = 0,
      cY = 0,
      tick = 0;
    document.addEventListener("mousemove", (e) => {
      tX = e.clientX / window.innerWidth - 0.5;
      tY = e.clientY / window.innerHeight - 0.5;
    });

    (function animate() {
      requestAnimationFrame(animate);
      tick += 0.0032;
      cX += (tX * 0.65 - cX) * 0.04;
      cY += (tY * 0.35 - cY) * 0.04;
      group.rotation.y = tick + cX;
      group.rotation.x = cY;
      cMat.opacity = 0.16 + 0.1 * Math.sin(tick * 2.2);
      renderer.render(scene, camera);
    })();
  }

  /* ─────────────────────────────────────────
     6. 20 SURFACES GRID
  ───────────────────────────────────────── */
  const SURFACES = [
    {
      name: "Google",
      desc: "Search rankings & SERP domination",
      color: "#4285f4",
      svg: '<svg viewBox="0 0 48 48"><path d="M44 24.5c0-1.57-.14-3.09-.4-4.55H24v8.51h11.26c-.49 2.63-1.97 4.85-4.2 6.34v5.27h6.8c3.97-3.66 6.14-9.04 6.14-15.57z" fill="#4285F4"/><path d="M24 46c5.7 0 10.49-1.89 13.99-5.13l-6.83-5.27c-1.89 1.27-4.31 2.01-7.16 2.01-5.5 0-10.16-3.71-11.83-8.7H5.14v5.44C8.7 41.35 15.84 46 24 46z" fill="#34A853"/><path d="M12.17 28.91c-.88-2.55-.88-5.27 0-7.82V15.65H5.14C2.38 19.88 1 24.88 1 26s1.38 6.12 4.14 10.35l7.03-5.44z" fill="#FBBC05"/><path d="M24 10.28c3.1 0 5.88 1.07 8.07 3.16l6.04-6.04C34.46 4.04 29.67 2 24 2 15.84 2 8.7 6.65 5.14 13.65l7.03 5.44c1.67-4.99 6.33-8.81 11.83-8.81z" fill="#EA4335"/></svg>',
    },
    {
      name: "SEO",
      desc: "Technical & on-page optimisation",
      color: "#4f8fff",
      svg: '<svg viewBox="0 0 48 48" fill="none"><circle cx="19" cy="19" r="13" stroke="#4f8fff" stroke-width="3.5"/><line x1="28.5" y1="28.5" x2="43" y2="43" stroke="#4f8fff" stroke-width="4" stroke-linecap="round"/></svg>',
    },
    {
      name: "AEO",
      desc: "Answer engine & AI response capture",
      color: "#06d6a0",
      svg: '<svg viewBox="0 0 48 48" fill="none"><rect x="5" y="7" width="38" height="34" rx="5" stroke="#06d6a0" stroke-width="2.5"/><circle cx="37" cy="13" r="6" fill="#06d6a0"/></svg>',
    },
    {
      name: "AIO",
      desc: "Google AI Overview placement",
      color: "#a855f7",
      svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M24 3L5 13.5v21L24 45l19-10.5v-21L24 3z" stroke="#a855f7" stroke-width="2.5"/><circle cx="24" cy="24" r="6" fill="#a855f7" opacity=".85"/></svg>',
    },
    {
      name: "E-E-A-T",
      desc: "Experience, Expertise, Authority, Trust",
      color: "#ec4899",
      svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M24 3l6 12.2L43 17.2l-9.5 9.3L35.7 40 24 33.8 12.3 40l2.2-13.5L5 17.2l13-2L24 3z" fill="#ec4899" opacity=".85"/></svg>',
    },
    {
      name: "ChatGPT",
      desc: "AI search citation & prominence",
      color: "#10a37f",
      svg: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="#10a37f"/><path d="M16 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/><rect x="16" y="23" width="16" height="10" rx="2" fill="#fff" opacity=".7"/></svg>',
    },
    {
      name: "Maps",
      desc: "Local map pack visibility",
      color: "#ea4335",
      svg: '<svg viewBox="0 0 48 48"><path d="M24 2C14.6 2 7 9.4 7 18.5 7 31 24 46 24 46s17-15 17-27.5C41 9.4 33.4 2 24 2z" fill="#EA4335"/><circle cx="24" cy="18" r="4.5" fill="#fff"/></svg>',
    },
    {
      name: "Schema",
      desc: "Structured data & rich results",
      color: "#14b8a6",
      svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M16 7L3 24l13 17" stroke="#14b8a6" stroke-width="3.5" stroke-linecap="round"/><path d="M32 7l13 17-13 17" stroke="#14b8a6" stroke-width="3.5" stroke-linecap="round"/></svg>',
    },
    {
      name: "Perplexity",
      desc: "AI search discovery & citations",
      color: "#1a7f64",
      svg: '<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="19" stroke="#1a7f64" stroke-width="2.5"/><path d="M12 24h10l4-8 4 16 4-8h10" stroke="#1a7f64" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    },
    {
      name: "Copilot",
      desc: "Microsoft AI & Bing search",
      color: "#00a4ef",
      svg: '<svg viewBox="0 0 48 48"><path d="M9 5v31l11 7 19-11.5v-8L22 17l-5 2.5V5H9z" fill="#00a4ef"/></svg>',
    },
    {
      name: "Reddit",
      desc: "Community trust & brand signals",
      color: "#ff4500",
      svg: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="19" fill="#FF4500"/><ellipse cx="24" cy="28.5" rx="11" ry="7.5" fill="#fff"/><circle cx="19.5" cy="26.5" r="2.5" fill="#FF4500"/><circle cx="28.5" cy="26.5" r="2.5" fill="#FF4500"/></svg>',
    },
    {
      name: "Gemini",
      desc: "Google AI platform & search",
      color: "#4285f4",
      svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M24 2C17 14 9 18 2 26c7 6 15 12 22 20 7-8 15-14 22-20C39 18 31 14 24 2z" fill="url(#gem2)"/><defs><linearGradient id="gem2" x1="2" y1="2" x2="46" y2="46"><stop stop-color="#4285F4"/><stop offset=".5" stop-color="#34A853"/><stop offset="1" stop-color="#EA4335"/></linearGradient></defs></svg>',
    },
    {
      name: "Local SEO",
      desc: "Geo-targeted ranking signals",
      color: "#f59e0b",
      svg: '<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="19" r="15" stroke="#f59e0b" stroke-width="2.5"/><path d="M17 42l7-7 7 7" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/></svg>',
    },
    {
      name: "GBP",
      desc: "Google Business Profile mastery",
      color: "#34a853",
      svg: '<svg viewBox="0 0 48 48" fill="none"><rect x="7" y="9" width="34" height="30" rx="4" stroke="#34A853" stroke-width="2.5"/><circle cx="24" cy="21" r="7" stroke="#34A853" stroke-width="2.5"/></svg>',
    },
    {
      name: "Citations",
      desc: "Directory & NAP consistency",
      color: "#8b5cf6",
      svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M9 11h30v32H9z" stroke="#8b5cf6" stroke-width="2.5"/><path d="M15 20h18M15 26.5h14" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round" opacity=".55"/></svg>',
    },
    {
      name: "Tech SEO",
      desc: "Core Web Vitals & crawlability",
      color: "#f97316",
      svg: '<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="9" stroke="#f97316" stroke-width="3"/><path d="M24 3v7M24 38v7M3 24h7M38 24h7" stroke="#f97316" stroke-width="3" stroke-linecap="round"/></svg>',
    },
    {
      name: "Links",
      desc: "Backlink authority & acquisition",
      color: "#3b82f6",
      svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M19 29l-5 5a6.4 6.4 0 010-9l9-9a6.4 6.4 0 019 0 6.4 6.4 0 010 9" stroke="#3b82f6" stroke-width="3.5" stroke-linecap="round"/><path d="M29 19l5-5a6.4 6.4 0 010 9l-9 9a6.4 6.4 0 01-9 0 6.4 6.4 0 010-9" stroke="#3b82f6" stroke-width="3.5" stroke-linecap="round"/></svg>',
    },
    {
      name: "Content",
      desc: "Topical authority & content strategy",
      color: "#e879f9",
      svg: '<svg viewBox="0 0 48 48" fill="none"><path d="M7 5h26l8 8v30a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="#e879f9" stroke-width="2.5"/></svg>',
    },
    {
      name: "Voice",
      desc: "Voice search & assistant visibility",
      color: "#06b6d4",
      svg: '<svg viewBox="0 0 48 48" fill="none"><rect x="17" y="5" width="14" height="24" rx="7" stroke="#06b6d4" stroke-width="2.5"/><path d="M11 24c0 7.2 5.8 13 13 13s13-5.8 13-13" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round"/></svg>',
    },
    {
      name: "Snippets",
      desc: "Featured snippet & position zero",
      color: "#fbbf24",
      svg: '<svg viewBox="0 0 48 48" fill="none"><rect x="5" y="7" width="38" height="14" rx="4" stroke="#fbbf24" stroke-width="2.5"/><path d="M5 29h28M5 37h20" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" opacity=".45"/></svg>',
    },
  ];

  const RELATED = [
    [0, 1],
    [0, 3],
    [0, 6],
    [0, 11],
    [1, 2],
    [1, 4],
    [1, 7],
    [1, 16],
    [1, 17],
    [2, 5],
    [2, 8],
    [2, 9],
    [2, 11],
    [3, 11],
    [4, 13],
    [5, 8],
    [6, 12],
    [6, 13],
    [6, 14],
    [7, 15],
    [10, 17],
    [12, 13],
    [15, 16],
    [17, 18],
    [18, 19],
  ];

  function initSurfaces() {
    const grid = document.getElementById("surfacesGrid");
    const canvas = document.getElementById("surfaceCanvas");
    if (!grid || !canvas) return;

    SURFACES.forEach((s, i) => {
      const card = document.createElement("div");
      card.className = "surface-card";
      card.dataset.index = i;
      card.style.setProperty("--sc-color", s.color);
      card.style.transitionDelay = i * 28 + "ms";
      card.innerHTML = `
        <div class="sc-icon" style="background:${s.color}18">
          ${s.svg}
          <div class="sc-icon-glow" style="background:${s.color}"></div>
        </div>
        <div class="sc-name">${s.name}</div>
        <div class="sc-desc">${s.desc}</div>
        <div class="sc-pulse" style="background:${s.color}"></div>
      `;
      grid.appendChild(card);
    });

    const ctx = canvas.getContext("2d");
    let W = 0,
      H = 0,
      hoveredIdx = -1;

    function resize() {
      const r = grid.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
    }

    function getCenter(idx) {
      const cards = grid.querySelectorAll(".surface-card");
      const card = cards[idx];
      if (!card) return null;
      const cr = card.getBoundingClientRect();
      const gr = grid.getBoundingClientRect();
      return {
        x: cr.left - gr.left + cr.width / 2,
        y: cr.top - gr.top + cr.height / 2,
      };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      if (hoveredIdx < 0) return;
      const related = RELATED.filter(
        (p) => p[0] === hoveredIdx || p[1] === hoveredIdx,
      ).map((p) => (p[0] === hoveredIdx ? p[1] : p[0]));
      const from = getCenter(hoveredIdx);
      if (!from) return;
      related.forEach((ri) => {
        const to = getCenter(ri);
        if (!to) return;
        const g = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        g.addColorStop(0, SURFACES[hoveredIdx].color + "88");
        g.addColorStop(1, SURFACES[ri].color + "44");
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(to.x, to.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = SURFACES[ri].color + "99";
        ctx.fill();
      });
    }

    grid.addEventListener("mouseover", (e) => {
      const c = e.target.closest(".surface-card");
      if (c) {
        hoveredIdx = parseInt(c.dataset.index);
        draw();
      }
    });
    grid.addEventListener("mouseleave", () => {
      hoveredIdx = -1;
      ctx.clearRect(0, 0, W, H);
    });
    window.addEventListener("resize", () => {
      resize();
      draw();
    });

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          grid.querySelectorAll(".surface-card").forEach((c, i) => {
            setTimeout(() => c.classList.add("visible"), i * 28);
          });
          setTimeout(resize, 120);
          io.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    io.observe(grid);
  }

  /* ─────────────────────────────────────────
     7. SIGNAL JOURNEY STORYTELLING
  ───────────────────────────────────────── */

  const JOURNEY = [
    {
      phase: "Creation",
      color: "#4f8fff",
      num: "01",
      icon: "✍️",
      title: "Content Is Published",
      line: "Your content enters the cosmos — structured for bots, AI, and humans.",
      yes: "AEO-ready, schema-marked, topical clusters",
      no: "Invisible to every crawl and citation engine",
    },
    {
      phase: "Discovery",
      color: "#06d6a0",
      num: "02",
      icon: "🔍",
      title: "A Crawler Visits",
      line: "Speed, structure, and accessibility decide if bots can even read your page.",
      yes: "Optimised crawl budget, Core Web Vitals passed",
      no: "Pages bots skip entirely — never indexed",
    },
    {
      phase: "Processing",
      color: "#a855f7",
      num: "03",
      icon: "⚙️",
      title: "Your Page Is Indexed",
      line: "Schema tells the algorithm exactly what you are. Without it, you're just text.",
      yes: "30+ schema types, entity-mapped content",
      no: "Unstructured text ranked below everything",
    },
    {
      phase: "Authority",
      color: "#d4a54a",
      num: "04",
      icon: "🛡️",
      title: "E-E-A-T Is Assessed",
      line: "Google scores your trust, expertise, and authority. This takes months to build.",
      yes: "DA60+ links, entity signals, trust architecture",
      no: "Outranked by less relevant but more trusted sites",
    },
    {
      phase: "Ranking",
      color: "#ec4899",
      num: "05",
      icon: "📊",
      title: "A Position Is Assigned",
      line: "Position 1 = 27.6% of clicks. Position 10 = 2.4%. The gap is everything.",
      yes: "Featured snippets, map packs, AI overviews",
      no: "Page 2 — where less than 1% of users ever look",
    },
    {
      phase: "AI Layer",
      color: "#10a37f",
      num: "06",
      icon: "🤖",
      title: "AI Platforms Reference You",
      line: "ChatGPT, Gemini, Perplexity now answer queries before users reach a website.",
      yes: "Cited by AI as the authoritative answer",
      no: "Invisible to 200M+ weekly AI search users",
    },
    {
      phase: "Conversion",
      color: "#f97316",
      num: "07",
      icon: "🎯",
      title: "A Customer Finds You",
      line: "After 6 engineered nodes — a real human finds your brand and converts.",
      yes: "Full-funnel visibility across all 20 surfaces",
      no: "Your revenue going to competitors who invested",
    },
  ];

  function initJourney() {
    const col = document.getElementById("journeyStepsCol");
    const numEl = document.getElementById("journeyNum");
    const phaseEl = document.getElementById("journeyPhase");
    const fillEl = document.getElementById("journeySpineFill");
    const sidebar = document.getElementById("journeySidebar");
    if (!col) return;

    /* Inject steps */
    JOURNEY.forEach((s, i) => {
      const el = document.createElement("div");
      el.className = "journey-step";
      el.dataset.index = i;
      el.style.setProperty("--jsc", s.color);

      el.innerHTML = `
  <div class="js-phase-tag" style="color:${s.color}">${s.num} — ${s.phase}</div>
  <div class="js-icon" style="--jsc:${s.color}">${s.icon}</div>
  <h3 class="js-title">${s.title}</h3>
  <p class="js-line">${s.line}</p>
  <div class="js-pills">
    <div class="js-pill js-pill--yes">
      <span class="jp-dot" style="background:${s.color}"></span>
      <span>${s.yes}</span>
    </div>
    <div class="js-pill js-pill--no">
      <span class="jp-dot" style="background:#ec4899"></span>
      <span>${s.no}</span>
    </div>
  </div>
`;
      col.appendChild(el);
    });

    /* Activate first step */
    const steps = col.querySelectorAll(".journey-step");
    let activeIdx = -1;

    function activate(idx) {
      if (idx === activeIdx) return;
      activeIdx = idx;
      steps.forEach((s, i) => s.classList.toggle("js-active", i === idx));
      if (numEl) numEl.textContent = JOURNEY[idx].num;
      if (phaseEl) {
        phaseEl.textContent = JOURNEY[idx].phase;
        phaseEl.style.setProperty("--journey-c", JOURNEY[idx].color);
        if (sidebar)
          sidebar.style.setProperty("--journey-c", JOURNEY[idx].color);
      }
      if (fillEl)
        fillEl.style.height = ((idx + 1) / JOURNEY.length) * 100 + "%";
    }

    activate(0);

    /* On mobile, all steps are fully visible — just track which is active */
    const isMobile = window.innerWidth < 900;

    /* IntersectionObserver — fire when step is in view */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            activate(parseInt(e.target.dataset.index));
          }
        });
      },
      {
        threshold: isMobile ? 0.2 : 0.45,
        rootMargin: isMobile ? "-10% 0px -10% 0px" : "-15% 0px -15% 0px",
      },
    );

    steps.forEach((s) => io.observe(s));
  }

  /* ─────────────────────────────────────────
     8. STACK LAYER REVEAL
  ───────────────────────────────────────── */
  function initStack() {
    const layers = document.querySelectorAll(".stack-layer");
    if (!layers.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          layers.forEach((l, i) =>
            setTimeout(() => l.classList.add("visible"), i * 130),
          );
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(layers[0].parentElement);
  }

  /* ─────────────────────────────────────────
     9. ANIMATED COUNTERS
  ───────────────────────────────────────── */
  function initCounters() {
    const cards = document.querySelectorAll(".metric-card");
    if (!cards.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const card = e.target;
          const valEl = card.querySelector(".mc-value");
          if (!valEl) return;
          const target = parseFloat(valEl.dataset.target);
          const suffix = valEl.dataset.suffix || "";
          const color = card.dataset.color;
          if (color) valEl.style.color = color;
          let start = null;
          const dur = 1800;
          function step(ts) {
            if (!start) start = ts;
            const prog = Math.min((ts - start) / dur, 1);
            const ease = 1 - Math.pow(1 - prog, 3);
            const cur = target * ease;
            valEl.textContent =
              (target < 10 ? cur.toFixed(1) : Math.round(cur)) + suffix;
            if (prog < 1) requestAnimationFrame(step);
            else valEl.textContent = target + suffix;
          }
          requestAnimationFrame(step);
          io.unobserve(card);
        });
      },
      { threshold: 0.5 },
    );
    cards.forEach((c) => io.observe(c));
  }

  /* ─────────────────────────────────────────
     10. GENERAL SCROLL REVEAL
     (cs-reveal, cs-enter, cs-eyebrow)
  ───────────────────────────────────────── */
  function initReveal() {
    const selectors = ".cs-reveal, .cs-enter, .cs-eyebrow";
    const els = document.querySelectorAll(selectors);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
  }

  /* ─────────────────────────────────────────
   TYPEWRITER CYCLING EFFECT
───────────────────────────────────────── */
  function initTypewriter() {
    const el = document.getElementById("ctaTypewriter");
    if (!el) return;

    const phrases = [
      "Already Optimizing.",
      "Capturing Your Leads.",
      "Taking Your Rankings.",
      "Owning Your Traffic.",
      "Winning Your Customers.",
      "Building Their Authority.",
    ];

    let phraseIdx = 0;
    let charIdx = phrases[0].length; // start full
    let deleting = false;
    let paused = false;

    const TYPING_SPEED = 55; // ms per character typed
    const DELETE_SPEED = 32; // ms per character deleted
    const PAUSE_AFTER = 2200; // ms to hold before deleting
    const PAUSE_BEFORE = 400; // ms to hold empty before typing next

    function tick() {
      const current = phrases[phraseIdx];

      if (paused) return; // pauses handled via setTimeout

      if (!deleting) {
        // Typing
        charIdx++;
        el.textContent = current.slice(0, charIdx);

        if (charIdx === current.length) {
          // Finished typing — pause then start deleting
          paused = true;
          setTimeout(() => {
            paused = false;
            deleting = true;
            setTimeout(tick, DELETE_SPEED);
          }, PAUSE_AFTER);
          return;
        }
        setTimeout(tick, TYPING_SPEED);
      } else {
        // Deleting
        charIdx--;
        el.textContent = current.slice(0, charIdx);

        if (charIdx === 0) {
          // Finished deleting — move to next phrase
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          charIdx = 0;
          paused = true;
          setTimeout(() => {
            paused = false;
            setTimeout(tick, TYPING_SPEED);
          }, PAUSE_BEFORE);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }

    paused = true ; 
    setTimeout(() => {
      paused = false ; 
      deleting = true ; 
      setTimeout(tick, DELETE_SPEED) ; 
    }, PAUSE_AFTER);
  }

  /* ─────────────────────────────────────────
     INIT
  ───────────────────────────────────────── */
  function init() {
    initScrollProgress();
    initCursor();
    initParallax();
    initHeroLoad();
    initHeroSphere();
    initSurfaces();
    initJourney();
    initStack();
    initCounters();
    initReveal();
    initTypewriter();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
