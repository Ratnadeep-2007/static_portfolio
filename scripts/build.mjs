import { mkdir, readFile, writeFile, cp, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join } from 'node:path';
import { profile, projects } from '../src/content.mjs';
import { layout, HomePage, ProjectDetail, ContactSection } from '../src/components.mjs';
import { projectDiagram, ogDiagram } from '../src/diagrams.mjs';
import { build as bundle, transform } from 'esbuild';

export const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const origin=(process.env.SITE_URL || 'http://localhost:4173').replace(/\/$/,'');
if(!/^https?:\/\//.test(origin)) throw new Error('SITE_URL must be an absolute http(s) URL.');

export async function build() {
  const out=join(root,'dist');
  await mkdir(out,{recursive:true});
  await cp(join(root,'public'),out,{recursive:true});
  await mkdir(join(out,'assets/diagrams'),{recursive:true});
  await mkdir(join(out,'assets/og'),{recursive:true});
  const styles=(await readFile(join(root,'src/styles.css'),'utf8'))+'\n'+(await readFile(join(root,'src/scroll-story.css'),'utf8'));
  await writeFile(join(out,'assets/styles.css'),(await transform(styles,{loader:'css',minify:true})).code);
  await bundle({ entryPoints:[join(root,'src/client.js')], outfile:join(out,'assets/client.js'), bundle:true, minify:true, target:'es2020', legalComments:'inline' });
  await bundle({ entryPoints:[join(root,'src/system-scene.js')], outfile:join(out,'assets/system-scene.js'), bundle:true, minify:true, format:'esm', platform:'browser', target:'es2020', legalComments:'inline' });
  const home=HomePage(origin);
  await writeFile(join(out,'index.html'),home);
  // A generated convenience entry, not the editable source. npm run dev serves dist.
  await writeFile(join(root,'index.html'),home);
  const pages=[{path:'/',title:'Ratnadeep Patil',id:'home',subtitle:'AI / ML & Agentic Development Engineer'}];
  for(const project of projects) {
    if(!/^[a-z0-9-]+$/.test(project.id)) throw new Error('Unsafe project slug');
    await mkdir(join(out,'work',project.id),{recursive:true});
    await writeFile(join(out,'work',project.id,'index.html'),layout({body:ProjectDetail(project,'../../')+ContactSection(),title:project.name+' — Ratnadeep Patil',description:project.summary,base:'../../',path:'/work/'+project.id+'/',origin,id:project.id,detail:true}));
    const svg=projectDiagram(project);
    await writeFile(join(out,'assets/diagrams',project.id+'.svg'),svg);
    pages.push({path:'/work/'+project.id+'/',title:project.name,id:project.id,subtitle:project.short});
  }
  for(const page of pages) await writeFile(join(out,'assets/og',page.id+'.svg'),ogDiagram(page.id,page.title,page.subtitle));
  await writeFile(join(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  await writeFile(join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${origin}${p.path}</loc></url>`).join('')}</urlset>\n`);
  await writeFile(join(out,'404.html'),layout({body:'<section class="case-hero wrap"><p class="eyebrow">404 / PAGE NOT FOUND</p><h1>This path ends here.</h1><p class="case-summary">The work is still one click away.</p><a class="text-link" href="/">Back to the portfolio ↗</a></section>',title:'Page not found — Ratnadeep Patil',description:'Return to Ratnadeep Patil’s portfolio.',origin,id:'home',path:'/404.html'}));
  const report={generatedAt:new Date().toISOString(),origin,pages:pages.map(p=>p.path),homeBytes:(await stat(join(out,'index.html'))).size,clientBytes:(await stat(join(out,'assets/client.js'))).size,cssBytes:(await stat(join(out,'assets/styles.css'))).size,sceneBytes:(await stat(join(out,'assets/system-scene.js'))).size,dependencies:1,optionalRenderer:'three@0.187.0'};
  await writeFile(join(out,'build-report.json'),JSON.stringify(report,null,2)+'\n');
  // Keep a ready-to-host root copy as well as the canonical dist upload folder.
  await cp(join(out,'assets'),join(root,'assets'),{recursive:true});
  await cp(join(out,'work'),join(root,'work'),{recursive:true});
  for(const file of ['robots.txt','sitemap.xml','404.html']) await cp(join(out,file),join(root,file));
  console.log(`Built ${pages.length} static pages in dist. Origin: ${origin}`);
  return report;
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) await build();
