const form = document.querySelector('#resumeForm');
const roleInput = document.querySelector('#roleInput');
const experienceInput = document.querySelector('#experienceInput');
const jobInput = document.querySelector('#jobInput');
const analyzeButton = document.querySelector('#analyzeButton');
const clearButton = document.querySelector('#clearButton');
const copyButton = document.querySelector('#copyButton');
const saveButton = document.querySelector('#saveButton');
const bulletList = document.querySelector('#bulletList');
const keywordOutput = document.querySelector('#keywordOutput');
const scoreText = document.querySelector('#scoreText');
const scoreRing = document.querySelector('#scoreRing');

const skillKeywords = [
  'communication', 'leadership', 'research', 'writing', 'customer service',
  'organization', 'scheduling', 'data', 'analysis', 'sales', 'marketing',
  'legal', 'filing', 'client', 'project management', 'teamwork', 'microsoft',
  'excel', 'social media', 'problem solving', 'attention to detail', 'operations',
  'billing', 'records', 'training', 'inventory', 'administrative'
];

const actionVerbs = [
  'Coordinated', 'Managed', 'Improved', 'Supported', 'Organized', 'Prepared',
  'Streamlined', 'Assisted', 'Communicated', 'Maintained'
];

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

function generateBullets() {
  const role = cleanText(roleInput.value) || 'target role';
  const experienceItems = splitExperience(experienceInput.value);
  const jobKeywords = findKeywords(jobInput.value);
  const selectedKeywords = jobKeywords.length ? jobKeywords.slice(0, 4) : ['accuracy', 'communication', 'organization'];

  if (!experienceItems.length) {
    bulletList.innerHTML = '<li>Please add your experience first.</li>';
    return [];
  }

  const bullets = experienceItems.slice(0, 5).map((item, index) => {
    const verb = actionVerbs[index % actionVerbs.length];
    const keyword = selectedKeywords[index % selectedKeywords.length];
    return `${verb} ${item.toLowerCase()} to strengthen ${keyword} and support success in a ${role} position.`;
  });

  bulletList.innerHTML = bullets.map(bullet => `<li>${bullet}</li>`).join('');
  return bullets;
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
    bullets: [...bulletList.querySelectorAll('li')].map(li => li.textContent),
    savedAt: new Date().toLocaleString()
  };
  localStorage.setItem('resumeMatchStudioSave', JSON.stringify(savedData));
  saveButton.textContent = 'Saved';
  setTimeout(() => (saveButton.textContent = 'Save Result'), 1200);
});

window.addEventListener('load', () => {
  const saved = localStorage.getItem('resumeMatchStudioSave');
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    if (data.role) roleInput.value = data.role;
    if (data.experience) experienceInput.value = data.experience;
    if (data.job) jobInput.value = data.job;
    if (data.bullets?.length) {
      bulletList.innerHTML = data.bullets.map(bullet => `<li>${bullet}</li>`).join('');
    }
  } catch (error) {
    localStorage.removeItem('resumeMatchStudioSave');
  }
});
