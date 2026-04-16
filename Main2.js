(function () {
  // Scroll reveal + bar animation
  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("vis");
          e.target.querySelectorAll(".bf[data-w]").forEach(function (b, i) {
            setTimeout(function () {
              b.style.width = b.getAttribute("data-w") + "%";
            }, i * 80);
          });
        }
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll(".rv").forEach(function (el, i) {
    el.style.transitionDelay = Math.min(i * 0.04, 0.35) + "s";
    obs.observe(el);
  });

  // Hover accent lines on svc cards
  document.querySelectorAll(".svc-card").forEach(function (c) {
    var line = c.querySelector('div[style*="height:3px"]');
    if (line) {
      c.addEventListener("mouseenter", function () { line.style.opacity = "1"; });
      c.addEventListener("mouseleave", function () { line.style.opacity = "0"; });
    }
  });

  // Canvas — fixed viewport background
  var cv = document.getElementById("c"),
    fx = cv.getContext("2d");
  var W = 0, H = 0, stars = [], fr = 0;

  function init() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    if (W < 1 || H < 1) return;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cv.style.width = W + "px";
    cv.style.height = H + "px";
    fx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = [];
    for (var i = 0; i < 300; i++)
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 0.25 + 0.04,
        b: Math.random(),
        s: (Math.random() - 0.5) * 0.002,
      });
  }
  window.addEventListener("resize", init);
  init();

  function draw() {
    fr++;
    if (W < 1 || H < 1) { requestAnimationFrame(draw); return; }
    fx.clearRect(0, 0, W, H);
    var bg = fx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.7);
    bg.addColorStop(0, "#060222");
    bg.addColorStop(0.5, "#040116");
    bg.addColorStop(1, "#020108");
    fx.fillStyle = bg;
    fx.fillRect(0, 0, W, H);
    fx.save();
    fx.globalCompositeOperation = "screen";
    var nt = fr * 0.0002;
    var ws = [
      [0.2, 0.3, 0.16, 270, 45, 20],
      [0.8, 0.25, 0.14, 180, 55, 18],
      [0.5, 0.7, 0.12, 320, 40, 16],
    ];
    for (var i = 0; i < ws.length; i++) {
      var w = ws[i];
      var wg = fx.createRadialGradient(
        W * (w[0] + Math.sin(nt + i * 2) * 0.006),
        H * (w[1] + Math.cos(nt * 1.3 + i) * 0.004),
        0, W * w[0], H * w[1], Math.max(W, H) * w[2]
      );
      wg.addColorStop(0, "hsla(" + w[3] + "," + w[4] + "%," + w[5] + "%,.018)");
      wg.addColorStop(1, "transparent");
      fx.fillStyle = wg;
      fx.fillRect(0, 0, W, H);
    }
    fx.restore();
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.b += s.s;
      if (s.b > 1 || s.b < 0) s.s *= -1;
      fx.beginPath();
      fx.arc(s.x, s.y, s.r, 0, 6.28);
      fx.fillStyle = "rgba(190,200,230," + (s.b * 0.06 + 0.01) + ")";
      fx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();