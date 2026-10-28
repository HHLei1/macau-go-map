// Update only a named local preview database; no remote services are contacted.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dataDir=process.argv[2];
if(!dataDir)throw new Error('Pass the local data directory explicitly.');
const databasePath=path.resolve(dataDir,'green-go.sqlite');
if(!fs.existsSync(databasePath))throw new Error('The local database does not exist.');
const ids=['afa','market','reuse','garden','bookshop','coast','repairbike','shop','youth','coastcare','learn','cafe'];
const asset=id=>`assets/flat-${id}.webp`;
for(const id of ['waterfront',...ids])if(!fs.existsSync(path.join(root,'dist',asset(id))))throw new Error(`Missing illustration: ${id}`);
const categories={'食':'cafe','買':'shop','修':'afa','去':'waterfront','學':'learn','參與':'youth'};
const routes={food:'market',daily:'reuse',nature:'coast'};
const db=new DatabaseSync(databasePath);
const row=db.prepare('SELECT content FROM site_settings WHERE id=1').get();
const site=JSON.parse(row.content);
const backup={site,places:db.prepare('SELECT id,image FROM places').all(),articles:db.prepare('SELECT id,image FROM articles').all(),routes:db.prepare('SELECT id,image FROM routes').all()};
const backupPath=path.join(path.dirname(databasePath),`illustration-backup-${Date.now()}.json`);
fs.writeFileSync(backupPath,JSON.stringify(backup,null,2));
site.heroImage=asset('waterfront');
site.featureImage=asset('afa');
site.featureSideImage=asset('waterfront');
site.categories=(site.categories||[]).map(c=>({...c,image:categories[c.key]?asset(categories[c.key]):c.image}));
const stamp=new Date().toISOString();
db.exec('BEGIN IMMEDIATE');
try{
  const place=db.prepare('UPDATE places SET image=?,updated_at=? WHERE id=?');
  for(const id of ids)place.run(asset(id),stamp,id);
  const article=db.prepare('UPDATE articles SET image=?,updated_at=? WHERE place_id=?');
  for(const id of ids)article.run(asset(id),stamp,id);
  const route=db.prepare('UPDATE routes SET image=?,updated_at=? WHERE id=?');
  for(const [id,imageId]of Object.entries(routes))route.run(asset(imageId),stamp,id);
  db.prepare('UPDATE site_settings SET content=?,updated_at=? WHERE id=1').run(JSON.stringify(site),stamp);
  db.exec('COMMIT');
}catch(error){db.exec('ROLLBACK');throw error}
console.log(JSON.stringify({databasePath,backupPath,places:ids.length,articles:db.prepare("SELECT COUNT(*) AS count FROM articles WHERE image LIKE 'assets/flat-%'").get().count,routes:Object.keys(routes).length}));
db.close();
