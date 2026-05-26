export interface YTVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration?: string;
}

export interface YTPlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  uploader: string;
  videos: YTVideo[];
}

const PROXIES = [
  (url: string) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`
];

// Fallback APIs
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks', 
  'https://pipedapi.syncpundit.io',
  'https://piped-api.garudalinux.org',
  'https://pipedapi.adminforge.de'
];

export const getPlaylistId = (url: string): string | null => {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('PL') && trimmed.length >= 18) return trimmed;
  try {
    const urlObj = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`);
    return urlObj.searchParams.get('list');
  } catch (e) {
    const match = trimmed.match(/[&?]list=([^&]+)/i);
    return match ? match[1] : null;
  }
};

const scrapeDirectly = async (playlistId: string): Promise<YTPlaylist> => {
  const targetUrl = `https://www.youtube.com/playlist?list=${playlistId}&hl=en`;
  let html = '';
  let proxyUsed = '';

  for (const proxyFn of PROXIES) {
    try {
      proxyUsed = proxyFn(targetUrl);
      const response = await fetch(proxyUsed, {
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error(`Proxy status ${response.status}`);
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
        html = data.contents || text;
      } catch (e) {
        html = text;
      }
      if (html && html.includes('ytInitialData')) break;
    } catch (e) {
      console.warn(`Scraper: Proxy failed`, e);
    }
  }

  if (!html) throw new Error('Could not reach YouTube. Check your internet or try again.');

  try {
    const regex = /ytInitialData\s*=\s*({.+?});/s;
    const match = html.match(regex);
    if (!match) throw new Error('Could not find playlist data in page source.');

    const data = JSON.parse(match[1]);
    const findKey = (obj: any, key: string): any => {
      if (obj !== null && typeof obj === 'object') {
        if (obj[key] !== undefined) return obj[key];
        for (const k in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, k)) {
            const result = findKey(obj[k], key);
            if (result !== undefined) return result;
          }
        }
      }
      return undefined;
    };

    const metadata = findKey(data, 'playlistHeaderRenderer') || findKey(data, 'c4TabbedHeaderRenderer');
    const playlistVideoList = findKey(data, 'playlistVideoListRenderer');
    const contents = playlistVideoList?.contents;

    if (!contents) throw new Error('Playlist is empty or private.');

    const videos: YTVideo[] = contents
      .map((item: any) => {
        const v = item.playlistVideoRenderer;
        if (!v) return null;
        return {
          id: v.videoId,
          title: v.title?.runs?.[0]?.text || 'Untitled Video',
          thumbnail: v.thumbnail?.thumbnails?.[0]?.url || `https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`,
          duration: v.lengthText?.simpleText || ''
        };
      })
      .filter(Boolean);

    return {
      id: playlistId,
      title: metadata?.title?.simpleText || 'Custom Course',
      description: '',
      thumbnail: metadata?.playlistHeaderBanner?.heroPlaylistThumbnailRenderer?.thumbnail?.thumbnails?.[0]?.url || '',
      uploader: metadata?.ownerText?.runs?.[0]?.text || 'YouTube',
      videos
    };
  } catch (e: any) {
    throw new Error(`Parsing Error: ${e.message}`);
  }
};

const fetchFromAPI = async (playlistId: string): Promise<YTPlaylist> => {
  for (const instance of PIPED_INSTANCES) {
    try {
      const response = await fetch(`${instance}/playlists/${playlistId}`, {
        signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) continue;
      const data = await response.json();
      return {
        id: playlistId,
        title: data.name,
        description: data.description || '',
        thumbnail: data.thumbnailUrl,
        uploader: data.uploader,
        videos: data.relatedStreams.map((s: any) => ({
          id: s.url?.split('v=')[1]?.split('&')[0] || '',
          title: s.title,
          thumbnail: s.thumbnail,
          duration: s.duration?.toString()
        }))
      };
    } catch (e) { /* ignore */ }
  }
  throw new Error('Fallback APIs also failed.');
};

const fetchFromLemnos = async (playlistId: string): Promise<YTPlaylist> => {
  const pRes = await fetch(`https://yt.lemnoslife.com/noKey/playlists?part=snippet&id=${playlistId}&hl=en`);
  if (!pRes.ok) throw new Error('Lemnos playlist request failed');
  const pData = await pRes.json();
  if (!pData.items || !pData.items.length) throw new Error('Playlist not found');
  
  const snippet = pData.items[0].snippet;
  
  let allItems: any[] = [];
  let nextPageToken = '';
  
  while (true) {
    const pageTokenParam = nextPageToken ? `&pageToken=${nextPageToken}` : '';
    const vRes = await fetch(`https://yt.lemnoslife.com/noKey/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&hl=en${pageTokenParam}`);
    if (!vRes.ok) throw new Error('Lemnos items request failed');
    const vData = await vRes.json();
    allItems = allItems.concat(vData.items || []);
    if (!vData.nextPageToken) break;
    nextPageToken = vData.nextPageToken;
    if (allItems.length >= 1000) break; // Safety limit
  }
  
  const videos: YTVideo[] = allItems.map((item: any) => {
    const videoId = item.contentDetails?.videoId || '';
    return {
      id: videoId,
      title: item.snippet?.title || 'Untitled',
      thumbnail: item.snippet?.thumbnails?.maxres?.url || item.snippet?.thumbnails?.standard?.url || item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : ''),
      duration: '' 
    };
  }).filter((v: any) => v.id);

  const playlistThumbnail = videos.length > 0 && videos[0].thumbnail 
    ? videos[0].thumbnail 
    : (snippet.thumbnails?.maxres?.url || snippet.thumbnails?.standard?.url || snippet.thumbnails?.high?.url || '');

  return {
    id: playlistId,
    title: snippet.title || 'Unknown Title',
    description: snippet.description || '',
    thumbnail: playlistThumbnail,
    uploader: snippet.channelTitle || 'YouTube',
    videos
  };
};

export const fetchPlaylist = async (playlistId: string): Promise<YTPlaylist> => {
  try {
    console.log('Trying Lemnos API...');
    return await fetchFromLemnos(playlistId);
  } catch (lemnosError) {
    console.warn('Lemnos failed, trying scraper...', lemnosError);
    try {
      return await scrapeDirectly(playlistId);
    } catch (scrapeError: any) {
      console.warn('Scraper failed, trying Piped API fallback...', scrapeError);
      try {
        return await fetchFromAPI(playlistId);
      } catch (apiError: any) {
        throw new Error(`All methods failed. Scraping: ${scrapeError.message} | Piped: ${apiError.message}`);
      }
    }
  }
};
