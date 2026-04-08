function startClock() {
  function update() {
    const now = new Date();
    const h = now.getHours(), m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    const min = String(m).padStart(2, '0');
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const el = id => document.getElementById(id);
    if (el('clock-time')) el('clock-time').textContent = `${hour}:${min}`;
    if (el('clock-ampm')) el('clock-ampm').textContent = ampm;
    if (el('clock-day'))  el('clock-day').textContent  = days[now.getDay()];
    if (el('clock-date')) el('clock-date').textContent = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  }
  update();
  setInterval(update, 1000);
}
