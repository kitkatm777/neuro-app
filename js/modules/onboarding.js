const ALL_MODULES = [
  { id:'medications',    label:'💊 Medications',      defaultOn:true },
  { id:'calendar',       label:'📅 Calendar',          defaultOn:true },
  { id:'ice-contacts',   label:'👤 ICE Contacts',      defaultOn:true },
  { id:'helplines',      label:'📞 Helplines',         defaultOn:true },
  { id:'doctors-notes',  label:"📝 Doctor's Notes",    defaultOn:true },
  { id:'passwords',      label:'🔑 Passwords',         defaultOn:false },
  { id:'food',           label:'🛒 Food & Grocery',    defaultOn:false },
  { id:'bills',          label:'💳 Bills & Banking',   defaultOn:false },
  { id:'puzzles',        label:'🧩 Brain Puzzles',     defaultOn:false },
  { id:'wellness',       label:'🌿 Calm & Wellness',   defaultOn:false },
  { id:'recipes',        label:'🍳 Recipe Book',       defaultOn:false },
  { id:'transportation', label:'🚗 Transportation',    defaultOn:false },
  { id:'community',      label:'🏘️ Community',         defaultOn:false },
  { id:'birthdays',      label:'🎂 Birthdays',         defaultOn:false },
  { id:'pets',           label:'🐾 Pet Care',          defaultOn:false },
];

let obName = '', obDiagnosis = '', obModules = [];

function render_onboarding() {
  document.getElementById('ob-next-1').onclick = () => {
    obName = document.getElementById('ob-name').value.trim();
    if (!obName) { alert('Please enter your name.'); return; }
    obDiagnosis = document.getElementById('ob-diagnosis').value.trim();
    document.getElementById('onboarding-step-1').style.display = 'none';
    document.getElementById('onboarding-step-2').style.display = 'block';
    renderModuleCheckboxes();
  };

  document.getElementById('ob-next-2').onclick = () => {
    obModules = ALL_MODULES.filter(m => document.getElementById(`ob-mod-${m.id}`)?.checked).map(m => m.id);
    if (obModules.length === 0) { alert('Please select at least one module.'); return; }
    if (obModules.includes('passwords')) {
      document.getElementById('onboarding-step-2').style.display = 'none';
      document.getElementById('onboarding-step-3').style.display = 'block';
    } else {
      finishOnboarding(null);
    }
  };

  document.getElementById('ob-finish').onclick = () => {
    const pin = document.getElementById('ob-pin').value;
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) { alert('Please enter a 4-digit PIN.'); return; }
    finishOnboarding(pin);
  };
  document.getElementById('ob-skip-pin').onclick = () => finishOnboarding(null);
}

function renderModuleCheckboxes() {
  const container = document.getElementById('ob-module-list');
  container.innerHTML = ALL_MODULES.map(m => `
    <label style="display:flex;align-items:center;gap:8px;font-weight:normal;cursor:pointer;padding:8px;background:var(--bg);border-radius:8px">
      <input type="checkbox" id="ob-mod-${m.id}" ${m.defaultOn ? 'checked' : ''}
        style="width:20px;height:20px;cursor:pointer;accent-color:var(--primary);margin-bottom:0">
      ${m.label}
    </label>
  `).join('');
}

function finishOnboarding(pin) {
  Storage.set('ng_profile', {
    name: obName,
    diagnosis: obDiagnosis,
    enabledModules: obModules,
    pin,
    fontSize: 'medium',
    theme: 'light',
    photo: null
  });
  Seed.apply();
  Seed.demoData && Seed.demoData();
  location.reload();
}
