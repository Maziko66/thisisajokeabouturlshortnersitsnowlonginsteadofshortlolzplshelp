const DOMAIN = 'thisisajokeabouturlshortnersitsnowlonginsteadofshortlolzplshelp.com';

// ── Encode / Decode ──────────────────────────────────────────────────────────

function encodeUrl(url, noiseLen) {
  const code = btoa(url)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return noiseLen > 0 ? code + '.' + generateNoise(code, noiseLen) : code;
}

function generateNoise(seed, len) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  let out = '';
  for (let i = 0; i < len; i++) {
    h = Math.imul(h ^ (h >>> 13), 0x9e3779b9) | 0;
    out += chars[(h >>> 0) % chars.length];
  }
  return out;
}

function decodeUrl(code) {
  try {
    const actual = code.split('.')[0];
    const padded = actual + '='.repeat((4 - actual.length % 4) % 4);
    return atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  } catch {
    return null;
  }
}

// ── Redirect on load ─────────────────────────────────────────────────────────

const hash = location.hash.slice(1);
if (hash) {
  const url = decodeUrl(hash);
  if (url && /^https?:\/\/.+/.test(url)) {
    location.replace(url);
  } else {
    document.getElementById('loader').classList.add('hidden');
    document.querySelector('.container').classList.remove('hidden');
  }
} else {
  document.getElementById('loader').classList.add('hidden');
  document.querySelector('.container').classList.remove('hidden');
}

// ── UI helpers ───────────────────────────────────────────────────────────────

const form       = document.getElementById('shorten-form');
const urlInput   = document.getElementById('url-input');
const errorMsg   = document.getElementById('error-msg');
const resultBox  = document.getElementById('result-box');
const resultLink = document.getElementById('result-link');
const copyBtn    = document.getElementById('copy-btn');
const toast      = document.getElementById('toast');
const lenBtns    = document.querySelectorAll('.len-btn');

let noiseLen = 0;

lenBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    lenBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    noiseLen = parseInt(btn.dataset.len);
  });
});

let toastTimer = null;

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');
}

function clearError() {
  errorMsg.textContent = '';
  errorMsg.classList.add('hidden');
}

function showToast(msg = 'copied!') {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2000);
}

function copyText(text) {
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }).finally(() => showToast('copied!'));
}

// ── Form submit ───────────────────────────────────────────────────────────────

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearError();
  resultBox.classList.add('hidden');

  let url = urlInput.value.trim();
  if (!url) {
    showError('please enter a url');
    return;
  }

  // auto-prepend https:// if no protocol
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  // validate real domain with TLD
  try {
    const { hostname } = new URL(url);
    if (!/\.[a-zA-Z]{2,63}$/.test(hostname)) {
      showError('please enter a valid url (e.g. example.com)');
      return;
    }
  } catch {
    showError('please enter a valid url (e.g. example.com)');
    return;
  }

  const code = encodeUrl(url, noiseLen);
  const longUrl = `${DOMAIN}/#${code}`;

  resultLink.textContent = longUrl;
  resultLink.href = `#${code}`;
  resultBox.classList.remove('hidden');
});

copyBtn.addEventListener('click', () => {
  copyText(resultLink.textContent);
});
