from pathlib import Path
from playwright.sync_api import sync_playwright
import json,statistics

root=Path(__file__).resolve().parent.parent
baseline=root/'dist/baseline-perf.html'
baseline.write_bytes((root/'docs/research/baseline-original.html').read_bytes())
report={'method':'Headless Edge, 1440x900, fresh context per sample, localhost uncompressed assets, 3 samples per version. No Lighthouse score is claimed.','samples':{}}
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless=True)
        for name,path in [('baseline','/baseline-perf.html'),('redesign','/')]:
            samples=[]
            for repeat in range(3):
                context=browser.new_context(viewport={'width':1440,'height':900})
                page=context.new_page()
                page.route('https://**/*',lambda route:route.abort())
                page.add_init_script('''window.__vitals={lcp:0,cls:0};try{new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__vitals.lcp=e.startTime)).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__vitals.cls+=e.value})).observe({type:'layout-shift',buffered:true});}catch{}''')
                page.goto('http://localhost:4173'+path,wait_until='networkidle')
                page.wait_for_timeout(700)
                cdp=context.new_cdp_session(page);cdp.send('Performance.enable')
                before={m['name']:m['value'] for m in cdp.send('Performance.getMetrics')['metrics']}
                page.wait_for_timeout(1000)
                after={m['name']:m['value'] for m in cdp.send('Performance.getMetrics')['metrics']}
                sample=page.evaluate('''()=>({domContentLoaded:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,load:performance.getEntriesByType('navigation')[0].loadEventEnd,fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime||0,lcp:window.__vitals.lcp,cls:window.__vitals.cls,transferBytes:performance.getEntriesByType('navigation')[0].transferSize+performance.getEntriesByType('resource').reduce((sum,r)=>sum+r.transferSize,0),resourceCount:performance.getEntriesByType('resource').length})''')
                sample['idleScriptMsPerSecond']=(after.get('ScriptDuration',0)-before.get('ScriptDuration',0))*1000
                sample['idleTaskMsPerSecond']=(after.get('TaskDuration',0)-before.get('TaskDuration',0))*1000
                samples.append(sample);context.close()
            report['samples'][name]=samples
            report[name+'_median']={k:round(statistics.median(s[k] for s in samples),3) for k in samples[0]}
        browser.close()
finally:
    baseline.unlink(missing_ok=True)
(root/'docs/performance-results.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k.endswith('_median')},indent=2))
