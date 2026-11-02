from pathlib import Path
from playwright.sync_api import sync_playwright
import shutil, os
root=Path(__file__).resolve().parent.parent
out=root/'artifacts/motion';out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('BROWSER_EXECUTABLE','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'),headless=True)
    context=browser.new_context(viewport={'width':1440,'height':1000},record_video_dir=str(out),record_video_size={'width':1440,'height':1000})
    page=context.new_page();page.goto(os.environ.get('PORTFOLIO_TEST_URL','http://localhost:4173'),wait_until='domcontentloaded');page.wait_for_timeout(2200)
    for fraction in [0,.5,1]:
        page.locator('#untangle').evaluate('(e,f)=>scrollTo({top:scrollY+e.getBoundingClientRect().top+(e.offsetHeight-e.querySelector(".signature-stage").offsetHeight)*f-80,behavior:"smooth"})',fraction)
        page.wait_for_timeout(1600)
    def project(slug):
        page.locator('[data-project-link="'+slug+'"]').click();page.wait_for_timeout(1100)
    project('synora');page.locator('[data-memory="meeting"]').click();page.wait_for_timeout(300);page.locator('[data-memory="document"]').click();page.wait_for_timeout(900)
    project('contextguard');page.locator('[data-compare]').click();page.wait_for_timeout(700);page.locator('[data-clarify]').click();page.wait_for_timeout(1000)
    project('termwise');page.locator('[data-advance]').fill('70');page.wait_for_timeout(850);page.locator('[data-advance]').fill('10');page.wait_for_timeout(850)
    project('face-web-blockchain');page.locator('[data-tamper]').click();page.wait_for_timeout(1100)
    page.locator('#skills').evaluate('(e)=>scrollTo({top:scrollY+e.getBoundingClientRect().top-80,behavior:"smooth"})');page.wait_for_timeout(1100);page.locator('[data-skill-projects="face-web-blockchain"]').click();page.wait_for_timeout(850)
    page.locator('#about').evaluate('(e)=>scrollTo({top:scrollY+e.getBoundingClientRect().top-80,behavior:"smooth"})');page.wait_for_timeout(1400)
    page.keyboard.press('Control+k');page.wait_for_timeout(1100);page.keyboard.press('Escape')
    video=page.video;context.close();shutil.copy2(Path(video.path()),root/'motion-preview.webm');browser.close()
    print('Recorded Design.md walkthrough:',(root/'motion-preview.webm').stat().st_size,'bytes')
