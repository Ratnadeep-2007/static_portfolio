from pathlib import Path
from playwright.sync_api import sync_playwright
from datetime import datetime,timezone
import json,time
root=Path.cwd();out=root/'docs/research';out.mkdir(exist_ok=True,parents=True)
targets=[('yoichi','https://www.tplh.net/'),('kiran','https://kirannaragund.com/'),('dennis','https://dennissnellenberg.com/'),('rauno','https://rauno.me/'),('emil','https://emilkowal.ski/'),('bruno','https://bruno-simon.com/'),('paco','https://paco.me/'),('robby','https://www.rleonardi.com/interactive-resume/'),('hatchable','https://ratnadeep-systems.hatchable.site')]
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless=True)
    for slug,url in targets:
        page=browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
        row={'slug':slug,'url':url,'accessed':datetime.now(timezone.utc).isoformat(),'viewports':[]}
        try:
            start=time.perf_counter();response=page.goto(url,wait_until='domcontentloaded',timeout=12000);page.wait_for_timeout(1100)
            row.update(status=response.status if response else None,title=page.title(),elapsed_ms=round((time.perf_counter()-start)*1000))
            row['direct_observation']=page.evaluate('''()=>({text:document.body.innerText.slice(0,4000),background:getComputedStyle(document.body).backgroundColor,fonts:[...new Set([...document.querySelectorAll('h1,h2,p,a')].slice(0,25).map(e=>getComputedStyle(e).fontFamily))],h1:[...document.querySelectorAll('h1')].map(e=>({text:e.textContent.trim(),size:getComputedStyle(e).fontSize})),canvases:document.querySelectorAll('canvas').length,links:[...document.querySelectorAll('a')].slice(0,20).map(e=>({text:e.innerText,url:e.href})),buttons:[...document.querySelectorAll('button')].slice(0,10).map(e=>e.innerText)})''')
            for width,height in [(1440,900),(768,1024),(390,844)]:
                page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(180)
                path=out/f'{slug}-{width}.png';page.screenshot(path=str(path))
                row['viewports'].append({'width':width,'height':height,'screenshot':path.name,'overflow':page.evaluate('document.documentElement.scrollWidth>innerWidth')})
            page.set_viewport_size({'width':1440,'height':900})
            page.keyboard.press('Tab');row['keyboard_focus']=page.evaluate('document.activeElement.outerHTML.slice(0,400)')
            page.mouse.move(950,440);page.mouse.wheel(0,700);page.wait_for_timeout(450)
            row['scroll_position']=page.evaluate('scrollY')
            page.screenshot(path=str(out/f'{slug}-scrolled.png'))
            row['browser_access']='loaded; screenshots require inspection'
        except Exception as e:row['browser_access']='blocked or failed';row['error']=str(e)[:650]
        results.append(row);(out/'browser-observations.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
        print(slug,row['browser_access'],flush=True);page.close()
    if (out/'baseline-original.html').exists():
        page=browser.new_page(viewport={'width':1440,'height':900},reduced_motion='reduce')
        page.goto((out/'baseline-original.html').as_uri(),wait_until='domcontentloaded')
        for width,height in [(1440,900),(768,1024),(390,844)]:
            page.set_viewport_size({'width':width,'height':height});page.screenshot(path=str(root/f'docs/screenshots/baseline/home-{width}.png'),full_page=True)
        print('baseline screenshots captured',flush=True)
    browser.close()
