// netlify/functions/transcript.mjs

export default async function handler(req, context) {
  const origin = req.headers.get('origin');

  const isAllowed =
    (origin && origin.startsWith('http://127.0.0.1:')) || origin === 'https://k26rahul.github.io';

  // Reject disallowed origins
  if (!isAllowed) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const urlObj = new URL(req.url);
    const videoId = urlObj.searchParams.get('video_id');
    const platform = urlObj.searchParams.get('platform');

    if (!videoId) {
      return new Response(JSON.stringify({ error: 'Missing required query parameter: video_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!platform) {
      return new Response(JSON.stringify({ error: 'Missing required query parameter: platform' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiUrl = `https://notegpt.io/api/v2/video-transcript?platform=${platform}&video_id=${videoId}`;
    const response = await fetch(apiUrl, {
      headers: {
        Cookie: 'anonymous_user_id=78b48ab34f3bc2950cbc09bd2ed018c5; is_first_visit=true',
      },
    });

    const data = await response.text();

    return new Response(data, {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
