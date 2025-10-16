import { formatDuration, extractVideoId } from './utils.js';

console.log('=== YouTube CC Extractor ===');

// === DOM Elements ===
const formEl = document.querySelector('form');
const urlInput = document.querySelector('.youtube-url');

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
    const data = await fetchVideoData(videoId);
    renderTranscript(data);
  } catch (err) {
    console.error(err);
    alert('Error fetching data.');
  } finally {
    loaderEl.classList.add('hidden');
  }
}

async function fetchVideoData(videoId) {
  const endpoint = `https://yt-cc-extractor.netlify.app/api/transcript?platform=youtube&video_id=${videoId}`;
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function renderTranscript(data) {
  const message = data?.message;
  if (message && message.toLowerCase() === 'no transcript') {
    alert('This video has no transcript available.');
    return;
  }

  const info = data?.data?.videoInfo;
  if (!info) {
    alert('No video info found.');
    return;
  }

  const langMeta = data?.data?.language_code?.[0];
  const langCode = langMeta?.code || 'Unknown';
  const langName = langMeta?.name || langCode;

  const transcriptLang = data?.data?.transcripts?.[langCode] || {};
  const transcriptArray = Array.isArray(transcriptLang.auto) ? transcriptLang.auto : [];

  const transcriptText = buildTranscriptContent(info, transcriptArray);
  transcriptEl.textContent = transcriptText;
  transcriptLangEl.textContent = `(${langName})`;

  resultEl.classList.remove('hidden');
}

function buildTranscriptContent(info, transcriptArray) {
  const headerSection = [
    `Title: ${info.name || '-'}`,
    `Author: ${info.author || '-'}`,
    `Duration: ${formatDuration(info.duration)}`,
  ].join('\n');

  const transcriptSectionHeader = '\n\n=== Transcript ===\n';
  const transcriptBody = transcriptArray.map(t => t.text).join('\n\n') || 'No transcript found.';

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
