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
  },
  BSMS2002: {
    credit: 4,
    fullname: 'Business Analytics',
    level: 'diploma-ds',
  },
  BSDA2001: {
    credit: 4,
    fullname: 'Introduction to Deep Learning and Generative AI',
    level: 'diploma-ds',
  },
  BSDA2001P: {
    credit: 2,
    fullname: 'Deep Learning and Generative AI - Project',
    level: 'diploma-ds',
  },

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

  // ===== Degree Electives (Dummy) =====
  Elective1: {
    credit: 4,
    fullname: 'Elective 1',
    level: 'degree',
  },
  Elective2: {
    credit: 4,
    fullname: 'Elective 2',
    level: 'degree',
  },
  Elective3: {
    credit: 4,
    fullname: 'Elective 3',
    level: 'degree',
  },
  Elective4: {
    credit: 4,
    fullname: 'Elective 4',
    level: 'degree',
  },
  Elective5: {
    credit: 4,
    fullname: 'Elective 5',
    level: 'degree',
  },
  Elective6: {
    credit: 4,
    fullname: 'Elective 6',
    level: 'degree',
  },
  Elective7: {
    credit: 4,
    fullname: 'Elective 7',
    level: 'degree',
  },
  Elective8: {
    credit: 4,
    fullname: 'Elective 8',
    level: 'degree',
  },
  Elective9: {
    credit: 4,
    fullname: 'Elective 9',
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

function loadSampleJson() {
  const sample = {
    BSHS1001: 'S',
    BSMA1001: 'C',
    BSMA1002: 'C',
    BSCS1001: 'B',
    BSHS1002: 'A',
    BSMA1003: 'D',
    BSCS1002: 'D',
    BSMA1004: 'B',
    BSCS2001: 'D',
    BSCS2002: 'C',
    BSCS2003: 'B',
    BSCS2003P: 'S',
    BSCS2006: 'D',
    BSCS2006P: 'A',
    BSSE2001: 'C',
  };
  document.querySelector('.json-input textarea').value = JSON.stringify(sample, null, 2);
}
