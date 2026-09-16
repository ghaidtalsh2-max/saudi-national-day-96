/**
 * highwayCinema.js - المشهد السينمائي لطريق النخيل والسيارة الكلاسيكية الخضراء
 * - شمس الصباح المشرقة وأفق صحراوي مفتوح
 * - انفراج ستارة النخيل يميناً ويساراً كأنه مسار ينشق ليكشف طريق الأسفلت الممتد في الصحراء
 * - منظور السائق من داخل سيارة كلاسيكية خضراء بمقدمتها الأنيقة واهتزازات حقيقية للمقصورة
 * - خيول أصيلة تعدو، قوافل جمال، حقول خزامى بنفسجية وورد طائفي، صقور في السماء
 */

import { sound } from './audioEngine.js';

export class HighwayCinema {
  constructor(canvas, onComplete) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onComplete = onComplete;

    this.w = canvas.width = window.innerWidth;
    this.h = canvas.height = window.innerHeight;

    this.time = 0;
    this.journeyTime = 0;
    this.speed = 1.0;
    this.roadOffset = 0;
    this.curtainProgress = 0; // 0 to 1
    this.isRunning = false;
    this.animationFrameId = null;

    // Preload collage assets for progressive architecture, nature, and royal leaders
    this.royalLeadersImg = new Image();
    this.royalLeadersImg.src = 'assets/images/royal_leaders.jpg';

    this.palmSingleImg = new Image();
    this.palmSingleImg.src = 'assets/images/collage_elements/art_palm_single.png';

    this.palmTrioImg = new Image();
    this.palmTrioImg.src = 'assets/images/collage_elements/art_palm_trio.png';

    this.camelImg = new Image();
    this.camelImg.src = 'assets/images/collage_elements/art_camel.png';

    this.metroImg = new Image();
    this.metroImg.src = 'assets/images/collage_elements/art_riyadh_metro.jpg';

    this.baladImg = new Image();
    this.baladImg.src = 'assets/images/collage_elements/art_balad_mansion.jpg';

    this.cityUnifiedImg = new Image();
    this.cityUnifiedImg.src = 'assets/images/collage_elements/unified_saudi_skyline.png';

    this.allLandmarksImg = new Image();
    this.allLandmarksImg.src = 'assets/images/collage_elements/art_saudi_landmarks_montage.jpg';

    // Cockpit bobbing physics
    this.bobY = 0;
    this.bobRot = 0;

    // Particles: Rose & Lavender Petals
    this.petals = [];
    for (let i = 0; i < 45; i++) {
      this.petals.push(this.createPetal(true));
    }

    // Galloping Horses
    this.horses = [
      { x: -0.32, distance: 0.82, phase: 0, speed: 0.008 },
      { x: -0.48, distance: 0.62, phase: 1.5, speed: 0.007 }
    ];

    // Camels in the dunes
    this.camels = [
      { x: 0.52, distance: 0.45, phase: 0 },
      { x: 0.75, distance: 0.38, phase: 2 }
    ];

