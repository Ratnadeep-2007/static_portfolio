from pathlib import Path
from playwright.sync_api import sync_playwright

out=Path('public/assets/og');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless=True)
    page=browser.new_page(viewport={'width':1200,'height':630},device_scale_factor=1)
    for slug in ['home','synora','contextguard','termwise','face-web-blockchain']:
        page.goto(f'http://localhost:4173/assets/og/{slug}.svg',wait_until='load')
        page.screenshot(path=str(out/f'{slug}.png'))
    browser.close()
print('Generated 5 original 1200x630 social images from the project’s own SVG designs.')
