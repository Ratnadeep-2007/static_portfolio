import json,urllib.request
pairs=[('#F4EFFF','#09070D'),('#AAA1B8','#09070D'),('#B69BFF','#09070D'),('#B4A9C3','#0E0B14'),('#FFFFFF','#793ED2'),('#FFFFFF','#502180'),('#F4EFFF','#4B1D77'),('#FF9A52','#09070D'),('#171021','#EAE4F5')]
def luminance(v):
    rgb=[int(v[i:i+2],16)/255 for i in [1,3,5]]
    rgb=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in rgb]
    return sum(x*w for x,w in zip(rgb,[.2126,.7152,.0722]))
ratios=[{'foreground':a,'background':b,'ratio':round((max(luminance(a),luminance(b))+.05)/(min(luminance(a),luminance(b))+.05),2)} for a,b in pairs]
print(json.dumps(ratios))
assert all(r['ratio']>=4.5 for r in ratios)
open('docs/contrast-results.json','w').write(json.dumps(ratios,indent=2))
