/**
 * ==============================================================================
 * ROMANTIC APOLOGY WEB APP - MAIN JAVASCRIPT
 * Multi-screen, mobile-first, soft & heartfelt romantic experience.
 * All customizable texts and settings are grouped below in CONFIG.
 * ==============================================================================
 */

// ==============================================================================
// 1. GLOBAL CONFIGURATION (EASY TO EDIT)
// ==============================================================================
const CONFIG = {
  // Screen 1: Measure Love
  measureDurationMs: 7000, // 7 seconds (between 6 to 8 seconds)
  measureErrorText: "Error! The love is a lot, we cannot measure. ❤️",
  measureStatuses: [
    { atPct: 0, text: "Scanning heartbeat frequencies... 💓" },
    { atPct: 25, text: "Measuring warmth & tenderness... ✨" },
    { atPct: 50, text: "Calculating infinite affection... 💖" },
    { atPct: 75, text: "Warning: Value exceeding universe limit... ⚡" },
    { atPct: 90, text: "System memory overloaded! ❤️‍🔥" }
  ],

  // Screen 2: The Love Letter
  letterTitle: "Thanks for being so kind Shruv ❤️",
  letterText: "I am really really sorry mara bachha ❤️❤️ I made upset the most adorable and lovely person in my life - You 🥹. Please forgive me my jannah ❤️ If I hurt you and wasted little bit of your precious time of mine ❤️ I promise I didn't mean to my sweetheart ❤️",
  typingSpeedMs: 38, // Typing delay in ms per character

  // Screen 3: Gift Box
  giftTitle: "Please accept my apology bribes :)",
  giftSubtitle: "I prepared something special to make you smile ✨",

  // Screen 4: The Three Bribes
  bribesTitle: "Your Apology Bribes",
  bribes: [
    {
      id: "bloom",
      title: "Fresh Bloom",
      desc: "A radiant fresh bouquet to brighten your day and bring that lovely smile back. 🌸",
      badge: "🌿 Always Fresh",
      emoji: "💐"
    },
    {
      id: "cuddle",
      title: "Cuddle Pass",
      desc: "Valid for unlimited cuddles",
      badge: "VIP PASS • NO EXPIRY",
      emoji: "🎟️"
    },
    {
      id: "sweet",
      title: "Sweet Treat",
      desc: "Only valid for your chocolate + my full attention",
      badge: "🍓 100% Sweetness",
      emoji: "🍫"
    }
  ],
  bribeAcceptBtnText: "Accept All Three Bribes",

  // Screen 5: New Beginnings
  beginningsTitle: "New Beginnings Ahead 💞",
  romanticPhotoSrc: "images/us.jpg",
  romanticQuote: "Every day with you is my favourite chapter, and I promise to write the next ones with more patience and more love.",
  romanticSignoff: "I love you, always. ❤️",

  // Audio settings
  synthTempoBpm: 68
};

// ==============================================================================
// 2. STATE MANAGEMENT & DOM REFERENCES
// ==============================================================================
const STATE = {
  currentScreen: 1,
  isTransitioning: false,
  isMeasuring: false,
  measureTimer: null,
  isTyping: false,
  typewriterTimeout: null,
  letterFullyTyped: false,
  giftOpened: false,
  isMusicPlaying: false,
  audioContext: null,
  musicLoopId: null
};

// DOM Elements Store
const DOM = {};

