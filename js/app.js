/**
 * app.js - نقطة الانطلاق الرئيسية الشاملة لتجربة اليوم الوطني السعودي 96 ("عزّنا بطبعنا")
 * - ربط مراحل العالم الثلاثي الأبعاد ومساحة الاستكشاف ("وش ودك تكتشف؟")
 * - ربط عوالم المدن الأربع (الرياض، الطائف، جدة، العلا) وخريطة المملكة 3D
 * - ربط ديواننا، من لساننا، السعودية بيت واحد، وصانع طابع البريد (سعوديتك)
 * - دعم كامل للمس والحواسيب والهواتف الذكية مع سياسات الصوت التلقائي
 */

import { SaudiVirtualWorld, STAGES } from './virtualWorld.js';
import { sound } from './audioEngine.js';
import { PaintYourSaudi } from './paintYourSaudi.js';
import { DiwanManager } from './diwan.js';
import { WordWallManager } from './wordWall.js';
import { OneHome } from './oneHome.js';

let world = null;
let stampMaker = null;
let diwan = null;
let wordWall = null;
let oneHome = null;
let currentLang = 'ar';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('world-viewport');
  if (!container) return;

  // 1. Initialize Master 3D Virtual World Orchestrator
  world = new SaudiVirtualWorld(container);

  // 2. Initialize Sub-Experience Modules
  stampMaker = new PaintYourSaudi();
  diwan = new DiwanManager();
  wordWall = new WordWallManager();
  oneHome = new OneHome();

  // 3. Sound Control Toggle Hook
  const btnSound = document.getElementById('btn-sound-toggle');
  const soundLabel = document.getElementById('sound-status-label');

  btnSound?.addEventListener('click', () => {
    const isUnmuted = sound.toggleMute();
    btnSound.classList.toggle('sound-muted', !isUnmuted);
    if (soundLabel) {
      soundLabel.textContent = isUnmuted 
        ? (currentLang === 'ar' ? 'صوت الوطن: نشط 🔊' : 'Audio: Active 🔊') 
        : (currentLang === 'ar' ? 'الصوت: صامت 🔇' : 'Audio: Muted 🔇');
    }
  });

  // 4. Language Switch Hook
  const btnLang = document.getElementById('btn-lang-toggle');
  const langLabel = document.getElementById('lang-label');

  btnLang?.addEventListener('click', () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    if (langLabel) {
      langLabel.textContent = currentLang === 'ar' ? 'English' : 'العربية';
    }
    applyLanguageStrings(currentLang);
  });

  // 5. Start Journey Action Hook
  const btnStart = document.getElementById('btn-start-journey');
  btnStart?.addEventListener('click', (e) => {
    e.stopPropagation();
    world.startJourney();
  });

  // 6. Exploration Hub Portals Wire-up
  const portalCities = document.getElementById('portal-cities');
  portalCities?.addEventListener('click', () => {
    sound.playChime(640);
    world.goToStage(STAGES.SAUDI_MAP);
  });

  const portalDiwan = document.getElementById('portal-diwan');
  portalDiwan?.addEventListener('click', () => {
    sound.playChime(580);
    openModal('diwan-overlay');
  });

  const portalLexicon = document.getElementById('portal-lexicon');
  portalLexicon?.addEventListener('click', () => {
    sound.playChime(580);
    openModal('lexicon-overlay');
  });

  const portalOneHome = document.getElementById('portal-onehome');
  portalOneHome?.addEventListener('click', () => {
    sound.playChime(580);
    openModal('onehome-overlay');
  });

  const portalStamp = document.getElementById('portal-stamp');
  portalStamp?.addEventListener('click', () => {
    sound.playChime(720);
    stampMaker?.open();
  });

  // 7. Modal "Back to Hub" Actions
  document.querySelectorAll('[data-back="hub"]').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playChime(520);
      closeAllModals();
      world.goToStage(STAGES.EXPLORATION_HUB);
    });
  });

  // 8. Keyboard Accessibility Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') {
      btnSound?.click();
    } else if (e.key === 'Escape') {
      closeAllModals();
      world.goToStage(STAGES.EXPLORATION_HUB);
    } else if (e.key === ' ' && world.currentStage === STAGES.OPENING) {
      world.startJourney();
    }
  });

  // 9. First Interaction Audio Unlock (Browser autoplay safety)
  const unlockAudio = () => {
    sound.resume();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
});

function openModal(modalId) {
  closeAllModals();
  const el = document.getElementById(modalId);
  if (el) el.classList.add('active');
}

function closeAllModals() {
  ['paint-saudi-overlay', 'diwan-overlay', 'lexicon-overlay', 'onehome-overlay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
}

function applyLanguageStrings(lang) {
  const isAr = (lang === 'ar');
  const heroTitle = document.querySelector('.hero-main-title');
  const heroSlogan = document.querySelector('.hero-motto-slogan');
  const hubTitle = document.querySelector('.hub-main-title');
  const hubSub = document.querySelector('.hub-sub-title');

  if (heroTitle) heroTitle.textContent = isAr ? 'اليوم الوطني' : 'Saudi National';
  if (heroSlogan) heroSlogan.textContent = isAr ? 'عزّنا بطبعنا' : 'Our Pride in Our Nature';
  if (hubTitle) hubTitle.textContent = isAr ? 'وش ودك تكتشف؟' : 'What would you like to explore?';
  if (hubSub) hubSub.textContent = isAr ? 'اختر بوابتك لاستكشاف ثراء وتنوع وأصالة المملكة' : 'Choose your gateway to explore the Saudi realm';
}
