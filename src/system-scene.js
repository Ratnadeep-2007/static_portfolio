import {
  WebGLRenderer, Scene, Group, OrthographicCamera, Mesh, MeshBasicMaterial,
  MeshStandardMaterial, BoxGeometry, EdgesGeometry, LineSegments, LineBasicMaterial,
  BufferGeometry, Vector3, Line, CanvasTexture, PlaneGeometry, SRGBColorSpace,
  AmbientLight, DirectionalLight
} from 'three';

// An original physical model: evidence sheets, a context processor and a decision.
// Native HTML owns the content, selection and playback controls.
export function createSystemScene(root) {
  const host = root.querySelector('.system-drawing');
  if (!host) return null;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!context) return null;
  let renderer;
  try { renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true }); }
  catch { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setClearColor(0x171614, 0); renderer.outputColorSpace = SRGBColorSpace;
  canvas.setAttribute('aria-hidden', 'true'); host.append(canvas);
  const resources = new Set();
  const own = resource => { resources.add(resource); return resource; };
  const scene = new Scene();
  scene.add(new AmbientLight(0xfff4e5, 2.2));
  const keyLight = new DirectionalLight(0xffead4, 3.2); keyLight.position.set(-4, 6, 10); scene.add(keyLight);
  const sideLight = new DirectionalLight(0xb7b4ae, 1.5); sideLight.position.set(6, -2, 2); scene.add(sideLight);
  const assembly = new Group(); scene.add(assembly);
  const camera = new OrthographicCamera(-6, 6, 4.5, -4.5, .1, 70);
  camera.position.set(0, 0, 20);
  const copper = 0xdba77a, ink = 0x24201b, ivory = 0xeee9e1;
  const material = (color, metalness = .05) => own(new MeshStandardMaterial({ color, roughness: .76, metalness }));
  const edgeMaterial = own(new LineBasicMaterial({ color: 0xf0c59f, transparent: true, opacity: .7 }));
  const mutedLine = 0x76604c;
  function box(parent, w, h, d, fill, position = [0, 0, 0], edges = false) {
    const geometry = own(new BoxGeometry(w, h, d));
    const mesh = new Mesh(geometry, fill); mesh.position.set(...position); parent.add(mesh);
    if (edges) mesh.add(new LineSegments(own(new EdgesGeometry(geometry)), edgeMaterial));
    return mesh;
  }
  function face(parent, width, height, depth, draw) {
    const sheet = document.createElement('canvas'); sheet.width = 1024; sheet.height = Math.round(1024 * height / width);
    const pen = sheet.getContext('2d'); if (!pen) return;
    draw(pen, sheet.width, sheet.height);
    const texture = own(new CanvasTexture(sheet)); texture.colorSpace = SRGBColorSpace;
    const faceMaterial = own(new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }));
    const mesh = new Mesh(own(new PlaneGeometry(width, height)), faceMaterial); mesh.position.z = depth; parent.add(mesh);
  }
  const sheetMaterial = material(ivory);
  const sheetEdgeMaterial = material(0xbeb5a8);
  const copperMaterial = material(copper, .35);
  const darkMaterial = material(ink, .2);
  const positions = [[-3.75, 1.72, .2], [-3.9, .05, .55], [-3.6, -1.6, .12]];
  const labels = ['MEETING NOTE', 'PROJECT BRIEF', 'ARCHITECTURE'];
  const papers = positions.map((position, i) => {
    const paper = new Group(); paper.position.set(...position); assembly.add(paper);
    paper.rotation.set(.04, -.07, [ -.08, .035, -.035 ][i]);
    box(paper, 2.24, 1.37, .065, sheetEdgeMaterial, [-.08, -.075, -.10]);
    const surface = box(paper, 2.24, 1.37, .07, sheetMaterial);
    face(paper, 2.24, 1.37, .041, (pen, w, h) => {
      pen.fillStyle = '#5b493a'; pen.font = '400 34px "JetBrains Mono", monospace';
      pen.fillText('0' + (i + 1) + '  /  SOURCE', 66, 76);
      pen.fillStyle = '#24201b'; pen.font = '600 94px "DM Sans", sans-serif'; pen.fillText(labels[i], 66, 177);
      pen.fillStyle = '#a69b8d';
      [0, 1, 2].forEach(n => pen.fillRect(66, 244 + n * 45, [w * .71, w * .62, w * .40][n], 10));
      pen.fillStyle = '#99714e'; pen.fillRect(66, h - 82, 65, 13);
      pen.font = '400 27px "JetBrains Mono", monospace'; pen.fillText('EVIDENCE RETAINED', 153, h - 62);
    });
    return { group: paper, surface, rest: new Vector3(...position), rotation: paper.rotation.z };
  });

  // A visibly layered processor, built from separate copper fins and ceramic plates.
  const processor = new Group(); processor.position.set(.05, .12, .55); assembly.add(processor);
  const processorLayers = [];
  for (let i = 0; i < 6; i++) {
    const fin = box(processor, 2.65, 2.7, .10, i % 2 ? darkMaterial : copperMaterial, [0, 0, -.80 + i * .20], true);
    processorLayers.push({ mesh: fin, rest: fin.position.z });
  }
  box(processor, 2.08, 2.10, .26, darkMaterial, [0, 0, .45], true);
  box(processor, 1.88, 1.9, .13, copperMaterial, [0, 0, .66]);
  face(processor, 1.88, 1.9, .733, (pen, w, h) => {
    pen.fillStyle = '#39291e'; pen.font = '400 38px "JetBrains Mono", monospace'; pen.fillText('SOURCE → SYSTEM', 66, 93);
    pen.font = '600 126px "DM Sans", sans-serif'; pen.fillText('CONTEXT', 62, 380);
    pen.strokeStyle = '#67462f'; pen.lineWidth = 3; pen.strokeRect(66, h - 188, w - 132, 92);
    pen.font = '400 37px "JetBrains Mono", monospace'; pen.fillText('LINK / RETAIN / REASON', 100, h - 130);
  });
  // Short physical pins make the processor read as hardware rather than a UI card.
  for (let i = 0; i < 8; i++) {
    const y = -1.1 + i * .31;
    box(processor, .28, .09, .10, copperMaterial, [-1.42, y, -.08]);
    box(processor, .28, .09, .10, copperMaterial, [1.42, y, -.08]);
  }
  const decision = new Group(); decision.position.set(3.65, -.15, .55); decision.rotation.z = -.035; assembly.add(decision);
  box(decision, 2.25, 2.90, .11, sheetEdgeMaterial, [.12, -.12, -.17]);
  box(decision, 2.25, 2.90, .16, sheetMaterial);
  face(decision, 2.25, 2.90, .087, (pen, w, h) => {
    pen.fillStyle = '#765338'; pen.font = '400 34px "JetBrains Mono", monospace'; pen.fillText('03  /  OUTPUT', 65, 100);
    pen.fillStyle = '#24201b'; pen.font = '600 104px "DM Sans", sans-serif'; pen.fillText('Useful', 65, 274); pen.fillText('action.', 65, 384);
    pen.fillStyle = '#b5a695'; [0, 1, 2].forEach(n => pen.fillRect(65, 475 + n * 48, [w * .72, w * .63, w * .48][n], 10));
    pen.fillStyle = '#dba77a'; pen.fillRect(65, h - 330, w - 130, 163);
    pen.strokeStyle = '#463426'; pen.lineWidth = 9; pen.beginPath(); pen.moveTo(106, h - 254); pen.lineTo(137, h - 221); pen.lineTo(192, h - 282); pen.stroke();
    pen.fillStyle = '#463426'; pen.font = '600 38px "DM Sans", sans-serif'; pen.fillText('SOURCE ATTACHED', 237, h - 242);
    pen.font = '400 29px "JetBrains Mono", monospace'; pen.fillStyle = '#765338'; pen.fillText('TRACEABLE BY DESIGN', 65, h - 78);
  });

  const routeMaterial = color => own(new LineBasicMaterial({ color, transparent: true, opacity: .75 }));
  function connector(points, color) {
    const vectors = points.map(p => new Vector3(...p));
    const geometry = own(new BufferGeometry().setFromPoints(vectors));
    const line = new Line(geometry, routeMaterial(color)); assembly.add(line);
    const distances = [];
    function measure() { distances.length = 1; distances[0] = 0; for (let i = 1; i < vectors.length; i++) distances.push(distances[i - 1] + vectors[i].distanceTo(vectors[i - 1])); }
    measure();
    const result = new Vector3();
    return {
      line,
      point(progress) {
        const distance = Math.min(.99999, Math.max(0, progress)) * distances[distances.length - 1];
        let i = 1; while (i < distances.length - 1 && distances[i] < distance) i++;
        return result.copy(vectors[i - 1]).lerp(vectors[i], (distance - distances[i - 1]) / (distances[i] - distances[i - 1] || 1));
      },
      update(points) {
        points.forEach((p, i) => vectors[i].set(...p)); measure();
        const attribute = geometry.getAttribute('position'); vectors.forEach((v, i) => attribute.setXYZ(i, v.x, v.y, v.z));
        attribute.needsUpdate = true; geometry.computeBoundingSphere();
      }
    };
  }
  const routes = positions.map(p => connector([[p[0] + 1.12, p[1], p[2]], [-2.08, p[1], .1], [-2.08, .12, .1], [-1.37, .12, .47]], mutedLine));
  const output = connector([[1.45, .12, .55], [2.05, .12, .55], [2.05, -.15, .55], [2.52, -.15, .55]], mutedLine);
  const provenance = connector([[3.65, -1.6, .5], [3.65, -2.62, .2], [-5.35, -2.62, -.2], [-5.35, 1.72, .2], [-4.87, 1.72, .2]], mutedLine);
  const packetGeometry = own(new BoxGeometry(.14, .14, .14));
  const packetMaterial = own(new MeshBasicMaterial({ color: copper }));
  const packets = Array.from({ length: 3 }, () => { const p = new Mesh(packetGeometry, packetMaterial); assembly.add(p); return p; });
  const returnPacket = new Mesh(packetGeometry, packetMaterial); assembly.add(returnPacket);

  let source = 0, stage = 0, visible = true, paused = false, disposed = false, contextLost = false;
  let frame = 0, previousTime = 0, elapsed = 0, aimX = 0, aimY = 0, focus = 0;
  const restRotation = { x: .13, y: -.27, z: -.045 };
  assembly.rotation.set(restRotation.x, restRotation.y, restRotation.z);
  function updateSelection() {
    source = Number(root.querySelector('[data-source][aria-pressed="true"]')?.dataset.source || 0);
    stage = Number(root.querySelector('[data-stage][aria-pressed="true"]')?.dataset.stage || 0);
    routes.forEach((route, i) => { route.line.material.color.setHex(i === source ? copper : mutedLine); route.line.material.opacity = i === source ? 1 : .35; });
    output.line.material.color.setHex(stage === 2 ? copper : mutedLine);
    provenance.line.material.color.setHex(stage === 2 ? copper : mutedLine);
    provenance.line.material.opacity = stage === 2 ? .85 : .22;
    const p = positions[source];
    provenance.update([[3.65, -1.6, .5], [3.65, -2.62, .2], [-5.35, -2.62, -.2], [-5.35, p[1], p[2]], [p[0] - 1.12, p[1], p[2]]]);
    returnPacket.visible = stage === 2;
    root.dataset.sceneSource = String(source); root.dataset.sceneStage = String(stage);
  }
  function click(event) { if (event.target.closest('[data-source],[data-stage]')) { updateSelection(); if (paused) renderFrame(0); } }
  function change() { updateSelection(); if (paused) renderFrame(0); }
  function move(event) {
    if (event.pointerType === 'touch') return;
    const r = host.getBoundingClientRect();
    aimY = Math.max(-.22, Math.min(.22, ((event.clientX - r.left) / r.width - .5) * .42));
    aimX = Math.max(-.13, Math.min(.13, ((event.clientY - r.top) / r.height - .5) * .25));
  }
  function leave() { aimX = 0; aimY = 0; }
  const easeOut = n => 1 - Math.pow(1 - Math.min(1, Math.max(0, n)), 4);
  function renderFrame(delta) {
    elapsed += delta;
    const entry = easeOut(elapsed / 1500);
    papers.forEach((paper, i) => {
      const progress = easeOut((elapsed - i * 110) / 1100);
      paper.group.position.copy(paper.rest); paper.group.position.x -= (1 - progress) * (2.2 + i * .2);
      paper.group.position.y += Math.sin(elapsed / 1250 + i * 1.8) * .09 * entry;
      paper.group.position.z += Math.sin(elapsed / 1700 + i) * .09 * entry;
      paper.group.rotation.z = paper.rotation + Math.sin(elapsed / 1900 + i) * .018 * entry;
      const scale = i === source ? 1.035 : 1;
      paper.group.scale.setScalar(paper.group.scale.x + (scale - paper.group.scale.x) * .11);
    });
    focus += ((stage === 1 ? 1 : 0) - focus) * (delta ? .1 : 1);
    processorLayers.forEach((layer, i) => { layer.mesh.position.z = layer.rest + (1 - entry) * (i - 2.5) * .85 - focus * (5 - i) * .075; });
    processor.position.y = .12 + Math.sin(elapsed / 1800) * .065 * entry;
    decision.position.x = 3.65 + (1 - easeOut((elapsed - 220) / 1300)) * 3;
    decision.position.y = -.15 + Math.sin(elapsed / 1600 + 1) * .065 * entry;
    assembly.rotation.x += (restRotation.x + aimX - assembly.rotation.x) * .075;
    assembly.rotation.y += (restRotation.y + aimY - assembly.rotation.y) * .075;
    packets.forEach((packet, i) => {
      const progress = (elapsed / 2700 + i / 3) % 1;
      packet.position.copy(stage === 2 && progress > .72 ? output.point((progress - .72) / .28) : routes[source].point(stage === 2 ? Math.min(1, progress / .72) : progress));
      packet.scale.setScalar(entry);
    });
    if (stage === 2) returnPacket.position.copy(provenance.point((elapsed / 5100) % 1));
    root.dataset.sceneAssembled = entry === 1 ? 'true' : 'false';
    renderer.render(scene, camera);
  }
  function draw(now) {
    if (disposed || contextLost || paused || !visible || document.hidden) { frame = 0; previousTime = 0; return; }
    frame = requestAnimationFrame(draw);
    if (previousTime && now - previousTime < 32) return;
    const delta = previousTime ? Math.min(50, now - previousTime) : 32; previousTime = now;
    renderFrame(delta);
  }
  function start() { if (!frame && visible && !paused && !document.hidden && !disposed && !contextLost) { previousTime = 0; frame = requestAnimationFrame(draw); } }
  function stop() { cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
  function resize() {
    const bounds = host.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    renderer.setSize(bounds.width, bounds.height, false);
    const width = bounds.width < 500 ? 12.5 : 12.05, height = width * bounds.height / bounds.width;
    camera.left = -width / 2; camera.right = width / 2; camera.top = height / 2; camera.bottom = -height / 2;
    camera.updateProjectionMatrix(); if (paused) renderer.render(scene, camera); else start();
  }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) start(); else stop(); }, { threshold: .05 }); observer.observe(root);
  function visibility() { if (document.hidden) stop(); else start(); }
  function lost(event) { event.preventDefault(); contextLost = true; stop(); root.classList.remove('has-three-scene'); root.dataset.renderer = 'svg'; canvas.style.display = 'none'; }
  root.addEventListener('click', click); root.addEventListener('diagram-stage-change', change);
  host.addEventListener('pointermove', move, { passive: true }); host.addEventListener('pointerleave', leave);
  document.addEventListener('visibilitychange', visibility); canvas.addEventListener('webglcontextlost', lost);
  updateSelection(); resize(); root.classList.add('has-three-scene'); root.dataset.renderer = 'three';
  return {
    setPaused(value) { paused = value; root.dataset.scenePaused = String(value); if (value) { stop(); renderFrame(0); } else start(); },
    dispose() {
      disposed = true; stop(); observer.disconnect(); resizeObserver.disconnect();
      root.removeEventListener('click', click); root.removeEventListener('diagram-stage-change', change);
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibility); canvas.removeEventListener('webglcontextlost', lost);
      resources.forEach(resource => resource.dispose()); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
      root.classList.remove('has-three-scene'); root.dataset.renderer = 'svg';
    }
  };
}
