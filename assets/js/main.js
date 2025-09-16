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
})();
