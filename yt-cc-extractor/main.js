import { formatDuration, extractVideoId, isLocalHost } from './utils.js';

console.log('=== YouTube CC Extractor ===');

// === DOM Elements ===
const formEl = document.querySelector('form');
const urlInput = document.querySelector('.youtube-url');
const pasteBtn = document.querySelector('.paste-btn');

const loaderEl = document.querySelector('.loader');
const embedContainer = document.querySelector('.embed-container');
const iframeEl = embedContainer.querySelector('iframe');
const resultEl = document.querySelector('.result');

const transcriptEl = document.querySelector('.transcript-content');
const transcriptLangEl = document.querySelector('.transcript-lang');
const copyBtn = document.querySelector('.copy-btn');

// === Event Listeners ===
formEl.addEventListener('submit', handleFormSubmit);
copyBtn.addEventListener('click', handleCopy);
pasteBtn.addEventListener('click', handlePasteAndGo);

// === Core Logic ===

async function handleFormSubmit(event) {
  event.preventDefault();

  const url = urlInput.value.trim();
  const videoId = extractVideoId(url);
  if (!videoId) {
    alert('Invalid YouTube URL.');
    return;
  }

  prepareUI(videoId);

  try {
    const result = await fetchVideoData(videoId);
    renderTranscript(result);
  } catch (err) {
    console.error(err);
    alert('Error fetching data.');
  } finally {
    loaderEl.classList.add('hidden');
  }
}

async function fetchVideoData(videoId) {
  const API_BASE = isLocalHost() ? 'http://localhost:5050' : 'https://yt-cc-extractor.netlify.app';

  const endpoint = `${API_BASE}/.netlify/functions/transcript?platform=youtube&video_id=${videoId}`;

  const response = await fetch(endpoint, {
    headers: {
      'X-API-Key': '1v9v3WeLLz7vpUFpm0isbEjU',
    },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function renderTranscript(result) {
  const { video, transcript } = result?.data || {};

  if (!video || !transcript) {
    alert('No transcript data available.');
    return;
  }

  const transcriptText = buildTranscriptContent(video, transcript);
  transcriptEl.textContent = transcriptText;

  const langLabel = transcript?.language?.name || transcript?.language?.code || 'Unavailable';
  transcriptLangEl.textContent = `(${langLabel})`;

  resultEl.classList.remove('hidden');
}

function buildTranscriptContent(video, transcript) {
  const dash = '—';
  const headerSection = [
    `Title: ${video.name || dash}`,
    `Author: ${video.author || dash}`,
    `Duration: ${video.duration ? formatDuration(video.duration) : dash}`,
  ].join('\n');

  const transcriptSectionHeader = '\n\n=== Transcript ===\n';
  const transcriptBody = transcript.content.map(t => t.text).join('\n\n') || 'No transcript found.';

  return `${headerSection}${transcriptSectionHeader}\n${transcriptBody}`;
}

function prepareUI(videoId) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?&cc_load_policy=1`;
  iframeEl.src = embedUrl;

  embedContainer.classList.remove('hidden');
  loaderEl.classList.remove('hidden');
  resultEl.classList.add('hidden');

  transcriptEl.textContent = '';
  transcriptLangEl.textContent = '';
}

function handleCopy() {
  const text = transcriptEl.textContent.trim();
  if (!text) {
    alert('Nothing to copy.');
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    copyBtn.textContent = 'Copied!';
    setTimeout(() => (copyBtn.textContent = 'Copy'), 1500);
  });
}

async function handlePasteAndGo() {
  try {
    const text = (await navigator.clipboard.readText()).trim();
    if (!text) {
      alert('Clipboard is empty.');
      return;
    }

    const videoId = extractVideoId(text);
    if (!videoId) {
      alert('Clipboard does not contain a valid YouTube link.');
      return;
    }

    urlInput.value = text;
    formEl.requestSubmit();
  } catch (err) {
    console.error(err);
    alert('Failed to read clipboard.');
  }
}
