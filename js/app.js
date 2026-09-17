/**
 * app.js - نقطة الانطلاق الرئيسية لعالم السعودية الافتراضي (اليوم الوطني 96)
 * - ربط عناصر التحكم العلوية (الصوت، اللغة، إعادة الضبط)
 * - تفعيل التفاعل بلوحة المفاتيح واللمس
 * - تشغيل الصوت عند أول تفاعل للمستخدم امتثالاً لسياسات المتصفحات
 */

import { SaudiVirtualWorld, STAGES } from './virtualWorld.js';
import { sound } from './audioEngine.js';

let world = null;
let currentLang = 'ar';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('world-viewport');
  if (!container) return;

  // Initialize Master 3D Virtual World
  world = new SaudiVirtualWorld(container);

  // Sound Toggle Hook
  const btnSound = document.getElementById('btn-sound-toggle');
  const soundLabel = document.getElementById('sound-status-label');

  btnSound?.addEventListener('click', () => {
    const isUnmuted = sound.toggleMute();
    btnSound.classList.toggle('sound-muted', !isUnmuted);
    if (soundLabel) {
      soundLabel.textContent = isUnmuted ? (currentLang === 'ar' ? 'صوت الوطن: نشط 🔊' : 'Audio: Active 🔊') : (currentLang === 'ar' ? 'الصوت: صامت 🔇' : 'Audio: Muted 🔇');
    }
  });

  // Language Toggle Hook
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

  // Start Journey Button Hook
  const btnStart = document.getElementById('btn-start-journey');
  btnStart?.addEventListener('click', (e) => {
    e.stopPropagation();
    world.startJourney();
  });

  // Keyboard Shortcuts for Accessibility
  window.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') {
      btnSound?.click();
    } else if (e.key >= '1' && e.key <= '7') {
      const stage = parseInt(e.key, 10) - 1;
      world.goToStage(stage);
    } else if (e.key === ' ' && world.currentStage === STAGES.OPENING) {
      world.startJourney();
    }
  });

  // Resume audio on first user touch / click (browser autoplay safety)
  const unlockAudio = () => {
    sound.resume();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
});

function applyLanguageStrings(lang) {
  const isAr = (lang === 'ar');
  const heroTitle = document.querySelector('.hero-main-title');
  const heroSlogan = document.querySelector('.hero-motto-slogan');
  const heroBadge = document.querySelector('.hero-year-badge');

  if (heroTitle) heroTitle.textContent = isAr ? 'اليوم الوطني السعودي' : 'Saudi National Day';
  if (heroSlogan) heroSlogan.textContent = isAr ? 'عزّنا بطبعنا' : 'Our Pride in Our Nature';
  if (heroBadge) heroBadge.textContent = isAr ? '١٤٤٨ هـ — ٢٠٢٦ م' : '1448 AH — 2026 CE';
}
