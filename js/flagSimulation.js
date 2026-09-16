/**
 * flagSimulation.js - محاكي علم المملكة العربية السعودية الفيزيائي ثلاثي الأبعاد
 * - فيزياء قماش حقيقية (Multi-harmonic Cloth Wave Physics)
 * - سارية مذهبة فخمة وقاعدة رخامية ناصعة
 * - شهادة التوحيد بخط الثلث والسيف العربي المسلول بدقة 2048px
 * - استجابة واقعية للرياح مع انثناءات وحواف متموجة وإضاءة متفاعلة مع الظلال
 */

import * as THREE from 'three';

export class SaudiFlagSimulation {
  constructor(scene) {
    this.scene = scene;
    this.flagGroup = new THREE.Group();
    this.flagMesh = null;
    this.flagGeometry = null;
    this.originalPositions = null;

    this.windSpeed = 3.4;
    this.windStrength = 0.44;
    this.windGust = 0;

    this.width = 4.2;
    this.height = 2.8;
    this.segmentsX = 64;
    this.segmentsY = 44;

    this.initFlag();
    this.scene.add(this.flagGroup);
  }

  initFlag() {
    // 1. Flagpole (Golden Polished Brass)
    const poleX = -2.8;
    const poleHeight = 7.6;

    const poleGeo = new THREE.CylinderGeometry(0.05, 0.07, poleHeight, 32);
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.18
    });

    const poleMesh = new THREE.Mesh(poleGeo, poleMat);
    poleMesh.position.set(poleX, poleHeight / 2 - 2.5, 0);
    poleMesh.castShadow = true;
    poleMesh.receiveShadow = true;
    this.flagGroup.add(poleMesh);

    // 2. Golden Finial Sphere on top
    const finialGeo = new THREE.SphereGeometry(0.14, 24, 24);
    const finialMesh = new THREE.Mesh(finialGeo, poleMat);
    finialMesh.position.set(poleX, poleHeight - 2.5 + 0.05, 0);
    finialMesh.castShadow = true;
    this.flagGroup.add(finialMesh);

    // 3. Stepped Marble Pedestal
    const baseGeo = new THREE.CylinderGeometry(0.45, 0.62, 0.4, 24);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xecd9be,
      roughness: 0.4,
      metalness: 0.1
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(poleX, -2.3, 0);
    baseMesh.receiveShadow = true;
    this.flagGroup.add(baseMesh);

    // 4. Generate High-Fidelity Saudi Flag Cloth Texture (2048 x 1365)
    const flagTexture = this.generateSaudiFlagCanvasTexture();

    // 5. Build Deformable Cloth Geometry
    this.flagGeometry = new THREE.PlaneGeometry(
      this.width,
      this.height,
      this.segmentsX,
      this.segmentsY
    );

    // Cache original vertex positions for displacement computation
    const posAttr = this.flagGeometry.attributes.position;
    this.originalPositions = new Float32Array(posAttr.array.length);
    this.originalPositions.set(posAttr.array);

    const flagMaterial = new THREE.MeshStandardMaterial({
      map: flagTexture,
      side: THREE.DoubleSide,
      roughness: 0.55,
      metalness: 0.14
    });

    this.flagMesh = new THREE.Mesh(this.flagGeometry, flagMaterial);
    // Position flag so its left edge attaches cleanly to the flagpole
    this.flagMesh.position.set(poleX + this.width / 2, 2.8, 0);
    this.flagMesh.castShadow = true;
    this.flagMesh.receiveShadow = true;
    this.flagGroup.add(this.flagMesh);
  }

  generateSaudiFlagCanvasTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1365;
    const ctx = canvas.getContext('2d');

    // 1. Royal Saudi Emerald Green Ground
    ctx.fillStyle = '#006c35';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Micro-fabric Weave Grain (Fine luxury silk texture)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.035)';
    for (let x = 0; x < canvas.width; x += 3) {
      ctx.fillRect(x, 0, 1.5, canvas.height);
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    for (let y = 0; y < canvas.height; y += 3) {
      ctx.fillRect(0, y, canvas.width, 1.5);
    }

    // 3. The Holy Shahada Calligraphy (Thuluth script)
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 25, 10, 0.45)';
    ctx.shadowBlur = 10;

    // Authentic majestic font styling
    ctx.font = 'bold 112px "Amiri", "Aref Ruqaa", "Tajawal", serif';
    ctx.fillText('لا إله إلا الله محمد رسول الله', canvas.width / 2, 580);

    // 4. Authentic Saudi Curved Sword
    this.drawCurvedSword(ctx, canvas.width / 2, 820, 800);
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    texture.generateMipmaps = true;
    return texture;
  }

  drawCurvedSword(ctx, cx, cy, len) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#ffffff';

    // Blade path with authentic Arab curved curvature pointing to the right
    ctx.beginPath();
    ctx.moveTo(len / 2 - 60, -9);
    ctx.quadraticCurveTo(0, -15, -len / 2 + 45, -8);
    ctx.lineTo(-len / 2, 0);
    ctx.lineTo(-len / 2 + 40, 9);
    ctx.quadraticCurveTo(0, 14, len / 2 - 60, 10);
    ctx.closePath();
    ctx.fill();

    // Crossguard
    ctx.fillRect(len / 2 - 70, -36, 24, 72);
    ctx.beginPath();
    ctx.arc(len / 2 - 58, -36, 12, 0, Math.PI * 2);
    ctx.arc(len / 2 - 58, 36, 12, 0, Math.PI * 2);
    ctx.fill();

    // Hilt / Grip with wrapping notches
    ctx.fillRect(len / 2 - 46, -11, 78, 22);

    // Pommel (ring)
    ctx.beginPath();
    ctx.arc(len / 2 + 38, 0, 19, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Update Cloth Simulation on every frame
   */
  update(time, delta) {
    if (!this.flagGeometry || !this.originalPositions) return;

    // Wind gust variability
    this.windGust = Math.sin(time * 0.7) * 0.15 + Math.cos(time * 1.6) * 0.08;
    const effectiveSpeed = (this.windSpeed + this.windGust);
    const effectiveStrength = (this.windStrength + this.windGust * 0.5);

    const pos = this.flagGeometry.attributes.position;
    const count = pos.count;
    const orig = this.originalPositions;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const ox = orig[idx];
      const oy = orig[idx + 1];

      // Normalized horizontal distance from flagpole (0 at left pole, 1 at right flying tip)
      const u = (ox + this.width / 2) / this.width;

      // Pin the left edge to the pole (u = 0 => 0 displacement)
      const envelope = Math.pow(Math.max(0, u), 1.35) * effectiveStrength;

      // Primary harmonic wave traveling along x
      const wave1 = Math.sin(u * 5.8 - time * effectiveSpeed) * 0.42;
      // Cross-wave turbulence along y
      const wave2 = Math.cos(oy * 4.2 + time * (effectiveSpeed * 1.25)) * 0.2;
      // High-frequency silk rippling
      const wave3 = Math.sin(u * 11.2 - time * 6.5) * 0.09;
      // Secondary flutter
      const wave4 = Math.sin((u + oy) * 7.5 - time * 4.8) * 0.06;

      const zDisplacement = (wave1 + wave2 + wave3 + wave4) * envelope;
      const yDisplacement = Math.sin(u * 6.5 - time * 3.4) * 0.08 * envelope;
      const xDisplacement = Math.cos(time * 2.8 + u * 4.0) * 0.05 * envelope;

      pos.setZ(i, zDisplacement);
      pos.setY(i, oy + yDisplacement);
      pos.setX(i, ox + xDisplacement);
    }

    pos.needsUpdate = true;
    this.flagGeometry.computeVertexNormals();
  }

  setVisible(visible) {
    this.flagGroup.visible = visible;
  }
}
