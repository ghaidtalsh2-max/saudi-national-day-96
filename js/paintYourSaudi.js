/**
 * paintYourSaudi.js - تجربة "سعوديتك" (صانع طابع البريد التذكاري الرسمي لليوم الوطني السعودي 96)
 * - يتيح للمستخدم كتابة تصوره أو اختيار عناصره المفضلة (طائف، ضباب، ورد، نجد، رواشين، مرايا، قهوة، خيل..)
 * - يولد طابع بريد تذكاري رسمي متكامل فائق الدقة (Single Unified Saudi Postal Stamp)
 * - يحتوي على مسننات الطابع، الختم البريدي الدائري، اسم المستخدم، القيمة البريدية ٩٦ هللة، وأزرار التحميل والطباعة.
 */

import { sound } from './audioEngine.js';

export class PaintYourSaudi {
  constructor() {
    this.overlay = document.getElementById('paint-saudi-overlay');
    this.inputName = document.getElementById('stamp-user-name');
    this.inputVision = document.getElementById('stamp-vision-text');
    this.btnGenerate = document.getElementById('btn-generate-stamp');
    this.btnDownload = document.getElementById('btn-download-stamp');
    this.btnPrint = document.getElementById('btn-print-stamp');
    this.canvas = document.getElementById('postal-stamp-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.selectedTags = new Set();

    this.bindEvents();
    // Render initial sample stamp
    setTimeout(() => this.generateStamp(false), 300);
  }

  bindEvents() {
    // Quick Tag Buttons
    document.querySelectorAll('.stamp-tag-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playDrumBeat('tar', 120);
        const tag = btn.getAttribute('data-tag');
        if (this.selectedTags.has(tag)) {
          this.selectedTags.delete(tag);
          btn.classList.remove('active');
        } else {
          this.selectedTags.add(tag);
          btn.classList.add('active');
          if (this.inputVision && !this.inputVision.value.includes(tag)) {
            this.inputVision.value = this.inputVision.value ? `${this.inputVision.value}، ${tag}` : tag;
          }
        }
      });
    });

    this.btnGenerate?.addEventListener('click', () => {
      this.generateStamp(true);
    });

    this.btnDownload?.addEventListener('click', () => {
      this.downloadStampImage();
    });

    this.btnPrint?.addEventListener('click', () => {
      this.printStamp();
    });
  }

  open() {
    if (this.overlay) {
      this.overlay.classList.add('active');
      this.generateStamp(false);
    }
  }

  close() {
    if (this.overlay) {
      this.overlay.classList.remove('active');
    }
  }

  generateStamp(playEffects = true) {
    const userName = (this.inputName && this.inputName.value.trim()) || 'مواطن فخور بمجده';
    const visionText = (this.inputVision && this.inputVision.value.trim()) || 'سعوديتي طائف باردة، فيها الجبال والضباب والورد وبيت قديم وقهوة مع أهلي';

    if (playEffects) {
      sound.playChime(720);
      sound.playDrumBeat('tar', 140);
    }

    this.renderPostalStamp(userName, visionText);
  }

  renderPostalStamp(userName, visionText) {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width = 1000;
    const h = this.canvas.height = 700;

    ctx.clearRect(0, 0, w, h);

    // 1. Perforated Stamp Outer Paper Texture
    ctx.fillStyle = '#f8f4ec';
    ctx.fillRect(0, 0, w, h);

    // Stamp Perforation Cutout Holes (Around Borders)
    ctx.fillStyle = '#0e120f'; // Matches deep background
    const holeRadius = 10;
    const step = 28;

    // Top & Bottom Perforations
    for (let x = step / 2; x < w; x += step) {
      ctx.beginPath();
      ctx.arc(x, 0, holeRadius, 0, Math.PI);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, h, holeRadius, Math.PI, 0);
      ctx.fill();
    }

    // Left & Right Perforations
    for (let y = step / 2; y < h; y += step) {
      ctx.beginPath();
      ctx.arc(0, y, holeRadius, -Math.PI / 2, Math.PI / 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(w, y, holeRadius, Math.PI / 2, -Math.PI / 2);
      ctx.fill();
    }

    // 2. Royal Green & Gold Gilded Double Border
    const pad = 38;
    ctx.strokeStyle = '#006c35';
    ctx.lineWidth = 8;
    ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.strokeRect(pad + 10, pad + 10, w - (pad + 10) * 2, h - (pad + 10) * 2);

    // Corner Ornaments
    this.drawCornerFiligree(ctx, pad + 12, pad + 12);
    this.drawCornerFiligree(ctx, w - pad - 12, pad + 12);
    this.drawCornerFiligree(ctx, pad + 12, h - pad - 12);
    this.drawCornerFiligree(ctx, w - pad - 12, h - pad - 12);

    // 3. Stamp Header: Kingdom of Saudi Arabia • Postage 96
    ctx.fillStyle = '#006c35';
    ctx.font = 'bold 24px "Reem Kufi", "Amiri", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('المملكة العربية السعودية • البريد التذكاري', w - pad - 28, pad + 42);

    ctx.font = 'bold 18px "Tajawal", "Almarai", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('KINGDOM OF SAUDI ARABIA • POSTAGE 96', pad + 28, pad + 42);

    // 4. Central Artwork Canvas Area
    const artX = pad + 22;
    const artY = pad + 60;
    const artW = w - (pad + 22) * 2;
    const artH = h - (pad + 60) - 95;

    this.drawCustomSaudiLandscape(ctx, artX, artY, artW, artH, visionText);

    // 5. Official Circular Postmark Stamp (ختم البريد التراثي)
    this.drawPostmarkSeal(ctx, w - 210, h - 180);

    // 6. Stamp Footer: User Name Dedication & 96 Halalas Value
    ctx.fillStyle = '#1c1712';
    ctx.font = 'bold 22px "Amiri", "Aref Ruqaa", serif';
    ctx.textAlign = 'right';
    ctx.fillText(`بريشة وتصوّر: ${userName}`, w - pad - 28, h - pad - 24);

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 26px "Reem Kufi", "Almarai", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('٩٦ هللة • اليوم الوطني 96', pad + 28, h - pad - 24);
  }

  drawCornerFiligree(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawCustomSaudiLandscape(ctx, x, y, w, h, text) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    const lower = text.toLowerCase();
    const hasTaif = lower.includes('طائف') || lower.includes('ورد') || lower.includes('هدا') || lower.includes('ضباب');
    const hasSea = lower.includes('جدة') || lower.includes('بحر') || lower.includes('رواشين') || lower.includes('بلد');
    const hasAlula = lower.includes('علا') || lower.includes('مرايا') || lower.includes('صخر') || lower.includes('حجر');
    const hasAsir = lower.includes('عسير') || lower.includes('أبها') || lower.includes('سروات') || lower.includes('ألمع');

    // 1. Sky Gradient
    const sky = ctx.createLinearGradient(x, y, x, y + h);
    if (hasTaif || hasAsir) {
      // Foggy Mountain Sunset Sky
      sky.addColorStop(0, '#c2d6e8');
      sky.addColorStop(0.5, '#e8d5cc');
      sky.addColorStop(1, '#f7dfc0');
    } else if (hasSea) {
      // Coastal Red Sea Blue & Coral Sunset
      sky.addColorStop(0, '#3a7bd5');
      sky.addColorStop(0.5, '#ffd194');
      sky.addColorStop(1, '#ff8a5c');
    } else {
      // Golden Hour Desert Horizon
      sky.addColorStop(0, '#fffaeb');
      sky.addColorStop(0.4, '#faeed8');
      sky.addColorStop(1, '#e3b878');
    }
    ctx.fillStyle = sky;
    ctx.fillRect(x, y, w, h);

    // 2. Radiant Sun / Glowing Orb
    ctx.fillStyle = 'rgba(255, 245, 200, 0.75)';
    ctx.beginPath();
    ctx.arc(x + w * 0.45, y + h * 0.35, 75, 0, Math.PI * 2);
    ctx.fill();

    // 3. Mountain Backdrop (Tuwaiq, Sarawat, or AlUla Sandstone)
    if (hasAlula) {
      // Monumental Sandstone Cliffs of Hegra
      ctx.fillStyle = '#b36b3f';
      for (let i = 0; i < 6; i++) {
        ctx.fillRect(x + i * 160, y + h * 0.28, 120, h * 0.5);
      }
    } else if (hasTaif || hasAsir) {
      // Jagged Sarawat Peaks & Layered Fog
      ctx.fillStyle = '#5c4838';
      ctx.beginPath();
      ctx.moveTo(x, y + h * 0.55);
      ctx.lineTo(x + w * 0.22, y + h * 0.25);
      ctx.lineTo(x + w * 0.48, y + h * 0.42);
      ctx.lineTo(x + w * 0.75, y + h * 0.22);
      ctx.lineTo(x + w, y + h * 0.48);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.fill();

      // Atmospheric White Mist / Fog Waves
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillRect(x, y + h * 0.45, w, 40);
    } else {
      // Majestic Tuwaiq Escarpment
      ctx.fillStyle = '#ab814e';
      ctx.beginPath();
      ctx.moveTo(x, y + h * 0.55);
      ctx.lineTo(x + w * 0.3, y + h * 0.38);
      ctx.lineTo(x + w * 0.6, y + h * 0.48);
      ctx.lineTo(x + w * 0.85, y + h * 0.32);
      ctx.lineTo(x + w, y + h * 0.48);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.fill();
    }

    // 4. Foreground Terrain & Golden Sand Dunes / Terraces
    ctx.fillStyle = '#d4a464';
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.68);
    ctx.quadraticCurveTo(x + w * 0.35, y + h * 0.58, x + w * 0.65, y + h * 0.72);
    ctx.quadraticCurveTo(x + w * 0.85, y + h * 0.78, x + w, y + h * 0.64);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.fill();

    // 5. Modern Skyline Silhouette (Kingdom Centre Arch & KAFD)
    ctx.fillStyle = 'rgba(18, 64, 42, 0.6)';
    const ktX = x + w * 0.82;
    ctx.fillRect(ktX - 16, y + h * 0.22, 32, h * 0.5);
    ctx.fillStyle = '#faeed8';
    ctx.beginPath();
    ctx.arc(ktX, y + h * 0.30, 9, 0, Math.PI);
    ctx.fill();

    // 6. Traditional Palms
    this.drawPalmSilhouette(ctx, x + w * 0.14, y + h * 0.82, 1.3);
    this.drawPalmSilhouette(ctx, x + w * 0.24, y + h * 0.86, 0.95);

    // 7. Taif Roses Floating in Breeze
    if (hasTaif || lower.includes('ورد')) {
      for (let r = 0; r < 8; r++) {
        this.drawRosePetal(ctx, x + w * (0.2 + r * 0.08), y + h * (0.55 + Math.sin(r) * 0.15));
      }
    }

    // 8. Dallah & Finjan
    if (lower.includes('قهوة') || lower.includes('دلة')) {
      this.drawDallahSilhouette(ctx, x + w * 0.48, y + h * 0.82);
    }

    ctx.restore();
  }

  drawPalmSilhouette(ctx, px, py, scale) {
    ctx.save();
    ctx.translate(px, py);
    ctx.scale(scale, scale);
    ctx.strokeStyle = '#422a16';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(5, -45, 0, -85);
    ctx.stroke();

    ctx.fillStyle = '#225528';
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(ang) * 18, -85 + Math.sin(ang) * 12, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawRosePetal(ctx, rx, ry) {
    ctx.save();
    ctx.fillStyle = '#e83e8c';
    ctx.beginPath();
    ctx.arc(rx, ry, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff79b0';
    ctx.beginPath();
    ctx.arc(rx + 2, ry - 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawDallahSilhouette(ctx, dx, dy) {
    ctx.save();
    ctx.translate(dx, dy);
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(12, 0);
    ctx.lineTo(8, -28);
    ctx.lineTo(14, -36);
    ctx.lineTo(0, -52);
    ctx.lineTo(-14, -36);
    ctx.lineTo(-8, -28);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawPostmarkSeal(ctx, cx, cy) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.14);

    ctx.strokeStyle = 'rgba(0, 108, 53, 0.75)';
    ctx.lineWidth = 2.5;

    // Outer Circle
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, Math.PI * 2);
    ctx.stroke();

    // Inner Circle
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    ctx.stroke();

    // Postmark Text
    ctx.fillStyle = 'rgba(0, 108, 53, 0.85)';
    ctx.font = 'bold 10px "Almarai", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('بريد الرياض • RIYADH', 0, -22);
    ctx.font = 'bold 12px "Reem Kufi", sans-serif';
    ctx.fillText('اليوم الوطني ٩٦', 0, 0);
    ctx.font = '10px "Tajawal", sans-serif';
    ctx.fillText('23 SEPT 2026', 0, 22);

    ctx.restore();
  }

  downloadStampImage() {
    if (!this.canvas) return;
    sound.playChime(680);
    const link = document.createElement('a');
    link.download = `طابع_سعوديتك_اليوم_الوطني_96.png`;
    link.href = this.canvas.toDataURL('image/png', 1.0);
    link.click();
  }

  printStamp() {
    if (!this.canvas) return;
    sound.playChime(640);
    const dataUrl = this.canvas.toDataURL('image/png', 1.0);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
        <head>
          <title>طابع سعوديتك — اليوم الوطني السعودي 96</title>
          <style>
            body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background: #fafafa; font-family: sans-serif; }
            img { max-width: 90%; max-height: 90%; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <img src="${dataUrl}" alt="طابع سعوديتك">
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  }
}
