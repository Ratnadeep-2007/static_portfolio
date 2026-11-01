// Reproducible production build for the existing Hatchable project.
// The base generator remains environment-aware for local preview and other hosts.
const SITE_URL = 'https://ratnadeep-systems.hatchable.site';
process.env.SITE_URL = SITE_URL;
const { build } = await import('./build.mjs');
const report = await build();
if (report.origin !== SITE_URL || report.pages.length !== 5) {
  throw new Error('Hatchable build metadata mismatch');
}
console.log('Hatchable-ready assets: dist/ (copy its contents to the project public/ folder)');
