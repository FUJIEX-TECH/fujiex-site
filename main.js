(function () {

  /* ── ANIMAÇÕES ──
     A revelação em scroll usa o sistema nativo do Locomotive Scroll
     (data-scroll + data-scroll-class="in"), não um IntersectionObserver
     à parte — rodar os dois juntos causava inconsistência, já que o
     Locomotive simula o scroll via transform (desliga o scroll nativo
     no modo smooth) e um observer nativo pode dessincronizar disso. */

  /* ── HERO: entra imediatamente ── */
  ['h1', 'h2', 'h3', 'h4'].forEach(function (id, i) {
    var el = document.getElementById(id);
    if (el) setTimeout(function () { el.classList.add('in'); }, 100 + i * 120);
  });

  /* ── MENU MOBILE ── */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('nav-toggle');

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.querySelectorAll('#nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

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
      var lastY = 0;
      locoScroll.on('scroll', function (args) {
        if (nav.classList.contains('open')) return;
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
