/**
 * journey.js - المسار السينمائي المستوحى من اللوحات والرموز الثقافية اليدوية
 * يستخدم اللوحة البانورامية الأصلية والمجسمات والرموز المرسومة يدوياً (النخلة، بوابة الدرعية، الصقر، الأبراج، العلم...)
 */

import { sound } from './audioEngine.js';

export class SaudiMasterJourney {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.progress = 0; // 0.00 to 1.00
    this.isAutoPlaying = true;
    this.autoSpeed = 0.00038; // Smooth contemplation speed
    this.time = 0;
    this.flagPhase = 0;

    // Preload Artwork and Hand-drawn Motifs
    this.assets = {};
    this.assetsLoaded = false;
    this.loadAssets();

    // Floating desert dust particles
    this.particles = [];
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        size: 1 + Math.random() * 2.2,
        speed: 0.3 + Math.random() * 0.7,
        alpha: 0.3 + Math.random() * 0.5
      });
    }

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    this.resize();

    // Sound unlock on interaction
    const unlock = () => {
      sound.resumeAudio();
      sound.startAmbientWind();
      sound.playTrack('anthem');
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  loadAssets() {
    const list = {
      panorama: 'assets/images/opening.jpg',
      palm: 'assets/motifs/palm.png',
      diriyah_gate: 'assets/motifs/diriyah_gate.png',
      falcon_tower: 'assets/motifs/falcon_tower.png',
      swords: 'assets/motifs/swords.png',
      daff_player: 'assets/motifs/daff_player.png',
      kingdom_tower: 'assets/motifs/kingdom_tower.png',
      kafd_skylines: 'assets/motifs/kafd_skylines.png',
      khobar_tower: 'assets/motifs/khobar_tower.png',
      mabkhara: 'assets/motifs/mabkhara.png',
      tea_kettle: 'assets/motifs/tea_kettle.png',
      rose_basket: 'assets/motifs/rose_basket.png',
      rowshan: 'assets/motifs/rowshan.png'
    };

    let loaded = 0;
    const total = Object.keys(list).length;

    Object.entries(list).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.assets[key] = img;
        loaded++;
        if (loaded >= total) {
          this.assetsLoaded = true;
        }
      };
      img.onerror = () => {
        loaded++;
        if (loaded >= total) this.assetsLoaded = true;
      };
    });
  }

  resize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
  }

  animate() {
    this.time += 0.016;
    this.flagPhase += 0.045;

    if (this.isAutoPlaying && this.progress < 1.0) {
      this.progress += this.autoSpeed;
      if (this.progress > 1.0) this.progress = 1.0;
    }

    this.render();
    requestAnimationFrame(this.animate);
  }

  render() {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;
    const p = this.progress;

    ctx.clearRect(0, 0, w, h);

    // 01 to 02: Camera forward motion zoom factor
    // As progress advances from 0.12 to 0.50, camera enters into the landscape
    const camZoom = 1 + Math.min(0.65, p * 0.9);
    // Camera pan towards right then center
    const panX = p * (w * 0.12);
    // High altitude pullBack at the end for the map
    const pullBack = p > 0.84 ? (p - 0.84) / 0.16 : 0;

    ctx.save();

    if (pullBack > 0) {
      // Camera ascends high into the sky for the map
      const mapScale = 1 - pullBack * 0.5;
      ctx.translate(w / 2, h / 2);
      ctx.scale(mapScale, mapScale);
      ctx.translate(-w / 2, -h / 2);
    }

    // 1. BASE HAND-PAINTED WATERCOLOR DESERT HORIZON
    this.renderWatercolorLandscape(ctx, camZoom, panX, w, h);

    // 2. THE PATH (طريق النخيل) UNVEILS IN THE SAND
    this.renderDesertPath(ctx, p, w, h);

    // 3. THE SACRED PALM WITNESS (النخلة الشاهدة على الزمن)
    this.renderPalmWitness(ctx, p, w, h);

    // 4. HISTORICAL SETTLEMENTS & ARCHITECTURE (1727 → 1818 → 1824 → 1891 → 1902 → 1932)
    this.renderHistoricalEvolution(ctx, p, w, h);

    // 5. THE WAVING SAUDI FLAG (العلم السعودي يتحرك مع الرياح)
    if (pullBack < 0.9) {
      this.renderRealisticSaudiFlag(ctx, p, w, h);
    }

    // 6. FOREGROUND PALM FRONDS PASSING CLOSE TO CAMERA (02)
    if (p >= 0.14 && p <= 0.32) {
      this.renderForegroundPassingFronds(ctx, p, w, h);
    }

    // 7. FLOATING DESERT DUST & MORNING LIGHT
    this.renderDust(ctx, w, h);

    ctx.restore();

    // 8. HIGH MAP OVERLAY (07)
    if (pullBack > 0.15) {
      this.renderInteractiveSaudiMap(ctx, pullBack, w, h);
    }

    // 9. IN-WORLD TYPOGRAPHY & CALLIGRAPHY
    this.renderInWorldTypography(ctx, p, pullBack, w, h);
  }

  /**
   * 1. HAND-PAINTED WATERCOLOR PANORAMIC DESERT LANDSCAPE
   */
  renderWatercolorLandscape(ctx, zoom, panX, w, h) {
    const bg = this.assets.panorama;
    if (bg && bg.complete && bg.naturalWidth > 0) {
      ctx.save();
      // Draw background image scaled with cinematic camera push
      const imgRatio = bg.naturalWidth / bg.naturalHeight;
      const screenRatio = w / h;

      let drawW, drawH, drawX, drawY;
      if (screenRatio > imgRatio) {
        drawW = w * zoom;
        drawH = (w / imgRatio) * zoom;
      } else {
        drawH = h * zoom;
        drawW = (h * imgRatio) * zoom;
      }

      drawX = (w - drawW) / 2 - panX;
      drawY = (h - drawH) / 2;

      ctx.drawImage(bg, drawX, drawY, drawW, drawH);

      // Light morning warm tint wash to ensure radiant sunrise atmosphere
      ctx.fillStyle = 'rgba(253, 251, 247, 0.12)';
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    } else {
      // Elegant fallback morning watercolor gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#fdfbf7');
      skyGrad.addColorStop(0.4, '#f7eee0');
      skyGrad.addColorStop(0.75, '#ebd7b7');
      skyGrad.addColorStop(1, '#cda168');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);
    }
  }

  /**
   * 2. THE PATH IN THE SAND (طريق النخيل)
   */
  renderDesertPath(ctx, p, w, h) {
    if (p < 0.10) return;
    const pathAlpha = Math.min(1, (p - 0.10) / 0.14);

    ctx.save();
    ctx.globalAlpha = pathAlpha * 0.75;

    // Organic sand path winding into the oasis
    const pathGrad = ctx.createLinearGradient(0, h * 0.6, 0, h);
    pathGrad.addColorStop(0, 'rgba(215, 172, 115, 0.2)');
    pathGrad.addColorStop(1, 'rgba(168, 122, 68, 0.65)');
    ctx.fillStyle = pathGrad;

    ctx.beginPath();
    ctx.moveTo(w * 0.52, h * 0.58);
    ctx.bezierCurveTo(w * 0.48, h * 0.68, w * 0.42, h * 0.85, w * 0.35, h);
    ctx.lineTo(w * 0.68, h);
    ctx.bezierCurveTo(w * 0.58, h * 0.85, w * 0.55, h * 0.68, w * 0.54, h * 0.58);
    ctx.closePath();
    ctx.fill();

    // Subtle footsteps in the sand
    ctx.fillStyle = 'rgba(110, 75, 40, 0.3)';
    for (let i = 1; i <= 7; i++) {
      const t = i / 8;
      const stepY = h * 0.62 + t * (h * 0.35);
      const stepX = w * 0.52 - t * 40 + (i % 2) * 20;
      ctx.beginPath();
      ctx.ellipse(stepX, stepY, 4 + t * 6, 2 + t * 3, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * 3. THE SACRED PALM WITNESS (النخلة الشاهدة على الزمن)
   * Remains steadfast at the same coordinates across all eras
   */
  renderPalmWitness(ctx, p, w, h) {
    const palmImg = this.assets.palm;
    const palmX = w * 0.14;
    const palmY = h * 0.52;
    const palmH = Math.min(360, h * 0.52);
    const palmW = palmH * 0.58;

    ctx.save();
    if (palmImg && palmImg.complete && palmImg.naturalWidth > 0) {
      // Golden spiritual aura around the witness palm
      const halo = ctx.createRadialGradient(palmX + palmW * 0.5, palmY + palmH * 0.3, 20, palmX + palmW * 0.5, palmY + palmH * 0.3, palmW * 1.1);
      halo.addColorStop(0, 'rgba(220, 161, 13, 0.22)');
      halo.addColorStop(1, 'rgba(220, 161, 13, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(palmX - 40, palmY - 40, palmW + 80, palmH + 80);

      // Draw the handcrafted palm sprite from user's motifs sheet
      ctx.drawImage(palmImg, palmX, palmY, palmW, palmH);
    } else {
      // Fallback palm
      ctx.fillStyle = '#1b5333';
      ctx.fillRect(palmX + 20, palmY + 60, 14, palmH - 60);
    }
    ctx.restore();
  }

  /**
   * 4 & 5. HISTORICAL ARCHITECTURE EVOLUTION (1727 → 1902 → 1932 → 2026)
   */
  renderHistoricalEvolution(ctx, p, w, h) {
    if (p < 0.25) return;

    // 1727 - 1824: Diriyah Mudbrick Gate & Falcon Watchtower
    if (p < 0.44) {
      const gate = this.assets.diriyah_gate;
      const falcon = this.assets.falcon_tower;

      if (gate && gate.complete) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (p - 0.25) / 0.08);
        const gH = Math.min(220, h * 0.34);
        const gW = gH * 0.68;
        ctx.drawImage(gate, w * 0.62, h * 0.58, gW, gH);
        ctx.restore();
      }

      if (falcon && falcon.complete) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (p - 0.25) / 0.08);
        const fH = Math.min(180, h * 0.28);
        const fW = fH * 0.64;
        ctx.drawImage(falcon, w * 0.78, h * 0.54, fW, fH);
        ctx.restore();
      }
    }

    // 1902: Al-Masmak Fortress, Swords of Victory, recovery of Riyadh
    else if (p < 0.58) {
      const swords = this.assets.swords;
      const kettle = this.assets.tea_kettle;

      if (swords && swords.complete) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (p - 0.44) / 0.08);
        const sW = Math.min(180, w * 0.20);
        const sH = sW * 0.68;
        ctx.drawImage(swords, w * 0.68, h * 0.52, sW, sH);
        ctx.restore();
      }

      if (kettle && kettle.complete) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (p - 0.44) / 0.08);
        const kW = Math.min(110, w * 0.12);
        const kH = kW * 0.88;
        ctx.drawImage(kettle, w * 0.56, h * 0.72, kW, kH);
        ctx.restore();
      }
    }

    // 1932: Unification of the Kingdom, Daff Drummer
    else if (p < 0.72) {
      const daff = this.assets.daff_player;
      if (daff && daff.complete) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (p - 0.58) / 0.08);
        const dH = Math.min(240, h * 0.38);
        const dW = dH * 0.72;
        ctx.drawImage(daff, w * 0.64, h * 0.55, dW, dH);
        ctx.restore();
      }
    }

    // Modern Development & 2026: KAFD Skylines & Kingdom Tower
    else if (p < 0.86) {
      const kingdom = this.assets.kingdom_tower;
      const kafd = this.assets.kafd_skylines;
      const khobar = this.assets.khobar_tower;
      const mabkhara = this.assets.mabkhara;

      if (kingdom && kingdom.complete) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (p - 0.72) / 0.08);
        const kH = Math.min(320, h * 0.48);
        const kW = kH * 0.36;
        ctx.drawImage(kingdom, w * 0.52, h * 0.44, kW, kH);
        ctx.restore();
      }

      if (kafd && kafd.complete) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (p - 0.72) / 0.08);
        const kfH = Math.min(300, h * 0.46);
        const kfW = kfH * 0.63;
        ctx.drawImage(kafd, w * 0.68, h * 0.46, kfW, kfH);
        ctx.restore();
      }

      if (khobar && khobar.complete) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (p - 0.72) / 0.08);
        const kbH = Math.min(240, h * 0.36);
        const kbW = kbH * 0.62;
        ctx.drawImage(khobar, w * 0.38, h * 0.54, kbW, kbH);
        ctx.restore();
      }

      if (mabkhara && mabkhara.complete) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (p - 0.72) / 0.08);
        const mH = Math.min(140, h * 0.22);
        const mW = mH * 0.64;
        ctx.drawImage(mabkhara, w * 0.85, h * 0.68, mW, mH);
        ctx.restore();
      }
    }
  }

  /**
   * 5. REALISTIC SAUDI FLAG (العلم السعودي)
   * Moves naturally with realistic cloth wave physics
   */
  renderRealisticSaudiFlag(ctx, p, w, h) {
    ctx.save();

    // Flag position
    const flagX = w * 0.78;
    const flagY = h * 0.34;
    const poleH = Math.min(280, h * 0.44);
    const flagW = Math.min(140, w * 0.16);
    const flagH = flagW * 0.66;

    // Pole
    ctx.strokeStyle = '#b89052';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(flagX, flagY + poleH);
    ctx.lineTo(flagX, flagY);
    ctx.stroke();

    // Golden tip
    ctx.fillStyle = '#dca10d';
    ctx.beginPath();
    ctx.arc(flagX, flagY - 2, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Flag cloth with sine wave vertex ripples
    const strips = 28;
    const stripW = flagW / strips;
    const phase = this.flagPhase;

    ctx.translate(flagX, flagY);

    for (let i = 0; i < strips; i++) {
      const x1 = i * stripW;
      const x2 = (i + 1) * stripW;
      const wave = (i / strips) * 9.0;
      const y1 = Math.sin(phase + i * 0.28) * wave;
      const y2 = Math.sin(phase + (i + 1) * 0.28) * (wave + 0.3);

      const light = 0.85 + Math.cos(phase + i * 0.28) * 0.18;
      const r = Math.round(27 * light);
      const g = Math.round(83 * light);
      const b = Math.round(51 * light);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x2, y2 + flagH);
      ctx.lineTo(x1, y1 + flagH);
      ctx.closePath();
      ctx.fill();
    }

    // Shahada & Sword inscription
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2.4;
    const midWave = Math.sin(phase + 2) * 5;
    ctx.beginPath();
    ctx.moveTo(flagW * 0.22, flagH * 0.42 + midWave);
    ctx.lineTo(flagW * 0.74, flagH * 0.42 + midWave);
    ctx.moveTo(flagW * 0.26, flagH * 0.62 + midWave);
    ctx.lineTo(flagW * 0.70, flagH * 0.62 + midWave);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * 6. FOREGROUND FRONDS PASSING (02)
   */
  renderForegroundPassingFronds(ctx, p, w, h) {
    const alpha = Math.sin(((p - 0.14) / 0.18) * Math.PI);
    ctx.save();
    ctx.globalAlpha = alpha * 0.9;
    ctx.strokeStyle = '#1b5333';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(w * 0.2, h * 0.18, w * 0.38, 0);
    ctx.stroke();

    // Leaflets
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#27784a';
    for (let i = 24; i < w * 0.36; i += 26) {
      ctx.beginPath();
      ctx.moveTo(i, 20);
      ctx.lineTo(i + 30, 95);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * 7. SAUDI MAP OVERLAY REVEAL (07)
   */
  renderInteractiveSaudiMap(ctx, pullBack, w, h) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, pullBack * 1.5);

    const mapCX = w * 0.5;
    const mapCY = h * 0.52;
    const radius = Math.min(w * 0.36, h * 0.36);

    const cities = [
      { name: 'الرياض', x: mapCX + radius * 0.08, y: mapCY - radius * 0.04 },
      { name: 'جدة', x: mapCX - radius * 0.44, y: mapCY + radius * 0.14 },
      { name: 'مكة المكرمة', x: mapCX - radius * 0.38, y: mapCY + radius * 0.20 },
      { name: 'المدينة المنورة', x: mapCX - radius * 0.42, y: mapCY - radius * 0.14 },
      { name: 'الطائف', x: mapCX - radius * 0.32, y: mapCY + radius * 0.24 },
      { name: 'حائل', x: mapCX - radius * 0.16, y: mapCY - radius * 0.42 },
      { name: 'الشرقية', x: mapCX + radius * 0.46, y: mapCY - radius * 0.10 },
      { name: 'عسير والجنوب', x: mapCX - radius * 0.22, y: mapCY + radius * 0.44 }
    ];

    cities.forEach(c => {
      // Beacon
      ctx.fillStyle = '#1b5333';
      ctx.beginPath();
      ctx.arc(c.x, c.y, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Ripple ring
      ctx.strokeStyle = '#dca10d';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
      ctx.stroke();

      // Text
      ctx.fillStyle = '#171310';
      ctx.font = 'bold 15px "Reem Kufi", sans-serif';
      ctx.fillText(c.name, c.x + 18, c.y + 5);
    });

    ctx.restore();
  }

  /**
   * IN-WORLD ATMOSPHERIC TYPOGRAPHY
   */
  renderInWorldTypography(ctx, p, pullBack, w, h) {
    ctx.save();
    ctx.textAlign = 'center';

    if (p < 0.14) {
      // 01: OPENING TITLE 96
      ctx.fillStyle = '#171310';
      ctx.font = 'bold clamp(24px, 4.5vw, 44px) "Reem Kufi", sans-serif';
      ctx.fillText('اليوم الوطني السعودي', w * 0.38, h * 0.36);

      ctx.fillStyle = '#1b5333';
      ctx.font = 'bold clamp(76px, 13vw, 140px) "Aref Ruqaa", serif';
      ctx.fillText('٩٦', w * 0.38, h * 0.52);

      ctx.fillStyle = '#a67c3b';
      ctx.font = 'italic clamp(16px, 2.6vw, 24px) "Amiri", serif';
      ctx.fillText('صوتٌ قادم من أعماق الصحراء والذاكرة...', w * 0.38, h * 0.60);
    } else if (p < 0.28) {
      // 02: THE PALM PATH
      ctx.fillStyle = '#1b5333';
      ctx.font = 'bold clamp(22px, 4vw, 36px) "Reem Kufi", sans-serif';
      ctx.fillText('طريق النخيل وعبق الذاكرة', w * 0.5, h * 0.22);
    } else if (p < 0.42) {
      // 1727: First Saudi State
      ctx.fillStyle = '#dca10d';
      ctx.font = 'bold clamp(48px, 8vw, 84px) "Aref Ruqaa", serif';
      ctx.fillText('١٧٢٧', w * 0.5, h * 0.22);
      ctx.fillStyle = '#2b2118';
      ctx.font = 'bold 20px "Amiri", serif';
      ctx.fillText('يوم التأسيس — بداية الدولة السعودية الأولى في الدرعية', w * 0.5, h * 0.27);
    } else if (p < 0.56) {
      // 1902: Recovery of Riyadh
      ctx.fillStyle = '#dca10d';
      ctx.font = 'bold clamp(48px, 8vw, 84px) "Aref Ruqaa", serif';
      ctx.fillText('١٩٠٢', w * 0.5, h * 0.22);
      ctx.fillStyle = '#2b2118';
      ctx.font = 'bold 20px "Amiri", serif';
      ctx.fillText('استرداد الرياض — فجرٌ جديد على أسوار المصمك', w * 0.5, h * 0.27);
    } else if (p < 0.70) {
      // 1932: Unification
      ctx.fillStyle = '#1b5333';
      ctx.font = 'bold clamp(48px, 8vw, 84px) "Aref Ruqaa", serif';
      ctx.fillText('١٩٣٢', w * 0.5, h * 0.22);
      ctx.fillStyle = '#2b2118';
      ctx.font = 'bold 20px "Amiri", serif';
      ctx.fillText('توحيد المملكة العربية السعودية تحت راية واحدة', w * 0.5, h * 0.27);
    } else if (p < 0.86) {
      // 2026: Modern & Digital Transformation
      ctx.fillStyle = '#1b5333';
      ctx.font = 'bold clamp(44px, 7.5vw, 76px) "Aref Ruqaa", serif';
      ctx.fillText('السعودية — ٢٠٢٦', w * 0.5, h * 0.22);
      ctx.fillStyle = '#5c4832';
      ctx.font = 'bold 19px "Amiri", serif';
      ctx.fillText('طموحٌ يعانق عنان السماء.. والعهد باقٍ', w * 0.5, h * 0.27);
    } else {
      // 07: Map Reveal
      ctx.fillStyle = '#171310';
      ctx.font = 'bold clamp(24px, 4vw, 36px) "Reem Kufi", sans-serif';
      ctx.fillText('خريطة المملكة العربية السعودية', w * 0.5, h * 0.16);
      ctx.fillStyle = '#1b5333';
      ctx.font = '18px "Tajawal", sans-serif';
      ctx.fillText('عالمٌ حي يربط تضاريس الوطن بمدنه وموروثه', w * 0.5, h * 0.20);
    }

    ctx.restore();
  }

  renderDust(ctx, w, h) {
    ctx.save();
    ctx.fillStyle = 'rgba(218, 165, 32, 0.45)';
    this.particles.forEach(pt => {
      pt.x += pt.speed;
      pt.y -= pt.speed * 0.25;
      if (pt.x > w) pt.x = 0;
      if (pt.y < 0) pt.y = h;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
}
