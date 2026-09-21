const JSON_HEADERS={"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"};
const encoder=new TextEncoder();
const now=()=>new Date().toISOString();
const clean=(value,max=1000)=>String(value??"").replace(/[<>"']/g,"").trim().slice(0,max);
const array=value=>Array.isArray(value)?value.map(item=>clean(item,70)).filter(Boolean).slice(0,12):[];
const parseArray=value=>{try{return JSON.parse(value||"[]")}catch{return []}};
const hex=bytes=>[...new Uint8Array(bytes)].map(byte=>byte.toString(16).padStart(2,"0")).join("");
const randomHex=(length=32)=>{const bytes=new Uint8Array(length);crypto.getRandomValues(bytes);return hex(bytes)};
const digest=async value=>hex(await crypto.subtle.digest("SHA-256",encoder.encode(value)));
const safeEqual=async(a,b)=>{const [x,y]=await Promise.all([digest(a),digest(b)]);let different=x.length^y.length;for(let i=0;i<Math.max(x.length,y.length);i++)different|=(x.charCodeAt(i)||0)^(y.charCodeAt(i)||0);return different===0};

function json(data,status=200,headers={}){return new Response(JSON.stringify(data),{status,headers:{...JSON_HEADERS,...headers}})}
const error=(message,status=400)=>json({error:message},status);
function cookie(request,name){const match=(request.headers.get("cookie")||"").match(new RegExp(`(?:^|; )${name}=([^;]+)`));return match?decodeURIComponent(match[1]):""}
function sessionCookie(token,request){const secure=new URL(request.url).protocol==="https:"?"; Secure":"";return `gg_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${secure}`}
function clearCookie(request){const secure=new URL(request.url).protocol==="https:"?"; Secure":"";return `gg_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`}
function sameOrigin(request){if(!["POST","PUT","PATCH","DELETE"].includes(request.method))return true;const origin=request.headers.get("origin");if(!origin)return false;try{return new URL(origin).origin===new URL(request.url).origin}catch{return false}}
async function bodyJSON(request){const size=Number(request.headers.get("content-length")||0);if(size>1_000_000)throw Object.assign(new Error("资料过大"),{status:413});try{return await request.json()}catch{throw Object.assign(new Error("资料格式不正确"),{status:400})}}
function imagePath(value){const path=clean(value,500);return /^(assets\/[\w.-]+\.(?:png|jpg|jpeg|webp)|\/media\/[a-f0-9-]+\.(?:png|jpg|webp))$/i.test(path)?path:""}

const placeOut=p=>({id:p.id,name:p.name,en:p.en,cat:p.cat,area:p.area,address:p.address,lat:p.lat,lng:p.lng,tags:parseArray(p.tags),desc:p.description,story:p.story,hours:p.hours,phone:p.phone,img:p.image,status:p.status,created_at:p.created_at,updated_at:p.updated_at});
const articleOut=a=>({id:a.id,title:a.title,subtitle:a.subtitle,body:a.body,category:a.category,place_id:a.place_id,img:a.image,status:a.status,created_at:a.created_at,updated_at:a.updated_at});
const routeOut=r=>({id:r.id,n:r.title,text:r.description,cat:r.category,ids:parseArray(r.place_ids),time:r.duration,img:r.image,status:r.status,created_at:r.created_at,updated_at:r.updated_at});
const submissionOut=s=>({...s,tags:parseArray(s.tags)});

function validatePlace(input){const name=clean(input.name,120),cat=clean(input.cat,30),area=clean(input.area,50),address=clean(input.address,200),lat=Number(input.lat),lng=Number(input.lng);if(!name||!cat||!area||!address||!Number.isFinite(lat)||!Number.isFinite(lng)||lat<22||lat>22.25||lng<113.45||lng>113.65)throw Object.assign(new Error("请填写名称、分类、地区、地址，并在澳门范围内选择标点"),{status:400});return{name,en:clean(input.en,120),cat,area,address,lat,lng,tags:JSON.stringify(array(input.tags)),description:clean(input.desc,500),story:clean(input.story,10000),hours:clean(input.hours,100),phone:clean(input.phone,100),image:imagePath(input.img)||"assets/macau-waterfront.png",status:input.status==="published"?"published":"draft"}}
function validateArticle(input){const title=clean(input.title,160);if(!title)throw Object.assign(new Error("请填写文章标题"),{status:400});return{title,subtitle:clean(input.subtitle,300),body:clean(input.body,40000),category:clean(input.category,50),place_id:clean(input.place_id,80)||null,image:imagePath(input.img),status:input.status==="published"?"published":"draft"}}
function validateRoute(input){const title=clean(input.n||input.title,160);if(!title)throw Object.assign(new Error("请填写路线名称"),{status:400});return{title,description:clean(input.text||input.description,1000),category:clean(input.cat||input.category,60),place_ids:JSON.stringify(array(input.ids||input.place_ids)),duration:clean(input.time||input.duration,80),image:imagePath(input.img||input.image),status:input.status==="published"?"published":"draft"}}

async function passwordHash(password,salt,pepper,iterations=10000){const material=await crypto.subtle.importKey("raw",encoder.encode(password+pepper),"PBKDF2",false,["deriveBits"]);return hex(await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:encoder.encode(salt),iterations},material,256))}
async function hmac(value,secret){const key=await crypto.subtle.importKey("raw",encoder.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);return hex(await crypto.subtle.sign("HMAC",key,encoder.encode(value)))}
async function validateTurnstile(token,request,env){if(!env.TURNSTILE_SECRET)return true;if(!token)return false;const response=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({secret:env.TURNSTILE_SECRET,response:token,remoteip:request.headers.get("cf-connecting-ip")||undefined})});const result=await response.json();return Boolean(result.success)}
async function uploadGrant(path,env){const expiry=Date.now()+15*60*1000;return `${expiry}.${await hmac(`${path}.${expiry}`,env.ADMIN_PEPPER)}`}
async function validUploadGrant(path,grant,env){const [expiry,signature]=String(grant||"").split(".");if(!expiry||!signature||Number(expiry)<Date.now())return false;return safeEqual(signature,await hmac(`${path}.${expiry}`,env.ADMIN_PEPPER))}
async function authenticated(request,env){const token=cookie(request,"gg_session");if(!token)return false;const row=await env.DB.prepare("SELECT expires_at FROM sessions WHERE token_hash=?").bind(await digest(token)).first();return Boolean(row&&row.expires_at>Date.now())}

