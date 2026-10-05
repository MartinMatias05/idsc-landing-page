'use strict';

const { news } = require('../data/news.data');
const { badRequest, notFound } = require('../errors');

const ID_PATTERN = /^[a-z0-9-]+$/;

/** List view omits `body`; the detail view returns the full article. */
function toSummary({ body, ...summary }) {
  return summary;
}

function listNews() {
  const items = [...news]
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
  const article = news.find((item) => item.id === id);
  if (!article) throw notFound(`News article '${id}' was not found.`);
  return structuredClone(article);
}

module.exports = { listNews, getNews };
