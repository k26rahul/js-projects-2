fetchAndRenderProjects();
initializeThemeToggle();

function prepareProject(project) {
  const createdDate = new Date(project.created);
  const daysSinceCreation = (new Date() - createdDate) / (1000 * 60 * 60 * 24);

  return {
    ...project,
    // Convert ISO created date to human-readable
    created: createdDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),

    // Split tags into an array (comma-separated)
    tags: project.meta?.tags ? project.meta.tags.split(',').map(tag => tag.trim()) : [],

    // Add isNew flag for projects created in last 10 days
    isNew: daysSinceCreation <= 10,

    // Add screenshot and preview URLs
    screenshotUrl: `${project.slug}/screenshot.jpg`,
    previewUrl: project.slug,
  };
}

function fetchAndRenderProjects() {
  let projectTemplate = document.querySelector('#project-template').innerHTML;

  fetch('./assets/projects_data.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(project => {
        const html = Mustache.render(projectTemplate, prepareProject(project));
        document.querySelector('.projects-container').innerHTML += html;
      });
    });
}

function initializeThemeToggle() {
  const themeToggle = document.querySelector('#theme-toggle');

  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-theme');
    const isDark = document.documentElement.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}
