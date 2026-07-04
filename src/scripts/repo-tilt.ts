// 3D tilt + pointer glow for repo cards. Ported verbatim from app.js.
// Respects prefers-reduced-motion (falls back to glow tracking only).
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAX_TILT = 4;

document.querySelectorAll<HTMLElement>('.repo-card').forEach((card) => {
  if (reduceMotion) {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
    });
    return;
  }

  let targetX: number | null = null;
  let targetY: number | null = null;
  let currentX = 0;
  let currentY = 0;
  let started = false;
  let targetRX = 0;
  let targetRY = 0;
  let targetLift = 0;
  let targetDepth = 0;
  let currentRX = 0;
  let currentRY = 0;
  let currentLift = 0;
  let currentDepth = 0;
  let width = 1;
  let height = 1;
  let rafId: number | null = null;

  const setTarget = (event: PointerEvent) => {
    const rect = card.getBoundingClientRect();
    width = rect.width || width;
    height = rect.height || height;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    targetX = x;
    targetY = y;
    targetRY = (x / width - 0.5) * MAX_TILT * 2;
    targetRX = -(y / height - 0.5) * MAX_TILT * 2;
    targetLift = -4;
    targetDepth = 12;
  };

  const animate = () => {
    const k = 0.18;
    if (!started) {
      currentX = targetX ?? 0;
      currentY = targetY ?? 0;
      started = true;
    } else {
      currentX += (targetX! - currentX) * k;
      currentY += (targetY! - currentY) * k;
    }
    currentRX += (targetRX - currentRX) * k;
    currentRY += (targetRY - currentRY) * k;
    currentLift += (targetLift - currentLift) * k;
    currentDepth += (targetDepth - currentDepth) * k;

    card.style.setProperty('--pointer-x', `${currentX}px`);
    card.style.setProperty('--pointer-y', `${currentY}px`);
    card.style.setProperty('--rx', `${currentRX.toFixed(2)}deg`);
    card.style.setProperty('--ry', `${currentRY.toFixed(2)}deg`);
    card.style.setProperty('--lift', `${currentLift.toFixed(2)}px`);
    card.style.setProperty('--depth', `${currentDepth.toFixed(2)}px`);

    const settled =
      started &&
      Math.abs(targetX! - currentX) < 0.3 &&
      Math.abs(targetY! - currentY) < 0.3 &&
      Math.abs(targetRX - currentRX) < 0.05 &&
      Math.abs(targetRY - currentRY) < 0.05 &&
      Math.abs(targetLift - currentLift) < 0.1 &&
      Math.abs(targetDepth - currentDepth) < 0.1;
    if (!settled) {
      rafId = requestAnimationFrame(animate);
    } else {
      currentRX = targetRX;
      currentRY = targetRY;
      currentLift = targetLift;
      currentDepth = targetDepth;
      rafId = null;
    }
  };

  const kick = () => {
    if (rafId === null) rafId = requestAnimationFrame(animate);
  };

  card.addEventListener('pointerenter', (event) => {
    setTarget(event);
    kick();
  });
  card.addEventListener('pointermove', (event) => {
    setTarget(event);
    kick();
  });
  card.addEventListener('pointerleave', () => {
    targetRX = 0;
    targetRY = 0;
    targetLift = 0;
    targetDepth = 0;
    kick();
  });
});

export {};
