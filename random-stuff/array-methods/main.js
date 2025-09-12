let fruits = [
  'apple',
  'banana',
  'mango',
  'grapes',
  'orange',
  'watermelon',
  'pineapple',
  'strawberry',
  'kiwi',
  'papaya',
  'cherry',
  'peach',
  'pear',
  'plum',
  'fig',
];

let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function display(token, text) {
  document.querySelector(`#${token}-result`).innerText = text;
}

document.querySelector('#fruits').innerText = `fruits = [${fruits.join(', ')}]`;
document.querySelector('#numbers').innerText = `numbers = [${numbers.join(', ')}]`;

function forEach() {
  let text = '';
  fruits.forEach(fruit => {
    text += `${fruit}, `;
  });
  display('forEach', text);
}

function filter() {
  let text = '';
  fruits.filter(fruit => {
    if (fruit[0] == 'p') {
      text += `${fruit}, `;
    }
  });
  display('filter', text);
}

function map() {
  let newFruits = fruits.map(fruit => {
    return `${fruit}✼`;
  });
  let text = newFruits.join(', ');
  display('map', text);
}

function reduce() {
  display(
    'reduce',
    numbers.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    })
  );
}

function indexOf() {
  display('indexOf', fruits.indexOf('kiwi'));
}

function includes() {
  display('includes', fruits.includes('mango'));
}

function sort() {
  display('sort', numbers.sort((a, b) => b - a).join(', '));
}

function join() {
  display('join', numbers.join('✼'));
}

function push() {
  let text = `new length of the numbers = ${numbers.push(100)}, numbers = ${numbers.join(', ')}`;
  display('push', text);
}

function pop() {
  let text = `removed elem (from last) = ${numbers.pop()}, numbers = ${numbers.join(', ')}`;
  display('pop', text);
}

function shift() {
  let text = `removed elem (from start) = ${numbers.shift()}, numbers = ${numbers.join(', ')}`;
  display('shift', text);
}

function unshift() {
  let text = `new length of the numbers = ${numbers.unshift(100)}, numbers = ${numbers.join(', ')}`;
  display('unshift', text);
}

function reverse() {
  display('reverse', numbers.reverse().join(', '));
}
