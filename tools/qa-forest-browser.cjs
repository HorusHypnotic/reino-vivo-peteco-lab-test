#!/usr/bin/env node
'use strict';
// Standalone, dependency-free browser smoke for the V19 visual bench.
// Does not touch production, saves, external services, or GitHub Actions.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'qa','evidence');
const browser=process.env.CHROMIUM||['chromium','chromium-browser','google-chrome'].find(x=>cp.spawnSync(x,['--version'],{encoding:'utf8'}).status===0);
if(!browser){console.error('BLOCKED: Chromium not installed. Set CHROMIUM=/path/to/browser');process.exit(2)}
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.png':'image/png','.svg':'image/svg+xml','.css':'text/css'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
 const full=path.resolve(root,'.'+pathname);
 if(!full.startsWith(root+path.sep)){res.writeHead(403).end();return}
 fs.readFile(full,(err,data)=>{if(err){res.writeHead(404).end();return}res.writeHead(200,{'content-type':mime[path.extname(full)]||'application/octet-stream','cache-control':'no-store'});res.end(data)});
});
server.listen(0,'127.0.0.1',()=>{
 fs.mkdirSync(output,{recursive:true});
 const port=server.address().port,url='http://127.0.0.1:'+port+'/qa/forest-v19.html';
 const args=['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--hide-scrollbars','--window-size=560,1000','--virtual-time-budget=5000','--screenshot='+path.join(output,'forest-v19-browser.png'),'--dump-dom',url];
 const result=cp.spawnSync(browser,args,{encoding:'utf8',timeout:30000,maxBuffer:4*1024*1024});
 server.close();
 const dom=result.stdout||'';
 const evidence=path.join(output,'forest-v19-browser.png');
 const status=dom.match(/<p id="status"[^>]*>([^<]*)<\/p>/);
 const details=dom.match(/<pre id="details"[^>]*>([^<]*)<\/pre>/);
 const report={browser,exitCode:result.status,status:status&&status[1],details:details&&details[1],screenshot:fs.existsSync(evidence)?path.relative(root,evidence):null,validated:result.status===0&&!!status&&/Estado: tree/.test(status[1])&&!!details&&/Integridade: OK/.test(details[1])};
 fs.writeFileSync(path.join(output,'forest-v19-report.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
 if(!report.validated)process.exitCode=1;
});
