/**
 * historicalInkStory.js - محرك السرد التاريخي البصري بريشة التأسيس الذهبية
 * - ريشة وحبر ذهبي حي يخط التاريخ ويرسم اللوحات أمام عين المستخدم
 * - الفترات المعتمدة بدقة:
 *   1727 (الدولة الأولى)
 *   1818 (نهاية الدولة الأولى والصمود)
 *   1824 (الدولة الثانية)
 *   1891 (نهاية الدولة الثانية)
 *   1902 (استرداد الرياض والمصمك)
 *   1932 (توحيد المملكة)
 *   2026 (اليوم الوطني 96 والنهضة الكبرى)
 * - الانتقال السلس إلى الخريطة: الحبر الذهبي يرسم حدود المملكة الجغرافية ثم يرتفع في الفضاء ليتحول إلى خريطة ثلاثية الأبعاد!
 */

import { sound } from './audioEngine.js';

export class HistoricalInkStory {
  constructor(onTransitionToMap) {
    this.onTransitionToMap = onTransitionToMap;

    this.overlay = document.getElementById('history-ink-overlay');
    this.canvas = document.getElementById('ink-story-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.yearDisplay = document.getElementById('ink-year-display');
    this.titleDisplay = document.getElementById('ink-title-display');
    this.narrativeDisplay = document.getElementById('ink-narrative-display');
    this.pills = document.querySelectorAll('.ink-pill-btn');
    this.btnPrev = document.getElementById('btn-ink-prev');
    this.btnNext = document.getElementById('btn-ink-next');
    this.btnToMap = document.getElementById('btn-ink-to-map');

    this.currentEra = 0;
    this.drawProgress = 0; // 0 to 1
    this.animating = false;
    this.animId = null;

    // Preloaded verified historical visual assets
    this.images = {
      era1727: this.loadImage('assets/images/history_1727.jpg'),
      era1824: this.loadImage('assets/images/history_1824.jpg'),
      era1902: this.loadImage('assets/images/landmarks/riyadh_masmak.jpg'),
      era1932: this.loadImage('assets/images/era_unification.jpg'),
      era2026: this.loadImage('assets/images/landmarks/riyadh_skyline.jpg'),
      paper: this.loadImage('assets/images/paper_texture.jpg')
    };

    this.eras = [
      {
        year: '١٧٢٧ م',
        yearEn: '1727 AD',
        title: 'قيام الدولة السعودية الأولى — الدرعية',
        narrative: 'تأسست الدولة السعودية الأولى على يد الإمام محمد بن سعود رحمه الله، واتخذت من الدرعية عاصمة ومنارة للعدل والاستقرار ووحدة الكلمة.',
        imgKey: 'era1727',
        drawSpeed: 0.012
      },
      {
        year: '١٨١٨ م',
        yearEn: '1818 AD',
        title: 'صمود الدرعية والبطولة الخالدة',
        narrative: 'سطّر أئمة وأبناء الدولة السعودية ملاحم بطولية في الدفاع عن الدرعية ووحدة البلاد، وظلت جذوة الدولة راسخة في نفوس أهلها لا تنطفئ.',
        imgKey: 'era1727',
        drawSpeed: 0.015
      },
      {
        year: '١٨٢٤ م',
        yearEn: '1824 AD',
        title: 'قيام الدولة السعودية الثانية — الرياض',
        narrative: 'نهض الإمام تركي بن عبدالله بن محمد بن سعود بسيف الأجرب ليعيد بناء الدولة، وجعل من الرياض عاصمة شامخة وأرسى قواعد الأمن والنهضة.',
        imgKey: 'era1824',
        drawSpeed: 0.012
      },
      {
        year: '١٨٩١ م',
        yearEn: '1891 AD',
        title: 'نهاية الدولة السعودية الثانية',
        narrative: 'مرحلة تحوّل تاريخية بقي فيها عهد الأئمة حياً في الذاكرة النجدية والعربية، ليمهّد الطريق للملحمة الكبرى لتوحيد الجزيرة العربية.',
        imgKey: 'era1824',
        drawSpeed: 0.015
      },
      {
        year: '١٩٠٢ م',
        yearEn: '1902 AD',
        title: 'استرداد الرياض وبوابة المصمك الخالدة',
        narrative: 'في ليلة الخامس من شوال، دخل الملك عبدالعزيز بن عبدالرحمن آل سعود ورجاله الأبطال الرياض واستردوا قصر المصمك، مفتتحين أعظم ملحمة بناء في العصر الحديث.',
        imgKey: 'era1902',
        drawSpeed: 0.012
      },
      {
        year: '١٩٣٢ م',
        yearEn: '1932 AD',
        title: 'إعلان توحيد المملكة العربية السعودية',
        narrative: 'صدر المرسوم الملكي التاريخي بتوحيد كافة أرجاء البلاد تحت راية التوحيد الخضراء باسم "المملكة العربية السعودية"، لتبدأ مسيرة دولة العز والنماء.',
        imgKey: 'era1932',
        drawSpeed: 0.012
      },
      {
        year: '٢٠٢٦ م',
        yearEn: '2026 AD',
        title: 'اليوم الوطني ٩٦ — السعودية تعانق عنان السماء',
        narrative: 'برؤية طموحة يقودها خادم الحرمين الشريفين وسمو ولي العهد، تقف السعودية اليوم عاصمة للعالم، وواحة للمشاريع الكبرى وصناع المستقبل.',
        imgKey: 'era2026',
        drawSpeed: 0.010,
        isMapTransition: true
      }
    ];

    this.initEvents();
  }

  loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
  }