function initDOMElements() {
  DOM.screens = document.querySelectorAll('.screen');
  DOM.heartsCanvas = document.getElementById('hearts-canvas');
  DOM.confettiCanvas = document.getElementById('confetti-canvas');
  DOM.musicToggleBtn = document.getElementById('music-toggle-btn');
  DOM.musicIcon = document.getElementById('music-icon');
  DOM.musicText = document.getElementById('music-text');
  DOM.bgAudio = document.getElementById('bg-audio');

  // Screen 1
  DOM.giantHeart = document.getElementById('giant-heart');
  DOM.measureInitBox = document.getElementById('measure-init-box');
  DOM.measureProgressBox = document.getElementById('measure-progress-box');
  DOM.btnMeasureLove = document.getElementById('btn-measure-love');
  DOM.progressTrack = document.getElementById('progress-track');
  DOM.progressFill = document.getElementById('progress-fill');
  DOM.progressPercentage = document.getElementById('progress-percentage');
  DOM.measureStatusTitle = document.getElementById('measure-status-title');
  DOM.measureSubstatus = document.getElementById('measure-substatus');
  DOM.measureErrorBox = document.getElementById('measure-error-box');
  DOM.measureErrorText = document.getElementById('measure-error-text');
  DOM.measureNextBox = document.getElementById('measure-next-box');
  DOM.btnToScreen2 = document.getElementById('btn-to-screen-2');

  // Screen 2
  DOM.letterCard = document.getElementById('letter-card');
  DOM.letterTitle = document.getElementById('letter-title');
  DOM.typewriterText = document.getElementById('typewriter-text');
  DOM.typewriterCursor = document.getElementById('typewriter-cursor');
  DOM.letterHint = document.getElementById('letter-hint');
  DOM.letterFooter = document.getElementById('letter-footer');
  DOM.btnToScreen3 = document.getElementById('btn-to-screen-3');

  // Screen 3
  DOM.giftTitle = document.getElementById('gift-title');
  DOM.giftSubtitle = document.getElementById('gift-subtitle');
  DOM.giftBoxStage = document.getElementById('gift-box-stage');
  DOM.giftTapPrompt = document.getElementById('gift-tap-prompt');

  // Screen 4
  DOM.bribesTitle = document.getElementById('bribes-title');
  DOM.btnAcceptBribes = document.getElementById('btn-accept-bribes');

  // Screen 5
  DOM.beginningsTitle = document.getElementById('beginnings-title');
  DOM.romanticPhoto = document.getElementById('romantic-photo');
  DOM.romanticQuote = document.getElementById('romantic-quote');
  DOM.romanticSignoff = document.getElementById('romantic-signoff');
  DOM.btnReplay = document.getElementById('btn-replay');
  DOM.btnReplayBottom = document.getElementById('btn-replay-bottom');
}

// ==============================================================================
// 3. SCREEN NAVIGATION & TRANSITIONS
// ==============================================================================

/**
 * Transitions smoothly from the current screen to the target screen.
 * Prevents glitching on double-taps using isTransitioning guard.
 * @param {number} targetScreenNum - 1 to 5
 */
function goToScreen(targetScreenNum) {
  if (STATE.isTransitioning) return;
  if (targetScreenNum === STATE.currentScreen && document.querySelector(`.screen[data-screen="${targetScreenNum}"].active`)) return;

  STATE.isTransitioning = true;

  const currentScreenEl = document.querySelector(`.screen[data-screen="${STATE.currentScreen}"]`);
  const targetScreenEl = document.querySelector(`.screen[data-screen="${targetScreenNum}"]`);

  if (!targetScreenEl) {
    STATE.isTransitioning = false;
    return;
  }

  // Animate out current screen
  if (currentScreenEl) {
    currentScreenEl.classList.remove('active');
    currentScreenEl.classList.add('leaving');
  }

  // Small delay for clean crossfade/slide
  setTimeout(() => {
    if (currentScreenEl) {
      currentScreenEl.classList.remove('leaving');
    }

    targetScreenEl.classList.add('active');
    STATE.currentScreen = targetScreenNum;

    // Trigger screen-specific entry setup
    onScreenEnter(targetScreenNum);

    // Release transition lock
    setTimeout(() => {
      STATE.isTransitioning = false;
    }, 450);
  }, 350);
}

/**
 * Called whenever a screen becomes active.
 * @param {number} screenNum 
 */
