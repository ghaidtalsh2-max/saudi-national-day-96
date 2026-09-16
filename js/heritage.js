/**
 * heritage.js - تجربة "موروثنا والشعر"
 * تفاعل مع القطع التراثية الأصيلة.. الحبر يخط القصيد التليد،
 * والصوت والذاكرة يحييان اللحظة.
 */

import { sound } from './audioEngine.js';

export class HeritageManager {
  constructor() {
    this.relicItems = document.querySelectorAll('.relic-item');
    this.headingEl = document.getElementById('relic-heading');
    this.verseEl = document.getElementById('relic-verse');
    this.loreEl = document.getElementById('relic-lore');
    this.canvas = document.getElementById('relic-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.relicsData = {
      sword: {
        title: 'السيف الأجرب والهنادي',
        verse: '«والسيف في يمنا هل العوجا يبوج الظلام .. عاداتنا بالكون نردي كل عايل»',
        lore: 'رمز الشجاعة والسيادة وحماية العهد.. السيف السعودي رفيق الأئمة والملوك، وركيزة العرضة التي توحد القلوب وتستذكر بطولات التأسيس والتوحيد.',
        soundAction: () => sound.playBrassDallahResonance(),
        draw: (ctx, w, h) => this.drawSword(ctx, w, h)
      },
      bisht: {
        title: 'البشت الحساوي والزري الذهبي',
        lore: 'حرفة حساوية عريقة تناقلتها الأيدي عبر القرون؛ خيوط الذهب والفضة (الزري الألماني) تُحاك بدقة لتنسج هيبة ومروءة الرجل السعودي في المحافل والأعياد.',
        verse: '«يا لابس البشت المذهّب لك وقار .. هيبة رجالٍ ما تلين عزومها»',
        soundAction: () => sound.playFinjanClink(),
        draw: (ctx, w, h) => this.drawBisht(ctx, w, h)
      },
      falcon: {
        title: 'الصقارة والخيل العربية الأصيلة',
        lore: 'شغف البادية ورياضة الملوك.. الصقر الحر الذي يعانق زرقة السماء، والخيل اليعربية التي صهلت في معارك التوحيد وحملت راية العز جيلاً بعد جيل.',
        verse: '«والخيل معقودٌ بنواصيها الخير إلى يوم القيامة.. حرة المسرى أصيلة النسب»',
        soundAction: () => sound.playHoofClick(1.2),
        draw: (ctx, w, h) => this.drawFalcon(ctx, w, h)
      },
      oud: {
        title: 'العود والمبخرة النجدية والحجازية',
        lore: 'سفير الضيافة السعودية الذي لا يغادر مجلساً؛ دخون العود الأزرق والمروكي يطوف بين الضيوف ليختم الجلسة بأزكى ريح وأعذب ذكرى.',
        verse: '«ريح الخزامى والنفل عانق العود .. وطيب المعاني في ذرى دار الأجواد»',
        soundAction: () => sound.playBrassDallahResonance(),
        draw: (ctx, w, h) => this.drawMabkhara(ctx, w, h)
      },
      pearl: {
        title: 'دانة الغواص ومحار الخليج',
        lore: 'كفاح الأجداد في أعماق الخليج العربي؛ رحلات الغوص على "سفين الدشة والقفال" بحثاً عن الدانة والحصباة، مع أهازيج النهام التي تذيب وحشة الليل والبحر.',
        verse: '«يا بحر كم في قاعك الصامت كنوز .. غاصت عليها عيون رجالٍ صوامل»',
        soundAction: () => sound.playSeaSurf(),
        draw: (ctx, w, h) => this.drawPearl(ctx, w, h)
      }
    };

    this.init();
    this.bindEvents();
  }

  init() {
    this.selectRelic('sword');
  }

  bindEvents() {
    this.relicItems.forEach(item => {
      item.addEventListener('click', () => {
        this.relicItems.forEach(r => r.classList.remove('active'));
        item.classList.add('active');
        const key = item.getAttribute('data-relic');
        this.selectRelic(key);
      });
    });
  }

