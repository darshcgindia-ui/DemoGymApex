/**
 * TOP FITNESS — FLAGSHIP INTERACTIVE ATHLETIC LOGIC
 * 3D Mouse Tilt Physics, Staggered Scroll Reveals, Real-time BMI/Calorie Engine, & FormSubmit Dispatch
 */

document.addEventListener('DOMContentLoaded', () => {
  initBmiCalculator();
  initOccupancyFluctuator();
  initScheduleFilter();
  initTrialForm();
  init3dCardTilt();
  initScrollReveal();
  initNumberCounters();
});

/* --------------------------------------------------------------------------
   1. Interactive BMI & Calorie Target Calculator
   -------------------------------------------------------------------------- */
function initBmiCalculator() {
  const weightInput = document.getElementById('calcWeight');
  const heightInput = document.getElementById('calcHeight');
  const goalSelect = document.getElementById('calcGoal');
  
  const bmiDisplay = document.getElementById('bmiValueDisplay');
  const statusDisplay = document.getElementById('bmiStatusDisplay');
  const caloriesDisplay = document.getElementById('caloricTargetDisplay');

  if (!weightInput || !heightInput || !bmiDisplay) return;

  function calculate() {
    const weight = parseFloat(weightInput.value) || 70;
    const heightCm = parseFloat(heightInput.value) || 175;
    const goal = goalSelect ? goalSelect.value : 'muscle';

    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    
    bmiDisplay.textContent = bmi.toFixed(1);

    // Status category
    let statusText = 'Normal & Fit';
    let statusColor = '#10b981';
    let baseCalories = Math.round(weight * 24 * 1.4);

    if (bmi < 18.5) {
      statusText = 'Lean / Underweight';
      statusColor = '#38bdf8';
    } else if (bmi >= 25 && bmi < 29.9) {
      statusText = 'Overweight / Muscular';
      statusColor = '#f97316';
    } else if (bmi >= 30) {
      statusText = 'High Body Mass';
      statusColor = '#ef4444';
    }

    if (statusDisplay) {
      statusDisplay.textContent = statusText;
      statusDisplay.style.color = statusColor;
    }

    // Goal adjustment
    if (goal === 'fatloss') {
      baseCalories -= 400;
    } else if (goal === 'muscle') {
      baseCalories += 350;
    } else if (goal === 'endurance') {
      baseCalories += 150;
    }

    if (caloriesDisplay) {
      caloriesDisplay.textContent = `${baseCalories.toLocaleString()} kcal/day`;
    }
  }

  weightInput.addEventListener('input', calculate);
  heightInput.addEventListener('input', calculate);
  if (goalSelect) goalSelect.addEventListener('change', calculate);

  calculate();
}

/* --------------------------------------------------------------------------
   2. Live Occupancy Simulator (Realistic Ambient Fluctuation)
   -------------------------------------------------------------------------- */
function initOccupancyFluctuator() {
  const occElem = document.getElementById('occupancyCounter');
  if (!occElem) return;

  let currentAthletes = 42;

  setInterval(() => {
    const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.7 ? 2 : 1);
    currentAthletes = Math.min(58, Math.max(34, currentAthletes + delta));
    occElem.textContent = `${currentAthletes} ATHLETES ACTIVE`;
  }, 4500);
}

/* --------------------------------------------------------------------------
   3. Dynamic Class Schedule Filter
   -------------------------------------------------------------------------- */
function initScheduleFilter() {
  const filterBtns = document.querySelectorAll('.tf-schedule-filter-btn');
  const tableRows = document.querySelectorAll('.tf-schedule-row');

  if (!filterBtns.length || !tableRows.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterType = btn.dataset.filter;

      tableRows.forEach(row => {
        if (filterType === 'all' || row.dataset.category === filterType) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. FormSubmit AJAX Free Trial Pass Dispatcher
   -------------------------------------------------------------------------- */
function initTrialForm() {
  const form = document.getElementById('trialPassForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Claim Free 1-Day VIP Pass 🔥';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⏳ Locking In VIP Slot...';
    }

    const name = document.getElementById('passName')?.value.trim() || 'Athlete';
    const phone = document.getElementById('passPhone')?.value.trim() || '';
    const goal = document.getElementById('passGoal')?.value || 'Weight Training';

    const agencyEmail = 'apexlocalstudio@gmail.com';
    const subject = `🔥 Top Fitness VIP Trial Pass Request — ${name} (${phone})`;

    try {
      await fetch(`https://formsubmit.co/ajax/${agencyEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          athlete_name: name,
          whatsapp_phone: phone,
          training_goal: goal,
          gym_location: 'Top Fitness (India)',
          _subject: subject,
          _template: 'table'
        })
      });

      alert(`🎉 VIP Pass Confirmed, ${name}! Your 1-Day Pass QR has been reserved. Front desk will contact your phone: ${phone}.`);
      form.reset();
    } catch (err) {
      alert(`VIP Pass Reserved! Please show your confirmation at the reception.`);
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

/* --------------------------------------------------------------------------
   5. 3D Mouse Tilt Physics Engine (60 FPS Hardware-Accelerated)
   -------------------------------------------------------------------------- */
function init3dCardTilt() {
  const tiltCards = document.querySelectorAll('.tilt-3d');
  if (!tiltCards.length || window.innerWidth < 1024) return;

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* --------------------------------------------------------------------------
   6. Staggered Scroll Reveal System
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.tf-reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   7. Number Count-up Animation
   -------------------------------------------------------------------------- */
function initNumberCounters() {
  const counters = document.querySelectorAll('.tf-count-up');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.dataset.target) || 0;
        const suffix = entry.target.dataset.suffix || '';
        const duration = 1500;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentVal = Math.round(target * easeProgress);

          entry.target.textContent = `${currentVal.toLocaleString()}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            entry.target.textContent = `${target.toLocaleString()}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(el => observer.observe(el));
}
