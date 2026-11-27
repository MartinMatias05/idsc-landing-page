'use strict';
const fs = require('node:fs');
const path = require('node:path');

const filename = path.resolve(process.env.IDSC_ADMIN_STORE || path.join(__dirname, '..', 'storage', 'admin-content.json'));
const {news}=require('../data/news.data');
const {pulse}=require('../data/home.data');
const initialPosts = [
  ...news.map(p=>({id:p.id,kind:'news',title:p.title,description:p.summary,category:p.category,date:p.publishedOn,status:'Published',url:p.url || '',image:p.image?.url || '',prototypeOnly:true})),
  ...pulse.items.map(p=>({id:p.id,kind:'pulse',title:p.title,description:p.summary,category:'General',date:p.postedOn,status:'Published',url:p.url || '',image:p.image?.url || '',prototypeOnly:true})),
];
const defaults = Object.freeze({ posts: initialPosts, deletedPosts: [], pages: {}, hiddenPages: [], hiddenPreviews: [], hiddenHeroIds: [], history: [], links: {}, tuitionOverrides: {rows:{},miscellaneous:{}}, profile: {name:'Administrator',email:''}, enrollmentEdit: null, enrollmentHidden:false, ctaEdit:null, featuredPostId:null });
let cache;
function read() {
  if (cache) return structuredClone(cache);
  try {
    const data = JSON.parse(fs.readFileSync(filename,'utf8'));
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw Error('Invalid admin content');
    cache = { ...structuredClone(defaults), ...data };
  } catch(err) {
    if (err.code !== 'ENOENT') throw err;
    cache = structuredClone(defaults);
  }
  return structuredClone(cache);
}
function validate(next) {
  if (!next || typeof next !== 'object' || Array.isArray(next)) throw Error('State must be an object');
  if (!Array.isArray(next.posts) || next.posts.length > 200 || !Array.isArray(next.hiddenPreviews) || !Array.isArray(next.hiddenHeroIds)) throw Error('Invalid post state');
  if (!next.pages || typeof next.pages !== 'object' || Array.isArray(next.pages)) throw Error('Invalid page state');
  // Clinic is an external website destination, never a patient-data integration.
  if (next.links !== undefined) {
    if (!next.links || typeof next.links !== 'object' || Array.isArray(next.links)) throw Error('Invalid external links');
    const clinic = next.links.Clinic;
    if (clinic !== undefined && clinic !== '') {
      let url;
      try { if (typeof clinic !== 'string' || clinic.length > 2048) throw Error(); url = new URL(clinic); } catch { throw Error('Invalid Clinic URL'); }
      if (url.username || url.password || !(url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost','127.0.0.1'].includes(url.hostname)))) throw Error('Invalid Clinic URL: use HTTPS (HTTP only for local development)');
    }
  }
  const allowed = new Set(['news','hero','pulse']);
  for (const post of next.posts) {
    if (!post || typeof post !== 'object' || !allowed.has(post.kind) || !['Draft','Published'].includes(post.status) || typeof post.id !== 'string' || !/^[a-zA-Z0-9_-]{1,120}$/.test(post.id) || typeof post.title !== 'string' || post.title.length > 250 || typeof post.description !== 'string' || post.description.length > 2000 || typeof post.url !== 'string' || post.url.length > 2048 || typeof post.image !== 'string' || post.image.length > 1800000) throw Error('Invalid post fields');
    if (post.status === 'Published' && post.url && !/^https:\/\//i.test(post.url)) throw Error('Published post link must use HTTPS');
  }
  if (next.posts.filter(p=>p.kind==='hero' && p.status==='Published').length > 4) throw Error('At most four published homepage stories');
  return {...structuredClone(defaults), ...next};
}
function save(next) {
  const validated = validate(next);
  fs.mkdirSync(path.dirname(filename),{recursive:true,mode:0o700});
  const temp = `${filename}.${process.pid}.${require('node:crypto').randomBytes(6).toString('hex')}.tmp`;
  try {
    fs.writeFileSync(temp,JSON.stringify(validated,null,2),{mode:0o600,flag:'wx'});
    fs.renameSync(temp,filename);
  } finally { try { fs.unlinkSync(temp); } catch {} }
  cache = validated;
  return read();
}
module.exports = {read,save};
