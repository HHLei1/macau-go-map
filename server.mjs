import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes,randomUUID,scryptSync,timingSafeEqual,createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';

const root=path.dirname(fileURLToPath(import.meta.url));
const publicDir=path.join(root,'dist');
const dataDir=process.env.GREEN_GO_DATA_DIR?path.resolve(process.env.GREEN_GO_DATA_DIR):path.join(root,'data');
const mediaDir=path.join(dataDir,'uploads');
fs.mkdirSync(mediaDir,{recursive:true});
const db=new DatabaseSync(path.join(dataDir,'green-go.sqlite'));
db.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;');
db.exec(`
 CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY CHECK(id=1),salt TEXT NOT NULL,hash TEXT NOT NULL,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY,expires_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS places (id TEXT PRIMARY KEY,name TEXT NOT NULL,en TEXT NOT NULL DEFAULT '',cat TEXT NOT NULL,area TEXT NOT NULL,address TEXT NOT NULL,lat REAL NOT NULL,lng REAL NOT NULL,tags TEXT NOT NULL DEFAULT '[]',description TEXT NOT NULL DEFAULT '',story TEXT NOT NULL DEFAULT '',hours TEXT NOT NULL DEFAULT '',phone TEXT NOT NULL DEFAULT '',image TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'draft',created_at TEXT NOT NULL,updated_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY,title TEXT NOT NULL,subtitle TEXT NOT NULL DEFAULT '',body TEXT NOT NULL DEFAULT '',category TEXT NOT NULL DEFAULT '',place_id TEXT,image TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'draft',created_at TEXT NOT NULL,updated_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS routes (id TEXT PRIMARY KEY,title TEXT NOT NULL,description TEXT NOT NULL DEFAULT '',category TEXT NOT NULL DEFAULT '',place_ids TEXT NOT NULL DEFAULT '[]',duration TEXT NOT NULL DEFAULT '',image TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'draft',created_at TEXT NOT NULL,updated_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS submissions (id TEXT PRIMARY KEY,type TEXT NOT NULL,name TEXT NOT NULL,area TEXT NOT NULL DEFAULT '',address TEXT NOT NULL DEFAULT '',tags TEXT NOT NULL DEFAULT '[]',description TEXT NOT NULL DEFAULT '',contact TEXT NOT NULL DEFAULT '',image TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL,updated_at TEXT NOT NULL);
 CREATE INDEX IF NOT EXISTS places_status_idx ON places(status,cat,area);
 CREATE INDEX IF NOT EXISTS articles_status_idx ON articles(status,created_at);
 CREATE INDEX IF NOT EXISTS routes_status_idx ON routes(status);
 CREATE INDEX IF NOT EXISTS submissions_status_idx ON submissions(status,created_at);
`);
const now=()=>new Date().toISOString();
if(db.prepare('SELECT COUNT(*) AS count FROM places').get().count===0&&db.prepare('SELECT COUNT(*) AS count FROM routes').get().count===0&&db.prepare('SELECT COUNT(*) AS count FROM articles').get().count===0&&!db.prepare('SELECT id FROM admin WHERE id=1').get()){
  const seed=JSON.parse(fs.readFileSync(path.join(root,'data','seed.json'),'utf8'));
  const addPlace=db.prepare(`INSERT INTO places(id,name,en,cat,area,address,lat,lng,tags,description,story,hours,phone,image,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
  const addRoute=db.prepare(`INSERT INTO routes(id,title,description,category,place_ids,duration,image,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)`);
  const addArticle=db.prepare(`INSERT INTO articles(id,title,subtitle,body,category,place_id,image,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)`);
  const stamp=now();
  for(const p of seed.places)addPlace.run(p.id,p.name,p.en||'',p.cat,p.area,p.address,p.lat,p.lng,JSON.stringify(p.tags||[]),p.desc||'',p.story||'',p.hours||'',p.phone||'',p.img||'','published',stamp,stamp);
  for(const r of seed.routes)addRoute.run(r.id,r.n,r.text,r.cat,JSON.stringify(r.ids||[]),r.time||'','','published',stamp,stamp);
  for(const s of seed.stories){const place=seed.places.find(p=>p.id===s.id);addArticle.run(`story-${s.id}`,s.n,s.sub,place?.story||s.sub,s.tag,s.id,s.img||'','published',stamp,stamp)}
}

const PORT=Number(process.env.PORT||8765);
const HOST=process.env.HOST||'127.0.0.1';
const attempts=new Map();
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};
const send=(res,status,data,headers={})=>{const body=typeof data==='string'?data:JSON.stringify(data);res.writeHead(status,{'Content-Type':typeof data==='string'?'text/plain; charset=utf-8':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers});res.end(body)};
const fail=(res,status,message)=>send(res,status,{error:message});
function readBody(req,limit=1_000_000){return new Promise((resolve,reject)=>{let size=0,chunks=[];req.on('data',c=>{size+=c.length;if(size>limit){reject(Object.assign(new Error('檔案或資料過大'),{status:413}));req.destroy()}else chunks.push(c)});req.on('end',()=>resolve(Buffer.concat(chunks)));req.on('error',reject)})}
function bodyJSON(req){return readBody(req).then(buf=>{try{return JSON.parse(buf.toString('utf8'))}catch{throw Object.assign(new Error('資料格式不正確'),{status:400})}})}
const text=(v,max=1000)=>String(v??'').replace(/[<>"']/g,'').trim().slice(0,max);
const imagePath=v=>{const value=text(v,500);return /^(assets\/[\w.-]+\.(?:png|jpg|jpeg|webp)|\/media\/[a-f0-9-]+\.(?:png|jpg|webp))$/i.test(value)?value:''};
const arr=v=>Array.isArray(v)?v.map(x=>text(x,70)).filter(Boolean).slice(0,12):[];
const strJSON=v=>{try{return JSON.parse(v||'[]')}catch{return []}};
const placeOut=p=>({id:p.id,name:p.name,en:p.en,cat:p.cat,area:p.area,address:p.address,lat:p.lat,lng:p.lng,tags:strJSON(p.tags),desc:p.description,story:p.story,hours:p.hours,phone:p.phone,img:p.image,status:p.status,created_at:p.created_at,updated_at:p.updated_at});
const articleOut=a=>({id:a.id,title:a.title,subtitle:a.subtitle,body:a.body,category:a.category,place_id:a.place_id,img:a.image,status:a.status,created_at:a.created_at,updated_at:a.updated_at});
const routeOut=r=>({id:r.id,n:r.title,text:r.description,cat:r.category,ids:strJSON(r.place_ids),time:r.duration,img:r.image,status:r.status,created_at:r.created_at,updated_at:r.updated_at});
const submissionOut=s=>({...s,tags:strJSON(s.tags)});
const hash=v=>createHash('sha256').update(v).digest('hex');
const same=(a,b)=>{const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)};
function authenticated(req){const match=(req.headers.cookie||'').match(/(?:^|; )gg_session=([^;]+)/);if(!match)return false;const token=decodeURIComponent(match[1]);const session=db.prepare('SELECT expires_at FROM sessions WHERE token_hash=?').get(hash(token));return !!session&&session.expires_at>Date.now()}
function setSession(res,token){res.setHeader('Set-Cookie',`gg_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800`)}
function noSession(res){res.setHeader('Set-Cookie','gg_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0')}
function checkOrigin(req){if(!['POST','PUT','PATCH','DELETE'].includes(req.method))return true;const origin=req.headers.origin;if(!origin)return false;try{return new URL(origin).host===req.headers.host}catch{return false}}
function isLoopback(req){return ['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress)}
function validatePlace(p){const name=text(p.name,120),cat=text(p.cat,30),area=text(p.area,50),address=text(p.address,200),lat=Number(p.lat),lng=Number(p.lng);if(!name||!cat||!area||!address||!Number.isFinite(lat)||!Number.isFinite(lng)||lat<22||lat>22.25||lng<113.45||lng>113.65)throw Object.assign(new Error('請填寫名稱、分類、地區、地址，並在澳門範圍內選擇標點'),{status:400});return {name,en:text(p.en,120),cat,area,address,lat,lng,tags:JSON.stringify(arr(p.tags)),description:text(p.desc,500),story:text(p.story,10000),hours:text(p.hours,100),phone:text(p.phone,100),image:imagePath(p.img)||'assets/macau-waterfront.png',status:p.status==='published'?'published':'draft'}}
function validateArticle(a){const title=text(a.title,160);if(!title)throw Object.assign(new Error('請填寫文章標題'),{status:400});return {title,subtitle:text(a.subtitle,300),body:text(a.body,40000),category:text(a.category,50),place_id:text(a.place_id,80)||null,image:imagePath(a.img),status:a.status==='published'?'published':'draft'}}
function validateRoute(r){const title=text(r.n||r.title,160);if(!title)throw Object.assign(new Error('請填寫路線名稱'),{status:400});return {title,description:text(r.text||r.description,1000),category:text(r.cat||r.category,60),place_ids:JSON.stringify(arr(r.ids||r.place_ids)),duration:text(r.time||r.duration,80),image:imagePath(r.img||r.image),status:r.status==='published'?'published':'draft'}}
async function saveRecord(req,res,kind,id){const input=await bodyJSON(req),stamp=now(),creating=req.method==='POST',recordId=creating?randomUUID():id;if(!recordId)return fail(res,400,'缺少資料 ID');
  if(kind==='places'){const p=validatePlace(input);if(creating)db.prepare(`INSERT INTO places(id,name,en,cat,area,address,lat,lng,tags,description,story,hours,phone,image,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(recordId,p.name,p.en,p.cat,p.area,p.address,p.lat,p.lng,p.tags,p.description,p.story,p.hours,p.phone,p.image,p.status,stamp,stamp);else{const result=db.prepare(`UPDATE places SET name=?,en=?,cat=?,area=?,address=?,lat=?,lng=?,tags=?,description=?,story=?,hours=?,phone=?,image=?,status=?,updated_at=? WHERE id=?`).run(p.name,p.en,p.cat,p.area,p.address,p.lat,p.lng,p.tags,p.description,p.story,p.hours,p.phone,p.image,p.status,stamp,recordId);if(!result.changes)return fail(res,404,'找不到這個地點')}return send(res,creating?201:200,placeOut(db.prepare('SELECT * FROM places WHERE id=?').get(recordId)))}
  if(kind==='articles'){const a=validateArticle(input);if(creating)db.prepare(`INSERT INTO articles(id,title,subtitle,body,category,place_id,image,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)`).run(recordId,a.title,a.subtitle,a.body,a.category,a.place_id,a.image,a.status,stamp,stamp);else{const result=db.prepare(`UPDATE articles SET title=?,subtitle=?,body=?,category=?,place_id=?,image=?,status=?,updated_at=? WHERE id=?`).run(a.title,a.subtitle,a.body,a.category,a.place_id,a.image,a.status,stamp,recordId);if(!result.changes)return fail(res,404,'找不到這篇文章')}return send(res,creating?201:200,articleOut(db.prepare('SELECT * FROM articles WHERE id=?').get(recordId)))}
  if(kind==='routes'){const r=validateRoute(input);if(creating)db.prepare(`INSERT INTO routes(id,title,description,category,place_ids,duration,image,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)`).run(recordId,r.title,r.description,r.category,r.place_ids,r.duration,r.image,r.status,stamp,stamp);else{const result=db.prepare(`UPDATE routes SET title=?,description=?,category=?,place_ids=?,duration=?,image=?,status=?,updated_at=? WHERE id=?`).run(r.title,r.description,r.category,r.place_ids,r.duration,r.image,r.status,stamp,recordId);if(!result.changes)return fail(res,404,'找不到這條路線')}return send(res,creating?201:200,routeOut(db.prepare('SELECT * FROM routes WHERE id=?').get(recordId)))}
  return fail(res,404,'不支援此資料類型')}
async function upload(req,res,isAdmin){const publicSubmission=new URL(req.url,`http://${req.headers.host}`).searchParams.get('type')==='submission';if(!isAdmin&&!publicSubmission)return fail(res,401,'請先登入');const type=req.headers['content-type']||'';if(!['image/jpeg','image/png','image/webp'].includes(type))return fail(res,415,'只接受 JPG、PNG 或 WebP 圖片');const buf=await readBody(req,5_000_000);if(!buf.length)return fail(res,400,'沒有收到圖片');const png=buf.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),jpg=buf[0]===255&&buf[1]===216&&buf[2]===255,webp=buf.toString('ascii',0,4)==='RIFF'&&buf.toString('ascii',8,12)==='WEBP';if(!((type==='image/png'&&png)||(type==='image/jpeg'&&jpg)||(type==='image/webp'&&webp)))return fail(res,415,'圖片格式與檔案內容不符');const ext=png?'png':jpg?'jpg':'webp',name=`${randomUUID()}.${ext}`;await fsp.writeFile(path.join(mediaDir,name),buf,{flag:'wx'});send(res,201,{url:`/media/${name}`})}
async function handler(req,res){const url=new URL(req.url,`http://${req.headers.host}`),pathname=url.pathname;try{
  if(pathname.startsWith('/api/')&&!checkOrigin(req))return fail(res,403,'請從本站頁面提交資料');
  if(pathname==='/api/health')return send(res,200,{ok:true});
  if(pathname==='/api/config'&&req.method==='GET')return send(res,200,{turnstileSiteKey:'',maptilerKey:process.env.MAPTILER_KEY||''});
  if(pathname==='/api/places'&&req.method==='GET')return send(res,200,db.prepare("SELECT * FROM places WHERE status='published' ORDER BY updated_at DESC").all().map(placeOut));
  if(pathname==='/api/articles'&&req.method==='GET')return send(res,200,db.prepare("SELECT * FROM articles WHERE status='published' ORDER BY updated_at DESC").all().map(articleOut));
  if(pathname==='/api/routes'&&req.method==='GET')return send(res,200,db.prepare("SELECT * FROM routes WHERE status='published' ORDER BY updated_at DESC").all().map(routeOut));
  if(pathname==='/api/submissions'&&req.method==='POST'){const p=await bodyJSON(req),name=text(p.name,120),type=text(p.type,60),description=text(p.description,4000);if(!name||!type||!description)return fail(res,400,'請填寫類型、名稱與推薦理由');const id=randomUUID(),stamp=now();db.prepare(`INSERT INTO submissions(id,type,name,area,address,tags,description,contact,image,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`).run(id,type,name,text(p.area,50),text(p.address,200),JSON.stringify(arr(p.tags)),description,text(p.contact,200),text(p.image,500),'pending',stamp,stamp);return send(res,201,{id,status:'pending'})}
  if(pathname==='/api/admin/me'&&req.method==='GET')return send(res,200,{authenticated:authenticated(req),needsSetup:!db.prepare('SELECT id FROM admin WHERE id=1').get()});
  if(pathname==='/api/admin/setup'&&req.method==='POST'){if(!isLoopback(req)||db.prepare('SELECT id FROM admin WHERE id=1').get())return fail(res,403,'首次設定只限本機');const p=await bodyJSON(req),password=String(p.password||'');if(password.length<12)return fail(res,400,'密碼至少需要 12 個字元');const salt=randomBytes(24).toString('hex'),passwordHash=scryptSync(password,salt,64).toString('hex');db.prepare('INSERT INTO admin(id,salt,hash,created_at) VALUES(1,?,?,?)').run(salt,passwordHash,now());const token=randomBytes(32).toString('hex');db.prepare('INSERT INTO sessions(token_hash,expires_at) VALUES(?,?)').run(hash(token),Date.now()+604800000);setSession(res,token);return send(res,201,{authenticated:true})}
  if(pathname==='/api/admin/login'&&req.method==='POST'){const key=req.socket.remoteAddress||'local',recent=(attempts.get(key)||[]).filter(t=>t>Date.now()-600000);if(recent.length>=8)return fail(res,429,'登入嘗試過多，請稍後再試');const p=await bodyJSON(req),admin=db.prepare('SELECT * FROM admin WHERE id=1').get();if(!admin)return fail(res,400,'請先建立管理員密碼');const candidate=scryptSync(String(p.password||''),admin.salt,64).toString('hex');if(!same(candidate,admin.hash)){recent.push(Date.now());attempts.set(key,recent);return fail(res,401,'密碼不正確')}attempts.delete(key);const token=randomBytes(32).toString('hex');db.prepare('INSERT INTO sessions(token_hash,expires_at) VALUES(?,?)').run(hash(token),Date.now()+604800000);setSession(res,token);return send(res,200,{authenticated:true})}
  if(pathname==='/api/admin/logout'&&req.method==='POST'){const match=(req.headers.cookie||'').match(/(?:^|; )gg_session=([^;]+)/);if(match)db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hash(decodeURIComponent(match[1])));noSession(res);return send(res,200,{authenticated:false})}
  if(pathname==='/api/upload'&&req.method==='POST')return upload(req,res,authenticated(req));
  if(pathname.startsWith('/api/admin/')){
    if(!authenticated(req))return fail(res,401,'請先登入後台');
    const parts=pathname.split('/').filter(Boolean),kind=parts[2],id=parts[3];
    if(['places','articles','routes'].includes(kind)){
      if(req.method==='GET'&&!id){const rows=db.prepare(`SELECT * FROM ${kind} ORDER BY updated_at DESC`).all();return send(res,200,rows.map(kind==='places'?placeOut:kind==='articles'?articleOut:routeOut))}
      if(req.method==='POST'||req.method==='PUT')return saveRecord(req,res,kind,id);
      if(req.method==='DELETE'&&id){const result=db.prepare(`DELETE FROM ${kind} WHERE id=?`).run(id);return result.changes?send(res,200,{deleted:true}):fail(res,404,'找不到資料')}
    }
    if(kind==='submissions'){
      if(req.method==='GET'&&!id)return send(res,200,db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all().map(submissionOut));
      if(req.method==='PUT'&&id){const p=await bodyJSON(req),status=['pending','approved','rejected'].includes(p.status)?p.status:null;if(!status)return fail(res,400,'狀態無效');const result=db.prepare('UPDATE submissions SET status=?,updated_at=? WHERE id=?').run(status,now(),id);return result.changes?send(res,200,submissionOut(db.prepare('SELECT * FROM submissions WHERE id=?').get(id))):fail(res,404,'找不到投稿')}
    }
  }
  if(pathname.startsWith('/media/')){const name=path.basename(pathname);if(name!==pathname.slice('/media/'.length)||!/^[-a-f0-9]+\.(png|jpg|webp)$/.test(name))return fail(res,404,'找不到圖片');const file=path.join(mediaDir,name);try{const stat=await fsp.stat(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)],'Content-Length':stat.size,'Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'});return fs.createReadStream(file).pipe(res)}catch{return fail(res,404,'找不到圖片')}}
  if(req.method!=='GET'&&req.method!=='HEAD')return fail(res,405,'不支援此請求');
  const requested=pathname==='/'?'/index.html':pathname;const file=path.resolve(publicDir,'.'+decodeURIComponent(requested));if(!file.startsWith(publicDir+path.sep))return fail(res,403,'無法存取');let stat;try{stat=await fsp.stat(file)}catch{return fail(res,404,'找不到頁面')}if(!stat.isFile())return fail(res,404,'找不到頁面');res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});if(req.method==='HEAD')return res.end();fs.createReadStream(file).pipe(res);
 }catch(error){if(!res.headersSent)fail(res,error.status||500,error.status?error.message:'伺服器暫時無法處理，請稍後重試');console.error(error)}}

const server=http.createServer(handler);
server.listen(PORT,HOST,()=>console.log(`Green GO local server: http://${HOST}:${PORT}/`));
