const points = {
  s: 10,
  a: 9,
  b: 8,
  c: 7,
  d: 6,
  e: 4,
};

const courses = {
  english1: {
    credit: 4,
    fullname: 'English I',
  },
  english2: {
    credit: 4,
    fullname: 'English II',
  },
  maths1: {
    credit: 4,
    fullname: 'Mathematics for Data Science I',
  },
  maths2: {
    credit: 4,
    fullname: 'Mathematics for Data Science II',
  },
  stats1: {
    credit: 4,
    fullname: 'Statistics for Data Science I',
  },
  stats2: {
    credit: 4,
    fullname: 'Statistics for Data Science II',
  },
  ct: {
    credit: 4,
    fullname: 'Computational Thinking',
  },
  python: {
    credit: 4,
    fullname: 'Programming in Python',
  },
  dbms: {
    credit: 4,
    fullname: 'Database Management Systems',
  },
  pdsa: {
    credit: 4,
    fullname: 'Programming, Data Structures and Algorithms using Python',
  },
  mad1: {
    credit: 4,
    fullname: 'Modern Application Development I',
  },
  mad1Proj: {
    credit: 2,
    fullname: 'Modern Application Development I - Project',
  },
  mad2: {
    credit: 4,
    fullname: 'Modern Application Development II',
  },
  mad2Proj: {
    credit: 2,
    fullname: 'Modern Application Development II - Project',
  },
  java: {
    credit: 4,
    fullname: 'Programming Concepts using Java',
  },
  sc: {
    credit: 3,
    fullname: 'System Commands',
  },
  mlf: {
    credit: 4,
    fullname: 'Machine Learning Foundations',
  },
  mlt: {
    credit: 4,
    fullname: 'Machine Learning Techniques',
  },
  mlp: {
    credit: 4,
    fullname: 'Machine Learning Practice',
  },
  mlpProj: {
    credit: 2,
    fullname: 'Machine Learning Practice - Project',
  },
  bdm: {
    credit: 4,
    fullname: 'Business Data Management',
  },
  bdmProj: {
    credit: 2,
    fullname: 'Business Data Management - Project',
  },
  ba: {
    credit: 4,
    fullname: 'Business Analytics',
  },
  tds: {
    credit: 3,
    fullname: 'Tools in Data Science',
  },
  dl: {
    credit: 4,
    fullname: 'Introduction to Deep Learning and Generative AI',
  },
  dlProj: {
    credit: 2,
    fullname: 'Deep Learning and Generative AI - Project',
  },
};

const coursesArr = Object.keys(courses);

coursesArr.forEach(course => {
  // const html = `
  //         <tr>
  //           <td class="course-name">${courses[course].fullname}</td>
  //           <td>${courses[course].credit}</td>
  //           <td>
  //             <select id="${course}-input" onchange="calculate()">
  //               <option value="" selected>Not done</option>
  //               <option value="s">S</option>
  //               <option value="a">A</option>
  //               <option value="b">B</option>
  //               <option value="c">C</option>
  //               <option value="d">D</option>
  //               <option value="e">E</option>
  //             </select>
  //           </td>
  //         </tr>
  // `;
  // document.querySelector('tbody').innerHTML += html;

  const template = document.querySelector('#tr-template');
  const clone = template.content.cloneNode(true);

  clone.querySelector('.course-name').innerText = courses[course].fullname;
  clone.querySelector('.course-credit').innerText = courses[course].credit;
  clone.querySelector('select').id = `${course}-input`;

  document.querySelector('tbody').append(clone);
});

function calculate() {
  const grades = {};
  let numerator = 0;
  let denominator = 0;
  coursesArr.forEach(course => {
    const grade = document.querySelector(`#${course}-input`).value;
    grades[course] = grade;
    if (grade != '') {
      numerator += points[grade] * courses[course].credit;
      denominator += courses[course].credit;
    }
  });

  const cgpa = numerator / denominator;
  document.querySelector('#result').innerText = `CGPA: ${cgpa.toFixed(2)}`;
  saveToLocalStorage(grades);
}

function saveToLocalStorage(grades) {
  localStorage.setItem('grades', JSON.stringify(grades));
}

function restoreFromLocalStorage() {
  coursesArr.forEach(course => {
    // document.querySelector(`#${course}-input`).value = grades[course];
  });
}

restoreFromLocalStorage();
