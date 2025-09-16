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
})();
