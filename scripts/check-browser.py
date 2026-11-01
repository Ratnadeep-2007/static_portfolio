from pathlib import Path
from playwright.sync_api import sync_playwright
from datetime import datetime,timezone
import hashlib,json,os,time

ROOT=Path(__file__).resolve().parent.parent
BASE=os.environ.get('PORTFOLIO_TEST_URL','http://localhost:4173')
EXECUTABLE=os.environ.get('BROWSER_EXECUTABLE','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe')
OUT=ROOT/'docs/screenshots/final';OUT.mkdir(parents=True,exist_ok=True)
result={'accessed':datetime.now(timezone.utc).isoformat(),'base':BASE,'checks':[],'viewports':[],'errors':[],'http_failures':[]}
routes=['/','/work/synora/','/work/contextguard/','/work/termwise/','/work/face-web-blockchain/']
widths=[(320,740),(390,844),(768,1024),(1024,900),(1440,900),(1920,1080)]

def check(name,condition):
    if not condition:raise AssertionError(name)
    result['checks'].append(name)

def load_images(page):
    page.evaluate("document.querySelectorAll('img[loading]').forEach(e=>e.loading='eager')")
    page.wait_for_function("[...document.images].every(i=>i.complete&&i.naturalWidth>0)")

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=EXECUTABLE,headless=True)
    context=browser.new_context(viewport={'width':1440,'height':900},device_scale_factor=1,accept_downloads=True)
    page=context.new_page()
    page.on('pageerror',lambda error:result['errors'].append(str(error)))
    page.on('response',lambda response:result['http_failures'].append({'url':response.url,'status':response.status}) if response.status>=400 else None)
    for route in routes:
        response=page.goto(BASE+route,wait_until='networkidle')
        check('HTTP 200 '+route,response.status==200)
        load_images(page)
        check('one h1 '+route,page.locator('h1').count()==1)
        check('no duplicate IDs '+route,page.evaluate("(()=>{const a=[...document.querySelectorAll('[id]')].map(e=>e.id);return a.length===new Set(a).size})()"))
        check('named links and controls '+route,page.evaluate("[...document.querySelectorAll('a,button')].every(e=>(e.getAttribute('aria-label')||e.textContent||'').trim().length>0)"))
        for width,height in widths:
            page.set_viewport_size({'width':width,'height':height})
            page.wait_for_timeout(80)
            check(f'no overflow {route} {width}',not page.evaluate('document.documentElement.scrollWidth>innerWidth'))
            result['viewports'].append({'route':route,'width':width,'height':height})
        if route!='/':
            slug=route.split('/')[2]
            page.set_viewport_size({'width':1440,'height':900});page.screenshot(path=str(OUT/f'{slug}-desktop.png'),full_page=True)
            page.set_viewport_size({'width':390,'height':844});page.screenshot(path=str(OUT/f'{slug}-mobile.png'),full_page=True)

    page.set_viewport_size({'width':1440,'height':900})
    page.goto(BASE,wait_until='networkidle');load_images(page);page.wait_for_timeout(650)
    check('local fonts loaded',page.evaluate('document.fonts.check(\'400 16px "DM Sans"\')&&document.fonts.check(\'600 16px "DM Sans"\')&&document.fonts.check(\'400 12px "JetBrains Mono"\')'))
    for source in range(3):
        page.locator(f'[data-source="{source}"]').click()
        check('source selection '+str(source),page.locator(f'[data-source="{source}"]').get_attribute('aria-pressed')=='true')
        citation=page.locator('[data-citation]').inner_text()
        for stage in range(3):
            page.locator(f'[data-stage="{stage}"]').click()
            check(f'stage {source}/{stage}',page.locator(f'[data-stage="{stage}"]').get_attribute('aria-pressed')=='true')
            check(f'provenance retained {source}/{stage}',page.locator('[data-citation]').inner_text()==citation)
    page.locator('[data-source="1"]').click();page.locator('[data-stage="2"]').click()
    check('decision explanation for brief','Keep the dependency open' in page.locator('[data-statement]').inner_text())
    page.locator('[data-source="0"]').focus();page.keyboard.press('ArrowRight')
    check('arrow-key source selection',page.locator('[data-source="1"]').get_attribute('aria-pressed')=='true')
    page.locator('[data-stage="0"]').focus();page.keyboard.press('End')
    check('End-key stage selection',page.locator('[data-stage="2"]').get_attribute('aria-pressed')=='true')
    page.locator('[data-stage="0"]').focus();page.keyboard.press('Space')
    check('Space activates native control',page.locator('[data-stage="0"]').get_attribute('aria-pressed')=='true')
    page.locator('[data-source="0"]').click();page.wait_for_timeout(300)
    page.screenshot(path=str(OUT/'hero-desktop.png'))
    page.screenshot(path=str(OUT/'home-desktop.png'),full_page=True)
    page.locator('.project-actions a').first.click();check('case link navigates',page.url.endswith('/work/synora/'))
    page.go_back(wait_until='networkidle');check('browser back returns home','/work/' not in page.url)
    page.locator('[data-source="1"]').click();check('explorer works after browser back',page.locator('[data-source="1"]').get_attribute('aria-pressed')=='true')
    page.goto(BASE+'/work/synora/',wait_until='networkidle');page.locator('.case-index a[href="#decisions"]').click();check('case anchor works',page.url.endswith('#decisions'))

    page.goto(BASE,wait_until='networkidle')
    page.locator('.copy-email').click()
    result['native_clipboard_feedback']=page.locator('.copy-status').inner_text()
    check('native clipboard feedback is actionable',result['native_clipboard_feedback']=='Email address copied.' or 'Use the email link' in result['native_clipboard_feedback'])
    page.evaluate("Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(value)=>{window.__copied=value}}})")
    page.locator('.copy-email').click();check('copy success message',page.locator('.copy-status').inner_text()=='Email address copied.')
    check('copied correct email',page.evaluate('window.__copied')=='ratnadeepp2007@gmail.com')
    page.evaluate("Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('denied')}}})")
    page.locator('.copy-email').click();check('copy failure actionable','Use the email link' in page.locator('.copy-status').inner_text())
    check('mailto preserved',page.locator('.email-link').get_attribute('href')=='mailto:ratnadeepp2007@gmail.com')
    with page.expect_download() as pending:page.locator('.resume-link').click()
    download=pending.value;path=OUT/'downloaded-resume.pdf';download.save_as(path)
    check('original PDF download',path.read_bytes()==(ROOT/'public/assets/ratnadeep-patil-resume.pdf').read_bytes())
    page.set_viewport_size({'width':390,'height':844});page.goto(BASE,wait_until='networkidle');load_images(page)
    page.locator('.menu-toggle').click();check('mobile menu expanded',page.locator('.menu-toggle').get_attribute('aria-expanded')=='true')
    check('mobile menu first-link focus',page.locator('#mobile-nav a').first.evaluate('(e)=>e===document.activeElement'))
    page.keyboard.press('Escape');check('Escape closes menu',page.locator('#mobile-nav').is_hidden())
    check('Escape returns focus',page.locator('.menu-toggle').evaluate('(e)=>e===document.activeElement'))
    page.locator('.menu-toggle').click();page.locator('#mobile-nav a[href="#about"]').click()
    check('mobile link closes menu',page.locator('#mobile-nav').is_hidden())
    check('mobile anchor navigates',page.url.endswith('#about'))
    page.wait_for_timeout(70)
    check('mobile anchor moves focus into content',page.locator('#about').evaluate('(e)=>e===document.activeElement'))
    page.goto(BASE,wait_until='networkidle');load_images(page);page.screenshot(path=str(OUT/'home-mobile.png'),full_page=True)
    page.emulate_media(reduced_motion='reduce');check('reduced motion CSS',page.locator('.hero-copy').evaluate('(e)=>getComputedStyle(e).animationName')=='none')
    page.locator('[data-source="2"]').click();page.locator('[data-stage="1"]').click();check('reduced motion still interactive','visualization' in page.locator('[data-statement]').inner_text())

    touch=browser.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,reduced_motion='reduce')
    touchpage=touch.new_page();touchpage.goto(BASE,wait_until='networkidle')
    touchpage.locator('[data-source="1"]').tap();touchpage.locator('[data-stage="2"]').tap();check('touch source/stage controls','Keep the dependency open' in touchpage.locator('[data-statement]').inner_text())
    touch.close()
    fallback=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844})
    static=fallback.new_page();static.goto(BASE,wait_until='networkidle');load_images(static)
    check('no-JS navigation visible',static.locator('.desktop-nav').is_visible())
    check('no-JS controls hidden',static.locator('.source-picker').is_hidden())
    check('no-JS prose and fallback visible',static.locator('.hero-copy').is_visible() and static.locator('.noscript-note').is_visible())
    fallback.close()
    low=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
    low.add_init_script("const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:original.call(this,type,...args)}")
    lowpage=low.new_page();lowpage.goto(BASE,wait_until='networkidle');lowpage.locator('[data-stage="2"]').click();check('WebGL-disabled interaction',lowpage.locator('[data-stage="2"]').get_attribute('aria-pressed')=='true')
    low.close()
    slow=browser.new_context(viewport={'width':390,'height':844});slowpage=slow.new_page();cdp=slow.new_cdp_session(slowpage)
    cdp.send('Network.enable');cdp.send('Network.emulateNetworkConditions',{'offline':False,'latency':150,'downloadThroughput':200*1024,'uploadThroughput':100*1024})
    slowpage.goto(BASE,wait_until='networkidle');check('slow-network page readable',slowpage.locator('h1').is_visible())
    slowpage.locator('[data-source="1"]').click();check('slow-network explorer usable',slowpage.locator('[data-source="1"]').get_attribute('aria-pressed')=='true')
    result['slow_network']={'latencyMs':150,'downloadBytesPerSecond':200*1024,'timing':slowpage.evaluate('performance.getEntriesByType("navigation")[0].toJSON()')}
    slow.close()
    check('zero script errors',not result['errors']);check('zero unexpected HTTP failures',not result['http_failures'])
    browser.close()

(ROOT/'docs/browser-results.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps({'passed':len(result['checks']),'viewport_route_combinations':len(result['viewports']),'script_errors':result['errors'],'http_failures':result['http_failures']},indent=2))
