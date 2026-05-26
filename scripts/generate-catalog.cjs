const fs = require('fs');
const path = require('path');

// Sleep helper
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to extract playlist ID from URL or string
const getPlaylistId = (url) => {
  if (!url) return null;
  if (typeof url !== 'string') return null;
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

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
];

const findKey = (obj, key) => {
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

// Fetch playlist title, description/channel, and first video ID
const fetchPlaylistMetadata = async (playlistId) => {
  console.log(`Fetching metadata for playlist: ${playlistId}...`);
  
  // 1. Try direct YouTube HTML fetch first (no CORS limitations in Node)
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const url = `https://www.youtube.com/playlist?list=${playlistId}&hl=en`;
      const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
      const response = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        signal: AbortSignal.timeout(10000)
      });
      
      if (response.ok) {
        const html = await response.text();
        const regex = /ytInitialData\s*=\s*({.+?});/s;
        const match = html.match(regex);
        if (match) {
          const data = JSON.parse(match[1]);
          
          // Check if playlist doesn't exist or is unavailable
          const alertRenderer = findKey(data, 'alertRenderer');
          if (alertRenderer) {
            const alertText = JSON.stringify(alertRenderer.text || '');
            if (alertText.includes("does not exist") || alertText.includes("unavailable")) {
              throw new Error('Playlist does not exist or is unavailable');
            }
          }

          const playlistVideoList = findKey(data, 'playlistVideoListRenderer');
          const contents = playlistVideoList?.contents;
          
          if (contents && contents.length > 0) {
            const metadata = findKey(data, 'playlistHeaderRenderer') || findKey(data, 'c4TabbedHeaderRenderer');
            const microformat = findKey(data, 'microformatDataRenderer');
            const sidebarPrimary = findKey(data, 'playlistSidebarPrimaryInfoRenderer');
            const sidebarSecondary = findKey(data, 'playlistSidebarSecondaryInfoRenderer');
            
            const title = sidebarPrimary?.title?.runs?.[0]?.text || 
                          sidebarPrimary?.title?.simpleText ||
                          microformat?.title ||
                          metadata?.title?.simpleText || 
                          metadata?.title?.runs?.[0]?.text || 
                          'Curated Playlist';

            const description = sidebarSecondary?.videoOwnerRenderer?.title?.runs?.[0]?.text ||
                                sidebarSecondary?.videoOwnerRenderer?.title?.simpleText ||
                                metadata?.ownerText?.runs?.[0]?.text || 
                                metadata?.ownerText?.simpleText || 
                                'YouTube';
            
            let firstVideoId = undefined;
            const firstVideo = contents[0]?.playlistVideoRenderer;
            if (firstVideo) {
              firstVideoId = firstVideo.videoId;
            }
            
            let totalSeconds = 0;
            for (const item of contents) {
              const v = item.playlistVideoRenderer;
              if (v) {
                const durationStr = v.lengthText?.simpleText || '';
                const parts = durationStr.split(':').map(p => parseInt(p, 10));
                if (!parts.some(isNaN)) {
                  if (parts.length === 2) {
                    totalSeconds += parts[0] * 60 + parts[1];
                  } else if (parts.length === 3) {
                    totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
                  }
                }
              }
            }
            const durationHours = totalSeconds > 0 ? parseFloat((totalSeconds / 3600).toFixed(1)) : undefined;
            
            console.log(`✓ Successfully fetched ${playlistId} directly from YouTube`);
            return { id: playlistId, title, description, firstVideoId, durationHours };
          }
        }
      }
      throw new Error('Direct parse failed or empty playlist content');
    } catch (directErr) {
      if (directErr.message.includes('does not exist') || directErr.message.includes('unavailable')) {
        console.warn(`Playlist ${playlistId} is invalid/private on YouTube.`);
        break; // Stop retrying for nonexistent playlists
      }
      if (attempt < 2) {
        console.warn(`Direct fetch attempt ${attempt} failed for ${playlistId} (${directErr.message}). Retrying in 1.5s...`);
        await sleep(1500);
      } else {
        console.warn(`Direct fetch failed for ${playlistId} after 2 attempts (${directErr.message}). Trying Lemnos API fallback...`);
      }
    }
  }

  // 2. Try Lemnos API fallback
  try {
    const pRes = await fetch(`https://yt.lemnoslife.com/noKey/playlists?part=snippet&id=${playlistId}&hl=en`, {
      signal: AbortSignal.timeout(8000)
    });
    if (pRes.ok) {
      const pData = await pRes.json();
      if (pData.items && pData.items.length > 0) {
        const snippet = pData.items[0].snippet;
        const title = snippet.title || 'Curated Playlist';
        const description = snippet.channelTitle || 'YouTube';
        
        const vRes = await fetch(`https://yt.lemnoslife.com/noKey/playlistItems?part=snippet,contentDetails&maxResults=1&playlistId=${playlistId}&hl=en`, {
          signal: AbortSignal.timeout(8000)
        });
        let firstVideoId = undefined;
        if (vRes.ok) {
          const vData = await vRes.json();
          if (vData.items && vData.items.length > 0) {
            firstVideoId = vData.items[0].contentDetails?.videoId || vData.items[0].snippet?.resourceId?.videoId;
          }
        }
        console.log(`✓ Successfully fetched ${playlistId} via Lemnos API`);
        return { id: playlistId, title, description, firstVideoId };
      }
    }
    throw new Error('Lemnos API returned empty or failed');
  } catch (lemnosErr) {
    console.warn(`Lemnos failed for ${playlistId} (${lemnosErr.message}). Trying Piped fallback...`);
    
    // 3. Fallback to Piped Instances
    const PIPED_INSTANCES = [
      'https://pipedapi.kavin.rocks',
      'https://pipedapi.syncpundit.io',
      'https://piped-api.garudalinux.org',
      'https://pipedapi.adminforge.de'
    ];
    for (const instance of PIPED_INSTANCES) {
      try {
        const res = await fetch(`${instance}/playlists/${playlistId}`, {
          signal: AbortSignal.timeout(5000)
        });
        if (res.ok) {
          const data = await res.json();
          const firstVideoId = data.relatedStreams?.[0]?.url?.split('v=')?.[1]?.split('&')?.[0];
          let totalSeconds = 0;
          if (data.relatedStreams) {
            for (const s of data.relatedStreams) {
              if (s.duration) {
                totalSeconds += parseInt(s.duration, 10);
              }
            }
          }
          const durationHours = totalSeconds > 0 ? parseFloat((totalSeconds / 3600).toFixed(1)) : undefined;
          
          console.log(`✓ Successfully fetched ${playlistId} via Piped API (${instance})`);
          return {
            id: playlistId,
            title: data.name || 'Curated Playlist',
            description: data.uploader || 'YouTube',
            firstVideoId,
            durationHours
          };
        }
      } catch (e) {
        // Try next instance
      }
    }
    
    console.error(`All APIs failed for playlist ${playlistId}. Using placeholder fallback.`);
    return {
      id: playlistId,
      title: 'Curated Playlist',
      description: 'Educational lectures on YouTube',
      firstVideoId: undefined
    };
  }
};

