/**
 * flag3D.js - محاكي علم المملكة العربية السعودية الواقعي ثلاثي الأبعاد (Three.js)
 * - علم فيزيائي بقماش ناعم وتموجات رياح طبيعية مع الشهادة والسيف العربي الأصيل
 * - سارية مذهبة فخمة وقاعدة رخامية في أفق صحراوي مفتوح تحت شمس الصباح المشرقة
 * - مظهر ناضج وفاخر خالٍ من أي مجسمات مسطحة أو بدائية
 */

import * as THREE from 'three';

export class SaudiFlag3D {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || window.innerWidth;
    this.height = container.clientHeight || window.innerHeight;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.flagMesh = null;
    this.flagGeometry = null;
    this.particles = null;
    this.clock = new THREE.Clock();
    this.animationFrameId = null;

    this.windSpeed = 3.2;
    this.windStrength = 0.42;

    this.init();
  }

  init() {
    // 1. Scene with warm atmospheric fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xf6ebd9, 0.018);

    // 2. Camera: Positioned so the flag occupies the majestic upper-center space
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 1.4, 7.5);
    this.camera.lookAt(0.3, 1.2, 0);

    // 3. Renderer with antialiasing and soft shadows
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting setup
    this.setupLighting();

    // 5. Build Environment, Flagpole, Flag & Dust
    this.createAtmosphericSky();
    this.createAtmosphericGround();
    this.createFlagPole();
    this.createFlag();
    this.createSandDust();

    // 6. Handle Resize
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);

    // 7. Start Loop
    this.animate = this.animate.bind(this);
    this.animate();
  }

  setupLighting() {
    // Soft morning ambient light
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.2);
    this.scene.add(ambientLight);

    // Warm radiant morning sun
    const sunLight = new THREE.DirectionalLight(0xffebc4, 2.4);
    sunLight.position.set(4, 9, 6);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    this.scene.add(sunLight);

    // Royal emerald backlight for rich cloth translucency
    const emeraldRim = new THREE.DirectionalLight(0x006c35, 0.55);
    emeraldRim.position.set(-5, -2, -3);
    this.scene.add(emeraldRim);
  }

  createAtmosphericSky() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Rich Saudi morning sky: celestial dawn into radiant golden amber
    const grad = ctx.createLinearGradient(0, 0, 0, 1024);
    grad.addColorStop(0, '#507f9c');
    grad.addColorStop(0.35, '#8cb1c4');
    grad.addColorStop(0.65, '#fce5c8');
    grad.addColorStop(0.85, '#f4cf9f');
    grad.addColorStop(1, '#dfaf76');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Radiant Morning Sun Disc
    const sunGrad = ctx.createRadialGradient(340, 520, 15, 340, 520, 280);
    sunGrad.addColorStop(0, 'rgba(255, 252, 235, 0.98)');
    sunGrad.addColorStop(0.25, 'rgba(255, 235, 175, 0.6)');
    sunGrad.addColorStop(0.6, 'rgba(255, 215, 140, 0.2)');
    sunGrad.addColorStop(1, 'rgba(255, 205, 130, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(340, 520, 280, 0, Math.PI * 2);
    ctx.fill();

    const skyTex = new THREE.CanvasTexture(canvas);
    const skyGeo = new THREE.PlaneGeometry(90, 48);
    const skyMat = new THREE.MeshBasicMaterial({ map: skyTex });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyMesh.position.set(0, 7, -18);
    this.scene.add(skyMesh);
  }

  createAtmosphericGround() {
    // Natural undulating desert floor with rich golden sand
    const groundGeo = new THREE.PlaneGeometry(70, 70, 40, 40);
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Soft organic dunes
      const z = Math.sin(x * 0.14) * Math.cos(y * 0.12) * 0.85 + Math.sin(x * 0.06) * 0.5;
      pos.setZ(i, z);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xd9b37a,
      roughness: 0.9,
      metalness: 0.05
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.4;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }



  createFlagPole() {
    const poleGroup = new THREE.Group();
    const poleX = -2.7;

    // Metallic polished brass flagpole
    const poleGeo = new THREE.CylinderGeometry(0.045, 0.065, 6.4, 24);
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.22
    });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(poleX, 0.8, 0);
    pole.castShadow = true;
    poleGroup.add(pole);

    // Polished golden finial sphere on top
    const finialGeo = new THREE.SphereGeometry(0.13, 24, 24);
    const finial = new THREE.Mesh(finialGeo, poleMat);
    finial.position.set(poleX, 4.0, 0);
    finial.castShadow = true;
    poleGroup.add(finial);

    // Marble Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(0.38, 0.52, 0.35, 16);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xa89377,
      roughness: 0.65,
      metalness: 0.2
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(poleX, -2.25, 0);
    base.receiveShadow = true;
    poleGroup.add(base);

    this.scene.add(poleGroup);
  }

  generateSaudiFlagTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1060;
    const ctx = canvas.getContext('2d');

    // Royal Saudi Green background
    ctx.fillStyle = '#006C35';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle micro-woven textile grain
    ctx.fillStyle = 'rgba(0, 0, 0, 0.035)';
    for (let i = 0; i < canvas.width; i += 4) {
      ctx.fillRect(i, 0, 2, canvas.height);
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    for (let j = 0; j < canvas.height; j += 4) {
      ctx.fillRect(0, j, canvas.width, 2);
    }

    // Calligraphy: Shahada in authentic Thuluth style
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 35, 15, 0.45)';
    ctx.shadowBlur = 8;

    ctx.font = 'bold 82px "Amiri", "Aref Ruqaa", "Tajawal", serif';
    ctx.fillText('لا إله إلا الله محمد رسول الله', canvas.width / 2, 450);

    // Authentic Saudi Sword
    this.drawSaudiSword(ctx, canvas.width / 2, 630, 620);
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    return texture;
  }

  drawSaudiSword(ctx, centerX, centerY, swordWidth) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.fillStyle = '#FFFFFF';

    // Blade
    ctx.beginPath();
    ctx.moveTo(swordWidth / 2 - 45, -7);
    ctx.quadraticCurveTo(0, -11, -swordWidth / 2 + 35, -6);
    ctx.lineTo(-swordWidth / 2, 0);
    ctx.lineTo(-swordWidth / 2 + 30, 7);
    ctx.quadraticCurveTo(0, 10, swordWidth / 2 - 45, 8);
    ctx.closePath();
    ctx.fill();

    // Crossguard
    ctx.fillRect(swordWidth / 2 - 52, -28, 18, 56);
    ctx.beginPath();
    ctx.arc(swordWidth / 2 - 43, -28, 9, 0, Math.PI * 2);
    ctx.arc(swordWidth / 2 - 43, 28, 9, 0, Math.PI * 2);
    ctx.fill();

    // Hilt / Grip
    ctx.fillRect(swordWidth / 2 - 34, -9, 60, 18);

    // Pommel
    ctx.beginPath();
    ctx.arc(swordWidth / 2 + 32, 0, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  createFlag() {
    const flagWidth = 3.8;
    const flagHeight = 2.5;
    const segmentsX = 48;
    const segmentsY = 32;

    this.flagGeometry = new THREE.PlaneGeometry(flagWidth, flagHeight, segmentsX, segmentsY);

    this.originalVertices = [];
    const pos = this.flagGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      this.originalVertices.push(pos.getX(i), pos.getY(i), pos.getZ(i));
    }

    const flagTexture = this.generateSaudiFlagTexture();

    const flagMaterial = new THREE.MeshStandardMaterial({
      map: flagTexture,
      side: THREE.DoubleSide,
      roughness: 0.6,
      metalness: 0.12
    });

    this.flagMesh = new THREE.Mesh(this.flagGeometry, flagMaterial);
    this.flagMesh.position.set(-2.7 + flagWidth / 2, 2.5, 0);
    this.flagMesh.castShadow = true;
    this.scene.add(this.flagMesh);
  }

  createSandDust() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = Math.random() * 6 - 2;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xedd6a4,
      size: 0.04,
      transparent: true,
      opacity: 0.55
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  updateFlagPhysics(time) {
    if (!this.flagGeometry) return;

    const pos = this.flagGeometry.attributes.position;
    const count = pos.count;

    for (let i = 0; i < count; i++) {
      const origX = this.originalVertices[i * 3];
      const origY = this.originalVertices[i * 3 + 1];

      const u = (origX + 1.9) / 3.8;
      const amp = Math.pow(Math.max(0, u), 1.25) * this.windStrength;

      const wave1 = Math.sin(u * 5.4 - time * this.windSpeed) * 0.38;
      const wave2 = Math.cos(origY * 3.6 + time * (this.windSpeed * 1.35)) * 0.16;
      const wave3 = Math.sin(u * 8.8 - time * 4.4) * 0.07;

      const zOffset = (wave1 + wave2 + wave3) * amp;
      const yOffset = Math.sin(u * 6.2 - time * 3.2) * 0.06 * amp;
      const xOffset = Math.cos(time * 2.2 + u * 3.2) * 0.04 * amp;

      pos.setZ(i, zOffset);
      pos.setY(i, origY + yOffset);
      pos.setX(i, origX + xOffset);
    }

    pos.needsUpdate = true;
    this.flagGeometry.computeVertexNormals();
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(this.animate);
    const time = this.clock.getElapsedTime();

    this.updateFlagPhysics(time);

    if (this.particles) {
      const pos = this.particles.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        x += 0.018;
        y += Math.sin(time + x) * 0.002;
        if (x > 8) x = -8;
        pos.setX(i, x);
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    // Subtle cinematic camera sway
    this.camera.position.x = Math.sin(time * 0.35) * 0.12;
    this.camera.position.y = 1.4 + Math.cos(time * 0.28) * 0.06;
    this.camera.lookAt(0.3, 1.3, 0);

    this.renderer.render(this.scene, this.camera);
  }

  flyIntoRoad(callback) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    const startZ = this.camera.position.z;
    const startY = this.camera.position.y;
    const targetZ = 0.5;
    const targetY = 1.0;
    const duration = 1200;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // smooth cubic ease-in
      const ease = progress * progress * progress;

      this.camera.position.z = startZ + (targetZ - startZ) * ease;
      this.camera.position.y = startY + (targetY - startY) * ease;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (callback) callback();
      }
    };
    requestAnimationFrame(step);
  }

  onWindowResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize);
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