  initEvents() {
    this.btnNext?.addEventListener('click', () => {
      sound.playDrumBeat('tar', 140);
      if (this.currentEra < this.eras.length - 1) {
        this.selectEra(this.currentEra + 1);
      }
    });

    this.btnPrev?.addEventListener('click', () => {
      sound.playDrumBeat('tar', 100);
      if (this.currentEra > 0) {
        this.selectEra(this.currentEra - 1);
      }
    });

    this.btnToMap?.addEventListener('click', () => {
      sound.playChime(620);
      this.close();
      if (this.onTransitionToMap) this.onTransitionToMap();
    });

    this.pills.forEach((p, idx) => {
      p.addEventListener('click', () => {
        sound.playDrumBeat('tar', 120);
        this.selectEra(idx);
      });
    });
  }

  open() {
    if (!this.overlay) return;
    this.overlay.classList.add('active');
    this.resize();
    this.selectEra(0);
  }

  close() {
    if (!this.overlay) return;
    this.overlay.classList.remove('active');
    cancelAnimationFrame(this.animId);
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.parentElement.clientWidth || 900;
    this.canvas.height = this.canvas.parentElement.clientHeight || 450;
  }

  selectEra(index) {
    this.currentEra = index;
    const era = this.eras[index];
    this.drawProgress = 0;

    if (this.yearDisplay) this.yearDisplay.textContent = era.year;
    if (this.titleDisplay) this.titleDisplay.textContent = era.title;
    if (this.narrativeDisplay) this.narrativeDisplay.textContent = era.narrative;

    this.pills.forEach((p, i) => {
      p.classList.toggle('active', i === index);
    });

    if (this.btnPrev) this.btnPrev.disabled = (index === 0);
    if (this.btnNext) {
      this.btnNext.style.display = (index === this.eras.length - 1) ? 'none' : 'inline-block';
    }
    if (this.btnToMap) {
      this.btnToMap.style.display = (index === this.eras.length - 1) ? 'inline-block' : 'none';
    }

    this.startDrawing();
  }