const main = async () => {
  const inputPath = path.join(__dirname, '../src/data/catalog-input.json');
  const outputPath = path.join(__dirname, '../src/data/catalog.ts');

  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found at: ${inputPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(inputPath, 'utf8');
  const inputExams = JSON.parse(rawData);

  // Extract all playlist targets
  const playlistMap = new Map();
  const queue = [];

  for (const exam of inputExams) {
    for (const subject of exam.subjects) {
      for (const category of subject.categories) {
        for (const playlistItem of category.playlists) {
          let rawUrlOrId = playlistItem;
          if (playlistItem && typeof playlistItem === 'object') {
            rawUrlOrId = playlistItem.id || playlistItem.url;
          }
          const pId = getPlaylistId(rawUrlOrId);
          if (pId && !playlistMap.has(pId)) {
            playlistMap.set(pId, null);
            queue.push(pId);
          }
        }
      }
    }
  }

  console.log(`Discovered ${queue.length} unique playlist(s) to fetch.`);

  // Fetch sequentially with delay to avoid rate limiting
  const results = {};
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i];
    const meta = await fetchPlaylistMetadata(id);
    results[id] = meta;
    
    if (i < queue.length - 1) {
      console.log(`Waiting 1.5s before fetching next playlist to avoid YouTube rate limiting...`);
      await sleep(1500);
    }
  }

  // Re-build nested structure
  const outputExams = inputExams.map(exam => {
    return {
      ...exam,
      subjects: exam.subjects.map(subject => {
        return {
          ...subject,
          categories: subject.categories.map(category => {
            return {
              ...category,
              playlists: category.playlists.map(playlistItem => {
                let rawUrlOrId = playlistItem;
                let customNotesUrl = undefined;
                if (playlistItem && typeof playlistItem === 'object') {
                  rawUrlOrId = playlistItem.id || playlistItem.url;
                  customNotesUrl = playlistItem.notesUrl;
                }
                const pId = getPlaylistId(rawUrlOrId);
                const meta = results[pId];
                return {
                  id: pId,
                  title: meta ? meta.title : 'Curated Playlist',
                  description: meta ? meta.description : 'Educational lectures on YouTube',
                  firstVideoId: meta ? meta.firstVideoId : undefined,
                  notesUrl: customNotesUrl,
                  durationHours: meta ? meta.durationHours : undefined
                };
              })
            };
          })
        };
      })
    };
  });

  const tsContent = `export interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  firstVideoId?: string;
  notesUrl?: string;
  durationHours?: number;
}

export interface Category {
  id: string;
  title: string;
  playlists: Playlist[];
}

export interface Subject {
  id: string;
  title: string;
  categories: Category[];
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  subjects: Subject[];
}

export const EXAMS: Exam[] = ${JSON.stringify(outputExams, null, 2)};
`;

  fs.writeFileSync(outputPath, tsContent, 'utf8');
  console.log(`\nCatalog successfully generated and written to ${outputPath}!`);
};

main();
