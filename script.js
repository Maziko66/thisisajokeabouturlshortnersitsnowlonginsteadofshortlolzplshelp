const DOMAIN = 'thisisajokeabouturlshortnersitsnowlonginsteadofshortlolzplshelp.com';

// ── Encode / Decode ──────────────────────────────────────────────────────────

function encodeUrl(url) {
  return btoa(url)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function decodeUrl(code) {
  try {
    const padded = code + '='.repeat((4 - code.length % 4) % 4);
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

  const code = encodeUrl(url);
  const longUrl = `${DOMAIN}/#${code}`;

  resultLink.textContent = longUrl;
  resultLink.href = `#${code}`;
  resultBox.classList.remove('hidden');
});

copyBtn.addEventListener('click', () => {
  copyText(resultLink.textContent);
});
