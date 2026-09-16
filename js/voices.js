/**
 * voices.js - تجربة "أصواتنا"
 * "السعودية تتكلم".. خط حبر يتموج كـ Waveform، صوت الإنسان يسبق اسم المنطقة،
 * وطبقات صوت المكان (البحر، المجلس، المزرعة، الصحراء، والسوق).
 */

import { sound } from './audioEngine.js';

export class VoicesManager {
  constructor() {
    this.canvas = document.getElementById('hero-waveform-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.btnPlay = document.getElementById('btn-play-human-voice');
    this.utteranceEl = document.getElementById('current-utterance');
    this.regionEl = document.getElementById('current-region-context');
    this.chips = document.querySelectorAll('.greet-chip');
    this.soundscapeItems = document.querySelectorAll('.soundscape-item');
    this.btnTapestry = document.getElementById('btn-open-tapestry');

    this.greetingsData = {
      arhab: {
        text: '"أرحبوا تراحيب المطر والسيل.. حياكم الله في ديار الكرم"',
        context: 'أصداء ترحيب الجنوب والبادية وكرم الأرض اليعربية',
        freq: 280,
        soundFn: () => sound.playBrassDallahResonance()
      },
      hayak: {
        text: '"الله يحييكم ويبقيكم.. يا مرحبا تريليون نورتوا الدار"',
        context: 'نبرة أهل الحجاز ودفء الساحل الغربي',
        freq: 340,
        soundFn: () => sound.playSeaSurf()
      },
      shuloom: {
        text: '"وش علومكم؟ عساكم طيبين وبخير.. البيت بيتكم"',
        context: 'أصالة لهجة نجد ومجالس الوفاء المتوارثة',
        freq: 300,
        soundFn: () => sound.playFinjanClink()
      },
      abshir: {
        text: '"أبشر بسعدك.. على هالخشم وما طلبت إلا التيسير"',
        context: 'نخوة الشمال وإكرام العاني وعزة النفس',
        freq: 320,
        soundFn: () => sound.playHoofClick(1.2)
      },
      samm: {
        text: '"سمّ.. طال عمرك بالخير والطاعة، آمر وتدلل"',
        context: 'أدب التخاطب والتقدير العميق في الثقافة السعودية',
        freq: 390,
        soundFn: () => sound.playFinjanClink()
      },
      ya_hala: {
        text: '"يا هلا باللي لفانا من بعيد وقريب.. العين أوسع من المكان"',
        context: 'حفاوة الواحات والشرقية وأهل الخليج',
        freq: 360,
        soundFn: () => sound.playFalajWater()
      }
    };

    this.activeGreetingKey = 'arhab';
    this.isWaveformActive = true;
    this.wavePhase = 0;

    this.init();
    this.bindEvents();
  }

  init() {
    this.startWaveformAnimation();
  }

  startWaveformAnimation() {
    if (!this.ctx || !this.canvas) return;
    const render = () => {
      this.drawInkWaveform();
      this.wavePhase += 0.04;
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  drawInkWaveform() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    // Baseline ink wash line
    ctx.strokeStyle = '#32251a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(30, h / 2);

    const points = 60;
    const sliceWidth = (w - 60) / points;

    for (let i = 0; i <= points; i++) {
      const x = 30 + i * sliceWidth;
      const progress = i / points;
      // Envelope window (damped at ends)
      const envelope = Math.sin(progress * Math.PI);
      const wave = Math.sin(progress * 14 + this.wavePhase) * Math.cos(progress * 8 - this.wavePhase * 0.7);
      const y = (h / 2) + wave * 36 * envelope;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Secondary subtle gold harmonic line
    ctx.strokeStyle = 'rgba(198, 146, 20, 0.4)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const x = 30 + i * sliceWidth;
      const progress = i / points;
      const envelope = Math.sin(progress * Math.PI);
      const wave = Math.sin(progress * 20 - this.wavePhase * 1.3);
      const y = (h / 2) + wave * 22 * envelope;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  bindEvents() {
    // Play active greeting
    if (this.btnPlay) {
      this.btnPlay.addEventListener('click', () => {
        this.playGreeting(this.activeGreetingKey);
      });
    }

    // Greeting chips
    this.chips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const key = chip.getAttribute('data-greet');
        this.activeGreetingKey = key;
        this.setGreetingDisplay(key);
        this.playGreeting(key);
      });
    });

    // Soundscape items
    this.soundscapeItems.forEach(item => {
      item.addEventListener('click', () => {
        const env = item.getAttribute('data-env');
        this.playSoundscape(env, item);
      });
    });

    // Open tapestry
    if (this.btnTapestry) {
      this.btnTapestry.addEventListener('click', () => {
        const tapestryView = document.getElementById('view-voice-tapestry');
        if (tapestryView) {
          document.querySelectorAll('.env-view').forEach(v => v.classList.remove('active-view'));
          tapestryView.classList.add('active-view');
          tapestryView.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  setGreetingDisplay(key) {
    const data = this.greetingsData[key];
    if (!data) return;

    if (this.utteranceEl) {
      this.utteranceEl.style.opacity = '0';
      this.utteranceEl.style.transform = 'translateY(6px)';
      setTimeout(() => {
        this.utteranceEl.textContent = data.text;
        this.utteranceEl.style.opacity = '1';
        this.utteranceEl.style.transform = 'translateY(0)';
      }, 180);
    }

    if (this.regionEl) {
      this.regionEl.style.opacity = '0';
      setTimeout(() => {
        this.regionEl.textContent = data.context;
        this.regionEl.style.opacity = '1';
      }, 250);
    }
  }

  playGreeting(key) {
    const data = this.greetingsData[key];
    if (!data) return;

    // Trigger visual pulse
    const ring = document.querySelector('.sound-wave-rings');
    if (ring) {
      ring.style.transform = 'scale(1.4)';
      setTimeout(() => ring.style.transform = 'scale(1)', 400);
    }

    if (data.soundFn) {
      data.soundFn();
    }
  }

  playSoundscape(env, element) {
    this.soundscapeItems.forEach(s => s.classList.remove('playing'));
    element.classList.add('playing');

    switch (env) {
      case 'sea':
        sound.playSeaSurf();
        break;
      case 'majlis':
        sound.playBrassDallahResonance();
        setTimeout(() => sound.playFinjanClink(), 300);
        break;
      case 'farm':
        sound.playFalajWater();
        break;
      case 'desert':
        sound.playHoofClick(1.0);
        setTimeout(() => sound.playHoofClick(0.7), 200);
        break;
      case 'market':
        sound.playFinjanClink();
        setTimeout(() => sound.playBrassDallahResonance(), 400);
        break;
    }
  }
}
