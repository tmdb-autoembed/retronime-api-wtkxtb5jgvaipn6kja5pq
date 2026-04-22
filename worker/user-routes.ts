import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad } from './core-utils';
import { 
  scrapeRecent, 
  scrapeSearch, 
  scrapeInfo, 
  scrapeEpisodeLinks, 
  scrapeFullSeries, 
  scrapeEpisodeDetail 
} from './scraper-logic';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Scraper Endpoints
  app.get('/api/scrape/recent', async (c) => {
    const data = await scrapeRecent();
    return ok(c, {
      ...data,
      timestamp: new Date().toISOString(),
      endpoint: '/api/scrape/recent'
    });
  });
  app.get('/api/scrape/search', async (c) => {
    const query = c.req.query('q');
    if (!query) return bad(c, 'Query parameter "q" is required');
    const data = await scrapeSearch(query);
    return ok(c, {
      ...data,
      query,
      timestamp: new Date().toISOString(),
      endpoint: '/api/scrape/search'
    });
  });
  app.get('/api/scrape/info', async (c) => {
    const url = c.req.query('url');
    if (!url) return bad(c, 'Query parameter "url" is required');
    const data = await scrapeInfo(url);
    return ok(c, {
      ...data,
      targetUrl: url,
      timestamp: new Date().toISOString(),
      endpoint: '/api/scrape/info'
    });
  });
  app.get('/api/scrape/eps-links', async (c) => {
    const url = c.req.query('url');
    if (!url) return bad(c, 'Query parameter "url" is required');
    const data = await scrapeEpisodeLinks(url);
    return ok(c, {
      ...data,
      targetUrl: url,
      timestamp: new Date().toISOString(),
      endpoint: '/api/scrape/eps-links'
    });
  });
  app.get('/api/scrape/full-series-eps', async (c) => {
    const url = c.req.query('ep_url');
    if (!url) return bad(c, 'Query parameter "ep_url" is required');
    const data = await scrapeFullSeries(url);
    return ok(c, {
      ...data,
      targetUrl: url,
      timestamp: new Date().toISOString(),
      endpoint: '/api/scrape/full-series-eps'
    });
  });
  app.get('/api/scrape/ep-detail', async (c) => {
    const url = c.req.query('url');
    if (!url) return bad(c, 'Query parameter "url" is required');
    const data = await scrapeEpisodeDetail(url);
    return ok(c, {
      ...data,
      targetUrl: url,
      timestamp: new Date().toISOString(),
      endpoint: '/api/scrape/ep-detail'
    });
  });
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'RetroNime Scraper API', version: '1.2.0' }}));
}