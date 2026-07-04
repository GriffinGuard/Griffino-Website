// Full-page (one-screen-per-section) navigation for the homepage.
// Desktop-only (min-width: 901px and hover:hover and pointer:fine).
// Ported verbatim from app.js initFullPage().
const page = window.location.pathname.split('/').pop() || 'index.html';
if (page === 'index.html' || page === '' || page === '/') {
  const mq = window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pages = Array.from(
    document.querySelectorAll<HTMLElement>('.hero-section, .intro-band, .feature-section, .runtime-section, .repo-section')
  );
  const labels = ['Top', 'Intro', 'Standard', 'Runtime', 'Repositories'];
  if (pages.length >= 2) {
    const lastIndex = pages.length - 1;
    let index = 0;
    let locked = false;
    let lockTimer: ReturnType<typeof setTimeout> | null = null;
    let dotsNav: HTMLElement | null = null;
    let touchStartY: number | null = null;
    let atFooter = false;

    const nearestIndex = (): number => {
      const center = window.scrollY + window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < pages.length; i++) {
        const top = pages[i].offsetTop;
        const bottom = top + pages[i].offsetHeight;
        if (center >= top && center < bottom) return i;
        const d = Math.abs(center - (top + bottom) / 2);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      return best;
    };

    const lock = () => {
      locked = true;
      if (lockTimer) clearTimeout(lockTimer);
      lockTimer = setTimeout(() => {
        locked = false;
      }, reduceMotion ? 200 : 900);
    };

    const updateDots = () => {
      if (!dotsNav) return;
      dotsNav.querySelectorAll('button').forEach((b, i) => {
        b.classList.toggle('active', i === index);
      });
    };

    const goToPage = (i: number, instant = false) => {
      const clamped = Math.max(0, Math.min(lastIndex, i));
      atFooter = false;
      index = clamped;
      const behavior = instant || reduceMotion ? 'auto' : 'smooth';
      pages[clamped].scrollIntoView({ behavior, block: 'start' });
      updateDots();
      lock();
    };

    const goToFooter = () => {
      atFooter = true;
      index = lastIndex;
      window.scrollTo({
        top: document.documentElement.scrollHeight - window.innerHeight,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
      updateDots();
      lock();
    };

    const buildDots = () => {
      if (dotsNav) return;
      dotsNav = document.createElement('nav');
      dotsNav.className = 'fp-dots';
      dotsNav.setAttribute('aria-label', 'Section navigation');
      pages.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', labels[i] || `Page ${i + 1}`);
        b.title = labels[i] || `Page ${i + 1}`;
        b.addEventListener('click', () => goToPage(i));
        dotsNav!.appendChild(b);
      });
      document.body.appendChild(dotsNav);
      updateDots();
    };

    const onWheel = (event: WheelEvent) => {
      if (!mq.matches) return;
      event.preventDefault();
      if (locked) return;
      const dir = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0;
      if (dir === 0) return;

      if (atFooter) {
        if (dir < 0) goToPage(lastIndex);
        return;
      }

      index = nearestIndex();
      const cur = pages[index];
      const rect = cur.getBoundingClientRect();

      if (dir > 0 && rect.bottom - window.innerHeight > 2) {
        window.scrollBy(0, Math.min(Math.abs(event.deltaY), rect.bottom - window.innerHeight));
        return;
      }
      if (dir < 0 && -rect.top > 2) {
        window.scrollBy(0, -Math.min(Math.abs(event.deltaY), -rect.top));
        return;
      }

      if (dir > 0) {
        if (index < lastIndex) goToPage(index + 1);
        else goToFooter();
      } else if (index > 0) {
        goToPage(index - 1);
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (!mq.matches) return;
      const key = event.key;
      const ae = document.activeElement as HTMLElement | null;
      if (ae && ae.matches && ae.matches('input, select, textarea')) return;
      if (key === ' ' && ae && ae.matches && ae.matches('a, button, [tabindex]')) return;
      let target: string | null = null;
      if (key === 'ArrowDown' || key === 'PageDown' || (key === ' ' && !event.shiftKey)) target = 'next';
      else if (key === 'ArrowUp' || key === 'PageUp' || (key === ' ' && event.shiftKey)) target = 'prev';
      else if (key === 'Home') target = 'first';
      else if (key === 'End') target = 'last';
      if (target === null) return;
      event.preventDefault();
      if (locked) return;
      index = nearestIndex();
      if (target === 'next') {
        if (atFooter) return;
        if (index < lastIndex) goToPage(index + 1);
        else goToFooter();
      } else if (target === 'prev') {
        if (atFooter) goToPage(lastIndex);
        else if (index > 0) goToPage(index - 1);
      } else if (target === 'first') {
        goToPage(0);
      } else {
        goToFooter();
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (mq.matches) event.preventDefault();
    };

    const onTouchStart = (event: TouchEvent) => {
      if (!mq.matches) return;
      touchStartY = event.touches[0] ? event.touches[0].clientY : null;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!mq.matches || touchStartY === null) return;
      const endY = event.changedTouches[0] ? event.changedTouches[0].clientY : touchStartY;
      const delta = touchStartY - endY;
      touchStartY = null;
      if (Math.abs(delta) < 50 || locked) return;
      index = nearestIndex();
      if (delta > 0) {
        if (atFooter) return;
        if (index < lastIndex) goToPage(index + 1);
        else goToFooter();
      } else if (atFooter) {
        goToPage(lastIndex);
      } else if (index > 0) {
        goToPage(index - 1);
      }
    };

    let scrollRaf: number | null = null;
    const onScroll = () => {
      if (locked) return;
      const atBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight < 2;
      if (atBottom) {
        atFooter = true;
        index = lastIndex;
        updateDots();
        return;
      }
      if (atFooter) atFooter = false;
      const n = nearestIndex();
      if (n !== index) {
        index = n;
        updateDots();
      }
    };

    const enable = () => {
      document.documentElement.classList.add('fp-active');
      buildDots();
      atFooter = false;
      index = nearestIndex();
      updateDots();
      window.scrollTo({ top: pages[index].offsetTop, behavior: 'auto' });
    };

    const disable = () => {
      document.documentElement.classList.remove('fp-active');
      // Keep dots visible on mobile as scroll-to-section navigation.
    };

    const apply = () => {
      if (mq.matches) enable();
      else disable();
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener(
      'scroll',
      () => {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(() => {
          scrollRaf = null;
          onScroll();
        });
      },
      { passive: true }
    );

    // Build section-navigation dots once; they remain visible on all viewports.
    // On mobile (where fullpage snapping is off) they act as scroll-to-section
    // anchors, since goToPage() uses scrollIntoView().
    buildDots();
    index = nearestIndex();
    updateDots();

    if (mq.addEventListener) mq.addEventListener('change', apply);
    else mq.addListener(apply);

    apply();
  }
}
