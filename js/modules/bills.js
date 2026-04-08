const BILL_CATEGORIES = ['Housing','Utilities','Insurance','Subscriptions','Medical','Phone & Internet','Other'];
const BILL_FREQUENCIES = ['Monthly','Weekly','Quarterly','Yearly','One-time'];

function render_bills() {
  renderBillList();
  document.getElementById('bills-add-btn').onclick = () => openBillModal(null);
  document.getElementById('bills-save-btn').onclick = saveBill;
  document.getElementById('bills-cancel-btn').onclick = closeBillModal;
  document.getElementById('bills-delete-btn').onclick = deleteBill;
}

function renderBillList() {
  const bills = Storage.getArray('ng_bills');
  const container = document.getElementById('bills-list');
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  if (bills.length === 0) {
    container.innerHTML = `<p style="padding:20px;color:var(--text-muted)">No bills added yet. Add your first bill above.</p>`;
    return;
  }

  // Sort: overdue first, then by due date
  const sorted = [...bills].sort((a, b) => {
    const da = a.nextDue || '9999';
    const db = b.nextDue || '9999';
    return da.localeCompare(db);
  });

  let html = '';
  BILL_CATEGORIES.forEach(cat => {
    const catBills = sorted.filter(b => b.category === cat);
    if (catBills.length === 0) return;
    html += `<div style="padding:0 20px 4px;font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px">${cat}</div>`;
    catBills.forEach(b => {
      const overdue = b.nextDue && b.nextDue < todayStr && !b.paid;
      const dueSoon = b.nextDue && !overdue && !b.paid && daysBetween(todayStr, b.nextDue) <= 7;
      const bg = overdue ? 'background:#fdecea;border-color:#ef9a9a' : dueSoon ? 'background:#fff3e0;border-color:#ffcc80' : b.paid ? 'background:#e8f5e9;border-color:#a5d6a7' : '';
      const statusText = overdue ? '🔴 Overdue' : dueSoon ? '🟡 Due soon' : b.paid ? '✅ Paid' : '';
      const statusColor = overdue ? '#c62828' : dueSoon ? '#b45309' : '#2e6b3e';
      html += `
        <div class="card" style="margin:6px 20px;${bg}">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="flex:1;min-width:0">
              <div style="font-size:18px;font-weight:700">${b.name}</div>
              <div style="color:var(--text-muted);font-size:15px">${b.frequency}${b.amount ? ' · $' + b.amount : ''}</div>
              ${b.nextDue ? `<div style="font-size:15px;color:var(--text-muted)">Due: ${formatDate(b.nextDue)}</div>` : ''}
              ${statusText ? `<div style="font-size:15px;font-weight:700;color:${statusColor};margin-top:4px">${statusText}</div>` : ''}
              ${b.notes ? `<div style="font-size:14px;color:var(--text-muted);margin-top:4px">${b.notes}</div>` : ''}
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end;flex-shrink:0">
              <button class="btn btn-ghost" style="padding:8px 12px" onclick="openBillModal('${b.id}')" aria-label="Edit ${b.name}">Edit</button>
              <button onclick="toggleBillPaid('${b.id}', ${b.paid})"
                style="padding:8px 14px;border-radius:10px;border:2px solid ${b.paid ? '#4a7c59' : 'var(--border)'};background:${b.paid ? '#4a7c59' : 'white'};color:${b.paid ? 'white' : 'var(--text)'};font-size:14px;font-weight:700;cursor:pointer"
                aria-label="${b.paid ? 'Mark unpaid' : 'Mark paid'}">${b.paid ? '✓ Paid' : 'Mark Paid'}</button>
            </div>
          </div>
        </div>`;
    });
  });

  container.innerHTML = html;
}

function daysBetween(from, to) {
  return Math.round((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24));
}

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function toggleBillPaid(id, currentlyPaid) {
  Storage.update('ng_bills', id, { paid: !currentlyPaid });
  renderBillList();
}

function openBillModal(id) {
  const modal = document.getElementById('bills-modal');
  const b = id ? Storage.getArray('ng_bills').find(x => x.id === id) : null;
  document.getElementById('bills-modal-title').textContent = b ? 'Edit Bill' : 'Add Bill';
  document.getElementById('bills-id').value = id || '';
  document.getElementById('bills-name').value = b?.name || '';
  document.getElementById('bills-category').value = b?.category || BILL_CATEGORIES[0];
  document.getElementById('bills-amount').value = b?.amount || '';
  document.getElementById('bills-frequency').value = b?.frequency || 'Monthly';
  document.getElementById('bills-due').value = b?.nextDue || '';
  document.getElementById('bills-autopay').checked = b?.autopay || false;
  document.getElementById('bills-notes').value = b?.notes || '';
  document.getElementById('bills-delete-btn').style.display = b ? 'inline-flex' : 'none';
  modal.showModal();
  document.getElementById('bills-name').focus();
}

function closeBillModal() { document.getElementById('bills-modal').close(); }

function saveBill() {
  const name = document.getElementById('bills-name').value.trim();
  if (!name) { alert('Please enter a bill name.'); return; }
  const id = document.getElementById('bills-id').value;
  const bill = {
    id: id || Storage.uid(),
    name,
    category: document.getElementById('bills-category').value,
    amount: document.getElementById('bills-amount').value.trim(),
    frequency: document.getElementById('bills-frequency').value,
    nextDue: document.getElementById('bills-due').value,
    autopay: document.getElementById('bills-autopay').checked,
    notes: document.getElementById('bills-notes').value.trim(),
    paid: false
  };
  if (id) Storage.update('ng_bills', id, bill);
  else Storage.push('ng_bills', bill);
  closeBillModal();
  renderBillList();
}

function deleteBill() {
  const id = document.getElementById('bills-id').value;
  if (!id || !confirm('Delete this bill?')) return;
  Storage.remove('ng_bills', id);
  closeBillModal();
  renderBillList();
}
