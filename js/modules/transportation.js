// Task 15b: Transportation & Community (combined)
function render_transportation() {
  const el = document.getElementById('transport-content');
  if (!el) return;
  el.innerHTML = `
    <div style="padding:0 20px 30px">
      <p style="font-size:17px;color:var(--text-muted);margin-bottom:20px">
        Getting around safely. Tap a card to open the link or dial.
      </p>

      <div style="font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Ride Services</div>

      <a href="https://www.lyft.com/rider/lyft-for-seniors" target="_blank" rel="noopener" class="card" style="margin-bottom:12px;display:block;text-decoration:none;color:var(--text)">
        <div style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:4px">🚗 Lyft for Seniors</div>
        <div style="font-size:15px;color:var(--text-muted)">Book affordable rides — no smartphone app required</div>
      </a>

      <a href="https://www.uber.com/us/en/health/" target="_blank" rel="noopener" class="card" style="margin-bottom:12px;display:block;text-decoration:none;color:var(--text)">
        <div style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:4px">🏥 Uber Health</div>
        <div style="font-size:15px;color:var(--text-muted)">Medical transport — rides to and from appointments</div>
      </a>

      <div class="card" style="margin-bottom:12px">
        <div style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:4px">🚌 Paratransit</div>
        <div style="font-size:15px;color:var(--text-muted);margin-bottom:8px">ADA-mandated accessible transport. Contact your local transit authority to apply.</div>
        <a href="https://www.transit.dot.gov/regulations-and-guidance/civil-rights-ada/paratransit-services" target="_blank" rel="noopener" class="btn btn-ghost" style="text-decoration:none;font-size:15px">Learn More →</a>
      </div>

      <div style="font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;margin:20px 0 10px">Volunteer Drivers</div>

      <a href="https://www.itnnamerica.org" target="_blank" rel="noopener" class="card" style="margin-bottom:12px;display:block;text-decoration:none;color:var(--text)">
        <div style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:4px">🤝 ITN America</div>
        <div style="font-size:15px;color:var(--text-muted)">Volunteer-driven, affordable rides for seniors</div>
      </a>

      <a href="https://www.volunteermatch.org" target="_blank" rel="noopener" class="card" style="margin-bottom:12px;display:block;text-decoration:none;color:var(--text)">
        <div style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:4px">🌟 VolunteerMatch</div>
        <div style="font-size:15px;color:var(--text-muted)">Find local volunteers who provide transport assistance</div>
      </a>

      <div style="font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;margin:20px 0 10px">Plan Your Trip</div>

      <a href="https://maps.google.com" target="_blank" rel="noopener" class="card" style="margin-bottom:12px;display:block;text-decoration:none;color:var(--text)">
        <div style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:4px">🗺️ Google Maps</div>
        <div style="font-size:15px;color:var(--text-muted)">Turn-by-turn directions, transit, and walking routes</div>
      </a>
    </div>`;
}

function render_community() {
  const el = document.getElementById('community-content');
  if (!el) return;
  el.innerHTML = `
    <div style="padding:0 20px 30px">
      <p style="font-size:17px;color:var(--text-muted);margin-bottom:20px">
        Stay connected. Find support groups, social programs, and community resources near you.
      </p>

      <div style="font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Support Groups</div>

      <a href="https://www.parkinson.org/find-support" target="_blank" rel="noopener" class="card" style="margin-bottom:12px;display:block;text-decoration:none;color:var(--text)">
        <div style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:4px">🧠 Parkinson's Foundation</div>
        <div style="font-size:15px;color:var(--text-muted)">Find local Parkinson's support groups and classes</div>
      </a>

      <a href="https://www.alz.org/help-support/community/support-groups" target="_blank" rel="noopener" class="card" style="margin-bottom:12px;display:block;text-decoration:none;color:var(--text)">
        <div style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:4px">💜 Alzheimer's Association</div>
        <div style="font-size:15px;color:var(--text-muted)">Support groups for people with dementia and their carers</div>
      </a>

      <a href="https://www.nationalmssociety.org/Resources-Support/Find-Support" target="_blank" rel="noopener" class="card" style="margin-bottom:12px;display:block;text-decoration:none;color:var(--text)">
        <div style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:4px">🔵 MS Society</div>
        <div style="font-size:15px;color:var(--text-muted)">MS support groups and wellness programs</div>
      </a>

      <div style="font-size:13px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;margin:20px 0 10px">Social Programs</div>

      <a href="https://eldercare.acl.gov" target="_blank" rel="noopener" class="card" style="margin-bottom:12px;display:block;text-decoration:none;color:var(--text)">
        <div style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:4px">🏛️ Eldercare Locator</div>
        <div style="font-size:15px;color:var(--text-muted)">Find local senior services — meals, transport, housing</div>
      </a>

      <a href="https://www.ymca.org" target="_blank" rel="noopener" class="card" style="margin-bottom:12px;display:block;text-decoration:none;color:var(--text)">
        <div style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:4px">🏋️ YMCA SilverSneakers</div>
        <div style="font-size:15px;color:var(--text-muted)">Free fitness and social programs for older adults</div>
      </a>

      <a href="https://www.volunteermatch.org" target="_blank" rel="noopener" class="card" style="margin-bottom:12px;display:block;text-decoration:none;color:var(--text)">
        <div style="font-size:20px;font-weight:700;color:var(--primary);margin-bottom:4px">🌟 Give Back</div>
        <div style="font-size:15px;color:var(--text-muted)">Volunteering keeps the mind sharp and builds community</div>
      </a>
    </div>`;
}
