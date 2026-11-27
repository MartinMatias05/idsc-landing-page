'use strict';

const { news } = require('../data/news.data');
const admin = require('./admin-state.service');
const { badRequest, notFound } = require('../errors');

const ID_PATTERN = /^[a-z0-9-]+$/;

/** List view omits `body`; the detail view returns the full article. */
function toSummary({ body, ...summary }) {
  return summary;
}

function currentNews() {
  const state = admin.read();
  const deleted = new Set([...(state.hiddenPreviews || []), ...(state.deletedPosts || [])]);
  const overrides = (state.posts || []).filter(p=>p.kind==='news' && p.prototypeOnly===false);
  const replaced = new Set(overrides.map(p=>p.id));
  const published = overrides.filter(p=>p.status==='Published').map(p=>({id:p.id,title:p.title,summary:p.description,category:p.category,publishedOn:p.date,image:{url:p.image || '',alt:p.title},featured:false,url:p.url,body:[p.description]}));
  return [...published,...news.filter(p=>!deleted.has(p.id)&&!replaced.has(p.id))];
}
/** Homepage cover feed is independent from Vox News publications. */
function listHero() {
  const state = admin.read();
  const hidden = new Set(state.hiddenHeroIds || []);
  const published = (state.posts || []).filter(p => p.kind === 'hero' && p.status === 'Published' && p.prototypeOnly === false);
  const overrides = new Map(published.map(p => [p.id, p]));
  const baseline = news.filter(p => p.featured);
  const items = [
    ...published.filter(p => !baseline.some(item => item.id === p.id)).map(p => ({
      id:p.id,title:p.title,summary:p.description,category:p.category || 'Featured',
      publishedOn:p.date,image:{url:p.image || '',alt:p.title},featured:true,url:p.url || ''
    })),
    ...baseline.map(item => {
      const p = overrides.get(item.id);
      return p ? {id:p.id,title:p.title,summary:p.description,category:p.category || item.category,
        publishedOn:p.date,image:{url:p.image || item.image?.url || '',alt:p.title},
        featured:true,url:p.url || ''} : item;
    }),
  ].filter(p => !hidden.has(p.id));
  items.sort((a,b) => Number(b.id === state.featuredPostId) - Number(a.id === state.featuredPostId) || b.publishedOn.localeCompare(a.publishedOn));
  return structuredClone({items:items.slice(0,4).map(toSummary),total:Math.min(items.length,4)});
}

function listNews() {
  const items = currentNews()
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn))
    .map(toSummary);
  return structuredClone({ items, total: items.length });
}

function getNews(id) {
  if (!ID_PATTERN.test(id)) {
    throw badRequest(`Path parameter 'id' is malformed: '${id}'.`, [
      { field: 'id', message: 'Must contain only lowercase letters, digits and hyphens.' },
    ]);
  }
  const article = currentNews().find((item) => item.id === id);
  if (!article) throw notFound(`News article '${id}' was not found.`);
  return structuredClone(article);
}

module.exports = { listNews, listHero, getNews };
