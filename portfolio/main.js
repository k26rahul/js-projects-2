let projectTemplate = document.querySelector('#project-template').innerHTML;

fetch('./portfolio/projectsData.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(project => {
      let html = micromustache.render(projectTemplate, project);
      document.querySelector('.projects-container').innerHTML += html;
    });
  });
