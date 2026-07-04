// Status-panel reveal: adds .is-visible when the panel scrolls into view.
// The .js-anim class is added by JS (not in HTML) so that no-JS visitors
// still see the panels (CSS only hides them when .js-anim is present).
document.documentElement.classList.add('js-anim');

const panels = document.querySelectorAll<HTMLElement>('.status-panel');
if (panels.length) {
  if (!('IntersectionObserver' in window)) {
    panels.forEach((p) => p.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    panels.forEach((p) => io.observe(p));
  }
}
