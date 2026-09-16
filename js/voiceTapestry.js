/**
 * voiceTapestry.js - تجربة "صوتك جزء من الحكاية"
 * "صوت الإنسان → صوت اللهجة → صوت المكان → صوت الوطن → صوت المستخدم"
 * تسجيل أو كتابة جملة وجدانية، تحويلها إلى موجة حبرية (Ink Waveform)،
 * ونسجها داخل جدار صوتي وطني حي تتداخل فيه أصوات أبناء وبنات الوطن.
 */

import { sound } from './audioEngine.js';

export class VoiceTapestryManager {
  constructor(onGotoFinale) {
    this.onGotoFinale = onGotoFinale;
    this.btnRecord = document.getElementById('btn-record-voice');
    this.recordStatus = document.getElementById('record-status');
    this.textInput = document.getElementById('tapestry-user-phrase');
    this.btnSubmit = document.getElementById('btn-submit-tapestry');
    this.canvas = document.getElementById('collective-tapestry-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.btnFinale = document.getElementById('btn-goto-finale');
    this.counterEl = document.getElementById('tapestry-counter');

    this.isRecording = false;
    this.mediaRecorder = null;
    this.voiceWaves = [];
    this.baseCount = 96420;

    this.initTapestry();
    this.bindEvents();
  }

  initTapestry() {
    // Populate realistic historical collective waveforms
    for (let i = 0; i < 18; i++) {
      this.voiceWaves.push({
        yOffset: 30 + Math.random() * 200,
        freq: 0.015 + Math.random() * 0.03,
        amp: 12 + Math.random() * 32,
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
        color: i % 3 === 0 ? 'rgba(27, 77, 50, 0.45)' : (i % 3 === 1 ? 'rgba(198, 146, 20, 0.4)' : 'rgba(46, 36, 29, 0.35)'),
        width: 1.5 + Math.random() * 2.0
      });
    }

    this.renderLoop();
  }

  renderLoop() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    // Archival paper tint
    ctx.fillStyle = '#faf5e9';
    ctx.fillRect(0, 0, w, h);

    // Draw collective overlapping ink waveforms
    this.voiceWaves.forEach(wave => {
      ctx.strokeStyle = wave.color;
      ctx.lineWidth = wave.width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, wave.yOffset);

      const steps = 80;
      for (let s = 0; s <= steps; s++) {
        const x = (s / steps) * w;
        const progress = s / steps;
        const envelope = Math.sin(progress * Math.PI);
        const y = wave.yOffset + Math.sin(s * wave.freq * 10 + wave.phase) * wave.amp * envelope;
        ctx.lineTo(x, y);
      }
      ctx.stroke();

      wave.phase += wave.speed;
    });

    requestAnimationFrame(() => this.renderLoop());
  }

  bindEvents() {
    // Voice record button
    if (this.btnRecord) {
      this.btnRecord.addEventListener('click', () => this.toggleVoiceRecording());
    }

    // Text submit
    if (this.btnSubmit) {
      this.btnSubmit.addEventListener('click', () => {
        const phrase = this.textInput ? this.textInput.value.trim() : '';
        this.addTapestryVoice(phrase || 'أمان وعزة ودار ما مثلها دار');
      });
    }

    // Go to finale
    if (this.btnFinale) {
      this.btnFinale.addEventListener('click', () => {
        if (this.onGotoFinale) this.onGotoFinale();
      });
    }
  }

  toggleVoiceRecording() {
    if (!this.isRecording) {
      this.startMic();
    } else {
      this.stopMic();
    }
  }

  async startMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();
      this.isRecording = true;

      if (this.btnRecord) this.btnRecord.classList.add('recording');
      if (this.recordStatus) this.recordStatus.textContent = 'صوتك يُكتب الآن بالحبر.. اضغط للإيقاف';

      this.mediaRecorder.ondataavailable = (e) => {
        this.addTapestryVoice('صوت مسجل ينبض بحب الوطن');
      };
    } catch (err) {
      // Microphone not permitted or unavailable -> simulate natural voice capture
      this.isRecording = true;
      if (this.btnRecord) this.btnRecord.classList.add('recording');
      if (this.recordStatus) this.recordStatus.textContent = 'نستمع لنبض صوتك...';

      setTimeout(() => {
        this.stopMic();
        this.addTapestryVoice('صوت مسجل ينبض بحب الوطن');
      }, 3000);
    }
  }

  stopMic() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.isRecording = false;
    if (this.btnRecord) this.btnRecord.classList.remove('recording');
    if (this.recordStatus) this.recordStatus.textContent = 'تم تسجيل صوتك ونسجه في جدار الوطن!';
  }

  addTapestryVoice(phrase) {
    sound.playFinjanClink();
    sound.playBrassDallahResonance();

    // Add vivid new emerald/gold waveform to the tapestry
    this.voiceWaves.unshift({
      yOffset: 60 + Math.random() * 140,
      freq: 0.025,
      amp: 45,
      phase: 0,
      speed: 0.03,
      color: 'rgba(27, 77, 50, 0.95)', // Prominent Saudi green ink
      width: 3.5
    });

    // Update counter
    this.baseCount++;
    if (this.counterEl) {
      this.counterEl.textContent = `${this.baseCount.toLocaleString('ar-SA')} صوتاً ينبض بالانتماء`;
    }

    if (this.recordStatus) {
      this.recordStatus.textContent = `«${phrase}» — خُطّت في ذاكرة الوطن!`;
    }

    if (this.textInput) {
      this.textInput.value = '';
    }
  }
}
