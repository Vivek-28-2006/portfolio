const heroName = document.getElementById('heroName');
const heroTitle = document.getElementById('heroTitle');
const heroSummary = document.getElementById('heroSummary');
const availability = document.getElementById('availability');
const statsGrid = document.getElementById('statsGrid');
const socialLinks = document.getElementById('socialLinks');
const skillsGrid = document.getElementById('skillsGrid');
const projectsGrid = document.getElementById('projectsGrid');
const experienceGrid = document.getElementById('experienceGrid');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const primaryCta = document.getElementById('primaryCta');
const secondaryCta = document.getElementById('secondaryCta');
const locationText = document.getElementById('location');
const bioText = document.getElementById('bioText');

function createTag(text) {
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = text;
  return tag;
}

function renderStats(stats = []) {
  statsGrid.innerHTML = '';

  stats.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'stat-card';
    card.innerHTML = `
      <span class="stat-value">${item.value}</span>
      <span class="stat-label">${item.label}</span>
    `;
    statsGrid.appendChild(card);
  });
}

function renderSocialLinks(social = []) {
  socialLinks.innerHTML = '';

  social.forEach((item) => {
    const link = document.createElement('a');
    link.href = item.href;
    link.target = item.href.startsWith('mailto:') ? '_self' : '_blank';
    link.rel = 'noreferrer';
    link.textContent = item.label;
    socialLinks.appendChild(link);
  });
}

function renderSkills(skills = []) {
  skillsGrid.innerHTML = '';

  skills.forEach((skill) => {
    const card = document.createElement('article');
    card.className = 'chip';
    card.appendChild(createTag(skill.category));

    const title = document.createElement('strong');
    title.textContent = skill.name;

    const level = document.createElement('small');
    level.textContent = skill.level;

    card.appendChild(title);
    card.appendChild(level);
    skillsGrid.appendChild(card);
  });
}

function renderProjects(projects = []) {
  projectsGrid.innerHTML = '';

  projects.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'project-card';

    const header = document.createElement('header');
    const heading = document.createElement('div');

    const projectTitle = document.createElement('h3');
    projectTitle.textContent = project.title;

    const meta = document.createElement('p');
    meta.className = 'project-meta';
    meta.textContent = project.category;

    heading.appendChild(projectTitle);
    heading.appendChild(meta);
    header.appendChild(heading);

    if (project.featured) {
      header.appendChild(createTag('Featured'));
    }

    const summary = document.createElement('p');
    summary.textContent = project.summary;

    const impact = document.createElement('p');
    impact.textContent = project.impact;

    const tags = document.createElement('div');
    tags.className = 'tag-row';
    project.techStack.forEach((tech) => tags.appendChild(createTag(tech)));

    const links = document.createElement('div');
    links.className = 'project-links';
    links.innerHTML = `
      <a href="${project.link}" target="_blank" rel="noreferrer">Live demo</a>
      <a href="${project.repo}" target="_blank" rel="noreferrer">Source code</a>
    `;

    card.appendChild(header);
    card.appendChild(summary);
    card.appendChild(impact);
    card.appendChild(tags);
    card.appendChild(links);
    projectsGrid.appendChild(card);
  });
}

function renderExperience(items = []) {
  experienceGrid.innerHTML = '';

  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'timeline-item';

    card.innerHTML = `
      <p class="timeline-meta">${item.period}</p>
      <h3>${item.role}</h3>
      <p>${item.company}</p>
      <p>${item.summary}</p>
    `;

    const list = document.createElement('ul');
    list.className = 'timeline-list';
    item.highlights.forEach((highlight) => {
      const li = document.createElement('li');
      li.textContent = highlight;
      list.appendChild(li);
    });

    card.appendChild(list);
    experienceGrid.appendChild(card);
  });
}

function setHeroContent(profile) {
  heroName.textContent = profile.name;
  heroTitle.textContent = profile.role;
  heroSummary.textContent = profile.headline;
  availability.textContent = profile.availability;
  locationText.textContent = profile.location;
  bioText.textContent = profile.summary;
  primaryCta.textContent = profile.cta.primary;
  secondaryCta.textContent = profile.cta.secondary;
  renderStats(profile.stats);
  renderSocialLinks(profile.social);
}

function setupRevealObserver() {
  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

async function loadPortfolio() {
  try {
    const response = await fetch('/portfolio');

    if (!response.ok) {
      throw new Error('Unable to load portfolio content.');
    }

    const data = await response.json();
    setHeroContent(data.profile);
    renderSkills(data.skills);
    renderProjects(data.projects);
    renderExperience(data.experience);
    setupRevealObserver();
  } catch (error) {
    formStatus.textContent = 'Portfolio content could not be loaded right now.';
    console.error(error);
  }
}

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formStatus.textContent = 'Sending message...';

  const formData = new FormData(contactForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Unable to submit contact form.');
    }

    contactForm.reset();
    formStatus.textContent = data.message;
  } catch (error) {
    formStatus.textContent = error.message;
  }
});

loadPortfolio();
