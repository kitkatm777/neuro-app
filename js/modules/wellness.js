const WELLNESS_TRACKS = [
  { id:'breathing', title:'Deep Breathing', emoji:'🫁', desc:'Slow, calming breath exercise', duration:'5 min', color:'#2c5f7a' },
  { id:'gratitude', title:'Gratitude Moment', emoji:'🙏', desc:'Reflect on three good things', duration:'3 min', color:'#4a7c59' },
  { id:'stretch', title:'Gentle Stretching', emoji:'🧘', desc:'Simple seated stretches', duration:'10 min', color:'#c07830' },
  { id:'visualize', title:'Calm Visualisation', emoji:'🌅', desc:'A peaceful guided imagery', duration:'7 min', color:'#2a8a8a' },
];

const BREATHING_STEPS = [
  { label:'Breathe In', seconds:4, color:'#2c5f7a', bg:'#e3f2fd' },
  { label:'Hold', seconds:4, color:'#c07830', bg:'#fff3e0' },
  { label:'Breathe Out', seconds:6, color:'#4a7c59', bg:'#e8f5e9' },
  { label:'Rest', seconds:2, color:'#2a8a8a', bg:'#e0f7fa' },
];

const GRATITUDES = [
  'Something that made you smile today',
  'A person who has helped you',
  'Something in your home you appreciate',
  'A fond memory from your past',
  'Something about your body you are grateful for',
  'A simple pleasure you enjoyed recently',
];

const STRETCHES = [
  { name:'Neck Rolls', desc:'Slowly roll your head in a circle, 3 times each direction. Keep it gentle.' },
  { name:'Shoulder Shrugs', desc:'Raise both shoulders up to your ears, hold for 3 seconds, then release. Repeat 5 times.' },
  { name:'Hand Squeeze', desc:'Make a fist, squeeze for 3 seconds, then open your fingers wide. Repeat 8 times.' },
  { name:'Ankle Circles', desc:'Lift one foot slightly and circle your ankle 5 times each direction. Repeat with the other foot.' },
  { name:'Deep Breath Stretch', desc:'Breathe in and raise your arms above your head. Breathe out and lower them slowly. Repeat 5 times.' },
];

const VISUALIZATIONS = [
  'Close your eyes. Imagine you are sitting in a beautiful garden. The sun is warm on your face. You can hear birds singing softly nearby. A gentle breeze moves through the flowers. You feel completely safe and at peace. Breathe slowly. You are exactly where you need to be.',
  'Picture yourself beside a calm lake. The water is still and reflects the blue sky. Trees surround you, their leaves rustling softly. You hear nothing but nature. With every breath, you feel more relaxed. Let your shoulders drop. Let your hands rest open. You are at peace.',
  'Imagine a cosy room with a fireplace. A warm light fills the space. You are sitting comfortably in your favourite chair. A cup of tea is in your hands. Outside the window, snow falls gently. Inside, you are warm, safe, and deeply calm.',
];

function render_wellness() {
  const links = Storage.getArray('ng_wellness_links');
  let html = `
    <div style="background:#e8f5e9;border:1px solid #a5d6a7;border-radius:12px;padding:14px 20px;margin:12px 20px;font-size:15px;color:#1b5e20">
      🌿 Taking time to breathe and rest is medicine too. Choose an activity below.
    </div>`;

  WELLNESS_TRACKS.forEach(t => {
    html += `
      <div class="card" style="margin:10px 20px;border-left:5px solid ${t.color}">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="font-size:44px;flex-shrink:0">${t.emoji}</div>
          <div style="flex:1">
            <div style="font-size:20px;font-weight:700">${t.title}</div>
            <div style="color:var(--text-muted);font-size:15px">${t.desc}</div>
            <div style="color:var(--text-muted);font-size:14px;margin-top:2px">⏱ ${t.duration}</div>
          </div>
          <button class="btn btn-primary" style="flex-shrink:0" onclick="startWellness('${t.id}')">Start</button>
        </div>
      </div>`;
  });

  if (links.length > 0) {
    html += `<div style="padding:16px 20px 4px;font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px">Helpful Links</div>`;
    links.forEach(l => {
      html += `
        <div class="card" style="margin:6px 20px">
          <a href="${l.url}" target="_blank" rel="noopener noreferrer" style="font-size:17px;font-weight:700;color:var(--primary);text-decoration:none">${l.title}</a>
          ${l.description ? `<div style="color:var(--text-muted);font-size:14px;margin-top:4px">${l.description}</div>` : ''}
        </div>`;
    });
  }

  document.getElementById('wellness-content').innerHTML = html;
}

