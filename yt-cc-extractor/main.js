import { formatDuration, extractVideoId } from './utils.js';

console.log('YouTube CC Extractor Loaded');

// === DOM Elements ===
const html = String.raw;

const formEl = document.getElementById('youtube-form');
const inputEl = document.getElementById('youtube-url');
const resultSectionEl = document.getElementById('result');
const loaderEl = document.getElementById('loader');
const embedContainerEl = document.getElementById('embed-container');
const videoIframeEl = document.getElementById('video-embed');

// Video info fields
const videoInfoEl = document.getElementById('video-info');
const videoNameEl = document.getElementById('video-name');
const videoAuthorEl = document.getElementById('video-author');
const videoDurationEl = document.getElementById('video-duration');

// Transcript elements
const autoTranscriptEl = document.getElementById('auto-transcript');
const customTranscriptEl = document.getElementById('custom-transcript');
const autoLangEl = document.getElementById('auto-lang');
const customLangEl = document.getElementById('custom-lang');

const copyBtns = document.querySelectorAll('.copy-btn');

// === Event Listeners ===
formEl.addEventListener('submit', handleSubmit);

copyBtns.forEach(btn => {
  btn.addEventListener('click', () => handleCopy(btn));
});

// === Main Logic ===

// Handle form submission
async function handleSubmit(event) {
  event.preventDefault();

  const url = inputEl.value.trim();
  const videoId = extractVideoId(url);

  if (!videoId) {
    alert('Invalid YouTube URL.');
    return;
  }

  prepareUIForFetch(videoId);

  try {
    const data = await fetchVideoData(videoId);
    renderVideoData(data);
  } catch (err) {
    console.error(err);
    alert('Error fetching data.');
  } finally {
    loaderEl.classList.add('hidden');
  }
}

// Fetch video data from API
async function fetchVideoData(videoId) {
  const response = await fetch(
    `https://yt-cc-extractor.netlify.app/api/transcript?platform=youtube&video_id=${videoId}`
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
}

// Render video and transcripts
function renderVideoData(data) {
  // 🧩 1. check for message: 'no transcript'
  const message = data?.message;

  if (message && message.toLowerCase() === 'no transcript') {
    alert('This video has no transcript available.');
    return; // stop right here
  }

  // 🧩 2. then proceed with videoInfo as before
  const videoInfo = data?.data?.videoInfo;
  if (!videoInfo) {
    alert('No video info found.');
    return;
  }

  resultSectionEl.classList.remove('hidden');
  videoInfoEl.classList.remove('hidden');

  // 🧩 3. populate existing markup
  videoNameEl.textContent = videoInfo.name || '-';
  videoAuthorEl.textContent = videoInfo.author || '-';
  videoAuthorEl.href = videoInfo.channel_id
    ? `https://www.youtube.com/channel/${videoInfo.channel_id}`
    : '#';
  videoDurationEl.textContent = formatDuration(videoInfo.duration);

  // --- Transcript section ---
  const transcripts = data?.data?.transcripts || {};
  const langMeta = data?.data?.language_code?.[0];
  const langCode = langMeta?.code || 'Unknown';
  const langName = langMeta?.name || langCode;

  const transcriptLang = transcripts[langCode] || {};
  const autoArr = Array.isArray(transcriptLang.auto) ? transcriptLang.auto : [];
  const customArr = Array.isArray(transcriptLang.custom) ? transcriptLang.custom : [];

  autoTranscriptEl.textContent =
    autoArr.map(t => t.text).join('\n\n') || 'No auto transcript found.';
  customTranscriptEl.textContent =
    customArr.map(t => t.text).join('\n\n') || 'No custom transcript found.';

  autoLangEl.textContent = `(${langName})`;
  customLangEl.textContent = `(${langName})`;
}

// Prepare interface before fetching data
function prepareUIForFetch(videoId) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?&cc_load_policy=1`;
  videoIframeEl.src = embedUrl;

  embedContainerEl.classList.remove('hidden');
  loaderEl.classList.remove('hidden');
  resultSectionEl.classList.add('hidden');
  videoInfoEl.classList.add('hidden');

  // Reset display texts
  videoNameEl.textContent = '-';
  videoAuthorEl.textContent = '-';
  videoAuthorEl.href = '#';
  videoDurationEl.textContent = '-';
  autoTranscriptEl.textContent = '';
  customTranscriptEl.textContent = '';
  autoLangEl.textContent = '';
  customLangEl.textContent = '';
}

function handleCopy(button) {
  const target = button.dataset.target;
  let text = '';

  if (target === 'auto') {
    text = autoTranscriptEl.textContent;
  } else if (target === 'custom') {
    text = customTranscriptEl.textContent;
  } else if (target === 'video-info') {
    // 🆕
    const name = videoNameEl.textContent.trim();
    const author = videoAuthorEl.textContent.trim(); // anchor text only
    const duration = videoDurationEl.textContent.trim();
    text = `Name: ${name}\nAuthor: ${author}\nDuration: ${duration}`;
  }

  if (!text) {
    alert('Nothing to copy.');
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    button.textContent = 'Copied!';
    setTimeout(() => (button.textContent = 'Copy'), 1500);
  });
}
