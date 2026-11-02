import { initDesign } from './design.js';
import { motion } from './motion.config.js';

(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const clientURL = document.currentScript?.src;
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  function initMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('#mobile-nav');
    if (!toggle || !menu) return () => {};
    const mobile = matchMedia('(max-width: 700px)');
    function close(returnFocus = false) {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
    }
    function click() {
      const opening = toggle.getAttribute('aria-expanded') !== 'true';
      menu.hidden = !opening;
      toggle.setAttribute('aria-expanded', String(opening));
      if (opening) menu.querySelector('a')?.focus();
    }
    function key(event) { if (event.key === 'Escape' && !menu.hidden) close(true); }
    function navigate(event) {
      const link = event.target.closest('a');
      if (!link) return;
      close();
      if (link.getAttribute('href').startsWith('#')) {
        const target = document.getElementById(link.hash.slice(1));
        if (target) setTimeout(() => {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        }, 0);
      }
    }
    function resize() { if (!mobile.matches) close(); }
    function outside(event) { if (!menu.hidden && !event.target.closest('.site-header')) close(); }
    toggle.addEventListener('click', click);
    menu.addEventListener('click', navigate);
    document.addEventListener('keydown', key);
    document.addEventListener('click', outside);
    mobile.addEventListener('change', resize);
    return () => {
      toggle.removeEventListener('click', click); menu.removeEventListener('click', navigate);
      document.removeEventListener('keydown', key); document.removeEventListener('click', outside);
      mobile.removeEventListener('change', resize);
    };
  }

  function initCopy() {
    const button = document.querySelector('.copy-email');
    const status = document.querySelector('.copy-status');
    if (!button || !status) return () => {};
    async function copy() {
      const email = 'ratnadeepp2007@gmail.com';
      try {
        if (navigator.clipboard && isSecureContext) await navigator.clipboard.writeText(email);
        else {
          const field = document.createElement('textarea'); field.value = email;
          field.setAttribute('aria-hidden', 'true'); field.style.cssText = 'position:fixed;opacity:0;left:-9999px';
          document.body.append(field); field.select();
          let success;
          try { success = document.execCommand('copy'); } finally { field.remove(); button.focus(); }
          if (!success) throw new Error('Copy not available');
        }
        status.textContent = 'Email address copied.';
      } catch {
        status.textContent = 'Copy is unavailable. Use the email link, or select ratnadeepp2007@gmail.com.';
      }
    }
    button.addEventListener('click', copy);
    return () => button.removeEventListener('click', copy);
  }

  function initNavigation() {
    if (!('IntersectionObserver' in window) || !document.querySelector('.home-page')) return () => {};
    const links = [...document.querySelectorAll('[data-nav]')];
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach(link => {
        if (link.dataset.nav === visible.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-10% 0px -55% 0px', threshold: 0 });
    ['work','about','contact'].forEach(id => { const section = document.getElementById(id); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }

  function initMotion() {
    if (!('IntersectionObserver' in window) || !Element.prototype.animate) return () => {};
    const animations = [];
    const progress = document.createElement('div');
    progress.className = 'reading-progress'; progress.setAttribute('aria-hidden', 'true');
    document.body.prepend(progress);
    const hero = document.querySelector('.hero');
    const articles = [...document.querySelectorAll('.project-showcase')];
    const indexLinks = [...document.querySelectorAll('[data-project-link]')];
    const explorer = document.querySelector('[data-explorer]');
    let frame = 0;
    function animate(el, frames, options) {
      if (reducedMotion.matches || el.contains(document.activeElement)) return;
      const animation = el.animate(frames, { duration: motion.reveal, easing: motion.ease, ...options });
      animations.push(animation);
      return animation;
    }
    const reveal = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target; reveal.unobserve(el);
        if (el.dataset.motionRevealed) continue;
        el.dataset.motionRevealed = 'true';
        if (el.matches('.project-art')) {
          animate(el, [{ clipPath: 'inset(0 100% 0 0)', opacity: .45 }, { clipPath: 'inset(0 0% 0 0)', opacity: 1 }], { duration: motion.scene });
          el.querySelectorAll('svg > g path[stroke]').forEach((path, i) => {
            if (reducedMotion.matches) return;
            const length = path.getTotalLength();
            path.style.strokeDasharray = String(length);
            const animation = animate(path, [{ strokeDashoffset: length }, { strokeDashoffset: 0 }], { duration: motion.scene, delay: 180 + i * 50 });
            if (animation) animation.finished.then(() => path.style.removeProperty('stroke-dasharray')).catch(() => path.style.removeProperty('stroke-dasharray'));
          });
        } else {
          animate(el, [{ opacity: .12, transform: 'translateY(42px)', clipPath: 'inset(0 0 10% 0)' }, { opacity: 1, transform: 'translateY(0)', clipPath: 'inset(0 0 0% 0)' }]);
        }
      }
    }, { threshold: .12, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.work-heading h2,.work-heading>p,.project-copy,.project-art,.about-grid h2,.about-text,.experience>h3,.experience-row,.contact-heading h2,.case-hero h1,.case-summary,.case-article>section,.next-project').forEach(el => reveal.observe(el));
    const visibility = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('motion-in-view', entry.isIntersecting));
    }, { threshold: .08 });
    if (explorer) visibility.observe(explorer);
    document.querySelectorAll('.project-art').forEach(el => visibility.observe(el));
    function paint() {
      frame = 0;
      const height = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${height > 0 ? scrollY / height : 0})`;
      if (hero) {
        const travel = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / innerHeight));
        hero.style.setProperty('--hero-shift', reducedMotion.matches ? '0px' : `${-travel * 50}px`);
        hero.style.setProperty('--study-shift', reducedMotion.matches ? '0px' : `${travel * 22}px`);
      }
      let active = '';
      for (const article of articles) {
        const rect = article.getBoundingClientRect();
        if (rect.top < innerHeight * .58 && rect.bottom > innerHeight * .22) active = article.id.replace('project-', '');
        if (!reducedMotion.matches) article.style.setProperty('--diagram-drift', `${Math.max(-12, Math.min(12, (innerHeight * .5 - rect.top) * .035))}px`);
        else article.style.setProperty('--diagram-drift', '0px');
      }
      indexLinks.forEach(link => {
        if (link.dataset.projectLink === active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }
    // Schedule one paint per input frame. There is no self-scheduling render loop.
    function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
    function preference() {
      if (reducedMotion.matches) animations.forEach(a => a.cancel());
      schedule();
    }
    function pageVisibility() { document.documentElement.classList.toggle('page-inactive', document.hidden); }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    document.addEventListener('visibilitychange', pageVisibility);
    reducedMotion.addEventListener('change', preference);
    paint();
    return () => {
      reveal.disconnect(); visibility.disconnect(); animations.forEach(a => a.cancel());
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', pageVisibility); reducedMotion.removeEventListener('change', preference);
      if (frame) cancelAnimationFrame(frame);
      progress.remove();
    };
  }

  let cleanups = [];
  function mount() { cleanups = [initMenu(), initCopy(), initNavigation(), initMotion(), initDesign(clientURL)]; }
  mount();
  window.addEventListener('pagehide', () => { cleanups.forEach(fn => fn()); cleanups = []; });
  window.addEventListener('pageshow', event => { if (event.persisted) mount(); });
})();
