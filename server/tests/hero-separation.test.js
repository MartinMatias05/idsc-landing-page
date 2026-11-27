'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {execFileSync}=require('node:child_process');

test('publishing Vox News does not add it to the Homepage hero',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'idsc-separate-hero-'));
 try {
  const store=path.join(dir,'admin.json');
  const script=`const admin=require('./services/admin-state.service'); const news=require('./services/news.service');const original=admin.read();admin.save({...original,posts:[...original.posts,{id:'vox-only-regression',kind:'news',title:'A Vox-only post',description:'Only in Vox',category:'News',date:'2026-11-27',status:'Published',image:'https://example.com/a.jpg',url:'https://voxtemplari.idsc.edu.ph/article',prototypeOnly:false}]});const publicNews=news.listNews().items;const home=news.listHero().items;if(!publicNews.some(p=>p.id==='vox-only-regression'))process.exit(11);if(home.some(p=>p.id==='vox-only-regression'))process.exit(12);console.log('independent');`;
  const output=execFileSync(process.execPath,['-e',script],{cwd:path.join(__dirname,'..'),env:{...process.env,IDSC_ADMIN_STORE:store},encoding:'utf8'});
  assert.match(output,/independent/);
 } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
