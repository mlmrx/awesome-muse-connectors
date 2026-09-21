import {spawn} from 'node:child_process';
const child=spawn(process.execPath,['--import','./scripts/sites-env.mjs','./node_modules/wrangler/bin/wrangler.js','dev','--config','dist/server/wrangler.json','--local','--persist-to','.wrangler/state','--ip','127.0.0.1','--port','4173','--inspector-port','0'],{stdio:['ignore','pipe','pipe']});
let logs='';
try{await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('Worker startup timed out. '+logs.slice(-1800))),45000);const read=chunk=>{logs+=String(chunk);if(logs.includes('Ready on http://127.0.0.1:4173')){clearTimeout(timeout);resolve()}};child.stdout.on('data',read);child.stderr.on('data',read);child.once('exit',code=>{clearTimeout(timeout);reject(new Error('Worker exited: '+code+' '+logs.slice(-1800)))})});
 await import('./api-smoke.mjs');
 for(const [path,text] of [['/square','A little connection.'],['/town','Your agent can do more.'],['/studio','Build a bridge'],['/saved','Keep the useful things.']]){const r=await fetch('http://127.0.0.1:4173'+path);const html=await r.text();if(!r.ok||!html.includes(text))throw new Error(path+' render failed: '+r.status+' '+html.slice(0,100));console.log('PASS server render: '+path)}
}finally{child.kill('SIGTERM')}
