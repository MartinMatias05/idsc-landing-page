'use strict';
const {Router} = require('express');
const crypto = require('node:crypto');
const state = require('../services/admin-state.service');
const router=Router();
const sessions = new Map();
const attempts=new Map();
const ttl=8*60*60*1000;
function authorized(req,res,next){
  const value = (req.get('authorization') || '').match(/^Bearer ([a-f\d]{64})$/i);
  const record = value && sessions.get(value[1]);
  if (!record || record < Date.now()) return res.status(401).json({detail:'Admin login required.'});
  req.adminToken=value[1]; next();
}
router.post('/login',(req,res)=>{
  const identifier=req.ip || 'unknown';
  const attempt=attempts.get(identifier) || {count:0,until:0};
  if(attempt.until>Date.now()) return res.status(429).json({detail:'Too many attempts. Try later.'});
  const {email,password}=req.body || {};
  const login=process.env.IDSC_ADMIN_EMAIL;
  const hash=process.env.IDSC_ADMIN_PASSWORD_SCRYPT;
  if(!login || !hash) return res.status(503).json({detail:'Admin credentials are not configured on the server.'});
  let valid=false;
  try {
    const [salt,hex]=hash.split(':');
    if(salt && /^[a-f0-9]{128}$/i.test(hex)){
      const actual=crypto.scryptSync(String(password || ''),salt,64);
      valid=crypto.timingSafeEqual(actual,Buffer.from(hex,'hex')) && typeof email==='string' && email.toLowerCase()===login.toLowerCase();
    }
  }catch{}
  if(!valid){
    const count=attempt.count+1;
    attempts.set(identifier,{count,until:count>=8?Date.now()+15*60000:0});
    return res.status(401).json({detail:'Invalid admin credentials.'});
  }
  attempts.delete(identifier);
  const token=crypto.randomBytes(32).toString('hex');sessions.set(token,Date.now()+ttl);
  res.set('Cache-Control','no-store').json({token,expiresIn:ttl/1000});
});
router.get('/session',authorized,(req,res)=>res.set('Cache-Control','no-store').json({authenticated:true}));
router.post('/logout',authorized,(req,res)=>{sessions.delete(req.adminToken);res.status(204).end()});
router.get('/notifications',authorized,(req,res)=>{
  try {
    const q=String(req.query.search || '').trim().toLowerCase().slice(0,120);
    const items=state.read().history.filter(item=>item && typeof item === 'object' && (
      String(item.type || '').toLowerCase().includes(q) || String(item.target || '').toLowerCase().includes(q)
    )).slice(0,100);
    res.set('Cache-Control','no-store').json({items,total:items.length});
  }catch(e){console.error(e);res.status(500).json({detail:'Unable to load Admin notifications.'});}
});
router.get('/state',authorized,(req,res)=>{try {res.set('Cache-Control','no-store').json(state.read())}catch(e){console.error(e);res.status(500).json({detail:'Unable to read saved content.'})}});
router.put('/state',authorized,(req,res)=>{try{res.set('Cache-Control','no-store').json(state.save(req.body))}catch(e){if(e.message.startsWith('Invalid') || e.message.startsWith('At most') || e.message.startsWith('Published') || e.message.startsWith('State')) return res.status(400).json({detail:e.message});console.error(e);res.status(500).json({detail:'Unable to save content.'})}});
module.exports=router;
