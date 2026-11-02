import { profile, projects, studyRecords } from './content.mjs';
import { escape } from './html.mjs';
import { projectDiagram } from './diagrams.mjs';
import { projectArtwork } from './artworks.mjs';
export { escape } from './html.mjs';
const arrow = '<span aria-hidden="true">↗</span>';
export const sourceLink = (href, label, cls = '') => `<a class="${cls}" href="${escape(href)}" target="_blank" rel="noopener noreferrer">${label}${arrow}</a>`;

export function SiteHeader(base = './', detail = false) {
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header wrap" id="top">
    <a class="wordmark" href="${base}index.html" aria-label="Ratnadeep Patil, home"><span>r</span><i aria-hidden="true">/</i><span>p</span><small>RATNADEEP PATIL</small></a>
    <nav class="desktop-nav" aria-label="Main navigation"><a href="${detail ? base + 'index.html' : ''}#work" data-nav="work">Work <sup>04</sup></a><a href="${detail ? base + 'index.html' : ''}#about" data-nav="about">About</a><a href="${detail ? base + 'index.html' : ''}#contact" data-nav="contact">Contact ${arrow}</a></nav>
    <noscript><style>.menu-toggle{display:none!important}@media(max-width:700px){.desktop-nav{display:flex;width:100%;gap:24px;padding-bottom:14px;font-size:12px}}.source-picker,.stage-picker,.motion-toggle{display:none!important}</style></noscript>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav">Menu <span aria-hidden="true">+</span></button>
    <nav id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation" hidden><a href="${detail ? base + 'index.html' : ''}#work">Selected work <span>01</span></a><a href="${detail ? base + 'index.html' : ''}#about">About me <span>02</span></a><a href="${detail ? base + 'index.html' : ''}#contact">Get in touch ${arrow}</a><a href="${base}assets/ratnadeep-patil-resume.pdf" download>Download résumé ↓</a></nav>
  </header>`;
}

export function SocialLinks(cls = '') {
  return `<div class="social-links ${cls}" aria-label="Social profiles">${sourceLink(profile.github, '<span>GitHub</span>')}${sourceLink(profile.linkedin, '<span>LinkedIn</span>')}</div>`;
}

export function SystemExplorer(base = './') {
  return `<section class="system-explorer" data-explorer aria-labelledby="system-title">
    <div class="system-top"><span class="mono">INTERACTIVE SYSTEM STUDY</span><span class="system-id mono">001 / PROVENANCE</span><button class="motion-toggle" type="button" aria-label="Pause diagram animation">Pause diagram</button></div>
    <div class="system-intro"><h2 id="system-title">A decision is only as useful<br>as its context.</h2><span aria-hidden="true" class="study-mark">↳</span></div>

    <div class="system-drawing">
      <svg viewBox="0 0 540 255" role="img" aria-labelledby="flow-title flow-desc"><title id="flow-title">Source, context, decision</title><desc id="flow-desc">Three illustrative sources connect to shared project context and a decision. The buttons below explain each stage.</desc>
        <g class="graph-guides" fill="none" stroke="#30263e" stroke-width="1"><path d="M24 24h492M24 232h492"/><path d="M36 12v232M504 12v232"/></g>
        <g class="source-route" data-route="0"><path d="M140 61H180Q198 61 198 81V123H230"/></g><g class="source-route" data-route="1"><path d="M140 123H230"/></g><g class="source-route" data-route="2"><path d="M140 185H180Q198 185 198 165V123H230"/></g>
        <g class="source-node" data-node="0"><rect x="36" y="40" width="104" height="42" rx="2"/><text x="48" y="65">TRANSCRIPT</text></g><g class="source-node" data-node="1"><rect x="36" y="102" width="104" height="42" rx="2"/><text x="48" y="127">DOCUMENT</text></g><g class="source-node" data-node="2"><rect x="36" y="164" width="104" height="42" rx="2"/><text x="48" y="189">ARCHITECTURE</text></g>
        <g class="context-node" data-stage-node="1"><rect x="230" y="83" width="124" height="80" rx="2"/><path d="M243 98h17m-17 6h11M324 142h17m-11 6h11"/><text x="292" y="118" text-anchor="middle" class="node-title">CONTEXT</text><text x="292" y="137" text-anchor="middle" class="node-note">source retained</text></g>
        <path class="decision-route" d="M354 123H398m-5-5 5 5-5 5"/>
        <g class="decision-node" data-stage-node="2"><rect x="398" y="94" width="106" height="58" rx="2"/><text x="451" y="120" text-anchor="middle" class="node-title">DECISION</text><text x="451" y="137" text-anchor="middle" class="node-note">inspectable</text></g>
        <path class="provenance-return" d="M451 152v57H88v-3"/><text x="299" y="202" class="return-label">TRACE BACK TO SOURCE</text>
      </svg>
    </div>
    <div class="source-picker" role="group" aria-label="Choose an illustrative source">${studyRecords.map((r,i) => `<button type="button" data-source="${i}" aria-pressed="${i===0}"><span class="source-index">0${i+1}</span>${r.label}</button>`).join('')}</div>
    <div class="stage-picker" role="group" aria-label="Trace the evidence flow"><button type="button" data-stage="0" aria-pressed="true"><span>01</span> Evidence</button><button type="button" data-stage="1" aria-pressed="false"><span>02</span> Context</button><button type="button" data-stage="2" aria-pressed="false"><span>03</span> Decision</button></div>
    <div class="explorer-detail" aria-live="polite" aria-atomic="true"><p class="mono" data-kind>${studyRecords[0].kind}</p><p class="explorer-statement" data-statement>“${studyRecords[0].quote}”</p><p class="source-citation" data-citation>${studyRecords[0].source}</p></div>
    <div class="system-bottom"><p>Illustrative records. Select a source, then trace its path.</p><a href="${base}work/synora/" aria-label="Read the Synora case study">Related work ${arrow}</a></div>
    <noscript><p class="noscript-note">The diagram remains readable without JavaScript. Evidence keeps its source as it becomes project context and an inspectable decision. Read the Synora case study for the actual implementation.</p></noscript>
    <script type="application/json" id="study-data">${JSON.stringify(studyRecords).replaceAll('<','\\u003c')}</script>
  </section>`;
}

export function HeroEditorial(base) {
  return `<section class="hero wrap" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow"><span class="tiny-square" aria-hidden="true"></span>AI / ML &amp; AGENTIC DEVELOPMENT ENGINEER</p><h1 id="hero-title"><span class="hero-line"><span>Ratnadeep</span></span><span class="hero-line"><span>Patil<span class="hero-period">.</span></span></span></h1><p class="hero-description">${profile.bio}</p>${SocialLinks('hero-socials')}<a href="#work" class="explore-link"><span class="down-circle" aria-hidden="true">↓</span>Selected work <span class="mono">01—04</span></a></div>${SystemExplorer(base)}<div class="hero-foot mono"><span>BASED IN INDIA</span><span>SOFTWARE, WITH A SOURCE OF TRUTH.</span><a href="#work">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div></section>`;
}