function onScreenEnter(screenNum) {
  // Scroll window to top cleanly for mobile
  window.scrollTo({ top: 0, behavior: 'smooth' });

  switch (screenNum) {
    case 1:
      // Reset measure screen if revisited
      resetMeasureScreen();
      break;
    case 2:
      // Start handwriting typewriter effect
      startLetterTypewriter();
      break;
    case 3:
      // Reset gift box
      resetGiftBox();
      break;
    case 4:
      // Stagger cards pop-out
      triggerBribesAnimation();
      break;
    case 5:
      // Celebratory entrance on Screen 5
      confettiManager.burstHeartShower();
      break;
  }
}

// ==============================================================================
// 4. SCREEN 1: MEASURE LOVE LOGIC
// ==============================================================================

function initMeasureScreen() {
  DOM.btnMeasureLove.addEventListener('click', startMeasuringLove);
  DOM.btnToScreen2.addEventListener('click', () => goToScreen(2));
}

function resetMeasureScreen() {
  STATE.isMeasuring = false;
  if (STATE.measureTimer) clearInterval(STATE.measureTimer);

  DOM.measureInitBox.classList.remove('hidden');
  DOM.measureProgressBox.classList.add('hidden');
  DOM.measureErrorBox.classList.add('hidden');
  DOM.measureNextBox.classList.add('hidden');

  DOM.progressFill.style.width = '0%';
  DOM.progressFill.classList.remove('error');
  DOM.progressTrack.classList.remove('shake');
  DOM.giantHeart.classList.remove('error-state');
  DOM.progressPercentage.textContent = '0%';
  DOM.measureStatusTitle.textContent = "Measuring love...";
  DOM.measureSubstatus.textContent = "Scanning heartbeat frequencies... 💓";
}

function startMeasuringLove() {
  if (STATE.isMeasuring) return;
  STATE.isMeasuring = true;

  // Sound chime / feedback
  soundEffects.playHeartbeat();

  // Morph button into progress bar
  DOM.measureInitBox.classList.add('hidden');
  DOM.measureProgressBox.classList.remove('hidden');

  const startTime = performance.now();
  const duration = CONFIG.measureDurationMs;
  const targetPctBeforeError = 93; // Stops before 100% at around 92-93%

  DOM.measureTimer = setInterval(() => {
    const elapsed = performance.now() - startTime;
    const progressRatio = Math.min(elapsed / duration, 1);

    // Eased percentage up to 93%
    const currentPct = Math.floor(progressRatio * targetPctBeforeError);
    DOM.progressFill.style.width = `${currentPct}%`;
    DOM.progressPercentage.textContent = `${currentPct}%`;

    // Dynamic substatus messages
    for (let i = CONFIG.measureStatuses.length - 1; i >= 0; i--) {
      if (currentPct >= CONFIG.measureStatuses[i].atPct) {
        DOM.measureSubstatus.textContent = CONFIG.measureStatuses[i].text;
        break;
      }
    }

    // Trigger Error at duration
    if (elapsed >= duration) {
      clearInterval(DOM.measureTimer);
      triggerMeasureError();
    }
  }, 50);
}

function triggerMeasureError() {
  // Shake progress bar & turn it red
  DOM.progressTrack.classList.add('shake');
  DOM.progressFill.classList.add('error');
  DOM.giantHeart.classList.add('error-state');

  // Update status and error message
  DOM.measureStatusTitle.textContent = "Overload! ❤️‍🔥";
  DOM.measureSubstatus.textContent = "Scale limit exceeded (Infinity / 100)";
  DOM.measureErrorText.textContent = CONFIG.measureErrorText;
  DOM.measureErrorBox.classList.remove('hidden');

  soundEffects.playErrorTone();

  // Fade in Next button after a brief pause
  setTimeout(() => {
    DOM.measureNextBox.classList.remove('hidden');
  }, 700);
}

