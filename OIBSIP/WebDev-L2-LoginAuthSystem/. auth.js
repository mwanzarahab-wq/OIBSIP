/* Mitengo login system - front-end only (localStorage + sessionStorage)
   Passwords are salted and hashed with SHA-256 (Web Crypto API). Never stored in plain text. */
(() => {
  'use strict';

  const USERS_KEY = 'mitengo_users';     // all registered accounts (localStorage)
  const SESSION_KEY = 'mitengo_session'; // current login (sessionStorage, cleared on logout)

  const $ = (id) => document.getElementById(id);

  // ----- storage helpers -----
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
  function getSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
    catch (e) { return null; }
  }

  // ----- hashing -----
  const toHex = (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  const makeSalt = () => toHex(crypto.getRandomValues(new Uint8Array(16)));
  async function hashPassword(password, salt) {
    const bytes = new TextEncoder().encode(salt + password);
    return toHex(await crypto.subtle.digest('SHA-256', bytes));
  }
  const cryptoReady = () => !!(window.crypto && window.crypto.subtle);

  // ----- ui helpers -----
  function showMsg(text, type) {
    const box = $('msg');
    box.textContent = text;
    box.className = 'msg ' + type;
    box.hidden = false;
  }
  function hasDigit(s) { return /\d/.test(s); }

  function setupShowButtons() {
    document.querySelectorAll('.show-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = $(btn.dataset.for);
        const hidden = input.type === 'password';
        input.type = hidden ? 'text' : 'password';
        btn.textContent = hidden ? 'Hide' : 'Show';
      });
    });
  }

  // ----- login page -----
  function initLogin() {
    if (getSession()) { location.replace('dashboard.html'); return; }
    if (new URLSearchParams(location.search).get('registered')) {
      showMsg('Account created. Log in with your new details.', 'ok');
    }
    setupShowButtons();

    $('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = $('identifier').value.trim().toLowerCase();
      const password = $('password').value;
      if (!id || !password) { showMsg('Enter your username or email and your password.', 'error'); return; }
      if (!cryptoReady()) { showMsg('This browser blocks secure hashing here. Open the page on https or localhost.', 'error'); return; }

      const btn = $('submit');
      btn.disabled = true;
      try {
        const user = getUsers().find((u) => u.id === id);
        // hash even when the user does not exist so both failures behave the same
        const hash = await hashPassword(password, user ? user.salt : 'no-such-user');
        if (!user || hash !== user.hash) {
          showMsg('Incorrect username/email or password.', 'error'); // does not say which one
          return;
        }
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.display, created: user.created, at: Date.now() }));
        location.href = 'dashboard.html';
      } finally {
        btn.disabled = false;
      }
    });
  }

  // ----- register page -----
  function initRegister() {
    if (getSession()) { location.replace('dashboard.html'); return; }
    setupShowButtons();

    const pw = $('password');
    pw.addEventListener('input', () => {
      $('rule-len').classList.toggle('ok', pw.value.length >= 8);
      $('rule-num').classList.toggle('ok', hasDigit(pw.value));
    });

    $('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const display = $('identifier').value.trim();
      const id = display.toLowerCase();
      const password = pw.value;
      const confirm = $('confirm').value;

      if (!display || !password || !confirm) { showMsg('Fill in every field.', 'error'); return; }
      if (display.length < 3 || /\s/.test(display)) { showMsg('Username or email must be at least 3 characters with no spaces.', 'error'); return; }
      if (display.includes('@') && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(display)) { showMsg('That email address does not look right.', 'error'); return; }
      if (password.length < 8 || !hasDigit(password)) { showMsg('Password needs at least 8 characters and 1 number.', 'error'); return; }
      if (password !== confirm) { showMsg('The two passwords do not match.', 'error'); return; }
      if (!cryptoReady()) { showMsg('This browser blocks secure hashing here. Open the page on https or localhost.', 'error'); return; }

      const users = getUsers();
      if (users.some((u) => u.id === id)) { showMsg('That username or email is already registered. Try logging in.', 'error'); return; }

      const btn = $('submit');
      btn.disabled = true;
      try {
        const salt = makeSalt();
        users.push({ id, display, salt, hash: await hashPassword(password, salt), created: Date.now() });
        saveUsers(users);
        showMsg('Account created. Taking you to the login page...', 'ok');
        setTimeout(() => location.href = 'login.html?registered=1', 1100);
      } finally {
        btn.disabled = false;
      }
    });
  }

  // ----- dashboard (protected) -----
  function initDashboard() {
    const s = getSession();
    if (!s) { location.replace('login.html'); return; }
    const when = (t) => new Date(t).toLocaleString();
    $('who').textContent = s.name;
    $('info-name').textContent = s.name;
    $('info-created').textContent = when(s.created);
    $('info-login').textContent = when(s.at);
    document.body.hidden = false;

    $('logout').addEventListener('click', () => {
      sessionStorage.removeItem(SESSION_KEY);
      location.replace('login.html');
    });
  }

  // back/forward cache could show the dashboard after logout, so re-check
  window.addEventListener('pageshow', (e) => {
    if (e.persisted && document.body.dataset.page === 'dashboard' && !getSession()) location.replace('login.html');
  });

  const page = document.body.dataset.page;
  if (page === 'login') initLogin();
  else if (page === 'register') initRegister();
  else if (page === 'dashboard') initDashboard();
})();