  startDrawing() {
    cancelAnimationFrame(this.animId);
    const era = this.eras[this.currentEra];

    const loop = () => {
      this.drawProgress = Math.min(1.0, this.drawProgress + (era.drawSpeed || 0.012));
      this.render();

      if (this.drawProgress < 1.0) {
        this.animId = requestAnimationFrame(loop);
      }
    };
    loop();
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    // 1. Parchment paper background
    if (this.images.paper && this.images.paper.complete) {
      ctx.drawImage(this.images.paper, 0, 0, w, h);
    } else {
      ctx.fillStyle = '#17130e';
      ctx.fillRect(0, 0, w, h);
    }

    const era = this.eras[this.currentEra];
    const img = this.images[era.imgKey];

    // 2. Progressive Watercolor Reveal of Historical Artwork
    if (img && img.complete) {
      ctx.save();
      // Organic brush clip mask expanding from center
      const radius = Math.max(w, h) * this.drawProgress * 0.85;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
      ctx.clip();

      ctx.globalAlpha = Math.min(1, this.drawProgress * 1.3);
      ctx.drawImage(img, 0, 0, w, h);

      // Warm vintage golden sepia overlay
      ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // 3. Golden Ink Stroke Calligraphy Curves
    ctx.save();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
    ctx.shadowBlur = 12;

    const strokeLen = w * this.drawProgress;
    ctx.beginPath();
    ctx.moveTo(30, h - 45);
    // Smooth arabesque wave flourish
    ctx.bezierCurveTo(
      strokeLen * 0.3, h - 65 + Math.sin(this.drawProgress * 6) * 15,
      strokeLen * 0.7, h - 25 + Math.cos(this.drawProgress * 5) * 15,
      strokeLen, h - 45
    );
    ctx.stroke();

    // 4. Golden Calligraphy Pen Nib (ريشة التأسيس الذهبية)
    if (this.drawProgress < 1.0) {
      const penX = strokeLen;
      const penY = h - 45;

      ctx.fillStyle = '#fce5a3';
      ctx.beginPath();
      ctx.moveTo(penX, penY);
      ctx.lineTo(penX + 22, penY - 14);
      ctx.lineTo(penX + 28, penY - 8);
      ctx.closePath();
      ctx.fill();

      // Radiating ink sparks
      ctx.fillStyle = '#ffffff';
      for (let s = 0; s < 4; s++) {
        const sx = penX + (Math.random() - 0.5) * 16;
        const sy = penY + (Math.random() - 0.5) * 16;
        ctx.fillRect(sx, sy, 2.5, 2.5);
      }
    }

    // 5. Special Stage 2026: Drawing the Saudi Geographical Borders
    if (era.isMapTransition && this.drawProgress > 0.4) {
      this.drawSaudiBorderInk(ctx, w, h, (this.drawProgress - 0.4) / 0.6);
    }

    ctx.restore();
  }

  drawSaudiBorderInk(ctx, w, h, p) {
    ctx.save();
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3.2;
    ctx.shadowColor = 'rgba(0, 255, 136, 0.9)';
    ctx.shadowBlur = 18;

    // Approximate geographical bounding contour of Saudi Arabia
    const points = [
      { x: 0.28, y: 0.18 }, // Tabuk NW
      { x: 0.48, y: 0.15 }, // Northern Borders
      { x: 0.76, y: 0.32 }, // Eastern / Arabian Gulf
      { x: 0.88, y: 0.58 }, // Rub Al Khali SE
      { x: 0.65, y: 0.84 }, // Najran S
      { x: 0.45, y: 0.88 }, // Jazan SW
      { x: 0.36, y: 0.72 }, // Asir
      { x: 0.30, y: 0.52 }, // Jeddah / Makkah Red Sea Coast
      { x: 0.25, y: 0.34 }, // Yanbu / Madinah
      { x: 0.28, y: 0.18 }  // Close loop back to Tabuk
    ];

    const currentIdx = Math.floor(p * (points.length - 1));
    ctx.beginPath();
    ctx.moveTo(points[0].x * w, points[0].y * h);

    for (let i = 1; i <= currentIdx; i++) {
      ctx.lineTo(points[i].x * w, points[i].y * h);
    }
    ctx.stroke();

    // Glowing quill tip at border head
    if (currentIdx < points.length - 1) {
      const pt = points[currentIdx];
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pt.x * w, pt.y * h, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