export function WorkIndex(base) {
  return `<nav class="work-index" aria-label="Project index">${projects.map(p=>`<a href="#project-${p.id}" data-project-link="${p.id}"><span class="mono">${p.index}</span><span>${escape(p.name)}</span>${arrow}</a>`).join('')}</nav>`;
}

export function ProjectShowcase(p,base) {
  return `<article class="project-showcase" id="project-${p.id}" aria-labelledby="title-${p.id}"><div class="project-copy"><p class="eyebrow">${p.index} / ${escape(p.category)}</p><h3 id="title-${p.id}"><a href="${base}work/${p.id}/">${escape(p.name)}</a></h3><p class="project-short">${p.short}</p><p class="project-summary">${p.summary}</p><p class="project-stack mono">${p.stack.slice(0,4).map(escape).join(' / ')}</p><div class="project-actions"><a class="text-link" href="${base}work/${p.id}/">Explore the case study ${arrow}</a>${sourceLink(p.repo,'Source','quiet-link')}</div></div><a class="project-art visual-${p.id}" href="${base}work/${p.id}/" aria-label="Read ${escape(p.name)} case study">${projectArtwork(p,base)}<span class="art-caption mono">${p.id==='termwise'?'ACTUAL APPLICATION INTERFACE':'ORIGINAL CONCEPTUAL ARTWORK'}<span class="art-open">View project ↗</span></span></a></article>`;
}

