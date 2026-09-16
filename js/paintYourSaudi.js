/**
 * paintYourSaudi.js - تجربة "ارسم سعوديتك" (طابع بريد اليوم الوطني السعودي 96)
 * يتيح للمستخدم كتابة اسمه وتصوره/خياله للسعودية،
 * ليقوم النظام بتوليد لوحة فنية بديعة داخل "طابع بريد تذكاري رسمي"
 * يحمل اسم المستخدم في الركن وشعار اليوم الوطني 96 والختم البريدي مع إمكانية التحميل.
 */

import { sound } from './audioEngine.js';

export class PaintYourSaudi {
  constructor() {
    this.inputName = document.getElementById('user-name-input');
    this.inputVision = document.getElementById('user-vision-input');
    this.btnTransform = document.getElementById('btn-transform-painting');
    this.processStage = document.getElementById('paint-process');
    this.statusText = document.getElementById('process-status-text');
    this.resultStage = document.getElementById('paint-result');
    this.canvas = document.getElementById('generative-watercolor-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.btnRepaint = document.getElementById('btn-repaint');
    this.btnModify = document.getElementById('btn-modify-prompt');
    this.btnShare = document.getElementById('btn-share-canvas');

    this.bindEvents();
  }

  bindEvents() {
    // Quick Inspiration tags
    document.querySelectorAll('.tag-ink').forEach(tag => {
      tag.addEventListener('click', () => {
        if (this.inputVision) {
          this.inputVision.value = tag.textContent.trim();
          this.inputVision.focus();
        }
      });
    });

    if (this.btnTransform) {
      this.btnTransform.addEventListener('click', () => this.generateArtwork());
    }

    if (this.btnRepaint) {
      this.btnRepaint.addEventListener('click', () => this.generateArtwork());
    }

    if (this.btnModify) {
      this.btnModify.addEventListener('click', () => {
        if (this.resultStage) this.resultStage.style.display = 'none';
        if (this.inputVision) {
          this.inputVision.scrollIntoView({ behavior: 'smooth' });
          this.inputVision.focus();
        }
      });
    }

    if (this.btnShare) {
      this.btnShare.addEventListener('click', () => this.downloadStampImage());
    }
  }

  generateArtwork() {
    const userName = (this.inputName && this.inputName.value.trim()) || 'ابن الوطن الفخور';
    const visionText = (this.inputVision && this.inputVision.value.trim()) || 'صحراء ذهبية، نخيل باسق، أبراج حديثة، وخيل عربي أصيل يركض نحو المستقبل';

    if (this.resultStage) this.resultStage.style.display = 'none';
    if (this.processStage) this.processStage.style.display = 'block';

    this.updateStatus('نستلهم فكرتك وكلماتك...');
    sound.playFalajWater();

    setTimeout(() => {
      this.updateStatus('نرسم ألوان التراث وتضاريس المملكة...');
      sound.playBrassDallahResonance();
    }, 1200);

    setTimeout(() => {
      this.updateStatus('نطبع طابع البريد التذكاري باسمك وهوية اليوم الوطني ٩٦...');
      sound.playFinjanClink();
    }, 2400);

    setTimeout(() => {
      this.renderPostalStamp(userName, visionText);
      if (this.processStage) this.processStage.style.display = 'none';
      if (this.resultStage) {
        this.resultStage.style.display = 'flex';
        this.resultStage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 3600);
  }

  updateStatus(msg) {
    if (this.statusText) {
      this.statusText.style.opacity = '0';
      setTimeout(() => {
        this.statusText.textContent = msg;
        this.statusText.style.opacity = '1';
      }, 150);
    }
  }

  renderPostalStamp(userName, visionText) {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width = 900;
    const h = this.canvas.height = 640;

    ctx.clearRect(0, 0, w, h);

    // 1. Perforated Stamp Outer Border (مسننات طابع البريد)
    ctx.fillStyle = '#f5efe0';
    ctx.fillRect(0, 0, w, h);

    // Perforation Holes (Cutouts around border)
    ctx.fillStyle = '#1c1b18'; // Background bleed
    const holeR = 8;
    for (let x = 16; x < w; x += 24) {
      ctx.beginPath();
      ctx.arc(x, 0, holeR, 0, Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, h, holeR, Math.PI, 0);
      ctx.fill();
    }
    for (let y = 16; y < h; y += 24) {
      ctx.beginPath();
      ctx.arc(0, y, holeR, -Math.PI / 2, Math.PI / 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w, y, holeR, Math.PI / 2, -Math.PI / 2);
      ctx.fill();
    }

    // 2. Royal Green Stamp Inner Frame
    const framePad = 32;
    ctx.strokeStyle = '#006C35';
    ctx.lineWidth = 6;
    ctx.strokeRect(framePad, framePad, w - framePad * 2, h - framePad * 2);

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.strokeRect(framePad + 8, framePad + 8, w - (framePad + 8) * 2, h - (framePad + 8) * 2);

    // 3. Stamp Header: Kingdom of Saudi Arabia & 96th National Day
    ctx.fillStyle = '#006C35';
    ctx.font = 'bold 22px "Reem Kufi", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('المملكة العربية السعودية • البريد التذكاري', w - framePad - 24, framePad + 36);

    ctx.font = 'bold 18px "Tajawal", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('KINGDOM OF SAUDI ARABIA • POSTAGE 96', framePad + 24, framePad + 36);

    // 4. Inner Artwork Canvas Area
    const artX = framePad + 18;
    const artY = framePad + 52;
    const artW = w - (framePad + 18) * 2;
    const artH = h - (framePad + 52) - 80;

    this.drawVisionScene(ctx, artX, artY, artW, artH, visionText);

    // 5. Official Postmark Stamp (ختم بريد الرياض الدائري التراثي)
    this.drawPostalInkCancelStamp(ctx, w - 180, h - 160);

    // 6. Stamp Footer: User Name, Dedication, & Postal Value
    ctx.fillStyle = '#2b1d12';
    ctx.font = 'bold 20px "Amiri", serif';
    ctx.textAlign = 'right';
    ctx.fillText(`بريشة وتصوّر: ${userName}`, w - framePad - 24, h - framePad - 16);

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 24px "Reem Kufi", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('٩٦ هللة • اليوم الوطني 96', framePad + 24, h - framePad - 16);
  }

  drawVisionScene(ctx, x, y, w, h, visionText) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    // Radiant golden sky
    const sky = ctx.createLinearGradient(x, y, x, y + h);
    sky.addColorStop(0, '#fefbf3');
    sky.addColorStop(0.4, '#faeed8');
    sky.addColorStop(1, '#e3c59a');
    ctx.fillStyle = sky;
    ctx.fillRect(x, y, w, h);

    // Sun disc
    ctx.fillStyle = 'rgba(255, 235, 175, 0.8)';
    ctx.beginPath();
    ctx.arc(x + w * 0.5, y + h * 0.35, 80, 0, Math.PI * 2);
    ctx.fill();

    // Tuwaiq Mountains / Sarawat
    ctx.fillStyle = '#aa8357';
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.55);
    ctx.lineTo(x + w * 0.25, y + h * 0.38);
    ctx.lineTo(x + w * 0.55, y + h * 0.48);
    ctx.lineTo(x + w * 0.85, y + h * 0.3);
    ctx.lineTo(x + w, y + h * 0.45);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.fill();

    // Golden Dunes
    ctx.fillStyle = '#d4a86a';
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.65);
    ctx.quadraticCurveTo(x + w * 0.35, y + h * 0.55, x + w * 0.7, y + h * 0.7);
    ctx.quadraticCurveTo(x + w * 0.85, y + h * 0.75, x + w, y + h * 0.62);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.fill();

    // Modern Skylines (Kingdom Tower silhouette & Futuristic spires)
    ctx.fillStyle = 'rgba(30, 80, 50, 0.5)';
    // Kingdom Centre
    const ktX = x + w * 0.78;
    ctx.fillRect(ktX - 18, y + h * 0.25, 36, h * 0.5);
    // Arch
    ctx.fillStyle = '#faeed8';
    ctx.beginPath();
    ctx.arc(ktX, y + h * 0.32, 10, 0, Math.PI);
    ctx.fill();

    // Palms in foreground
    this.drawStampPalm(ctx, x + w * 0.15, y + h * 0.78, 1.2);
    this.drawStampPalm(ctx, x + w * 0.26, y + h * 0.82, 0.9);

    // Galloping Arabian Horse
    this.drawStampHorse(ctx, x + w * 0.52, y + h * 0.76);

    ctx.restore();
  }