// ==============================================================================
// 5. SCREEN 2: LOVE LETTER & TYPEWRITER LOGIC
// ==============================================================================

function initLetterScreen() {
  DOM.letterTitle.textContent = CONFIG.letterTitle;
  DOM.btnToScreen3.addEventListener('click', () => goToScreen(3));

  // Tap anywhere on card to fast-forward / complete typing
  DOM.letterCard.addEventListener('click', () => {
    if (STATE.isTyping && !STATE.letterFullyTyped) {
      fastForwardLetter();
    }
  });
}

function startLetterTypewriter() {
  // Clear any existing timer
  if (STATE.typewriterTimeout) clearTimeout(STATE.typewriterTimeout);

  STATE.isTyping = true;
  STATE.letterFullyTyped = false;
  DOM.typewriterText.textContent = '';
  DOM.typewriterCursor.style.display = 'inline-block';
  DOM.letterFooter.classList.add('hidden');
  DOM.letterHint.style.opacity = '0.8';

  // Use Array.from to correctly preserve multi-byte emojis (❤️❤️, 🥹)
  const characters = Array.from(CONFIG.letterText);
  let currentIndex = 0;

  function typeNextChar() {
    if (currentIndex < characters.length) {
      const char = characters[currentIndex];
      DOM.typewriterText.textContent += char;
      currentIndex++;

      // Natural handwriting pauses for commas, periods, and emojis
      let delay = CONFIG.typingSpeedMs;
      if (char === ',' || char === '.') delay += 120;
      if (char === '❤️' || char === '🥹') delay += 180;

      STATE.typewriterTimeout = setTimeout(typeNextChar, delay);
    } else {
      finishTypewriter();
    }
  }

  STATE.typewriterTimeout = setTimeout(typeNextChar, 300);
}

function fastForwardLetter() {
  if (STATE.typewriterTimeout) clearTimeout(STATE.typewriterTimeout);
  DOM.typewriterText.textContent = CONFIG.letterText;
  finishTypewriter();
}

function finishTypewriter() {
  STATE.isTyping = false;
  STATE.letterFullyTyped = true;
  DOM.typewriterCursor.style.display = 'none';
  DOM.letterHint.style.opacity = '0';

  // Sound sparkle
  soundEffects.playSoftSparkle();

  // Reveal Continue button
  setTimeout(() => {
    DOM.letterFooter.classList.remove('hidden');
  }, 300);
}

// ==============================================================================
// 6. SCREEN 3: GIFT BOX LOGIC
// ==============================================================================

function initGiftScreen() {
  DOM.giftTitle.textContent = CONFIG.giftTitle;
  DOM.giftSubtitle.textContent = CONFIG.giftSubtitle;

  // Tap to open gift box
  DOM.giftBoxStage.addEventListener('click', handleGiftBoxTap);
  DOM.giftBoxStage.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleGiftBoxTap();
    }
  });
}

function resetGiftBox() {
  STATE.giftOpened = false;
  DOM.giftBoxStage.classList.remove('opened');
  DOM.giftTapPrompt.style.opacity = '1';
}

function handleGiftBoxTap() {
  if (STATE.giftOpened) return;
  STATE.giftOpened = true;

  // Add opened class (lifts lid, glows)
  DOM.giftBoxStage.classList.add('opened');
  DOM.giftTapPrompt.style.opacity = '0';

  // Play sound
  soundEffects.playGiftOpenSound();

  // Get box coordinates for localized burst
  const rect = DOM.giftBoxStage.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height * 0.45;

  // Burst sparkles and hearts out of box
  confettiManager.burstFromPoint(originX, originY);

  // Automatically transition to Screen 4 after delightful animation
  setTimeout(() => {
    goToScreen(4);
  }, 1300);
}

// ==============================================================================
// 7. SCREEN 4: THE THREE BRIBES LOGIC
// ==============================================================================

