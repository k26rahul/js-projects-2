const html = String.raw;

let imgEl = document.querySelector('img');
let paraEl = document.querySelector('p');
let headingEl = document.querySelector('h2');

let activeIdx = parseInt(new URLSearchParams(location.search).get('idx') ?? 0);
let timeoutDuration = parseFloat(new URLSearchParams(location.search).get('timeout') ?? 5) * 1000;

let data = [];
let timeoutRef = null;

function updateDetails(idx) {
  console.log(`updateDetails(${idx}) at ${new Date().getSeconds()}`);

  imgEl.src = data[idx].url;
  paraEl.innerText = data[idx].testimonial;
  headingEl.innerText = data[idx].name;

  document.querySelector(`.btn-${activeIdx}`).classList.remove('active');
  document.querySelector(`.btn-${idx}`).classList.add('active');

  activeIdx = idx;

  // trigger a timeout that does updateDetails(idx + 1), after 5 sec
  clearTimeout(timeoutRef);

  timeoutRef = setTimeout(() => {
    updateDetails((idx + 1) % data.length);
  }, timeoutDuration);
}

function generateButtons() {
  data.forEach((elem, idx) => {
    let activeClass = idx == activeIdx ? 'active' : '';
    let buttonHtml = html`
      <button onclick="updateDetails(${idx})" class="btn-${idx} ${activeClass}"></button>
    `;

    document.querySelector('.controls').innerHTML += buttonHtml;
  });
}

async function getData() {
  let response = await fetch(
    'https://gist.githubusercontent.com/k26rahul/faaa120cf8f254232ca7baf69920f57b/raw'
  );
  data = await response.json();

  generateButtons();
  updateDetails(activeIdx);
  document.querySelector('.testimonial').style.visibility = 'visible';
}

getData();