function startWellness(id) {
  if (id === 'breathing')  startBreathing();
  if (id === 'gratitude')  startGratitude();
  if (id === 'stretch')    startStretch();
  if (id === 'visualize')  startVisualize();
}

function wellnessBack() {
  return `<button class="btn btn-ghost" style="margin:12px 20px" onclick="render_wellness()">← Back</button>`;
}

/* BREATHING */
function startBreathing() {
  let cycle = 0, stepIdx = 0, timeLeft = 0, timer = null;
  const totalCycles = 5;

  function render() {
    const step = BREATHING_STEPS[stepIdx];
    document.getElementById('wellness-content').innerHTML = `
      ${wellnessBack()}
      <div class="card" style="margin:20px;text-align:center;background:${step.bg}">
        <div style="font-size:16px;color:var(--text-muted);margin-bottom:8px">Cycle ${cycle + 1} of ${totalCycles}</div>
        <div style="font-size:80px;font-weight:800;color:${step.color};line-height:1;margin:16px 0">${timeLeft}</div>
        <div style="font-size:28px;font-weight:700;color:${step.color};margin-bottom:24px">${step.label}</div>
        <div style="display:flex;justify-content:center;gap:8px">
          ${BREATHING_STEPS.map((s,i) => `<div style="width:12px;height:12px;border-radius:50%;background:${i===stepIdx?step.color:'var(--border)'}"></div>`).join('')}
        </div>
      </div>`;
  }

  function tick() {
    timeLeft--;
    if (timeLeft <= 0) {
      stepIdx++;
      if (stepIdx >= BREATHING_STEPS.length) { stepIdx = 0; cycle++; }
      if (cycle >= totalCycles) {
        clearInterval(timer);
        document.getElementById('wellness-content').innerHTML = `
          ${wellnessBack()}
          <div class="card" style="margin:20px;text-align:center">
            <div style="font-size:60px">✨</div>
            <h2 style="font-size:24px;color:var(--primary)">Well done!</h2>
            <p style="font-size:18px;color:var(--text-muted)">You completed your breathing exercise.<br>Notice how calm you feel.</p>
            <button class="btn btn-primary" style="margin-top:16px;width:100%" onclick="startBreathing()">Do it again</button>
          </div>`;
        return;
      }
      timeLeft = BREATHING_STEPS[stepIdx].seconds;
    }
    render();
  }

  stepIdx = 0; cycle = 0; timeLeft = BREATHING_STEPS[0].seconds;
  render();
  timer = setInterval(tick, 1000);
}