function initBribesScreen() {
  DOM.bribesTitle.textContent = CONFIG.bribesTitle;

  // Initialize accept button
  DOM.btnAcceptBribes.addEventListener('click', () => {
    if (STATE.isTransitioning) return;

    soundEffects.playCelebrationChord();
    confettiManager.burstHeartShower();

    setTimeout(() => {
      goToScreen(5);
    }, 600);
  });

  // Interactive cards tap delight
  const cards = document.querySelectorAll('.bribe-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      soundEffects.playSoftChime();
      card.style.transform = 'translateY(-6px) scale(1.02)';
      setTimeout(() => {
        card.style.transform = '';
      }, 300);
    });
  });
}

function triggerBribesAnimation() {
  const cards = document.querySelectorAll('.bribe-card');
  cards.forEach(card => {
    card.style.animation = 'none';
    // Force reflow so keyframe animations trigger afresh
    void card.offsetWidth;
    card.style.animation = '';
  });
}

// ==============================================================================
// 8. SCREEN 5: NEW BEGINNINGS LOGIC
// ==============================================================================

function initBeginningsScreen() {
  DOM.beginningsTitle.textContent = CONFIG.beginningsTitle;
  DOM.romanticQuote.textContent = CONFIG.romanticQuote;
  DOM.romanticSignoff.textContent = CONFIG.romanticSignoff;

  // Replay buttons
  DOM.btnReplay.addEventListener('click', restartExperience);
  DOM.btnReplayBottom.addEventListener('click', restartExperience);
}

function restartExperience() {
  soundEffects.playSoftChime();
  goToScreen(1);
}