    // Soaring Falcons
    this.falcons = [
      { x: 0.22, y: 0.2, size: 30, wingPhase: 0, speedX: 0.0006 },
      { x: -0.28, y: 0.15, size: 24, wingPhase: 2.1, speedX: -0.0005 }
    ];

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
  }

  createPetal(randomY = false) {
    return {
      x: (Math.random() - 0.5) * this.w * 1.2,
      y: randomY ? Math.random() * this.h : -20,
      size: 5 + Math.random() * 8,
      speedY: 2.5 + Math.random() * 3.5,
      speedX: (Math.random() - 0.5) * 2.8,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      isLavender: Math.random() > 0.45
    };
  }

  resize() {
    this.w = this.canvas.width = window.innerWidth;
    this.h = this.canvas.height = window.innerHeight;
  }

  start() {
    this.resize();
    this.isRunning = true;
    this.time = 0;
    this.journeyTime = 0;
    this.curtainProgress = 0;
    this.animate = this.animate.bind(this);
    this.animate();

    sound.startAmbientWind();

    // 16 seconds journey seamlessly dissolving into history timeline
    this.autoTimer = setTimeout(() => {
      if (this.onComplete) this.onComplete();
    }, 16000);
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.autoTimer) clearTimeout(this.autoTimer);
  }

  animate() {
    if (!this.isRunning) return;
    this.animationFrameId = requestAnimationFrame(this.animate);

    this.time += 0.016;
    this.journeyTime += 0.016;
    this.roadOffset = (this.roadOffset + 9.5) % 80;

    // Smooth parting of the palm curtain
    if (this.curtainProgress < 1) {
      this.curtainProgress += 0.005;
      if (this.curtainProgress > 1) this.curtainProgress = 1;
    }

    // Cockpit vibration and suspension bobbing
    this.bobY = Math.sin(this.time * 14) * 3.2 + Math.cos(this.time * 22) * 1.8;
    this.bobRot = Math.sin(this.time * 7) * 0.0035;

    this.render();
  }

  render() {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;
    const horizon = h * 0.48;

    ctx.clearRect(0, 0, w, h);

    // 1. Radiant Morning Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
    skyGrad.addColorStop(0, '#5b8fa8'); // morning blue
    skyGrad.addColorStop(0.4, '#a8c5d6');
    skyGrad.addColorStop(0.7, '#fcedd5');
    skyGrad.addColorStop(1, '#e5be8a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, horizon);

    // Radiant Morning Sun Disc
    ctx.save();
    const sunGrad = ctx.createRadialGradient(w * 0.5, horizon * 0.35, 10, w * 0.5, horizon * 0.35, 220);
    sunGrad.addColorStop(0, 'rgba(255, 252, 235, 0.98)');
    sunGrad.addColorStop(0.3, 'rgba(255, 235, 175, 0.6)');
    sunGrad.addColorStop(0.6, 'rgba(255, 215, 140, 0.2)');
    sunGrad.addColorStop(1, 'rgba(255, 205, 130, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(w * 0.5, horizon * 0.35, 220, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Distant Horizon Landmarks (KAFD, Kingdom Centre, Masmak) & Royal Leaders Emergence
    this.drawSkylineAndRoyalLeaders(ctx, w, horizon);

    // 3. Golden Desert Dunes
    this.drawDesertDunes(ctx, w, h, horizon);

    // 4. Soaring Falcons in the Sky
    this.drawFalcons(ctx, w, horizon);

    // 5. Endless Highway Asphalt with perspective
    this.drawHighwayAsphalt(ctx, w, h, horizon);

    // 6. Lavender & Taif Rose fields along road borders
    this.drawFlowersAndFlora(ctx, w, h, horizon);

    // 8. Dense Date Palms Boulevard (طريق النخيل الكثيف من المزرعة للمدينة)
    this.drawDensePalmsBoulevard(ctx, w, h);

    // 9. Realistic Classic Green Car Cockpit with Steering Wheel & Radio
    this.drawClassicCarCockpit(ctx, w, h);

    // 10. Floating Flower Petals (ورد طائفي وخزامى)
    this.drawPetals(ctx, w, h);
  }

  drawSkylineAndRoyalLeaders(ctx, w, horizon) {
    ctx.save();
    const centerX = w * 0.5;

    // Phase 1: Emerging Landmarks along the Highway (4s to 10s)
    if (this.journeyTime >= 3.5) {
      const emergeAlpha = Math.min(1.0, (this.journeyTime - 3.5) / 2.0);
      ctx.save();
      ctx.globalAlpha = emergeAlpha * 0.9;

      // Jeddah Historic Al-Balad Architecture on Left Roadside
      if (this.baladImg && this.baladImg.complete) {
        const bw = 95;
        const bh = 140;
        ctx.drawImage(this.baladImg, centerX - w * 0.38, horizon - bh + 15, bw, bh);
      }

      // Riyadh Metro Elevated Train Viaduct on Right Roadside
      if (this.metroImg && this.metroImg.complete) {
        const mw = 120;
        const mh = 110;
        ctx.drawImage(this.metroImg, centerX + w * 0.26, horizon - mh + 20, mw, mh);
      }

      // Decorated Bedouin Camel by the sand roadside
      if (this.camelImg && this.camelImg.complete) {
        const cw = 75;
        const ch = 65;
        ctx.drawImage(this.camelImg, centerX + w * 0.18, horizon - ch + 35, cw, ch);
      }

      ctx.restore();
    }

    // Phase 2: Full Arrival into the Unified Saudi City (8.5s onwards)
    // المدينة مجمعة كلياً من جميع معالم وعمارات السعودية (الدرعية + الأبراج الحديثة + المعالم التاريخية)
    if (this.journeyTime >= 8.0) {
      const cityAlpha = Math.min(1.0, (this.journeyTime - 8.0) / 3.0);
      ctx.save();
      ctx.globalAlpha = cityAlpha;

      // Panoramic Unified Skyline (Diriyah Fortress + Modern Towers)
      if (this.cityUnifiedImg && this.cityUnifiedImg.complete) {
        const cityW = Math.min(w * 0.88, 1050);
        const cityH = cityW * 0.42;
        const cityX = centerX - cityW / 2;
        const cityY = horizon - cityH + 25;

        // Draw the unified skyline seamlessly over horizon
        ctx.drawImage(this.cityUnifiedImg, cityX, cityY, cityW, cityH);

        // Warm golden atmospheric wash blending the base into desert horizon
        const blendGrad = ctx.createLinearGradient(0, horizon - 40, 0, horizon + 20);
        blendGrad.addColorStop(0, 'rgba(252, 237, 213, 0)');
        blendGrad.addColorStop(1, 'rgba(235, 195, 145, 0.7)');
        ctx.fillStyle = blendGrad;
        ctx.fillRect(cityX, horizon - 40, cityW, 60);
      }

      // Also render watercolor landmarks collage behind in distance if available
      if (this.allLandmarksImg && this.allLandmarksImg.complete && this.journeyTime >= 10.0) {
        const lmAlpha = Math.min(0.85, (this.journeyTime - 10.0) / 2.5);
        ctx.globalAlpha = lmAlpha;
        const lw = 130;
        const lh = 170;
        ctx.drawImage(this.allLandmarksImg, centerX - w * 0.46, horizon - lh + 20, lw, lh);
      }

      ctx.restore();
    }

    // Highway Streetlamp Poles with warm light cones
    for (let lp = -3; lp <= 3; lp++) {
      if (lp === 0) continue;
      const poleSide = lp > 0 ? 1 : -1;
      const poleDist = Math.abs(lp) / 3;
      const poleX = centerX + poleSide * (40 + poleDist * w * 0.38);
      const poleY = horizon + poleDist * 160;
      const poleH = 28 + poleDist * 75;

      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 1.8 + poleDist * 1.8;
      ctx.beginPath();
      ctx.moveTo(poleX, poleY);
      ctx.lineTo(poleX, poleY - poleH);
      ctx.quadraticCurveTo(poleX, poleY - poleH - 12, poleX - poleSide * 16, poleY - poleH - 10);
      ctx.stroke();

      // Lamp glow
      ctx.fillStyle = 'rgba(255, 240, 180, 0.4)';
      ctx.beginPath();
      ctx.arc(poleX - poleSide * 16, poleY - poleH - 10, 5 + poleDist * 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Phase 3: Emergence of Royal Leaders Portrait (King Abdulaziz, King Salman, HRH Crown Prince Mohammed bin Salman)
    // تطلع صورة الملك عبدالعزيز والملك سلمان ومحمد بن سلمان بهالة ذهبية فوق المدينة
    if (this.journeyTime >= 11.5 && this.royalLeadersImg && this.royalLeadersImg.complete) {
      const emergeProgress = Math.min(1.0, (this.journeyTime - 11.5) / 3.2);
      const ease = 1 - Math.pow(1 - emergeProgress, 3);

      const targetY = horizon * 0.38;
      const startY = horizon + 80;
      const curY = startY + (targetY - startY) * ease;
      const curScale = 0.65 + ease * 0.35;
      const curAlpha = Math.min(1.0, (this.journeyTime - 11.5) / 2.0);

      ctx.save();
      ctx.globalAlpha = curAlpha;
      ctx.translate(centerX, curY);
      ctx.scale(curScale, curScale);

      // Golden Celestial Halo behind Royal Leaders
      const haloGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 195);
      haloGrad.addColorStop(0, 'rgba(255, 245, 170, 0.95)');
      haloGrad.addColorStop(0.35, 'rgba(212, 175, 55, 0.55)');
      haloGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 195, 0, Math.PI * 2);
      ctx.fill();

      // Portrait Image with smooth rounded frame
      const pW = 165;
      const pH = 220;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-pW / 2, -pH / 2, pW, pH, 18);
      ctx.clip();
      ctx.drawImage(this.royalLeadersImg, -pW / 2, -pH / 2, pW, pH);
      ctx.restore();

      // Regal Golden Laurel Border
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.roundRect(-pW / 2, -pH / 2, pW, pH, 18);
      ctx.stroke();

      // Royal Title Ribbon
      ctx.fillStyle = 'rgba(20, 45, 30, 0.92)';
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-120, pH / 2 - 10, 240, 34, 17);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 14px "Reem Kufi", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('قادة المجد • عزّنا وفخرنا الدائم 🇸🇦', 0, pH / 2 + 13);

      ctx.restore();
    }

    ctx.restore();

    ctx.restore();
  }

  drawDesertDunes(ctx, w, h, horizon) {
    ctx.save();

    // Back Dunes
    ctx.fillStyle = '#dfc295';
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.quadraticCurveTo(w * 0.25, horizon - 28, w * 0.5, horizon);
    ctx.quadraticCurveTo(w * 0.75, horizon - 32, w, horizon);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    // Front Dunes
    ctx.fillStyle = '#cfad7c';
    ctx.beginPath();
    ctx.moveTo(0, horizon + 12);
    ctx.quadraticCurveTo(w * 0.3, horizon + 48, w * 0.5, horizon + 18);
    ctx.quadraticCurveTo(w * 0.7, horizon + 42, w, horizon + 15);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    ctx.restore();
  }

  drawHighwayAsphalt(ctx, w, h, horizon) {
    ctx.save();
    const centerX = w * 0.5;
    const topWidth = 26;
    const bottomWidth = w * 0.82;

    // Road Asphalt
    const roadGrad = ctx.createLinearGradient(0, horizon, 0, h);
    roadGrad.addColorStop(0, '#424549');
    roadGrad.addColorStop(0.4, '#2d2f33');
    roadGrad.addColorStop(1, '#1a1c1e');

    ctx.fillStyle = roadGrad;
    ctx.beginPath();
    ctx.moveTo(centerX - topWidth, horizon);
    ctx.lineTo(centerX + topWidth, horizon);
    ctx.lineTo(centerX + bottomWidth * 0.5, h);
    ctx.lineTo(centerX - bottomWidth * 0.5, h);
    ctx.closePath();
    ctx.fill();

    // Road Shoulders (Gold Sand curbs)
    ctx.strokeStyle = '#cda250';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(centerX - topWidth, horizon);
    ctx.lineTo(centerX - bottomWidth * 0.5, h);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX + topWidth, horizon);
    ctx.lineTo(centerX + bottomWidth * 0.5, h);
    ctx.stroke();

    // Dashed Center Road Markings
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 4;
    for (let i = 0; i < 9; i++) {
      const p = (i / 9);
      const y1 = horizon + Math.pow(p, 1.8) * (h - horizon);
      const pNext = ((i + 0.5) / 9);
      const y2 = horizon + Math.pow(pNext, 1.8) * (h - horizon);

      ctx.beginPath();
      ctx.moveTo(centerX, y1 + (this.roadOffset * (y2 - y1)) / 80);
      ctx.lineTo(centerX, y2 + (this.roadOffset * (y2 - y1)) / 80);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawHorsesAndCamels(ctx, w, horizon) {
    ctx.save();

    // Arabian Galloping Horses (Left Dunes)
    this.horses.forEach(h => {
      h.phase += 0.18;
      const legSway = Math.sin(h.phase) * 14;

      const px = w * 0.5 + h.x * w;
      const py = horizon + h.distance * 140;

      ctx.save();
      ctx.translate(px, py);
      ctx.scale(0.85, 0.85);

      // Horse Body & Neck (Pure Arabian Horse Silhouette)
      ctx.fillStyle = '#1e140d';
      ctx.beginPath();
      ctx.ellipse(0, 0, 22, 11, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Arched Neck & Head
      ctx.beginPath();
      ctx.moveTo(12, -4);
      ctx.quadraticCurveTo(24, -20, 26, -34);
      ctx.lineTo(32, -32);
      ctx.quadraticCurveTo(22, -10, 18, 5);
      ctx.fill();

      // Galloping Legs
      ctx.strokeStyle = '#1e140d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-10, 8);
      ctx.lineTo(-18 - legSway, 28);
      ctx.moveTo(10, 8);
      ctx.lineTo(20 + legSway, 28);
      ctx.stroke();

      // Flowing Tail
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-20, -2);
      ctx.quadraticCurveTo(-35, 10 + legSway * 0.5, -42, 22);
      ctx.stroke();

      ctx.restore();
    });

    // Camels in the right dunes
    this.camels.forEach(c => {
      c.phase += 0.035;
      const px = w * 0.5 + c.x * w;
      const py = horizon + c.distance * 110;

      ctx.save();
      ctx.translate(px, py);
      ctx.scale(0.75, 0.75);

      ctx.fillStyle = '#8f683a';
      ctx.beginPath();
      ctx.arc(0, -10, 14, Math.PI, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 0, 22, 11, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#8f683a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-10, 8);
      ctx.lineTo(-12, 26);
      ctx.moveTo(10, 8);
      ctx.lineTo(12, 26);
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }

  drawFlowersAndFlora(ctx, w, h, horizon) {
    ctx.save();
    const centerX = w * 0.5;

    // Lavender fields (Left)
    for (let i = 0; i < 30; i++) {
      const p = (i / 30);
      const y = horizon + Math.pow(p, 1.8) * (h - horizon) * 0.85;
      const xOffset = -w * 0.18 - Math.pow(p, 1.5) * w * 0.28;
      const x = centerX + xOffset + Math.sin(i * 3) * 18;
      const r = 3 + p * 10;

      ctx.fillStyle = 'rgba(142, 98, 178, 0.85)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Taif Rose Bushes (Right)
    for (let j = 0; j < 30; j++) {
      const p = (j / 30);
      const y = horizon + Math.pow(p, 1.8) * (h - horizon) * 0.85;
      const xOffset = w * 0.18 + Math.pow(p, 1.5) * w * 0.28;
      const x = centerX + xOffset + Math.cos(j * 4) * 20;
      const r = 3 + p * 11;

      ctx.fillStyle = 'rgba(233, 30, 99, 0.88)';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  drawDensePalmsBoulevard(ctx, w, h) {
    ctx.save();

    // The road parts from center outward, but the lush date palms REMAIN standing on the left and right!
    // (يوم يبعد خلهم باليمين واليسار خليهم)
    const palmLayers = [
      { depth: 0.15, scale: 0.50, yRatio: 0.49, xFrac: 0.08 },
      { depth: 0.35, scale: 0.72, yRatio: 0.54, xFrac: 0.12 },
      { depth: 0.55, scale: 0.98, yRatio: 0.61, xFrac: 0.16 },
      { depth: 0.75, scale: 1.35, yRatio: 0.69, xFrac: 0.20 },
      { depth: 0.95, scale: 1.75, yRatio: 0.78, xFrac: 0.24 }
    ];

    palmLayers.forEach((pl, idx) => {
      // Left side palms: smoothly part from center to left, but stay clamped on the left flank!
      const leftTargetX = w * pl.xFrac;
      const leftStartX = w * 0.38 - idx * 15;
      const leftX = leftStartX - this.curtainProgress * (leftStartX - leftTargetX);
      const leftY = h * pl.yRatio;

      // Draw transparent botanical date palms
      if (this.palmTrioImg && this.palmTrioImg.complete && idx % 2 === 0) {
        const pw = 175 * pl.scale;
        const ph = 195 * pl.scale;
        ctx.drawImage(this.palmTrioImg, leftX - pw * 0.4, leftY - ph, pw, ph);
      } else if (this.palmSingleImg && this.palmSingleImg.complete) {
        const pw = 120 * pl.scale;
        const ph = 185 * pl.scale;
        ctx.drawImage(this.palmSingleImg, leftX - pw * 0.4, leftY - ph, pw, ph);
      } else {
        this.drawRealisticPalmTree(ctx, leftX, leftY, pl.scale, true, idx);
      }

      // Secondary left tree for depth
      const leftX2 = Math.max(10, leftX - 45 * pl.scale);
      const leftY2 = leftY + 20 * pl.scale;
      this.drawRealisticPalmTree(ctx, leftX2, leftY2, pl.scale * 0.85, true, idx + 2);

      // Right side palms: smoothly part from center to right, but stay clamped on the right flank!
      const rightTargetX = w * (1 - pl.xFrac);
      const rightStartX = w * 0.62 + idx * 15;
      const rightX = rightStartX + this.curtainProgress * (rightTargetX - rightStartX);
      const rightY = h * pl.yRatio;

      if (this.palmTrioImg && this.palmTrioImg.complete && idx % 2 === 1) {
        const pw = 175 * pl.scale;
        const ph = 195 * pl.scale;
        ctx.drawImage(this.palmTrioImg, rightX - pw * 0.4, rightY - ph, pw, ph);
      } else if (this.palmSingleImg && this.palmSingleImg.complete) {
        const pw = 120 * pl.scale;
        const ph = 185 * pl.scale;
        ctx.drawImage(this.palmSingleImg, rightX - pw * 0.4, rightY - ph, pw, ph);
      } else {
        this.drawRealisticPalmTree(ctx, rightX, rightY, pl.scale, false, idx);
      }

      const rightX2 = Math.min(w - 10, rightX + 45 * pl.scale);
      const rightY2 = rightY + 20 * pl.scale;
      this.drawRealisticPalmTree(ctx, rightX2, rightY2, pl.scale * 0.85, false, idx + 2);
    });

    ctx.restore();
  }

  drawRealisticPalmTree(ctx, rootX, rootY, scale, isLeft, seed = 0) {
    ctx.save();
    ctx.translate(rootX, rootY);
    ctx.scale(scale, scale);

    // Textured fibrous date palm trunk
    ctx.strokeStyle = '#5a3d24';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 180);
    const lean = (isLeft ? 28 : -28) + Math.sin(seed) * 8;
    ctx.quadraticCurveTo(lean * 0.5, 60, lean * 0.2, -40);
    ctx.stroke();

    // Trunk segment rings
    ctx.strokeStyle = '#432815';
    ctx.lineWidth = 3;
    for (let r = 0; r < 6; r++) {
      const ry = 140 - r * 28;
      ctx.beginPath();
      ctx.moveTo(-7, ry);
      ctx.lineTo(7, ry + 2);
      ctx.stroke();
    }

    // Lush Green Date Palm Fronds
    const frondsCount = 12;
    for (let f = 0; f < frondsCount; f++) {
      const angle = (f / frondsCount) * Math.PI * 2;
      const sway = Math.sin(this.time * 2.2 + f + seed) * 0.08;
      const len = 95 + (f % 3) * 15;

      ctx.save();
      ctx.translate(lean * 0.2, -40);
      ctx.rotate(angle + sway);

      ctx.strokeStyle = '#1b5e20';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(len * 0.5, 18, len, 45);
      ctx.stroke();

      ctx.fillStyle = '#2e7d32';
      for (let lf = 15; lf < len; lf += 12) {
        ctx.fillRect(lf, 12, 3, 10);
      }

      ctx.restore();
    }

    ctx.restore();
  }

  drawFalcons(ctx, w, horizon) {
    ctx.save();
    this.falcons.forEach(f => {
      f.x += f.speedX;
      if (f.x > 0.45) f.x = -0.45;
      if (f.x < -0.45) f.x = 0.45;

      const px = w * 0.5 + f.x * w;
      const py = horizon * f.y * 3.5;
      const wing = Math.sin(this.time * 6 + f.wingPhase) * (f.size * 0.45);

      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = '#3a2717';
      ctx.beginPath();
      ctx.ellipse(0, 0, f.size * 0.35, f.size * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-f.size * 0.5, -f.size * 0.4 + wing, -f.size, -f.size * 0.15 + wing);
      ctx.lineTo(-f.size * 0.3, 0);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(f.size * 0.5, -f.size * 0.4 + wing, f.size, -f.size * 0.15 + wing);
      ctx.lineTo(f.size * 0.3, 0);
      ctx.fill();

      ctx.restore();
    });
    ctx.restore();
  }

  /* --- 9. السيارة الكلاسيكية الخضراء الواقعية مع الدركسون والراديو المضيء --- */
  drawClassicCarCockpit(ctx, w, h) {
    ctx.save();
    ctx.translate(w * 0.5, h);
    ctx.rotate(this.bobRot);
    ctx.translate(0, this.bobY);

    const hoodWidth = w * 0.88;
    const hoodHeight = h * 0.22;

    // Classic Deep Emerald Green Metallic Hood
    const hoodGrad = ctx.createLinearGradient(0, -hoodHeight, 0, 0);
    hoodGrad.addColorStop(0, '#0c381e');
    hoodGrad.addColorStop(0.3, '#14522d');
    hoodGrad.addColorStop(0.7, '#1b693a');
    hoodGrad.addColorStop(1, '#0e3d21');

    ctx.fillStyle = hoodGrad;
    ctx.beginPath();
    ctx.moveTo(-hoodWidth * 0.42, -hoodHeight);
    ctx.lineTo(hoodWidth * 0.42, -hoodHeight);
    ctx.lineTo(hoodWidth * 0.5, 0);
    ctx.lineTo(-hoodWidth * 0.5, 0);
    ctx.closePath();
    ctx.fill();

    // Chrome Center Spear Trim
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -hoodHeight);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // Golden Saudi Palm Emblem
    ctx.save();
    ctx.translate(0, -hoodHeight + 2);
    ctx.fillStyle = '#d4af37';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('🌴', 0, -2);
    ctx.restore();

    // Chrome Rearview Side Mirrors on Hood
    [-hoodWidth * 0.42, hoodWidth * 0.42].forEach(mx => {
      ctx.fillStyle = '#cfd8dc';
      ctx.beginPath();
      ctx.ellipse(mx, -hoodHeight + 20, 16, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#90a4ae';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Vintage Walnut Woodgrain & Leather Dashboard
    const dashHeight = h * 0.12;
    const dashGrad = ctx.createLinearGradient(0, -dashHeight, 0, 0);
    dashGrad.addColorStop(0, '#2b1b11');
    dashGrad.addColorStop(0.4, '#442b1b');
    dashGrad.addColorStop(1, '#1b110b');

    ctx.fillStyle = dashGrad;
    ctx.fillRect(-w * 0.55, -dashHeight, w * 1.1, dashHeight);

    // Dashboard Chrome Bezel Trim
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(-w * 0.55, -dashHeight, w * 1.1, dashHeight);

    // 1. Vintage Illuminated Radio (الراديو الكلاسيكي بالمنتصف)
    const radioW = Math.min(280, w * 0.32);
    const radioH = dashHeight * 0.58;
    const radioX = -radioW / 2;
    const radioY = -dashHeight + (dashHeight - radioH) * 0.5;

    // Radio housing (Chassis with chrome trim)
    ctx.fillStyle = '#141414';
    ctx.beginPath();
    ctx.roundRect(radioX, radioY, radioW, radioH, 8);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Illuminated Radio Display Screen (Warm Amber Glow)
    const screenW = radioW - 60;
    const screenH = radioH - 18;
    const screenX = radioX + 30;
    const screenY = radioY + 9;

    ctx.fillStyle = 'rgba(255, 175, 45, 0.15)';
    ctx.fillRect(screenX, screenY, screenW, screenH);
    ctx.strokeStyle = 'rgba(255, 175, 45, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(screenX, screenY, screenW, screenH);

    // Radio Display Text & Audio Status
    ctx.fillStyle = '#ffcf56';
    ctx.font = 'bold 11px "Tajawal", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📻 96.0 FM | 🎵 النشيد الوطني السعودي 🔊', screenX + screenW / 2, screenY + screenH * 0.38);

    // Audio Equalizer Waveform inside the Radio
    const eqBars = 12;
    const barW = 3;
    const barSpacing = (screenW - 40) / eqBars;
    ctx.fillStyle = '#00e575';
    for (let b = 0; b < eqBars; b++) {
      const bh = Math.abs(Math.sin(this.time * 8 + b * 1.3)) * (screenH * 0.35) + 3;
      ctx.fillRect(screenX + 20 + b * barSpacing, screenY + screenH - bh - 3, barW, bh);
    }

    // Radio Knobs (Left: Volume, Right: Tuning)
    [radioX + 15, radioX + radioW - 15].forEach(kx => {
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.arc(kx, radioY + radioH / 2, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#5a3d24';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // 2. Speedometer Gauge (Left)
    const speedX = -w * 0.28;
    const speedY = -dashHeight * 0.5;
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(speedX, speedY, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Speedometer Numbers
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px "Tajawal", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('96 km/h', speedX, speedY + 12);
    ctx.fillText('السرعة', speedX, speedY - 8);

    // Speedometer Needle pointing up-right
    ctx.strokeStyle = '#e53935';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(speedX, speedY);
    ctx.lineTo(speedX + 16, speedY - 14);
    ctx.stroke();

    // 3. Realistic Classic Steering Wheel (الدركسون الكلاسيكي ثلاثي الشعب)
    const wheelX = -w * 0.16;
    const wheelY = 20;
    const wheelRadius = Math.min(185, w * 0.24);

    ctx.save();
    ctx.translate(wheelX, wheelY);
    // Micro-sway of the steering wheel
    ctx.rotate(Math.sin(this.time * 2.5) * 0.04);

    // Outer Wooden / Leather Rim
    ctx.strokeStyle = '#2b1b11'; // dark walnut
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(0, 0, wheelRadius, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();

    // Inner Chrome Grip Accent
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, wheelRadius + 7, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();

    // Chrome Spokes (شعب الدركسون)
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 6;
    // Left Spoke
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-wheelRadius * 0.75, -wheelRadius * 0.4);
    ctx.stroke();
    // Right Spoke
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(wheelRadius * 0.75, -wheelRadius * 0.4);
    ctx.stroke();
    // Center Bottom Spoke
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, wheelRadius * 0.45);
    ctx.stroke();

    // Center Horn Button / Hub with Gold Palm
    ctx.fillStyle = '#142b1a';
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffd700';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌴', 0, 0);

    ctx.restore();

    ctx.restore();
  }

  drawPetals(ctx, w, h) {
    ctx.save();
    this.petals.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rot += p.rotSpeed;

      if (p.y > h + 20) {
        Object.assign(p, this.createPetal(false));
      }

      ctx.save();
      ctx.translate(w * 0.5 + p.x, p.y);
      ctx.rotate(p.rot);

      ctx.fillStyle = p.isLavender ? 'rgba(165, 118, 205, 0.9)' : 'rgba(235, 95, 145, 0.95)';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
    ctx.restore();
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.resize);
  }
}
