import {WebGLRenderer,Scene,OrthographicCamera,BufferGeometry,Float32BufferAttribute,ShaderMaterial,Points,LineSegments,LineBasicMaterial,SRGBColorSpace} from 'three';

// Two position buffers; the vertex shader performs the complete morph.
export function createKnotScene(host){
 const canvas=document.createElement('canvas'),context=canvas.getContext('webgl2',{alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'low-power'});
 if(!context)return null;
 let renderer;try{renderer=new WebGLRenderer({canvas,context,alpha:true,antialias:true,preserveDrawingBuffer:true});}catch{return null;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=SRGBColorSpace;renderer.setClearColor(0x08080b,0);canvas.setAttribute('aria-hidden','true');host.append(canvas);
 const scene=new Scene(),camera=new OrthographicCamera(-6,6,3,-3,.1,40);camera.position.z=12;
 const centers=[[-3.5,1.4,0],[3.5,1.4,0],[-3.5,-1.4,0],[3.5,-1.4,0]],edges=[[0,1],[1,3],[3,2],[2,0],[0,3],[1,2]],count=1000,from=new Float32Array(count*3),to=new Float32Array(count*3);
 for(let i=0;i<count;i++){
  const t=i/count*Math.PI*2;from.set([(Math.sin(t)+2*Math.sin(2*t))*1.05,(Math.cos(t)-2*Math.cos(2*t))*.8,-Math.sin(3*t)*.8],i*3);
  if(i<760){const edge=edges[Math.floor(i/760*edges.length)],f=(i/760*edges.length)%1,a=centers[edge[0]],b=centers[edge[1]];to.set(a.map((n,j)=>n+(b[j]-n)*f),i*3);}
  else{const n=(i-760)%4,t=(i-760)/4/60*Math.PI*2;to.set([centers[n][0]+Math.cos(t)*.22,centers[n][1]+Math.sin(t)*.22,0],i*3);}
 }
 const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(from,3));geometry.setAttribute('graphPosition',new Float32BufferAttribute(to,3));
 const uniforms={uProgress:{value:0},uTime:{value:0},uDpr:{value:Math.min(devicePixelRatio||1,1.5)}};
 const material=new ShaderMaterial({uniforms,transparent:true,depthWrite:false,vertexShader:`attribute vec3 graphPosition;uniform float uProgress;uniform float uTime;uniform float uDpr;void main(){vec3 p=mix(position,graphPosition,uProgress);float a=(1.-uProgress)*.08;p.x+=sin(uTime*.18)*a;p.y+=sin(uTime*.35+p.x)*.015;float turn=(1.-uProgress)*.24;mat2 r=mat2(cos(turn),-sin(turn),sin(turn),cos(turn));p.xz=r*p.xz;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);gl_PointSize=2.1*uDpr;}`,fragmentShader:`void main(){vec2 p=gl_PointCoord-.5;if(length(p)>.5)discard;gl_FragColor=vec4(.71,.60,.79,.85);}`});
 const points=new Points(geometry,material);points.frustumCulled=false;scene.add(points);
 const edgeArray=new Float32Array(edges.flatMap(([a,b])=>[...centers[a],...centers[b]]));const edgeGeometry=new BufferGeometry();edgeGeometry.setAttribute('position',new Float32BufferAttribute(edgeArray,3));const lineMaterial=new LineBasicMaterial({color:0x816294,transparent:true,opacity:0});scene.add(new LineSegments(edgeGeometry,lineMaterial));
 let frame=0,last=0,elapsed=0,paused=false,visible=true,disposed=false,lost=false;
 function render(now){if(disposed||lost||paused||!visible||document.hidden){frame=0;last=0;return;}frame=requestAnimationFrame(render);if(last&&now-last<32)return;elapsed+=last?Math.min(50,now-last):32;last=now;uniforms.uTime.value=elapsed/1000;renderer.render(scene,camera);}
 function start(){if(!frame&&!disposed&&!lost&&!paused&&visible&&!document.hidden)frame=requestAnimationFrame(render);}
 function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
 function resize(){const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height,false);const h=12*r.height/Math.max(1,r.width);camera.left=-6;camera.right=6;camera.top=h/2;camera.bottom=-h/2;camera.updateProjectionMatrix();if(paused)renderer.render(scene,camera);else start();}
 const size=new ResizeObserver(resize);size.observe(host);const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible)start();else stop();},{threshold:.05});io.observe(host);
 const visibility=()=>{if(document.hidden)stop();else start();};document.addEventListener('visibilitychange',visibility);
 function contextLost(e){e.preventDefault();lost=true;stop();host.classList.remove('has-knot-scene');canvas.hidden=true;}
 canvas.addEventListener('webglcontextlost',contextLost);host.classList.add('has-knot-scene');resize();
 return {setProgress(value){uniforms.uProgress.value=value;lineMaterial.opacity=Math.max(0,(value-.6)/.4)*.55;if(paused&&!lost)renderer.render(scene,camera);},setPaused(value){paused=value;if(value){stop();if(!lost)renderer.render(scene,camera);}else start();},dispose(){disposed=true;stop();size.disconnect();io.disconnect();document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',contextLost);geometry.dispose();material.dispose();edgeGeometry.dispose();lineMaterial.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();host.classList.remove('has-knot-scene');}};
}
