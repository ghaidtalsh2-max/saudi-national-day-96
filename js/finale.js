/**
 * finale.js - الختام السينمائي المؤثر (The Grand Climax)
 * المشهد يعود لأفق الوطن الفسيح، تتجمع أصوات المدن وتتداخل الخطوط،
 * ثم يظهر: "أصواتٌ مختلفة... وطنٌ واحد. ٩٦ عاماً من الحكاية... وهذه الحكاية ما زالت تُكتب."
 * والعلم السعودي يرفرف شامخاً في الأفق مع أصداء الموسيقى الوطنية.
 */

import { sound } from './audioEngine.js';

export class FinaleManager {
  constructor(onRestart) {
    this.onRestart = onRestart;
    this.stage = document.getElementById('cinematic-finale');
    this.canvas = document.getElementById('finale-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.line1 = document.getElementById('fin-line-1');
    this.line2 = document.getElementById('fin-line-2');
    this.line3 = document.getElementById('fin-line-3');
    this.line4 = document.getElementById('fin-line-4');
    this.actionsWrap = document.querySelector('.finale-actions');
    this.btnRestart = document.getElementById('btn-restart-journey');

    this.animFrame = null;
    this.phase = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    if (this.btnRestart) {
      this.btnRestart.addEventListener('click', () => {
        if (this.stage) this.stage.style.display = 'none';
        if (this.onRestart) this.onRestart();
      });
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  startFinale() {
    if (this.stage) {
      this.stage.style.display = 'flex';
      // Fade in stage
      setTimeout(() => this.stage.classList.add('active-stage'), 50);
    }

    // Audio convergence: play national melody & ambient wind
    sound.playNationalMelodicPassage();
    sound.startDesertWind();

    // Start rendering sunset convergence canvas
    this.renderLoop();

    // Staggered poetic words reveal
    setTimeout(() => {
      if (this.line1) this.line1.classList.add('revealed');
    }, 1500);

    setTimeout(() => {
      if (this.line2) this.line2.classList.add('revealed');
      sound.playBrassDallahResonance();
    }, 3800);

    setTimeout(() => {
      if (this.line3) this.line3.classList.add('revealed');
    }, 6200);

    setTimeout(() => {
      if (this.line4) this.line4.classList.add('revealed');
      if (this.actionsWrap) this.actionsWrap.classList.add('revealed');
    }, 8500);
  }

  renderLoop() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    // Sunset watercolor wash (Dusk over the Kingdom)
    const sunsetGrad = ctx.createLinearGradient(0, 0, 0, h);
    sunsetGrad.addColorStop(0, '#1c1622');
    sunsetGrad.addColorStop(0.35, '#3b252f');
    sunsetGrad.addColorStop(0.65, '#784635');
    sunsetGrad.addColorStop(0.85, '#b47442');
    sunsetGrad.addColorStop(1, '#e3ab62');
    ctx.fillStyle = sunsetGrad;
    ctx.fillRect(0, 0, w, h);

    // Warm glowing sunset sun orb in watercolor bleed
    const sunGrad = ctx.createRadialGradient(w * 0.5, h * 0.68, 10, w * 0.5, h * 0.68, w * 0.35);
    sunGrad.addColorStop(0, 'rgba(255, 230, 160, 0.85)');
    sunGrad.addColorStop(0.4, 'rgba(230, 140, 70, 0.45)');
    sunGrad.addColorStop(1, 'rgba(28, 22, 34, 0)');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, w, h);

    // Converging lines of light & ink from all 4 corners into the heart
    ctx.save();
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 14; i++) {
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(212, 175, 55, 0.3)' : 'rgba(45, 106, 79, 0.35)';
      ctx.beginPath();
      const startX = (w / 14) * i;
      ctx.moveTo(startX, h);
      ctx.quadraticCurveTo(w * 0.5 + Math.sin(this.phase + i) * 60, h * 0.72, w * 0.5, h * 0.64);
      ctx.stroke();
    }
    ctx.restore();

    // Mountain & dunes silhouette
    ctx.fillStyle = '#181216';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.74);
    ctx.bezierCurveTo(w * 0.25, h * 0.70, w * 0.75, h * 0.78, w, h * 0.72);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    // The Saudi Flag waving majestically on the horizon
    this.drawSaudiFlag(ctx, w * 0.5, h * 0.65);

    this.phase += 0.03;
    this.animFrame = requestAnimationFrame(() => this.renderLoop());
  }

  drawSaudiFlag(ctx, cx, cy) {
    ctx.save();
    ctx.translate(cx, cy);

    // Staff
    ctx.strokeStyle = '#c69214';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -90);
    ctx.stroke();

    // Waving Emerald Silk Banner
    ctx.fillStyle = '#155724';
    ctx.beginPath();
    ctx.moveTo(0, -90);
    const wave1 = Math.sin(this.phase * 2) * 8;
    const wave2 = Math.cos(this.phase * 2) * 8;
    ctx.quadraticCurveTo(35, -92 + wave1, 75, -90 + wave2);
    ctx.lineTo(75, -45 + wave2);
    ctx.quadraticCurveTo(35, -47 + wave1, 0, -45);
    ctx.closePath();
    ctx.fill();

    // Golden sword symbol on flag
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(20, -60 + wave1 * 0.6);
    ctx.lineTo(55, -60 + wave2 * 0.6);
    ctx.stroke();

    ctx.restore();
  }
}
