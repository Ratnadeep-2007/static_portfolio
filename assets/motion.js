/* Signal Atlas: original 3D-perspective Canvas 2D study, no libraries or WebGL.
   The SVG beneath/above the canvas remains the accessible semantic diagram. */
(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const root=document.querySelector('[data-explorer]');
  const canvas=document.querySelector('[data-signal-canvas]');
  if(root&&canvas){
    const ctx=canvas.getContext('2d',{alpha:true});
    if(ctx){
      let w=0,h=0,raf=0,last=0,visible=true,paused=false,tiltX=0,tiltY=0;
      const cubes=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
      const edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7],[0,6],[1,7],[2,4],[3,5]];
      const btn=document.createElement('button');
      btn.type='button';btn.className='motion-toggle';btn.textContent='Pause motion';btn.setAttribute('aria-pressed','true');
      const top=root.querySelector('.system-top');if(!reduced.matches)top.append(btn);
      function projection(v,now){
        const [x,y,z]=v;
        const ax=x*Math.cos(now*.00018+tiltX*.25)-z*Math.sin(now*.00018+tiltX*.25);
        const az=x*Math.sin(now*.00018+tiltX*.25)+z*Math.cos(now*.00018+tiltX*.25);
        const ay=y*Math.cos(.35+tiltY*.2)-az*Math.sin(.35+tiltY*.2);
        const bz=y*Math.sin(.35+tiltY*.2)+az*Math.cos(.35+tiltY*.2);
        const s=Math.min(w*.22,h*.36)*3.8/(4.5-bz);
        return [w*.54+ax*s,h*.52+ay*s];
      }
      function draw(now){
        if(!w||!h)return;
        ctx.clearRect(0,0,w,h);
        const t=reduced.matches?0:now;
        const points=cubes.map(v=>projection(v,t));
        const source=Number(root.querySelector('[data-source][aria-pressed="true"]')?.dataset.source||0);
        const stage=Number(root.querySelector('[data-stage][aria-pressed="true"]')?.dataset.stage||0);
        const active=(source*3+stage*2)%edges.length;
        for(let i=0;i<edges.length;i++){
          const [a,b]=edges[i];
          ctx.strokeStyle=i===active||i===(active+1)%edges.length?'rgba(201,242,122,.82)':'rgba(145,190,151,.34)';
          ctx.lineWidth=i===active?1.7:1;
          ctx.beginPath();ctx.moveTo(...points[a]);ctx.lineTo(...points[b]);ctx.stroke();
        }
        for(let i=0;i<points.length;i++){
          const [x,y]=points[i];ctx.fillStyle=i===(source+stage*2)%8?'#C9F27A':'rgba(202,222,199,.72)';
          ctx.fillRect(x-2,y-2,i===(source+stage*2)%8?5:3,i===(source+stage*2)%8?5:3);
        }
        const [from,to]=edges[active],a=points[from],b=points[to],p=reduced.matches?.5:(Math.sin(now*.002)+1)/2;
        ctx.fillStyle='#C9F27A';ctx.fillRect(a[0]+(b[0]-a[0])*p-3,a[1]+(b[1]-a[1])*p-3,6,6);
      }
      function loop(now){raf=0;if(paused||reduced.matches||!visible||document.hidden)return;if(now-last>=33){last=now;draw(now)}raf=requestAnimationFrame(loop)}
      function sync(){if(raf)cancelAnimationFrame(raf);raf=0;if(paused||reduced.matches||!visible||document.hidden){draw(0);return}raf=requestAnimationFrame(loop)}
      function resize(){const b=canvas.getBoundingClientRect();w=Math.max(1,b.width);h=Math.max(1,b.height);const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw(performance.now())}
      function move(e){if(reduced.matches||paused||e.pointerType==='touch')return;const b=root.getBoundingClientRect();tiltX=(e.clientX-b.left)/b.width*2-1;tiltY=(e.clientY-b.top)/b.height*2-1}
      const ro='ResizeObserver' in window?new ResizeObserver(resize):null;if(ro)ro.observe(canvas);else window.addEventListener('resize',resize);
      const io='IntersectionObserver' in window?new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);sync()}):null;if(io)io.observe(root);
      btn.addEventListener('click',()=>{paused=!paused;btn.textContent=paused?'Play motion':'Pause motion';btn.setAttribute('aria-pressed',String(!paused));root.dataset.motionState=paused?'paused':'running';sync()});
      function media(){if(reduced.matches){btn.remove();root.dataset.motionState='reduced'}else{if(!btn.isConnected)top.append(btn);root.dataset.motionState=paused?'paused':'running'}sync()}
      root.addEventListener('pointermove',move,{passive:true});root.addEventListener('click',()=>draw(performance.now()));
      reduced.addEventListener('change',media);document.addEventListener('visibilitychange',sync);
      resize();media();
      window.addEventListener('pagehide',()=>{if(raf)cancelAnimationFrame(raf);ro?.disconnect();io?.disconnect()},{once:true});
    }
  }
  if(!reduced.matches&&'IntersectionObserver' in window){
    const nodes=[...document.querySelectorAll('.work-heading,.project-showcase,.about-grid,.experience-row,.case-figure,.case-article>section,.contact-heading')];
    const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('reveal-visible');observer.unobserve(e.target)}},{threshold:.08,rootMargin:'0px 0px -20px 0px'});
    nodes.forEach(el=>{el.classList.add('reveal-pending');observer.observe(el)});
    reduced.addEventListener('change',()=>nodes.forEach(el=>el.classList.add('reveal-visible')),{once:true});
  }
})();