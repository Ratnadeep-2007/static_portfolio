import { profile, projects } from './content.mjs';
import { escape } from './html.mjs';
import { ProjectDemo } from './demos.mjs';
import { KnotPreview, SignatureSection, SkillsSection, CommandPalette } from './sections.mjs';
export { escape } from './html.mjs';
const arrow = '<span aria-hidden="true">↗</span>';
export const sourceLink = (href, label, cls = '') => `<a class="${cls}" href="${escape(href)}" target="_blank" rel="noopener noreferrer">${label}${arrow}</a>`;

export function SiteHeader(base = './', detail = false) {
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header wrap" id="top">
    <a class="wordmark" href="${base}index.html" aria-label="Ratnadeep Patil, home"><svg viewBox="0 0 58 44" width="48" height="40" aria-hidden="true"><path d="M5 31V14m0 5q5-8 12-5M36 40V14m0 0h8q10 0 10 9t-10 9h-8" fill="none" stroke="#f4efff" stroke-width="3.5"/><path d="m29 5-9 32" stroke="#b69bff" stroke-width="3"/></svg><small>RATNADEEP PATIL</small></a>
    <nav class="desktop-nav" aria-label="Main navigation"><a href="${detail ? base + 'index.html' : ''}#work" data-nav="work">Work</a><a href="${detail ? base + 'index.html' : ''}#about" data-nav="about">About</a><a href="${detail ? base + 'index.html' : ''}#contact" data-nav="contact">Contact</a></nav>
    <noscript><style>.signature-pause,.command-trigger{display:none!important}.menu-toggle{display:none!important}@media(max-width:700px){.desktop-nav{display:flex;width:100%;gap:24px;padding-bottom:14px;font-size:12px}}.source-picker,.stage-picker,.motion-toggle{display:none!important}</style></noscript>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav">Menu <span aria-hidden="true">+</span></button>
    <nav id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation" hidden><a href="${detail ? base + 'index.html' : ''}#work">Selected work</a><a href="${detail ? base + 'index.html' : ''}#about">About me</a><a href="${detail ? base + 'index.html' : ''}#contact">Get in touch</a><a href="${base}assets/ratnadeep-patil-resume.pdf" download>Download résumé ↓</a></nav>
    <button type="button" class="command-trigger" aria-label="Ctrl K, open quick navigation">Ctrl K</button>
  </header>`;
}

export function SocialLinks(cls = '') {
  return `<div class="social-links ${cls}" aria-label="Social profiles">${sourceLink(profile.github, '<span>GitHub</span>')}${sourceLink(profile.linkedin, '<span>LinkedIn</span>')}</div>`;
}

export function HeroEditorial(base) {
  return `<section class="hero wrap" aria-labelledby="hero-title"><div class="hero-copy"><p class="hero-role">AI / ML &amp; agentic development engineer</p><h1 id="hero-title" aria-label="Ratnadeep Patil"><span class="hero-line"><span data-name-line>Ratnadeep</span></span><span class="hero-line"><span data-name-line>Patil<span class="hero-period">.</span></span></span></h1><p class="hero-description">I build <span class="hero-verb" data-hero-verb>AI agents</span><span class="hero-description-tail">that connect knowledge to useful action.</span></p><a href="#work" class="primary-cta" data-magnetic>See it running <span aria-hidden="true">&rarr;</span></a>${SocialLinks('hero-socials')}</div>${KnotPreview()}<div class="hero-foot"><span>Based in India</span><span>Building and learning in public.</span><a href="${base}assets/ratnadeep-patil-resume.pdf" download>Download r&eacute;sum&eacute;</a></div></section>`;
}

export function WorkIndex() {
  return `<nav class="work-index" aria-label="Project index">${projects.map(p=>`<a href="#project-${p.id}" data-project-link="${p.id}">${escape(p.name)}</a>`).join('')}</nav>`;
}
export function ProjectShowcase(p,base) {
  const category=p.category.toLowerCase();
  return `<article class="project-showcase" id="project-${p.id}" aria-labelledby="title-${p.id}"><div class="project-copy"><p class="section-label">${escape(category)}</p><h3 id="title-${p.id}">${escape(p.name)}</h3><p class="project-short">${p.short}</p><p class="project-summary">${p.summary}</p><p class="project-stack mono">${p.stack.slice(0,4).map(escape).join(' / ')}</p><div class="project-actions"><a class="text-link" href="${base}work/${p.id}/">Read the case study <span aria-hidden="true">&rarr;</span></a>${sourceLink(p.repo,'Source','quiet-link')}</div></div>${ProjectDemo(p)}</article>`;
}

export function AboutEditorial(base) {
  return `<section class="about-section wrap" id="about" aria-labelledby="about-title"><div class="section-top"><p class="eyebrow">About &amp; experience</p><span class="mono">The person behind the systems</span></div><div class="about-grid"><div><h2 id="about-title">I like knowing how<br>the pieces fit together.</h2><a class="resume-link text-link" href="${base}assets/ratnadeep-patil-resume.pdf" download="Ratnadeep_Patil_CV.pdf">Download my résumé <span aria-hidden="true">↓</span></a></div><div class="about-text"><img class="about-portrait" src="${base}assets/ratnadeep-portrait.webp" alt="Ratnadeep Patil" width="800" height="800" loading="lazy" decoding="async"><p class="about-lead">${profile.about}</p><p>Across internships, I’ve worked on Microsoft 365 workflow automation and full-stack inventory management. I’m currently building and learning, with a focus on agentic systems.</p><dl class="toolkit">${profile.toolkit.map(([k,v])=>`<div><dt class="mono">${escape(k)}</dt><dd>${escape(v)}</dd></div>`).join('')}</dl></div></div>${ExperienceTimeline()}</section>`;
}

export function ExperienceTimeline() {
  return `<div class="experience"><h3>Where I’ve been building</h3>${profile.experience.map(e=>`<div class="experience-row"><span class="experience-date mono">${e.dates}</span><div><h4>${e.company}</h4><p>${e.role}</p></div><p class="experience-detail">${e.detail}</p></div>`).join('')}</div>`;
}

export function ContactSection() {
  return `<section class="contact-section" id="contact" aria-labelledby="contact-title"><div class="wrap"><div class="section-top"><p class="eyebrow">Get in touch</p><span class="mono">An idea, an opportunity, a conversation.</span></div><div class="contact-heading"><h2 id="contact-title">Have something<br>in mind?</h2><a href="mailto:${profile.email}" class="contact-arrow" data-magnetic aria-label="Email Ratnadeep Patil">&rarr;</a></div><div class="contact-actions"><div class="email-group"><a href="mailto:${profile.email}" class="email-link">${profile.email}</a><button type="button" class="copy-email" aria-label="Copy email address">Copy email <span aria-hidden="true">⧉</span></button></div>${SocialLinks('contact-socials')}</div><p class="copy-status" role="status" aria-live="polite"></p></div></section>`;
}

export function Footer(base) {
  return `<footer class="site-footer wrap"><a href="${base}index.html" class="footer-brand">Ratnadeep Patil<span aria-hidden="true"> / </span></a><p class="mono">Designed &amp; built with context. © <span data-year>2026</span></p><a class="mono" href="#top">Back to top ↑</a></footer>`;
}

export function ProjectDetail(p,base) {
  const related=projects.find(x=>x.id===p.related);
  return `<section class="case-hero wrap"><a class="breadcrumb mono" href="${base}index.html#work">← ALL SELECTED WORK</a><p class="eyebrow">${p.category.toLowerCase()}</p><h1>${escape(p.name)}</h1><p class="case-summary">${p.summary}</p><div class="case-meta"><div><span class="mono">Contribution</span><p>Project development</p></div><div><span class="mono">Tools &amp; systems</span><p>${p.stack.join(' / ')}</p></div>${sourceLink(p.repo,'View source','button-link')}</div></section>
  <section class="case-content"><div class="wrap"><figure class="case-figure"><img src="${base}assets/diagrams/${p.id}.svg" alt="${escape(p.architecture.join(' to '))}" width="960" height="520"><figcaption>${p.diagramLabel}. Conceptual diagram, not an application screenshot.</figcaption></figure>${p.id==='termwise'?`<figure class="case-figure actual-interface"><img src="${base}assets/termwise-overview.png" alt="Actual TermWise AI overview screen with Analyze a new deal and Try the supplier example actions" width="1440" height="1000" loading="lazy" decoding="async"><figcaption>Actual TermWise AI overview interface, from the project’s repository. This is the starting screen, not a result or a claim of live financial performance.</figcaption></figure>`:''}<div class="case-grid"><aside class="case-index"><p class="mono">In this study</p><nav aria-label="Case study sections"><a href="#problem">The problem</a><a href="#system">The system</a><a href="#contribution">What I built</a><a href="#decisions">Engineering choices</a><a href="#boundaries">Boundaries</a></nav></aside><div class="case-article"><section id="problem"><p class="eyebrow">Context</p><h2>The problem worth solving.</h2><p>${p.problem}</p></section><section id="system"><p class="eyebrow">Architecture</p><h2>How the pieces connect.</h2><p>${p.context}</p><ol class="architecture-steps">${p.architecture.map((step,i)=>`<li><span class="mono">0${i+1}</span>${step}</li>`).join('')}</ol></section><section id="contribution"><p class="eyebrow">Contribution</p><h2>What I built.</h2><ul class="contribution-list">${p.contribution.map(c=>`<li>${c}</li>`).join('')}</ul></section><section id="decisions"><p class="eyebrow">Engineering choices</p><h2>The decisions behind it.</h2>${p.decisions.map(([title,body])=>`<div class="decision-note"><h3>${title}</h3><p>${body}</p></div>`).join('')}</section><section id="boundaries"><p class="eyebrow">Boundaries</p><h2>What this does—and what needs care.</h2><p>${p.boundary}</p><p class="source-note">This case study is grounded in the public repository’s README, checked 1 November 2026. It describes the implementation; it is not an independent audit of the running project.</p>${sourceLink(p.source,'Read the technical source','text-link')}</section></div></div><a class="next-project" href="../${related.id}/"><div><span class="eyebrow">Continue exploring</span><h2>${escape(related.name)}</h2></div><span aria-hidden="true">&rarr;</span></a></div></section>`;
}

export function SEOHead({title,description,base,path,origin,id}) {
  const canonical=origin.replace(/\/$/,'')+path;
  return `<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#09070d"><meta name="description" content="${escape(description)}"><meta name="color-scheme" content="dark light"><title>${escape(title)}</title><link rel="canonical" href="${escape(canonical)}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(canonical)}"><meta property="og:image" content="${escape(origin.replace(/\/$/,'')+'/assets/og/'+id+'.png')}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="${base}assets/fonts/dm-sans-400.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="${base}assets/fonts/dm-sans-600.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="${base}assets/styles.css"><script src="${base}assets/client.js" defer></script>`;
}

