// Reproduce the already-signed update from audited public player files.
import {readFileSync,readdirSync} from 'node:fs';import path from 'node:path';import {createHash,createPublicKey,verify} from 'node:crypto';
const manifest=JSON.parse(readFileSync('alpha/player-stable-next.json','utf8')),r=manifest.release,key=readFileSync('alpha/release-public.pem','utf8');
const {writeZip}=await import('../payload/versions/'+r.version+'/app/src/online/zip.mjs');
if(!verify(null,Buffer.from(JSON.stringify(r)),createPublicKey(key),Buffer.from(manifest.signature,'base64')))throw Error('Release signature rejected.');
const root=path.resolve('payload/versions',r.version);
for(const f of r.files){const b=readFileSync(path.join(root,f.path));if(b.length!==f.bytes||createHash('sha256').update(b).digest('hex')!==f.sha256)throw Error('File verification failed: '+f.path);}
function walk(d,p=''){return readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name),p+e.name+'/'):[{name:p+e.name,path:path.join(d,e.name)}]);}
const files=walk(root).filter(f=>f.name!=='trusted-release.json');writeZip(files,r.file);const b=readFileSync(r.file);if(b.length!==r.bytes||createHash('sha256').update(b).digest('hex')!==r.sha256)throw Error('Reproduced archive does not match signed artifact.');console.log('Signed update reproduced byte-for-byte without a private signing key.');