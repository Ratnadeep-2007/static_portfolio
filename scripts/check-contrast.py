import json,urllib.request
pairs=[('#F5F1EA','#171614'),('#AAA399','#171614'),('#DBA77A','#171614'),('#625B52','#EEE9E1'),('#765338','#EEE9E1'),('#11100F','#DBA77A')]
def luminance(v):
    rgb=[int(v[i:i+2],16)/255 for i in [1,3,5]]
    rgb=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in rgb]
    return sum(x*w for x,w in zip(rgb,[.2126,.7152,.0722]))
ratios=[{'foreground':a,'background':b,'ratio':round((max(luminance(a),luminance(b))+.05)/(min(luminance(a),luminance(b))+.05),2)} for a,b in pairs]
print(json.dumps(ratios))
assert all(r['ratio']>=4.5 for r in ratios)
open('docs/contrast-results.json','w').write(json.dumps(ratios,indent=2))
with urllib.request.urlopen('http://127.0.0.1:4181') as r:print('DEV_SERVER',r.status)
