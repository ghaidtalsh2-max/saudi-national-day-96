/**
 * world.js - العالم الرئيسي: دخول السعودية
 * تنسيق البيئة المائية الشاملة والتنقل عبر عناصر المكان الطبيعية
 * (الدرب، المرسم، المجلس، خريطة المدن، الأثر التاريخي، وصوت الإنسان)
 */

import { sound } from './audioEngine.js';

export class WorldManager {
  constructor() {
    this.stage = document.getElementById('world-stage');
    this.canvas = document.getElementById('world-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.nav = document.querySelector('.environmental-nav');
    this.viewsContainer = document.getElementById('views-container');
    this.horizonReturn = document.getElementById('horizon-return');
    this.btnBack = document.getElementById('btn-back-to-world');

    this.activeView = null;
    this.callbacks = {};
    this.initCanvas();
    this.bindEvents();
  }

  initCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.drawWorldPanorama();
    });
    this.drawWorldPanorama();
  }

  drawWorldPanorama() {
    if (!this.ctx) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    // Warm atmospheric sky wash
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, h * 0.7);
    skyGrad.addColorStop(0, '#f5ecd9');
    skyGrad.addColorStop(0.5, '#edd8b9');
    skyGrad.addColorStop(1, '#dec195');
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, w, h);

    // Distant mountain ridge (Tuwaiq / Sarawat contours in watercolor wash)
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(180, 140, 100, 0.35)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, h * 0.55);
    this.ctx.bezierCurveTo(w * 0.25, h * 0.48, w * 0.45, h * 0.58, w * 0.7, h * 0.46);
    this.ctx.bezierCurveTo(w * 0.85, h * 0.42, w * 0.95, h * 0.52, w, h * 0.5);
    this.ctx.lineTo(w, h);
    this.ctx.lineTo(0, h);
    this.ctx.fill();

    // Midground desert dunes & mudbrick silhouettes
    this.ctx.fillStyle = 'rgba(196, 155, 105, 0.5)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, h * 0.65);
    this.ctx.quadraticCurveTo(w * 0.35, h * 0.60, w * 0.65, h * 0.72);
    this.ctx.quadraticCurveTo(w * 0.85, h * 0.76, w, h * 0.68);
    this.ctx.lineTo(w, h);
    this.ctx.lineTo(0, h);
    this.ctx.fill();

    // Foreground soft earth wash
    this.ctx.fillStyle = '#e2cdab';
    this.ctx.beginPath();
    this.ctx.moveTo(0, h * 0.78);
    this.ctx.quadraticCurveTo(w * 0.5, h * 0.75, w, h * 0.82);
    this.ctx.lineTo(w, h);
    this.ctx.lineTo(0, h);
    this.ctx.fill();

    // Palm tree silhouettes in ink wash
    this.drawPalmTree(this.ctx, w * 0.12, h * 0.68, 0.7);
    this.drawPalmTree(this.ctx, w * 0.16, h * 0.70, 0.55);
    this.drawPalmTree(this.ctx, w * 0.88, h * 0.66, 0.75);
    this.drawPalmTree(this.ctx, w * 0.92, h * 0.69, 0.6);

    this.ctx.restore();
  }

  drawPalmTree(ctx, x, y, scale = 1.0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Trunk
    ctx.strokeStyle = '#3e3026';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(6, -40, 2, -80);
    ctx.stroke();

    // Fronds (Watercolor ink strokes)
    ctx.strokeStyle = '#2d533b';
    ctx.lineWidth = 2.8;
    const fronds = [
      { dx: -35, dy: -60, cx: -20, cy: -85 },
      { dx: 38, dy: -62, cx: 22, cy: -85 },
      { dx: -25, dy: -90, cx: -15, cy: -95 },
      { dx: 26, dy: -92, cx: 16, cy: -96 },
      { dx: 0, dy: -105, cx: 0, cy: -92 }
    ];

    fronds.forEach(f => {
      ctx.beginPath();
      ctx.moveTo(2, -80);
      ctx.quadraticCurveTo(f.cx, f.cy, f.dx, f.dy);
      ctx.stroke();
    });

    ctx.restore();
  }

  bindEvents() {
    // Environmental portals
    document.querySelectorAll('.env-portal').forEach(portal => {
      portal.addEventListener('click', () => {
        const targetView = portal.getAttribute('data-target');
        this.openView(targetView);
      });
      portal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const targetView = portal.getAttribute('data-target');
          this.openView(targetView);
        }
      });
    });

    // Horizon return button
    if (this.btnBack) {
      this.btnBack.addEventListener('click', () => {
        this.closeActiveView();
      });
    }
  }

  revealWorld() {
    if (this.stage) {
      this.stage.classList.add('revealed');
    }
  }

  openView(viewKey) {
    const viewMap = {
      'paint-saudi': 'view-paint-saudi',
      'one-home': 'view-one-home',
      'voices': 'view-voices',
      'cities-map': 'view-cities-map',
      'timeline': 'view-timeline',
      'heritage': 'view-heritage'
    };

    const targetId = viewMap[viewKey];
    if (!targetId) return;

    // Hide previous view
    this.closeActiveView(false);

    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    // Transition landscape navigation
    if (this.nav) this.nav.classList.add('view-focused');
    if (this.horizonReturn) this.horizonReturn.style.display = 'block';

    targetElement.classList.add('active-view');
    this.activeView = targetId;

    // Trigger sub-module callback if registered
    if (this.callbacks[viewKey]) {
      this.callbacks[viewKey]();
    }

    // Gentle scroll to the parchment sheet
    setTimeout(() => {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  closeActiveView(scrollToTop = true) {
    if (this.activeView) {
      const activeEl = document.getElementById(this.activeView);
      if (activeEl) activeEl.classList.remove('active-view');
      this.activeView = null;
    }

    if (this.nav) this.nav.classList.remove('view-focused');
    if (this.horizonReturn) this.horizonReturn.style.display = 'none';

    if (scrollToTop && this.stage) {
      this.stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  registerViewCallback(viewKey, fn) {
    this.callbacks[viewKey] = fn;
  }
}
