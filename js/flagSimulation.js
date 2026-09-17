/**
 * flagSimulation.js - محاكي علم المملكة العربية السعودية الفيزيائي ثلاثي الأبعاد
 * - فيزياء قماش حقيقية متقدمة (Multi-harmonic Cloth Simulation مع تموجات ريح واهتزازات حريرية)
 * - خامة حريرية نبيلة (PBR Silk Sheen & Micro-fabric Weave)
 * - راية التوحيد بخط الثلث الأصيل مع السيف العربي المسلول بتطريز بارز
 * - سارية نحاسية مذهبة صقيلة بحبال السارية (Halyard Ropes) وحلقات التثبيت (Brass Grommets)
 * - قاعدة رخامية ثلاثية الطبقات بحواف ذهبية
 */

import * as THREE from 'three';

export class SaudiFlagSimulation {
  constructor(scene) {
    this.scene = scene;
    this.flagGroup = new THREE.Group();
    this.flagMesh = null;
    this.flagGeometry = null;
    this.originalPositions = null;

    this.windSpeed = 2.0; // Calm, majestic, stately silk wave
    this.windStrength = 0.38;
    this.windGust = 0;

    // Official Saudi Flag 2:3 ratio, enlarged & positioned directly beside the central hero text
    this.width = 3.1;
    this.height = 2.07;
    this.segmentsX = 100;
    this.segmentsY = 68;

    // Placed directly beside the inscription "اليوم الوطني السعودي" (pole at x = -2.85, cloth waves majestically backwards)
    this.poleX = -2.85;
    this.poleZ = 8.8;
    this.poleHeight = 6.2; // Perfectly proportioned to flank the inscription without blocking the skyline
    this.baseY = -2.36;

    this.initFlag();

    // Flagpole is closest to viewer beside the text, while flag cloth angles backwards into the scene towards the buildings
    this.flagGroup.rotation.y = -0.28; // Inward angle towards the skyline giving rich 3D depth
    this.flagGroup.rotation.x = 0.02;
    this.flagGroup.rotation.z = -0.01;

    this.scene.add(this.flagGroup);
  }

