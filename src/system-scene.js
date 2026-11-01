import {
  WebGLRenderer, Scene, Group, OrthographicCamera, Mesh, MeshBasicMaterial,
  BoxGeometry, EdgesGeometry, LineSegments, LineBasicMaterial, BufferGeometry,
  Vector3, Line, CanvasTexture, PlaneGeometry, SRGBColorSpace
} from 'three';

// Original spatial model of the same evidence graph; HTML owns every control.
export function createSystemScene(root) {
  const host = root.querySelector('.system-drawing');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!context) return null;
  let renderer;
  try { renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true }); }
  catch { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x1d1b18, 0);
  canvas.setAttribute('aria-hidden', 'true');
  host.append(canvas);
  const scene = new Scene();
  const group = new Group(); scene.add(group);
  const camera = new OrthographicCamera(-6.2, 6.2, 2.7, -2.7, .1, 50);
  camera.position.set(0, 0, 16);
  const resources = [];
  const own = resource => { resources.push(resource); return resource; };
  const copper = 0xdba77a;
  const labels = ['TRANSCRIPT', 'DOCUMENT', 'ARCHITECTURE', 'CONTEXT', 'DECISION'];
  const positions = [[-4.1, 1.45, -.4], [-4.1, 0, -.4], [-4.1, -1.45, -.4], [.1, 0, .35], [3.9, 0, 1]];
  const nodes = labels.map((label, i) => {
    const w = i === 3 ? 2.5 : 2.25, h = i === 3 ? 1.35 : .92, d = i === 3 ? .62 : .32;
    const geometry = own(new BoxGeometry(w, h, d));
    const material = own(new MeshBasicMaterial({ color: 0x28221c }));
    const mesh = new Mesh(geometry, material); mesh.position.set(...positions[i]); group.add(mesh);
    const outlineMaterial = own(new LineBasicMaterial({ color: 0x74604a, transparent: true, opacity: .95 }));
    const outline = new LineSegments(own(new EdgesGeometry(geometry)), outlineMaterial); mesh.add(outline);
    const depthGeometry = own(new BoxGeometry(w + .15, h + .15, .025));
    const backMaterial = own(new LineBasicMaterial({ color: 0x584738, transparent: true, opacity: .55 }));
    const backing = new LineSegments(own(new EdgesGeometry(depthGeometry)), backMaterial);
    backing.position.set(-.12, -.12, -d / 2 - .13); mesh.add(backing);
    const textureCanvas = document.createElement('canvas'); textureCanvas.width = 512; textureCanvas.height = 128;
    const pen = textureCanvas.getContext('2d');
    pen.fillStyle = '#f5f1ea'; pen.font = '600 45px "DM Sans", Arial'; pen.textAlign = 'center'; pen.textBaseline = 'middle';
    pen.fillText(label, 256, 66);
    const texture = own(new CanvasTexture(textureCanvas)); texture.colorSpace = SRGBColorSpace;
    const labelMaterial = own(new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }));
    const face = new Mesh(own(new PlaneGeometry(w * .96, .61)), labelMaterial);
    face.position.z = d / 2 + .012; mesh.add(face);
    return { mesh, material, outlineMaterial };
  });
  function connector(points, color, opacity = 1) {
    const vectors = points.map(p => new Vector3(...p));
    const material = own(new LineBasicMaterial({ color, transparent: true, opacity }));
    const line = new Line(own(new BufferGeometry().setFromPoints(vectors)), material); group.add(line);
    const distances = [0];
    for (let i = 1; i < vectors.length; i++) distances.push(distances[i - 1] + vectors[i].distanceTo(vectors[i - 1]));
    function point(progress) {
      const distance = progress * distances[distances.length - 1];
      let i = 1; while (i < distances.length - 1 && distances[i] < distance) i++;
      return vectors[i - 1].clone().lerp(vectors[i], (distance - distances[i - 1]) / (distances[i] - distances[i - 1] || 1));
    }
    function update(points) {
      vectors.splice(0,vectors.length,...points.map(p=>new Vector3(...p)));
      distances.length=1;distances[0]=0;
      for(let i=1;i<vectors.length;i++) distances.push(distances[i-1]+vectors[i].distanceTo(vectors[i-1]));
      const position=line.geometry.getAttribute('position');
      vectors.forEach((v,i)=>position.setXYZ(i,v.x,v.y,v.z));position.needsUpdate=true;line.geometry.computeBoundingSphere();
    }
    return { line, material, point, update };
  }
  const routes = positions.slice(0, 3).map(p => connector([[p[0] + 1.125,p[1],p[2]],[-2.1,p[1],p[2]],[-2.1,0,.15],[-1.15,0,.35]],0x66523e,.7));
  const output = connector([[1.35,0,.35],[2.2,0,.65],[2.775,0,1]],0x66523e,.7);
  const provenance = connector([[3.9,-.46,1],[3.9,-2.05,.5],[-5.55,-2.05,-.4],[-5.55,1.45,-.4],[-5.225,1.45,-.4]],0x66523e,.45);
  const packetGeometry = own(new BoxGeometry(.095,.095,.095));
  const packetMaterial = own(new MeshBasicMaterial({color:copper}));
  const packet = new Mesh(packetGeometry,packetMaterial); group.add(packet);
  const returnPacket = new Mesh(packetGeometry,packetMaterial); group.add(returnPacket);
  let source = 0, stage = 0, visible = true, frame = 0, last = 0, disposed = false, contextLost = false, paused = false;
  let aimX = 0, aimY = 0;
  group.rotation.set(.17,-.16,-.025);
  function updateSelection() {
    source = Number(root.querySelector('[data-source][aria-pressed="true"]')?.dataset.source || 0);
    stage = Number(root.querySelector('[data-stage][aria-pressed="true"]')?.dataset.stage || 0);
    nodes.forEach((node,i) => {
      const selected = i === source || i === stage + 2 && stage > 0;
      node.material.color.setHex(selected ? 0x493422 : 0x28221c);
      node.outlineMaterial.color.setHex(selected ? copper : 0x74604a);
    });
    routes.forEach((route,i) => { route.material.color.setHex(i === source ? copper : 0x66523e); route.material.opacity = i === source ? 1 : .45; });
    output.material.color.setHex(stage === 2 ? copper : 0x66523e);
    provenance.material.color.setHex(stage === 2 ? copper : 0x66523e);
    const sourceY=positions[source][1];
    provenance.update([[3.9,-.46,1],[3.9,-2.05,.5],[-5.55,-2.05,-.4],[-5.55,sourceY,-.4],[-5.225,sourceY,-.4]]);
    returnPacket.visible = stage === 2;
    root.dataset.sceneSource = String(source); root.dataset.sceneStage = String(stage);
  }
  function click(event) { if (event.target.closest('[data-source],[data-stage]')) { updateSelection(); if (paused) renderer.render(scene,camera); } }
  function move(event) {
    if (event.pointerType === 'touch') return;
    const r = host.getBoundingClientRect();
    aimY = Math.max(-.12,Math.min(.12,((event.clientX-r.left)/r.width-.5)*.2));
    aimX = Math.max(-.08,Math.min(.08,((event.clientY-r.top)/r.height-.5)*.15));
  }
  function leave() { aimX=0;aimY=0; }
  function draw(now) {
    if (disposed || contextLost || paused || !visible || document.hidden) { frame=0;return; }
    frame=requestAnimationFrame(draw);
    if(now-last<32)return;last=now;
    group.rotation.x += (.17+aimX-group.rotation.x)*.07;
    group.rotation.y += (-.16+aimY-group.rotation.y)*.07;
    const progress=(now/3300)%1;
    if(stage===2 && progress>.68)packet.position.copy(output.point((progress-.68)/.32));
    else packet.position.copy(routes[source].point(stage===2?Math.min(1,progress/.68):progress));
    if(stage===2)returnPacket.position.copy(provenance.point((now/5200)%1));
    renderer.render(scene,camera);
  }
  function start(){ if(!frame && visible && !paused && !document.hidden && !disposed && !contextLost) frame=requestAnimationFrame(draw); }
  function resize(){ const box=host.getBoundingClientRect();renderer.setSize(box.width,box.height,false);const width=12.25;const height=width*box.height/box.width;camera.left=-width/2;camera.right=width/2;camera.top=height/2;camera.bottom=-height/2;camera.updateProjectionMatrix();start(); }
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else{cancelAnimationFrame(frame);frame=0;}},{threshold:.05});observer.observe(root);
  function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();}
  function lost(event){event.preventDefault();contextLost=true;cancelAnimationFrame(frame);frame=0;root.classList.remove('has-three-scene');root.dataset.renderer='svg';canvas.style.display='none';}
  root.addEventListener('click',click);host.addEventListener('pointermove',move,{passive:true});host.addEventListener('pointerleave',leave);
  document.addEventListener('visibilitychange',visibility);canvas.addEventListener('webglcontextlost',lost);
  updateSelection();resize();root.classList.add('has-three-scene');root.dataset.renderer='three';
  return {setPaused(value){paused=value;root.dataset.scenePaused=String(value);if(value){cancelAnimationFrame(frame);frame=0;renderer.render(scene,camera);}else start();},dispose(){
    disposed=true;cancelAnimationFrame(frame);observer.disconnect();resizeObserver.disconnect();
    root.removeEventListener('click',click);host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);
    document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',lost);
    resources.forEach(resource=>resource.dispose());renderer.dispose();renderer.forceContextLoss();canvas.remove();
    root.classList.remove('has-three-scene');root.dataset.renderer='svg';
  }};
}
