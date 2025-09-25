import { Cache, getContrastYIQ, setBlurhashBg } from './utils.js';

const ACCESS_KEY = 'EJkN_ZCtAARx7ENuEbRJ1TaGUED_YcsMCStbCStMTX0';
const cache = new Cache('image-search-app-2-cache');

// debug
window.cache = cache;

async function getPhotos() {
  const query = document.querySelector('input').value;
  if (!query) return;

  let data;
  if (cache.has(query)) {
    data = cache.get(query);
  } else {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=30`,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      }
    );
    data = await response.json();
    cache.set(query, data);
  }

  const container = document.querySelector('.image-container');
  container.innerHTML = '';

  data.results.forEach(img => {
    let textClass = getContrastYIQ(img.color) >= 128 ? 'dark-text' : 'light-text';

    const dummy = document.createElement('div');
    dummy.innerHTML = `
        <div class="image-result">
          <img src="${img.urls.regular}" alt="this is placeholder image" />
          <p class="${textClass}" style="background-color: ${img.color};">${img.alt_description}</p>
        </div>
    `;

    setBlurhashBg(img.blur_hash, dummy.querySelector('.image-result'));
    document.querySelector('.image-container').append(dummy.firstElementChild);
  });
}

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  getPhotos();
});

// initial load
getPhotos();
