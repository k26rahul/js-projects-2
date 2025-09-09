const points = {
  s: 10,
  a: 9,
  b: 8,
  c: 7,
  d: 6,
  e: 4,
};

const courses = {
  // ===== Foundation =====
  BSHS1001: {
    credit: 4,
    fullname: 'English I',
    level: 'foundation',
  },
  BSHS1002: {
    credit: 4,
    fullname: 'English II',
    level: 'foundation',
  },
  BSMA1001: {
    credit: 4,
    fullname: 'Mathematics for Data Science I',
    level: 'foundation',
  },
  BSMA1003: {
    credit: 4,
    fullname: 'Mathematics for Data Science II',
    level: 'foundation',
  },
  BSMA1002: {
    credit: 4,
    fullname: 'Statistics for Data Science I',
    level: 'foundation',
  },
  BSMA1004: {
    credit: 4,
    fullname: 'Statistics for Data Science II',
    level: 'foundation',
  },
  BSCS1001: {
    credit: 4,
    fullname: 'Computational Thinking',
    level: 'foundation',
  },
  BSCS1002: {
    credit: 4,
    fullname: 'Programming in Python',
    level: 'foundation',
  },

  // ===== Diploma =====
  BSCS2001: {
    credit: 4,
    fullname: 'Database Management Systems',
    level: 'diploma-dp',
  },
  BSCS2002: {
    credit: 4,
    fullname: 'Programming, Data Structures and Algorithms using Python',
    level: 'diploma-dp',
  },
  BSCS2003: {
    credit: 4,
    fullname: 'Modern Application Development I',
    level: 'diploma-dp',
  },
  BSCS2003P: {
    credit: 2,
    fullname: 'Modern Application Development I - Project',
    level: 'diploma-dp',
  },
  BSCS2006: {
    credit: 4,
    fullname: 'Modern Application Development II',
    level: 'diploma-dp',
  },
  BSCS2006P: {
    credit: 2,
    fullname: 'Modern Application Development II - Project',
    level: 'diploma-dp',
  },
  BSCS2005: {
    credit: 4,
    fullname: 'Programming Concepts using Java',
    level: 'diploma-dp',
  },
  BSSE2001: {
    credit: 3,
    fullname: 'System Commands',
    level: 'diploma-dp',
  },

  BSCS2004: {
    credit: 4,
    fullname: 'Machine Learning Foundations',
    level: 'diploma-ds',
  },

  BSCS2007: {
    credit: 4,
    fullname: 'Machine Learning Techniques',
    level: 'diploma-ds',
  },
  BSCS2008: {
    credit: 4,
    fullname: 'Machine Learning Practice',
    level: 'diploma-ds',
  },
  BSCS2008P: {
    credit: 2,
    fullname: 'Machine Learning Practice - Project',
    level: 'diploma-ds',
  },
  BSSE2002: {
    credit: 3,
    fullname: 'Tools in Data Science',
    level: 'diploma-ds',
  },
  BSMS2001: {
    credit: 4,
    fullname: 'Business Data Management',
    level: 'diploma-ds',
  },
  BSMS2001P: {
    credit: 2,
    fullname: 'Business Data Management - Project',
    level: 'diploma-ds',
  }, // Option 1
  BSMS2002: {
    credit: 4,
    fullname: 'Business Analytics',
    level: 'diploma-ds',
  }, // Option 1
  BSDA2001: {
    credit: 4,
    fullname: 'Introduction to Deep Learning and Generative AI',
    level: 'diploma-ds',
  }, // Option 2
  BSDA2001P: {
    credit: 2,
    fullname: 'Deep Learning and Generative AI - Project',
    level: 'diploma-ds',
  }, // Option 2

  // ===== Degree =====
  BSCS3001: {
    credit: 4,
    fullname: 'Software Engineering',
    level: 'degree',
  },
  BSCS3002: {
    credit: 4,
    fullname: 'Software Testing',
    level: 'degree',
  },
  BSCS3003: {
    credit: 4,
    fullname: 'AI: Search Methods for Problem Solving',
    level: 'degree',
  },
  BSCS3004: {
    credit: 4,
    fullname: 'Deep Learning',
    level: 'degree',
  },
  BSGN3001: {
    credit: 4,
    fullname: 'Strategies for Professional Growth',
    level: 'degree',
  },
};

const coursesArr = Object.keys(courses);

let grades = JSON.parse(localStorage.getItem('grades')) ?? {};

document.addEventListener('DOMContentLoaded', () => {
  initializeTable();
  calculateCGPA();
});

function initializeTable() {
  coursesArr.forEach(course => {
    const template = document.querySelector('#tr-template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('tr').classList.add(courses[course].level);
    clone.querySelector('.course-name').innerText = courses[course].fullname;
    clone.querySelector('.course-credit').innerText = courses[course].credit;

    clone.querySelector('select').id = `${course}-input`;
    clone.querySelector('select').value = grades[course] ?? '';
    clone
      .querySelector('select')
      .addEventListener('change', event => updateGrades(course, event.target.value));

    document.querySelector('tbody').append(clone);
  });
}

function updateGrades(course, grade) {
  grades[course] = grade;
  calculateCGPA();
  saveToLocalStorage();
}

function calculateCGPA() {
  let numerator = 0;
  let denominator = 0;

  coursesArr.forEach(course => {
    const grade = grades[course];
    if (grade) {
      numerator += points[grade] * courses[course].credit;
      denominator += courses[course].credit;
    }
  });

  const cgpa = numerator / denominator || 0;
  document.querySelector('#result').innerText = `CGPA: ${numerator} / ${denominator} = ${
    Math.ceil(cgpa * 100) / 100
  }`;
}

function saveToLocalStorage() {
  localStorage.setItem('grades', JSON.stringify(grades));
}

function importGradesJson() {
  try {
    grades = JSON.parse(document.querySelector('textarea').value);
    coursesArr.forEach(course => {
      if (grades[course]) {
        grades[course] = grades[course].toLowerCase();
      }
      document.querySelector(`#${course}-input`).value = grades[course] ?? '';
    });
    calculateCGPA();
    saveToLocalStorage();
  } catch {
    alert('Invalid JSON');
  }
}
