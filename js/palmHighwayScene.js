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
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();

    this.speed = 22.0; // Highway cruising velocity
    this.roadOffset = 0;
    this.journeyDistance = 0;

    this.roadMesh = null;
    this.palmsLeft = [];
    this.palmsRight = [];
    this.landmarks = [];
    this.petals = null;

    this.transitionProgress = 0; // 0 (Desert trail) to 1 (Asphalt highway)
    this.architecturalPhase = 0; // 0 (Heritage) -> 1 (Development) -> 2 (Modern Mega City)

    this.initRoad();
    this.initPalmCorridors();
    this.initLandmarkEvolution();
    this.initWindPetals();

    this.scene.add(this.group);
    this.group.visible = false;
  }

  initRoad() {
    // 1. Asphalt Highway Plane (width: 14, length: 180)
    const roadLength = 180;
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

    this.roadTexture = new THREE.CanvasTexture(roadCanvas);
    this.roadTexture.wrapS = THREE.RepeatWrapping;
    this.roadTexture.wrapT = THREE.RepeatWrapping;
    this.roadTexture.repeat.set(1, 14);

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
    const sandGeo = new THREE.PlaneGeometry(80, roadLength, 1, 20);
    const sandMat = new THREE.MeshStandardMaterial({
      color: 0xd9b37a,
      roughness: 0.95
    });

    const leftSand = new THREE.Mesh(sandGeo, sandMat);
    leftSand.rotation.x = -Math.PI / 2;
    leftSand.position.set(-47, -2.38, -50);
    leftSand.receiveShadow = true;
    this.group.add(leftSand);

    const rightSand = new THREE.Mesh(sandGeo, sandMat);
    rightSand.rotation.x = -Math.PI / 2;
    rightSand.position.set(47, -2.38, -50);
    rightSand.receiveShadow = true;
    this.group.add(rightSand);
  }

  initPalmCorridors() {
    // Two dense parallel lines of Saudi Date Palms rushing past
    const countPerSide = 18;
    const spacing = 9.5;

    for (let i = 0; i < countPerSide; i++) {
      const zPos = -i * spacing;

      // Left Palm
      const palmL = this.createPalmMesh();
      palmL.position.set(-10 - Math.random() * 2.5, -2.4, zPos);
      this.group.add(palmL);
      this.palmsLeft.push(palmL);

      // Right Palm
      const palmR = this.createPalmMesh();
      palmR.position.set(10 + Math.random() * 2.5, -2.4, zPos);
      this.group.add(palmR);
      this.palmsRight.push(palmR);
    }
  }

  createPalmMesh() {
    const palm = new THREE.Group();
    const h = 6.2 + Math.random() * 1.5;

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.22, 0.38, h, 10);
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
      const frondGeo = new THREE.PlaneGeometry(0.7, 3.2, 4, 6);
      const pos = frondGeo.attributes.position;
      for (let j = 0; j < pos.count; j++) {
        const y = pos.getY(j);
        pos.setZ(j, Math.pow(Math.max(0, (y + 1.6) / 3.2), 2) * 1.1);
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
    this.modernHorizonGroup.position.set(0, -2.4, -135);

    // Glass & metallic reflective materials
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

    // Kingdom Centre Tower with signature inverted parabolic arch
    const kingdomTower = new THREE.Group();
    kingdomTower.position.set(-14, 0, 0);
    const kLeft = new THREE.Mesh(new THREE.BoxGeometry(2.2, 38, 3.5), glassMat);
    kLeft.position.set(-2.2, 19, 0);
    const kRight = new THREE.Mesh(new THREE.BoxGeometry(2.2, 38, 3.5), glassMat);
    kRight.position.set(2.2, 19, 0);
    const kBridge = new THREE.Mesh(new THREE.BoxGeometry(6.6, 2.8, 3.5), glassMat);
    kBridge.position.set(0, 36.6, 0);
    kingdomTower.add(kLeft, kRight, kBridge);
    this.modernHorizonGroup.add(kingdomTower);

    // Al Faisaliah Tower with golden sphere
    const faisaliahTower = new THREE.Group();
    faisaliahTower.position.set(16, 0, 5);
    const fPyramid = new THREE.Mesh(new THREE.ConeGeometry(4.2, 32, 4), glassMat);
    fPyramid.position.set(0, 16, 0);
    faisaliahTower.add(fPyramid);
    const fSphere = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 24), goldMat);
    fSphere.position.set(0, 26, 0);
    faisaliahTower.add(fSphere);
    this.modernHorizonGroup.add(faisaliahTower);

    // KAFD Crystal Towers (King Abdullah Financial District)
    for (let k = 0; k < 7; k++) {
      const kafdGeo = new THREE.CylinderGeometry(1.8, 2.8, 22 + Math.random() * 16, 6);
      const kafdMesh = new THREE.Mesh(kafdGeo, glassMat);
      kafdMesh.position.set(-30 + k * 9, 14 + Math.random() * 6, -15 - Math.random() * 12);
      this.modernHorizonGroup.add(kafdMesh);
    }

    this.group.add(this.modernHorizonGroup);
  }

  initWindPetals() {
    // 90 Rose & Lavender swirling particles in vehicle wake
    const count = 90;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 12;
      pos[i + 1] = Math.random() * 3.5 - 1.5;
      pos[i + 2] = -Math.random() * 50;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xdf4a78, // Taif Rose Petal Pink & Lavender
      size: 0.14,
      transparent: true,
      opacity: 0.8
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
    const maxZ = 12;
    const minZ = -160;
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
    // As journey progresses, heritage moves back and modern towers draw closer
    if (this.journeyDistance < 80) {
      this.heritageGroup.position.z += distDelta * 0.4;
      this.modernHorizonGroup.position.z = -140 + this.journeyDistance * 0.4;
    } else {
      this.heritageGroup.visible = false;
      this.modernHorizonGroup.position.z = Math.min(-35, -140 + this.journeyDistance * 0.5);
    }

    // Petals flight turbulence
    if (this.petals) {
      const pPos = this.petals.geometry.attributes.position;
      for (let i = 0; i < pPos.count; i++) {
        let z = pPos.getZ(i) + distDelta * 1.4;
        let x = pPos.getX(i) + Math.sin(time * 4 + i) * 0.04;
        let y = pPos.getY(i) + Math.cos(time * 3 + i) * 0.02;

        if (z > 5) {
          z = -55;
          x = (Math.random() - 0.5) * 12;
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
