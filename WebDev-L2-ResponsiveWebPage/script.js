const STORES = ['Soweto Market', 'Choppies', 'Shoprite', 'Pick n Pay'];
// Sample data: prices in Kwacha, in the same order as STORES
const DATA = {
  personal: [
    { name: 'Mealie meal 25kg', prices: [255, 279, 285, 292] },
    { name: 'Cooking oil 2L', prices: [90, 97, 99, 103] },
    { name: 'Sugar 2kg', prices: [62, 66, 68, 71] }
  ],
  business: [
    { name: 'Mealie meal 50kg', prices: [480, 520, 535, 548] },
    { name: 'Cooking oil 20L', prices: [820, 880, 905, 940] },
    { name: 'Sugar 50kg', prices: [1450, 1540, 1580, 1620] }
  ]
};

let mode = 'personal';
let basket = [];
const $ = (id) => document.getElementById(id);

function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('show'), 2200);
}

function card(item) {
  const rows = STORES.map((s, i) => ({ s, p: item.prices[i] })).sort((a, b) => a.p - b.p);
  const best = rows[0], worst = rows[rows.length - 1];
  const save = Math.round(((worst.p - best.p) / worst.p) * 100);
  const list = rows.map((r, i) => i === 0
    ? `<div class="store best"><span>${r.s} <span class="chip">BEST PRICE</span></span><b>K${r.p}</b></div>`
    : `<div class="store"><span>${r.s}</span><b>K${r.p}</b></div>`).join('');
  return `<div class="col-12 col-md-6 col-lg-4"><div class="card-p">
    <div class="save">SAVE<br>${save}%</div>
    <h3>${item.name}</h3>
    <p class="cheap">Cheapest: K${best.p} at ${best.s} · save up to ${save}%</p>
    ${list}
    <div class="actions">
      <button class="link" data-report="${item.name}">Report a wrong price</button>
      <button class="btn-add" data-add="${item.name}" data-price="${best.p}">Add to basket</button>
    </div></div></div>`;
}

function renderPrices() {
  const q = $('search').value.trim().toLowerCase();
  const items = DATA[mode].filter((i) => i.name.toLowerCase().includes(q));
  $('priceList').innerHTML = items.map(card).join('');
  $('empty').classList.toggle('d-none', items.length > 0);
}

function renderBasket() {
  const total = basket.reduce((sum, i) => sum + i.price, 0);
  $('basketBar').classList.toggle('d-none', basket.length === 0);
  $('basketText').textContent = `Basket: ${basket.length} item${basket.length === 1 ? '' : 's'} · K${total}`;
}

// Personal / Business toggle
$('mode').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  mode = b.dataset.mode;
  document.querySelectorAll('#mode button').forEach((x) => x.classList.toggle('active', x === b));
  renderPrices();
});

// Bottom tab navigation
$('tabs').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  document.querySelectorAll('#tabs button').forEach((x) => x.classList.toggle('active', x === b));
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === b.dataset.view));
  window.scrollTo({ top: 0 });
});

// Add to basket / report a price
document.addEventListener('click', (e) => {
  const add = e.target.closest('[data-add]');
  const rep = e.target.closest('[data-report]');
  if (add) {
    basket.push({ name: add.dataset.add, price: Number(add.dataset.price) });
    renderBasket();
    toast(`${add.dataset.add} added to basket`);
  }
  if (rep) toast(`Thanks! We will check the ${rep.dataset.report} price.`);
});
$('clearBasket').addEventListener('click', () => { basket = []; renderBasket(); });
$('search').addEventListener('input', renderPrices);

// Margin calculator with validation
$('calc').addEventListener('click', () => {
  const cost = parseFloat($('cost').value), sell = parseFloat($('sell').value);
  const err = $('marginErr'), out = $('result');
  out.textContent = '';
  if (isNaN(cost) || isNaN(sell) || cost <= 0 || sell <= 0) {
    err.textContent = 'Enter a cost and selling price greater than 0.';
    return;
  }
  err.textContent = '';
  const profit = sell - cost, margin = (profit / sell) * 100;
  out.style.color = profit >= 0 ? '#1a8a4a' : '#d6202e';
  out.textContent = `${profit >= 0 ? 'Profit' : 'Loss'}: K${Math.abs(profit).toFixed(2)} per unit · margin ${margin.toFixed(1)}%`;
});

// Account form validation
function setError(inputId, errId, msg) {
  $(inputId).classList.toggle('is-invalid', !!msg);
  $(errId).textContent = msg;
  return !msg;
}
function validate(needAge) {
  const email = $('email').value.trim(), pass = $('pass').value;
  const okEmail = setError('email', 'emailErr',
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email, like name@company.com.');
  const okPass = setError('pass', 'passErr', pass.length >= 8 ? '' : 'Password must be at least 8 characters.');
  const okAge = !needAge || setError('age', 'ageErr', $('age').checked ? '' : 'Confirm you are 18 or older to continue.');
  return okEmail && okPass && okAge;
}
$('create').addEventListener('click', () => { if (validate(true)) toast('Account created. Welcome to Mitengo!'); });
$('signin').addEventListener('click', () => { if (validate(false)) toast('Signed in. Welcome back!'); });

// Wholesale tab always shows bulk packs
$('bulkList').innerHTML = DATA.business.map(card).join('');
renderPrices();
