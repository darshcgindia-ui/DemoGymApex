/**
 * APEXLOCAL STUDIO — OUTREACH ENGINE & SCRIPT GENERATOR
 * Tailored for India, India, Coaching Hubs, Doctors, Clinics, and Local Pros
 */

document.addEventListener('DOMContentLoaded', () => {
  initPlaybookTabs();
  initIndiaScriptGenerator();
  initChecklistPersistence();
});

function initPlaybookTabs() {
  const tabButtons = document.querySelectorAll('.playbook-tab-btn');
  const panes = document.querySelectorAll('.playbook-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(btn.dataset.target);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

const IndiaScripts = {
  whatsapp_hinglish: (data) => `Namaste ${data.ownerName}! 🙏

Main ${data.bizName} ki Google profile dekh raha tha mein (${data.city}). Aapka service aur reviews kaafi strong hain! 

Maine notice kiya ki jab koi customer mobile pe aapki website open karta hai, toh: ${data.issue}.

Is wajah se daily 5-10 direct customer inquiries miss ho sakti hain jo WhatsApp pe aani chahiye thi.

Humne ke businesses across India ke liye ek 1-Page High-Speed Customer Funnel model tayyar kiya hai (sirf ₹10,000 upfront) jisme 1-Tap WhatsApp Booking aur sub-second mobile speed milti hai.

Maine ek quick 45-second ka screen demo link banaya hai. Kya main link yahan share kar sakta hoon? (No sales pitch—sirf aapke feedback ke liye) 🙌

— ApexLocal Studio / Antigravity Squad (India)`,

  whatsapp_english: (data) => `Hello ${data.ownerName}! 👋

I came across ${data.bizName} while researching leading ${data.niche} businesses in ${data.city}. Your local reputation and customer reviews look great!

However, I noticed a friction point on your mobile website: ${data.issue}. Over 80% of local customers in search on their phones and bounce if they cannot click to WhatsApp or call instantly.

We build high-converting 1-Page Sales Funnels (starting at ₹10,000) and 5-Page Authority Systems (₹18,000) with sub-1s load speed and automated WhatsApp appointment routing.

I recorded a 60-second screen audit showing 3 quick tweaks that can double your mobile inquiries. Would you like me to send the preview link over? 

Best regards,
ApexLocal Studio (India)`,

  call_pitch: (data) => `[PHONE / IN-PERSON WALK-IN PITCH (India / India)]

OPENER:
"Namaste ${data.ownerName} Ji! Mera naam [Your Name] hai. Main mein businesses across India ke digital customer systems audit karta hoon.

Maine notice kiya ki ${data.bizName} pe Google se aane wale 70% log mobile pe aate hain, lekin website slow hone aur direct WhatsApp button na hone ke karan wo bina call kiye chale jaate hain.

Hum traditional web agency ki tarah 50,000 charge nahi karte. Hum sirf ₹10,000 mein ek 24/7 Digital Salesman Funnel banate hain jo har searcher ko direct aapke WhatsApp aur reception pe connect karta hai.

Sirf 5 minute ka live demo dikhana chahta hoon apne phone pe. Kya kal dopahar 2 baje 5 min mil sakte hain?"`,

  proposal_summary: (data) => `=====================================================
CLIENT RATE CARD & SCOPE: ${data.bizName.toUpperCase()}
=====================================================

1. RECOMMENDED OPTION:
${data.niche === 'Doctors & Clinics' || data.niche === 'Law Practice' ? '• 5-Page digital authority System (₹18,000 upfront + ₹700/mo Care Plan)' : '• 1-Page High-Converting Sales Funnel (₹10,000 upfront + ₹700/mo Care Plan)'}

2. CORE DELIVERABLES:
• Custom Mobile-First Sales Architecture (Solves: ${data.issue})
• Direct 1-Tap WhatsApp & Phone Inquiry Triggers
• Google Maps Location & 5-Star Reviews Embed
• Sub-1s Mobile PageSpeed Guarantee
• 3–5 Business Days Turnaround

3. FINANCIAL TERMS:
• 50% Kickoff Deposit to reserve sprint
• 50% Final Balance upon mobile verification & live launch
• Antigravity Care Retainer: ₹700/month (Hosting, Backups, Security, 30m edits)

4. ESTIMATED ROI FOR ${data.bizName}:
Even 4-5 extra paying customers/month yields +₹10,000 to ₹18,000+ net profit, making this a 100% self-funding asset.`
};

function initIndiaScriptGenerator() {
  let activeType = 'whatsapp_hinglish';

  const bizNameInput = document.getElementById('genBizName');
  const ownerNameInput = document.getElementById('genOwnerName');
  const cityInput = document.getElementById('genCity');
  const nicheSelect = document.getElementById('genNiche');
  const issueSelect = document.getElementById('genIssue');
  const outputBox = document.getElementById('scriptOutputText');
  const typeButtons = document.querySelectorAll('.script-tag-btn');
  const copyBtn = document.getElementById('copyScriptBtn');

  if (!outputBox) return;

  function updateOutput() {
    const data = {
      bizName: bizNameInput?.value.trim() || 'Shree Ram Fitness & Gym',
      ownerName: ownerNameInput?.value.trim() || 'Verma Ji',
      city: cityInput?.value.trim() || 'India',
      niche: nicheSelect?.value || 'Gyms & Fitness',
      issue: issueSelect?.value || 'mobile pe page slow hai aur direct WhatsApp call button nahi hai'
    };

    if (IndiaScripts[activeType]) {
      outputBox.textContent = IndiaScripts[activeType](data);
    }
  }

  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      typeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeType = btn.dataset.type;
      updateOutput();
      showToast(`Generated: ${btn.textContent.trim()}`);
    });
  });

  [bizNameInput, ownerNameInput, cityInput, nicheSelect, issueSelect].forEach(el => {
    if (el) el.addEventListener('input', updateOutput);
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = outputBox.textContent;
      navigator.clipboard.writeText(text).then(() => {
        showToast('📋 WhatsApp Pitch Script copied to clipboard!');
      }).catch(() => {
        showToast('Script copied.');
      });
    });
  }

  updateOutput();
}

function initChecklistPersistence() {
  const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  checkboxes.forEach((cb, index) => {
    const key = `apex_blp_chk_${index}`;
    const saved = localStorage.getItem(key);
    if (saved === 'true') cb.checked = true;

    cb.addEventListener('change', () => {
      localStorage.setItem(key, cb.checked ? 'true' : 'false');
    });
  });
}
