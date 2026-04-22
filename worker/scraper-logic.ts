import * as cheerio from 'cheerio';
export interface AnimeItem {
  id: string;
  title: string;
  image: string;
  url: string;
  episodes?: string;
  type?: string;
}
export interface EpisodeLink {
  name: string;
  type: 'sub' | 'dub' | 'raw';
  url: string;
}
export interface DownloadLink {
  quality: string;
  url: string;
}
export interface PlayerServer {
  name: string;
  url: string;
}
export interface EpisodeDetail {
  title: string;
  poster: string;
  prev_ep_url: string | null;
  next_ep_url: string | null;
  servers: PlayerServer[];
  downloads: DownloadLink[];
}
export interface FullSeriesEpisode {
  num: string;
  ep_id: string;
  players: string[];
}
const TARGET_URL = 'https://9anime.org.lv';
const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=500&auto=format&fit=crop';
const MOCK_ANIME: AnimeItem[] = [
  { id: '101', title: 'Solo Leveling (Sub)', image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=300', url: '/watch/solo-leveling-sub', episodes: '12', type: 'TV' },
  { id: '102', title: 'One Piece Episode 1158', image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=301', url: '/watch/one-piece-1158', episodes: '1158', type: 'TV' },
  { id: '103', title: 'Spy x Family Code: White', image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=302', url: '/watch/spy-x-family-movie', episodes: '1', type: 'Movie' },
  { id: '104', title: 'Kaiju No. 8', image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=303', url: '/watch/kaiju-no-8', episodes: '12', type: 'TV' },
  { id: '105', title: 'Demon Slayer: Hashira Training', image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=304', url: '/watch/demon-slayer-hashira', episodes: '8', type: 'TV' }
];
const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Referer': `${TARGET_URL}/`,
  'Accept-Language': 'en-US,en;q=0.5',
};
function cleanMetadata(text: string): string {
  if (!text) return '';
  // Precise regex: remove markers but keep title structure. 
  // We use word boundaries \b to avoid stripping characters from within words (e.g. "Subaru" shouldn't become "aru")
  return text
    .replace(/\b(Ep|Episode|Series|Season|Sub|Dub|Movie|OVA|Raw|Special)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}
function resolveUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  const baseUrl = TARGET_URL.endsWith('/') ? TARGET_URL : `${TARGET_URL}/`;
  return `${baseUrl}${cleanPath}`.replace(/([^:]\/)\/+/g, "$1");
}
function generatePlayerUrls(slug: string, ep_id: string): string[] {
  const cleanSlug = slug.split('?')[0].replace(/\/$/, '').replace(/-ep(isode)?-\d+$/i, '').toLowerCase();
  const types = ['hd-1', 'hd-2', 'hd-3'];
  const categories = ['sub', 'dub'];
  const urls: string[] = [];
  for (const type of types) {
    for (const category of categories) {
      urls.push(`https://retronime.sys/embed?slug=${cleanSlug}&ep=${ep_id}&type=${type}&category=${category}`);
    }
  }
  return urls;
}
export async function scrapeRecent(): Promise<{ items: AnimeItem[]; source: 'live' | 'mock' }> {
  try {
    const res = await fetch(`${TARGET_URL}/`, { headers: DEFAULT_HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const items: AnimeItem[] = [];
    $('.item, .flw-item, .ani.item, .poster-item, .film_list-wrap .flw-item').each((_, el) => {
      const $el = $(el);
      const titleLink = $el.find('.title a, .name a, .film-name a, h2 a, h3 a').first();
      const title = titleLink.text().trim();
      const url = titleLink.attr('href') || $el.find('a[href^="/watch/"], a[href^="/anime/"]').first().attr('href') || '';
      const image = $el.find('.poster img, img').first().attr('data-src') || $el.find('.poster img, img').first().attr('src') || DEFAULT_POSTER;
      const rawEpisodes = $el.find('.epx, .ep, .tick-item.tick-eps, [class*="ep"]').text().trim();
      const episodes = cleanMetadata(rawEpisodes);
      const typeText = $el.find('.sb, .type, .fdi-item').filter((_, el) => !$(el).text().match(/Ep/i)).first().text().trim();
      if (title && url) {
        items.push({
          id: crypto.randomUUID(),
          title,
          image: resolveUrl(image),
          url: url,
          episodes: episodes || '?',
          type: typeText || 'TV'
        });
      }
    });
    if (items.length === 0) return { items: MOCK_ANIME, source: 'mock' };
    return { items, source: 'live' };
  } catch (error) {
    return { items: MOCK_ANIME, source: 'mock' };
  }
}
export async function scrapeSearch(query: string): Promise<{ items: AnimeItem[]; source: 'live' | 'mock' }> {
  if (!query) return { items: [], source: 'live' };
  try {
    const res = await fetch(`${TARGET_URL}/search?keyword=${encodeURIComponent(query)}`, { headers: DEFAULT_HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const items: AnimeItem[] = [];
    $('.item, .flw-item, .poster-item, .film_list-wrap .flw-item').each((_, el) => {
      const $el = $(el);
      const titleLink = $el.find('.title a, .name a, .film-name a, h2 a, h3 a').first();
      const title = titleLink.text().trim();
      const url = titleLink.attr('href') || $el.find('a[href^="/watch/"], a[href^="/anime/"]').first().attr('href') || '';
      const image = $el.find('.poster img, img').first().attr('data-src') || $el.find('.poster img, img').first().attr('src') || DEFAULT_POSTER;
      if (title && url) {
        items.push({
          id: crypto.randomUUID(),
          title,
          image: resolveUrl(image),
          url: url
        });
      }
    });
    if (items.length === 0) {
      const filtered = MOCK_ANIME.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));
      return { items: filtered.length > 0 ? filtered : MOCK_ANIME.slice(0, 2), source: 'mock' };
    }
    return { items, source: 'live' };
  } catch (error) {
    return { items: MOCK_ANIME, source: 'mock' };
  }
}
export async function scrapeInfo(url: string): Promise<{ details: any; source: 'live' | 'mock' }> {
  try {
    const res = await fetch(resolveUrl(url), { headers: DEFAULT_HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const title = $('.title, .film-name, .name, h1, .film-details .name').first().text().trim() || "Anime Series Information";
    const details = {
      title,
      epCount: $('.ep-list a, .episodes a, .ep-item, .episodes-ul li').length || '?',
      description: $('.description, .synopsis, .summary, .film-description').first().text().replace(/\s+/g, ' ').trim(),
      poster: resolveUrl($('.poster img, .film-poster img, img.poster').first().attr('data-src') || $('.poster img, .film-poster img, img.poster').first().attr('src') || DEFAULT_POSTER),
      meta: $('.meta, .info, .stats, .film-stats').first().text().trim().replace(/\s+/g, ' '),
    };
    return { details, source: 'live' };
  } catch (error) {
    return {
      details: {
        title: "Metadata Restricted",
        description: "Access to live metadata for this series is currently throttled due to edge protection. Mock data remains available for exploration.",
        poster: DEFAULT_POSTER,
        epCount: "12",
        meta: "Status: Restricted"
      },
      source: 'mock'
    };
  }
}
export async function scrapeEpisodeLinks(url: string): Promise<{ data: any; source: 'live' | 'mock' }> {
  try {
    const res = await fetch(resolveUrl(url), { headers: DEFAULT_HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const servers: EpisodeLink[] = [];
    $('.servers ul li a, .server-item, [class*="server"] a, .nav-item a[data-id]').each((_, el) => {
      const $el = $(el);
      const name = $el.text().trim() || $el.attr('title') || 'Server';
      const href = $el.attr('href') || $el.attr('data-url') || '';
      if (href && href !== '#') {
        servers.push({
          name,
          type: name.toLowerCase().includes('dub') ? 'dub' : 'sub',
          url: resolveUrl(href)
        });
      }
    });
    return {
      data: { title: $('h1').text().trim() || 'Episode Link Cluster', servers },
      source: servers.length > 0 ? 'live' : 'mock'
    };
  } catch (error) {
    return { data: { servers: [] }, source: 'mock' };
  }
}
export async function scrapeEpisodeDetail(url: string): Promise<{ data: EpisodeDetail; source: 'live' | 'mock' }> {
  try {
    const fullUrl = resolveUrl(url);
    const slug = url.split('/').filter(Boolean).pop() || 'unknown';
    const ep_id_match = url.match(/-ep(?:isode)?-(\d+)/i) || url.match(/\/(\d+)(\?|$)/);
    const ep_id = ep_id_match ? ep_id_match[1] : '1';
    const res = await fetch(fullUrl, { headers: DEFAULT_HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const title = $('.title, .name, h1, .film-name').first().text().trim();
    const poster = resolveUrl($('.poster img, .film-poster img, img').first().attr('src') || $('.poster img, .film-poster img, img').first().attr('data-src')) || DEFAULT_POSTER;
    const servers: PlayerServer[] = [];
    // PRIORITY: Inject our HD prioritized servers first if we have a slug/id
    if (slug !== 'unknown') {
      const prioritized = generatePlayerUrls(slug, ep_id);
      prioritized.forEach((pUrl, i) => {
        const isSub = pUrl.includes('category=sub');
        servers.push({ name: `HD-${Math.floor(i/2) + 1} (${isSub ? 'Sub' : 'Dub'})`, url: pUrl });
      });
    }
    // Then add live servers from DOM
    $('.server-list li a, .nav-item a[data-id], .servers ul li a').each((_, el) => {
      const $el = $(el);
      const name = $el.text().trim() || 'Server';
      const sUrl = $el.attr('href') || $el.attr('data-url') || '';
      if (sUrl && sUrl !== '#' && !servers.some(s => s.url === resolveUrl(sUrl))) {
        servers.push({ name, url: resolveUrl(sUrl) });
      }
    });
    const downloads: DownloadLink[] = [];
    $('.dl-btns a, .download-link, a:contains("1080p"), a:contains("720p"), a:contains("480p")').each((_, el) => {
      const $el = $(el);
      const q = $el.text().trim().match(/\d+p/)?.[0] || 'HD';
      const dUrl = $el.attr('href');
      if (dUrl) downloads.push({ quality: q, url: dUrl });
    });
    const prev_ep_url = $('.prev-ep, .btn-prev, a:contains("Prev")').first().attr('href') || null;
    const next_ep_url = $('.next-ep, .btn-next, a:contains("Next")').first().attr('href') || null;
    if (!title && servers.length === 0) throw new Error('Parsing failed');
    return {
      data: {
        title: title || 'Watching Anime',
        poster,
        prev_ep_url: prev_ep_url ? resolveUrl(prev_ep_url) : null,
        next_ep_url: next_ep_url ? resolveUrl(next_ep_url) : null,
        servers: servers.length > 0 ? servers : [{ name: 'Default', url: fullUrl }],
        downloads
      },
      source: 'live'
    };
  } catch (error) {
    const slug = url.split('/').filter(Boolean).pop() || 'mock-series';
    return {
      data: {
        title: "Solo Leveling - Episode 12 [INTELLIGENT_PRIORITY]",
        poster: DEFAULT_POSTER,
        prev_ep_url: "/watch/solo-leveling-ep-11",
        next_ep_url: null,
        servers: [
          { name: "HD-1 (Sub)", url: `https://retronime.sys/embed?slug=${slug}&ep=12&type=hd-1&category=sub` },
          { name: "HD-1 (Dub)", url: `https://retronime.sys/embed?slug=${slug}&ep=12&type=hd-1&category=dub` },
          { name: "HD-2 (Sub)", url: `https://retronime.sys/embed?slug=${slug}&ep=12&type=hd-2&category=sub` },
          { name: "HD-2 (Dub)", url: `https://retronime.sys/embed?slug=${slug}&ep=12&type=hd-2&category=dub` },
          { name: "HD-3 (Sub)", url: `https://retronime.sys/embed?slug=${slug}&ep=12&type=hd-3&category=sub` },
          { name: "HD-3 (Dub)", url: `https://retronime.sys/embed?slug=${slug}&ep=12&type=hd-3&category=dub` }
        ],
        downloads: [
          { quality: "1080p", url: "#" },
          { quality: "720p", url: "#" },
          { quality: "480p", url: "#" }
        ]
      },
      source: 'mock'
    };
  }
}
export async function scrapeFullSeries(epUrl: string): Promise<{ data: any; source: 'live' | 'mock' }> {
  try {
    const fullUrl = resolveUrl(epUrl);
    const slug = epUrl.split('/').filter(Boolean).pop() || 'unknown';
    const res = await fetch(fullUrl, { headers: DEFAULT_HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    const episodes: FullSeriesEpisode[] = [];
    // Robust selectors for various 9anime mirrors
    const epSelectors = [
      '.ep-list a[data-number]', 
      '.episodes-ul li a[data-number]', 
      '.ep-item[data-number]',
      '.ss-list a[data-number]',
      'ul.episodes li a'
    ];
    for (const selector of epSelectors) {
      $(selector).each((_, el) => {
        const $el = $(el);
        const num = $el.attr('data-number') || $el.text().trim();
        const ep_id = $el.attr('data-id') || $el.attr('href')?.split('-').pop()?.split('?')[0] || '';
        if (num && ep_id && !isNaN(parseInt(num))) {
          episodes.push({ num, ep_id, players: generatePlayerUrls(slug, ep_id) });
        }
      });
      if (episodes.length > 0) break;
    }
    if (episodes.length === 0) throw new Error('No episodes in DOM');
    return {
      data: { series_title: $('.title, h1, .film-name').first().text().trim() || slug, total_eps: episodes.length, eps: episodes },
      source: 'live'
    };
  } catch (error) {
    const mockEps: FullSeriesEpisode[] = Array.from({ length: 12 }, (_, i) => ({
      num: String(i + 1),
      ep_id: String(70000 + i),
      players: generatePlayerUrls('solo-leveling-dub', String(70000 + i))
    }));
    return {
      data: { series_title: "Cluster Recovery (Solo Leveling)", total_eps: 12, eps: mockEps },
      source: 'mock'
    };
  }
}