export function ScrollStory() {
  const steps=[['Build.','AI agents that turn an intent into a working flow.'],['Connect.','Scattered knowledge, with its sources still attached.'],['Automate.','The work between tools, from input to action.']];
  return `<section class="scroll-story" data-scroll-story aria-label="My approach"><div class="story-stage"><div class="story-meta"><span class="story-label">FROM INTENT TO ACTION</span><span class="story-count" aria-hidden="true">01 / 03</span></div><span class="story-index" data-story-index aria-hidden="true">01</span><div class="story-steps">${steps.map(([word,description],i)=>`<div class="story-step" data-step="${i}"><h2 class="story-word">${word}</h2><p class="story-description">${description}</p></div>`).join('')}</div><div class="story-progress" aria-hidden="true"></div></div></section>`;
}

export function AboutEditorial(base) {
  return `<section class="about-section wrap" id="about" aria-labelledby="about-title"><div class="section-top"><p class="eyebrow">02 / ABOUT &amp; EXPERIENCE</p><span class="mono">THE PERSON BEHIND THE SYSTEMS</span></div><div class="about-grid"><div><h2 id="about-title">I like knowing<br>how the pieces<br><em>fit together.</em></h2><a class="resume-link text-link" href="${base}assets/ratnadeep-patil-resume.pdf" download="Ratnadeep_Patil_CV.pdf">Download my résumé <span aria-hidden="true">↓</span></a></div><div class="about-text"><p class="about-lead">${profile.about}</p><p>Across internships, I’ve worked on Microsoft 365 workflow automation and full-stack inventory management. I’m currently building and learning, with a focus on agentic systems.</p><dl class="toolkit">${profile.toolkit.map(([k,v])=>`<div><dt class="mono">${escape(k)}</dt><dd>${escape(v)}</dd></div>`).join('')}</dl></div></div>${ExperienceTimeline()}</section>`;
}

export function ExperienceTimeline() {
  return `<div class="experience"><h3>Where I’ve been building</h3>${profile.experience.map(e=>`<div class="experience-row"><span class="experience-date mono">${e.dates}</span><div><h4>${e.company}</h4><p>${e.role}</p></div><p class="experience-detail">${e.detail}</p></div>`).join('')}</div>`;
}

export function ContactSection() {
  return `<section class="contact-section" id="contact" aria-labelledby="contact-title"><div class="wrap"><div class="section-top"><p class="eyebrow">03 / GET IN TOUCH</p><span class="mono">AN IDEA, AN OPPORTUNITY, A CONVERSATION.</span></div><div class="contact-heading"><h2 id="contact-title">Have something<br>in <em>mind?</em></h2><a href="mailto:${profile.email}" class="contact-arrow" aria-label="Email Ratnadeep Patil">↗</a></div><div class="contact-actions"><div class="email-group"><a href="mailto:${profile.email}" class="email-link">${profile.email}</a><button type="button" class="copy-email" aria-label="Copy email address">Copy email <span aria-hidden="true">⧉</span></button></div>${SocialLinks('contact-socials')}</div><p class="copy-status" role="status" aria-live="polite"></p></div></section>`;
}

export function Footer(base) {
  return `<footer class="site-footer wrap"><a href="${base}index.html" class="footer-brand">Ratnadeep Patil<span aria-hidden="true"> / </span></a><p class="mono">DESIGNED &amp; BUILT WITH CONTEXT. © <span data-year>2026</span></p><a class="mono" href="#top">BACK TO TOP ↑</a></footer>`;
}

