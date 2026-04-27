const form = document.querySelector('#resumeForm');
const roleInput = document.querySelector('#roleInput');
const experienceInput = document.querySelector('#experienceInput');
const jobInput = document.querySelector('#jobInput');
const toneSelect = document.querySelector('#toneSelect');
const bulletCountSelect = document.querySelector('#bulletCountSelect');
const analyzeButton = document.querySelector('#analyzeButton');
const clearButton = document.querySelector('#clearButton');
const copyButton = document.querySelector('#copyButton');
const saveButton = document.querySelector('#saveButton');
const bulletList = document.querySelector('#bulletList');
const keywordOutput = document.querySelector('#keywordOutput');
const scoreText = document.querySelector('#scoreText');
const scoreRing = document.querySelector('#scoreRing');

const jobSearchForm = document.querySelector('#jobSearchForm');
const jobTitleInput = document.querySelector('#jobTitleInput');
const locationInput = document.querySelector('#locationInput');
const jobKeywordInput = document.querySelector('#jobKeywordInput');
const jobResults = document.querySelector('#jobResults');
const quickRemoteButton = document.querySelector('#quickRemoteButton');

const skillKeywords = [
  'communication', 'leadership', 'research', 'writing', 'customer service',
  'organization', 'scheduling', 'data', 'analysis', 'sales', 'marketing',
  'legal', 'filing', 'client', 'project management', 'teamwork', 'microsoft',
  'excel', 'social media', 'problem solving', 'attention to detail', 'operations',
  'billing', 'records', 'training', 'inventory', 'administrative', 'crm',
  'case management', 'contracts', 'deadlines', 'reporting', 'customer', 'office',
  'documentation', 'compliance', 'calendar', 'coordination', 'database'
];

const actionVerbs = [
  'Coordinated', 'Managed', 'Improved', 'Supported', 'Organized', 'Prepared',
  'Streamlined', 'Assisted', 'Communicated', 'Maintained', 'Tracked', 'Reviewed',
  'Updated', 'Built', 'Researched', 'Monitored'
];

const bulletOpeners = {
  professional: [
    'to support daily operations and strengthen',
    'while maintaining accuracy across',
    'to improve workflow consistency and support',
    'while communicating clearly with internal and external stakeholders'
  ],
  impact: [
    'to reduce friction, improve follow-through, and strengthen',
    'to create a more organized process for',
    'to increase efficiency and support measurable progress in',
    'to turn scattered information into usable action for'
  ],
  entry: [
    'while building practical experience in',
    'to support team goals and develop stronger skills in',
    'while learning workplace systems related to',
    'to contribute reliable support for'
  ],
  leadership: [
    'by guiding priorities, clarifying next steps, and supporting',
    'while coordinating people, deadlines, and details related to',
    'to keep projects moving and strengthen accountability around',
    'by organizing responsibilities and improving communication across'
  ]
};

function cleanText(text) {
  return text.trim().replace(/\s+/g, ' ');
}

function splitExperience(text) {
  return text
    .split(/[.,;\n]+/)
    .map(item => cleanText(item))
    .filter(item => item.length > 2);
}

function findKeywords(text) {
  const lowerText = text.toLowerCase();
  return skillKeywords.filter(keyword => lowerText.includes(keyword));
}

function makeSearchQuery() {
  const title = cleanText(jobTitleInput.value);
  const location = cleanText(locationInput.value);
  const extras = cleanText(jobKeywordInput.value);
  return { title, location, extras, combined: [title, extras].filter(Boolean).join(' ') };
}

function buildJobLinks(remoteOverride = false) {
  const { title, location, extras, combined } = makeSearchQuery();
  const finalLocation = remoteOverride ? 'Remote' : location;

  if (!title || !finalLocation) {
    jobResults.innerHTML = '<p class="placeholder">Add a role and location first.</p>';
    return;
  }

  const encodedTitle = encodeURIComponent(combined || title);
  const encodedLocation = encodeURIComponent(finalLocation);
  const googleQuery = encodeURIComponent(`${combined || title} jobs ${finalLocation}`);

  const links = [
    {
      name: 'Search LinkedIn Jobs',
      note: 'Opens a LinkedIn search using your title and location.',
      url: `https://www.linkedin.com/jobs/search/?keywords=${encodedTitle}&location=${encodedLocation}`
    },
    {
      name: 'Search ZipRecruiter',
      note: 'Opens a ZipRecruiter search using your title and location.',
      url: `https://www.ziprecruiter.com/jobs-search?search=${encodedTitle}&location=${encodedLocation}`
    },
    {
      name: 'Search Google Jobs',
      note: 'Useful backup search for live postings across job boards.',
      url: `https://www.google.com/search?q=${googleQuery}`
    }
  ];

  jobResults.innerHTML = links.map(link => `
    <article class="job-card">
      <h3>${link.name}</h3>
      <p>${link.note}</p>
      <a class="button secondary" href="${link.url}" target="_blank" rel="noopener noreferrer">Open Search</a>
    </article>
  `).join('');

  localStorage.setItem('hireMeJobSearch', JSON.stringify({ title, location: finalLocation, extras }));
}

