// Clean Windows runner smoke test; never contains owner credentials or tools.
import {spawn} from 'node:child_process';import {readFileSync,writeFileSync,existsSync} from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=path.join(process.env.LOCALAPPDATA,'Programs/CavegameReborn'),base='http://127.0.0.1:33942',game='http://127.0.0.1:33944',env={...process.env,CAVEGAME_CLIENT_PORT:'33942',CAVEGAME_GAME_PORT:'33944'};
const pause=ms=>new Promise(r=>setTimeout(r,ms)),steps=[];let nonce,identity;
async function until(check){for(let i=0;i<180;i++){try{const v=await check();if(v)return v;}catch{}await pause(1000);}throw Error('Installed player startup timed out.');}
async function request(route,body){const r=await fetch(base+route,{method:body?'POST':'GET',headers:{'Content-Type':'application/json','x-reborn-launcher':nonce??''},body:body?JSON.stringify(body):undefined});const result=await r.json();if(!r.ok)throw Error(result.error);return result;}
async function launch(){spawn(path.join(root,'Cavegame Reborn.exe'),['--no-browser'],{env,windowsHide:true,stdio:'ignore'});await until(async()=>{const h=await request('/health');return h.clientOnly&&h;});const html=await(await fetch(base)).text(),c=JSON.parse(html.match(/window.RebornLauncher=(.*?);<\/script>/s)[1]);nonce=c.nonce;return c;}
try{
 let config=await launch();identity=config.identityId;assert.match(identity,/^r_[a-f0-9]{48}$/);steps.push('Actual installed native EXE starts bundled runtime and creates DPAPI identity');
 if(!process.argv.includes('--offline-smoke')){
 const nickname='AlphaCI_'+Math.random().toString(16).slice(2,8),result=await request('/launcher/connect',{nickname});assert.equal(result.account.developer,false);assert.equal(result.account.id,identity);
 const page=await(await fetch(game+'/play')).text();assert.ok(page.includes('window.RebornOnline='));assert.ok(!page.includes('/creative.js'));assert.ok(!page.includes('/worldedit.js'));assert.equal((await fetch(game+'/asset/scaled/pick_wood.png')).status,200);assert.equal((await fetch(game+'/worldedit.js')).status,404);steps.push('Official HTTPS login succeeds as normal player; game and tool sprites load; developer assets absent');
 assert.equal((await fetch(game+'/launcher/recovery/export',{method:'POST',headers:{Origin:game},body:'{}'})).status,403);steps.push('Game origin cannot export identity keys');
 }
 await request('/launcher/quit',{});await pause(1500);config=await launch();assert.equal(config.identityId,identity);steps.push('Close/reopen preserves protected identity');
 await request('/launcher/quit',{});await pause(1500);
 writeFileSync('player-acceptance.json',JSON.stringify({passed:true,steps,identityCreated:true,remoteLogin:!process.argv.includes('--offline-smoke'),actualBrowserRenderVerified:false,notYetVerified:['Official server login and browser gameplay while tunnel is offline','Interactive install UI on second physical PC','Browser movement/mining in installed alpha package','Real next-release update/rollback and post-update progress'],at:new Date().toISOString()},null,2));
}catch(error){writeFileSync('player-acceptance.json',JSON.stringify({passed:false,steps,error:error.message}));try{await request('/launcher/quit',{});}catch{}throw error;}