async function saveRecord(request,env,kind,id){const input=await bodyJSON(request),stamp=now(),creating=request.method==="POST",recordId=creating?crypto.randomUUID():id;if(!recordId)return error("缺少资料 ID");
  if(kind==="places"){
    const p=validatePlace(input);
    if(creating)await env.DB.prepare("INSERT INTO places(id,name,en,cat,area,address,lat,lng,tags,description,story,hours,phone,image,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(recordId,p.name,p.en,p.cat,p.area,p.address,p.lat,p.lng,p.tags,p.description,p.story,p.hours,p.phone,p.image,p.status,stamp,stamp).run();
    else{const result=await env.DB.prepare("UPDATE places SET name=?,en=?,cat=?,area=?,address=?,lat=?,lng=?,tags=?,description=?,story=?,hours=?,phone=?,image=?,status=?,updated_at=? WHERE id=?").bind(p.name,p.en,p.cat,p.area,p.address,p.lat,p.lng,p.tags,p.description,p.story,p.hours,p.phone,p.image,p.status,stamp,recordId).run();if(!result.meta.changes)return error("找不到这个地点",404)}
    return json(placeOut(await env.DB.prepare("SELECT * FROM places WHERE id=?").bind(recordId).first()),creating?201:200);
  }
  if(kind==="articles"){
    const a=validateArticle(input);
    if(creating)await env.DB.prepare("INSERT INTO articles(id,title,subtitle,body,category,place_id,image,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)").bind(recordId,a.title,a.subtitle,a.body,a.category,a.place_id,a.image,a.status,stamp,stamp).run();
    else{const result=await env.DB.prepare("UPDATE articles SET title=?,subtitle=?,body=?,category=?,place_id=?,image=?,status=?,updated_at=? WHERE id=?").bind(a.title,a.subtitle,a.body,a.category,a.place_id,a.image,a.status,stamp,recordId).run();if(!result.meta.changes)return error("找不到这篇文章",404)}
    return json(articleOut(await env.DB.prepare("SELECT * FROM articles WHERE id=?").bind(recordId).first()),creating?201:200);
  }
  if(kind==="routes"){
    const r=validateRoute(input);
    if(creating)await env.DB.prepare("INSERT INTO routes(id,title,description,category,place_ids,duration,image,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)").bind(recordId,r.title,r.description,r.category,r.place_ids,r.duration,r.image,r.status,stamp,stamp).run();
    else{const result=await env.DB.prepare("UPDATE routes SET title=?,description=?,category=?,place_ids=?,duration=?,image=?,status=?,updated_at=? WHERE id=?").bind(r.title,r.description,r.category,r.place_ids,r.duration,r.image,r.status,stamp,recordId).run();if(!result.meta.changes)return error("找不到这条路线",404)}
    return json(routeOut(await env.DB.prepare("SELECT * FROM routes WHERE id=?").bind(recordId).first()),creating?201:200);
  }
  return error("不支持此资料类型",404);
}

async function upload(request,env,isAdmin){const publicSubmission=new URL(request.url).searchParams.get("type")==="submission";if(!isAdmin&&!publicSubmission)return error("请先登入",401);if(publicSubmission&&!env.ADMIN_PEPPER)return error("服务器尚未完成安全设定",503);if(publicSubmission&&env.TURNSTILE_SECRET&&!await validateTurnstile(request.headers.get("x-turnstile-token"),request,env))return error("请完成人机验证",403);const type=request.headers.get("content-type")||"";if(!["image/jpeg","image/png","image/webp"].includes(type))return error("只接受 JPG、PNG 或 WebP 图片",415);const declared=Number(request.headers.get("content-length")||0);if(declared>5_000_000)return error("图片不能超过 5 MB",413);const bytes=new Uint8Array(await request.arrayBuffer());if(!bytes.length)return error("没有收到图片");if(bytes.length>5_000_000)return error("图片不能超过 5 MB",413);const png=bytes.length>8&&[137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n),jpg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255,webp=new TextDecoder().decode(bytes.slice(0,4))==="RIFF"&&new TextDecoder().decode(bytes.slice(8,12))==="WEBP";if(!((type==="image/png"&&png)||(type==="image/jpeg"&&jpg)||(type==="image/webp"&&webp)))return error("图片格式与档案内容不符",415);const ext=png?"png":jpg?"jpg":"webp",key=`${crypto.randomUUID()}.${ext}`,url=`/media/${key}`;await env.MEDIA.put(key,bytes,{metadata:{contentType:type,source:publicSubmission?"submission":"admin"}});return json({url,uploadGrant:publicSubmission?await uploadGrant(url,env):undefined},201)}

async function api(request,env){const url=new URL(request.url),path=url.pathname;
  if(!sameOrigin(request))return error("请从本站页面提交资料",403);
  if(path==="/api/health")return json({ok:true,platform:"cloudflare"});
  if(path==="/api/config"&&request.method==="GET")return json({turnstileSiteKey:env.TURNSTILE_SITE_KEY||"",maptilerKey:env.MAPTILER_KEY||""});
  if(path==="/api/places"&&request.method==="GET"){const rows=await env.DB.prepare("SELECT * FROM places WHERE status='published' ORDER BY updated_at DESC").all();return json(rows.results.map(placeOut))}
  if(path==="/api/articles"&&request.method==="GET"){const rows=await env.DB.prepare("SELECT * FROM articles WHERE status='published' ORDER BY updated_at DESC").all();return json(rows.results.map(articleOut))}
  if(path==="/api/routes"&&request.method==="GET"){const rows=await env.DB.prepare("SELECT * FROM routes WHERE status='published' ORDER BY updated_at DESC").all();return json(rows.results.map(routeOut))}
  if(path==="/api/submissions"&&request.method==="POST"){const p=await bodyJSON(request),name=clean(p.name,120),type=clean(p.type,60),description=clean(p.description,4000),image=imagePath(p.image);if(!name||!type||!description)return error("请填写类型、名称与推荐理由");if(env.TURNSTILE_SECRET){const verified=image?await validUploadGrant(image,p.uploadGrant,env):await validateTurnstile(p.turnstileToken,request,env);if(!verified)return error("请完成人机验证",403)}const id=crypto.randomUUID(),stamp=now();await env.DB.prepare("INSERT INTO submissions(id,type,name,area,address,tags,description,contact,image,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)").bind(id,type,name,clean(p.area,50),clean(p.address,200),JSON.stringify(array(p.tags)),description,clean(p.contact,200),image,"pending",stamp,stamp).run();return json({id,status:"pending"},201)}

  const isAdmin=await authenticated(request,env);
  if(path==="/api/admin/me"&&request.method==="GET"){const admin=await env.DB.prepare("SELECT id FROM admin WHERE id=1").first();return json({authenticated:isAdmin,needsSetup:!admin,remoteSetup:true})}
  if(path==="/api/admin/setup"&&request.method==="POST"){if(await env.DB.prepare("SELECT id FROM admin WHERE id=1").first())return error("管理员已经建立",403);const p=await bodyJSON(request),password=String(p.password||""),setupToken=String(p.setupToken||"");if(!env.ADMIN_SETUP_TOKEN||!await safeEqual(setupToken,env.ADMIN_SETUP_TOKEN))return error("首次设定凭证不正确",403);if(password.length<12)return error("密码至少需要 12 个字元");if(!env.ADMIN_PEPPER)return error("服务器尚未设定管理员安全密钥",503);const salt=randomHex(24),iterations=10000,hash=await passwordHash(password,salt,env.ADMIN_PEPPER,iterations),stamp=now();await env.DB.prepare("INSERT INTO admin(id,salt,hash,iterations,created_at) VALUES(1,?,?,?,?)").bind(salt,hash,iterations,stamp).run();const token=randomHex(32);await env.DB.prepare("INSERT INTO sessions(token_hash,expires_at) VALUES(?,?)").bind(await digest(token),Date.now()+604800000).run();return json({authenticated:true},201,{"set-cookie":sessionCookie(token,request)})}
  if(path==="/api/admin/login"&&request.method==="POST"){if(!env.ADMIN_PEPPER)return error("服务器尚未设定管理员安全密钥",503);const attemptKey=await digest((request.headers.get("cf-connecting-ip")||"unknown")+env.ADMIN_PEPPER),windowStart=Date.now()-600000,attempt=await env.DB.prepare("SELECT window_start,count FROM login_attempts WHERE key=?").bind(attemptKey).first();if(attempt&&attempt.window_start>windowStart&&attempt.count>=8)return error("登入尝试过多，请稍后再试",429);const p=await bodyJSON(request),admin=await env.DB.prepare("SELECT * FROM admin WHERE id=1").first();if(!admin)return error("请先建立管理员密码");const candidate=await passwordHash(String(p.password||""),admin.salt,env.ADMIN_PEPPER,admin.iterations||10000);if(!await safeEqual(candidate,admin.hash)){const start=attempt&&attempt.window_start>windowStart?attempt.window_start:Date.now(),count=attempt&&attempt.window_start>windowStart?attempt.count+1:1;await env.DB.prepare("INSERT INTO login_attempts(key,window_start,count) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET window_start=excluded.window_start,count=excluded.count").bind(attemptKey,start,count).run();return error("密码不正确",401)}await env.DB.prepare("DELETE FROM login_attempts WHERE key=? OR window_start < ?").bind(attemptKey,windowStart).run();await env.DB.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(Date.now()).run();const token=randomHex(32);await env.DB.prepare("INSERT INTO sessions(token_hash,expires_at) VALUES(?,?)").bind(await digest(token),Date.now()+604800000).run();return json({authenticated:true},200,{"set-cookie":sessionCookie(token,request)})}
  if(path==="/api/admin/logout"&&request.method==="POST"){const token=cookie(request,"gg_session");if(token)await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await digest(token)).run();return json({authenticated:false},200,{"set-cookie":clearCookie(request)})}
  if(path==="/api/upload"&&request.method==="POST")return upload(request,env,isAdmin);
  if(path.startsWith("/api/admin/")){
    if(!isAdmin)return error("请先登入后台",401);
    const parts=path.split("/").filter(Boolean),kind=parts[2],id=parts[3];
    if(["places","articles","routes"].includes(kind)){
      if(request.method==="GET"&&!id){const rows=await env.DB.prepare(`SELECT * FROM ${kind} ORDER BY updated_at DESC`).all();const convert=kind==="places"?placeOut:kind==="articles"?articleOut:routeOut;return json(rows.results.map(convert))}
      if(request.method==="POST"||request.method==="PUT")return saveRecord(request,env,kind,id);
      if(request.method==="DELETE"&&id){const result=await env.DB.prepare(`DELETE FROM ${kind} WHERE id=?`).bind(id).run();return result.meta.changes?json({deleted:true}):error("找不到资料",404)}
    }
    if(kind==="submissions"){
      if(request.method==="GET"&&!id){const rows=await env.DB.prepare("SELECT * FROM submissions ORDER BY created_at DESC").all();return json(rows.results.map(submissionOut))}
      if(request.method==="PUT"&&id){const p=await bodyJSON(request),status=["pending","approved","rejected"].includes(p.status)?p.status:null;if(!status)return error("状态无效");const result=await env.DB.prepare("UPDATE submissions SET status=?,updated_at=? WHERE id=?").bind(status,now(),id).run();if(!result.meta.changes)return error("找不到投稿",404);return json(submissionOut(await env.DB.prepare("SELECT * FROM submissions WHERE id=?").bind(id).first()))}
    }
  }
  return error("找不到 API",404);
}

async function handleMedia(request,env){const name=new URL(request.url).pathname.slice(7);if(!/^[a-f0-9-]+\.(png|jpg|webp)$/i.test(name))return new Response("Not found",{status:404});const object=await env.MEDIA.getWithMetadata(name,{type:"arrayBuffer"});if(!object.value)return new Response("Not found",{status:404});const headers=new Headers({"content-type":object.metadata?.contentType||"application/octet-stream","cache-control":"public, max-age=31536000, immutable","x-content-type-options":"nosniff"});return new Response(object.value,{headers})}

export default{
  async fetch(request,env){
    try{
      const url=new URL(request.url);
      if(url.pathname.startsWith("/api/"))return await api(request,env);
      if(url.pathname.startsWith("/media/"))return await handleMedia(request,env);
      if(url.pathname==="/admin")return env.ASSETS.fetch(new Request(new URL("/admin.html",url),{method:"GET",headers:request.headers}));
      return env.ASSETS.fetch(request);
    }catch(caught){console.error(caught);return error(caught.status?caught.message:"服务器暂时无法处理，请稍后重试",caught.status||500)}
  }
};
