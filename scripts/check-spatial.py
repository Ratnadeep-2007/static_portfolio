"""Exercise the spatial redesign in a real browser and retain visual evidence."""
from pathlib import Path
from datetime import datetime, timezone
from playwright.sync_api import sync_playwright
import hashlib, json, os

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'docs/screenshots/spatial'
OUT.mkdir(parents=True, exist_ok=True)
BASE = os.environ.get('PORTFOLIO_TEST_URL', 'http://localhost:4173').rstrip('/')
EXECUTABLE = os.environ.get('BROWSER_EXECUTABLE', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe')
report = {'accessed': datetime.now(timezone.utc).isoformat(), 'base': BASE, 'checks': [], 'failures': [], 'errors': [], 'http_failures': [], 'screenshots': []}
projects = ['synora', 'contextguard', 'termwise', 'face-web-blockchain']


def check(name, condition):
    if condition:
        report['checks'].append(name)
    else:
        report['failures'].append(name)


def capture(page, name):
    page.screenshot(path=str(OUT / name))
    report['screenshots'].append('docs/screenshots/spatial/' + name)


def instant_scroll(page, selector, fraction=None):
    if fraction is None:
        page.locator(selector).evaluate('(el)=>scrollTo({top:el.getBoundingClientRect().top+scrollY-95,behavior:"instant"})')
    else:
        page.locator(selector).evaluate('(el,f)=>scrollTo({top:el.getBoundingClientRect().top+scrollY+(el.offsetHeight-el.querySelector(".story-stage").offsetHeight)*f,behavior:"instant"})', fraction)


def no_overflow(page):
    return page.evaluate('document.documentElement.scrollWidth <= innerWidth')


with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=EXECUTABLE, headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1)
    page = context.new_page()
    page.on('pageerror', lambda error: report['errors'].append(str(error)))
    page.on('response', lambda response: report['http_failures'].append({'url': response.url, 'status': response.status}) if response.status >= 400 else None)
    try:
        response = page.goto(BASE, wait_until='networkidle')
        check('homepage serves successfully', response.status == 200)
        page.wait_for_function("document.querySelector('[data-explorer]').dataset.sceneAssembled==='true'", timeout=25000)
        check('real WebGL composition completes its assembly', page.locator('.system-drawing canvas').count() == 1)
        canvas = page.locator('.system-drawing canvas')
        first = canvas.screenshot()
        page.wait_for_timeout(400)
        check('assembled scene continues to move visibly', first != canvas.screenshot())
        capture(page, 'hero-desktop.png')

        page.locator('[data-source="1"]').click()
        page.locator('[data-stage="2"]').click()
        check('selected source is reflected by spatial scene', page.locator('[data-explorer]').get_attribute('data-scene-source') == '1')
        check('decision stage is reflected by spatial scene', page.locator('[data-explorer]').get_attribute('data-scene-stage') == '2')
        check('native source control has a single selected option', page.locator('[data-source][aria-pressed="true"]').count() == 1)
        check('decision explanation retains its source citation', bool(page.locator('[data-citation]').inner_text().strip()))
        page.locator('.motion-toggle').click()
        check('pause control stops scene', page.locator('[data-explorer]').get_attribute('data-scene-paused') == 'true')
        stopped = canvas.screenshot()
        page.wait_for_timeout(250)
        check('paused WebGL pixels remain stable', stopped == canvas.screenshot())
        page.locator('[data-source="2"]').click()
        check('paused scene still responds to native selection', page.locator('[data-explorer]').get_attribute('data-scene-source') == '2')
        check('selection redraws paused scene', stopped != canvas.screenshot())
        page.locator('.motion-toggle').click()
        check('play control resumes scene', page.locator('[data-explorer]').get_attribute('data-scene-paused') == 'false')

        page.wait_for_selector('.scroll-story.is-story-ready')
        for phase, fraction in enumerate([0, .5, 1]):
            instant_scroll(page, '[data-scroll-story]', fraction)
            page.wait_for_function('(phase)=>document.querySelector("[data-scroll-story]").dataset.storyPhase===String(phase)', arg=phase)
            word = page.locator(f'.story-step[data-step="{phase}"] .story-word')
            check(f'scroll exposes {word.inner_text()} phase', word.is_visible() and word.evaluate('(el)=>Number(getComputedStyle(el.parentElement).opacity)>.85'))
            check(f'story phase {phase} does not overflow', no_overflow(page))
            capture(page, 'story-' + ['build', 'connect', 'automate'][phase] + '.png')

        for slug in projects:
            link = page.locator(f'[data-project-link="{slug}"]')
            link.click()
            page.wait_for_function('(slug)=>{const box=document.getElementById("project-"+slug).getBoundingClientRect();return box.top>=-20&&box.top<innerHeight*.7}', arg=slug)
            page.wait_for_function('(slug)=>document.querySelector(`[data-project-link="${slug}"]`).getAttribute("aria-current")==="true"', arg=slug)
            check(f'project index click lands on {slug}', page.url.endswith('#project-' + slug))
            check(f'project index identifies {slug}', link.get_attribute('aria-current') == 'true')
            page.wait_for_timeout(1450)
            capture(page, 'project-' + ('blockchain' if slug == 'face-web-blockchain' else slug) + '.png')

        signatures = []
        for slug in ['synora', 'contextguard', 'face-web-blockchain']:
            svg = page.locator(f'#project-{slug} .project-art svg')
            check(f'{slug} has conceptual artwork', svg.count() == 1 and bool(svg.locator('path').count()))
            signatures.append(svg.evaluate('(el)=>[...el.querySelectorAll("path")].map(p=>p.getAttribute("d")).join("|")'))
        check('three conceptual projects have distinct SVG geometry', len(set(signatures)) == 3)
        image = page.locator('#project-termwise .project-art img')
        image.scroll_into_view_if_needed()
        page.wait_for_function('document.querySelector("#project-termwise .project-art img").naturalWidth>0')
        check('TermWise artwork loads an actual interface image', image.get_attribute('src').endswith('termwise-overview.png') and 'Actual' in image.get_attribute('alt'))

        art = page.locator('#project-termwise .project-art')
        art.hover(position={'x': 50, 'y': 50})
        page.wait_for_timeout(500)
        transform = art.evaluate('(el)=>getComputedStyle(el).transform')
        check('project artwork physically tilts on pointer movement', transform not in ['none', 'matrix(1, 0, 0, 1, 0, 0)'])
        page.mouse.move(5, 5)
        page.wait_for_timeout(600)
        check('pointer leave resets artwork tilt', not art.evaluate('(el)=>el.classList.contains("is-art-hovered")') and art.evaluate('(el)=>!el.style.getPropertyValue("--art-rotate-x")'))

        for width, height in [(320, 740), (390, 844), (768, 1024), (1024, 900), (1440, 900), (1920, 1080)]:
            page.set_viewport_size({'width': width, 'height': height})
            page.evaluate('scrollTo({top:0,behavior:"instant"})')
            page.wait_for_timeout(120)
            check(f'hero has no horizontal overflow at {width}', no_overflow(page))
            instant_scroll(page, '[data-scroll-story]', .5)
            page.wait_for_function('document.querySelector("[data-scroll-story]").dataset.storyPhase==="1"')
            check(f'story has no horizontal overflow at {width}', no_overflow(page))
            instant_scroll(page, '#project-contextguard')
            page.wait_for_timeout(100)
            check(f'project has no horizontal overflow at {width}', no_overflow(page))

        page.set_viewport_size({'width': 1440, 'height': 900})
        page.evaluate('scrollTo({top:0,behavior:"instant"})')
        page.wait_for_function('document.querySelector(".system-drawing canvas")')
        page.emulate_media(reduced_motion='reduce')
        page.wait_for_function('!document.querySelector(".system-drawing canvas")')
        check('reduced motion removes continuous WebGL scene', page.locator('.system-drawing canvas').count() == 0)
        check('reduced motion restores readable SVG', page.locator('.system-drawing>svg').evaluate('(el)=>getComputedStyle(el).opacity') == '1')
        check('reduced motion shows every story step', page.locator('.story-step').evaluate_all('(steps)=>steps.length===3&&steps.every(el=>getComputedStyle(el).opacity==="1")'))
        check('reduced motion removes sticky stage', page.locator('.story-stage').evaluate('(el)=>getComputedStyle(el).position') != 'sticky')
        check('reduced motion uses content height', page.locator('.scroll-story').evaluate('(el)=>el.offsetHeight<=el.querySelector(".story-stage").offsetHeight+2'))

        page.set_viewport_size({'width': 390, 'height': 844})
        page.emulate_media(reduced_motion='no-preference')
        page.goto(BASE, wait_until='networkidle')
        page.wait_for_timeout(1300)
        check('mobile keeps lightweight SVG fallback', page.locator('.system-drawing canvas').count() == 0)
        check('mobile name and social links remain visible', page.locator('h1').is_visible() and page.locator('.hero-socials a').count() == 2)
        capture(page, 'mobile.png')
        check('no browser runtime errors', not report['errors'])
        check('no failed HTTP resources', not report['http_failures'])
    except Exception as error:
        report['failures'].append(str(error))
    finally:
        context.close()
        browser.close()

target = ROOT / 'docs/spatial-results.json'
target.write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps({'passed': len(report['checks']), 'failures': report['failures'], 'errors': report['errors'], 'http_failures': report['http_failures']}))
if report['failures']:
    raise SystemExit(1)
