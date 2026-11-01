(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
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

  function initExplorer() {
    const root = document.querySelector('[data-explorer]');
    if (!root) return () => {};
    const dataElement = document.querySelector('#study-data');
    let records;
    try { records = JSON.parse(dataElement.textContent); } catch { return () => {}; }
    const sources = [...root.querySelectorAll('[data-source]')];
    const stages = [...root.querySelectorAll('[data-stage]')];
    let source = 0;
    let stage = 0;
    let animationTimer;
    function render(animate = true) {
      const record = records[source];
      sources.forEach((button, i) => button.setAttribute('aria-pressed', String(source === i)));
      stages.forEach((button, i) => button.setAttribute('aria-pressed', String(stage === i)));
      root.querySelectorAll('[data-route]').forEach(el => el.classList.toggle('active', Number(el.dataset.route) === source));
      root.querySelectorAll('[data-node]').forEach(el => el.classList.toggle('active', Number(el.dataset.node) === source));
      root.querySelectorAll('[data-stage-node]').forEach(el => el.classList.toggle('active', Number(el.dataset.stageNode) === stage));
      root.querySelector('.decision-route').classList.toggle('active', stage >= 2);
      root.querySelector('.provenance-return').classList.toggle('active', stage >= 2);
      root.querySelector('[data-kind]').textContent = stage === 0 ? record.kind : stage === 1 ? 'CONTEXT / SOURCE RETAINED' : 'DECISION / TRACEABLE OUTPUT';
      root.querySelector('[data-statement]').textContent = stage === 0 ? '“' + record.quote + '”' : stage === 1 ? record.context : record.decision;
      root.querySelector('[data-citation]').textContent = record.source;
      if (animate && !reducedMotion.matches) {
        const detail = root.querySelector('.explorer-detail');
        detail.classList.remove('is-changing');
        void detail.offsetWidth;
        detail.classList.add('is-changing');
        clearTimeout(animationTimer);
        animationTimer = setTimeout(() => detail.classList.remove('is-changing'), 250);
      }
    }
    function click(event) {
      const sourceButton = event.target.closest('[data-source]');
      const stageButton = event.target.closest('[data-stage]');
      if (sourceButton) { source = Number(sourceButton.dataset.source); stage = 0; render(event.detail > 0); }
      else if (stageButton) { stage = Number(stageButton.dataset.stage); render(event.detail > 0); }
    }
    function key(event) {
      const button = event.target.closest('[data-source],[data-stage]');
      if (!button || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const set = button.hasAttribute('data-source') ? sources : stages;
      let index = set.indexOf(button);
      index = event.key === 'Home' ? 0 : event.key === 'End' ? set.length - 1 : (index + (['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1) + set.length) % set.length;
      set[index].focus(); set[index].click();
    }
    root.addEventListener('click', click);
    root.addEventListener('keydown', key);
    render(false);
    return () => { root.removeEventListener('click', click); root.removeEventListener('keydown', key); clearTimeout(animationTimer); };
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

  let cleanups = [];
  function mount() { cleanups = [initMenu(), initExplorer(), initCopy(), initNavigation()]; }
  mount();
  window.addEventListener('pagehide', () => { cleanups.forEach(fn => fn()); cleanups = []; });
  window.addEventListener('pageshow', event => { if (event.persisted) mount(); });
})();
