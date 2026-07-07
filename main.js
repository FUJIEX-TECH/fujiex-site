(function () {

  /* ── ANIMAÇÕES ── */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-observe]').forEach(function (el) {
    io.observe(el);
  });

  /* ── HERO: entra imediatamente ── */
  ['h1', 'h2', 'h3', 'h4'].forEach(function (id, i) {
    var el = document.getElementById(id);
    if (el) setTimeout(function () { el.classList.add('in'); }, 100 + i * 120);
  });

  /* ── LOCOMOTIVE SCROLL ── */
  /* Scroll suave (transform) trava o repaint de <video> no iOS Safari.
     Em dispositivos touch usamos scroll nativo, que não tem esse bug. */
  var isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  /* Delay de 500ms após window.load para fontes e layout estabilizarem */
  window.addEventListener('load', function () {
    setTimeout(function () {

      var locoScroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: !isTouch,
        multiplier: 0.85,
        lerp: 0.08
      });

      /* ── NAV: ocultar no scroll pra baixo, mostrar no scroll pra cima ── */
      var nav = document.getElementById('nav');
      var lastY = 0;
      locoScroll.on('scroll', function (args) {
        var y = args.scroll.y;
        nav.classList.toggle('scrolled', y > 60);
        if (y > lastY && y > 120) {
          nav.classList.add('hidden');
        } else {
          nav.classList.remove('hidden');
        }
        lastY = y;
      });

      /* ── SMOOTH SCROLL: links de nav ── */
      document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
          var href = this.getAttribute('href');
          if (href === '#') return;
          e.preventDefault();
          var target = document.querySelector(href);
          if (target) locoScroll.scrollTo(target);
        });
      });

    }, 500);
  });

  /* ── CURSOR ── */
  var cursor = document.getElementById('cursor');
  var mouseX = 0, mouseY = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.opacity = '1';
  });

  document.addEventListener('mouseleave', function () {
    cursor.style.opacity = '0';
  });

  (function tick() {
    cx += (mouseX - cx) * 0.12;
    cy += (mouseY - cy) * 0.12;
    cursor.style.transform = 'translate(' + cx + 'px, ' + cy + 'px)';
    requestAnimationFrame(tick);
  })();

})();
