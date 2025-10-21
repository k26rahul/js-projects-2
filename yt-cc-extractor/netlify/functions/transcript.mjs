// netlify/functions/transcript.mjs

import {
  jsonResponse,
  isAllowedMethod,
  isAllowedOrigin,
  authorizeRequest,
  buildCorsHeaders,
} from '../utils.mjs';

const ALLOWED_METHODS = ['GET', 'OPTIONS'];
const ALLOWED_ORIGINS = ['https://k26rahul.github.io'];
const ALLOWED_HEADERS = ['Content-Type', 'X-API-Key'];

const EXTERNAL_API_BASE = process.env.EXTERNAL_API_BASE;
const EXTERNAL_API_COOKIE = process.env.EXTERNAL_API_COOKIE;

// Transform the upstream payload into the compact format we want
function buildCleanData(upstream) {
  if (!upstream || !upstream.data) return null;

  const raw = upstream.data;
  const info = raw.videoInfo || {};
  const langMeta = raw.language_code?.[0] || {};
  const langCode = langMeta.code;
  const transcriptArray = raw.transcripts?.[langCode]?.auto || [];

  return {
    video: {
      id: raw.videoId,
      name: info.name,
      author: info.author,
      duration: info.duration,
    },
    transcript: {
      language: {
        code: langMeta.code,
        name: langMeta.name,
      },
      content: transcriptArray.map(t => ({
        start: t.start,
        end: t.end,
        text: t.text,
      })),
    },
  };
}

export default async function handler(req, context) {
  const method = req.method;
  const origin = req.headers.get('origin');
  const secFetchSite = req.headers.get('sec-fetch-site');
  const url = new URL(req.url);

  if (!isAllowedMethod(method, ALLOWED_METHODS)) {
    return jsonResponse({ code: 405 });
  }

  if (!isAllowedOrigin(origin, ALLOWED_ORIGINS, secFetchSite)) {
    return jsonResponse({ code: 403 });
  }

  // Preflight
  if (method === 'OPTIONS') {
    const headers = buildCorsHeaders(origin, ALLOWED_METHODS, ALLOWED_HEADERS);
    return new Response(null, { status: 204, headers });
  }

  // Authorization
  const providedApiKey = req.headers.get('X-API-Key');
  if (!authorizeRequest(providedApiKey, process.env.API_KEY)) return jsonResponse({ code: 401 });

  try {
    const videoId = url.searchParams.get('video_id');
    const platform = url.searchParams.get('platform');
    if (!videoId || !platform) return jsonResponse({ code: 400, message: 'Bad Request' });

    const apiUrl = `${EXTERNAL_API_BASE}/api/v2/video-transcript?platform=${platform}&video_id=${videoId}`;
    const resp = await fetch(apiUrl, {
      headers: { Cookie: EXTERNAL_API_COOKIE },
    });

    if (!resp.ok) return jsonResponse({ code: 500 });
    const upstream = await resp.json();

    return jsonResponse({
      code: 200,
      message: 'Transcript fetched successfully',
      data: buildCleanData(upstream),
      headers: buildCorsHeaders(origin, ALLOWED_METHODS, ALLOWED_HEADERS),
    });
  } catch {
    return jsonResponse({ code: 500 });
  }
}
