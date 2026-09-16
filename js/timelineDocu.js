/**
 * timelineDocu.js - الفيلم السينمائي التاريخي المتتالي لتطور المملكة العربية السعودية
 * تسلسل كرتوني وسينمائي فني متعدد المشاهد واللوحات (Frames Sequence)،
 * يبدأ كأنه رسم باللحظة نفسها (Sketch & Watercolor Reveal) ثم يندمج في أنيميشن متتالي وحي.
 */

import { sound } from './audioEngine.js';

export class TimelineDocu {
  constructor(canvas, onTimelineComplete) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onTimelineComplete = onTimelineComplete;

    this.w = canvas.width = window.innerWidth;
    this.h = canvas.height = window.innerHeight;

    this.currentEraIndex = 0;
    this.currentFrameIndex = 0;
    this.isPlaying = true;

    // Frame timing & progressive drawing
    this.frameDuration = 4800; // time per sub-frame
    this.frameStartTime = Date.now();
    this.sketchProgress = 0; // 0 to 1 live drawing progress
    this.animationFrameId = null;

    // Preload all visual artwork & historic assets
    this.images = {};
    const imgUrls = {
      masmak: 'assets/images/landmarks/riyadh_masmak.jpg',
      unification: 'assets/images/era_unification.jpg',
      oil: 'assets/images/era_oil.jpg',
      leaders: 'assets/images/royal_leaders.jpg',
      skyline: 'assets/images/landmarks/riyadh_skyline.jpg',
      oasis: 'assets/images/landmarks/ahsa_oasis.jpg',
      paper: 'assets/images/paper_texture.jpg'
    };

    Object.entries(imgUrls).forEach(([key, url]) => {
      const img = new Image();
      img.src = url;
      this.images[key] = img;
    });

    // Fireworks and Celebration Particle System for Finale
    this.fireworks = [];
    this.celebrationParticles = [];
    this.dronePositions = [];
    this.initDrones();

    // DOM References
    this.yearDisplay = document.getElementById('tl-year-display');
    this.titleDisplay = document.getElementById('tl-title-display');
    this.descDisplay = document.getElementById('tl-desc-display');
    this.dots = document.querySelectorAll('.film-dot');

