/**
 * APEXLOCAL STUDIO — LUXURY AWWWARDS-GRADE AGENCY CLIENT ENGINE
 * Kinetic Rotator, Reactive ROI Estimator, Spotlight Card Physics, Live Demo Switcher, AJAX Form Router
 */

/* --------------------------------------------------------------------------
   0. Centralized Agency Contact Configuration
   -------------------------------------------------------------------------- */
const AGENCY_CONFIG = {
  email: 'apexlocalstudio@gmail.com',
  agencyName: 'ApexLocal Studio',
  location: 'Pan India — Serving businesses across Delhi, Mumbai, Bangalore, Hyderabad & beyond',
  hours: 'Mon–Sat: 9:00 AM – 8:00 PM IST',
  turnaround: '3–5 Business Days'
};

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initDemoSwitcher();
  initViewportToggle();
  initBookingModal();
  initInfoModal();
  initFAQ();
  initTheme();
  initScrollProgressBar();
  initHeadlineRotator();
  initScrollReveal();
  initAnimatedCounters();
  initSpotlightCards();
});

/* --------------------------------------------------------------------------
   1. Navbar Scroll Glass State
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
}

/* --------------------------------------------------------------------------
   2. Live Prototype Niche Demo Switcher
   -------------------------------------------------------------------------- */
function initDemoSwitcher() {
  const tabs = document.querySelectorAll('.demo-tab-btn');
  const iframe = document.getElementById('demoIframe');
  const urlDisplay = document.getElementById('browserUrlDisplay');
  const launchLinks = document.querySelectorAll('.browser-live-tag, #openFullSiteBtn');

  if (!tabs.length || !iframe) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const src = tab.dataset.src;
      const fullUrl = tab.dataset.fullUrl || src;
      const displayUrl = tab.dataset.url || 'https://topfitness.India.in';

      iframe.src = src;
      if (urlDisplay) urlDisplay.textContent = displayUrl;
      launchLinks.forEach(link => {
        link.href = fullUrl;
      });

      showToast(`Loaded ${tab.textContent.trim()}`);
    });
  });
}

/* --------------------------------------------------------------------------
   3. Desktop vs Mobile Viewport Switcher
   -------------------------------------------------------------------------- */
function initViewportToggle() {
  const desktopBtn = document.getElementById('viewDesktopBtn');
  const mobileBtn = document.getElementById('viewMobileBtn');
  const browserFrame = document.getElementById('browserFrame');

  if (!desktopBtn || !mobileBtn || !browserFrame) return;

  desktopBtn.addEventListener('click', () => {
    desktopBtn.classList.add('active');
    mobileBtn.classList.remove('active');
    browserFrame.classList.remove('view-mobile');
    browserFrame.classList.add('view-desktop');
    showToast('Switched to Desktop Widescreen View');
  });

  mobileBtn.addEventListener('click', () => {
    mobileBtn.classList.add('active');
    desktopBtn.classList.remove('active');
    browserFrame.classList.remove('view-desktop');
    browserFrame.classList.add('view-mobile');
    showToast('Switched to Mobile Smartphone View (375px)');
  });
}

/* --------------------------------------------------------------------------
   4. Strategy Call / Email Booking Modal
   -------------------------------------------------------------------------- */
