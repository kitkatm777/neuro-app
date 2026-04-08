const EVENT_TYPES = [
  { label:'Medical Appointment', color:'#2c5f7a' },
  { label:'Social Obligation',   color:'#4a7c59' },
  { label:'Visitor Coming',      color:'#c07830' },
  { label:'At-Home Care / Aide Visit', color:'#2a8a8a' },
  { label:'Personal Reminder',   color:'#7a5c3a' },
];

let calYear, calMonth, calView = 'month';

function render_calendar() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  renderCalendarView();
  setupCalButtons();
}

function setupCalButtons() {
  document.getElementById('cal-tab-month').onclick = () => { calView = 'month'; renderCalendarView(); };
  document.getElementById('cal-tab-week').onclick  = () => { calView = 'week';  renderCalendarView(); };
  document.getElementById('cal-add-btn').onclick   = () => openEventModal(null);
  document.getElementById('cal-save-btn').onclick  = saveEvent;
  document.getElementById('cal-cancel-btn').onclick = closeEventModal;
  document.getElementById('cal-delete-btn').onclick = deleteEvent;
}

function renderCalendarView() {
  document.getElementById('cal-tab-month').className = calView === 'month' ? 'btn btn-primary' : 'btn btn-ghost';
  document.getElementById('cal-tab-week').className  = calView === 'week'  ? 'btn btn-primary' : 'btn btn-ghost';
  if (calView === 'month') renderMonthView();
  else renderWeekView();
}

function renderMonthView() {
  const events = Storage.getArray('ng_events');
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const today = new Date().toISOString().slice(0,10);

  let html = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:0 20px 12px">
      <button class="btn btn-ghost" onclick="prevMonth()" aria-label="Previous month" style="font-size:22px;padding:8px 16px">◀</button>
      <span style="font-size:22px;font-weight:700;color:var(--primary)">${monthNames[calMonth]} ${calYear}</span>
      <button class="btn btn-ghost" onclick="nextMonth()" aria-label="Next month" style="font-size:22px;padding:8px 16px">▶</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;padding:0 12px">
      ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d =>
        `<div style="text-align:center;font-weight:700;font-size:14px;color:var(--text-muted);padding:6px 0">${d}</div>`
      ).join('')}`;

  for (let i = 0; i < firstDay; i++) {
    html += `<div></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const dayEvents = events.filter(e => e.date === dateStr);
    const isToday = dateStr === today;
    html += `
      <div style="min-height:70px;background:${isToday ? '#e3f2fd' : 'var(--surface)'};border-radius:8px;padding:4px;border:${isToday ? '2px solid var(--primary)' : '1px solid var(--border)'};cursor:pointer"
           onclick="openEventModal(null,'${dateStr}')" title="Add event on ${dateStr}">
        <div style="font-size:18px;font-weight:${isToday?'800':'600'};color:${isToday?'var(--primary)':'var(--text)'};text-align:center">${day}</div>
        ${dayEvents.slice(0,2).map(e => {
          const type = EVENT_TYPES.find(t => t.label === e.type) || EVENT_TYPES[0];
          return `<div onclick="event.stopPropagation();openEventModal('${e.id}')"
            style="background:${type.color};color:white;border-radius:4px;padding:2px 5px;font-size:11px;font-weight:600;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer"
            title="${e.title}">${e.title}</div>`;
        }).join('')}
        ${dayEvents.length > 2 ? `<div style="font-size:11px;color:var(--text-muted);text-align:center">+${dayEvents.length-2} more</div>` : ''}
      </div>`;
  }
  html += `</div>`;
  document.getElementById('cal-body').innerHTML = html;
}

function renderWeekView() {
  const events = Storage.getArray('ng_events');
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push(d);
  }
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const todayStr = now.toISOString().slice(0,10);

  let html = `<div style="padding:0 20px">`;
  days.forEach(d => {
    const dateStr = d.toISOString().slice(0,10);
    const dayEvents = events.filter(e => e.date === dateStr).sort((a,b) => (a.time||'').localeCompare(b.time||''));
    const isToday = dateStr === todayStr;
    html += `
      <div style="margin-bottom:16px;padding:16px;background:${isToday ? '#e3f2fd' : 'var(--surface)'};border-radius:12px;border:${isToday?'2px solid var(--primary)':'1px solid var(--border)'}">
        <div style="font-size:18px;font-weight:700;color:${isToday?'var(--primary)':'var(--text)'};margin-bottom:8px">
          ${dayNames[d.getDay()]} · ${d.getMonth()+1}/${d.getDate()}
        </div>`;
    if (dayEvents.length === 0) {
      html += `<div style="color:var(--text-muted);font-size:15px">Nothing scheduled</div>`;
    } else {
      dayEvents.forEach(e => {
        const type = EVENT_TYPES.find(t => t.label === e.type) || EVENT_TYPES[0];
        html += `
          <div onclick="openEventModal('${e.id}')" style="display:flex;align-items:center;gap:12px;padding:12px;border-left:5px solid ${type.color};background:var(--bg);border-radius:8px;margin-bottom:8px;cursor:pointer">
            <div>
              <div style="font-size:17px;font-weight:700">${e.time ? e.time + ' — ' : ''}${e.title}</div>
              <div style="font-size:14px;color:var(--text-muted)">${e.type}${e.location ? ' · ' + e.location : ''}</div>
              ${e.notes ? `<div style="font-size:14px;color:var(--text-muted)">${e.notes}</div>` : ''}
            </div>
          </div>`;
      });
    }
    html += `</div>`;
  });
  html += `</div>`;
  document.getElementById('cal-body').innerHTML = html;
}

function prevMonth() { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderMonthView(); }
function nextMonth() { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderMonthView(); }

function openEventModal(id, prefillDate) {
  const modal = document.getElementById('cal-modal');
  const e = id ? Storage.getArray('ng_events').find(x => x.id === id) : null;
  document.getElementById('cal-modal-title').textContent = e ? 'Edit Event' : 'Add Event';
  document.getElementById('cal-event-id').value = id || '';
  document.getElementById('cal-title').value = e?.title || '';
  document.getElementById('cal-date').value = e?.date || prefillDate || new Date().toISOString().slice(0,10);
  document.getElementById('cal-time').value = e?.time || '';
  document.getElementById('cal-type').value = e?.type || EVENT_TYPES[0].label;
  document.getElementById('cal-location').value = e?.location || '';
  document.getElementById('cal-notes').value = e?.notes || '';
  document.getElementById('cal-delete-btn').style.display = e ? 'inline-flex' : 'none';
  modal.showModal();
  document.getElementById('cal-title').focus();
}

function closeEventModal() { document.getElementById('cal-modal').close(); }

function saveEvent() {
  const title = document.getElementById('cal-title').value.trim();
  const date  = document.getElementById('cal-date').value;
  if (!title) { alert('Please enter an event title.'); return; }
  if (!date)  { alert('Please enter a date.'); return; }
  const id = document.getElementById('cal-event-id').value;
  const evt = {
    id: id || Storage.uid(),
    title,
    date,
    time: document.getElementById('cal-time').value,
    type: document.getElementById('cal-type').value,
    location: document.getElementById('cal-location').value.trim(),
    notes: document.getElementById('cal-notes').value.trim(),
    contactId: null
  };
  if (id) Storage.update('ng_events', id, evt);
  else Storage.push('ng_events', evt);
  closeEventModal();
  renderCalendarView();
}

function deleteEvent() {
  const id = document.getElementById('cal-event-id').value;
  if (!id || !confirm('Delete this event?')) return;
  Storage.remove('ng_events', id);
  closeEventModal();
  renderCalendarView();
}
