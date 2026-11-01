import { watch } from 'node:fs';
import { build,root } from './build.mjs';
import { serve } from './serve.mjs';
import { spawn } from 'node:child_process';

await build();
serve();
let timer,busy=false;
for(const directory of ['src','public']) watch(new URL('../'+directory+'/',import.meta.url),{recursive:true},()=>{
  clearTimeout(timer);
  timer=setTimeout(()=>{
    if(busy)return;busy=true;
    const child=spawn(process.execPath,['scripts/build.mjs'],{cwd:root,stdio:'inherit'});
    child.on('exit',()=>{busy=false;});
  },150);
});
