import { getContrastYIQ, createBlurhashBackground, Cache, onInfiniteScroll } from './utils.js';

const accessKeys = [
  'RZEIOVfPhS7vMLkFdd2TSKGFBS4o9_FmcV1Nje3FSjw',
  'EJkN_ZCtAARx7ENuEbRJ1TaGUED_YcsMCStbCStMTX0',
];
let currentKeyIndex = 0;

const cache = new Cache('image-search-app-cache');

let currentQuery = '';
let currentPage = 1;
let isLoading = false;
let hasMore = true;

function renderImages(results, shouldClear = true) {
  const container = document.querySelector('.image-container');
  if (shouldClear) {
    container.innerHTML = '';
  }

  results.forEach(img => {
    const caption =
      img.alt_description?.charAt(0).toUpperCase() + img.alt_description?.slice(1) ?? 'No caption';

    const textClass = getContrastYIQ(img.color) === '#fff' ? 'white-text' : 'black-text';

    const imageResult = document.createElement('div');
    imageResult.innerHTML = `
        <div class="image-result" style="--color-img: ${img.color};">
          <div class="image-wrapper">
            <img src="${img.urls.regular}" alt="${caption}" />
          </div>
          <p class="${textClass}">${caption}</p>
        </div>`;

    const wrapper = imageResult.querySelector('.image-wrapper');
    createBlurhashBackground(img.blur_hash, wrapper);
    container.append(imageResult.firstElementChild);
  });
}

async function getPhotos() {
  if (!currentQuery) return;
  isLoading = true;

  let data;
  const cacheKey = `${currentQuery}:${currentPage}`;
  if (cache.has(cacheKey)) {
    data = cache.get(cacheKey);
  } else {
    let response = await fetch(
      `https://api.unsplash.com/search/photos?query=${currentQuery}&page=${currentPage}&per_page=30`,
      {
        headers: { Authorization: `Client-ID ${accessKeys[currentKeyIndex]}` },
      }
    );

    if (!response.ok) {
      alert('API error: ' + response.statusText);
      isLoading = false;
      return;
    }

    data = await response.json();
    cache.set(cacheKey, data);

    const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
    document.getElementById('rate-limit-info').textContent = `Requests left: ${rateLimitRemaining}`;
    if (rateLimitRemaining === '1') {
      currentKeyIndex = (currentKeyIndex + 1) % accessKeys.length;
    }
  }

  renderImages(data.results, currentPage === 1);
  hasMore = data.results.length > 0 && currentPage < data.total_pages;
  isLoading = false;
}

function resetSearch() {
  currentQuery = document.querySelector('input').value;
  currentPage = 1;
  hasMore = true;
  getPhotos();
}

document.querySelector('.search-container').addEventListener('submit', event => {
  event.preventDefault();
  resetSearch();
});

onInfiniteScroll(() => {
  if (!hasMore || isLoading) return;
  currentPage += 1;
  getPhotos();
});

// initial load
resetSearch();
