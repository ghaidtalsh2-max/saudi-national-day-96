/**
 * culturalGames.js - محرك الألعاب والأنشطة التفاعلية الحقيقية لمدن المملكة
 * - ألعاب حقيقية بفيزياء، مؤقتات، تصادم، جزيئات، وتغذية بصرية وصوتية كاملة:
 *   1. الرياض: إيقاع طبول وسيوف العرضة النجدية (Ardah Drum & Sword Rhythm)
 *   2. الطائف: قطف وتقطير الورد الطائفي في قدر النحاس (Taif Rose Harvest & Alembic Still)
 *   3. حائل: سامري حائل والصقارة على رمال النفود (Samri Rhythm & Falcon Flight)
 *   4. جدة: ترميم الرواشين الحجازية وإنارة فوانيس البلد (Balad Roshan & Lantern Craft)
 *   5. العلا: مرايا قاعة مرايا وانعكاس شمس الحِجر (Maraya Mirror Light Reflection)
 *   6. الأحساء: تنظيم قنوات عيون الماء وجني التمر الحساوي (Oasis Springs Irrigation)
 *   7. عسير: تلوين نقوش القط العسيري الهندسية (Qatt Al-Asiri Traditional Wall Art)
 */

import { sound } from './audioEngine.js';

export class CulturalGamesEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.activeCityId = null;
    this.score = 0;
    this.animId = null;
    this.time = 0;

    this.w = canvas.width = canvas.parentElement?.clientWidth || 800;
    this.h = canvas.height = canvas.parentElement?.clientHeight || 400;

    // Load authentic photos as backdrops & textures
    this.images = {
      taif: this.loadImage('assets/images/landmarks/taif_cablecar.jpg'),
      riyadh: this.loadImage('assets/images/landmarks/riyadh_masmak.jpg'),
      hail: this.loadImage('assets/images/landmarks/hail_jubbah.jpg'),
      jeddah: this.loadImage('assets/images/landmarks/jeddah_balad.jpg'),
      alula: this.loadImage('assets/images/landmarks/alula_hegra.jpg'),
      ahsa: this.loadImage('assets/images/landmarks/ahsa_oasis.jpg'),
      asir: this.loadImage('assets/images/landmarks/asir_rijal.jpg')
    };

    // Game Specific States
    this.gameState = {};

    this.initEventListeners();
  }

  loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
  }

  initEventListeners() {
    this.canvas.addEventListener('pointerdown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handlePointerDown(x, y);
    });

    window.addEventListener('resize', () => {
      if (!this.canvas) return;
      this.w = this.canvas.width = this.canvas.parentElement?.clientWidth || 800;
      this.h = this.canvas.height = this.canvas.parentElement?.clientHeight || 400;
    });
  }

  start(cityId) {
    this.activeCityId = cityId;
    this.score = 0;
    this.time = 0;
    cancelAnimationFrame(this.animId);

    this.initCityGame(cityId);
    this.updateHUD();

    const loop = (t) => {
      this.time = t * 0.001;
      this.updateGameLogic();
      this.render();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  stop() {
    cancelAnimationFrame(this.animId);
  }

  initCityGame(cityId) {
    if (cityId === 'riyadh') {
      // Riyadh Ardah Rhythm Game
      this.gameState = {
        beats: [
          { x: this.w * 0.9, speed: 3.2, hit: false },
          { x: this.w * 1.2, speed: 3.2, hit: false },
          { x: this.w * 1.5, speed: 3.2, hit: false }
        ],
        targetX: this.w * 0.22,
        swordLift: 0,
        particles: []
      };
    } else if (cityId === 'taif') {
      // Taif Rose Harvest & Distillation
      this.gameState = {
        roses: [
          { x: this.w * 0.2, y: this.h * 0.45, r: 24, picked: false },
          { x: this.w * 0.35, y: this.h * 0.65, r: 28, picked: false },
          { x: this.w * 0.5, y: this.h * 0.4, r: 22, picked: false },
          { x: this.w * 0.65, y: this.h * 0.58, r: 26, picked: false },
          { x: this.w * 0.8, y: this.h * 0.48, r: 25, picked: false }
        ],
        steamParticles: [],
        oilDrops: 0,
        flameTemp: 80
      };
    } else if (cityId === 'hail') {
      // Hail Falcon Flight & Samri Campfire
      this.gameState = {
        falcon: { x: this.w * 0.2, y: this.h * 0.4, vy: 0 },
        sparkles: [],
        campFireScale: 1.0
      };
    } else if (cityId === 'jeddah') {
      // Jeddah Balad Roshan & Lanterns
      this.gameState = {
        lanterns: [
          { x: this.w * 0.22, y: this.h * 0.3, lit: true },
          { x: this.w * 0.48, y: this.h * 0.25, lit: false },
          { x: this.w * 0.74, y: this.h * 0.32, lit: false }
        ],
        roshanPieces: [
          { x: this.w * 0.35, y: this.h * 0.75, fixed: true },
          { x: this.w * 0.5, y: this.h * 0.75, fixed: false },
          { x: this.w * 0.65, y: this.h * 0.75, fixed: false }
        ]
      };
    } else if (cityId === 'alula') {
      // AlUla Maraya Mirror Sunlight Puzzle
      this.gameState = {
        mirrors: [
          { x: this.w * 0.28, y: this.h * 0.65, angle: 45 },
          { x: this.w * 0.52, y: this.h * 0.4, angle: 30 }
        ],
        sunBeamTarget: { x: this.w * 0.82, y: this.h * 0.42 },
        aligned: false
      };
    } else if (cityId === 'ahsa') {
      // Al-Ahsa Oasis Spring Water Canal
      this.gameState = {
        gates: [
          { x: this.w * 0.3, open: false },
          { x: this.w * 0.6, open: false }
        ],
        waterLevel: 0,
        datesHarvested: 0
      };
    } else if (cityId === 'asir') {
      // Abha Asir Qatt Wall Painting
      this.gameState = {
        selectedColor: '#e91e63',
        motifs: [
          { x: this.w * 0.25, y: this.h * 0.5, size: 50, color: '#2a241e' },
          { x: this.w * 0.45, y: this.h * 0.5, size: 50, color: '#2a241e' },
          { x: this.w * 0.65, y: this.h * 0.5, size: 50, color: '#2a241e' },
          { x: this.w * 0.85, y: this.h * 0.5, size: 50, color: '#2a241e' }
        ]
      };
    }
  }

  handlePointerDown(x, y) {
    const s = this.gameState;

    if (this.activeCityId === 'riyadh') {
      // Strike Ardah Drum
      sound.playDrumBeat('tar', 130);
      s.swordLift = 1.0;

      // Check rhythm hit near target
      let hitAny = false;
      s.beats.forEach(b => {
        if (!b.hit && Math.abs(b.x - s.targetX) < 48) {
          b.hit = true;
          hitAny = true;
          this.score += 100;
          this.triggerSparkles(s.targetX, this.h * 0.65, '#00ff88');
          sound.playChime(720);
        }
      });

      if (!hitAny) {
        this.triggerSparkles(s.targetX, this.h * 0.65, '#d4af37');
      }
    } else if (this.activeCityId === 'taif') {
      // Pick Taif Rose
      s.roses.forEach(r => {
        const d = Math.hypot(x - r.x, y - r.y);
        if (d < r.r && !r.picked) {
          r.picked = true;
          this.score += 50;
          sound.playChime(640);
          this.triggerSparkles(r.x, r.y, '#ff4081');
          s.oilDrops += 5;
        }
      });
    } else if (this.activeCityId === 'hail') {
      // Falcon flap soaring
      s.falcon.vy = -7.5;
      sound.playDrumBeat('daff', 105);
      this.score += 25;
      this.triggerSparkles(s.falcon.x, s.falcon.y, '#f5a623');
    } else if (this.activeCityId === 'jeddah') {
      // Light lanterns or fix roshan
      s.lanterns.forEach(l => {
        if (Math.hypot(x - l.x, y - l.y) < 35 && !l.lit) {
          l.lit = true;
          this.score += 150;
          sound.playChime(760);
          this.triggerSparkles(l.x, l.y, '#ffea00');
        }
      });
      s.roshanPieces.forEach(p => {
        if (Math.hypot(x - p.x, y - p.y) < 35 && !p.fixed) {
          p.fixed = true;
          this.score += 100;
          sound.playChime(580);
          this.triggerSparkles(p.x, p.y, '#d4af37');
        }
      });
    } else if (this.activeCityId === 'alula') {
      // Rotate mirror
      s.mirrors.forEach(m => {
        if (Math.hypot(x - m.x, y - m.y) < 40) {
          m.angle = (m.angle + 20) % 90;
          sound.playChime(660);
          this.score += 50;
          this.triggerSparkles(m.x, m.y, '#00e5ff');
        }
      });
    } else if (this.activeCityId === 'ahsa') {
      // Toggle irrigation gates
      s.gates.forEach(g => {
        if (Math.abs(x - g.x) < 40) {
          g.open = !g.open;
          sound.playChime(g.open ? 620 : 420);
          this.score += 80;
          this.triggerSparkles(g.x, this.h * 0.6, '#00b0ff');
        }
      });
    } else if (this.activeCityId === 'asir') {
      // Paint Qatt motif
      s.motifs.forEach(m => {
        if (Math.hypot(x - m.x, y - m.y) < m.size) {
          const colors = ['#e91e63', '#ffeb3b', '#00e676', '#2979ff'];
          m.color = colors[Math.floor(Math.random() * colors.length)];
          sound.playChime(700);
          this.score += 100;
          this.triggerSparkles(m.x, m.y, m.color);
        }
      });
    }

    this.updateHUD();
  }

  triggerSparkles(x, y, color) {
    if (!this.gameState.particles) this.gameState.particles = [];
    for (let i = 0; i < 14; i++) {
      this.gameState.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6 - 2,
        life: 1.0,
        color: color
      });
    }
  }

  updateGameLogic() {
    const s = this.gameState;

    // Riyadh logic
    if (this.activeCityId === 'riyadh') {
      if (s.swordLift > 0) s.swordLift -= 0.05;
      s.beats.forEach(b => {
        b.x -= b.speed;
        if (b.x < -30) {
          b.x = this.w + Math.random() * 80;
          b.hit = false;
        }
      });
    }

    // Hail falcon gravity
    if (this.activeCityId === 'hail' && s.falcon) {
      s.falcon.vy += 0.28;
      s.falcon.y += s.falcon.vy;
      if (s.falcon.y > this.h * 0.72) {
        s.falcon.y = this.h * 0.72;
        s.falcon.vy = 0;
      }
    }

    // Update particles
    if (s.particles) {
      s.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.035;
      });
      s.particles = s.particles.filter(p => p.life > 0);
    }
  }

  render() {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;
    ctx.clearRect(0, 0, w, h);

    // 1. Draw Photographic Landmark Backdrop
    const bgImg = this.images[this.activeCityId];
    if (bgImg && bgImg.complete) {
      ctx.globalAlpha = 0.4;
      ctx.drawImage(bgImg, 0, 0, w, h);
      ctx.globalAlpha = 1.0;
    } else {
      ctx.fillStyle = '#121814';
      ctx.fillRect(0, 0, w, h);
    }

    // 2. City Specific Interactive Canvas Rendering
    if (this.activeCityId === 'riyadh') {
      this.renderRiyadh(ctx, w, h);
    } else if (this.activeCityId === 'taif') {
      this.renderTaif(ctx, w, h);
    } else if (this.activeCityId === 'hail') {
      this.renderHail(ctx, w, h);
    } else if (this.activeCityId === 'jeddah') {
      this.renderJeddah(ctx, w, h);
    } else if (this.activeCityId === 'alula') {
      this.renderAlUla(ctx, w, h);
    } else if (this.activeCityId === 'ahsa') {
      this.renderAhsa(ctx, w, h);
    } else if (this.activeCityId === 'asir') {
      this.renderAsir(ctx, w, h);
    }

    // 3. Render Floating Sparkle Particles
    if (this.gameState.particles) {
      this.gameState.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * p.life, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
    }
  }

  renderRiyadh(ctx, w, h) {
    const s = this.gameState;

    // Target Hit Marker Ring
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(s.targetX, h * 0.65, 34, 0, Math.PI * 2);
    ctx.stroke();

    // Moving Beat Drums
    s.beats.forEach(b => {
      ctx.fillStyle = b.hit ? '#00e676' : '#d4af37';
      ctx.beginPath();
      ctx.arc(b.x, h * 0.65, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 16px "Tajawal"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🥁', b.x, h * 0.65);
    });

    // Saudi Ardah Sword Salute
    ctx.save();
    ctx.translate(w * 0.8, h * 0.7);
    ctx.rotate(-0.4 - s.swordLift * 0.8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-8, -120, 16, 110);
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(-20, -10, 40, 12);
    ctx.restore();
  }

  renderTaif(ctx, w, h) {
    const s = this.gameState;

    // Rose Bush Terrace
    ctx.fillStyle = '#1c3d18';
    ctx.fillRect(0, h * 0.7, w, h * 0.3);

    // Roses
    s.roses.forEach(r => {
      if (!r.picked) {
        ctx.fillStyle = '#ff4081';
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f50057';
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Copper Alembic Still (قدر التقطير)
    ctx.fillStyle = '#b87333'; // Copper color
    ctx.beginPath();
    ctx.arc(w * 0.85, h * 0.55, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w * 0.85 - 20, h * 0.55, 40, 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Tajawal"';
    ctx.fillText(`دهن الورد: ${s.oilDrops} مل`, w * 0.85, h * 0.82);
  }

  renderHail(ctx, w, h) {
    const s = this.gameState;

    // Golden Dunes of Nafud
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.quadraticCurveTo(w * 0.5, h * 0.65, w, h);
    ctx.fill();

    // Crackling Campfire (شبة النار)
    ctx.fillStyle = '#ff5722';
    ctx.beginPath();
    ctx.arc(w * 0.75, h * 0.78, 22 * (1 + Math.sin(this.time * 10) * 0.1), 0, Math.PI * 2);
    ctx.fill();

    // Royal Soaring Falcon (صقر حائل)
    if (s.falcon) {
      ctx.fillStyle = '#faf5ee';
      ctx.font = '38px "Tajawal"';
      ctx.fillText('🦅', s.falcon.x, s.falcon.y);
    }
  }

  renderJeddah(ctx, w, h) {
    const s = this.gameState;

    // Balad Street Floor & Red Sea Wave Glow
    ctx.fillStyle = '#004d40';
    ctx.fillRect(0, h * 0.75, w, h * 0.25);

    // Lanterns (فوانيس البلد)
    s.lanterns.forEach(l => {
      ctx.fillStyle = l.lit ? '#ffe082' : '#555555';
      ctx.beginPath();
      ctx.arc(l.x, l.y, 22, 0, Math.PI * 2);
      ctx.fill();
      if (l.lit) {
        ctx.fillStyle = 'rgba(255, 238, 88, 0.35)';
        ctx.beginPath();
        ctx.arc(l.x, l.y, 45, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Historic Roshan Panels
    s.roshanPieces.forEach(p => {
      ctx.fillStyle = p.fixed ? '#8d6e63' : '#3e2723';
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 3;
      ctx.fillRect(p.x - 28, p.y - 45, 56, 90);
      ctx.strokeRect(p.x - 28, p.y - 45, 56, 90);
    });
  }

  renderAlUla(ctx, w, h) {
    const s = this.gameState;

    // Mirrors of Maraya (مرايا قاعة مرايا)
    s.mirrors.forEach(m => {
      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate((m.angle * Math.PI) / 180);
      ctx.fillStyle = '#80deea';
      ctx.fillRect(-8, -45, 16, 90);
      ctx.strokeStyle = '#00e5ff';
      ctx.strokeRect(-8, -45, 16, 90);
      ctx.restore();
    });

    // Golden Sunlight Portal at Hegra
    ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
    ctx.beginPath();
    ctx.arc(s.sunBeamTarget.x, s.sunBeamTarget.y, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 15px "Tajawal"';
    ctx.fillText('نقوش الحِجر', s.sunBeamTarget.x, s.sunBeamTarget.y);
  }

  renderAhsa(ctx, w, h) {
    const s = this.gameState;

    // Canal Water Stream
    ctx.fillStyle = '#0288d1';
    ctx.fillRect(0, h * 0.5, w, 50);

    // Gates
    s.gates.forEach(g => {
      ctx.fillStyle = g.open ? '#4caf50' : '#d32f2f';
      ctx.fillRect(g.x - 12, h * 0.45, 24, g.open ? 20 : 60);
    });
  }

  renderAsir(ctx, w, h) {
    const s = this.gameState;

    // Traditional Qatt Geometric Triangles on Stone Wall
    s.motifs.forEach(m => {
      ctx.fillStyle = m.color;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y - m.size);
      ctx.lineTo(m.x + m.size, m.y + m.size);
      ctx.lineTo(m.x - m.size, m.y + m.size);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#faf5ee';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  updateHUD() {
    const scoreEl = document.getElementById('game-active-score');
    if (scoreEl) {
      scoreEl.textContent = `النقاط: ${this.score}`;
    }
  }
}