function initBookingModal() {
  const openButtons = document.querySelectorAll('[data-open-modal="bookingModal"]');
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('closeBookingModal');
  const bookingForm = document.getElementById('strategyBookingForm');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Confirm Booking & Reserve Slot →';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ Transmitting Details...';
      }

      const name = document.getElementById('bookName')?.value.trim() || 'Client';
      const biz = document.getElementById('bookBiz')?.value.trim() || 'Local Business';
      const phone = document.getElementById('bookPhone')?.value.trim() || 'Not specified';
      const pkg = document.getElementById('bookPackage')?.value || '1-Page High-Converting Funnel (₹10,000)';

      const subject = `🚀 Strategy Session Booking — ${biz} (${name})`;
      const body = `Namaste ApexLocal Studio,\n\n` +
        `I would like to schedule a 10-minute strategy session for my business across India.\n\n` +
        `📋 CLIENT INQUIRY DETAILS:\n` +
        `• Full Name: ${name}\n` +
        `• Business & Area: ${biz}\n` +
        `• Contact Phone Number: ${phone}\n` +
        `• Selected Service Tier: ${pkg}\n\n` +
        `Please connect with available strategy call slots and relevant prototypes.\n\n` +
        `Best regards,\n${name}`;

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${AGENCY_CONFIG.email}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            business_name_and_zone: biz,
            phone_number: phone,
            selected_package: pkg,
            _subject: subject,
            _template: 'table'
          })
        });

        if (response.ok) {
          showToast(`🎉 Strategy brief received! We will connect within 2 hours.`);
        } else {
          showToast(`Inquiry logged. Opening email composer...`);
        }
      } catch (err) {
        showToast(`Inquiry recorded. Opening email composer...`);
      }

      navigator.clipboard.writeText(AGENCY_CONFIG.email).catch(() => {});
      
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${AGENCY_CONFIG.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const mailtoUrl = `mailto:${AGENCY_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      try {
        window.open(gmailUrl, '_blank');
      } catch (e) {
        window.location.href = mailtoUrl;
      }

      closeModal();
      bookingForm.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. Interactive Info & Contact Modal
   -------------------------------------------------------------------------- */
function initInfoModal() {
  const openButtons = document.querySelectorAll('[data-open-modal="infoModal"]');
  const modal = document.getElementById('infoModal');
  const closeBtn = document.getElementById('closeInfoModal');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   7. 1-Click Copy Email & Direct Email Dispatch Helpers
   -------------------------------------------------------------------------- */
window.copyEmailToClipboard = function() {
  navigator.clipboard.writeText(AGENCY_CONFIG.email).then(() => {
    showToast(`📋 Copied to clipboard: ${AGENCY_CONFIG.email}`);
  }).catch(() => {
    showToast(`Email: ${AGENCY_CONFIG.email}`);
  });
};

window.openEmailInquiry = function(customSubject, customBody) {
  const subject = customSubject || `Inquiry for ApexLocal Studio (India)`;
  const body = customBody || `Namaste ApexLocal Studio,\n\nI am interested in exploring your high-converting websites and rate card across India.\n\nMy Business Name:\nMy Contact Phone:\n\nThank you!`;
  
  navigator.clipboard.writeText(AGENCY_CONFIG.email).then(() => {
    showToast(`✉️ Copied ${AGENCY_CONFIG.email} & opening composer...`);
  }).catch(() => {
    showToast(`Drafting email to ${AGENCY_CONFIG.email}...`);
  });

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${AGENCY_CONFIG.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const mailtoUrl = `mailto:${AGENCY_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  const win = window.open(gmailUrl, '_blank');
  if (!win || win.closed || typeof win.closed === 'undefined') {
    window.location.href = mailtoUrl;
  }
};

/* --------------------------------------------------------------------------
   8. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(i => {
          i.classList.remove('active');
          const a = i.querySelector('.faq-answer');
          if (a) a.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   9. Toast Notification Utility
   -------------------------------------------------------------------------- */
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

/* --------------------------------------------------------------------------
   10. Theme Toggle Support
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('themeToggleBtn');
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem('apex_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('apex_theme', next);
    showToast(`Switched to ${next.toUpperCase()} theme`);
  });
}

/* --------------------------------------------------------------------------
   11. Reading Scroll Progress Bar
   -------------------------------------------------------------------------- */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (height > 0) {
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   12. Kinetic Hero Rotating Headline Niches
   -------------------------------------------------------------------------- */
function initHeadlineRotator() {
  const rotatorElem = document.getElementById('heroRotator');
  if (!rotatorElem) return;

  const niches = [
    'Clinics & Doctors',
    'Builders & Architects',
    'Gyms & Fitness Studios',
    'Rooftops & Banquets',
    'Advocates & Legal Chambers'
  ];
  let currentIndex = 0;

  setInterval(() => {
    rotatorElem.style.opacity = '0';
    rotatorElem.style.transform = 'translateY(-8px)';

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % niches.length;
      rotatorElem.textContent = niches[currentIndex];
      rotatorElem.style.opacity = '1';
      rotatorElem.style.transform = 'translateY(0)';
    }, 280);
  }, 3200);
}

/* --------------------------------------------------------------------------
   13. Staggered Scroll Reveal System (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-init');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   14. Animated Counter Tickers
   -------------------------------------------------------------------------- */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('.counter-num');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.dataset.target) || 0;
        const prefix = entry.target.dataset.prefix || '';
        const suffix = entry.target.dataset.suffix || '';
        const isCurrency = entry.target.dataset.format === 'currency';

        let start = 0;
        const duration = 1400;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = start + (target - start) * easeProgress;

          if (isCurrency) {
            entry.target.textContent = `${prefix}${Math.round(currentVal).toLocaleString('en-IN')}${suffix}`;
          } else if (target < 10 && target % 1 !== 0) {
            entry.target.textContent = `${prefix}${currentVal.toFixed(1)}${suffix}`;
          } else {
            entry.target.textContent = `${prefix}${Math.round(currentVal)}${suffix}`;
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            if (isCurrency) {
              entry.target.textContent = `${prefix}${target.toLocaleString('en-IN')}${suffix}`;
            } else {
              entry.target.textContent = `${prefix}${target}${suffix}`;
            }
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  counterElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   15. Interactive Spotlight Cards (Mouse Glow Tracking)
   -------------------------------------------------------------------------- */
function initSpotlightCards() {
  const cards = document.querySelectorAll('.tactile-card, .editorial-card, .process-card, .pricing-card, .review-card, .compare-box');
  
  cards.forEach(card => {
    card.classList.add('spotlight-card');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}
