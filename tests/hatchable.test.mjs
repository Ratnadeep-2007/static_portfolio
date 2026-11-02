import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { projects } from '../src/content.mjs';

const origin = 'https://ratnadeep-systems.hatchable.site';
const pagePaths = ['index.html', ...projects.map(p => `work/${p.id}/index.html`), '404.html'];

test('all static pages have the Hatchable canonical origin and OG previews', async () => {
  for (const path of pagePaths) {
    const html = await readFile(join('dist', path), 'utf8');
    const slug = path === 'index.html' ? '/' : path === '404.html' ? '/404.html' : '/' + path.replace(/index\.html$/, '');
    const canonical = origin + slug;
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `canonical: ${path}`);
    assert.ok(html.includes(`property="og:url" content="${canonical}"`), `og:url: ${path}`);
    const preview = html.match(/property="og:image" content="([^"]+)"/)?.[1];
    assert.ok(preview?.startsWith(origin + '/assets/og/'), `og:image: ${path}`);
    const previewPath = new URL(preview).pathname.slice(1);
    assert.ok((await stat(join('dist', previewPath))).isFile(), `missing image: ${previewPath}`);
    assert.ok(!html.includes('http://localhost:4173'), `local preview URL found: ${path}`);
  }
});

test('sitemap and robots point to the live Hatchable host', async () => {
  const xml = await readFile('dist/sitemap.xml', 'utf8');
  const robots = await readFile('dist/robots.txt', 'utf8');
  assert.ok(robots.includes(origin + '/sitemap.xml'));
  assert.ok(!xml.includes('localhost'));
  assert.equal((xml.match(/<url>/g) || []).length, 5);
  for (const page of ['/', ...projects.map(p => `/work/${p.id}/`)]) {
    assert.ok(xml.includes(`<loc>${origin}${page}</loc>`));
  }
});

test('critical static assets and unchanged CV remain present', async () => {
  for (const name of [
    'assets/styles.css', 'assets/client.js', 'assets/motion.js', 'assets/skin.css', 'assets/experience.js', 'assets/knot-graph.js', 'assets/favicon.svg',
    'assets/fonts/dm-sans-400.woff2', 'assets/fonts/jetbrains-mono.woff2',
    'assets/ratnadeep-patil-resume.pdf', 'assets/og/home.png',
    ...projects.map(p => `assets/diagrams/${p.id}.svg`)
  ]) assert.ok((await stat(join('dist', name))).isFile(), name);
});