    // The Structured Eras with Multi-Frame Progression
    this.eras = [
      {
        id: 0,
        eraTitle: 'مرحلة التأسيس والتوحيد (1902 – 1932م)',
        frames: [
          {
            year: '١٩٠٢ م',
            title: 'استرداد الرياض — بوابة قصر المصمك وفجر البطولة',
            desc: 'بدأ الملك عبد العزيز بن عبدالرحمن آل سعود ورجاله الأبطال رحلة توحيد وتأسيس الدولة السعودية باسترداد الرياض وبوابة المصمك الخالدة.',
            imgKey: 'masmak',
            accent: '#c49a65',
            palette: ['#1c140d', '#4a331f', '#a67c48']
          },
          {
            year: '١٩٠٢ — ١٩٣٢ م',
            title: 'ملحمة التوحيد — خيول الأصالة وراية التوحيد الخضراء',
            desc: 'ثلاثة عقود من البطولة والتلاحم، قاد فيها المؤسس الفرسان لتوحيد أرجاء شبه الجزيرة، وربط القلوب تحت راية لا إله إلا الله محمد رسول الله.',
            imgKey: 'unification',
            accent: '#1b5333',
            palette: ['#142416', '#2b4528', '#638a59']
          },
          {
            year: '٢٣ سبتمبر ١٩٣٢ م',
            title: 'الإعلان الرسمي — قيام المملكة العربية السعودية',
            desc: 'صدور الأمر الملكي التاريخي بتوحيد جميع مناطق البلاد تحت اسم "المملكة العربية السعودية"، ليرتفع العلم الأخضر رمزاً للعزة والاستقرار.',
            imgKey: 'masmak',
            accent: '#d4af37',
            palette: ['#281e10', '#5e4320', '#b8893a']
          }
        ]
      },
      {
        id: 1,
        eraTitle: 'اكتشاف النفط والانتقال للاقتصاد الحديث (الربع الثاني من القرن العشرين)',
        frames: [
          {
            year: '١٩٣٨ م',
            title: 'اكتشاف البترول — بئر الدمام رقم 7 "بئر الخير"',
            desc: 'تحقق أول تدفق تجاري للنفط في الدمام عام 1938م، مما شكل نقطة تحول كبرى في البنية التحتية والاقتصاد الوطني وانطلاق مسيرة التنمية.',
            imgKey: 'oil',
            accent: '#cf8e30',
            palette: ['#1a1914', '#453e2d', '#968452']
          },
          {
            year: 'الخمسينات والستينات م',
            title: 'تأسيس المؤسسات والوزارات وشبكات الطرق الكبرى',
            desc: 'بُنيت الوزارات والمدارس وشبكات الطرق السريعة والمستشفيات، ودخلت المملكة في عهود ملوك البناء والعطاء (سعود، فيصل، خالد، فهد، عبدالله).',
            imgKey: 'oil',
            accent: '#2d6a4f',
            palette: ['#172a20', '#31523f', '#6c967d']
          }
        ]
      },
      {
        id: 2,
        eraTitle: 'النهضة الشاملة والرؤية الاستراتيجية (2016م حتى اليوم)',
        frames: [
          {
            year: '٢٠١٦ م',
            title: 'رؤية السعودية 2030 — استراتيجية المستقبل',
            desc: 'أُطلقت برؤية استراتيجية طموحة يقودها صاحب السمو الملكي الأمير محمد بن سلمان ولي العهد رئيس مجلس الوزراء لتنويع الاقتصاد وتمكين الوطن.',
            imgKey: 'leaders',
            accent: '#1b5333',
            palette: ['#0d2618', '#1a472d', '#2d6a4f']
          },
          {
            year: '٢٠٢٤ — ٢٠٢٦ م',
            title: 'إنجازات استثنائية: السياحة العالمية والمشاريع الكبرى',
            desc: 'قفزات تاريخية في السياحة لتجاوز 100 مليون زائر، وتمكين المرأة ورفع مشاركتها لأكثر من 33.5%، وإطلاق مشاريع القرن: نيوم، البحر الأحمر، والقدية.',
            imgKey: 'skyline',
            accent: '#00a859',
            palette: ['#071911', '#113b28', '#1e6843']
          }
        ]
      },
      {
        id: 3,
        eraTitle: 'احتفال اليوم الوطني ٩٦ الكبرى (العرضة والمجرور وكافد)',
        frames: [
          {
            year: 'اليوم الوطني ٩٦',
            title: 'العرضة النجدية والمجرور وأبراج كافد — عزّنا بطبعنا',
            desc: 'مشهد وطني حي يحتفي بالفلكلور السعودي العريق: فرقة العرضة بالسيوف وفرقة المجرور بالدفوف، أمام أبراج كافد المتلألئة بالألعاب النارية وعروض الدرونز الضوئية.',
            imgKey: 'celebration',
            accent: '#00e575',
            palette: ['#040a06', '#091f13', '#0e331f']
          }
        ]
      }
    ];

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    this.bindScrubberControls();
  }

  initDrones() {
    // 80 glowing drones spelling '96' and 'اليوم الوطني السعودي'
    this.dronePoints = [];
    // Digits '96' in Arabic / Eastern numerals: ٩ ٦
    // Nine '٩' points
    const ninePoints = [
      {x: -45, y: -40}, {x: -35, y: -45}, {x: -25, y: -40}, {x: -25, y: -25},
      {x: -35, y: -20}, {x: -45, y: -25}, {x: -45, y: -40}, // circle
      {x: -25, y: -10}, {x: -25, y: 10}, {x: -25, y: 30} // tail
    ];
    // Six '٦' points
    const sixPoints = [
      {x: 20, y: -45}, {x: 45, y: -45}, {x: 45, y: -30},
      {x: 35, y: -10}, {x: 30, y: 10}, {x: 30, y: 30}
    ];
    
    // Combining into drone points with slight organic hover
    const basePts = [...ninePoints, ...sixPoints];
    for (let i = 0; i < 65; i++) {
      const target = basePts[i % basePts.length];
      this.dronePoints.push({
        x: (Math.random() - 0.5) * 600,
        y: -300 - Math.random() * 200,
        targetX: target.x * 2.5,
        targetY: target.y * 2.2,
        light: Math.random(),
        size: 2.5 + Math.random() * 2
      });
    }
  }

  resize() {
    this.w = this.canvas.width = window.innerWidth;
    this.h = this.canvas.height = window.innerHeight;
  }

  bindScrubberControls() {
    this.dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        this.goToEra(idx);
      });
    });
  }

  goToEra(index) {
    if (index >= 0 && index < this.eras.length) {
      this.currentEraIndex = index;
      this.currentFrameIndex = 0;
      this.frameStartTime = Date.now();
      this.sketchProgress = 0;
      this.updateUI();
      sound.playFinjanClink();
      if (index === 3) {
        sound.playArdahBeat();
      }
    }
  }

  start() {
    this.resize();
    this.isPlaying = true;
    this.currentEraIndex = 0;
    this.currentFrameIndex = 0;
    this.frameStartTime = Date.now();
    this.sketchProgress = 0;
    this.updateUI();

    this.animate = this.animate.bind(this);
    this.animate();
  }

  stop() {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  updateUI() {
    const era = this.eras[this.currentEraIndex];
    const frame = era.frames[this.currentFrameIndex];

    if (this.yearDisplay) this.yearDisplay.textContent = frame.year;
    if (this.titleDisplay) this.titleDisplay.textContent = frame.title;
    if (this.descDisplay) this.descDisplay.textContent = frame.desc;

    this.dots.forEach((dot, idx) => {
      if (idx === this.currentEraIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  animate() {
    if (!this.isPlaying) return;
    this.animationFrameId = requestAnimationFrame(this.animate);

    const now = Date.now();
    const elapsed = now - this.frameStartTime;
    const era = this.eras[this.currentEraIndex];

    // Live sketch / drawing progress (runs over the first 1.8s of the frame)
    this.sketchProgress = Math.min(1.0, elapsed / 1800);

    // Frame progression logic (flip to next frame or next era)
    const duration = this.currentEraIndex === 3 ? 12000 : this.frameDuration;

    if (elapsed > duration) {
      if (this.currentFrameIndex < era.frames.length - 1) {
        // Next frame within same era
        this.currentFrameIndex++;
        this.frameStartTime = now;
        this.sketchProgress = 0;
        this.updateUI();
        sound.playFinjanClink();
      } else if (this.currentEraIndex < this.eras.length - 1) {
        // Next era
        this.currentEraIndex++;
        this.currentFrameIndex = 0;
        this.frameStartTime = now;
        this.sketchProgress = 0;
        this.updateUI();
        sound.playFinjanClink();
        if (this.currentEraIndex === 3) sound.playArdahBeat();
      } else {
        // Final era ended
        if (this.onTimelineComplete) {
          this.onTimelineComplete();
        }
      }
    }

    this.render();
  }

  render() {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;
    const era = this.eras[this.currentEraIndex];
    const frame = era.frames[this.currentFrameIndex];
    const now = Date.now();
    const elapsed = now - this.frameStartTime;

    ctx.clearRect(0, 0, w, h);

    // 1. Sky & Atmospheric Backdrop
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, frame.palette[0]);
    sky.addColorStop(0.5, frame.palette[1]);
    sky.addColorStop(1, frame.palette[2]);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // 2. Render either Grand Celebration (Era 3) or Multi-Frame Storyboard (Eras 0, 1, 2)
    if (this.currentEraIndex === 3) {
      this.renderGrandCelebration(ctx, w, h, elapsed);
    } else {
      this.renderLiveDrawnFrame(ctx, w, h, frame, elapsed);
    }

    // 3. Sub-Frame indicator dots inside era
    if (era.frames.length > 1) {
      this.renderFrameStepDots(ctx, w, h, era);
    }

    // 4. Overall film progress bar at very bottom
    const duration = this.currentEraIndex === 3 ? 12000 : this.frameDuration;
    const progress = Math.min(1, elapsed / duration);
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(0, h - 5, w * progress, 5);
  }

  renderLiveDrawnFrame(ctx, w, h, frame, elapsed) {
    const img = this.images[frame.imgKey];
    const photoH = h * 0.52;
    const photoW = Math.min(w * 0.80, 1020);
    const px = (w - photoW) / 2;
    // Positioned lower down so text header above never overlaps
    const py = h * 0.36;

    ctx.save();

    // 1. Torn Paper Drop Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = '#f5efe4';
    this.drawTornPaperPath(ctx, px, py, photoW, photoH);
    ctx.fill();
    ctx.restore();

    // 2. Clip to Torn Paper Ragged Edges (ورقة مقطوعة ومدموجة مع الخلفية)
    ctx.save();
    this.drawTornPaperPath(ctx, px, py, photoW, photoH);
    ctx.clip();

    // Paper Fiber Texture
    if (this.images.paper && this.images.paper.complete) {
      ctx.drawImage(this.images.paper, px, py, photoW, photoH);
    } else {
      ctx.fillStyle = '#f8f2e6';
      ctx.fillRect(px, py, photoW, photoH);
    }

    // Subtle Ken-Burns pan and zoom
    const zoom = 1.0 + (elapsed / this.frameDuration) * 0.05;
    const panX = Math.sin(elapsed * 0.0005) * 10;

    if (img && img.complete && img.naturalWidth > 0) {
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const boxAspect = photoW / photoH;
      let dw, dh, dx, dy;

      if (imgAspect > boxAspect) {
        dh = photoH * zoom;
        dw = dh * imgAspect;
      } else {
        dw = photoW * zoom;
        dh = dw / imgAspect;
      }
      dx = px + (photoW - dw) / 2 + panX;
      dy = py + (photoH - dh) / 2;

      // Draw the artwork base with progressive opacity
      ctx.globalAlpha = Math.min(1.0, this.sketchProgress * 1.25);
      ctx.drawImage(img, dx, dy, dw, dh);

      // Warm watercolor vignette wash
      const wash = ctx.createLinearGradient(px, py, px, py + photoH);
      wash.addColorStop(0, 'rgba(0,0,0,0.12)');
      wash.addColorStop(0.7, 'rgba(0,0,0,0.15)');
      wash.addColorStop(1, 'rgba(0,0,0,0.65)');
      ctx.fillStyle = wash;
      ctx.fillRect(px, py, photoW, photoH);
    }

    // LIVE DRAWING / SKETCH OVERLAY (كأنها رسم باللحظة نفسها)
    if (this.sketchProgress < 0.98) {
      this.drawSketchPencilEffect(ctx, px, py, photoW, photoH, this.sketchProgress);
    }

    // Floating Golden Dust / Desert Sparkles
    this.drawAtmosphericDust(ctx, px, py, photoW, photoH, elapsed);

    ctx.restore(); // end clip

    // Torn Paper Fibrous Edge Stroke
    ctx.save();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1.8;
    this.drawTornPaperPath(ctx, px, py, photoW, photoH);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  drawTornPaperPath(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Top torn edge
    for (let i = 0; i <= 40; i++) {
      const tx = x + (w / 40) * i;
      const ty = y + (Math.sin(i * 1.5) * 3 + Math.cos(i * 3.7) * 2);
      ctx.lineTo(tx, ty);
    }
    // Right torn edge
    for (let j = 0; j <= 25; j++) {
      const rx = x + w + (Math.sin(j * 2.1) * 3 + Math.cos(j * 4.2) * 1.5);
      const ry = y + (h / 25) * j;
      ctx.lineTo(rx, ry);
    }
    // Bottom torn edge
    for (let k = 40; k >= 0; k--) {
      const bx = x + (w / 40) * k;
      const by = y + h + (Math.cos(k * 1.8) * 3 + Math.sin(k * 3.3) * 2);
      ctx.lineTo(bx, by);
    }
    // Left torn edge
    for (let l = 25; l >= 0; l--) {
      const lx = x + (Math.cos(l * 2.3) * 3 + Math.sin(l * 4.5) * 1.5);
      const ly = y + (h / 25) * l;
      ctx.lineTo(lx, ly);
    }
    ctx.closePath();
  }

  drawSketchPencilEffect(ctx, x, y, w, h, progress) {
    ctx.save();
    const inverse = 1.0 - progress;
    ctx.globalAlpha = inverse * 0.85;

    // Architectural pencil grid / charcoal hatching
    ctx.strokeStyle = '#f4ecd8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const sweepX = x + w * progress;
    // Drawing hand-sketched lines moving from left to right
    for (let i = 0; i < 18; i++) {
      const ly = y + (h / 18) * i;
      ctx.moveTo(x, ly);
      ctx.lineTo(sweepX, ly + Math.sin(i * 1.2) * 8);
    }
    // Diagonal hatching
    for (let j = 0; j < 12; j++) {
      const lx = x + (w / 12) * j;
      if (lx <= sweepX) {
        ctx.moveTo(lx, y);
        ctx.lineTo(lx + 40, y + h);
      }
    }
    ctx.stroke();

    // Glowing drawing tip / ink pulse line
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.9)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sweepX, y);
    ctx.lineTo(sweepX, y + h);
    ctx.stroke();

    ctx.restore();
  }

  drawAtmosphericDust(ctx, x, y, w, h, elapsed) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 235, 180, 0.6)';
    for (let i = 0; i < 24; i++) {
      const px = x + ((i * 97 + elapsed * 0.02) % w);
      const py = y + ((i * 53 + Math.sin(elapsed * 0.001 + i) * 30 + (i * 20)) % h);
      const size = (i % 3) + 1;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  renderFrameStepDots(ctx, w, h, era) {
    const total = era.frames.length;
    const startX = w / 2 - ((total - 1) * 24) / 2;
    const dotY = h * 0.88;

    for (let i = 0; i < total; i++) {
      ctx.beginPath();
      ctx.arc(startX + i * 24, dotY, i === this.currentFrameIndex ? 6 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = i === this.currentFrameIndex ? '#d4af37' : 'rgba(255,255,255,0.3)';
      ctx.fill();
    }
  }

  renderGrandCelebration(ctx, w, h, elapsed) {
    // NIGHT SKY OVER RIYADH (KAFD) WITH ARDAH & MAJOROOR TROUPES
    const groundY = h * 0.82;
    const centerX = w / 2;

    // 1. Stars in the night sky
    ctx.save();
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 40; i++) {
      const sx = (i * 137) % w;
      const sy = (i * 79) % (groundY * 0.6);
      const alpha = 0.3 + 0.7 * Math.abs(Math.sin(elapsed * 0.002 + i));
      ctx.globalAlpha = alpha;
      ctx.fillRect(sx, sy, 2, 2);
    }
    ctx.restore();

    // 2. KAFD Towers Silhouettes & Windows
    this.drawKAFDTowers(ctx, w, groundY, elapsed);

    // 3. Fireworks bursts launching from KAFD
    if (Math.random() < 0.08) {
      const fx = centerX + (Math.random() - 0.5) * (w * 0.7);
      const fy = h * 0.15 + Math.random() * (h * 0.3);
      const color = ['#00e575', '#d4af37', '#ffffff', '#25d366'][Math.floor(Math.random() * 4)];
      for (let p = 0; p < 28; p++) {
        const angle = (Math.PI * 2 / 28) * p;
        const speed = 1.8 + Math.random() * 2.5;
        this.fireworks.push({
          x: fx, y: fy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1.0,
          color: color
        });
      }
      sound.playFireworksBurst();
    }

    // Render active fireworks
    ctx.save();
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      fw.x += fw.vx;
      fw.y += fw.vy;
      fw.vy += 0.04; // gravity
      fw.alpha -= 0.022;

      if (fw.alpha <= 0) {
        this.fireworks.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = fw.alpha;
      ctx.fillStyle = fw.color;
      ctx.beginPath();
      ctx.arc(fw.x, fw.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 4. Drone Light Show: Spells "96" in the sky
    this.renderDroneLightShow(ctx, centerX, h * 0.22, elapsed);

    // 5. Celebration Ambient Stage Glow & Incense Burners
    this.drawCelebrationStage(ctx, w, groundY, elapsed);

    // Periodic celebratory chime / beat
    if (elapsed % 1200 < 20) {
      sound.playArdahBeat();
    }
  }

  drawKAFDTowers(ctx, w, groundY, elapsed) {
    const cx = w / 2;
    const skylineImg = this.images.skyline;

    // Realistic Architectural Backdrop of Riyadh Skyline & KAFD
    if (skylineImg && skylineImg.complete && skylineImg.naturalWidth > 0) {
      ctx.save();
      const sW = Math.min(w * 0.92, 1100);
      const sH = sW * 0.46;
      const sX = cx - sW / 2;
      const sY = groundY - sH + 15;

      // Draw real skyline under night lighting
      ctx.drawImage(skylineImg, sX, sY, sW, sH);

      // Night sky blend and emerald celebratory lighting wash
      const nightWash = ctx.createLinearGradient(0, sY, 0, groundY);
      nightWash.addColorStop(0, 'rgba(4, 15, 9, 0.45)');
      nightWash.addColorStop(0.6, 'rgba(6, 26, 16, 0.3)');
      nightWash.addColorStop(1, 'rgba(4, 14, 8, 0.85)');
      ctx.fillStyle = nightWash;
      ctx.fillRect(sX, sY, sW, sH);
      ctx.restore();
    }

    // Dynamic Sweeping Laser Beams from KAFD Towers into the sky
    const beamPositions = [cx - 210, cx - 70, cx + 70, cx + 210];
    beamPositions.forEach((bx, idx) => {
      ctx.save();
      const sweepAngle = Math.sin(elapsed * 0.0018 + idx * 1.5) * 0.45;
      ctx.translate(bx, groundY - 260);
      ctx.rotate(sweepAngle);

      const beam = ctx.createLinearGradient(0, 0, 0, -450);
      beam.addColorStop(0, 'rgba(0, 255, 128, 0.85)');
      beam.addColorStop(0.3, 'rgba(0, 230, 118, 0.4)');
      beam.addColorStop(1, 'rgba(0, 230, 118, 0)');
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(-45, -450);
      ctx.lineTo(45, -450);
      ctx.lineTo(10, 0);
      ctx.fill();
      ctx.restore();
    });

    // Solid Stage Ground Platform
    ctx.fillStyle = '#06130b';
    ctx.fillRect(0, groundY, w, 150);

    // Decorative Sadu / Gold Edge along the stage
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();
  }

  renderDroneLightShow(ctx, cx, cy, elapsed) {
    ctx.save();
    this.dronePoints.forEach((d) => {
      d.x += (d.targetX - d.x) * 0.04;
      d.y += (d.targetY - d.y) * 0.04;

      const px = cx + d.x;
      const py = cy + d.y + Math.sin(elapsed * 0.003 + d.x * 0.05) * 3;

      ctx.fillStyle = d.light > 0.4 ? '#00e575' : '#ffd700';
      ctx.shadowColor = '#00e575';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(px, py, d.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Luminous Calligraphic Drone Header
    ctx.font = 'bold 24px "Reem Kufi", "Tajawal", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#00e575';
    ctx.shadowColor = '#00e575';
    ctx.shadowBlur = 16;
    ctx.fillText('٩٦ • اليوم الوطني السعودي', cx, cy + 95);

    ctx.restore();
  }

  drawCelebrationStage(ctx, w, groundY, elapsed) {
    ctx.save();
    // 1. Warm Golden Stage Lighting across the base
    const stageGlow = ctx.createLinearGradient(0, groundY - 60, 0, groundY + 80);
    stageGlow.addColorStop(0, 'rgba(0, 229, 117, 0.15)');
    stageGlow.addColorStop(0.5, 'rgba(212, 175, 55, 0.22)');
    stageGlow.addColorStop(1, 'rgba(4, 20, 12, 0.95)');
    ctx.fillStyle = stageGlow;
    ctx.fillRect(0, groundY - 60, w, 140);

    // 2. Twin Heritage Golden Mabkhara (مباخر نجدية مذهبة فاخرة) emitting fragrant incense swirls
    const mabkharaPositions = [w * 0.22, w * 0.78];
    mabkharaPositions.forEach((mx) => {
      ctx.save();
      ctx.translate(mx, groundY - 35);

      // Mabkhara Base & Body
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.moveTo(-16, 35);
      ctx.lineTo(16, 35);
      ctx.lineTo(10, 10);
      ctx.lineTo(22, -18);
      ctx.lineTo(-22, -18);
      ctx.lineTo(-10, 10);
      ctx.closePath();
      ctx.fill();

      // Incense Ember Glow
      ctx.fillStyle = '#ff6b35';
      ctx.beginPath();
      ctx.arc(0, -18, 9, 0, Math.PI * 2);
      ctx.fill();

      // Rising Bakhoor smoke curls
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2;
      for (let s = 0; s < 3; s++) {
        const sOff = Math.sin(elapsed * 0.003 + s * 1.8) * 15;
        ctx.beginPath();
        ctx.moveTo(sOff * 0.3, -22);
        ctx.quadraticCurveTo(sOff, -50 - s * 20, sOff * 0.6, -90 - s * 25);
        ctx.stroke();
      }

      ctx.restore();
    });

    ctx.restore();
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.resize);
  }
}
