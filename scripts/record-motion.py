from pathlib import Path
from playwright.sync_api import sync_playwright
import shutil,os

root=Path(__file__).resolve().parent.parent
out=root/'artifacts/motion';out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('BROWSER_EXECUTABLE','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'),headless=True)
    context=browser.new_context(viewport={'width':1440,'height':900},device_scale_factor=1,record_video_dir=str(out),record_video_size={'width':1440,'height':900})
    page=context.new_page()
    page.goto(os.environ.get('PORTFOLIO_TEST_URL','http://localhost:4173'),wait_until='domcontentloaded')
    page.wait_for_timeout(2700)
    drawing=page.locator('.system-drawing').bounding_box()
    page.mouse.move(drawing['x']+60,drawing['y']+70)
    page.mouse.move(drawing['x']+drawing['width']-65,drawing['y']+180,steps=35)
    page.wait_for_timeout(700)
    page.locator('[data-source="1"]').click();page.wait_for_timeout(600)
    page.locator('[data-stage="1"]').click();page.wait_for_timeout(600)
    page.locator('[data-stage="2"]').click();page.wait_for_timeout(1600)
    for _ in range(5):page.mouse.wheel(0,180);page.wait_for_timeout(220)
    page.wait_for_timeout(1600)
    for _ in range(4):page.mouse.wheel(0,160);page.wait_for_timeout(220)
    page.wait_for_timeout(1600)
    for _ in range(5):page.mouse.wheel(0,200);page.wait_for_timeout(180)
    page.wait_for_timeout(1300)
    for _ in range(6):page.mouse.wheel(0,200);page.wait_for_timeout(180)
    page.wait_for_timeout(1200)
    page.locator('#contact').scroll_into_view_if_needed();page.wait_for_timeout(1400)
    video=page.video
    context.close()
    source=Path(video.path());target=root/'motion-preview.webm'
    shutil.copy2(source,target)
    browser.close()
    print('Recorded actual browser motion:',target,'bytes:',target.stat().st_size)
