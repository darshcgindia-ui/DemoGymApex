/**
 * TOP FITNESS FLAGSHIP PRECISION BARBELL — HYPER-SMOOTH SCROLLYTELLING ENGINE
 * Pre-Decoded GPU Frames, Continuous Cosine Narrative Blending, Adaptive Physics Lerp
 */

(function() {
  'use strict';

  const TOTAL_FRAMES = 210;
  
  // Detect basePath (whether loaded from root or demos/ folder)
  const isDemoFolder = window.location.pathname.includes('/demos/');
  const imageBasePath = isDemoFolder ? '../Barbell Animation/' : 'Barbell Animation/';
  
  // State management
  const state = {
    images: [],
    loadedCount: 0,
    isLoaded: false,
    currentFrame: 0,
    targetFrame: 0,
    scrollProgress: 0,
    targetProgress: 0,
    currentProgress: 0,
    lastRenderedFrame: -1,
    soundEnabled: false,
    audioCtx: null,
    activePhaseIndex: 0
  };

  // DOM Elements
  let preloader, loaderBar, loaderStatus, topNav;
  let barbellCanvas, ctx, scrollyContainer, scrollySticky;
  let phaseSlides = [];
  let frameCounterHUD, progressPercentHUD;
  let manualScrubCanvas, manualCtx, scrubSlider, scrubPresetBtns;
  let reserveModal, openModalBtns, closeModalBtn, flagshipForm;
  let soundToggleBtn;

  // Phase layout configuration (Centers & active spans in 0.0 -> 1.0 progress)
  const PHASES = [
    { name: 'Intro', center: 0.04, span: 0.16 },
    { name: 'Explode', center: 0.28, span: 0.14 },
    { name: 'Bearings', center: 0.52, span: 0.14 },
    { name: 'Knurl', center: 0.76, span: 0.14 },
    { name: 'Lock', center: 0.98, span: 0.14 }
  ];

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    cacheDOM();
    initPreloaderAndImages();
    initCanvas();
    initScrollEngine();
    initManualScrubber();
    initModal();
    initAudioEngine();
    initNavBehavior();
  }

  function cacheDOM() {
    preloader = document.getElementById('preloader');
    loaderBar = document.getElementById('loaderBar');
    loaderStatus = document.getElementById('loaderStatus');
    topNav = document.getElementById('topNav');

    barbellCanvas = document.getElementById('barbellCanvas');
    if (barbellCanvas) {
      ctx = barbellCanvas.getContext('2d', { alpha: false, desynchronized: true });
    }

    scrollyContainer = document.getElementById('scrollyContainer');
    scrollySticky = document.getElementById('scrollySticky');

    phaseSlides = Array.from(document.querySelectorAll('.phase-slide'));
    frameCounterHUD = document.getElementById('frameCounterHUD');
    progressPercentHUD = document.getElementById('progressPercentHUD');

    manualScrubCanvas = document.getElementById('manualScrubCanvas');
    if (manualScrubCanvas) {
      manualCtx = manualScrubCanvas.getContext('2d', { alpha: false, desynchronized: true });
    }
    scrubSlider = document.getElementById('scrubSlider');
    scrubPresetBtns = Array.from(document.querySelectorAll('.scrub-preset-btn'));

    reserveModal = document.getElementById('reserveModal');
    openModalBtns = Array.from(document.querySelectorAll('[data-open-reserve-modal]'));
    closeModalBtn = document.getElementById('closeReserveModal');
    flagshipForm = document.getElementById('flagshipReserveForm');

    soundToggleBtn = document.getElementById('soundToggleBtn');
    
    // HUD Phase Buttons
    document.querySelectorAll('.hud-phase-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const p = parseFloat(btn.dataset.phaseTarget);
        if (!isNaN(p) && scrollyContainer) {
          const scrollableDist = scrollyContainer.offsetHeight - window.innerHeight;
          const targetScroll = scrollyContainer.offsetTop + (p * scrollableDist);
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          playTickSound(520);
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     1. High-Performance Preloader Engine with GPU Pre-Decoding
     -------------------------------------------------------------------------- */
  function getFrameFilename(index) {
    const frameNum = String(index + 1).padStart(3, '0');
    return `${imageBasePath}ezgif-frame-${frameNum}.jpg`;
  }

  function initPreloaderAndImages() {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const src = getFrameFilename(i);
      
      img.onload = () => {
        // Pre-decode into GPU memory for microsecond blits
        if (typeof img.decode === 'function') {
          img.decode().catch(() => {}).finally(() => onFrameReady(i));
        } else {
          onFrameReady(i);
        }
      };

      img.onerror = () => {
        onFrameReady(i);
      };

      img.src = src;
      state.images.push(img);
    }
  }

  function onFrameReady(index) {
    state.loadedCount++;
    const percent = Math.min(100, Math.round((state.loadedCount / TOTAL_FRAMES) * 100));
    
    if (loaderBar) loaderBar.style.width = `${percent}%`;
    if (loaderStatus) {
      loaderStatus.textContent = `PRECISION OPTICS CACHED: ${percent}% (${state.loadedCount}/${TOTAL_FRAMES})`;
    }
    
    if (index === 0 && !state.isLoaded) {
      renderFrame(0);
    }

    if (state.loadedCount >= TOTAL_FRAMES && !state.isLoaded) {
      onAllImagesLoaded();
    }
  }

  function onAllImagesLoaded() {
    state.isLoaded = true;
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('loaded');
      }
      onScroll();
      renderFrame(0);
      if (manualScrubCanvas) renderManualFrame(0);
    }, 250);
  }

  /* --------------------------------------------------------------------------
     2. High-DPI Retina Canvas Rendering
     -------------------------------------------------------------------------- */
  function initCanvas() {
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();
  }

  function handleResize() {
    if (!barbellCanvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const rect = barbellCanvas.getBoundingClientRect();
    
    barbellCanvas.width = (rect.width || window.innerWidth) * dpr;
    barbellCanvas.height = (rect.height || window.innerHeight) * dpr;
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (manualScrubCanvas && manualCtx) {
      const mRect = manualScrubCanvas.getBoundingClientRect();
      manualScrubCanvas.width = mRect.width * dpr;
      manualScrubCanvas.height = mRect.height * dpr;
      manualCtx.imageSmoothingEnabled = true;
      manualCtx.imageSmoothingQuality = 'high';
    }

    state.lastRenderedFrame = -1; // Force immediate repaint
    renderFrame(Math.round(state.currentFrame));
    if (scrubSlider && manualScrubCanvas) {
      renderManualFrame(parseInt(scrubSlider.value, 10) || 0);
    }
  }

  function renderFrame(frameIndex) {
    if (!ctx || !barbellCanvas) return;
    const boundedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));
    const img = state.images[boundedIndex];

    // Clear background seamlessly with deep obsidian charcoal
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, barbellCanvas.width, barbellCanvas.height);

    if (img && img.complete && img.naturalWidth > 0) {
      const cWidth = barbellCanvas.width;
      const cHeight = barbellCanvas.height;
      const iWidth = img.naturalWidth;
      const iHeight = img.naturalHeight;

      // Centered contain scale
      const scale = Math.min(cWidth / iWidth, cHeight / iHeight) * 0.94;
      const drawWidth = iWidth * scale;
      const drawHeight = iHeight * scale;
      const drawX = (cWidth - drawWidth) / 2;
      const drawY = (cHeight - drawHeight) / 2;

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }
  }

  function renderManualFrame(frameIndex) {
    if (!manualCtx || !manualScrubCanvas) return;
    const boundedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));
    const img = state.images[boundedIndex];

    manualCtx.fillStyle = '#050505';
    manualCtx.fillRect(0, 0, manualScrubCanvas.width, manualScrubCanvas.height);

    if (img && img.complete && img.naturalWidth > 0) {
      const cWidth = manualScrubCanvas.width;
      const cHeight = manualScrubCanvas.height;
      const iWidth = img.naturalWidth;
      const iHeight = img.naturalHeight;

      const scale = Math.min(cWidth / iWidth, cHeight / iHeight) * 0.92;
      const drawWidth = iWidth * scale;
      const drawHeight = iHeight * scale;
      const drawX = (cWidth - drawWidth) / 2;
      const drawY = (cHeight - drawHeight) / 2;

      manualCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }
  }

  /* --------------------------------------------------------------------------
     3. Ultra-Smooth Continuous Scrollytelling Loop
     -------------------------------------------------------------------------- */
  function initScrollEngine() {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    
    // Interactive drag/touch scrub on canvas viewport
    initViewportGestureScrubber();

    onScroll();
    requestAnimationFrame(animationLoop);
  }

  function onScroll() {
    if (!scrollyContainer) return;
    const rect = scrollyContainer.getBoundingClientRect();
    const scrollableDist = scrollyContainer.offsetHeight - window.innerHeight;
    
    if (scrollableDist <= 0) return;

    // Normal continuous progression: 0.0 at top of scrolly container to 1.0 at exit
    const scrolled = -rect.top;
    const p = Math.max(0, Math.min(1, scrolled / scrollableDist));
    
    state.targetProgress = p;

    if (window.scrollY > 40) {
      topNav?.classList.add('scrolled');
    } else {
      topNav?.classList.remove('scrolled');
    }
  }

  function initViewportGestureScrubber() {
    if (!scrollySticky) return;
    let isDragging = false;
    let startY = 0;
    let startProgress = 0;

    scrollySticky.addEventListener('pointerdown', (e) => {
      // Don't drag if clicking buttons or links
      if (e.target.closest('button, a, input')) return;
      isDragging = true;
      startY = e.clientY;
      startProgress = state.currentProgress;
      scrollySticky.setPointerCapture(e.pointerId);
    });

    scrollySticky.addEventListener('pointermove', (e) => {
      if (!isDragging || !scrollyContainer) return;
      const deltaY = startY - e.clientY;
      const sensitivity = 0.0055; // Snappy 1-scroll frame advancement
      const newProgress = Math.max(0, Math.min(1, startProgress + (deltaY * sensitivity)));
      
      const scrollableDist = scrollyContainer.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: scrollyContainer.offsetTop + (newProgress * scrollableDist),
        behavior: 'auto'
      });
    });

    const endDrag = (e) => {
      if (isDragging) {
        isDragging = false;
        try { scrollySticky.releasePointerCapture(e.pointerId); } catch(err) {}
      }
    };

    scrollySticky.addEventListener('pointerup', endDrag);
    scrollySticky.addEventListener('pointercancel', endDrag);
  }

  function updateNarrativePhaseContinuous(progress) {
    let dominantIndex = 0;
    let maxOpacity = 0;

    phaseSlides.forEach((slide, idx) => {
      const cfg = PHASES[idx];
      if (!cfg) return;

      const dist = Math.abs(progress - cfg.center);
      
      if (dist < cfg.span) {
        // Continuous Cosine Bell Curve: 1.0 at center down to 0.0 at edge
        const normDist = dist / cfg.span;
        const opacity = Math.max(0, Math.min(1, 0.5 * (1 + Math.cos(normDist * Math.PI))));
        const translateY = (1 - opacity) * (progress > cfg.center ? -20 : 20);

        slide.style.opacity = opacity.toFixed(3);
        slide.style.transform = `translateY(${translateY.toFixed(1)}px)`;
        slide.style.pointerEvents = opacity > 0.35 ? 'auto' : 'none';

        if (opacity > maxOpacity) {
          maxOpacity = opacity;
          dominantIndex = idx;
        }
      } else {
        slide.style.opacity = '0';
        slide.style.transform = `translateY(${progress > cfg.center ? '-20px' : '20px'})`;
        slide.style.pointerEvents = 'none';
      }
    });

    // Update HUD phase indicator if changed
    if (dominantIndex !== state.activePhaseIndex) {
      state.activePhaseIndex = dominantIndex;
      
      const hudPhaseBtns = document.querySelectorAll('.hud-phase-btn');
      hudPhaseBtns.forEach((btn, idx) => {
        if (idx === dominantIndex) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      playHapticSound(dominantIndex);
    }
  }

  function animationLoop() {
    // Snappy, agile exponential lerp (damping factor 0.22 for responsive 1-scroll frame scrubbing)
    const pDelta = state.targetProgress - state.currentProgress;
    
    if (Math.abs(pDelta) > 0.00005) {
      state.currentProgress += pDelta * 0.22;
      state.scrollProgress = state.currentProgress;
      state.targetFrame = state.currentProgress * (TOTAL_FRAMES - 1);
      
      const frameDelta = state.targetFrame - state.currentFrame;
      state.currentFrame += frameDelta * 0.35;
      const roundedFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(state.currentFrame)));
      
      if (roundedFrame !== state.lastRenderedFrame) {
        state.lastRenderedFrame = roundedFrame;
        renderFrame(roundedFrame);
      }

      if (frameCounterHUD) {
        frameCounterHUD.textContent = `FRAME ${String(roundedFrame + 1).padStart(3, '0')} / ${TOTAL_FRAMES}`;
      }

      if (progressPercentHUD) {
        progressPercentHUD.textContent = `${Math.round(state.currentProgress * 100)}%`;
      }

      updateNarrativePhaseContinuous(state.currentProgress);
    }

    requestAnimationFrame(animationLoop);
  }

  /* --------------------------------------------------------------------------
     4. Interactive Manual Frame Scrubber
     -------------------------------------------------------------------------- */
  function initManualScrubber() {
    if (!scrubSlider) return;

    scrubSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      renderManualFrame(val);
      updateScrubButtonsState(val);
      playTickSound();
    });

    scrubPresetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = parseInt(btn.dataset.frame, 10);
        if (!isNaN(target)) {
          scrubSlider.value = target;
          renderManualFrame(target);
          updateScrubButtonsState(target);
          playTickSound();
        }
      });
    });
  }

  function updateScrubButtonsState(currentVal) {
    scrubPresetBtns.forEach((btn) => {
      const target = parseInt(btn.dataset.frame, 10);
      if (Math.abs(target - currentVal) < 15) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. Apple-Style Fixed Navigation Behavior
     -------------------------------------------------------------------------- */
  function initNavBehavior() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        topNav?.classList.add('scrolled');
      } else {
        topNav?.classList.remove('scrolled');
      }
    }, { passive: true });

    // Smooth scroll for nav anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#buy') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. Synthesized Web Audio Ambience & Haptics (Zero dependencies)
     -------------------------------------------------------------------------- */
  function initAudioEngine() {
    if (!soundToggleBtn) return;

    soundToggleBtn.addEventListener('click', () => {
      if (!state.audioCtx) {
        state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }

      state.soundEnabled = !state.soundEnabled;
      if (state.soundEnabled) {
        soundToggleBtn.innerHTML = '🔊';
        soundToggleBtn.style.color = 'var(--accent-cyan)';
        playTickSound(660);
      } else {
        soundToggleBtn.innerHTML = '🔇';
        soundToggleBtn.style.color = 'var(--text-secondary)';
      }
    });
  }

  function playTickSound(freq = 440) {
    if (!state.soundEnabled || !state.audioCtx) return;
    try {
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.015, state.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
      osc.start();
      osc.stop(state.audioCtx.currentTime + 0.08);
    } catch(e) {}
  }

  function playHapticSound(phase) {
    if (!state.soundEnabled || !state.audioCtx) return;
    try {
      const freqs = [320, 480, 640, 520, 800];
      const targetFreq = freqs[phase] || 440;
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(targetFreq, state.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.025, state.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
      osc.start();
      osc.stop(state.audioCtx.currentTime + 0.14);
    } catch(e) {}
  }

  /* --------------------------------------------------------------------------
     7. Flagship Customizer & Reservation Modal
     -------------------------------------------------------------------------- */
  function initModal() {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }

    if (reserveModal) {
      reserveModal.addEventListener('click', (e) => {
        if (e.target === reserveModal) closeModal();
      });
    }

    // Finish & Weight selection cards
    document.querySelectorAll('.option-select-card').forEach(card => {
      card.addEventListener('click', function() {
        const parentRow = this.closest('.option-cards-row');
        if (parentRow) {
          parentRow.querySelectorAll('.option-select-card').forEach(c => c.classList.remove('selected'));
          this.classList.add('selected');
        }
      });
    });

    if (flagshipForm) {
      flagshipForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = flagshipForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'ALLOCATING SERIAL NUMBER... ⚡';
        }

        setTimeout(() => {
          alert('✓ Flagship Barbell allocation confirmed. Our master machinist team will contact you with batch certification details.');
          closeModal();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'CONFIRM RESERVATION & ALLOCATE SERIAL →';
          }
          flagshipForm.reset();
        }, 1000);
      });
    }
  }

  function openModal() {
    if (!reserveModal) return;
    reserveModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!reserveModal) return;
    reserveModal.classList.remove('open');
    document.body.style.overflow = '';
  }

})();