  initFlag() {
    // 1. Flagpole (Noble Golden Brass with Halyard Hardware)
    const poleGeo = new THREE.CylinderGeometry(0.038, 0.062, this.poleHeight + 0.6, 32);
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.94,
      roughness: 0.16
    });

    const poleMesh = new THREE.Mesh(poleGeo, poleMat);
    // Plunge deep into the dune
    poleMesh.position.set(this.poleX, this.baseY + (this.poleHeight - 0.3) / 2, this.poleZ);
    poleMesh.castShadow = true;
    poleMesh.receiveShadow = true;
    this.flagGroup.add(poleMesh);

    // Golden Finial Sphere on top
    const finialGeo = new THREE.SphereGeometry(0.14, 32, 32);
    const finialMesh = new THREE.Mesh(finialGeo, poleMat);
    finialMesh.position.set(this.poleX, this.baseY + this.poleHeight + 0.08, this.poleZ);
    finialMesh.castShadow = true;
    this.flagGroup.add(finialMesh);

    // Top Pulley Truck Block
    const pulleyGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.07, 16);
    const pulleyMesh = new THREE.Mesh(pulleyGeo, poleMat);
    pulleyMesh.position.set(this.poleX, this.baseY + this.poleHeight - 0.03, this.poleZ);
    this.flagGroup.add(pulleyMesh);

    // Halyard Rigging Cord (حبل السارية المزدوج)
    const ropeMat = new THREE.MeshStandardMaterial({
      color: 0xecd9be,
      roughness: 0.82
    });
    const ropeGeo = new THREE.CylinderGeometry(0.006, 0.006, this.poleHeight - 0.4, 8);
    const ropeMesh = new THREE.Mesh(ropeGeo, ropeMat);
    ropeMesh.position.set(this.poleX + 0.06, this.baseY + (this.poleHeight - 0.4) / 2, this.poleZ + 0.03);
    this.flagGroup.add(ropeMesh);

    // Flag attached right at the upper peak of flagpole
    const flagCenterY = this.baseY + this.poleHeight - 0.15 - this.height / 2;

    const grommetMat = poleMat;
    const gTop = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.007, 8, 16), grommetMat);
    gTop.position.set(this.poleX + 0.035, flagCenterY + this.height / 2 - 0.05, this.poleZ);
    gTop.rotation.y = Math.PI / 2;
    const gBottom = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.007, 8, 16), grommetMat);
    gBottom.position.set(this.poleX + 0.035, flagCenterY - this.height / 2 + 0.05, this.poleZ);
    gBottom.rotation.y = Math.PI / 2;
    this.flagGroup.add(gTop, gBottom);

    // 2. High-Resolution Saudi Flag Texture with Silk Weave & Thread Emboss
    const flagTexture = this.generateSaudiFlagCanvasTexture();
    const bumpTexture = this.generateFabricMicroBumpTexture();

    // 3. Deformable High-Density Cloth Geometry
    this.flagGeometry = new THREE.PlaneGeometry(
      this.width,
      this.height,
      this.segmentsX,
      this.segmentsY
    );

    const posAttr = this.flagGeometry.attributes.position;
    this.originalPositions = new Float32Array(posAttr.array.length);
    this.originalPositions.set(posAttr.array);

    const flagMaterial = new THREE.MeshStandardMaterial({
      map: flagTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.015,
      side: THREE.DoubleSide,
      roughness: 0.85,
      metalness: 0.0
    });

    this.flagMesh = new THREE.Mesh(this.flagGeometry, flagMaterial);
    // Pin left edge to flagpole
    this.flagMesh.position.set(this.poleX + this.width / 2 + 0.04, flagCenterY, this.poleZ);
    this.flagMesh.castShadow = true;
    this.flagMesh.receiveShadow = true;
    this.flagGroup.add(this.flagMesh);
  }

  generateFabricMicroBumpTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);

    // Crossed warp & weft silk threads
    for (let i = 0; i < 256; i += 2) {
      ctx.fillStyle = (i % 4 === 0) ? '#909090' : '#707070';
      ctx.fillRect(i, 0, 1, 256);
      ctx.fillRect(0, i, 256, 1);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(48, 32);
    return tex;
  }

  generateSaudiFlagCanvasTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1800;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');

    // Official Saudi Green (Pantone 349 C - #006c35)
    ctx.fillStyle = '#006c35';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle rich fabric sheen
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Micro silk weave scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.035)';
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.fillRect(0, y, canvas.width, 1.5);
    }

    // 3. Embroidered Shahada Calligraphy (Thuluth Script - Centered & Crisp)
    ctx.save();
    ctx.shadowColor = 'rgba(0, 24, 8, 0.80)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 5;

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 155px "Amiri", "Aref Ruqaa", "Tajawal", "Traditional Arabic", serif';

    // Primary embroidery layer
    ctx.fillText('لا إله إلا الله محمد رسول الله', canvas.width / 2, 530);

    // Subtle golden-white thread rim highlight
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'rgba(250, 255, 250, 0.98)';
    ctx.fillText('لا إله إلا الله محمد رسول الله', canvas.width / 2, 528);

    // 4. Authentic Proportional Saudi Curved Sword
    this.drawCurvedSword(ctx, canvas.width / 2, 820, 1020);
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
    ctx.shadowColor = 'rgba(0, 24, 8, 0.70)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 3;

    // Curved Blade (نصل السيف العربي المسلول)
    ctx.beginPath();
    ctx.moveTo(len / 2 - 75, -15);
    ctx.quadraticCurveTo(0, -24, -len / 2 + 55, -10);
    ctx.lineTo(-len / 2, 0); // Point
    ctx.lineTo(-len / 2 + 50, 13);
    ctx.quadraticCurveTo(0, 22, len / 2 - 75, 15);
    ctx.closePath();
    ctx.fill();

    // Crossguard (واقية المقبض)
    ctx.fillRect(len / 2 - 90, -48, 30, 96);
    ctx.beginPath();
    ctx.arc(len / 2 - 75, -48, 15, 0, Math.PI * 2);
    ctx.arc(len / 2 - 75, 48, 15, 0, Math.PI * 2);
    ctx.fill();

    // Hilt / Grip with authentic notches
    ctx.fillRect(len / 2 - 62, -15, 102, 30);

    // Pommel Ring (حلقة المقبض)
    ctx.beginPath();
    ctx.arc(len / 2 + 52, 0, 26, 0, Math.PI * 2);
    ctx.fill();

    // Pommel Hole
    ctx.fillStyle = '#002d11';
    ctx.beginPath();
    ctx.arc(len / 2 + 52, 0, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  update(time, delta) {
    if (!this.flagGeometry || !this.originalPositions) return;

    // Heavy royal silk wind dynamics with distinct fluttering billows
    this.windGust = Math.sin(time * 0.55) * 0.18 + Math.cos(time * 1.1) * 0.12;
    const speed = 2.4 + this.windGust;
    const strength = 0.58 + this.windGust * 0.25;

    const pos = this.flagGeometry.attributes.position;
    const count = pos.count;
    const orig = this.originalPositions;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const ox = orig[idx];
      const oy = orig[idx + 1];

      // Normalized distance from pole (0 at left attached hem, 1 at free flying tip)
      const u = (ox + this.width / 2) / this.width;

      // Continuous envelope: strictly 0 at the grommets, expanding powerfully to the fly edge
      const envelope = Math.pow(Math.max(0, u), 1.15) * strength;

      // 1. Primary heavy traveling billowing wave
      const w1 = Math.sin(u * 5.6 - time * (speed * 1.6)) * 0.85;
      // 2. Secondary transverse wave folds across the fabric height
      const w2 = Math.sin((u * 9.6 + oy * 1.8) - time * (speed * 2.4)) * 0.42;
      // 3. Realistic cloth flutter wave traveling to the fly edge
      const w3 = Math.cos((u * 16.0 - time * (speed * 3.4))) * (0.22 * Math.pow(u, 1.3));

      // Heavy fabric gravity sag and natural drape
      const sag = -Math.pow(u, 1.25) * 0.28;

      // Inward depth drift streaming towards the background buildings
      const zDisp = (w1 + w2 + w3) * envelope - Math.pow(u, 1.1) * 0.20;
      const yDisp = (Math.sin(u * 4.4 - time * 2.2) * 0.14 + sag) * envelope;
      // Inward pull in X conserving cloth surface area during deep billows
      const xDisp = -Math.abs(zDisp) * 0.10 + Math.cos(time * 2.2 + u * 4.2) * 0.05 * envelope;

      pos.setZ(i, zDisp);
      pos.setY(i, oy + yDisp);
      pos.setX(i, ox + xDisp);
    }

    pos.needsUpdate = true;
    this.flagGeometry.computeVertexNormals();
  }

  setVisible(visible) {
    this.flagGroup.visible = visible;
  }
}
