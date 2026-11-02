import { escape } from './html.mjs';

const text = (x,y,value,size=18,fill='#e8dfd2',extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${escape(value)}</text>`;
const box = (x,y,w,h,label,note='',accent='#DBA77A') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#29241e" stroke="${accent}" stroke-width="1.3"/>${text(x+17,y+33,label,20)}${note?text(x+17,y+56,note,11,'#b3a593'):''}`;

export function projectDiagram(p) {
  let graph='';
  const line=(d,cls='')=>`<path d="${d}" fill="none" stroke="${p.color}" stroke-width="1.5" ${cls.replaceAll('${p.id}',p.id)}/>`;
  if(p.id==='synora') {
    graph=box(65,168,205,62,'Meet transcripts','SOURCE ADAPTER',p.color)+box(65,255,205,62,'WhatsApp messages','SOURCE ADAPTER',p.color)+box(65,342,205,62,'Manual uploads','SOURCE ADAPTER',p.color)
      +line('M270 199h55v87h45M270 286h100M270 373h55v-87')
      +box(370,245,210,83,'Project memory','EVIDENCE + CONTEXT',p.color)
      +line('M580 286h65', 'marker-end="url(#diagram-${p.id}-arrow)"')+box(655,245,240,83,'Project atlas','READ-ONLY VISUAL OUTPUT',p.color)
      +line('M775 328v85H475v-85','stroke-dasharray="4 5"')+text(570,399,'SOURCE LINKS RETAINED',11,'#a99b8a');
  } else if(p.id==='contextguard') {
    graph=box(65,185,215,70,'Decision + sources','GOAL / DOCUMENTS',p.color)+line('M280 220h55','marker-end="url(#diagram-${p.id}-arrow)"')
      +box(345,185,260,70,'Evidence-linked findings','REVIEW / VERIFY CITATIONS',p.color)+line('M605 220h55','marker-end="url(#diagram-${p.id}-arrow)"')
      +box(670,185,225,70,'Kickoff brief','OPEN QUESTIONS INCLUDED',p.color)
      +line('M475 255v75')+box(345,330,260,70,'Clarification history','USER DECISIONS / PROJECT MEMORY',p.color)
      +line('M345 365H180V255','stroke-dasharray="4 5"')+line('M605 365H782V255','stroke-dasharray="4 5"');
  } else if(p.id==='termwise') {
    graph=box(65,195,220,80,'Review source terms','CONFIRM INPUTS',p.color)+line('M285 235h50','marker-end="url(#diagram-${p.id}-arrow)"')
      +box(345,195,250,80,'Decimal event ledger','OUTGOING BEFORE INCOMING',p.color)+line('M595 235h55','marker-end="url(#diagram-${p.id}-arrow)"')
      +box(660,195,235,80,'Compare scenarios','BOUNDED SEARCH',p.color)
      +line('M175 335h610')+text(65,343,'CASH',11,'#a99b8a')+line('M175 335l100-30 110 60 110-46 100 25 110-44 80 23')
      +text(175,397,'TIMELINE · CONCEPTUAL, NO FINANCIAL DATA',11,'#a99b8a');
  } else {
    graph=box(65,176,360,70,'Embedding → candidate comparison','LOCAL FACE FEATURES / PUBLIC WEB DISCOVERY',p.color)
      +line('M425 211h70','marker-end="url(#diagram-${p.id}-arrow)"')+box(505,176,390,70,'Canonical payload → SHA-256','A REPRODUCIBLE CONTENT FINGERPRINT',p.color)
      +line('M700 246v70','marker-end="url(#diagram-${p.id}-arrow)"')+box(505,328,390,70,'Polygon Amoy registry','TESTNET · ONLY THE HASH GOES ON-CHAIN',p.color)
      +line('M505 363H245V246','stroke-dasharray="4 5"')+text(65,396,'RE-VERIFY CONTENT INTEGRITY',11,'#a99b8a');
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 520" width="960" height="520" role="img" aria-labelledby="diagram-${p.id}-title diagram-${p.id}-desc"><title id="diagram-${p.id}-title">${escape(p.name)} architecture</title><desc id="diagram-${p.id}-desc">Conceptual architecture: ${escape(p.architecture.join(' to '))}. Based on the public project README.</desc><defs><marker id="diagram-${p.id}-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1 8 5 1 9" fill="none" stroke="${p.color}" stroke-width="1.2"/></marker></defs><rect width="960" height="520" fill="#15101f"/><g font-family="Arial,sans-serif">${text(64,52,p.index+' / '+p.name.toUpperCase(),13,p.color)}${text(64,101,p.short,36)}<path d="M64 126h832M64 454h832" stroke="#514538" stroke-width="1"/>${graph}${text(64,486,'CONCEPTUAL SYSTEM DIAGRAM',10,'#ae9f8b')}${text(896,486,'STUDY / '+p.index,10,p.color,'text-anchor="end"')}</g></svg>`;
}

export function ogDiagram(id,title,subtitle) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#09070d"/><path d="M70 120h1060M70 550h1060" stroke="#30263e"/><g font-family="Arial,sans-serif"><text x="70" y="87" fill="#b69bff" font-size="19">RATNADEEP PATIL / ENGINEERING STUDIES</text><text x="65" y="280" fill="#f4efff" font-size="${title.length>24?54:85}" letter-spacing="-3">${escape(title)}</text><text x="70" y="360" fill="#c8bcae" font-size="27">${escape(subtitle)}</text><text x="70" y="588" fill="#b69bff" font-size="15">AI / ML &amp; AGENTIC DEVELOPMENT</text><text x="1130" y="588" fill="#c8bcae" font-size="15" text-anchor="end">${id.toUpperCase()}</text></g></svg>`;
}
