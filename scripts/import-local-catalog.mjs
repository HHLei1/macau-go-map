import fs from 'node:fs';
import path from 'node:path';
import {DatabaseSync, backup} from 'node:sqlite';

const [dataDir, catalogPath] = process.argv.slice(2);
if (!dataDir || !catalogPath) throw new Error('Provide a local data directory and prepared catalogue JSON.');
const file = path.resolve(dataDir, 'green-go.sqlite');
if (!fs.existsSync(file)) throw new Error('Local SQLite database does not exist.');
const input = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const places = Array.isArray(input) ? input : input.places;
const categories = new Set(['食','買','修','去','學','參與']);
if (!Array.isArray(places) || !places.length || new Set(places.map(p=>p.id)).size !== places.length ||
    places.some(p=>!p.id.startsWith('catalog-') || !p.name || !categories.has(p.cat) ||
      !(p.lat===null && p.lng===null) && !(Number.isFinite(p.lat) && Number.isFinite(p.lng) && p.lat>=22 && p.lat<=22.25 && p.lng>=113.45 && p.lng<=113.65)))
  throw new Error('Invalid catalogue records.');
const db = new DatabaseSync(file);
db.exec('PRAGMA busy_timeout=5000');
const backupDir=path.resolve('work/catalog-import/backups');
fs.mkdirSync(backupDir,{recursive:true,mode:0o700});
const backupFile=path.join(backupDir,`${path.basename(path.dirname(file))}-${Date.now()}.sqlite`);
await backup(db,backupFile);
fs.chmodSync(backupFile,0o600);
db.exec('BEGIN IMMEDIATE');
try {
  const columns=db.prepare('PRAGMA table_info(places)').all();
  if(columns.some(c=>['lat','lng'].includes(c.name)&&c.notnull)){
    const schema=db.prepare("SELECT sql FROM sqlite_master WHERE name='places' AND type='table'").get().sql;
    const indexes=db.prepare("SELECT sql FROM sqlite_master WHERE tbl_name='places' AND type='index' AND sql IS NOT NULL").all();
    db.exec(schema.replace(/^CREATE TABLE (?:IF NOT EXISTS )?places/i,'CREATE TABLE places_import').replace(/\b(lat|lng) REAL NOT NULL/gi,'$1 REAL'));
    db.exec('INSERT INTO places_import SELECT * FROM places; DROP TABLE places; ALTER TABLE places_import RENAME TO places;');
    for(const {sql} of indexes)db.exec(sql);
  }
  if(!columns.some(c=>c.name==='website'))db.exec("ALTER TABLE places ADD COLUMN website TEXT NOT NULL DEFAULT ''");
  db.exec("UPDATE places SET status='draft' WHERE status='published';");
  db.exec("UPDATE articles SET status='draft' WHERE id IN ('story-afa','story-garden','story-youth'); UPDATE routes SET status='draft' WHERE id IN ('food','daily','nature');");
  const add=db.prepare(`INSERT INTO places (id,name,en,cat,area,address,lat,lng,tags,description,hours,phone,website,status,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'published',?,?)
    ON CONFLICT(id) DO UPDATE SET name=excluded.name,en=excluded.en,cat=excluded.cat,area=excluded.area,address=excluded.address,
    lat=excluded.lat,lng=excluded.lng,tags=excluded.tags,description=excluded.description,hours=excluded.hours,
    phone=excluded.phone,website=excluded.website,status=excluded.status,updated_at=excluded.updated_at`);
  const stamp=Date.now();
  places.forEach((p,i)=>{const date=new Date(stamp-i).toISOString();add.run(p.id,p.name,p.en,p.cat,p.area,p.address,p.lat,p.lng,JSON.stringify(p.tags),p.desc,p.hours,p.phone,p.website,date,date)});
  db.exec('COMMIT');
} catch(error){db.exec('ROLLBACK');throw error}
console.log(JSON.stringify({file,backupFile,published:places.length,located:places.filter(p=>p.lat!==null).length}));
db.close();