export function layout({body,title,description,base='./',path='/',origin,id='home',detail=false}) {
  return `<!doctype html>\n<html lang="en"><head>${SEOHead({title,description,base,path,origin,id})}</head><body class="${detail?'detail-page':'home-page'}">${SiteHeader(base,detail)}<main id="main">${body}${detail?CommandPalette(base,true):''}</main>${Footer(base)}</body></html>\n`;
}

export function HomePage(origin) {
  const base='./';
  const body=`${HeroEditorial(base)}${SignatureSection()}<section class="work-section" id="work" aria-labelledby="work-title"><div class="wrap"><div class="work-heading"><div><p class="section-label">Selected work</p><h2 id="work-title">See the systems<br>in action.</h2></div><p>Try an idea, inspect the behavior,<br>then read how it was built.</p></div>${WorkIndex()}<div class="project-reel"><div class="reel-stage"><div class="project-list">${projects.map(p=>ProjectShowcase(p,base)).join('')}</div><div class="reel-controls" hidden><button type="button" data-reel-prev aria-label="Previous project">&larr; Previous</button><span data-reel-label>Synora</span><button type="button" data-reel-next aria-label="Next project">Next &rarr;</button></div></div></div></div></section>${SkillsSection()}${AboutEditorial(base)}${ContactSection()}${CommandPalette()}`;
  return layout({body,title:'Ratnadeep Patil - AI & Agentic Systems Engineer',description:profile.bio,origin});
}
