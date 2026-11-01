// Natural-scroll typography choreography. Static HTML remains the fallback.
export function initScrollStory() {
  const root = document.querySelector('[data-scroll-story]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const stage = root?.querySelector('.story-stage');
  const steps = root ? [...root.querySelectorAll('.story-step')] : [];
  const counter = root?.querySelector('[data-story-index]');
  const count = root?.querySelector('.story-count');
  const progress = root?.querySelector('.story-progress');
  const cards = [...document.querySelectorAll('.project-art')];
  const listeners = [];
  let frame = 0;
  let disposed = false;
  let lastPhase = -1;
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const smooth = value => value * value * (3 - 2 * value);

  function resetStep(step) {
    step.style.removeProperty('opacity');
    step.style.removeProperty('transform');
    step.querySelector('.story-word')?.style.removeProperty('transform');
    step.querySelector('.story-description')?.style.removeProperty('transform');
  }

  function paint() {
    frame = 0;
    if (disposed || !root || !stage || reduced.matches || !root.classList.contains('is-story-ready')) return;
    const rect = root.getBoundingClientRect();
    const travel = Math.max(1, rect.height - stage.offsetHeight);
    const amount = clamp(-rect.top / travel);
    const position = clamp((amount - .06) / .82) * (steps.length - 1);
    const phase = Math.round(position);
    root.style.setProperty('--story-progress', String(amount));
    root.dataset.storyPhase = String(phase);
    steps.forEach((step, index) => {
      const distance = position - index;
      const opacity = 1 - smooth(clamp((Math.abs(distance) - .15) / .65));
      step.style.opacity = String(opacity);
      step.style.transform = `translate3d(${distance * -8}%,${distance * -45}px,0)`;
      const word = step.querySelector('.story-word');
      const description = step.querySelector('.story-description');
      if (word) word.style.transform = `translate3d(${distance * -45}px,0,0) rotate(${distance * -1.5}deg)`;
      if (description) description.style.transform = `translate3d(0,${distance * 24}px,0)`;
    });
    if (counter) {
      if (phase !== lastPhase) counter.textContent = String(phase + 1).padStart(2, '0');
      counter.style.transform = `translate3d(0,${(position - phase) * -70}px,0)`;
      counter.style.opacity = String(1 - Math.abs(position - phase) * .6);
    }
    if (count && phase !== lastPhase) count.textContent = `${String(phase + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`;
    lastPhase = phase;
    if (progress) progress.style.transform = `scaleX(${amount})`;
  }

  function schedule() {
    if (!frame && !disposed && !reduced.matches) frame = requestAnimationFrame(paint);
  }

  function resetCard(card) {
    card.style.removeProperty('--art-rotate-x');
    card.style.removeProperty('--art-rotate-y');
    card.style.removeProperty('--art-light-x');
    card.classList.remove('is-art-hovered');
  }

  cards.forEach(card => {
    let pointerFrame = 0;
    let point = null;
    function move(event) {
      if (event.pointerType === 'touch' || reduced.matches || !finePointer.matches) return;
      point = { x: event.clientX, y: event.clientY };
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        if (!point || disposed || reduced.matches || !finePointer.matches) return;
        const box = card.getBoundingClientRect();
        const x = clamp((point.x - box.left) / box.width);
        const y = clamp((point.y - box.top) / box.height);
        card.style.setProperty('--art-rotate-x', `${(y - .5) * -7}deg`);
        card.style.setProperty('--art-rotate-y', `${(x - .5) * 9}deg`);
        card.style.setProperty('--art-light-x', `${x * 100}%`);
        card.classList.add('is-art-hovered');
      });
    }
    function leave() {
      point = null;
      cancelAnimationFrame(pointerFrame); pointerFrame = 0;
      resetCard(card);
    }
    card.addEventListener('pointermove', move, { passive: true });
    card.addEventListener('pointerleave', leave);
    card.addEventListener('blur', leave);
    listeners.push(() => {
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerleave', leave);
      card.removeEventListener('blur', leave);
      leave();
    });
  });

  function preference() {
    const enabled = !reduced.matches && stage && steps.length > 1 && CSS.supports('position', 'sticky');
    root?.classList.toggle('is-story-ready', Boolean(enabled));
    if (!enabled) {
      cancelAnimationFrame(frame); frame = 0;
      steps.forEach(resetStep);
      root?.style.removeProperty('--story-progress');
      if (counter) { counter.style.removeProperty('transform'); counter.style.removeProperty('opacity'); }
      progress?.style.removeProperty('transform');
      lastPhase = -1;
    } else paint();
    cards.forEach(card => { if (reduced.matches || !finePointer.matches) resetCard(card); });
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', preference);
  finePointer.addEventListener('change', preference);
  preference();
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    reduced.removeEventListener('change', preference);
    finePointer.removeEventListener('change', preference);
    listeners.forEach(remove => remove());
    steps.forEach(resetStep);
    root?.classList.remove('is-story-ready');
    root?.style.removeProperty('--story-progress');
    if (counter) { counter.style.removeProperty('transform'); counter.style.removeProperty('opacity'); }
    progress?.style.removeProperty('transform');
  };
}
