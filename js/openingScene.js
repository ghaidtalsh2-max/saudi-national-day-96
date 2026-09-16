/**
 * openingScene.js - البيئة السعودية الطبيعية للمشهد الافتتاحي (Three.js)
 * - تضاريس صحراوية طبيعية نجدية بكثبان رملية متموجة
 * - نباتات سعودية أصيلة: النخيل، العرعر، الخزامى البرية
 * - مبانٍ تراثية (برج مراقبة طيني نجدي) في المدى القريب، وظلال أبراج حديثة في الأفق البعيد
 * - سماء صباحية مشمسة، سحب متحركة، ذرات غبار ذهبية تتطاير مع نسيم الصباح
 */

import * as THREE from 'three';

export class OpeningScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();

    this.palms = [];
    this.dustParticles = null;
    this.clouds = [];
    this.floraPatches = [];

    this.initLighting();
    this.initSkyAndSun();
    this.initTerrain();
    this.initFlora();
    this.initArchitecture();
    this.initAtmosphericDust();

    this.scene.add(this.group);
  }

  initLighting() {
    // Warm morning ambient fill
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.4);
    this.group.add(ambientLight);

    // Radiant Saudi morning sun
    const sunLight = new THREE.DirectionalLight(0xffeedd, 2.6);
    sunLight.position.set(12, 18, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 60;
    sunLight.shadow.camera.left = -20;
    sunLight.shadow.camera.right = 20;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -20;
    sunLight.shadow.bias = -0.0005;
    this.group.add(sunLight);

    // Subtle sky bounce light
    const hemiLight = new THREE.HemisphereLight(0x8cb6ce, 0xd9b37a, 0.6);
    this.group.add(hemiLight);
  }

  initSkyAndSun() {
    // Dynamic Sky Dome
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 1024;
    skyCanvas.height = 1024;
    const ctx = skyCanvas.getContext('2d');

    // Rich Saudi morning gradient: Sapphire cyan to radiant gold to warm amber
    const grad = ctx.createLinearGradient(0, 0, 0, 1024);
    grad.addColorStop(0, '#3a729e');
    grad.addColorStop(0.3, '#7ea9c4');
    grad.addColorStop(0.65, '#fde4bf');
    grad.addColorStop(0.85, '#f4ca92');
    grad.addColorStop(1, '#d8a568');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Golden Sun Disc with radiant corona
    const sunGrad = ctx.createRadialGradient(680, 420, 10, 680, 420, 320);
    sunGrad.addColorStop(0, 'rgba(255, 255, 240, 1.0)');
    sunGrad.addColorStop(0.2, 'rgba(255, 240, 180, 0.8)');
    sunGrad.addColorStop(0.5, 'rgba(255, 215, 140, 0.25)');
    sunGrad.addColorStop(1, 'rgba(255, 200, 120, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(680, 420, 320, 0, Math.PI * 2);
    ctx.fill();

    const skyTex = new THREE.CanvasTexture(skyCanvas);
    const skyGeo = new THREE.SphereGeometry(75, 32, 24);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTex,
      side: THREE.BackSide
    });

    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.group.add(skyMesh);
  }

  initTerrain() {
    // High-resolution undulating sand terrain
    const terrainGeo = new THREE.PlaneGeometry(90, 90, 64, 64);
    const pos = terrainGeo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Multi-octave natural dunes
      const dune1 = Math.sin(x * 0.08) * Math.cos(y * 0.07) * 1.6;
      const dune2 = Math.sin(x * 0.18 + y * 0.12) * 0.6;
      const dune3 = Math.cos(x * 0.04 - y * 0.05) * 0.9;
      const elevation = dune1 + dune2 + dune3;

      pos.setZ(i, elevation);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xd6ae74,
      roughness: 0.92,
      metalness: 0.04
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.rotation.x = -Math.PI / 2;
    terrainMesh.position.y = -2.4;
    terrainMesh.receiveShadow = true;
    this.group.add(terrainMesh);
  }

  initFlora() {
    // 1. Palms on the dunes
    const palmPositions = [
      { x: -6.5, z: -4.0, scale: 1.1 },
      { x: -9.0, z: -8.0, scale: 0.9 },
      { x: 5.8, z: -6.5, scale: 1.15 },
      { x: 8.5, z: -10.0, scale: 0.85 },
      { x: -14.0, z: -16.0, scale: 1.3 }
    ];

    palmPositions.forEach(p => {
      const palm = this.createProceduralPalm(p.scale);
      palm.position.set(p.x, -2.4, p.z);
      this.group.add(palm);
      this.palms.push(palm);
    });

    // 2. Wild Lavender (خزامى) patches & Juniper (عرعر)
    this.createFloraPatches();
  }

  createProceduralPalm(scale = 1.0) {
    const palmGroup = new THREE.Group();

    // Palm Trunk (Segmented with bark rings)
    const trunkHeight = 5.2 * scale;
    const trunkGeo = new THREE.CylinderGeometry(0.18 * scale, 0.32 * scale, trunkHeight, 14, 8);
    
    // Give trunk subtle organic curvature
    const tPos = trunkGeo.attributes.position;
    for (let i = 0; i < tPos.count; i++) {
      const y = tPos.getY(i);
      const curve = Math.sin((y / trunkHeight) * Math.PI) * 0.25 * scale;
      tPos.setX(i, tPos.getX(i) + curve);
    }
    trunkGeo.computeVertexNormals();

    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x6e5239,
      roughness: 0.95,
      metalness: 0.05
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = trunkHeight / 2;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    palmGroup.add(trunk);

    // Crown Fronds (Lush Saudi Date Palm Canopy)
    const frondCount = 14;
    const frondGroup = new THREE.Group();
    frondGroup.position.y = trunkHeight;

    const frondMat = new THREE.MeshStandardMaterial({
      color: 0x2e6b27,
      roughness: 0.7,
      side: THREE.DoubleSide
    });

    for (let f = 0; f < frondCount; f++) {
      const angle = (f / frondCount) * Math.PI * 2;
      const frondGeo = new THREE.PlaneGeometry(0.7 * scale, 2.8 * scale, 6, 8);
      const fPos = frondGeo.attributes.position;

      // Arc frond outwards and downwards
      for (let j = 0; j < fPos.count; j++) {
        const fy = fPos.getY(j);
        const droop = Math.pow(Math.max(0, (fy + 1.4 * scale) / (2.8 * scale)), 2) * 0.9 * scale;
        fPos.setZ(j, droop);
      }
      frondGeo.computeVertexNormals();

      const frondMesh = new THREE.Mesh(frondGeo, frondMat);
      frondMesh.rotation.x = -Math.PI / 3;
      frondMesh.rotation.z = angle;
      frondMesh.castShadow = true;
      frondGroup.add(frondMesh);
    }

    palmGroup.add(frondGroup);
    palmGroup.userData = { fronds: frondGroup, baseAngle: 0 };
    return palmGroup;
  }

  createFloraPatches() {
    // Lavender (Purple flowers of the desert)
    const lavenderGeo = new THREE.ConeGeometry(0.08, 0.45, 6);
    const lavenderMat = new THREE.MeshStandardMaterial({
      color: 0x8a4baf,
      roughness: 0.8
    });

    for (let i = 0; i < 35; i++) {
      const lav = new THREE.Mesh(lavenderGeo, lavenderMat);
      const angle = Math.random() * Math.PI * 2;
      const dist = 3.5 + Math.random() * 8;
      lav.position.set(Math.cos(angle) * dist, -2.1, Math.sin(angle) * dist);
      lav.rotation.z = (Math.random() - 0.5) * 0.3;
      this.group.add(lav);
    }

    // Juniper Shrubs (عرعر)
    const juniperGeo = new THREE.DodecahedronGeometry(0.45, 1);
    const juniperMat = new THREE.MeshStandardMaterial({
      color: 0x1f5429,
      roughness: 0.85
    });

    for (let k = 0; k < 12; k++) {
      const jun = new THREE.Mesh(juniperGeo, juniperMat);
      jun.position.set(-4 + (k % 4) * 2.5 + Math.random(), -2.2, -3 - Math.random() * 6);
      jun.scale.set(1 + Math.random() * 0.5, 0.8 + Math.random() * 0.4, 1 + Math.random() * 0.5);
      jun.castShadow = true;
      this.group.add(jun);
    }
  }

  initArchitecture() {
    // 1. Mudbrick Najdi Watchtower (قصر ومربأ طيني تقليدي)
    const towerGroup = new THREE.Group();
    towerGroup.position.set(-11, -2.4, -12);

    const towerMat = new THREE.MeshStandardMaterial({
      color: 0xb58c58,
      roughness: 0.95
    });

    // Tapered tower body
    const towerBodyGeo = new THREE.CylinderGeometry(1.6, 2.2, 7.5, 12);
    const towerBody = new THREE.Mesh(towerBodyGeo, towerMat);
    towerBody.position.y = 3.75;
    towerBody.castShadow = true;
    towerGroup.add(towerBody);

    // Triangular Najdi crenellations on top (شرفات مثلثة)
    for (let c = 0; c < 8; c++) {
      const cAngle = (c / 8) * Math.PI * 2;
      const crenGeo = new THREE.ConeGeometry(0.28, 0.6, 3);
      const cren = new THREE.Mesh(crenGeo, towerMat);
      cren.position.set(Math.cos(cAngle) * 1.55, 7.8, Math.sin(cAngle) * 1.55);
      towerGroup.add(cren);
    }

    this.group.add(towerGroup);

    // 2. Distant Modern Silhouette Landmarks in the morning haze (برج المملكة والفيصلية)
    const distantGroup = new THREE.Group();
    distantGroup.position.set(18, -2.4, -45);

    const hazeMat = new THREE.MeshBasicMaterial({
      color: 0xaec8d8,
      transparent: true,
      opacity: 0.45
    });

    // Kingdom Centre Silhouette
    const kingdomGeo = new THREE.BoxGeometry(2.4, 18, 1.4);
    const kingdomMesh = new THREE.Mesh(kingdomGeo, hazeMat);
    kingdomMesh.position.set(0, 9, 0);
    distantGroup.add(kingdomMesh);

    // Al Faisaliah Pyramid Silhouette
    const faisaliahGeo = new THREE.ConeGeometry(2.2, 14, 4);
    const faisaliahMesh = new THREE.Mesh(faisaliahGeo, hazeMat);
    faisaliahMesh.position.set(7, 7, 3);
    distantGroup.add(faisaliahMesh);

    this.group.add(distantGroup);
  }

  initAtmosphericDust() {
    // 120 Floating Golden Sand Dust Particles
    const count = 120;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 35;
      pos[i + 1] = Math.random() * 8 - 1;
      pos[i + 2] = (Math.random() - 0.5) * 25;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xf9dfad,
      size: 0.06,
      transparent: true,
      opacity: 0.65
    });

    this.dustParticles = new THREE.Points(geo, mat);
    this.group.add(this.dustParticles);
  }

  update(time, delta) {
    // Gentle sway of palm fronds with the breeze
    this.palms.forEach((p, idx) => {
      if (p.userData && p.userData.fronds) {
        const sway = Math.sin(time * 1.8 + idx * 1.2) * 0.04;
        p.userData.fronds.rotation.z = sway;
        p.userData.fronds.rotation.x = sway * 0.5;
      }
    });

    // Ambient dust drift
    if (this.dustParticles) {
      const pos = this.dustParticles.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i) + delta * 0.4;
        if (x > 18) x = -18;
        pos.setX(i, x);
      }
      pos.needsUpdate = true;
    }
  }

  setVisible(visible) {
    this.group.visible = visible;
  }
}
