/**
 * timeline.js - الرحلة التاريخية المتصلة التلقائية ونخلة الشاهد الحي
 * - نخلة الشاهد (The Palm Witness) تبقى ثابتة الموقع بينما القرون تتحول من حولها
 * - التدفق التلقائي للسنوات: 1727 ← 1818 ← 1824 ← 1891 ← 1902 ← 1932 ← التنمية ← 2026
 * - محطة جبل طويق: تهدئة المشهد، خطوط الحبر، مقولة سمو ولي العهد الخالدة بخط اليد
 * - تحول خطوط الجبل الحبرية إلى مدن وأبراج تقنية 2026 ← تراجع الكاميرا للخريطة
 * - إدماج رموز التراث المستوحاة من الرسم اليدوي (باب الدرعية، الصقر، الأبراج، الإبريق، السيفان)
 */

import { sound } from './audioEngine.js';
import { i18n } from './i18n.js';

export class TimelineManager {
  constructor(onTimelineComplete) {
    this.onTimelineComplete = onTimelineComplete;

    this.skyCanvas = document.getElementById('sky-canvas');
    this.terrainCanvas = document.getElementById('terrain-canvas');
    this.elementsCanvas = document.getElementById('elements-canvas');

    this.skyCtx = this.skyCanvas ? this.skyCanvas.getContext('2d') : null;
    this.terrainCtx = this.terrainCanvas ? this.terrainCanvas.getContext('2d') : null;
    this.elementsCtx = this.elementsCanvas ? this.elementsCanvas.getContext('2d') : null;

    this.yearTextEl = document.getElementById('epoch-year-text');
    this.titleTextEl = document.getElementById('epoch-title-text');
    this.scrubButtons = document.querySelectorAll('.scrub-dot');

    this.timelineScene = document.getElementById('timeline-scene');
    this.transformationScene = document.getElementById('transformation-scene');

    this.epochsSequence = ['1727', '1818', '1824', '1891', '1902', '1932', 'dev', '2026'];
    this.currentIndex = 0;
    this.isAutoPlaying = true;
    this.autoTimer = null;

    this.handleResize = this.resize.bind(this);
    window.addEventListener('resize', this.handleResize);

    this.init();
  }

  init() {
    this.resize();
    this.bindEvents();
    this.setEpochByIndex(0);
    this.startAutoProgression();
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    [this.skyCanvas, this.terrainCanvas, this.elementsCanvas].forEach(c => {
      if (c) {
        c.width = w;
        c.height = h;
      }
    });

    if (this.currentIndex >= 0 && this.currentIndex < this.epochsSequence.length) {
      this.renderScene(this.epochsSequence[this.currentIndex]);
    }
  }

