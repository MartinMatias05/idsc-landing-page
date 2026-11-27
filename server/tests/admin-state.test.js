'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const source=path.join(__dirname,'../services/admin-state.service.js');
test('Admin edits persist across process restarts',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'idsc-admin-test-'));
  try{
    const env={...process.env,IDSC_ADMIN_STORE:path.join(dir,'admin-content.json'),FORCE_COLOR:'0',NODE_DISABLE_COLORS:'1'};
    const state={posts:[{id:'test-1',kind:'news',title:'Saved article',description:'Summary',status:'Published',url:'https://example.org/article',image:'',date:'2026-11-26',prototypeOnly:false}],hiddenPreviews:[],hiddenHeroIds:[],pages:{'About IDSC':{description:'Saved page text'}}};
    const write=spawnSync(process.execPath,['-e',`require(${JSON.stringify(source)}).save(${JSON.stringify(state)})`],{env,encoding:'utf8'});
    assert.equal(write.status,0,write.stderr);
    const read=spawnSync(process.execPath,['-e',`process.stdout.write(JSON.stringify(require(${JSON.stringify(source)}).read()))`],{env,encoding:'utf8'});
    assert.equal(read.status,0,read.stderr);
    const restored=JSON.parse(read.stdout);
    assert.equal(restored.posts[0].title,'Saved article');
    assert.equal(restored.pages['About IDSC'].description,'Saved page text');
  }finally{fs.rmSync(dir,{recursive:true,force:true})}
});
test('Admin rejects invalid saved content',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'idsc-admin-test-'));
  const env={...process.env,IDSC_ADMIN_STORE:path.join(dir,'state.json')};
  try{
    const result=spawnSync(process.execPath,['-e',`require(${JSON.stringify(source)}).save({posts:[{id:'bad',kind:'news',status:'Published',title:'Wrong',description:'text',url:'javascript:alert(1)',image:''}],hiddenPreviews:[],hiddenHeroIds:[],pages:{}})`],{env,encoding:'utf8'});
    assert.notEqual(result.status,0);
    assert.equal(fs.existsSync(env.IDSC_ADMIN_STORE),false);
  }finally{fs.rmSync(dir,{recursive:true,force:true})}
});

test('Clinic destination is persisted and unsafe URLs are rejected',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'idsc-clinic-test-'));
  try {
    const env={...process.env,IDSC_ADMIN_STORE:path.join(dir,'state.json')};
    const script = `const assert=require('node:assert/strict');const store=require(${JSON.stringify(source)});const state=store.read();state.links={Clinic:'https://clinic.example.org/'};store.save(state);assert.equal(store.read().links.Clinic,state.links.Clinic);for(const url of ['javascript:alert(1)','http://example.org','https://user:pass@example.org/']){assert.throws(()=>store.save({...state,links:{Clinic:url}}),/Invalid Clinic URL/)}assert.equal(store.read().links.Clinic,state.links.Clinic);store.save({...state,links:{Clinic:''}});assert.equal(store.read().links.Clinic,'');`;
    const result=spawnSync(process.execPath,['-e',script],{env,encoding:'utf8'});
    assert.equal(result.status,0,result.stderr);
  } finally {fs.rmSync(dir,{recursive:true,force:true})}
});
