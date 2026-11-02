/* Design.md progressive enhancement: accessible theme, scroll, project demonstrations. */
(() => {
'use strict';
const root=document.documentElement;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const toggle=document.querySelector('[data-theme-toggle]');
function setTheme(theme){
  root.dataset.theme=theme;
  if(toggle){toggle.setAttribute('aria-pressed',String(theme==='dark'));toggle.textContent=theme==='dark'?'Light mode':'Dark mode';toggle.setAttribute('aria-label',theme==='dark'?'Switch to light theme':'Switch to dark theme');}
}
let theme='light';try{theme=localStorage.getItem('portfolio-theme')==='dark'?'dark':'light'}catch{}
setTheme(theme);
toggle?.addEventListener('click',()=>{theme=root.dataset.theme==='dark'?'light':'dark';setTheme(theme);try{localStorage.setItem('portfolio-theme',theme)}catch{}});
const verbs=['agents.','memory layers.','verifiers.','automations.'];
const rotating=document.querySelector('[data-rotate]');
if(rotating&&!reduced.matches){let i=0;setInterval(()=>{if(document.hidden||reduced.matches)return;i=(i+1)%verbs.length;rotating.textContent=verbs[i]},3800)}
const progress=document.querySelector('[data-progress]');
let scrollQueued=false;
function scrollUpdate(){scrollQueued=false;if(!progress)return;const total=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(total>0?Math.max(0,Math.min(1,scrollY/total)):0)+')'}
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(scrollUpdate)}},{passive:true});
addEventListener('resize',scrollUpdate);scrollUpdate();
const reveal=[...document.querySelectorAll('.work-heading,.project-showcase,.about-grid,.experience-row,.case-article>section')];
if(!reduced.matches&&'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('reveal-done');observer.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -35px 0px'});
 reveal.forEach(el=>{el.classList.add('reveal-wait');observer.observe(el)});
 reduced.addEventListener('change',()=>{reveal.forEach(x=>x.classList.add('reveal-done'));observer.disconnect()},{once:true});
}
const synora=document.querySelector('[data-demo="synora"]');
synora?.addEventListener('click',e=>{
 const button=e.target.closest('[data-provenance]');if(!button)return;
 synora.querySelectorAll('[data-provenance]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 synora.querySelector('[data-provenance-output]').textContent=button.dataset.provenance;
});
const guard=document.querySelector('[data-demo="contextguard"]');
guard?.querySelector('[data-resolve]')?.addEventListener('click',()=>{
 const status=guard.querySelector('[data-conflict-status]'), text=guard.querySelector('[data-conflict-copy]');
 const resolved=status.classList.contains('open');
 status.className='demo-status '+(resolved?'resolved':'open');status.textContent=resolved?'Resolved':'Open gap';
 text.textContent=resolved?'Illustrative clarification: team confirmed 19 June.':'Conflicting dates need a human decision.';
 guard.querySelector('[data-resolve]').textContent=resolved?'Reopen example':'Record clarification';
});
const term=document.querySelector('[data-demo="termwise"]');
function updateTerm(){
 if(!term)return;const value=Number(term.querySelector('[data-advance]')?.value||25);
 term.querySelector('[data-advance-value]').textContent=value+'%';
 const heights=[95-value*.75,78-value*.62,95-value*.36,58-value*.52,70-value*.3,42-value*.55];
 term.querySelector('[data-cash-line]').setAttribute('d',heights.map((y,i)=>(i?'L':'M')+(8+i*80.8).toFixed(1)+' '+Math.max(5,y).toFixed(1)).join(' '));
}
term?.querySelector('[data-advance]')?.addEventListener('input',updateTerm);updateTerm();
const hash=document.querySelector('[data-demo="integrity"]');
if(hash){
 const text=hash.querySelector('[data-hash-output]'),status=hash.querySelector('[data-hash-state]'),button=hash.querySelector('[data-tamper]');
 const original='Project record: consent verified; result version 1';
 async function digest(payload){if(!crypto.subtle)return 'SHA-256 needs a secure browser context';const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(payload));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}
 let changed=false; async function update(){const content=original+(changed?'!':'');const value=await digest(content);text.textContent=value;status.textContent=changed?'FAIL · altered':'Original';status.className='demo-status '+(changed?'open':'resolved');button.textContent=changed?'Restore example':'Change one character';hash.querySelector('[data-hash-explain]').textContent=changed?'One character changed the fingerprint. This tests integrity, not identity.':'Local demonstration only. Nothing is written on-chain.'}
 button?.addEventListener('click',()=>{changed=!changed;update()});update();
}
// Small mouse-only card tilt, <= 4 degrees, never required for navigation.
if(!reduced.matches&&matchMedia('(pointer:fine)').matches){
 document.querySelectorAll('.project-art').forEach(card=>{
  card.addEventListener('pointermove',e=>{const b=card.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;card.style.transform='perspective(1100px) rotateY('+ (x*6).toFixed(2)+'deg) rotateX('+(-y*6).toFixed(2)+'deg)'});
  card.addEventListener('pointerleave',()=>card.style.transform='');card.addEventListener('blur',()=>card.style.transform='',true);
 });
}
})();
