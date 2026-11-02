import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {projects} from '../src/content.mjs';

const root=resolve('dist');
const pages=['index.html',...projects.map(p=>`work/${p.id}/index.html`)];
test('every project has a real static page, honest boundary and source',async()=>{
  for(const name of pages){
    const text=await readFile(join(root,name),'utf8');
    assert.equal((text.match(/<h1[ >]/g)||[]).length,1,name);
    const ids=[...text.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(new Set(ids).size,ids.length,'duplicate ID in '+name);
    if(name!=='index.html'){
      assert.ok(text.includes('id="boundaries"'),name);
      assert.ok(text.includes('Conceptual diagram, not an application screenshot.'),name);
      assert.ok(text.includes('README.md'),name);
    }
  }
});
test('local routes, downloads, stylesheet, scripts and image paths resolve',async()=>{
  for(const name of pages){
    const html=await readFile(join(root,name),'utf8');
    const base=new URL(name,'https://local/');
    for(const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
      const url=new URL(m[1].replaceAll('&amp;','&'),base);
      if(url.origin!=='https://local')continue;
      let path=decodeURIComponent(url.pathname);
      if(path.endsWith('/'))path+='index.html';
      const file=join(root,path);
      assert.ok((await stat(file)).isFile(),name+' -> '+path);
      if(url.hash){const target=await readFile(file,'utf8');assert.ok(target.includes(`id="${url.hash.slice(1)}"`),url.href);}
    }
  }
});
test('original PDF is unmodified and no longer embedded in HTML',async()=>{
  const a=await readFile('public/assets/ratnadeep-patil-resume.pdf');
  assert.equal(createHash('sha256').update(a).digest('hex'),'b2862911b8b87b38c4f3dceac79ed4d913f299d4cc4901e32107bab895daf524');
  assert.ok(a.subarray(0,4).toString()==='%PDF');
  assert.ok(!(await readFile('dist/index.html','utf8')).includes('data:application/pdf'));
});
test('requested gradient theme and lean runtime constraints hold',async()=>{
  const css=await readFile('src/styles.css','utf8');
  const client=await readFile('src/client.js','utf8');
  assert.ok(css.includes('--orange:#ff9a52'));
  assert.ok(/radial-gradient/.test(css));
  assert.ok(!/setInterval|eval\(/.test(client));
  assert.ok(client.includes("{ passive: true }"));
  assert.ok(css.includes('prefers-reduced-motion'));
  assert.ok((await stat('dist/index.html')).size<35000);
  assert.ok((await stat('dist/assets/client.js')).size<25000);
  // Includes the standalone scroll-story choreography, minified by the build.
  assert.ok((await stat('dist/assets/styles.css')).size<65000);
});
test('project priority, excluded web experience and local font notices preserved',async()=>{
  assert.deepEqual(projects.map(p=>p.id),['synora','contextguard','termwise','face-web-blockchain']);
  const html=await readFile('dist/index.html','utf8');
  assert.ok(!/AirBorenHRS|Solar Document Automation|multi_doc_writer/.test(html));
  for(const font of ['dm-sans-400','dm-sans-600','dm-sans-700','jetbrains-mono'])assert.equal((await readFile(`dist/assets/fonts/${font}.woff2`)).subarray(0,4).toString(),'wOF2');
  for(const file of ['DM-Sans-OFL.txt','JetBrains-Mono-OFL.txt','TermWise-MIT.txt'])assert.ok((await stat('dist/assets/licenses/'+file)).size>1000);
});
test('unique social metadata, canonical and sitemap are generated for each route',async()=>{
  const titles=new Set();
  for(const name of pages){
    const html=await readFile(join(root,name),'utf8');
    const title=html.match(/<title>([^<]+)/)[1];assert.ok(!titles.has(title));titles.add(title);
    assert.ok(html.includes('rel="canonical"'));
    const og=html.match(/property="og:image" content="([^"]+)"/)[1];
    const file=join(root,new URL(og).pathname.split('/assets/')[1]?'assets/'+new URL(og).pathname.split('/assets/')[1]:'missing');
    assert.ok((await stat(file)).isFile(),og);
  }
  assert.equal(((await readFile('dist/sitemap.xml','utf8')).match(/<url>/g)||[]).length,5);
});
