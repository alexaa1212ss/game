// Public build-stage helper. Produces an unsigned candidate; the private release
// signer stays on the developer PC and reviews the candidate before activation.
import {readFileSync,writeFileSync,statSync} from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const input=JSON.parse(readFileSync('alpha/build-input.json','utf8')),version=input.version,folder=path.resolve('payload/versions',version),manifest=JSON.parse(readFileSync('alpha/candidate-base.json','utf8'));
const {writeZip}=await import('../payload/versions/'+version+'/app/src/online/zip.mjs');
const hash=b=>createHash('sha256').update(b).digest('hex');
const files=manifest.release.files.map(f=>{const bytes=readFileSync(path.join(folder,f.path));if(!['runtime/node.exe','runtime/LICENSE'].includes(f.path)&&(bytes.length!==f.bytes||hash(bytes)!==f.sha256))throw Error('Audited player file changed: '+f.path);return {path:f.path,bytes:bytes.length,sha256:hash(bytes)};});
if(files.find(f=>f.path==='runtime/node.exe').sha256!=='ba93f9a70bd86fce3ebbb39ec758501458453467aa92a34a0a3602d1e3fc2b9c')throw Error('Current official runtime hash rejected.');
const archive='RebornClient-'+version+'.zip';writeZip(files.map(f=>({name:f.path,path:path.join(folder,f.path)})),archive);const bytes=readFileSync(archive);
writeFileSync('runtime-candidate.json',JSON.stringify({version,runtimeVersion:'24.22.0',file:archive,bytes:bytes.length,sha256:hash(bytes),files},null,2));
console.log('Unsigned runtime candidate: '+bytes.length+' bytes, '+hash(bytes));