// ==============================================================================
// 9. AMBIENT FLOATING HEARTS CANVAS ENGINE
// ==============================================================================
class AmbientHeartsBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hearts = [];
    this.maxHearts = 26;
    this.colors = [
      'rgba(255, 117, 140, 0.45)',
      'rgba(255, 142, 165, 0.40)',
      'rgba(255, 182, 193, 0.50)',
      'rgba(255, 105, 135, 0.35)',
      'rgba(255, 192, 203, 0.45)'
    ];

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initHearts();
    this.animate();
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    // Mobile vs Desktop particle density
    this.maxHearts = this.width < 600 ? 18 : 28;
  }

  initHearts() {
    this.hearts = [];
    for (let i = 0; i < this.maxHearts; i++) {
      this.hearts.push(this.createHeart(true));
    }
  }

  createHeart(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 20 + Math.random() * 40,
      size: 10 + Math.random() * 16,
      speedY: 0.6 + Math.random() * 0.9,
      swayAmp: 12 + Math.random() * 18,
      swaySpeed: 0.02 + Math.random() * 0.025,
      swayOffset: Math.random() * Math.PI * 2,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      rotation: (Math.random() - 0.5) * 0.4
    };
  }

  drawHeartPath(ctx, x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    // Left curve
    ctx.bezierCurveTo(
      x, y, 
      x - size / 2, y, 
      x - size / 2, y + topCurveHeight
    );
    ctx.bezierCurveTo(
      x - size / 2, y + (size + topCurveHeight) / 2, 
      x, y + (size + topCurveHeight) / 1.3, 
      x, y + size
    );
    // Right curve
    ctx.bezierCurveTo(
      x, y + (size + topCurveHeight) / 1.3, 
      x + size / 2, y + (size + topCurveHeight) / 2, 
      x + size / 2, y + topCurveHeight
    );
    ctx.bezierCurveTo(
      x + size / 2, y, 
      x, y, 
      x, y + topCurveHeight
    );
    ctx.closePath();
    ctx.fill();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.hearts.length; i++) {
      const h = this.hearts[i];
      h.y -= h.speedY;
      h.swayOffset += h.swaySpeed;
      const swayX = h.x + Math.sin(h.swayOffset) * h.swayAmp;

      this.ctx.save();
      this.ctx.translate(swayX, h.y);
      this.ctx.rotate(h.rotation + Math.sin(h.swayOffset) * 0.15);
      this.ctx.fillStyle = h.color;
      this.drawHeartPath(this.ctx, 0, -h.size / 2, h.size);
      this.ctx.restore();

      // Reset when floating off top
      if (h.y < -30) {
        this.hearts[i] = this.createHeart(false);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ==============================================================================
// 10. CONFETTI & SPARKLE CANVAS ENGINE
// ==============================================================================
class ConfettiManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.isRendering = false;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  burstFromPoint(x, y) {
    const colors = ['#ff758c', '#ff5e7e', '#ffd166', '#f4a261', '#ffccd5', '#ffffff'];
    const count = 55;

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const velocity = 3 + Math.random() * 8;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 3,
        gravity: 0.18,
        friction: 0.96,
        size: 7 + Math.random() * 9,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        spinSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        fadeSpeed: 0.012 + Math.random() * 0.01,
        type: Math.random() > 0.4 ? 'heart' : 'circle'
      });
    }

    this.startRendering();
  }

  burstHeartShower() {
    const colors = ['#ff758c', '#e63963', '#ff8da1', '#ffd166', '#f6bd60', '#ffccd5'];
    const count = 75;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: -10 - Math.random() * 40,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 5,
        gravity: 0.08,
        friction: 0.98,
        size: 9 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        spinSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
        fadeSpeed: 0.007 + Math.random() * 0.008,
        type: Math.random() > 0.3 ? 'heart' : 'circle'
      });
    }

    this.startRendering();
  }

  startRendering() {
    if (!this.isRendering) {
      this.isRendering = true;
      this.render();
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.vx *= p.friction;
      p.vy = (p.vy + p.gravity) * p.friction;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spinSpeed;
      p.opacity -= p.fadeSpeed;

      if (p.opacity <= 0 || p.y > this.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillStyle = p.color;

      if (p.type === 'heart') {
        this.drawHeart(this.ctx, 0, 0, p.size);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.render());
    } else {
      this.isRendering = false;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.3, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.3, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
  }
}

// ==============================================================================
// 11. WEB AUDIO API SYNTHESIZER (ROMANTIC MUSIC & SOUNDS)
// ==============================================================================
class RomanticSoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingMelody = false;
    this.melodyTimeout = null;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playTone(freq, duration = 0.4, type = 'sine', gainVal = 0.15) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Warm envelope
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(gainVal, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  playHeartbeat() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    this.playTone(85, 0.22, 'sine', 0.2);
    setTimeout(() => {
      this.playTone(75, 0.25, 'sine', 0.18);
    }, 180);
  }

  playErrorTone() {
    this.playTone(220, 0.2, 'sawtooth', 0.08);
    setTimeout(() => {
      this.playTone(196, 0.35, 'sawtooth', 0.08);
    }, 160);
  }

  playSoftChime() {
    this.playTone(523.25, 0.4, 'sine', 0.1); // C5
  }

  playSoftSparkle() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.3, 'sine', 0.07);
      }, idx * 70);
    });
  }

  playGiftOpenSound() {
    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.45, 'triangle', 0.12);
      }, idx * 60);
    });
  }

  playCelebrationChord() {
    const chord = [523.25, 659.25, 783.99, 987.77, 1046.50];
    chord.forEach(f => this.playTone(f, 0.7, 'sine', 0.08));
  }

  /**
   * Romantic Music Box melody generator (Plays a soothing, sweet lullaby)
   */
  startRomanticMelody() {
    if (this.isPlayingMelody) return;
    this.isPlayingMelody = true;
    this.ensureContext();

    // Romantic music-box notes (Pentatonic gentle lullaby)
    // C4, E4, G4, A4, B4, C5, D5, E5
    const melody = [
      { f: 523.25, d: 0.5 }, // C5
      { f: 659.25, d: 0.5 }, // E5
      { f: 783.99, d: 0.6 }, // G5
      { f: 659.25, d: 0.5 }, // E5
      { f: 880.00, d: 0.7 }, // A5
      { f: 783.99, d: 0.6 }, // G5
      { f: 587.33, d: 0.5 }, // D5
      { f: 523.25, d: 0.8 }, // C5
      { f: 440.00, d: 0.5 }, // A4
      { f: 523.25, d: 0.6 }, // C5
      { f: 659.25, d: 0.8 }, // E5
      { f: 587.33, d: 0.9 }  // D5
    ];

    let noteIndex = 0;

    const playLoop = () => {
      if (!this.isPlayingMelody) return;

      const note = melody[noteIndex];
      // Play note with soft music-box chime envelope
      this.playTone(note.f, note.d * 1.2, 'sine', 0.12);

      // Play soft harmonizing sub-chime
      if (noteIndex % 2 === 0) {
        this.playTone(note.f / 2, note.d * 1.5, 'sine', 0.05);
      }

      noteIndex = (noteIndex + 1) % melody.length;
      this.melodyTimeout = setTimeout(playLoop, 650);
    };

    playLoop();
  }

  stopRomanticMelody() {
    this.isPlayingMelody = false;
    if (this.melodyTimeout) {
      clearTimeout(this.melodyTimeout);
      this.melodyTimeout = null;
    }
  }
}

