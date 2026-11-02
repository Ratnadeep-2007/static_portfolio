import json,urllib.request
pairs=[('#F4EFFF','#08080B'),('#AAA1B8','#08080B'),('#B69BFF','#08080B'),('#B4A9C3','#0A0A0D'),('#F4EFFF','#19151F'),('#E7A676','#08080B'),('#EAE5F1','#4C3B60'),('#171021','#DEDCE3')]
def luminance(v):
    rgb=[int(v[i:i+2],16)/255 for i in [1,3,5]]
    rgb=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in rgb]
    return sum(x*w for x,w in zip(rgb,[.2126,.7152,.0722]))
ratios=[{'foreground':a,'background':b,'ratio':round((max(luminance(a),luminance(b))+.05)/(min(luminance(a),luminance(b))+.05),2)} for a,b in pairs]
print(json.dumps(ratios))
assert all(r['ratio']>=4.5 for r in ratios)
open('docs/contrast-results.json','w').write(json.dumps(ratios,indent=2))
