// Home screen — clock, greeting, Today at a Glance
function render_home() {
  const profile = Storage.get('ng_profile') || {};
  const name = profile.name || 'there';

  document.getElementById('home-greeting').textContent =
    `${getGreeting()}, ${name}! 👋`;

  renderTodayAtAGlance(profile);
}

function renderTodayAtAGlance(profile) {
  const el = document.getElementById('home-glance');
  if (!el) return;
  const enabled = profile.enabledModules || [];
  const items = [];

  // --- Medicines ---
  if (enabled.includes('medications')) {
    const meds = Storage.getArray('ng_medications');
    const now  = new Date();
    const today = now.toISOString().slice(0, 10);
    const log   = Storage.getArray('ng_med_log').filter(l => l.date === today && l.taken);
    const totalDue = meds.reduce((n, m) => n + (m.schedule || []).filter(s => {
      const [h] = (s.time || '00:00').split(':').map(Number);
      return h <= now.getHours();
    }).length, 0);

    if (meds.length === 0) {
      items.push({ icon: '💊', text: 'No medicines added yet.', href: '#medications' });
    } else if (totalDue === 0) {
      items.push({ icon: '💊', text: 'No medicines due right now.', href: '#medications' });
    } else if (log.length >= totalDue) {
      items.push({ icon: '✅', text: 'All medicines taken today. Great job!', href: '#medications' });
    } else {
      const missed = totalDue - log.length;
      items.push({ icon: '💊', text: `You have ${missed} medicine${missed > 1 ? 's' : ''} to take.`, href: '#medications', urgent: true });
    }
  }

  // --- Next calendar event ---
  if (enabled.includes('calendar')) {
    const today = new Date().toISOString().slice(0, 10);
    const events = Storage.getArray('ng_events')
      .filter(e => e.date >= today)
      .sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));

    if (events.length > 0) {
      const e = events[0];
      const eDate = new Date(e.date + 'T12:00:00');
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const diff = Math.round((eDate - todayDate) / 86400000);
      const dayLabel = diff === 0 ? 'today'
        : diff === 1 ? 'tomorrow'
        : `on ${eDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`;
      const timeLabel = e.time ? ` at ${formatTime12(e.time)}` : '';
      items.push({ icon: '📅', text: `${e.title} ${dayLabel}${timeLabel}.`, href: '#calendar' });
    } else {
      items.push({ icon: '📅', text: 'No upcoming events this week.', href: '#calendar' });
    }
  }

  // --- Birthday alert ---
  if (enabled.includes('birthdays')) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const bd = Storage.getArray('ng_birthdays').find(b => {
      if (!b.date) return false;
      const parts = b.date.split('-').map(Number);
      const next = new Date(today.getFullYear(), parts[1] - 1, parts[2]);
      if (next < today) next.setFullYear(today.getFullYear() + 1);
      return Math.round((next - today) / 86400000) <= 3;
    });
    if (bd) {
      const parts = bd.date.split('-').map(Number);
      const next = new Date(today.getFullYear(), parts[1] - 1, parts[2]);
      if (next < today) next.setFullYear(today.getFullYear() + 1);
      const diff = Math.round((next - today) / 86400000);
      const msg = diff === 0
        ? `Today is ${bd.name}'s birthday! 🎉`
        : diff === 1
        ? `${bd.name}'s birthday is tomorrow.`
        : `${bd.name}'s birthday is in ${diff} days.`;
      items.push({ icon: '🎂', text: msg, href: '#birthdays' });
    }
  }

  if (items.length === 0) {
    items.push({ icon: '🌿', text: 'Have a calm and peaceful day.', href: '#home' });
  }

  el.innerHTML = items.map(item => `
    <a href="${item.href}" class="glance-item" style="text-decoration:none;color:inherit;${item.urgent ? 'background:#fff8e1;border-radius:10px;padding:14px;margin:-4px;' : ''}">
      <span class="glance-icon">${item.icon}</span>
      <span class="glance-text" style="font-size:var(--font-base);line-height:var(--line-height);font-weight:${item.urgent ? '700' : '400'};">${item.text}</span>
      <span style="color:var(--primary);font-size:22px;flex-shrink:0">›</span>
    </a>`).join('');
}

function formatTime12(time24) {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h < 12 ? 'am' : 'pm';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}
