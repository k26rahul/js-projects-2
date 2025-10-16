// Format seconds into a human-readable "Hh Mm Ss" string
export function formatDuration(seconds) {
  if (seconds < 1) {
    throw new Error('Seconds must be >= 1');
  }

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (s) parts.push(`${s}s`);

  return parts.join(' ');
}

// Extracts YouTube video ID from a variety of common URL formats
export function extractVideoId(url) {
  const match =
    url.match(/[?&]v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?]+)/) ||
    url.match(/youtube\.com\/embed\/([^?]+)/);
  return match ? match[1] : null;
}
