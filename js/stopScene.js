/**
 * stopScene.js - مشهد التوقف والوقار الملكي (Three.js)
 * - توقف الكاميرا بانسيابية على هضبة مطلة على أفق المملكة البانورامي
 * - ظهور تكريمي مهيب ومحترم للوحة الفنية للمؤسس الملك عبدالعزيز، وخادم الحرمين الملك سلمان، وسمو ولي العهد الأمير محمد بن سلمان
 * - إطار مذهب فخم وهالة شمسية وأعمدة رخامية ملكية
 * - تشغيل الصوت الوطني التراثي الأصيل ("أنا بدوي ولد بدوي") كجزء طبيعي من أثير المكان
 */

import * as THREE from 'three';
import { sound } from './audioEngine.js';

export class RoyalStopScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();

    this.plinth = null;
    this.royalFrameMesh = null;
    this.floatingGlow = null;

    this.initTerrace();
    this.initRoyalMonument();
    this.initGoldenAura();

    this.scene.add(this.group);
    this.group.visible = false;
  }

  initTerrace() {
    // Grand Marble Ceremonial Plinth Overlook
    const plinthGeo = new THREE.CylinderGeometry(14, 16, 2.5, 32);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0xe6d5be,
      roughness: 0.35,
      metalness: 0.15
    });
    this.plinth = new THREE.Mesh(plinthGeo, plinthMat);
    this.plinth.position.set(0, -2.4, 0);
    this.plinth.receiveShadow = true;
    this.group.add(this.plinth);

    // Decorative Polished Brass Railing / Pillars
    const railMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.2
    });

    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const x = Math.cos(angle) * 13.5;
      const z = Math.sin(angle) * 13.5;

      const pGeo = new THREE.CylinderGeometry(0.12, 0.16, 1.4, 16);
      const pMesh = new THREE.Mesh(pGeo, railMat);
      pMesh.position.set(x, -1.1, z);
      pMesh.castShadow = true;
      this.group.add(pMesh);
    }
  }

  initRoyalMonument() {
    const monumentGroup = new THREE.Group();
    monumentGroup.position.set(0, 0.8, -4.5);

    // Load High-Fidelity Museum-Grade Royal Leaders Artwork
    const texLoader = new THREE.TextureLoader();
    const royalTex = texLoader.load('assets/images/royal_leaders.jpg');
    royalTex.anisotropy = 16;

    // Artwork Canvas Frame (16:9 ratio, width: 8.8, height: 4.95)
    const frameGeo = new THREE.PlaneGeometry(8.8, 4.95);
    const frameMat = new THREE.MeshStandardMaterial({
      map: royalTex,
      roughness: 0.4,
      metalness: 0.1
    });

    this.royalFrameMesh = new THREE.Mesh(frameGeo, frameMat);
    this.royalFrameMesh.position.set(0, 2.8, 0);
    this.royalFrameMesh.castShadow = true;
    monumentGroup.add(this.royalFrameMesh);

    // Sculptural Gold Leaf Ornate Border Frame
    const borderMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.18
    });

    const topBorder = new THREE.Mesh(new THREE.BoxGeometry(9.3, 0.35, 0.4), borderMat);
    topBorder.position.set(0, 5.35, 0.05);
    const btmBorder = new THREE.Mesh(new THREE.BoxGeometry(9.3, 0.35, 0.4), borderMat);
    btmBorder.position.set(0, 0.25, 0.05);
    const lftBorder = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5.4, 0.4), borderMat);
    lftBorder.position.set(-4.5, 2.8, 0.05);
    const rgtBorder = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5.4, 0.4), borderMat);
    rgtBorder.position.set(4.5, 2.8, 0.05);

    monumentGroup.add(topBorder, btmBorder, lftBorder, rgtBorder);

    // Pedestal Base under the frame
    const baseGeo = new THREE.BoxGeometry(9.8, 1.2, 1.8);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1f2b23, // Deep Royal Malachite
      roughness: 0.5,
      metalness: 0.3
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, -0.4, 0);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    monumentGroup.add(baseMesh);

    this.group.add(monumentGroup);
  }

  initGoldenAura() {
    // 60 Ambient Golden Sparks & Light Particles
    const count = 60;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 14;
      pos[i + 1] = Math.random() * 6;
      pos[i + 2] = -Math.random() * 6 - 1;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xfde39e,
      size: 0.12,
      transparent: true,
      opacity: 0.75
    });

    this.floatingGlow = new THREE.Points(geo, mat);
    this.group.add(this.floatingGlow);
  }

  enter() {
    this.group.visible = true;
    // Trigger cultural heritage audio track seamlessly
    sound.playTrack('badawi', 18);
  }

  update(time, delta) {
    if (!this.group.visible) return;

    // Gentle float of particles
    if (this.floatingGlow) {
      const pos = this.floatingGlow.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) + delta * 0.25;
        if (y > 6.5) y = 0.2;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }
  }

  setVisible(visible) {
    this.group.visible = visible;
  }
}
