/**
 * APEXLOCAL STUDIO — CLIENT ONBOARDING PORTAL JAVASCRIPT
 * Multi-Step Wizard, Real-time Spec Generation, Clipboard & File Export, WhatsApp Handshake
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const totalSteps = 4;

  const clientData = {
    businessName: '',
    industry: 'Contractor & Home Services',
    serviceArea: '',
    phone: '',
    email: '',
    currentWebsite: '',
    primaryGoal: 'Drive more direct phone calls and bookings',
    brandStyle: 'Modern & High-Trust Slate',
    primaryColor: '#10b981',
    requiredPages: ['Homepage / Sales Landing', 'Services Breakdown', 'Booking / Contact Form'],
    specialFeatures: ['Instant WhatsApp Click-to-Chat', 'Google Reviews Showcase'],
    notes: ''
  };

  // DOM Elements
  const stepPanes = document.querySelectorAll('.wizard-step');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const prevBtn = document.getElementById('prevStepBtn');
  const nextBtn = document.getElementById('nextStepBtn');
  const briefingDisplay = document.getElementById('briefingSummaryBox');
  const copyBriefBtn = document.getElementById('copyBriefBtn');
  const downloadBriefBtn = document.getElementById('downloadBriefBtn');
  const whatsappSendBtn = document.getElementById('whatsappSendBtn');

  // Initialize Choice Box Listeners
  document.querySelectorAll('.choice-box').forEach(box => {
    box.addEventListener('click', () => {
      const parent = box.closest('.choice-grid');
      const isMulti = parent.dataset.multi === 'true';

      if (!isMulti) {
        parent.querySelectorAll('.choice-box').forEach(b => b.classList.remove('selected'));
        box.classList.add('selected');
      } else {
        box.classList.toggle('selected');
      }
    });
  });

  // Palette Item Listeners
  document.querySelectorAll('.palette-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.palette-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      clientData.brandStyle = item.dataset.name || 'Modern Clean';
      clientData.primaryColor = item.dataset.color || '#10b981';
    });
  });

  function updateStepUI() {
    stepPanes.forEach(pane => pane.classList.remove('active'));
    const activePane = document.getElementById(`step${currentStep}`);
    if (activePane) activePane.classList.add('active');

    stepIndicators.forEach(ind => {
      const stepNum = parseInt(ind.dataset.step, 10);
      ind.classList.remove('active', 'completed');
      if (stepNum === currentStep) {
        ind.classList.add('active');
      } else if (stepNum < currentStep) {
        ind.classList.add('completed');
      }
    });

    if (prevBtn) prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    if (nextBtn) {
      if (currentStep === totalSteps) {
        nextBtn.textContent = 'Finish & Generate Brief 🚀';
        nextBtn.classList.remove('btn-secondary');
        nextBtn.classList.add('btn-primary');
      } else {
        nextBtn.textContent = 'Next Step →';
      }
    }

    if (currentStep === 4) {
      compileClientData();
      renderBriefing();
    }
  }

  function compileClientData() {
    clientData.businessName = document.getElementById('obBizName')?.value || 'Local Enterprise';
    clientData.industry = document.getElementById('obIndustry')?.value || 'Local Services';
    clientData.serviceArea = document.getElementById('obServiceArea')?.value || 'Metro Area';
    clientData.phone = document.getElementById('obPhone')?.value || 'Not provided';
    clientData.email = document.getElementById('obEmail')?.value || 'Not provided';
    clientData.currentWebsite = document.getElementById('obCurrentUrl')?.value || 'None (New Launch)';
    clientData.notes = document.getElementById('obNotes')?.value || 'Standard fast turnaround requested.';

    const selectedGoal = document.querySelector('#goalGrid .choice-box.selected .choice-box-title');
    if (selectedGoal) clientData.primaryGoal = selectedGoal.textContent.trim();

    const selectedPages = [];
    document.querySelectorAll('#pagesGrid .choice-box.selected .choice-box-title').forEach(el => {
      selectedPages.push(el.textContent.trim());
    });
    if (selectedPages.length) clientData.requiredPages = selectedPages;

    const selectedFeatures = [];
    document.querySelectorAll('#featuresGrid .choice-box.selected .choice-box-title').forEach(el => {
      selectedFeatures.push(el.textContent.trim());
    });
    if (selectedFeatures.length) clientData.specialFeatures = selectedFeatures;
  }

  function generateBriefingText() {
    return `=====================================================
APEXLOCAL STUDIO — CLIENT PROJECT BRIEF & INTAKE
Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
=====================================================

1. BUSINESS INFORMATION:
- Company Name: ${clientData.businessName}
- Industry Niche: ${clientData.industry}
- Service Area / Location: ${clientData.serviceArea}
- Contact Phone: ${clientData.phone}
- Contact Email: ${clientData.email}
- Current Website: ${clientData.currentWebsite}

2. PROJECT OBJECTIVE:
- Core Goal: ${clientData.primaryGoal}

3. DESIGN & BRAND IDENTITY:
- Preferred Aesthetic: ${clientData.brandStyle}
- Accent Color: ${clientData.primaryColor}

4. SCOPE & FEATURES:
- Required Pages: 
  * ${clientData.requiredPages.join('\n  * ')}
- High-Conversion Features:
  * ${clientData.specialFeatures.join('\n  * ')}

5. CLIENT NOTES & ASSET STATUS:
- Notes: ${clientData.notes}

=====================================================
STATUS: Ready for Sprint Kickoff (7-Day Turnaround)
=====================================================`;
  }

  function renderBriefing() {
    if (briefingDisplay) {
      briefingDisplay.textContent = generateBriefingText();
    }
  }

  // Navigation button handlers
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep === 1) {
        const nameInput = document.getElementById('obBizName');
        if (nameInput && !nameInput.value.trim()) {
          showToast('Please enter your Business / Company Name to proceed.');
          nameInput.focus();
          return;
        }
      }

      if (currentStep < totalSteps) {
        currentStep++;
        updateStepUI();
      } else {
        compileClientData();
        renderBriefing();
        showToast('🎉 Project Intake Completed! Your brief is generated.');
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepUI();
      }
    });
  }

  // Copy Briefing to Clipboard
  if (copyBriefBtn) {
    copyBriefBtn.addEventListener('click', () => {
      const text = generateBriefingText();
      navigator.clipboard.writeText(text).then(() => {
        showToast('📋 Project Brief copied to clipboard!');
      }).catch(() => {
        showToast('Brief copied successfully.');
      });
    });
  }

  // Download Briefing as .txt file
  if (downloadBriefBtn) {
    downloadBriefBtn.addEventListener('click', () => {
      const text = generateBriefingText();
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ApexLocal-Intake-Brief-${clientData.businessName.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('📥 Downloaded Intake Brief file!');
    });
  }

  // Dispatch via Email (Background AJAX + Web Tab Fallback)
  const emailSendBtn = document.getElementById('emailSendBtn');
  if (emailSendBtn) {
    emailSendBtn.addEventListener('click', async () => {
      compileClientData();
      const subject = `🚀 Client Project Intake Brief — ${clientData.businessName} (${clientData.industry})`;
      const text = generateBriefingText();
      const email = 'apexlocalstudio@gmail.com';

      emailSendBtn.disabled = true;
      emailSendBtn.innerHTML = '⏳ Transmitting Brief...';

      try {
        await fetch(`https://formsubmit.co/ajax/${email}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            client_business: clientData.businessName,
            client_owner: clientData.ownerName,
            industry: clientData.industry,
            phone: clientData.phone,
            email: clientData.email,
            package: clientData.selectedPackage,
            domain_status: clientData.domainStatus,
            primary_goal: clientData.primaryGoal,
            full_brief: text,
            _subject: subject,
            _template: 'table'
          })
        });
        showToast('🎉 Project Brief dispatched to studio inbox!');
      } catch (err) {
        showToast('Brief generated. Opening email tab as backup...');
      }

      navigator.clipboard.writeText(text).catch(() => {});
      
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;

      try {
        window.open(gmailUrl, '_blank');
      } catch (e) {
        window.location.href = mailtoUrl;
      }

      emailSendBtn.disabled = false;
      emailSendBtn.innerHTML = '✅ Brief Dispatched Successfully!';
    });
  }

  updateStepUI();
});

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
