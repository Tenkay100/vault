// Gold Shield Vault — gated dashboard (login required) with Items videos

// Credentials
const SEEDED_UID = '842019';
const SEEDED_PWD_HASH = 'ae28185beb0c03f8c1e8a8862da67856b3f11dea2fbf7fb70eaa6e11c525697f';
const SEEDED_SALT = '7fb328e3e474ec87a88e6f2581464d47';

// Shortcuts
const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// Public page elements
const uidIn = $('#uid');
const pwdIn = $('#pwd');
const btnLogin = $('#btn-login');
const authMsg = $('#auth-msg');
const topLogin = $('#nav-login');

// Private dashboard
const dash = $('#page-view');
const lockBtn = $('#btn-lock');

// Tabs
const tabs = $$('.tab');
const panels = {
  ov: $('#panel-ov'),
  it: $('#panel-it'),
  pt: $('#panel-pt'),
  cn: $('#panel-cn'),
  co: $('#panel-co'),
  vc: $('#panel-vc'),
};

// Overview binds
const sGold = $('#s-gold');
const sDiam = $('#s-diamonds');
const sLoc  = $('#s-location');
const sDate = $('#s-date');
const ovDate = $('#ov-date');
const ovDep  = $('#ov-dep');
const ovWit  = $('#ov-wit');
const ovNok  = $('#ov-nok');
const ovIns  = $('#ov-ins');

// Items & others
const itemsRows = $('#items-rows');
const pDep = $('#p-dep');
const pWit = $('#p-wit');
const cDate = $('#c-date');
const cRegion = $('#c-region');
const cYear = $('#c-year');
const coDep = $('#co-dep');
const coWit = $('#co-wit');
const coNok = $('#co-nok');

// Static vault data
const DATA = {
  meta: { dateStored: '7 March 1988', location: 'West Africa, Ghana' },
  items: [
    { id:'ITM-GOLD', category:'Precious Metal', desc:'Cast bars',  gross:'190.000', unit:'kg', notes:'Seal photocopy on file' },
    { id:'ITM-DIA',  category:'Gemstones',      desc:'Mixed stones', gross:'80.000',  unit:'kg', notes:'Parcel log/gradings advised' }
  ],
  depositor: {
    storedBy:'William Lee Johnson',
    witness:'Kenneth Clevenger',
    nextOfKin:'Williams Richard; Unknown future spouse'
  },
  insurance: 'Vanguard'
};

// Utils
const toBuf = s => new TextEncoder().encode(s);
async function sha256Hex(data){
  const b = await crypto.subtle.digest('SHA-256', typeof data==='string'?toBuf(data):data);
  return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
function show(el,msg,err=false){ el.textContent = msg; el.style.color = err ? '#d67' : '#bfa56b'; }
function validate(){ btnLogin.disabled = !(uidIn.value.trim() && pwdIn.value); }

// Bindings
uidIn.addEventListener('input', validate);
pwdIn.addEventListener('input', validate);
topLogin.addEventListener('click', ()=>{ document.getElementById('home').scrollIntoView({behavior:'smooth'}); uidIn.focus(); });
pwdIn.addEventListener('keydown', e=>{ if(e.key==='Enter' && !btnLogin.disabled){ btnLogin.click(); }});

// Login flow (gate)
let tries = 0;
btnLogin.addEventListener('click', async ()=>{
  const uid = uidIn.value.trim();
  const pwd = pwdIn.value;
  if (uid !== SEEDED_UID){ show(authMsg,'Unique ID not found.', true); return; }
  const h = await sha256Hex(uid + '|' + pwd + '|' + SEEDED_SALT);
  if (h !== SEEDED_PWD_HASH){
    tries++; show(authMsg, tries>=5 ? 'Too many attempts. Try again shortly.' : 'Incorrect password.', true);
    if (tries>=5){ btnLogin.disabled = true; setTimeout(()=>{ btnLogin.disabled=false; tries=0; }, 20000); }
    return;
  }
  show(authMsg,'Welcome.');
  openDashboard();
});

function openDashboard(){
  // Hide public sections
  $('.nav').classList.add('hidden');
  $('main.hero').classList.add('hidden');
  $('#services').classList.add('hidden');
  $('#about').classList.add('hidden');
  $('.footer').classList.add('hidden');

  // Show private dashboard
  dash.classList.remove('hidden');
  renderAll();
  window.scrollTo({top:0,behavior:'auto'});
}

lockBtn.addEventListener('click', ()=>{
  // Back to public
  dash.classList.add('hidden');
  $('.nav').classList.remove('hidden');
  $('main.hero').classList.remove('hidden');
  $('#services').classList.remove('hidden');
  $('#about').classList.remove('hidden');
  $('.footer').classList.remove('hidden');
  uidIn.value=''; pwdIn.value=''; validate(); authMsg.textContent='';
  window.scrollTo({top:0,behavior:'auto'});
});

// Tabs
tabs.forEach(t=>{
  t.addEventListener('click', ()=>{
    tabs.forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    const k = t.dataset.tab;
    Object.values(panels).forEach(p=>p.classList.remove('show'));
    panels[k].classList.add('show');
  });
});

// Render dashboard data
function renderAll(){
  sGold.textContent = '190 kg';
  sDiam.textContent = '80 kg';
  sLoc.textContent  = DATA.meta.location;
  sDate.textContent = DATA.meta.dateStored;

  ovDate.textContent = DATA.meta.dateStored;
  ovDep.textContent  = DATA.depositor.storedBy;
  ovWit.textContent  = DATA.depositor.witness;
  ovNok.textContent  = DATA.depositor.nextOfKin;
  ovIns.textContent  = DATA.insurance;

  itemsRows.innerHTML = '';
  DATA.items.forEach(it=>{
    const row = document.createElement('div');
    row.className = 't-row';
    row.innerHTML = `<div>${it.id}</div><div>${it.category}</div><div>${it.desc}</div><div>${it.gross}</div><div>${it.unit}</div><div>${it.notes}</div>`;
    itemsRows.appendChild(row);
  });

  pDep.textContent = DATA.depositor.storedBy;
  pWit.textContent = DATA.depositor.witness;

  cDate.textContent = DATA.meta.dateStored;
  cRegion.textContent = DATA.meta.location;
  cYear.textContent = '1988';

  coDep.textContent = DATA.depositor.storedBy;
  coWit.textContent = DATA.depositor.witness;
  coNok.textContent = DATA.depositor.nextOfKin;

  const y = new Date().getFullYear();
  const yEl = document.getElementById('year'); if (yEl) yEl.textContent = y;
}

// Init
validate();
