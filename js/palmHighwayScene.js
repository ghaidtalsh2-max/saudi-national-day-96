/**
 * palmHighwayScene.js - مشهد طريق النخيل والقيادة المستمرة في قلب السعودية (Three.js)
 * - انتقال مستمر سينمائي دون أي قطع (Zero Cuts)
 * - طريق أسفلتي ممتد بخطوط مضيئة متدفقة للأمام ("نمشييييي إلى الأمام")
 * - مزارع وبساتين النخيل الحساوي والقصيمي على الجانبين الأيمن والأيسر
 * - تدرج معماري طبيعي في الأفق: التراث (المصمك والدرعية) ← الجسور والبنية ← السعودية الحديثة (المملكة، الفيصلية، كافد)
 * - فيزياء حركة السيارة واهتزازات مقصورة القيادة الخفيفة وبتلات الورد المتطايرة
 */

import * as THREE from 'three';

export class PalmHighwayScene {
  constructor(scene, onComplete) {
    this.scene = scene;
    this.onComplete = onComplete;
    this.group = new THREE.Group();

    this.speed = 24.0; // Highway cruising velocity
    this.roadOffset = 0;
    this.journeyDistance = 0;
    this.completed = false;

    this.roadMesh = null;
    this.palmsLeft = [];
    this.palmsRight = [];
    this.landmarks = [];
    this.petals = null;

    this.initRoad();
    this.initPalmCorridors();
    this.initLandmarkEvolution();
    this.initWindPetals();

    this.scene.add(this.group);
    this.group.visible = false;
  }

  reset() {
    this.journeyDistance = 0;
    this.completed = false;
    if (this.heritageGroup) {
      this.heritageGroup.position.set(0, -2.4, -60);
      this.heritageGroup.visible = true;
    }
    if (this.modernHorizonGroup) {
      this.modernHorizonGroup.position.set(0, -2.4, -145);
    }
  }

  initRoad() {
    // 1. Asphalt Highway Plane (width: 14, length: 220)
    const roadLength = 220;
    const roadWidth = 14;
    const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength, 1, 60);

    // Custom Canvas Texture for Highway with Asphalt Grain and Dashed Markings
    const roadCanvas = document.createElement('canvas');
    roadCanvas.width = 512;
    roadCanvas.height = 1024;
    const ctx = roadCanvas.getContext('2d');

    // Asphalt dark grey base
    ctx.fillStyle = '#222524';
    ctx.fillRect(0, 0, 512, 1024);

