(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var links = document.querySelectorAll('a[href^="#"]');
  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href").slice(1);
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.pageYOffset - 56,
          behavior: "smooth"
        });
        history.pushState(null, "", "#" + targetId);
      }
    });
  });

  // Reveal on scroll (progressive enhancement)
  var revealNodes = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    revealNodes.forEach(function (el) { io.observe(el); });
  } else {
    revealNodes.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Parallax effect for hero background
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      var y = Math.max(0, window.pageYOffset || document.documentElement.scrollTop);
      heroBg.style.transform = 'translate3d(0,' + (y * -0.08) + 'px,0) scale(1.15)';
    }, { passive: true });
  }

  // 3D tilt on mouse move
  var tilts = Array.prototype.slice.call(document.querySelectorAll('.tilt'));
  tilts.forEach(function (card) {
    var rect;
    function onMove(e) {
      rect = rect || card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var rx = (y - 0.5) * -10;
      var ry = (x - 0.5) * 10;
      card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    }
    function onLeave() {
      rect = null;
      card.style.transform = '';
    }
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });

  // Scroll progress bar
  var progress = document.getElementById('progressBar');
  if (progress) {
    var updateProgress = function () {
      var st = document.documentElement.scrollTop || document.body.scrollTop;
      var sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var p = sh > 0 ? (st / sh) * 100 : 0;
      progress.style.width = p + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  // Theme toggle with persistence
  var toggle = document.getElementById('themeToggle');
  var root = document.documentElement;
  function applyTheme(t) {
    root.classList.remove('theme-light', 'theme-dark');
    if (t === 'dark') root.classList.add('theme-dark');
    if (t === 'light') root.classList.add('theme-light');
  }
  try {
    var saved = localStorage.getItem('theme');
    if (saved) applyTheme(saved);
  } catch (e) { /* ignore */ }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var cur = root.classList.contains('theme-dark') ? 'dark' : (root.classList.contains('theme-light') ? 'light' : null);
      var next = cur === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    });
  }

  // Magnetic buttons (subtle cursor follow)
  var magnets = Array.prototype.slice.call(document.querySelectorAll('.magnet'));
  magnets.forEach(function (btn) {
    var r;
    function move(e) {
      r = r || btn.getBoundingClientRect();
      var x = e.clientX - (r.left + r.width / 2);
      var y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = 'translate(' + x * 0.08 + 'px,' + y * 0.08 + 'px)';
    }
    function leave() { r = null; btn.style.transform = ''; }
    btn.addEventListener('mousemove', move);
    btn.addEventListener('mouseleave', leave);
  });
})();