export function ProjectDetail(p,base) {
  const related=projects.find(x=>x.id===p.related);
  return `<section class="case-hero wrap"><a class="breadcrumb mono" href="${base}index.html#work">← ALL SELECTED WORK</a><p class="eyebrow">${p.index} / ${p.category}</p><h1>${escape(p.name)}</h1><p class="case-summary">${p.summary}</p><div class="case-meta"><div><span class="mono">CONTRIBUTION</span><p>Project development</p></div><div><span class="mono">TOOLS &amp; SYSTEMS</span><p>${p.stack.join(' / ')}</p></div>${sourceLink(p.repo,'View source','button-link')}</div></section>
  <section class="case-content"><div class="wrap"><figure class="case-figure"><img src="${base}assets/diagrams/${p.id}.svg" alt="${escape(p.architecture.join(' to '))}" width="960" height="520"><figcaption>${p.diagramLabel}. Conceptual diagram, not an application screenshot.</figcaption></figure>${p.id==='termwise'?`<figure class="case-figure actual-interface"><img src="${base}assets/termwise-overview.png" alt="Actual TermWise AI overview screen with Analyze a new deal and Try the supplier example actions" width="1440" height="1000" loading="lazy" decoding="async"><figcaption>Actual TermWise AI overview interface, from the project’s repository. This is the starting screen, not a result or a claim of live financial performance.</figcaption></figure>`:''}<div class="case-grid"><aside class="case-index"><p class="mono">IN THIS STUDY</p><nav aria-label="Case study sections"><a href="#problem">The problem</a><a href="#system">The system</a><a href="#contribution">What I built</a><a href="#decisions">Engineering choices</a><a href="#boundaries">Boundaries</a></nav></aside><div class="case-article"><section id="problem"><p class="eyebrow">01 / CONTEXT</p><h2>The problem worth solving.</h2><p>${p.problem}</p></section><section id="system"><p class="eyebrow">02 / ARCHITECTURE</p><h2>How the pieces connect.</h2><p>${p.context}</p><ol class="architecture-steps">${p.architecture.map((step,i)=>`<li><span class="mono">0${i+1}</span>${step}</li>`).join('')}</ol></section><section id="contribution"><p class="eyebrow">03 / CONTRIBUTION</p><h2>What I built.</h2><ul class="contribution-list">${p.contribution.map(c=>`<li>${c}</li>`).join('')}</ul></section><section id="decisions"><p class="eyebrow">04 / ENGINEERING CHOICES</p><h2>The decisions behind it.</h2>${p.decisions.map(([title,body])=>`<div class="decision-note"><h3>${title}</h3><p>${body}</p></div>`).join('')}</section><section id="boundaries"><p class="eyebrow">05 / BOUNDARIES</p><h2>What this does—and what needs care.</h2><p>${p.boundary}</p><p class="source-note">This case study is grounded in the public repository’s README, checked 1 November 2026. It describes the implementation; it is not an independent audit of the running project.</p>${sourceLink(p.source,'Read the technical source','text-link')}</section></div></div><a class="next-project" href="../${related.id}/"><div><span class="eyebrow">CONTINUE EXPLORING</span><h2>${escape(related.name)}</h2></div><span aria-hidden="true">↗</span></a></div></section>`;
}

export function SEOHead({title,description,base,path,origin,id}) {
  const canonical=origin.replace(/\/$/,'')+path;
  return `<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#09070d"><meta name="description" content="${escape(description)}"><meta name="color-scheme" content="dark light"><title>${escape(title)}</title><link rel="canonical" href="${escape(canonical)}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(canonical)}"><meta property="og:image" content="${escape(origin.replace(/\/$/,'')+'/assets/og/'+id+'.png')}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="${base}assets/fonts/dm-sans-400.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="${base}assets/fonts/dm-sans-600.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="${base}assets/styles.css"><script src="${base}assets/client.js" defer></script>`;
}

export function layout({body,title,description,base='./',path='/',origin,id='home',detail=false}) {
  return `<!doctype html>\n<html lang="en"><head>${SEOHead({title,description,base,path,origin,id})}</head><body class="${detail?'detail-page':'home-page'}">${SiteHeader(base,detail)}<main id="main">${body}</main>${Footer(base)}</body></html>\n`;
}

export function HomePage(origin) {
  const base='./';
  const body=`${HeroEditorial(base)}${ScrollStory()}<section class="work-section" id="work" aria-labelledby="work-title"><div class="wrap"><div class="section-top"><p class="eyebrow">01 / SELECTED WORK</p><span class="mono">FOUR PROJECTS. FOUR DIFFERENT QUESTIONS.</span></div><div class="work-heading"><h2 id="work-title">The work,<br><em>in context.</em></h2><p>From a conversation to shared memory.<br>From a document to a decision.</p></div>${WorkIndex(base)}<div class="project-list">${projects.map(p=>ProjectShowcase(p,base)).join('')}</div></div></section>${AboutEditorial(base)}${ContactSection()}`;
  return layout({body,title:'Ratnadeep Patil — AI & Agentic Systems Engineer',description:profile.bio,origin});
}
