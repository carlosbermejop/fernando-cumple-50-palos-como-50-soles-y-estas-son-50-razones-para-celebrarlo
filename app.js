// Fernando cumple 50 años como 50 soles.
// One reason on screen at a time. No index is ever shown, so a short list
// reads as a long one.

// Relative on purpose: works at / and at /<repo-name>/ on GitHub Pages alike.
const REASONS_URL = 'data/reasons.json';
const PHOTO_URL = 'assets/fernando.jpg';

const FALLBACK = 'Fernando cumple 50 años, y eso ya es motivo de sobra.';

const reasonEl = document.getElementById('reason');
const buttonEl = document.getElementById('another');
const photoEl = document.getElementById('photo');
const photoImgEl = document.getElementById('photo-img');

/**
 * Draws reasons without repeats: a shuffled queue is consumed one at a time and
 * only reshuffled once empty, so nothing repeats until everything has been seen
 * and never back-to-back across a reshuffle.
 */
function createBag(items) {
  let queue = [];
  let current;

  const refill = () => {
    queue = shuffle(items);
    // Avoid handing back the reason already on screen as the next one.
    if (queue.length > 1 && queue[0] === current) {
      const swap = 1 + Math.floor(Math.random() * (queue.length - 1));
      [queue[0], queue[swap]] = [queue[swap], queue[0]];
    }
  };

  return () => {
    if (queue.length === 0) refill();
    current = queue.shift();
    return current;
  };
}

function shuffle(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function show(text) {
  reasonEl.textContent = text;
}

// Only reveal the frame if the photo is actually there, so an absent file shows
// nothing rather than a broken-image icon.
function maybeShowPhoto() {
  const probe = new Image();
  probe.onload = () => {
    photoImgEl.src = PHOTO_URL;
    photoEl.hidden = false;
  };
  probe.src = PHOTO_URL;
}

async function loadReasons() {
  const response = await fetch(REASONS_URL, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('reasons.json is not an array');

  return data.filter((item) => typeof item === 'string' && item.trim() !== '');
}

async function init() {
  maybeShowPhoto();

  let reasons;
  try {
    reasons = await loadReasons();
  } catch (error) {
    // Most likely cause: opened over file://, where fetch is blocked.
    // Serve it instead: python3 -m http.server 8000
    console.error('No se pudieron cargar las razones:', error);
    show(FALLBACK);
    buttonEl.disabled = true;
    return;
  }

  if (reasons.length === 0) {
    show(FALLBACK);
    buttonEl.disabled = true;
    return;
  }

  const draw = createBag(reasons);
  show(draw());
  buttonEl.addEventListener('click', () => show(draw()));
}

init();