/* GRATITUDE */
function startGratitude() {
  const shuffled = [...GRATITUDES].sort(() => Math.random() - 0.5).slice(0, 3);
  let answers = ['', '', ''];
  let step = 0;

  function render() {
    if (step >= 3) {
      document.getElementById('wellness-content').innerHTML = `
        ${wellnessBack()}
        <div class="card" style="margin:20px">
          <div style="font-size:48px;text-align:center;margin-bottom:12px">🙏</div>
          <h2 style="font-size:22px;color:var(--primary);text-align:center;margin-bottom:16px">Your Gratitude Today</h2>
          ${answers.map((a, i) => `
            <div style="margin-bottom:16px;padding:14px;background:var(--bg);border-radius:10px">
              <div style="font-size:14px;color:var(--text-muted);margin-bottom:4px">${shuffled[i]}</div>
              <div style="font-size:17px;font-weight:600">${a || '(left blank)'}</div>
            </div>`).join('')}
          <p style="text-align:center;color:var(--secondary);font-size:16px;margin-top:8px">Gratitude trains your mind to notice the good. 💚</p>
        </div>`;
      return;
    }
    document.getElementById('wellness-content').innerHTML = `
      ${wellnessBack()}
      <div class="card" style="margin:20px">
        <div style="font-size:15px;color:var(--text-muted);margin-bottom:8px">${step + 1} of 3</div>
        <div style="font-size:20px;font-weight:700;margin-bottom:20px;line-height:1.4">${shuffled[step]}</div>
        <textarea id="grat-input" rows="4" style="resize:vertical;font-size:17px" placeholder="Write anything that comes to mind...">${answers[step]}</textarea>
        <button class="btn btn-primary" style="width:100%;margin-top:12px;font-size:18px" onclick="gratNext()">
          ${step < 2 ? 'Next →' : 'Finish'}
        </button>
      </div>`;
  }

  window.gratNext = () => {
    answers[step] = document.getElementById('grat-input').value.trim();
    step++;
    render();
  };
  render();
}

/* STRETCHING */
function startStretch() {
  let idx = 0;
  function render() {
    if (idx >= STRETCHES.length) {
      document.getElementById('wellness-content').innerHTML = `
        ${wellnessBack()}
        <div class="card" style="margin:20px;text-align:center">
          <div style="font-size:60px">🧘</div>
          <h2 style="font-size:24px;color:var(--primary)">Great work!</h2>
          <p style="font-size:18px;color:var(--text-muted)">You completed all stretches.<br>Your body thanks you.</p>
          <button class="btn btn-primary" style="margin-top:16px;width:100%" onclick="startStretch()">Do it again</button>
        </div>`;
      return;
    }
    const s = STRETCHES[idx];
    document.getElementById('wellness-content').innerHTML = `
      ${wellnessBack()}
      <div class="card" style="margin:20px">
        <div style="font-size:15px;color:var(--text-muted);margin-bottom:8px">${idx + 1} of ${STRETCHES.length}</div>
        <div style="font-size:24px;font-weight:700;color:var(--primary);margin-bottom:16px">${s.name}</div>
        <div style="font-size:19px;line-height:1.6;color:var(--text);margin-bottom:24px">${s.desc}</div>
        <button class="btn btn-primary" style="width:100%;font-size:18px" onclick="stretchNext()">
          ${idx < STRETCHES.length - 1 ? 'Next Stretch →' : 'Finish'}
        </button>
      </div>`;
  }
  window.stretchNext = () => { idx++; render(); };
  render();
}

/* VISUALISATION */
function startVisualize() {
  const text = VISUALIZATIONS[Math.floor(Math.random() * VISUALIZATIONS.length)];
  const sentences = text.split('. ').filter(Boolean);
  let idx = 0;

  function render() {
    const done = idx >= sentences.length;
    document.getElementById('wellness-content').innerHTML = `
      ${wellnessBack()}
      <div class="card" style="margin:20px;text-align:center;background:#e3f2fd">
        <div style="font-size:48px;margin-bottom:16px">🌅</div>
        ${done
          ? `<h2 style="font-size:22px;color:var(--primary)">Beautifully done.</h2>
             <p style="font-size:17px;color:var(--text-muted);margin:12px 0">Take a moment to sit with this peace.</p>
             <button class="btn btn-primary" style="width:100%;margin-top:12px" onclick="startVisualize()">Try again</button>`
          : `<div style="font-size:21px;line-height:1.7;color:#1a3a5c;font-style:italic;margin-bottom:24px">"${sentences[idx]}."</div>
             <button class="btn btn-primary" style="width:100%;font-size:18px" onclick="vizNext()">Continue →</button>`}
      </div>`;
  }
  window.vizNext = () => { idx++; render(); };
  render();
}
