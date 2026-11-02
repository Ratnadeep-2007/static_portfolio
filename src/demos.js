import {motion} from './motion.config.js';
export function initDemos() {
  const cleanups=[];
  document.querySelectorAll('[data-demo-fieldset]').forEach(el=>{el.disabled=false;});
  const on=(el,event,fn)=>{if(!el)return;el.addEventListener(event,fn);cleanups.push(()=>el.removeEventListener(event,fn));};
  const memory=document.querySelector('[data-demo="synora"]');
  if(memory){
    const picked=new Set();const names={meeting:'Meeting note',message:'Team message',document:'Project document'};
    function render(){
      memory.querySelectorAll('[data-memory]').forEach(b=>b.setAttribute('aria-pressed',String(picked.has(b.dataset.memory))));
      memory.querySelectorAll('[data-memory-path]').forEach(p=>p.classList.toggle('is-connected',picked.has(p.dataset.memoryPath)));
      memory.querySelector('[data-memory-state]').textContent=picked.size?`${picked.size} source${picked.size>1?'s':''} connected`:'Sources waiting';
      memory.querySelector('[data-memory-output]').textContent=picked.size?'Provenance retained: '+[...picked].map(n=>names[n]).join(' → '):'Select a source to connect it. Its origin stays attached.';
    }
    on(memory,'click',e=>{const b=e.target.closest('[data-memory]');if(b){picked.has(b.dataset.memory)?picked.delete(b.dataset.memory):picked.add(b.dataset.memory);render();}if(e.target.closest('[data-memory-reset]')){picked.clear();render();}});
    on(memory,'pointerover',e=>{const b=e.target.closest('[data-memory]');if(b)memory.querySelector(`[data-memory-path="${b.dataset.memory}"]`)?.classList.add('is-connected');});
    on(memory,'pointerout',e=>{const b=e.target.closest('[data-memory]');if(b&&!picked.has(b.dataset.memory))memory.querySelector(`[data-memory-path="${b.dataset.memory}"]`)?.classList.remove('is-connected');});render();
  }
  const gap=document.querySelector('[data-demo="contextguard"]');
  if(gap){
    const compare=gap.querySelector('[data-compare]'),clarify=gap.querySelector('[data-clarify]'),brief=gap.querySelector('[data-brief]');
    function state(n){gap.dataset.review=n;gap.querySelector('[data-gap-state]').textContent=n==='resolved'?'Clarification recorded':n==='compared'?'Conflicting dates':'Open question';clarify.hidden=n!=='compared';compare.hidden=n!=='open';brief.hidden=n!=='resolved';gap.querySelector('[data-gap-output]').textContent=n==='resolved'?'Resolved by a user statement, with both sources retained.':n==='compared'?'12 November and 19 November conflict. Record the fictional clarification to proceed.':'Two sources disagree. The date stays open until a person clarifies it.';}
    on(compare,'click',()=>{state('compared');clarify.focus({preventScroll:true});});on(clarify,'click',()=>{state('resolved');gap.querySelector('[data-gap-reset]').focus({preventScroll:true});});on(gap.querySelector('[data-gap-reset]'),'click',()=>state('open'));state('open');
  }
  const cash=document.querySelector('[data-demo="termwise"]');
  if(cash){
    const range=cash.querySelector('[data-advance]'),usd=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
    const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fields=['advance','low','reserve'].map(k=>cash.querySelector('[data-cash-'+k+']'));
    let numberFrame=0,current=null,target=null;
    function write(values){current=values;fields.forEach((el,i)=>el.textContent=usd(Math.round(values[i])));}
    function numbers(values){cancelAnimationFrame(numberFrame);target=values;if(!current||reduce.matches){write(values);return;}const start=current.slice(),began=performance.now();function tick(now){const p=Math.min(1,(now-began)/motion.ui),e=1-Math.pow(1-p,3);write(values.map((v,i)=>start[i]+(v-start[i])*e));if(p<1)numberFrame=requestAnimationFrame(tick);}numberFrame=requestAnimationFrame(tick);}
    function render(){const percentage=Number(range.value),advance=percentage*100,balances=[advance,advance-4000,advance-7000,3000],low=Math.min(...balances),x=[40,190,340,490],y=n=>168-(n+6000)/13000*138;const line=balances.map((n,i)=>`${i?'L':'M'}${x[i]} ${y(n).toFixed(2)}`).join(' ');cash.querySelector('[data-cash-line]').setAttribute('d',line);cash.querySelector('[data-cash-area]').setAttribute('d',line+'L490 180H40Z');cash.querySelector('[data-cash-zero]').setAttribute('d',`M40 ${y(0)}H500`);cash.querySelector('[data-advance-label]').textContent=percentage+'%';numbers([advance,low,Math.max(0,-low)]);range.setAttribute('aria-valuetext',percentage+' percent advance, reserve needed '+usd(Math.max(0,-low)));}
    on(reduce,'change',()=>{if(reduce.matches){cancelAnimationFrame(numberFrame);if(target)write(target);}});cleanups.push(()=>cancelAnimationFrame(numberFrame));
    on(range,'input',render);render();
  }
  const hash=document.querySelector('[data-demo="face-web-blockchain"]');
  if(hash){
    let disposed=false,version=0;const original=new Uint8Array(12*12*4);
    for(let y=0;y<12;y++)for(let x=0;x<12;x++){const face=(x>=3&&x<9&&y>=2&&y<4)||(x>=2&&x<10&&y>=4&&y<8)||(x>=3&&x<9&&y>=8&&y<10)||(x===9&&y===9);const cut=(y===5&&(x===3||x===7))||(y===7&&x>=4&&x<7);original.set(face&&!cut?[169,155,187,255]:[24,21,29,255],(y*12+x)*4);}
    const digest=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
    const sample=hash.querySelector('.hash-sample svg');sample.innerHTML=Array.from({length:144},(_,i)=>{const offset=i*4;return `<rect x="${i%12*10}" y="${Math.floor(i/12)*10}" width="10" height="10" fill="rgb(${original[offset]},${original[offset+1]},${original[offset+2]})" ${i===117?'data-pixel=""':''}/>`;}).join('');
    let fingerprint='';const originalLabel=hash.querySelector('[data-hash-original]'),currentLabel=hash.querySelector('[data-hash-current]'),status=hash.querySelector('[data-hash-state]'),output=hash.querySelector('[data-hash-output]'),tamper=hash.querySelector('[data-tamper]'),reset=hash.querySelector('[data-hash-reset]');
    async function update(altered){const request=++version;tamper.disabled=true;reset.disabled=true;const bytes=original.slice();if(altered)bytes.set([231,166,118],(9*12+9)*4);const result=await digest(bytes);if(disposed||request!==version)return;currentLabel.textContent=result;hash.dataset.integrity=altered?'fail':'pass';status.textContent=altered?'Integrity check failed':'Integrity check passed';output.textContent=altered?'One pixel changed. Its SHA-256 no longer matches the original.':'The current bytes match the original fingerprint.';hash.querySelector('[data-pixel]').setAttribute('fill',altered?'#e7a676':'#a99bbb');tamper.disabled=altered;reset.disabled=!altered;}
    if(globalThis.crypto?.subtle){digest(original).then(value=>{if(disposed)return;fingerprint=value;originalLabel.textContent=fingerprint;return update(false);}).catch(()=>{status.textContent='Fingerprint unavailable';output.textContent='This browser could not calculate SHA-256. The case study remains available.';});on(tamper,'click',()=>update(true).catch(()=>{status.textContent='Fingerprint unavailable';}));on(reset,'click',()=>update(false).catch(()=>{status.textContent='Fingerprint unavailable';}));}
    else status.textContent='Secure connection required';cleanups.push(()=>{disposed=true;version++;});
  }
  return ()=>cleanups.forEach(fn=>fn());
}
