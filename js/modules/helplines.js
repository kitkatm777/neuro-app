// Task 15: Helplines
function render_helplines() {
  const list = document.getElementById('helplines-list');
  if (!list) return;
  const lines = Storage.getArray('ng_helplines');
  if (!lines.length) {
    list.innerHTML = `<div style="padding:32px 20px;text-align:center;color:var(--text-muted)">
      <p style="font-size:18px">No helplines found.</p></div>`;
    return;
  }
  list.innerHTML = `
    <div style="padding:0 20px 12px">
      <div class="card" style="background:#fff3e0;border-left:4px solid var(--accent);margin-bottom:16px">
        <p style="margin:0;font-size:16px;color:var(--text)">
          🚨 <strong>Emergency?</strong> Call <a href="tel:911" style="color:var(--accent);font-weight:700">911</a> immediately.
        </p>
      </div>
    </div>
    ${lines.map(h => `
      <div class="card" style="margin:0 20px 12px">
        <div style="font-size:19px;font-weight:700;color:var(--primary);margin-bottom:4px">${h.name}</div>
        ${h.description ? `<div style="font-size:15px;color:var(--text-muted);margin-bottom:8px">${h.description}</div>` : ''}
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          ${h.phone ? `<a href="tel:${h.phone.replace(/\D/g,'')}" class="btn btn-primary" style="text-decoration:none;font-size:16px">📞 ${h.phone}</a>` : ''}
          ${h.website ? `<a href="${h.website}" target="_blank" rel="noopener" class="btn btn-ghost" style="text-decoration:none;font-size:16px">🌐 Website</a>` : ''}
        </div>
      </div>`).join('')}
    <div style="height:20px"></div>`;
}