function generateBullets() {
  const role = cleanText(roleInput.value) || 'target role';
  const experienceItems = splitExperience(experienceInput.value);
  const jobKeywords = findKeywords(jobInput.value);
  const selectedKeywords = jobKeywords.length ? jobKeywords : ['accuracy', 'communication', 'organization', 'workflow'];
  const tone = toneSelect.value;
  const desiredCount = Number(bulletCountSelect.value);
  const connectors = bulletOpeners[tone] || bulletOpeners.professional;

  if (!experienceItems.length) {
    bulletList.innerHTML = '<li>Please add your experience first.</li>';
    return [];
  }

  const bullets = [];
  for (let index = 0; index < desiredCount; index += 1) {
    const item = experienceItems[index % experienceItems.length];
    const verb = actionVerbs[index % actionVerbs.length];
    const keyword = selectedKeywords[index % selectedKeywords.length];
    const connector = connectors[index % connectors.length];
    const detail = item.charAt(0).toLowerCase() + item.slice(1);
    bullets.push(`${verb} ${detail} ${connector} ${keyword} in a ${role} role.`);
  }

  const uniqueBullets = [...new Set(bullets)];
  bulletList.innerHTML = uniqueBullets.map(bullet => `<li>${bullet}</li>`).join('');
  return uniqueBullets;
}

function analyzeMatch() {
  const experienceText = experienceInput.value.toLowerCase();
  const jobText = jobInput.value.toLowerCase();

  if (!jobText.trim()) {
    keywordOutput.textContent = 'Please paste a job description first.';
    return;
  }

  const jobKeywords = findKeywords(jobText);
  const matched = jobKeywords.filter(keyword => experienceText.includes(keyword));
  const missing = jobKeywords.filter(keyword => !experienceText.includes(keyword));
  const score = jobKeywords.length ? Math.round((matched.length / jobKeywords.length) * 100) : 0;

  scoreText.textContent = jobKeywords.length ? `${score}% keyword match` : 'No tracked keywords found';
  scoreRing.textContent = jobKeywords.length ? `${score}%` : '--';
  scoreRing.style.background = `conic-gradient(var(--olive) ${score * 3.6}deg, rgba(31, 29, 27, 0.14) 0deg)`;

  if (!jobKeywords.length) {
    keywordOutput.textContent = 'No common tracked keywords were found. Try pasting a longer job description.';
    return;
  }

  const matchedHTML = matched.map(keyword => `<span class="keyword-pill">Matched: ${keyword}</span>`).join('');
  const missingHTML = missing.map(keyword => `<span class="keyword-pill missing">Add if true: ${keyword}</span>`).join('');

  keywordOutput.innerHTML = matchedHTML + missingHTML;
}

jobSearchForm.addEventListener('submit', event => {
  event.preventDefault();
  buildJobLinks(false);
});

quickRemoteButton.addEventListener('click', () => {
  if (!locationInput.value.trim()) locationInput.value = 'Remote';
  buildJobLinks(true);
});

form.addEventListener('submit', event => {
  event.preventDefault();
  generateBullets();
  analyzeMatch();
});

analyzeButton.addEventListener('click', analyzeMatch);

clearButton.addEventListener('click', () => {
  form.reset();
  bulletList.innerHTML = '<li>Your generated bullets will appear here.</li>';
  keywordOutput.textContent = 'Add a job description and click “Analyze Job Match.”';
  scoreText.textContent = 'Waiting for input';
  scoreRing.textContent = '--';
  scoreRing.style.background = 'conic-gradient(var(--olive) 0deg, rgba(31, 29, 27, 0.14) 0deg)';
});

copyButton.addEventListener('click', async () => {
  const bullets = [...bulletList.querySelectorAll('li')].map(li => `• ${li.textContent}`).join('\n');
  try {
    await navigator.clipboard.writeText(bullets);
    copyButton.textContent = 'Copied';
    setTimeout(() => (copyButton.textContent = 'Copy'), 1200);
  } catch (error) {
    alert('Copy did not work in this browser. You can highlight the bullets manually.');
  }
});

saveButton.addEventListener('click', () => {
  const savedData = {
    role: roleInput.value,
    experience: experienceInput.value,
    job: jobInput.value,
    tone: toneSelect.value,
    count: bulletCountSelect.value,
    bullets: [...bulletList.querySelectorAll('li')].map(li => li.textContent),
    savedAt: new Date().toLocaleString()
  };
  localStorage.setItem('resumeMatchStudioSave', JSON.stringify(savedData));
  saveButton.textContent = 'Saved';
  setTimeout(() => (saveButton.textContent = 'Save Result'), 1200);
});

window.addEventListener('load', () => {
  const saved = localStorage.getItem('resumeMatchStudioSave');
  const savedSearch = localStorage.getItem('hireMeJobSearch');

  if (savedSearch) {
    try {
      const data = JSON.parse(savedSearch);
      jobTitleInput.value = data.title || '';
      locationInput.value = data.location || '';
      jobKeywordInput.value = data.extras || '';
    } catch (error) {
      localStorage.removeItem('hireMeJobSearch');
    }
  }

  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    if (data.role) roleInput.value = data.role;
    if (data.experience) experienceInput.value = data.experience;
    if (data.job) jobInput.value = data.job;
    if (data.tone) toneSelect.value = data.tone;
    if (data.count) bulletCountSelect.value = data.count;
    if (data.bullets?.length) {
      bulletList.innerHTML = data.bullets.map(bullet => `<li>${bullet}</li>`).join('');
    }
  } catch (error) {
    localStorage.removeItem('resumeMatchStudioSave');
  }
});