  selectRelic(key) {
    const data = this.relicsData[key];
    if (!data) return;

    if (this.headingEl) this.headingEl.textContent = data.title;
    if (this.loreEl) this.loreEl.textContent = data.lore;

    // Ink verse reveal
    if (this.verseEl) {
      this.verseEl.style.opacity = '0';
      this.verseEl.style.transform = 'translateY(8px)';
      setTimeout(() => {
        this.verseEl.textContent = data.verse;
        this.verseEl.style.opacity = '1';
        this.verseEl.style.transform = 'translateY(0)';
      }, 150);
    }

    if (data.soundAction) {
      data.soundAction();
    }

    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      data.draw(this.ctx, this.canvas.width, this.canvas.height);
    }
  }

  drawSword(ctx, w, h) {
    // Elegant curved Arabian scimitar in ink & gold
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-0.35);

    // Blade
    ctx.strokeStyle = '#5a544e';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-110, 0);
    ctx.quadraticCurveTo(20, -15, 110, -45);
    ctx.stroke();

    // Golden Hilt & Pommel
    ctx.strokeStyle = '#c69214';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-110, 0);
    ctx.lineTo(-145, 4);
    ctx.stroke();

    // Guard
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-112, -20);
    ctx.lineTo(-112, 20);
    ctx.stroke();

    ctx.restore();
  }

  drawBisht(ctx, w, h) {
    // Bisht silhouette with golden embroidery neckline
    ctx.save();
    ctx.translate(w / 2, h * 0.2);

    // Dark wool fabric
    ctx.fillStyle = '#221e1a';
    ctx.beginPath();
    ctx.moveTo(-80, 20);
    ctx.lineTo(80, 20);
    ctx.lineTo(110, 180);
    ctx.lineTo(-110, 180);
    ctx.closePath();
    ctx.fill();

    // Golden Zari embroidery collar
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-40, 20);
    ctx.lineTo(0, 120);
    ctx.lineTo(40, 20);
    ctx.stroke();

    ctx.restore();
  }

  drawFalcon(ctx, w, h) {
    // Majestic falcon silhouette in sumi ink
    ctx.save();
    ctx.translate(w / 2, h / 2);

    ctx.fillStyle = '#2a221b';
    ctx.beginPath();
    // Body & head
    ctx.ellipse(0, 10, 32, 60, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Sharp hooked beak
    ctx.fillStyle = '#c69214';
    ctx.beginPath();
    ctx.moveTo(25, -45);
    ctx.lineTo(42, -38);
    ctx.lineTo(26, -32);
    ctx.fill();

    // Perched leather glove
    ctx.strokeStyle = '#754b2d';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(-50, 70);
    ctx.lineTo(50, 70);
    ctx.stroke();

    ctx.restore();
  }

  drawMabkhara(ctx, w, h) {
    // Clay / brass traditional incense burner with smoke
    ctx.save();
    ctx.translate(w / 2, h * 0.7);

    // Base & body
    ctx.fillStyle = '#9e623a';
    ctx.beginPath();
    ctx.moveTo(-45, 0);
    ctx.lineTo(45, 0);
    ctx.lineTo(30, -50);
    ctx.lineTo(50, -80);
    ctx.lineTo(-50, -80);
    ctx.lineTo(-30, -50);
    ctx.closePath();
    ctx.fill();

    // Triangular openings
    ctx.fillStyle = '#fbf7ee';
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 24, -68);
      ctx.lineTo(i * 24 - 8, -56);
      ctx.lineTo(i * 24 + 8, -56);
      ctx.fill();
    }

    // Incense Smoke curls
    ctx.strokeStyle = 'rgba(180, 170, 160, 0.45)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -85);
    ctx.bezierCurveTo(-20, -115, 20, -145, -10, -175);
    ctx.bezierCurveTo(-30, -200, 10, -220, 0, -240);
    ctx.stroke();

    ctx.restore();
  }

  drawPearl(ctx, w, h) {
    // Oyster shell & glowing natural pearl
    ctx.save();
    ctx.translate(w / 2, h * 0.6);

    // Shell
    ctx.fillStyle = '#c5baa8';
    ctx.beginPath();
    ctx.ellipse(0, 0, 70, 45, 0, 0, Math.PI);
    ctx.fill();

    // Luminous Pearl
    const grad = ctx.createRadialGradient(-5, -25, 2, 0, -20, 22);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.6, '#fbf5e6');
    grad.addColorStop(1, '#dec99d');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, -20, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