  drawStampPalm(ctx, px, py, scale) {
    ctx.save();
    ctx.translate(px, py);
    ctx.scale(scale, scale);
    ctx.strokeStyle = '#4e331c';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(6, -40, 0, -80);
    ctx.stroke();

    ctx.fillStyle = '#1b5e20';
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 32, -80 + Math.sin(a) * 18, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawStampHorse(ctx, px, py) {
    ctx.save();
    ctx.translate(px, py);
    ctx.fillStyle = '#22150c';
    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 11, 0.15, 0, Math.PI * 2);
    ctx.fill();
    // Neck & Head
    ctx.beginPath();
    ctx.moveTo(12, -4);
    ctx.lineTo(24, -22);
    ctx.lineTo(30, -18);
    ctx.lineTo(18, 6);
    ctx.fill();
    // Legs
    ctx.strokeStyle = '#22150c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(14, 6);
    ctx.lineTo(24, 25);
    ctx.moveTo(-12, 6);
    ctx.lineTo(-22, 25);
    ctx.stroke();
    ctx.restore();
  }

  drawPostalInkCancelStamp(ctx, cx, cy) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.15); // Slight tilt like real ink rubber stamp

    ctx.strokeStyle = 'rgba(180, 40, 40, 0.65)'; // Classic red postmark ink
    ctx.lineWidth = 2.5;

    // Double Ring
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 44, 0, Math.PI * 2);
    ctx.stroke();

    // Arabic Stamp Text
    ctx.fillStyle = 'rgba(180, 40, 40, 0.75)';
    ctx.font = 'bold 12px "Tajawal", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('بريد المملكة العربية السعودية', 0, -22);
    ctx.font = 'bold 15px "Reem Kufi", sans-serif';
    ctx.fillText('اليوم الوطني ٩٦', 0, 4);
    ctx.font = '11px sans-serif';
    ctx.fillText('23 SEP 2026', 0, 24);

    // Cancellation wavy lines
    ctx.beginPath();
    for (let w = 60; w <= 140; w += 20) {
      ctx.moveTo(w, -15);
      ctx.quadraticCurveTo(w + 10, 0, w, 15);
    }
    ctx.stroke();

    ctx.restore();
  }

  downloadStampImage() {
    if (!this.canvas) return;
    try {
      const link = document.createElement('a');
      link.download = 'saudi96-national-day-stamp.png';
      link.href = this.canvas.toDataURL('image/png');
      link.click();
      sound.playFinjanClink();
    } catch (e) {
      console.warn('Download error:', e);
    }
  }
}
