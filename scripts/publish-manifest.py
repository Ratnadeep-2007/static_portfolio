"""List only reviewed public source, assets and owner-site QA evidence."""
from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parent.parent
paths=[root/name for name in ['index.html','404.html','robots.txt','sitemap.xml','README.md','THIRD_PARTY_NOTICES.md','.gitignore','package.json','package-lock.json','requirements-dev.txt']]
for directory in ['src','public','assets','work','tests','scripts']:
    paths.extend(p for p in (root/directory).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
paths.extend((root/'docs').glob('*.md'))
paths.extend((root/'docs').glob('*-results.json'))
for name in ['baseline/home-1440.png','first-pass/desktop-hero.png','final/hero-desktop.png','final/home-mobile.png','final/contextguard-mobile.png','final/termwise-desktop.png']:
    paths.append(root/'docs/screenshots'/name)
manifest=[]
for p in sorted(set(paths)):
    b=p.read_bytes();name=p.relative_to(root).as_posix()
    assert not name.startswith(('folio/','docs/research/','.env','.git/'))
    manifest.append({'path':name,'bytes':len(b),'binary':p.suffix in ['.png','.pdf','.woff2'],'sha':hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()})
target=root/'docs/research/publish-manifest.json'
target.write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print(json.dumps({'files':len(manifest),'bytes':sum(p['bytes'] for p in manifest),'unique_binary_blobs':len(set(p['sha'] for p in manifest if p['binary']))}))
