const accessKey = 'RZEIOVfPhS7vMLkFdd2TSKGFBS4o9_FmcV1Nje3FSjw';
const cache = JSON.parse(localStorage.getItem('image-search-app-cache')) ?? {};

async function getPhotos() {
  const query = document.querySelector('input').value;
  if (query == '') return;

  let data;
  if (cache[query]) {
    data = cache[query];
  } else {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
    });
    data = await response.json();
    cache[query] = data;
    localStorage.setItem('image-search-app-cache', JSON.stringify(cache));
  }

  document.querySelector('.image-container').innerHTML = '';
  data.results.forEach(img => {
    let caption;
    if (img.alt_description) {
      caption = img.alt_description[0].toUpperCase() + img.alt_description.slice(1);
    } else {
      caption = img.slug;
    }

    const html = `
        <div class="image-result">
          <img src="${img.urls.regular}" alt="${caption}" />
          <p>${caption}</p>
        </div>`;
    document.querySelector('.image-container').innerHTML += html;
  });
}

document.querySelector('.search-container').addEventListener('submit', event => {
  event.preventDefault();
  getPhotos();
});
