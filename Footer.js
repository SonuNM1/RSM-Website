/* ═══════════════════════════════════════════════
   FOOTER.JS — RSM  |  Starfield + interactions
   ═══════════════════════════════════════════════ */
(function () {
  "use strict";

  function initFooterCanvas() {
    const canvas = document.getElementById("footerCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W,
      H,
      stars = [];
    const dpr = window.devicePixelRatio || 1;
    const shooters = [];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.scale(dpr, dpr);
      buildStars();
    }

    function buildStars() {
      const count = Math.floor((W * H) / 4000);
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.2 + 0.2,
          a: Math.random(),
          speed: Math.random() * 0.004 + 0.001,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function spawnShooter() {
      shooters.push({
        x: Math.random() * W * 0.8,
        y: Math.random() * H * 0.5,
        vx: 3 + Math.random() * 4,
        vy: 0.5 + Math.random() * 1.5,
        life: 1,
      });
    }

    let tick = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      tick += 0.012;

      // horizon bloom
      const grd = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, W * 0.55);
      grd.addColorStop(0, "rgba(212,165,74,0.05)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // stars
      for (const s of stars) {
        const pulse =
          0.3 + 0.7 * (0.5 + 0.5 * Math.sin(tick * s.speed * 80 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(238,240,255,${s.a * pulse * 0.7})`;
        ctx.fill();
      }

      // random shooting stars
      if (Math.random() < 0.003) spawnShooter();
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.018;
        if (s.life <= 0) {
          shooters.splice(i, 1);
          continue;
        }
        const g = ctx.createLinearGradient(
          s.x - s.vx * 8,
          s.y - s.vy * 8,
          s.x,
          s.y,
        );
        g.addColorStop(0, "transparent");
        g.addColorStop(1, `rgba(212,165,74,${s.life * 0.55})`);
        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * 8, s.y - s.vy * 8);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    draw();
  }



  function setYear() {
    const el = document.getElementById("ftYear");
    if (el) el.textContent = new Date().getFullYear();
  }

  function init() {
    initFooterCanvas();
    setYear();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
