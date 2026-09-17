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
 * - الانتقال السلس إلى مساحة الاستكشاف: الحبر الذهبي يختتم مسيرة التوحيد لفتح بوابات استكشاف الوطن
 */

import { sound } from './audioEngine.js';

export class HistoricalInkStory {
  constructor(onTransitionToHub) {
    this.onTransitionToHub = onTransitionToHub;

    this.overlay = document.getElementById('history-ink-overlay');
    this.canvas = document.getElementById('ink-story-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.yearDisplay = document.getElementById('ink-year-display');
    this.titleDisplay = document.getElementById('ink-title-display');
    this.narrativeDisplay = document.getElementById('ink-narrative-display');
    this.pills = document.querySelectorAll('.ink-pill-btn');
    this.btnPrev = document.getElementById('btn-ink-prev');
    this.btnNext = document.getElementById('btn-ink-next');
    this.btnToHub = document.getElementById('btn-ink-to-hub') || document.getElementById('btn-ink-to-map');

    this.currentEra = 0;
    this.drawProgress = 0; // 0 to 1
    this.animating = false;
    this.animId = null;

    // Preloaded verified historical visual assets
    this.images = {
      era1727: this.loadImage('assets/images/history_1727_gen.jpg'),
      era1818: this.loadImage('assets/images/history_1818_gen.jpg'),
      era1824: this.loadImage('assets/images/history_1824_gen.jpg'),
      era1891: this.loadImage('assets/images/history_1824.jpg'),
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
        imgKey: 'era1818',
        drawSpeed: 0.014
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
        title: 'نهاية الدولة السعودية الثانية وحفظ الإرث',
        narrative: 'مرحلة تحوّل تاريخية بقي فيها عهد الأئمة حياً في الذاكرة النجدية والعربية، ليمهّد الطريق للملحمة الكبرى لتوحيد الجزيرة العربية.',
        imgKey: 'era1891',
        drawSpeed: 0.014
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
        narrative: 'برؤية طموحة يقودها خادم الحرمين الشريفين وسمو ولي العهد، تقف السعودية اليوم عاصمة للعالم، وواحة للمشاريع الكبرى ومستقبل البشرية.',
        imgKey: 'era2026',
        drawSpeed: 0.010,
        isHubTransition: true
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

    this.btnToHub?.addEventListener('click', () => {
      sound.playChime(640);
      this.close();
      if (this.onTransitionToHub) this.onTransitionToHub();
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
    if (this.btnToHub) {
      this.btnToHub.style.display = (index === this.eras.length - 1) ? 'inline-block' : 'none';
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
    ctx.quadraticCurveTo(w * 0.35, h - 65, Math.min(w - 30, 30 + strokeLen), h - 45);
    ctx.stroke();

    // Calligraphy feather pen tip
    if (this.drawProgress < 1.0) {
      const penX = 30 + strokeLen;
      const penY = h - 45;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(penX, penY, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
