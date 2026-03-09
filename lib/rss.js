import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
    'Accept': 'application/rss+xml, application/xml, text/xml',
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

export async function fetchFeed(feedUrl) {
  try {
    const feed = await parser.parseURL(feedUrl);
    return feed.items.map((item) => ({
      title: item.title || '',
      link: item.link || '',
      content: item.contentEncoded || item.content || item.contentSnippet || '',
      summary: item.contentSnippet || item.summary || '',
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      imageUrl: extractImageUrl(item),
      sourceName: feed.title || '',
    }));
  } catch (error) {
    console.error(`Erro ao buscar feed ${feedUrl}:`, error.message);
    return [];
  }
}

function extractImageUrl(item) {
  // Try media:content
  if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
    return item.mediaContent.$.url;
  }
  // Try media:thumbnail
  if (item.mediaThumbnail && item.mediaThumbnail.$ && item.mediaThumbnail.$.url) {
    return item.mediaThumbnail.$.url;
  }
  // Try enclosure
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  // Try to extract from content HTML
  const content = item.contentEncoded || item.content || '';
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) {
    return imgMatch[1];
  }
  return null;
}

export function createHash(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
