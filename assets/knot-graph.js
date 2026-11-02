/* Original trefoil-knot to 4-cluster graph morph: WebGL2 shader; static HTML/SVG fallback. */
(() => {
'use strict';
const canvas=document.querySelector('[data-knot-scene]');
if(!canvas)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const section=canvas.closest('.untangle');
if(reduced.matches)return;
let gl;
try{gl=canvas.getContext('webgl2',{alpha:true,antialias:false,powerPreference:'low-power'});}catch{}
if(!gl)return; // Visible labeled SVG/HTML always remains available.
const vs='#version 300 es\nprecision highp float;in vec3 aKnot;in vec3 aGraph;uniform float uProgress;uniform float uTime;uniform float uAspect;out float vAlpha;void main(){float p=smoothstep(0.0,1.0,uProgress);vec3 pos=mix(aKnot,aGraph,p);float ang=uTime*.00013*(1.0-p);mat2 spin=mat2(cos(ang),-sin(ang),sin(ang),cos(ang));pos.xz=spin*pos.xz;float s=3.0/(3.6-pos.z);gl_Position=vec4(pos.x*s/uAspect,pos.y*s,0.0,1.0);gl_PointSize=mix(2.6,3.9,p);vAlpha=1.0;}';
const fs='#version 300 es\nprecision highp float;in float vAlpha;out vec4 fragColor;void main(){vec2 p=gl_PointCoord-0.5;if(dot(p,p)>0.25)discard;fragColor=vec4(0.88,0.87,0.76,vAlpha);}';
function shader(type,src){const obj=gl.createShader(type);gl.shaderSource(obj,src);gl.compileShader(obj);if(!gl.getShaderParameter(obj,gl.COMPILE_STATUS))throw Error('Shader compilation failed');return obj;}
let program;
try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Scene link failed');}catch{return}
gl.useProgram(program);
const n=900,knot=new Float32Array(n*3),graph=new Float32Array(n*3);
const centers=[[-.73,.48,0],[.73,.48,0],[-.73,-.48,0],[.73,-.48,0]];
for(let i=0;i<n;i++){
 const t=i/n*Math.PI*2, j=i*3;
 knot[j]=(Math.sin(t)+2*Math.sin(2*t))*.28;
 knot[j+1]=(Math.cos(t)-2*Math.cos(2*t))*.28;
 knot[j+2]=-Math.sin(3*t)*.65;
 const group=i%4,a=i*2.399963,spread=.07+.24*Math.sqrt(((i*73)%n)/n);
 graph[j]=centers[group][0]+Math.cos(a)*spread;graph[j+1]=centers[group][1]+Math.sin(a)*spread;graph[j+2]=Math.sin(i*.27)*.15;
}
function buffer(name,data){const vbo=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vbo);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0)}
buffer('aKnot',knot);buffer('aGraph',graph);
const uniforms={progress:gl.getUniformLocation(program,'uProgress'),time:gl.getUniformLocation(program,'uTime'),aspect:gl.getUniformLocation(program,'uAspect')};
let raf=0,last=0,visible=false,progress=0;
const rObserver='ResizeObserver'in window?new ResizeObserver(resize):null;
function resize(){const b=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5),w=Math.max(1,Math.floor(b.width*dpr)),h=Math.max(1,Math.floor(b.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}}
function position(){const b=section.getBoundingClientRect(),distance=Math.max(1,b.height-innerHeight);progress=Math.max(0,Math.min(1,-b.top/distance));const cap=document.querySelector('[data-scene-caption]');if(cap)cap.textContent=progress<.5?'SCATTERED SIGNALS → CONNECTED SYSTEMS':'FOUR PROJECTS, ONE ENGINEERING PRACTICE';}
function render(t){gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(uniforms.progress,progress);gl.uniform1f(uniforms.time,t);gl.uniform1f(uniforms.aspect,canvas.width/canvas.height);gl.drawArrays(gl.POINTS,0,n)}
function tick(t){raf=0;if(!visible||document.hidden||reduced.matches)return;if(t-last>33){last=t;position();render(t)}raf=requestAnimationFrame(tick)}
function update(){if(raf)cancelAnimationFrame(raf);raf=0;position();resize();render(0);if(visible&&!reduced.matches&&!document.hidden)raf=requestAnimationFrame(tick)}
const io='IntersectionObserver'in window?new IntersectionObserver(entries=>{visible=entries.some(x=>x.isIntersecting);update()},{threshold:0}):null;
if(io)io.observe(section);else visible=true;
if(rObserver)rObserver.observe(canvas);else addEventListener('resize',resize);
addEventListener('scroll',()=>{position();if(!raf)render(0)},{passive:true});
document.addEventListener('visibilitychange',update);reduced.addEventListener('change',update);
window.addEventListener('pagehide',()=>{if(raf)cancelAnimationFrame(raf);io?.disconnect();rObserver?.disconnect()},{once:true});
resize();update();
})();