// Global sound instance
const soundEffects = new RomanticSoundEngine();

// ==============================================================================
// 12. MUSIC CONTROLLER (TOGGLE MUSIC ON/OFF)
// ==============================================================================
function initMusicController() {
  DOM.musicToggleBtn.addEventListener('click', toggleMusic);
}

function toggleMusic() {
  soundEffects.ensureContext();

  if (STATE.isMusicPlaying) {
    // Turn off
    STATE.isMusicPlaying = false;
    DOM.musicToggleBtn.classList.remove('playing');
    DOM.musicIcon.textContent = '🔇';
    DOM.musicText.textContent = 'Music: Off';

    if (DOM.bgAudio && !DOM.bgAudio.paused) {
      DOM.bgAudio.pause();
    }
    soundEffects.stopRomanticMelody();
  } else {
    // Turn on
    STATE.isMusicPlaying = true;
    DOM.musicToggleBtn.classList.add('playing');
    DOM.musicIcon.textContent = '🎵';
    DOM.musicText.textContent = 'Music: Playing';

    // If user has provided a working audio file, play it; otherwise play Web Audio synthesizer lullaby
    let startedAudio = false;
    if (DOM.bgAudio && DOM.bgAudio.src && !DOM.bgAudio.src.endsWith('undefined')) {
      try {
        const playPromise = DOM.bgAudio.play();
        if (playPromise !== undefined) {
          startedAudio = true;
          playPromise.catch(() => {
            // Audio file not present or failed, fall back to Web Audio music box melody
            if (STATE.isMusicPlaying) {
              soundEffects.startRomanticMelody();
            }
          });
        }
      } catch (err) {
        startedAudio = false;
      }
    }

    if (!startedAudio) {
      soundEffects.startRomanticMelody();
    }
  }
}

// ==============================================================================
// 13. APP INITIALIZATION
// ==============================================================================
let confettiManager = null;
let heartsBackground = null;

document.addEventListener('DOMContentLoaded', () => {
  // Populate DOM elements
  initDOMElements();

  // Initialize Background Canvases
  heartsBackground = new AmbientHeartsBackground(DOM.heartsCanvas);
  confettiManager = new ConfettiManager(DOM.confettiCanvas);

  // Initialize Audio & Controller
  initMusicController();

  // Initialize Individual Screens
  initMeasureScreen();
  initLetterScreen();
  initGiftScreen();
  initBribesScreen();
  initBeginningsScreen();

  // Start on Screen 1
  goToScreen(1);
});
