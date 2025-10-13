export default async function handler(req, context) {
  try {
    // Parse the request URL
    const urlObj = new URL(req.url);
    const videoId = urlObj.searchParams.get('video_id');

    // If no video_id provided → return 400 error
    if (!videoId) {
      return new Response(JSON.stringify({ error: 'Missing required query parameter: video_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // External API call (using built-in fetch)
    const apiUrl = `https://notegpt.io/api/v2/video-transcript?platform=youtube&video_id=${videoId}`;
    const response = await fetch(apiUrl, {
      headers: {
        Cookie: 'anonymous_user_id=78b48ab34f3bc2950cbc09bd2ed018c5; is_first_visit=true',
      },
    });

    // Forward response from external API
    const data = await response.text();
    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (err) {
    // Server error
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
