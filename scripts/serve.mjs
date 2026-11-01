import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export function serve({port=Number(process.env.PORT || 4173),directory='dist'}={}) {
  const root=resolve(directory);
  const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.pdf':'application/pdf','.xml':'application/xml','.json':'application/json','.txt':'text/plain; charset=utf-8'};
  const server=createServer(async(req,res)=>{
    try {
      const url=new URL(req.url,'http://localhost');
      let path=resolve(root,'.'+decodeURIComponent(url.pathname));
      if(path!==root && !path.startsWith(root+sep)){res.writeHead(403);res.end('Forbidden');return;}
      let info=await stat(path).catch(()=>null);
      if(info?.isDirectory()) {
        if(!url.pathname.endsWith('/')) {res.writeHead(301,{Location:url.pathname+'/'+url.search});res.end();return;}
        path=join(path,'index.html');info=await stat(path).catch(()=>null);
      }
      const found=info?.isFile();
      const file=found?path:join(root,'404.html');
      const bytes=await readFile(file);
      res.writeHead(found?200:404,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
      res.end(req.method==='HEAD'?undefined:bytes);
    }catch{res.writeHead(500);res.end('Unable to serve this file.');}
  });
  server.listen(port,'127.0.0.1',()=>console.log(`Local: http://localhost:${port}`));
  return server;
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) serve();