    // Micro asphalt grain
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let i = 0; i < 4000; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 1024, 2, 2);
    }

    // Yellow side shoulder lines
    ctx.fillStyle = '#e5b138';
    ctx.fillRect(36, 0, 10, 1024);
    ctx.fillRect(512 - 46, 0, 10, 1024);

    // Center dashed white lines (Repeating pattern)
    ctx.fillStyle = '#ffffff';
    for (let y = 0; y < 1024; y += 128) {
      ctx.fillRect(251, y + 20, 10, 88);
    }

    // Road Studs (عيون القطط)
    ctx.fillStyle = '#ffd700';
    for (let y = 0; y < 1024; y += 64) {
      ctx.beginPath();
      ctx.arc(36 + 5, y + 10, 3, 0, Math.PI * 2);
      ctx.arc(512 - 46 + 5, y + 10, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    this.roadTexture = new THREE.CanvasTexture(roadCanvas);
    this.roadTexture.wrapS = THREE.RepeatWrapping;
    this.roadTexture.wrapT = THREE.RepeatWrapping;
    this.roadTexture.repeat.set(1, 16);

    const roadMat = new THREE.MeshStandardMaterial({
      map: this.roadTexture,
      roughness: 0.82,
      metalness: 0.08
    });

    this.roadMesh = new THREE.Mesh(roadGeo, roadMat);
    this.roadMesh.rotation.x = -Math.PI / 2;
    this.roadMesh.position.set(0, -2.35, -50);
    this.roadMesh.receiveShadow = true;
    this.group.add(this.roadMesh);

    // 2. Road Shoulders / Desert Sands
    const sandGeo = new THREE.PlaneGeometry(90, roadLength, 1, 20);
    const sandMat = new THREE.MeshStandardMaterial({
      color: 0xd9b37a,
      roughness: 0.95
    });

    const leftSand = new THREE.Mesh(sandGeo, sandMat);
    leftSand.rotation.x = -Math.PI / 2;
    leftSand.position.set(-52, -2.38, -50);
    leftSand.receiveShadow = true;
    this.group.add(leftSand);

    const rightSand = new THREE.Mesh(sandGeo, sandMat);
    rightSand.rotation.x = -Math.PI / 2;
    rightSand.position.set(52, -2.38, -50);
    rightSand.receiveShadow = true;
    this.group.add(rightSand);
  }

  initPalmCorridors() {
    // Two dense parallel lines of Saudi Date Palms rushing past
    const countPerSide = 22;
    const spacing = 9.5;

    for (let i = 0; i < countPerSide; i++) {
      const zPos = -i * spacing;

      // Left Palm
      const palmL = this.createPalmMesh();
      palmL.position.set(-10 - Math.random() * 3.0, -2.4, zPos);
      this.group.add(palmL);
      this.palmsLeft.push(palmL);

      // Right Palm
      const palmR = this.createPalmMesh();
      palmR.position.set(10 + Math.random() * 3.0, -2.4, zPos);
      this.group.add(palmR);
      this.palmsRight.push(palmR);
    }
  }

  createPalmMesh() {
    const palm = new THREE.Group();
    const h = 6.4 + Math.random() * 1.8;

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.22, 0.40, h, 10);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x614833,
      roughness: 0.95
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = h / 2;
    trunk.castShadow = true;
    palm.add(trunk);

    // Crown of Fronds
    const crown = new THREE.Group();
    crown.position.y = h;
    const frondMat = new THREE.MeshStandardMaterial({
      color: 0x276321,
      roughness: 0.75,
      side: THREE.DoubleSide
    });

    for (let f = 0; f < 12; f++) {
      const ang = (f / 12) * Math.PI * 2;
      const frondGeo = new THREE.PlaneGeometry(0.7, 3.4, 4, 6);
      const pos = frondGeo.attributes.position;
      for (let j = 0; j < pos.count; j++) {
        const y = pos.getY(j);
        pos.setZ(j, Math.pow(Math.max(0, (y + 1.7) / 3.4), 2) * 1.15);
      }
      frondGeo.computeVertexNormals();

      const fMesh = new THREE.Mesh(frondGeo, frondMat);
      fMesh.rotation.x = -Math.PI / 3;
      fMesh.rotation.z = ang;
      fMesh.castShadow = true;
      crown.add(fMesh);
    }
    palm.add(crown);
    return palm;
  }

  initLandmarkEvolution() {
    // 1. Heritage Era Group (Mudbrick Masmak & Diriyah At-Turaif)
    this.heritageGroup = new THREE.Group();
    this.heritageGroup.position.set(0, -2.4, -60);

    const mudMat = new THREE.MeshStandardMaterial({ color: 0xc49c67, roughness: 0.95 });
    // Masmak fortress gateway mockup
    const masmakWall = new THREE.Mesh(new THREE.BoxGeometry(22, 7, 5), mudMat);
    masmakWall.position.set(-18, 3.5, 0);
    masmakWall.castShadow = true;
    this.heritageGroup.add(masmakWall);

    // Triangular battlements
    for (let b = 0; b < 9; b++) {
      const bTri = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.8, 3), mudMat);
      bTri.position.set(-27 + b * 2.2, 7.4, 0);
      this.heritageGroup.add(bTri);
    }
    this.group.add(this.heritageGroup);

    // 2. Modern Saudi Horizon Group (Kingdom Centre, Al Faisaliah, KAFD Skyscrapers)
    this.modernHorizonGroup = new THREE.Group();
    this.modernHorizonGroup.position.set(0, -2.4, -145);

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x4a7c9d,
      roughness: 0.2,
      metalness: 0.85
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.9
    });

    // Kingdom Centre Tower
    const kingdomTower = new THREE.Group();
    kingdomTower.position.set(-16, 0, 0);
    const kLeft = new THREE.Mesh(new THREE.BoxGeometry(2.4, 42, 3.5), glassMat);
    kLeft.position.set(-2.4, 21, 0);
    const kRight = new THREE.Mesh(new THREE.BoxGeometry(2.4, 42, 3.5), glassMat);
    kRight.position.set(2.4, 21, 0);
    const kBridge = new THREE.Mesh(new THREE.BoxGeometry(7.2, 3.2, 3.5), glassMat);
    kBridge.position.set(0, 40.5, 0);
    kingdomTower.add(kLeft, kRight, kBridge);
    this.modernHorizonGroup.add(kingdomTower);

    // Al Faisaliah Tower with golden sphere
    const faisaliahTower = new THREE.Group();
    faisaliahTower.position.set(18, 0, 5);
    const fPyramid = new THREE.Mesh(new THREE.ConeGeometry(4.6, 36, 4), glassMat);
    fPyramid.position.set(0, 18, 0);
    faisaliahTower.add(fPyramid);
    const fSphere = new THREE.Mesh(new THREE.SphereGeometry(1.8, 24, 24), goldMat);
    fSphere.position.set(0, 29, 0);
    faisaliahTower.add(fSphere);
    this.modernHorizonGroup.add(faisaliahTower);

    // KAFD Towers
    for (let k = 0; k < 8; k++) {
      const kafdGeo = new THREE.CylinderGeometry(2.0, 3.0, 24 + Math.random() * 18, 6);
      const kafdMesh = new THREE.Mesh(kafdGeo, glassMat);
      kafdMesh.position.set(-35 + k * 10, 16 + Math.random() * 6, -15 - Math.random() * 14);
      this.modernHorizonGroup.add(kafdMesh);
    }

    this.group.add(this.modernHorizonGroup);
  }

  initWindPetals() {
    // 100 Rose & Lavender swirling particles in vehicle wake
    const count = 100;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 14;
      pos[i + 1] = Math.random() * 3.5 - 1.5;
      pos[i + 2] = -Math.random() * 60;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xdf4a78, // Taif Rose Petal Pink
      size: 0.16,
      transparent: true,
      opacity: 0.85
    });

    this.petals = new THREE.Points(geo, mat);
    this.group.add(this.petals);
  }

  update(delta, time) {
    if (!this.group.visible) return;

    // Advance vehicle distance
    const distDelta = this.speed * delta;
    this.journeyDistance += distDelta;

    // Shift road markings texture to create infinite asphalt motion
    if (this.roadTexture) {
      this.roadTexture.offset.y = (this.roadTexture.offset.y + distDelta * 0.08) % 1;
    }

    // Recycle palms continuously as they fly past behind the camera
    const maxZ = 14;
    const minZ = -190;
    const loopSpan = maxZ - minZ;

    const shiftPalms = (arr) => {
      arr.forEach(p => {
        p.position.z += distDelta;
        if (p.position.z > maxZ) {
          p.position.z -= loopSpan;
        }
        // Palm sway in high-speed wind
        p.rotation.z = Math.sin(time * 3.2 + p.position.z * 0.1) * 0.03;
      });
    };

    shiftPalms(this.palmsLeft);
    shiftPalms(this.palmsRight);

    // Architectural Progression (Heritage -> Modern Skyline)
    if (this.journeyDistance < 90) {
      this.heritageGroup.position.z += distDelta * 0.45;
      this.modernHorizonGroup.position.z = -145 + this.journeyDistance * 0.35;
    } else {
      this.heritageGroup.visible = false;
      this.modernHorizonGroup.position.z = Math.min(-35, -145 + this.journeyDistance * 0.45);
    }

    // Auto-complete road journey when arriving at destination
    if (this.journeyDistance > 240 && !this.completed) {
      this.completed = true;
      if (this.onComplete) {
        this.onComplete();
      }
    }

    // Petals flight turbulence
    if (this.petals) {
      const pPos = this.petals.geometry.attributes.position;
      for (let i = 0; i < pPos.count; i++) {
        let z = pPos.getZ(i) + distDelta * 1.5;
        let x = pPos.getX(i) + Math.sin(time * 4 + i) * 0.04;
        let y = pPos.getY(i) + Math.cos(time * 3 + i) * 0.02;

        if (z > 6) {
          z = -65;
          x = (Math.random() - 0.5) * 14;
          y = Math.random() * 3.5 - 1.5;
        }
        pPos.setZ(i, z);
        pPos.setX(i, x);
        pPos.setY(i, y);
      }
      pPos.needsUpdate = true;
    }
  }

  setVisible(visible) {
    this.group.visible = visible;
  }
}
