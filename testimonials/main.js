let imgEl = document.querySelector('img');
let paraEl = document.querySelector('p');
let headingEl = document.querySelector('h2');

let data = [];
let prevIdx = 0;

function updateDetails(idx) {
  imgEl.src = data[idx].url;
  paraEl.innerText = data[idx].testimonial;
  headingEl.innerText = data[idx].name;
  document.querySelector(`.btn-${prevIdx}`).classList.remove('active');
  document.querySelector(`.btn-${idx}`).classList.add('active');
  prevIdx = idx;
}

function generateButtons() {
  data.forEach((elem, idx) => {
    let activeClass = idx == prevIdx ? 'active' : '';
    let html = `
        <button onclick="updateDetails(${idx})" class="btn-${idx} ${activeClass}"></button>
    `;

    document.querySelector('.controls').innerHTML += html;
  });
}

async function getData() {
  let response = await fetch(
    'https://gist.githubusercontent.com/k26rahul/faaa120cf8f254232ca7baf69920f57b/raw'
  );
  data = await response.json();

  generateButtons();
  updateDetails(0);
  document.querySelector('.testimonial').style.visibility = 'visible';
}

getData();