  bindEvents() {
    this.scrubButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const year = btn.getAttribute('data-year');
        const idx = this.epochsSequence.indexOf(year);
        if (idx !== -1) {
          this.pauseAutoProgression();
          this.currentIndex = idx;
          this.setEpochByIndex(idx);
        }
      });
    });
  }

  startAutoProgression() {
    this.isAutoPlaying = true;
    const stepInterval = 6500; // 6.5 seconds per era for immersive contemplation

    this.autoTimer = setInterval(() => {
      if (!this.isAutoPlaying) return;

      if (this.currentIndex < this.epochsSequence.length - 1) {
        this.currentIndex++;
        this.setEpochByIndex(this.currentIndex);
      } else {
        clearInterval(this.autoTimer);
        // Seamless transition to Jabal Tuwaiq and then Digital Map
        this.triggerTransformationClimax();
      }
    }, stepInterval);
  }

  pauseAutoProgression() {
    this.isAutoPlaying = false;
    if (this.autoTimer) clearInterval(this.autoTimer);
  }

  setEpochByIndex(idx) {
    const yearKey = this.epochsSequence[idx];

    this.scrubButtons.forEach(btn => {
      if (btn.getAttribute('data-year') === yearKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const info = this.getEpochData(yearKey);
    if (this.yearTextEl) this.yearTextEl.textContent = info.yearArabic;
    if (this.titleTextEl) this.titleTextEl.textContent = info.title;

    sound.playBrassDallahResonance();
    this.renderScene(yearKey);
  }

  getEpochData(key) {
    const data = {
      '1727': { yearArabic: '١٧٢٧', title: 'يوم التأسيس — الإمام محمد بن سعود يؤسس الدرعية عاصمة للاستقرار' },
      '1818': { yearArabic: '١٨١٨', title: 'صمود الدرعية والشهادة — شموخ المبادئ ورسوخ الأرض' },
      '1824': { yearArabic: '١٨٢٤', title: 'الدولة السعودية الثانية — الإمام تركي بن عبدالله يعيد البناء من الرياض' },
      '1891': { yearArabic: '١٨٩١', title: 'صبر الرمال واستراحة الفرسان — وعد يترقبه فجر الجزيرة' },
      '1902': { yearArabic: '١٩٠٢', title: 'استرداد الرياض — الملك عبدالعزيز ورجاله يسطرون فجر الوحدة' },
      '1932': { yearArabic: '١٩٣٢', title: 'توحيد المملكة العربية السعودية — راية خضراء تجمع القلوب والأرض' },
      'dev': { yearArabic: 'عصر النماء', title: 'بناء الوطن — مدارس، طرق، مستشفيات ونهضة مدن' },
      '2026': { yearArabic: '٢٠٢٦', title: 'اليوم الوطني ٩٦ — رؤية سعودية رائدة تعانق عنان السماء' }
    };
    return data[key] || data['1727'];
  }

  renderScene(key) {
    if (!this.skyCtx || !this.terrainCtx || !this.elementsCtx) return;

    const w = this.skyCanvas.width;
    const h = this.skyCanvas.height;

    this.skyCtx.clearRect(0, 0, w, h);
    this.terrainCtx.clearRect(0, 0, w, h);
    this.elementsCtx.clearRect(0, 0, w, h);

    // 1. SKY GRADIENT PER ERA
    this.drawSky(key, w, h);

    // 2. TERRAIN MORPHING
    this.drawTerrain(key, w, h);

    // 3. THE SACRED PALM WITNESS (Persistent coordinates across every era!)
    const palmX = w * 0.16;
    const palmY = h * 0.78;
    this.drawPalmWitness(this.elementsCtx, palmX, palmY);

    // 4. HISTORICAL SETTLEMENT & CULTURAL MOTIFS
    this.drawHistoricalMotifs(key, w, h);
  }

  drawSky(key, w, h) {
    const ctx = this.skyCtx;
    const grad = ctx.createLinearGradient(0, 0, 0, h * 0.75);

    if (key === '1727' || key === '1824') {
      // Golden dawn of heritage
      grad.addColorStop(0, '#f9ecd4');
      grad.addColorStop(0.6, '#ebcaa2');
      grad.addColorStop(1, '#cfa36b');
    } else if (key === '1818' || key === '1891') {
      // Atmospheric quiet twilight
      grad.addColorStop(0, '#322521');
      grad.addColorStop(0.5, '#5c4135');
      grad.addColorStop(1, '#94664c');
    } else if (key === '1902') {
      // High dawn of victory
      grad.addColorStop(0, '#f6e4cc');
      grad.addColorStop(0.6, '#deb17a');
      grad.addColorStop(1, '#bb824f');
    } else if (key === '1932') {
      // Celebratory serene green and gold tints
      grad.addColorStop(0, '#e8f2e9');
      grad.addColorStop(0.5, '#b9d4bd');
      grad.addColorStop(1, '#d8bc88');
    } else if (key === 'dev') {
      // Modern blue daylight
      grad.addColorStop(0, '#d9eaf2');
      grad.addColorStop(0.6, '#adc9d6');
      grad.addColorStop(1, '#cfba96');
    } else {
      // 2026: Deep emerald glow & twilight skyline
      grad.addColorStop(0, '#0c2619');
      grad.addColorStop(0.5, '#16402a');
      grad.addColorStop(1, '#3b2f1f');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  drawTerrain(key, w, h) {
    const ctx = this.terrainCtx;

    // Distant mountain ridge
    ctx.fillStyle = (key === '2026') ? '#122e1f' : '#b28659';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.58);
    ctx.bezierCurveTo(w * 0.25, h * 0.48, w * 0.55, h * 0.54, w * 0.8, h * 0.42);
    ctx.lineTo(w, h * 0.50);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    // Middle sand dune ridge
    ctx.fillStyle = (key === '2026') ? '#19422c' : '#c99a64';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.68);
    ctx.bezierCurveTo(w * 0.35, h * 0.62, w * 0.65, h * 0.72, w, h * 0.65);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    // Foreground soil
    ctx.fillStyle = (key === '2026') ? '#0c2216' : '#9f6f3e';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.78);
    ctx.bezierCurveTo(w * 0.4, h * 0.76, w * 0.75, h * 0.82, w, h * 0.77);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();
  }

  /**
   * THE SACRED PALM WITNESS (النخلة الشاهد)
   * Remains at the exact identical canvas coordinates across all epochs!
   */
  drawPalmWitness(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Palm trunk with textured segments
    ctx.strokeStyle = '#422817';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(8, -60, 4, -135);
    ctx.stroke();

    // Trunk rings
    ctx.strokeStyle = 'rgba(215, 175, 110, 0.45)';
    ctx.lineWidth = 3;
    for (let i = 1; i <= 7; i++) {
      ctx.beginPath();
      const ringY = -i * 18;
      ctx.moveTo(-4, ringY);
      ctx.lineTo(8, ringY + 2);
      ctx.stroke();
    }

    // Lush palm fronds (watercolor green with golden tips)
    const fronds = [
      { endX: -65, endY: -95, cpX: -45, cpY: -145 },
      { endX: -55, endY: -135, cpX: -35, cpY: -170 },
      { endX: -25, endY: -165, cpX: -15, cpY: -185 },
      { endX: 25, endY: -165, cpX: 15, cpY: -185 },
      { endX: 60, endY: -135, cpX: 40, cpY: -170 },
      { endX: 75, endY: -95, cpX: 55, cpY: -145 },
      { endX: 0, endY: -180, cpX: 2, cpY: -190 }
    ];

    fronds.forEach(f => {
      ctx.strokeStyle = '#1a5433';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(4, -135);
      ctx.quadraticCurveTo(f.cpX, f.cpY, f.endX, f.endY);
      ctx.stroke();

      // Leaf feathers
      ctx.strokeStyle = '#29784b';
      ctx.lineWidth = 1.8;
      for (let t = 0.2; t <= 0.95; t += 0.15) {
        const lx = 4 * (1 - t) * (1 - t) + 2 * (1 - t) * t * f.cpX + t * t * f.endX;
        const ly = -135 * (1 - t) * (1 - t) + 2 * (1 - t) * t * f.cpY + t * t * f.endY;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx + (f.endX > 0 ? 10 : -10), ly + 12);
        ctx.stroke();
      }
    });

    // Date clusters (تمر أصفر وذهبي)
    ctx.fillStyle = '#d9942a';
    ctx.beginPath();
    ctx.arc(-8, -128, 6, 0, Math.PI * 2);
    ctx.arc(14, -128, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Render era-specific architecture & motifs (mudbrick, gateway, tower, KAFD, etc.)
   */
  drawHistoricalMotifs(key, w, h) {
    const ctx = this.elementsCtx;

    if (key === '1727' || key === '1818' || key === '1824') {
      // 1. Mudbrick Watchtower with Falcon (from the motif sheet)
      this.drawMudbrickWatchtower(ctx, w * 0.46, h * 0.72);

      // 2. Diriyah Carved Wooden Door (from the motif sheet)
      this.drawDiriyahDoor(ctx, w * 0.68, h * 0.74);

    } else if (key === '1891' || key === '1902') {
      // Al-Masmak mudbrick fortress wall & gates
      ctx.fillStyle = '#8f5c35';
      ctx.fillRect(w * 0.40, h * 0.58, w * 0.32, h * 0.16);

      // Towers at corners
      ctx.fillRect(w * 0.38, h * 0.50, 45, h * 0.24);
      ctx.fillRect(w * 0.70, h * 0.50, 45, h * 0.24);

      // Triangular arrow slits
      ctx.fillStyle = '#3a2110';
      for (let i = 0; i < 6; i++) {
        const tx = w * 0.43 + i * 40;
        ctx.beginPath();
        ctx.moveTo(tx, h * 0.62);
        ctx.lineTo(tx + 6, h * 0.67);
        ctx.lineTo(tx - 6, h * 0.67);
        ctx.fill();
      }

      // Crossed swords motif
      this.drawCrossedSwords(ctx, w * 0.82, h * 0.68);

    } else if (key === '1932') {
      // Unification: Mudbrick architecture + Raised Green Banner of Saudi Arabia
      ctx.fillStyle = '#9b6c43';
      ctx.fillRect(w * 0.38, h * 0.58, w * 0.26, h * 0.16);

      // Green Banner flutter
      ctx.fillStyle = '#1b5333';
      ctx.fillRect(w * 0.55, h * 0.36, 90, 55);

      // White calligraphy flourish on banner
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w * 0.57, h * 0.41);
      ctx.lineTo(w * 0.55 + 70, h * 0.41);
      ctx.stroke();

      // Flagpole
      ctx.strokeStyle = '#291e17';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(w * 0.55, h * 0.36);
      ctx.lineTo(w * 0.55, h * 0.66);
      ctx.stroke();

      // Ardah Drummer playing Daff
      this.drawDaffDrummer(ctx, w * 0.74, h * 0.74);

    } else if (key === 'dev') {
      // Infrastructure development: Al-Khobar water tower, roads & streetlamps
      this.drawKhobarTower(ctx, w * 0.44, h * 0.70);

      // Modern highway cutting through the desert
      ctx.fillStyle = '#2f2c2a';
      ctx.beginPath();
      ctx.moveTo(w * 0.60, h * 0.68);
      ctx.lineTo(w * 0.64, h * 0.68);
      ctx.lineTo(w * 0.88, h);
      ctx.lineTo(w * 0.40, h);
      ctx.fill();

    } else if (key === '2026') {
      // 2026: Modern Riyadh Skyline (Kingdom Tower, KAFD skyscrapers) + Glowing green grids
      this.drawKingdomTower(ctx, w * 0.45, h * 0.66);
      this.drawKAFD(ctx, w * 0.62, h * 0.68);

      // Scent of incense rising in the night sky
      this.drawMabkhara(ctx, w * 0.85, h * 0.76);
    }
  }

  /* Mudbrick watchtower with perched falcon */
  drawMudbrickWatchtower(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Watchtower
    ctx.fillStyle = '#9b6c43';
    ctx.beginPath();
    ctx.moveTo(-25, 0);
    ctx.lineTo(25, 0);
    ctx.lineTo(20, -110);
    ctx.lineTo(-20, -110);
    ctx.closePath();
    ctx.fill();

    // Battlements
    for (let b = -20; b <= 15; b += 10) {
      ctx.fillRect(b, -120, 6, 10);
    }

    // Perched falcon silhouette
    ctx.fillStyle = '#261a12';
    ctx.beginPath();
    ctx.ellipse(14, -125, 4, 9, 0.2, 0, Math.PI * 2);
    ctx.arc(15, -135, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /* Hand-drawn style Diriyah door with triangular geometric patterns */
  drawDiriyahDoor(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Arch frame
    ctx.fillStyle = '#7a4b27';
    ctx.fillRect(-28, -85, 56, 85);

    // Carved panels
    ctx.fillStyle = '#a66a3b';
    ctx.fillRect(-24, -80, 22, 75);
    ctx.fillRect(2, -80, 22, 75);

    // Najdi triangular engravings (red and ochre dots)
    ctx.fillStyle = '#d94336';
    for (let r = 0; r < 4; r++) {
      ctx.fillRect(-18, -70 + r * 16, 10, 4);
      ctx.fillRect(8, -70 + r * 16, 10, 4);
    }

    ctx.restore();
  }

  /* Traditional crossed swords */
  drawCrossedSwords(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#dca10d';
    ctx.lineWidth = 3.5;

    // First curved blade
    ctx.beginPath();
    ctx.arc(0, 0, 30, -0.8, 0.8, false);
    ctx.stroke();

    // Second curved blade
    ctx.beginPath();
    ctx.arc(0, 0, 30, Math.PI - 0.8, Math.PI + 0.8, false);
    ctx.stroke();

    ctx.restore();
  }

  /* Ardah / Majroor / Samri Daff Drummer in White Thobe */
  drawDaffDrummer(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // White thobe
    ctx.fillStyle = '#f8f5ee';
    ctx.beginPath();
    ctx.moveTo(0, -60);
    ctx.lineTo(18, 0);
    ctx.lineTo(-18, 0);
    ctx.closePath();
    ctx.fill();

    // Red and white Shemagh / Ghutra
    ctx.fillStyle = '#b32424';
    ctx.beginPath();
    ctx.arc(0, -68, 9, 0, Math.PI * 2);
    ctx.fill();

    // Raised round Daff (drum)
    ctx.strokeStyle = '#8a532d';
    ctx.lineWidth = 4;
    ctx.fillStyle = '#eed6b3';
    ctx.beginPath();
    ctx.arc(20, -72, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  /* Al-Khobar iconic water tower */
  drawKhobarTower(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Stem
    ctx.fillStyle = '#8f9da0';
    ctx.fillRect(-8, -130, 16, 130);

    // Conical water vessel
    ctx.fillStyle = '#55757d';
    ctx.beginPath();
    ctx.moveTo(-35, -130);
    ctx.lineTo(35, -130);
    ctx.lineTo(18, -90);
    ctx.lineTo(-18, -90);
    ctx.closePath();
    ctx.fill();

    // Lantern top
    ctx.fillStyle = '#dca10d';
    ctx.beginPath();
    ctx.arc(0, -140, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /* Kingdom Tower (برج المملكة) */
  drawKingdomTower(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Elegant parabolic curved silhouette
    ctx.fillStyle = '#2c5e75';
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(-12, -180);
    ctx.quadraticCurveTo(0, -145, 12, -180);
    ctx.lineTo(18, 0);
    ctx.closePath();
    ctx.fill();

    // Skybridge curve
    ctx.strokeStyle = '#dca10d';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, -165, 12, 0, Math.PI, false);
    ctx.stroke();

    ctx.restore();
  }

  /* KAFD Financial Center crystalline towers */
  drawKAFD(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Angled faceted crystalline buildings
    ctx.fillStyle = '#1c4940';
    ctx.fillRect(-30, -150, 26, 150);

    ctx.fillStyle = '#2d6d60';
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.lineTo(4, -195);
    ctx.lineTo(34, -170);
    ctx.lineTo(34, 0);
    ctx.closePath();
    ctx.fill();

    // Diamond grid accents
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(4, -140);
    ctx.lineTo(34, -120);
    ctx.moveTo(4, -100);
    ctx.lineTo(34, -80);
    ctx.stroke();

    ctx.restore();
  }

  /* Mabkhara with wisps of incense smoke */
  drawMabkhara(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Base and stem
    ctx.fillStyle = '#dca10d';
    ctx.fillRect(-12, -8, 24, 8);
    ctx.fillRect(-6, -30, 12, 22);

    // Cup
    ctx.beginPath();
    ctx.moveTo(-16, -30);
    ctx.lineTo(16, -30);
    ctx.lineTo(12, -48);
    ctx.lineTo(-12, -48);
    ctx.closePath();
    ctx.fill();

    // Incense smoke wisps
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, -50);
    ctx.bezierCurveTo(-10, -70, 12, -85, -4, -110);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * The Sublime Transformation Climax (Jabal Tuwaiq)
   */
  triggerTransformationClimax() {
    this.pauseAutoProgression();

    if (this.timelineScene) {
      this.timelineScene.classList.remove('active-scene');
    }

    if (this.transformationScene) {
      this.transformationScene.classList.add('active-scene');
    }

    sound.playBrassDallahResonance();

    // After 7 seconds of contemplation on Jabal Tuwaiq quote, proceed to Saudi Map!
    setTimeout(() => {
      if (this.transformationScene) {
        this.transformationScene.classList.remove('active-scene');
      }
      if (this.onTimelineComplete) {
        this.onTimelineComplete();
      }
    }, 7000);
  }
}
