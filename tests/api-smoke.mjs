// Local-only integration test. Never accepts an internet host or production URL.
import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const url=new URL(base);if(!['127.0.0.1','localhost'].includes(url.hostname))throw new Error('This test is restricted to a local development server.');
const owner='integration-owner-'+Date.now(),other='integration-other-'+Date.now();
async function call(path,{method='GET',data,user,origin=base}={}){const headers={};if(path==='/api/mcp'){headers['MCP-Protocol-Version']='2025-06-18';headers.Accept='application/json, text/event-stream'}if(data!==undefined)headers['Content-Type']='application/json';if(method!=='GET')headers.Origin=origin;if(user){headers['oai-authenticated-user-id']=user;headers['oai-authenticated-user-email']='local-test@example.invalid'}const r=await fetch(base+path,{method,headers,body:data===undefined?undefined:JSON.stringify(data)});const text=await r.text();return {status:r.status,data:text?JSON.parse(text):null}}
const workflow={kind:'workflow',title:'Integration test workflow',description:'A disposable local-only workflow for regression checks.',category:'Work',author:'Local test',body:'Prepare a meeting brief using only authorized documents.'};
let id,pending;
try{
 const anon=await call('/api/entries',{method:'POST',data:workflow});assert.equal(anon.status,401);
 const csrf=await call('/api/entries',{method:'POST',data:workflow,user:owner,origin:'https://unrelated.invalid'});assert.equal(csrf.status,403);
 const created=await call('/api/entries',{method:'POST',data:workflow,user:owner});assert.equal(created.status,201,JSON.stringify(created.data));id=created.data.id;
 const state=await call('/api/state',{user:owner});assert.equal(state.status,200);assert.equal(state.data.viewer.signedIn,true);assert.equal(state.data.entries.find(e=>e.id===id).owned,true);assert.ok(!JSON.stringify(state.data).includes('local-test@example.invalid'));
 for(let i=0;i<2;i++)assert.equal((await call('/api/interactions',{method:'PUT',user:owner,data:{entryId:id,type:'vote',active:true}})).status,200);
 assert.equal((await call('/api/state')).data.entries.find(e=>e.id===id).votes,1);
 await call('/api/interactions',{method:'PUT',user:owner,data:{entryId:id,type:'save',active:true}});
 assert.equal((await call('/api/state',{user:owner})).data.entries.find(e=>e.id===id).saved,true);
 assert.equal((await call('/api/state',{user:other})).data.entries.find(e=>e.id===id).saved,false);
 assert.equal((await call('/api/comments',{method:'POST',user:owner,data:{entryId:id,author:'Local test',body:'A useful test comment.'}})).status,201);
 assert.equal((await call('/api/comments?entryId='+id)).data.comments.length,1);
 assert.equal((await call('/api/entries',{method:'DELETE',user:other,data:{id}})).status,403);
 const c=await call('/api/entries',{method:'POST',user:owner,data:{...workflow,kind:'connector',protocol:'MCP',endpoint:'https://example.com/mcp',docsUrl:'https://example.com/docs',permissions:'Read-only example records.'}});assert.equal(c.status,201);pending=c.data.id;assert.equal(c.data.status,'pending');
 assert.equal((await call('/api/catalog')).data.items.some(e=>e.id===pending),false);
 assert.equal((await call('/api/state',{user:other})).data.entries.some(e=>e.id===pending),false);
 assert.equal((await call('/api/moderation',{method:'PUT',user:owner,data:{id:pending,status:'published'}})).status,403);
 const init=await call('/api/mcp',{method:'POST',data:{jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-06-18',capabilities:{},clientInfo:{name:'test',version:'1'}}}});assert.equal(init.data.result.protocolVersion,'2025-06-18');
 assert.equal((await call('/api/mcp',{method:'POST',data:{jsonrpc:'2.0',method:'notifications/initialized'}})).status,202);
 const tools=await call('/api/mcp',{method:'POST',data:{jsonrpc:'2.0',id:2,method:'tools/list'}});assert.equal(tools.data.result.tools.length,2);
 const tool=await call('/api/mcp',{method:'POST',data:{jsonrpc:'2.0',id:3,method:'tools/call',params:{name:'search_connectors',arguments:{query:'Notion'}}}});assert.equal(JSON.parse(tool.data.result.content[0].text).items[0].title,'Notion');
 const bad=await call('/api/mcp',{method:'POST',data:{jsonrpc:'2.0',id:4,method:'tools/call',params:{name:'search_connectors',arguments:{query:42}}}});assert.equal(bad.data.error.code,-32602);
 const denied=await call('/api/mcp',{method:'POST',origin:'https://unrelated.invalid',data:{jsonrpc:'2.0',id:5,method:'tools/list'}});assert.equal(denied.status,403);
 assert.equal((await call('/api/openapi')).data.openapi,'3.1.0');
 console.log('PASS: authentication, cross-origin rejection, persistent writes, ownership, private saves, idempotent votes, comments, pending visibility, moderation denial, OpenAPI, and MCP negotiation/tool/error paths.');
}finally{for(const entryId of [id,pending].filter(Boolean)){const r=await call('/api/entries',{method:'DELETE',user:owner,data:{id:entryId}});assert.equal(r.status,200,'Local test cleanup failed')}}
