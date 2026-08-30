const STORAGE_KEY = 'card-pocket.cards.v1';
const dialog = document.querySelector('#card-dialog');
const form = document.querySelector('#card-form');
const grid = document.querySelector('#card-grid');
const emptyState = document.querySelector('#empty-state');
const cardCount = document.querySelector('#card-count');
const template = document.querySelector('#card-template');
const error = document.querySelector('#form-error');
const bankSelect = document.querySelector('#bank-name');
const variantField = document.querySelector('#variant-field');
const variantSelect = document.querySelector('#card-variant');
const pinDialog = document.querySelector('#pin-dialog');
const pinForm = document.querySelector('#pin-form');
const pinInput = document.querySelector('#vault-pin');
const pinError = document.querySelector('#pin-error');
const PIN_STORAGE_KEY = 'card-pocket.pin.v1';

let cards = loadCards();

function loadCards() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
function saveCards() { localStorage.setItem(STORAGE_KEY, JSON.stringify(cards)); }
function digits(value) { return value.replace(/\D/g, ''); }
function grouped(number) { return number.replace(/(.{4})/g, '$1 ').trim(); }
function masked(number) { return `•••• •••• •••• ${number.slice(-4)}`; }
function networkFor(number) { return number.startsWith('4') ? 'visa' : number.startsWith('5') ? 'mastercard' : number.startsWith('6') ? 'rupay' : 'card'; }
function networkText(network) { return network === 'mastercard' ? '' : network === 'card' ? '' : network; }
function bankMark(name) { return name.split(/\s+/).map((word) => word[0]).join('').slice(0, 3).toUpperCase(); }
const LOGO_CLASSES = {
  'State Bank of India': 'logo-sbi', 'Punjab National Bank': 'logo-pnb', 'Canara Bank': 'logo-canara',
  'Union Bank of India': 'logo-union', 'Bank of India': 'logo-boi', 'Indian Bank': 'logo-indian',
  'Central Bank of India': 'logo-central', 'Indian Overseas Bank': 'logo-iob', 'UCO Bank': 'logo-uco',
  'Bank of Maharashtra': 'logo-maharashtra', 'Punjab & Sind Bank': 'logo-psb', 'HDFC Bank': 'logo-hdfc',
  'ICICI Bank': 'logo-icici', 'Kotak Mahindra Bank': 'logo-kotak', 'IndusInd Bank': 'logo-indusind',
  'IDFC FIRST Bank': 'logo-idfc', 'Federal Bank': 'logo-federal', 'Bandhan Bank': 'logo-bandhan',
  'RBL Bank': 'logo-rbl', 'YES Bank': 'logo-yes'
};
const SBI_VARIANT_ART = {
  'AURUM': 'assets/sbi-variants/aurum-hd.png',
  'SBI Card Elite': 'assets/sbi-variants/elite-hd.png',
  'SBI Card Pulse': 'assets/sbi-variants/pulse-hd.png',
  'SimplyCLICK SBI Card': 'assets/sbi-variants/simplyclick-hd.png',
  'SBI Card PRIME': 'assets/sbi-variants/prime-hd.png',
  'SimplySAVE SBI Card': 'assets/sbi-variants/simplysave-hd.png',
  'CASHBACK SBI Card': 'assets/sbi-variants/cashback-hd-v2.png',
  'IndiGo SBI Card ELITE': 'assets/sbi-variants/indigo-elite-hd.png'
};
const AXIS_VARIANT_ART = {
  'IndiGo Axis Bank': 'assets/axis-variants/indigo-axis-bank-ai.png',
  'IndiGo Axis Bank Premium': 'assets/axis-variants/indigo-axis-bank-premium-ai.png',
  'Axis Bank PRIVILEGE': 'assets/axis-variants/axis-bank-privilege-ai.png',
  'Neo Axis Bank': 'assets/axis-variants/neo-axis-bank-ai.png',
  'Flipkart Axis Bank': 'assets/axis-variants/flipkart-axis-bank-ai.png',
  'IndianOil Axis Bank': 'assets/axis-variants/indianoil-axis-bank-ai.png',
  'MyZone Axis Bank': 'assets/axis-variants/myzone-axis-bank-ai.png',
  'Ace Axis Bank': 'assets/axis-variants/ace-axis-bank-ai.png',
  'REWARDS Axis Bank': 'assets/axis-variants/rewards-axis-bank-ai.png',
  'Airtel Axis Bank': 'assets/axis-variants/airtel-axis-bank-ai.png',
  'Horizon Axis Bank': 'assets/axis-variants/horizon-axis-bank-ai.png',
  'Axis Bank Select': 'assets/axis-variants/axis-bank-select-ai.png',
  'Cashback Credit Card': 'assets/axis-variants/cashback-credit-card-ai.png',
  'Magnus Axis Bank': 'assets/axis-variants/magnus-axis-bank-ai.png',
  'Myzone Easy Axis Bank': 'assets/axis-variants/myzone-easy-axis-bank-ai.png',
  'Reserve Axis Bank': 'assets/axis-variants/reserve-axis-bank-ai.png',
  'IndianOil Easy Axis Bank': 'assets/axis-variants/indianoil-easy-axis-bank-ai.png',
  'Atlas Axis Bank': 'assets/axis-variants/atlas-axis-bank-ai.png',
  'AURA Axis Bank': 'assets/axis-variants/aura-axis-bank-ai.png'
};
const ICICI_VARIANT_ART = {
  'Emeralde Private Metal Credit Card': 'assets/icici-variants/emeralde-private-metal-ai.png', 'Times Black Credit Card': 'assets/icici-variants/times-black-ai.png',
  'Emeralde Credit Card': 'assets/icici-variants/emeralde-ai.png', 'Sapphiro Credit Card': 'assets/icici-variants/sapphiro-ai.png', 'Rubyx Credit Card': 'assets/icici-variants/rubyx-ai.png',
  'Coral Credit Card': 'assets/icici-variants/coral-ai.png', 'Platinum Chip Credit Card': 'assets/icici-variants/platinum-chip-ai.png',
  'Adani One Signature Credit Card': 'assets/icici-variants/adani-one-signature-ai.png', 'Adani One Platinum Credit Card': 'assets/icici-variants/adani-one-platinum-ai.png',
  'MakeMyTrip Credit Card': 'assets/icici-variants/makemytrip-ai.png', 'Emirates Emeralde Credit Card': 'assets/icici-variants/emirates-emeralde-ai.png',
  'Emirates Sapphiro Credit Card': 'assets/icici-variants/emirates-sapphiro-ai.png', 'Emirates Skywards Rubyx Credit Card': 'assets/icici-variants/emirates-rubyx-ai.png',
  'HPCL Super Saver Credit Card': 'assets/icici-variants/hpcl-super-saver-ai.png', 'HPCL Coral Credit Card': 'assets/icici-variants/hpcl-coral-ai.png',
  'Expression Credit Card': 'assets/icici-variants/expression-ai.png', 'Amazon Pay Credit Card': 'assets/icici-variants/amazon-pay-ai.png',
  'MakeMyTrip Signature Credit Card': 'assets/icici-variants/makemytrip-signature-ai.png', 'MakeMyTrip Platinum Credit Card': 'assets/icici-variants/makemytrip-platinum-ai.png'
};
const VARIANTS_BY_BANK = { 'State Bank of India': SBI_VARIANT_ART, 'Axis Bank': AXIS_VARIANT_ART, 'ICICI Bank': ICICI_VARIANT_ART };
const DARK_VARIANTS = new Set([...Object.keys(SBI_VARIANT_ART), ...Object.keys(AXIS_VARIANT_ART)]);
const BANK_NAMES = ['State Bank of India', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Punjab & Sind Bank', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'IndusInd Bank', 'IDFC FIRST Bank', 'Federal Bank', 'YES Bank', 'RBL Bank'];
const TRANSPARENT_CROPS = {
  'Bank of Baroda': { src: 'assets/bank-of-baroda-reference.png', x: 20, y: 35, w: 225, h: 84 },
  'Bank of India': { src: 'assets/public-banks-source.jpg', x: 180, y: 0, w: 180, h: 133 },
  'Bank of Maharashtra': { src: 'assets/public-banks-source.jpg', x: 360, y: 0, w: 180, h: 133 },
  'Canara Bank': { src: 'assets/public-banks-source.jpg', x: 540, y: 0, w: 180, h: 133 },
  'Central Bank of India': { src: 'assets/public-banks-source.jpg', x: 0, y: 133, w: 180, h: 133 },
  'Indian Bank': { src: 'assets/public-banks-source.jpg', x: 180, y: 133, w: 180, h: 133 },
  'Indian Overseas Bank': { src: 'assets/public-banks-source.jpg', x: 360, y: 133, w: 180, h: 133 },
  'Punjab & Sind Bank': { src: 'assets/public-banks-source.jpg', x: 540, y: 133, w: 180, h: 133 },
  'Punjab National Bank': { src: 'assets/public-banks-source.jpg', x: 0, y: 266, w: 180, h: 134 },
  'State Bank of India': { src: 'assets/public-banks-source.jpg', x: 185, y: 278, w: 170, h: 104 },
  'UCO Bank': { src: 'assets/public-banks-source.jpg', x: 360, y: 266, w: 180, h: 134 },
  'Union Bank of India': { src: 'assets/public-banks-source.jpg', x: 540, y: 266, w: 180, h: 134 },
  'HDFC Bank': { src: 'assets/private-banks-source.jpg', x: 0, y: 0, w: 256, h: 192 },
  'ICICI Bank': { src: 'assets/private-banks-source.jpg', x: 225, y: 35, w: 285, h: 115 },
  'Kotak Mahindra Bank': { src: 'assets/private-banks-source.jpg', x: 760, y: 42, w: 255, h: 112 },
  'IndusInd Bank': { src: 'assets/private-banks-source.jpg', x: 256, y: 192, w: 256, h: 192 },
  'Bandhan Bank': { src: 'assets/private-banks-source.jpg', x: 512, y: 192, w: 256, h: 192 },
  'Federal Bank': { src: 'assets/private-banks-source.jpg', x: 0, y: 384, w: 256, h: 192 },
  'IDFC FIRST Bank': { src: 'assets/private-banks-source.jpg', x: 256, y: 384, w: 256, h: 192 },
  'RBL Bank': { src: 'assets/private-banks-source.jpg', x: 768, y: 384, w: 256, h: 192 },
  'YES Bank': { src: 'assets/bank-of-baroda-reference.png', x: 20, y: 135, w: 180, h: 95 }
};
function resolveBank(name) {
  const value = String(name || '').toLowerCase();
  return BANK_NAMES.find((bank) => value.includes(bank.toLowerCase()) || bank.toLowerCase().includes(value)) || BANK_NAMES.find((bank) => value.includes(bank.split(' ')[0].toLowerCase())) || name;
}
async function applyTransparentCrop(element, crop) {
  const image = new Image(); image.src = crop.src;
  try {
    await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = crop.w; canvas.height = crop.h;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    const pixels = context.getImageData(0, 0, crop.w, crop.h);
    for (let index = 0; index < pixels.data.length; index += 4) {
      const r = pixels.data[index], g = pixels.data[index + 1], b = pixels.data[index + 2];
      if (r > 238 && g > 238 && b > 238) pixels.data[index + 3] = 0;
    }
    context.putImageData(pixels, 0, 0);
    element.style.background = `url(${canvas.toDataURL('image/png')}) left center / contain no-repeat`;
    element.style.mixBlendMode = 'normal';
  } catch { /* The built-in bank mark remains available if an asset cannot load. */ }
}

function render() {
  grid.innerHTML = '';
  emptyState.hidden = cards.length > 0;
  cardCount.textContent = `${cards.length} card${cards.length === 1 ? '' : 's'}`;
  cards.forEach((card) => {
    const node = template.content.cloneNode(true);
    const article = node.querySelector('.stored-card');
    article.addEventListener('click', (event) => { if (!event.target.closest('button')) article.classList.toggle('is-flipped'); });
    article.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); article.classList.toggle('is-flipped'); } });
    const resolvedBank = resolveBank(card.bankName);
    const variantArt = VARIANTS_BY_BANK[resolvedBank]?.[card.variant];
    if (variantArt) {
      article.classList.add('sbi-variant-card');
      if (DARK_VARIANTS.has(card.variant)) article.classList.add('light-network-mark');
      article.style.setProperty('--card-art', `url("${variantArt}")`);
    }
    node.querySelector('.bank-name').textContent = resolvedBank;
    const bankMarkElement = node.querySelector('.bank-mark');
    bankMarkElement.textContent = bankMark(resolvedBank);
    if (LOGO_CLASSES[resolvedBank]) { bankMarkElement.textContent = ''; bankMarkElement.classList.add(LOGO_CLASSES[resolvedBank]); article.classList.add('brand-logo-card'); }
    if (resolvedBank === 'Axis Bank') { bankMarkElement.textContent = ''; bankMarkElement.classList.add('axis-logo'); article.classList.add('axis-bank-card'); }
    if (resolvedBank === 'Bank of Baroda') { bankMarkElement.textContent = ''; bankMarkElement.classList.add('baroda-logo'); article.classList.add('brand-logo-card'); }
    if (TRANSPARENT_CROPS[resolvedBank]) { bankMarkElement.textContent = ''; article.classList.add('brand-logo-card'); applyTransparentCrop(bankMarkElement, TRANSPARENT_CROPS[resolvedBank]); }
    node.querySelector('.holder-name').textContent = card.holderName;
    node.querySelector('.expiry').textContent = '•••  ·  ••/••';
    node.querySelector('.number').textContent = masked(card.cardNumber);
    const network = node.querySelector('.front-network');
    const kind = networkFor(card.cardNumber);
    network.classList.add(kind); network.textContent = networkText(kind);
    node.querySelector('.reveal-action').addEventListener('click', (event) => {
      const button = event.currentTarget; const number = article.querySelector('.number');
      const showing = button.dataset.showing === 'true';
      number.textContent = showing ? masked(card.cardNumber) : grouped(card.cardNumber);
      article.querySelector('.expiry').textContent = showing ? '•••  ·  ••/••' : `${card.cvv}  ·  ${card.expiry}`;
      button.dataset.showing = String(!showing); button.setAttribute('aria-label', showing ? 'Show card details' : 'Hide card details');
    });
    node.querySelector('.copy-action').addEventListener('click', async (event) => {
      try { await navigator.clipboard.writeText(grouped(card.cardNumber)); event.currentTarget.textContent = '✓'; setTimeout(() => event.currentTarget.textContent = '⧉', 1400); } catch { event.currentTarget.textContent = '!'; }
    });
    node.querySelector('.delete-action').addEventListener('click', () => { if (window.confirm('Delete this card permanently?')) { cards = cards.filter((item) => item.id !== card.id); saveCards(); render(); } });
    grid.appendChild(node);
  });
}

