/**
 * cityMiniGames.js - محرك الألعاب والتجارب التفاعلية الحقيقية لمدن المملكة
 * يستخدم صوراً ومعالم حقيقية عالية الدقة 100% مع تجارب تفاعلية حية وأصوات مرافقة:
 * - الطائف: ركوب تلفريك الهدا الحقيقي وصعود القمة مع جمع الورد
 * - جدة: حارات البلد والرواشين الحقيقية مع إنارة الفوانيس وأمواج البحر
 * - الرياض: بوابة المصمك الحقيقية ومترو الرياض والألعاب النارية
 * - العلا: مدائن صالح وصخرة الفيل مع مناطيد هوائية محلقة
 * - الأحساء: بحر النخيل الحقيقي وعيون الماء وجمع التمر الحساوي
 * - عسير: قصور رجال ألمع الحقيقية وتلوين نقوش القط العسيري
 * - حائل: جبال أجا وسلمى مع شبة النار وصب الدلة في الفنجال
 */

import { sound } from './audioEngine.js';

export class CityMiniGamesEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.w = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    this.h = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    this.activeGame = null;
    this.animationFrameId = null;
    this.time = 0;

    // Preload ALL authentic high-resolution landmark photographs
    this.images = {};
    const imgMap = {
      taif: 'assets/images/landmarks/taif_cablecar.jpg',
      jeddah: 'assets/images/landmarks/jeddah_balad.jpg',
      jeddah_fountain: 'assets/images/collage_elements/jeddah_corniche.jpg',
      riyadh: 'assets/images/landmarks/riyadh_masmak.jpg',
      riyadh_skyline: 'assets/images/landmarks/riyadh_skyline.jpg',
      riyadh_metro: 'assets/images/collage_elements/riyadh_metro.png',
      asir: 'assets/images/landmarks/asir_rijal.jpg',
      ahsa: 'assets/images/landmarks/ahsa_oasis.jpg',
      ahsa_palms: 'assets/images/collage_elements/palm_trio.png',
      alula: 'assets/images/landmarks/alula_hegra.jpg',
      hail: 'assets/images/landmarks/hail_jubbah.jpg',
      jazan: 'assets/images/landmarks/jazan_farasan.jpg',
      camel: 'assets/images/collage_elements/camel.png'
    };

    Object.entries(imgMap).forEach(([k, url]) => {
      const img = new Image();
      img.src = url;
      this.images[k] = img;
    });

    // 1. Taif Teleferic State
    this.taifState = {
      altitude: 1000,
      carX: 0.12,
      carY: 0.72,
      speed: 0.8,
      rosesCollected: 0,
      reachedSummit: false,
      rosePickups: []
    };

    // 2. Riyadh Fireworks & Metro State
    this.riyadhState = {
      metroX: -150,
      fireworks: [],
      score: 0
    };

    // 3. Jeddah Lanterns & Ripples
    this.jeddahState = {
      lanternsLit: [true, false, true, false],
      ripples: []
    };

    // 4. Asir Qatt Al-Asiri Coloring State
    this.asirState = {
      activePaletteIdx: 0,
      triangles: []
    };

    // 5. Ahsa Dates & Spring State
    this.ahsaState = {
      datesCaught: 0,
      fallingDates: [],
      ripples: []
    };

    // 6. AlUla Balloons State
    this.alulaState = {
      balloons: []
    };

    // 7. Hail Campfire State
    this.hailState = {
      cupsPoured: 0,
      sparks: []
    };

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    this.w = this.canvas.width = this.canvas.parentElement.clientWidth || window.innerWidth;
    this.h = this.canvas.height = this.canvas.parentElement.clientHeight || window.innerHeight;
  }

  startMiniGame(cityKey) {
    this.activeGame = cityKey;
    this.time = 0;

    if (cityKey === 'taif') this.initTaif();
    else if (cityKey === 'riyadh') this.initRiyadh();
    else if (cityKey === 'jeddah') this.initJeddah();
    else if (cityKey === 'asir') this.initAsir();
    else if (cityKey === 'eastern') this.initAhsa();
    else if (cityKey === 'alula') this.initAlula();
    else if (cityKey === 'hail') this.initHail();

    this.animate = this.animate.bind(this);
    this.animate();
  }

  stop() {
    this.activeGame = null;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  animate() {
    if (!this.activeGame) return;
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.time += 0.016;

    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;
    ctx.clearRect(0, 0, w, h);

    if (this.activeGame === 'taif') this.renderTaif(ctx, w, h);
    else if (this.activeGame === 'riyadh') this.renderRiyadh(ctx, w, h);
    else if (this.activeGame === 'jeddah') this.renderJeddah(ctx, w, h);
    else if (this.activeGame === 'asir') this.renderAsir(ctx, w, h);
    else if (this.activeGame === 'eastern') this.renderAhsa(ctx, w, h);
    else if (this.activeGame === 'alula') this.renderAlula(ctx, w, h);
    else if (this.activeGame === 'hail') this.renderHail(ctx, w, h);
    else this.renderGenericCity(ctx, w, h);
  }

  handleClick(x, y) {
    sound.playFinjanClink();
    if (this.activeGame === 'taif') {
      this.taifState.speed += 0.9;
      if (this.taifState.speed > 3.0) this.taifState.speed = 3.0;
    } else if (this.activeGame === 'riyadh') {
      this.triggerRiyadhFirework(x, y);
    } else if (this.activeGame === 'jeddah') {
      this.triggerJeddahTap(x, y);
    } else if (this.activeGame === 'asir') {
      this.asirState.activePaletteIdx = (this.asirState.activePaletteIdx + 1) % 4;
    } else if (this.activeGame === 'eastern') {
      this.ahsaState.ripples.push({ x, y, r: 5, alpha: 1 });
      this.spawnAhsaDate();
    } else if (this.activeGame === 'alula') {
      this.spawnAlulaBalloon(x, y);
    } else if (this.activeGame === 'hail') {
      this.hailState.cupsPoured++;
      sound.playBrassDallahResonance();
    }
  }

  // Draw authentic photo cover helper
  drawPhotoBackdrop(ctx, w, h, imgKey, vignette = true) {
    const img = this.images[imgKey];
    if (img && img.complete && img.naturalWidth > 0) {
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const boxAspect = w / h;
      let dw, dh, dx, dy;
      if (imgAspect > boxAspect) {
        dh = h;
        dw = h * imgAspect;
      } else {
        dw = w;
        dh = w / imgAspect;
      }
      dx = (w - dw) / 2;
      dy = (h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);

      if (vignette) {
        const vGrad = ctx.createLinearGradient(0, 0, 0, h);
        vGrad.addColorStop(0, 'rgba(0,0,0,0.3)');
        vGrad.addColorStop(0.7, 'rgba(0,0,0,0.1)');
        vGrad.addColorStop(1, 'rgba(0,0,0,0.65)');
        ctx.fillStyle = vGrad;
        ctx.fillRect(0, 0, w, h);
      }
    } else {
      ctx.fillStyle = '#1b2d20';
      ctx.fillRect(0, 0, w, h);
    }
  }

  /* =========================================================================
     1. TAIF: Real Al-Hada Cable Car climbing through misty peaks
     ========================================================================= */
  initTaif() {
    const s = this.taifState;
    s.altitude = 1000;
    s.carX = 0.12;
    s.carY = 0.72;
    s.speed = 0.8;
    s.rosesCollected = 0;
    s.reachedSummit = false;
    s.rosePickups = [];
    for (let j = 0; j < 8; j++) {
      const p = (j + 1) / 9;
      s.rosePickups.push({
        x: this.w * (0.12 + p * 0.72),
        y: this.h * (0.72 - p * 0.52),
        collected: false
      });
    }
  }

  renderTaif(ctx, w, h) {
    // 1. Real photo of Taif Al-Hada cliffs
    this.drawPhotoBackdrop(ctx, w, h, 'taif');

    const s = this.taifState;
    if (!s.reachedSummit) {
      s.carX += 0.0006 * s.speed;
      s.carY -= 0.00043 * s.speed;
      const p = Math.min(1, (s.carX - 0.12) / 0.72);
      s.altitude = Math.floor(1000 + p * 1100);
      if (s.speed > 0.8) s.speed -= 0.01;

      // Check rose collection
      const carPxX = s.carX * w;
      const carPxY = s.carY * h;
      s.rosePickups.forEach(rp => {
        if (!rp.collected && Math.hypot(rp.x - carPxX, rp.y - carPxY) < 38) {
          rp.collected = true;
          s.rosesCollected++;
          sound.playFinjanClink();
        }
      });

      if (p >= 1) {
        s.reachedSummit = true;
        sound.playBrassDallahResonance();
      }
    }

    // Heavy Cable Car Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.05, h * 0.78);
    ctx.lineTo(w * 0.92, h * 0.20);
    ctx.stroke();

    // Floating Rose Pickups
    s.rosePickups.forEach(rp => {
      if (!rp.collected) {
        ctx.save();
        ctx.translate(rp.x, rp.y);
        ctx.shadowColor = 'rgba(233, 30, 99, 0.9)';
        ctx.shadowBlur = 12;
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🌸', 0, 0);
        ctx.restore();
      }
    });

    // Cable Car Cabin
    const cx = s.carX * w;
    const cy = s.carY * h;
    ctx.save();
    ctx.translate(cx, cy);
    const sway = Math.sin(this.time * 4) * 0.04;
    ctx.rotate(sway);

    // Hanger Arm
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // Red Cabin Body
    ctx.fillStyle = '#d32f2f';
    ctx.beginPath();
    ctx.roundRect(-24, 0, 48, 36, 6);
    ctx.fill();
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(-22, 0, 44, 4);

    // Glass Window
    ctx.fillStyle = 'rgba(225, 245, 254, 0.85)';
    ctx.beginPath();
    ctx.roundRect(-20, 8, 40, 18, 3);
    ctx.fill();
    ctx.restore();

    // Drifting Fog / Mountain Mist
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 4; i++) {
      const fx = ((this.time * 25 + i * 250) % (w + 200)) - 100;
      ctx.beginPath();
      ctx.arc(fx, h * 0.35 + i * 40, 90, 0, Math.PI * 2);
      ctx.fill();
    }

    // HUD Info
    this.drawCityHUD(ctx, w, 'الطائف • تلفريك الهدا', `الارتفاع: ${s.altitude} م ⛰️ | الورد: ${s.rosesCollected}/8 🌸`, '🚡 انقر لزيادة سرعة التلفريك وصعود قمة الهدا');
  }

  /* =========================================================================
     2. RIYADH: Real Masmak & Skyline, Moving Metro, and Fireworks
     ========================================================================= */
  initRiyadh() {
    this.riyadhState.metroX = -180;
    this.riyadhState.fireworks = [];
  }

  triggerRiyadhFirework(x, y) {
    for (let p = 0; p < 24; p++) {
      const angle = (Math.PI * 2 / 24) * p;
      const spd = 2 + Math.random() * 4;
      this.riyadhState.fireworks.push({
        x: x || this.w * 0.5,
        y: y || this.h * 0.3,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color: ['#00e676', '#ffd700', '#ffffff', '#ff9100'][Math.floor(Math.random() * 4)],
        alpha: 1.0
      });
    }
    sound.playFireworksBurst();
  }

  renderRiyadh(ctx, w, h) {
    // 1. Real photograph of Masmak Fortress and Riyadh
    this.drawPhotoBackdrop(ctx, w, h, 'riyadh');

    // 2. Animated Riyadh Metro Train across elevated track
    this.riyadhState.metroX += 2.2;
    if (this.riyadhState.metroX > w + 180) this.riyadhState.metroX = -180;

    const metroY = h * 0.68;
    // Elevated concrete viaduct
    ctx.fillStyle = 'rgba(40, 45, 50, 0.85)';
    ctx.fillRect(0, metroY + 28, w, 12);
    for (let p = 60; p < w; p += 140) {
      ctx.fillRect(p, metroY + 40, 16, h - metroY);
    }

    // Metro Train
    if (this.images.riyadh_metro && this.images.riyadh_metro.complete) {
      ctx.drawImage(this.images.riyadh_metro, this.riyadhState.metroX, metroY - 50, 160, 85);
    }

    // 3. Fireworks
    for (let i = this.riyadhState.fireworks.length - 1; i >= 0; i--) {
      const fw = this.riyadhState.fireworks[i];
      fw.x += fw.vx;
      fw.y += fw.vy;
      fw.vy += 0.05;
      fw.alpha -= 0.024;
      if (fw.alpha <= 0) {
        this.riyadhState.fireworks.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = fw.alpha;
      ctx.fillStyle = fw.color;
      ctx.beginPath();
      ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    this.drawCityHUD(ctx, w, 'الرياض • العاصمة الشامخة', 'بوابة المصمك التراثية ومترو الرياض الحديث 🚇', '🎆 انقر في أي مكان لإطلاق الألعاب النارية الاحتفالية');
  }

  /* =========================================================================
     3. JEDDAH: Real Historic Al-Balad, Glowing Rawashin & Sea Waves
     ========================================================================= */
  initJeddah() {
    this.jeddahState.ripples = [];
  }

  triggerJeddahTap(x, y) {
    this.jeddahState.ripples.push({ x, y, r: 5, alpha: 1.0 });
    sound.playSeaSurf();
  }

  renderJeddah(ctx, w, h) {
    // 1. Real photograph of Al-Balad coral stone mansion
    this.drawPhotoBackdrop(ctx, w, h, 'jeddah');

    // 2. Hanging brass lanterns swaying
    const sway = Math.sin(this.time * 2.5) * 8;
    for (let i = 0; i < 4; i++) {
      const lx = w * 0.2 + i * (w * 0.2);
      const ly = 90;

      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lx, 0);
      ctx.lineTo(lx + sway, ly);
      ctx.stroke();

      // Glowing Lantern
      ctx.fillStyle = '#ffd54f';
      ctx.shadowColor = '#ffd54f';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(lx + sway, ly + 14, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 3. Water Ripples
    for (let r = this.jeddahState.ripples.length - 1; r >= 0; r--) {
      const rp = this.jeddahState.ripples[r];
      rp.r += 1.6;
      rp.alpha -= 0.022;
      if (rp.alpha <= 0) {
        this.jeddahState.ripples.splice(r, 1);
        continue;
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${rp.alpha})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(rp.x, rp.y, rp.r * 2.5, rp.r, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    this.drawCityHUD(ctx, w, 'جدة • عروس البحر الأحمر', 'رواشين البلد التاريخية العريقة ونسيم الشاطئ 🌊', '🏮 انقر لإنارة فوانيس البلد التراثية وتحريك أمواج البحر');
  }

  /* =========================================================================
     4. ASIR: Real Rijal Almaa Stone Palaces & Al-Qatt Al-Asiri
     ========================================================================= */
  initAsir() {
    this.asirState.activePaletteIdx = 0;
  }

  renderAsir(ctx, w, h) {
    // 1. Real photograph of Rijal Almaa stone palaces
    this.drawPhotoBackdrop(ctx, w, h, 'asir');

    // 2. Al-Qatt Al-Asiri Traditional Wall Fresco Band at bottom
    const palettes = [
      ['#e63946', '#ffd166', '#06d6a0', '#118ab2', '#ffffff'],
      ['#ff0054', '#9e0059', '#ff5400', '#ffbd00', '#ffffff'],
      ['#0077b6', '#00b4d8', '#90e0ef', '#ffd166', '#ffffff'],
      ['#2d6a4f', '#52b788', '#d8f3dc', '#d4af37', '#ffffff']
    ];
    const pal = palettes[this.asirState.activePaletteIdx % palettes.length];

    const triW = 38;
    const count = Math.ceil(w / triW);
    const baseY = h - 15;
    for (let t = 0; t < count; t++) {
      ctx.fillStyle = pal[t % pal.length];
      ctx.beginPath();
      ctx.moveTo(t * triW, baseY);
      ctx.lineTo(t * triW + triW / 2, baseY - 42);
      ctx.lineTo((t + 1) * triW, baseY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.stroke();
    }

    this.drawCityHUD(ctx, w, 'عسير • قصور رجال ألمع', 'العمارة الحجرية الأسطورية ونقوش القط العسيري المدرجة باليونسكو 🎨', '🎨 انقر لتغيير ألوان وزخارف القط العسيري التراثية');
  }

  /* =========================================================================
     5. AL-AHSA: Real Date Palm Sea, Springs & Falling Dates Harvest
     ========================================================================= */
  initAhsa() {
    this.ahsaState.datesCaught = 0;
    this.ahsaState.fallingDates = [];
    this.ahsaState.ripples = [];
  }

  spawnAhsaDate() {
    this.ahsaState.fallingDates.push({
      x: Math.random() * (this.w * 0.8) + this.w * 0.1,
      y: 80,
      vy: 2.5 + Math.random() * 2
    });
  }

  renderAhsa(ctx, w, h) {
    // 1. Real photograph of Al-Ahsa date palm oasis
    this.drawPhotoBackdrop(ctx, w, h, 'ahsa');

    // 2. Falling Dates to catch
    if (Math.random() < 0.035) this.spawnAhsaDate();

    for (let d = this.ahsaState.fallingDates.length - 1; d >= 0; d--) {
      const dt = this.ahsaState.fallingDates[d];
      dt.y += dt.vy;
      ctx.save();
      ctx.translate(dt.x, dt.y);
      ctx.fillStyle = '#4a2810'; // Amber ripe Khalas date
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 13, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (dt.y > h - 40) {
        this.ahsaState.datesCaught++;
        this.ahsaState.fallingDates.splice(d, 1);
      }
    }

    // 3. Water ripples in the natural spring
    for (let r = this.ahsaState.ripples.length - 1; r >= 0; r--) {
      const rp = this.ahsaState.ripples[r];
      rp.r += 1.8;
      rp.alpha -= 0.025;
      if (rp.alpha <= 0) {
        this.ahsaState.ripples.splice(r, 1);
        continue;
      }
      ctx.strokeStyle = `rgba(180, 240, 210, ${rp.alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(rp.x, rp.y, rp.r * 2.2, rp.r, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    this.drawCityHUD(ctx, w, 'الأحساء • أكبر واحة نخيل في العالم', `تمر الإخلاص الحساوي المجموع: ${this.ahsaState.datesCaught} 🌴`, '🌴 انقر في أي مكان لتحريك عيون الماء وجني التمور');
  }

  /* =========================================================================
     6. ALULA: Real Hegra Rock-cut Facade & Hot Air Balloons
     ========================================================================= */
  initAlula() {
    this.alulaState.balloons = [
      { x: this.w * 0.25, y: this.h * 0.45, color: '#e65100', size: 38, speedY: -0.3 },
      { x: this.w * 0.72, y: this.h * 0.35, color: '#00897b', size: 48, speedY: -0.2 }
    ];
  }

  spawnAlulaBalloon(x, y) {
    const colors = ['#e65100', '#00897b', '#8e24aa', '#d81b60', '#fbc02d'];
    this.alulaState.balloons.push({
      x: x || Math.random() * this.w,
      y: y || this.h * 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 35 + Math.random() * 20,
      speedY: -0.4 - Math.random() * 0.4
    });
  }

  renderAlula(ctx, w, h) {
    // 1. Real photograph of Hegra tomb in AlUla
    this.drawPhotoBackdrop(ctx, w, h, 'alula');

    // 2. Hot Air Balloons floating peacefully
    this.alulaState.balloons.forEach(b => {
      b.y += b.speedY;
      if (b.y < -80) b.y = h + 80;

      ctx.save();
      ctx.translate(b.x, b.y);

      // Balloon envelope
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(0, -b.size * 0.4, b.size * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Inverted cone to basket
      ctx.beginPath();
      ctx.moveTo(-b.size * 0.4, -b.size * 0.3);
      ctx.lineTo(-b.size * 0.15, b.size * 0.35);
      ctx.lineTo(b.size * 0.15, b.size * 0.35);
      ctx.lineTo(b.size * 0.4, -b.size * 0.3);
      ctx.closePath();
      ctx.fill();

      // Wicker Basket
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(-b.size * 0.12, b.size * 0.45, b.size * 0.24, b.size * 0.18);
      ctx.restore();
    });

    this.drawCityHUD(ctx, w, 'العلا • متحف العالم المفتوح', 'مدائن صالح (الحِجر) أول موقع سعودي باليونسكو 🎈', '🎈 انقر لإطلاق مناطيد سماء العلا الملونة فوق الآثار');
  }

  /* =========================================================================
     7. HAIL: Real Jubbah & Campfire under Stars
     ========================================================================= */
  initHail() {
    this.hailState.cupsPoured = 0;
    this.hailState.sparks = [];
  }

  renderHail(ctx, w, h) {
    // 1. Real photograph of Hail Jubbah & Mountains
    this.drawPhotoBackdrop(ctx, w, h, 'hail');

    // 2. Crackling Campfire Sparks
    if (Math.random() < 0.3) {
      this.hailState.sparks.push({
        x: w * 0.5 + (Math.random() - 0.5) * 30,
        y: h * 0.85,
        vx: (Math.random() - 0.5) * 2,
        vy: -2.5 - Math.random() * 3,
        alpha: 1
      });
    }

    for (let s = this.hailState.sparks.length - 1; s >= 0; s--) {
      const sp = this.hailState.sparks[s];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.alpha -= 0.03;
      if (sp.alpha <= 0) {
        this.hailState.sparks.splice(s, 1);
        continue;
      }
      ctx.fillStyle = '#ffa726';
      ctx.globalAlpha = sp.alpha;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // 3. Campfire Glow
    const fGlow = ctx.createRadialGradient(w * 0.5, h * 0.86, 5, w * 0.5, h * 0.86, 75);
    fGlow.addColorStop(0, 'rgba(255, 167, 38, 0.7)');
    fGlow.addColorStop(1, 'rgba(255, 167, 38, 0)');
    ctx.fillStyle = fGlow;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.86, 75, 0, Math.PI * 2);
    ctx.fill();

    this.drawCityHUD(ctx, w, 'حائل • ديار حاتم الطائي', `فناجيل القهوة المصبوبة: ${this.hailState.cupsPoured} ☕ | شبة النار`, '🔥 انقر لصب الفنجال وإيقاد نار الكرم الحائلي');
  }

  renderGenericCity(ctx, w, h) {
    this.drawPhotoBackdrop(ctx, w, h, 'jazan');
    this.drawCityHUD(ctx, w, 'جازان • جزر فرسان الفيروزية', 'شواطئ المرجان الخلابة وأطواق الفل العطري 🌸', ' انقر في أي مكان للاستمتاع بجمال الجزيرة');
  }

  // Universal Sleek HUD
  drawCityHUD(ctx, w, title, subtitle, hint) {
    ctx.save();
    // Top Floating Pill
    const cardW = Math.min(520, w * 0.88);
    const cardX = (w - cardW) / 2;

    ctx.fillStyle = 'rgba(15, 25, 20, 0.82)';
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cardX, 18, cardW, 68, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 17px "Tajawal", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, w * 0.5, 42);

    ctx.fillStyle = '#ffffff';
    ctx.font = '13px "Tajawal", sans-serif';
    ctx.fillText(subtitle, w * 0.5, 68);

    // Bottom Hint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 14px "Tajawal", sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 8;
    ctx.fillText(hint, w * 0.5, this.h - 25);

    ctx.restore();
  }
}