function updateVariantPicker() {
  const variants = VARIANTS_BY_BANK[bankSelect.value];
  const hasVariants = Boolean(variants);
  variantField.hidden = !hasVariants; variantSelect.disabled = !hasVariants; variantSelect.required = hasVariants;
  variantSelect.innerHTML = '<option value="" selected disabled>Select a card variant</option>' + (hasVariants ? Object.keys(variants).map((variant) => `<option>${variant}</option>`).join('') : '');
}
function openDialog() { error.textContent = ''; form.reset(); updateVariantPicker(); dialog.showModal(); bankSelect.focus(); }
document.querySelectorAll('[data-open-modal]').forEach((button) => button.addEventListener('click', openDialog));
document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
bankSelect.addEventListener('change', updateVariantPicker);
document.querySelector('#card-number').addEventListener('input', (event) => { event.target.value = grouped(digits(event.target.value).slice(0, 16)); });
document.querySelector('#holder-name').addEventListener('input', (event) => { event.target.value = event.target.value.replace(/[^a-zA-Z\s]/g, '').replace(/\s{2,}/g, ' '); });
document.querySelector('#card-expiry').addEventListener('keydown', (event) => {
  const field = event.currentTarget;
  if (event.key === 'Backspace' && field.selectionStart === 3 && field.selectionEnd === 3) {
    event.preventDefault(); field.value = '0'; field.setSelectionRange(1, 1);
  }
});
document.querySelector('#card-expiry').addEventListener('input', (event) => {
  const field = event.target; const raw = digits(field.value).slice(0, 4);
  if (!raw) { field.value = ''; return; }
  if (raw.length === 1) {
    field.value = raw === '0' ? '0' : `0${raw}/`;
    if (raw !== '0') requestAnimationFrame(() => field.setSelectionRange(3, 3));
    return;
  }
  const month = raw.slice(0, 2); const monthNumber = Number(month);
  if (monthNumber < 1 || monthNumber > 12) { field.value = '0'; return; }
  let year = raw.slice(2);
  if (year.length === 1 && !/^[234]$/.test(year)) year = '';
  if (year.length === 2 && !/^(2[6-9]|3\d|40)$/.test(year)) year = year.slice(0, 1);
  field.value = `${month}/${year}`;
  if (raw.length === 2) requestAnimationFrame(() => field.setSelectionRange(3, 3));
});
document.querySelector('#card-cvv').addEventListener('input', (event) => { event.target.value = digits(event.target.value).slice(0, 3); });
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form)); const number = digits(data.cardNumber); const expiryOk = /^(0[1-9]|1[0-2])\/(2[6-9]|3\d|40)$/.test(data.expiry);
  if (number.length !== 16) { error.textContent = 'Please enter a 16-digit card number.'; return; }
  if (!expiryOk) { error.textContent = 'Use a month from 01–12 and a year from 26–40.'; return; }
  if (!/^\d{3}$/.test(data.cvv)) { error.textContent = 'Enter the 3-digit CVV.'; return; }
  cards.unshift({ id: crypto.randomUUID(), bankName: data.bankName.trim(), variant: data.variant || '', holderName: data.holderName.trim(), cardNumber: number, expiry: data.expiry, cvv: data.cvv }); saveCards(); render(); dialog.close();
});
async function hashPin(pin, salt) {
  const data = new TextEncoder().encode(`${salt}:${pin}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
async function openVault() {
  let savedPin;
  try { savedPin = JSON.parse(localStorage.getItem(PIN_STORAGE_KEY)); } catch { savedPin = null; }
  const isSetup = Boolean(savedPin?.hash && savedPin?.salt);
  document.querySelector('#pin-kicker').textContent = isSetup ? 'WELCOME BACK' : 'LOCAL ACCESS';
  document.querySelector('#pin-title').textContent = isSetup ? 'Enter your PIN' : 'Set up your 4-digit PIN';
  document.querySelector('#pin-copy').textContent = isSetup ? 'Enter your PIN to view cards saved in this browser.' : 'Choose a PIN to open your card pocket on this browser.';
  document.querySelector('.pin-submit').textContent = isSetup ? 'Unlock cards' : 'Set PIN';
  pinDialog.showModal(); pinInput.focus();
  pinForm.addEventListener('submit', async (event) => {
    event.preventDefault(); pinError.textContent = '';
    const pin = pinInput.value;
    if (!/^\d{4}$/.test(pin)) { pinError.textContent = 'Enter exactly four digits.'; return; }
    if (isSetup) {
      if (await hashPin(pin, savedPin.salt) !== savedPin.hash) { pinError.textContent = 'That PIN is not correct.'; pinInput.select(); return; }
    } else {
      const salt = crypto.randomUUID();
      localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify({ salt, hash: await hashPin(pin, salt) }));
    }
    document.body.classList.remove('locked'); pinDialog.close(); render();
  });
}
openVault();
