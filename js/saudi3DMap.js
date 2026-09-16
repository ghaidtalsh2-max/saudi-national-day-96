/**
 * saudi3DMap.js - خريطة المملكة العربية السعودية كعالم تفاعلي ثلاثي الأبعاد (Three.js)
 * - مجسم تضاريسي طافي للمملكة بتضاريس نجد وجبال السروات والساحلين
 * - منارات جغرافية مضيئة (Interactive 3D City Beacons)
 * - انتقال سينمائي غامر (Zoom & Dive) عند اختيار أي مدينة للدخول في عالمها المصغر
 */

import * as THREE from 'three';
import { sound } from './audioEngine.js';

export class Saudi3DMap {
  constructor(scene, camera, onCitySelected) {
    this.scene = scene;
    this.camera = camera;
    this.onCitySelected = onCitySelected;

    this.group = new THREE.Group();
    this.beacons = [];
    this.mapMesh = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // 7 Major Regional Hubs with exact geographic positions on 3D map
    this.cities = [
      { id: 'riyadh', nameAr: 'الرياض', x: 1.5, z: -0.8, color: '#d4af37', quote: 'عاصمة المجد ودرعية التاريخ' },
      { id: 'taif', nameAr: 'الطائف', x: -3.8, z: 1.6, color: '#e91e63', quote: 'عروس المصايف ومدينة الورد والضباب' },
      { id: 'hail', nameAr: 'حائل', x: -1.2, z: -4.6, color: '#ff9800', quote: 'عروس الشمال وكرم حاتم الطائي' },
      { id: 'jeddah', nameAr: 'جدة', x: -4.6, z: 1.2, color: '#00bcd4', quote: 'عروس البحر الأحمر وحارات البلد العتيق' },
      { id: 'alula', nameAr: 'العلا', x: -4.2, z: -3.5, color: '#ffc107', quote: 'متحف التاريخ الحي ومدائن صالح وقاعة مرايا' },
      { id: 'ahsa', nameAr: 'الأحساء والشرقية', x: 5.2, z: -0.4, color: '#4caf50', quote: 'بحر النخيل وواحة العيون وجبل القارة' },
      { id: 'asir', nameAr: 'عسير وأبها', x: -2.8, z: 4.8, color: '#2e7d32', quote: 'قمم السروات الخضراء وقصور رجال ألمع' }
    ];

    this.initMapMesh();
    this.initCityBeacons();
    this.initEvents();

    this.scene.add(this.group);
    this.group.visible = false;
  }

  initMapMesh() {
    // 3D Topographic Peninsula Slab
    const shape = new THREE.Shape();
    // Simplified elegant silhouette of the Kingdom
    shape.moveTo(-5.5, -5.0); // Tabuk
    shape.lineTo(0.5, -5.6);  // Northern Borders
    shape.lineTo(6.5, -2.5);  // Eastern Province coast
    shape.lineTo(7.5, 2.5);   // Empty Quarter East
    shape.lineTo(3.2, 5.8);   // Najran
    shape.lineTo(-1.8, 6.2);  // Jazan
    shape.lineTo(-3.5, 4.0);  // Asir
    shape.lineTo(-5.2, 0.8);  // Jeddah / Makkah
    shape.lineTo(-5.8, -2.5); // Yanbu / Madinah
    shape.closePath();

    const extrudeSettings = {
      depth: 0.65,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.15,
      bevelThickness: 0.15
    };

    const mapGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    mapGeo.computeVertexNormals();

    const mapMat = new THREE.MeshStandardMaterial({
      color: 0x173121, // Royal Saudi Dark Green
      roughness: 0.45,
      metalness: 0.25
    });

    this.mapMesh = new THREE.Mesh(mapGeo, mapMat);
    this.mapMesh.rotation.x = -Math.PI / 2;
    this.mapMesh.position.set(0, -1.5, 0);
    this.mapMesh.receiveShadow = true;
    this.group.add(this.mapMesh);

    // Glowing Emerald Border Ribbon
    const edgeGeo = new THREE.EdgesGeometry(mapGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      linewidth: 2
    });
    const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
    this.mapMesh.add(edgeLine);
  }

  initCityBeacons() {
    this.cities.forEach(city => {
      const bGroup = new THREE.Group();
      bGroup.position.set(city.x, -0.6, city.z);

      // Beacon Base Glow Ring
      const ringGeo = new THREE.RingGeometry(0.25, 0.4, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(city.color),
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      bGroup.add(ring);

      // Vertical Light Pillar
      const beamGeo = new THREE.CylinderGeometry(0.04, 0.08, 2.2, 12);
      const beamMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(city.color),
        transparent: true,
        opacity: 0.75
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = 1.1;
      bGroup.add(beam);

      // Floating Orb on Top
      const orbGeo = new THREE.SphereGeometry(0.22, 16, 16);
      const orbMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(city.color),
        emissive: new THREE.Color(city.color),
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.y = 2.2;
      bGroup.add(orb);

      // Text Tag Canvas Billboard
      const tagCanvas = document.createElement('canvas');
      tagCanvas.width = 256;
      tagCanvas.height = 72;
      const tCtx = tagCanvas.getContext('2d');
      tCtx.fillStyle = 'rgba(13, 18, 15, 0.85)';
      tCtx.roundRect(4, 4, 248, 64, 16);
      tCtx.fill();
      tCtx.strokeStyle = city.color;
      tCtx.lineWidth = 3;
      tCtx.stroke();

      tCtx.fillStyle = '#ffffff';
      tCtx.font = 'bold 26px "Tajawal", "Amiri", sans-serif';
      tCtx.textAlign = 'center';
      tCtx.textBaseline = 'middle';
      tCtx.fillText(city.nameAr, 128, 36);

      const tagTex = new THREE.CanvasTexture(tagCanvas);
      const tagMat = new THREE.SpriteMaterial({ map: tagTex });
      const tagSprite = new THREE.Sprite(tagMat);
      tagSprite.position.set(0, 2.9, 0);
      tagSprite.scale.set(1.8, 0.5, 1);
      bGroup.add(tagSprite);

      bGroup.userData = { city: city, orb: orb, beam: beam, baseScale: 1.0 };
      this.group.add(bGroup);
      this.beacons.push(bGroup);
    });
  }

  initEvents() {
    window.addEventListener('pointermove', (e) => {
      if (!this.group.visible) return;
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.checkHover();
    });

    window.addEventListener('click', (e) => {
      if (!this.group.visible) return;
      this.checkClick();
    });
  }

  checkHover() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.beacons, true);

    let hoveredCity = null;
    this.beacons.forEach(b => {
      b.userData.orb.scale.set(1, 1, 1);
      b.userData.beam.material.opacity = 0.75;
    });

    if (intersects.length > 0) {
      let root = intersects[0].object;
      while (root.parent && !root.userData?.city) {
        root = root.parent;
      }
      if (root && root.userData?.city) {
        hoveredCity = root.userData.city;
        root.userData.orb.scale.set(1.4, 1.4, 1.4);
        root.userData.beam.material.opacity = 1.0;
        document.body.style.cursor = 'pointer';

        // Update bottom caption prompt
        const promptEl = document.getElementById('caption-prompt-action');
        if (promptEl) {
          promptEl.innerHTML = `<span>انقر للدخول في عالم: <strong>${hoveredCity.nameAr}</strong> — ${hoveredCity.quote}</span>`;
        }
        return;
      }
    }
    document.body.style.cursor = 'default';
  }

  checkClick() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.beacons, true);

    if (intersects.length > 0) {
      let root = intersects[0].object;
      while (root.parent && !root.userData?.city) {
        root = root.parent;
      }
      if (root && root.userData?.city) {
        const city = root.userData.city;
        sound.playChime(680);
        if (this.onCitySelected) {
          this.onCitySelected(city.id);
        }
      }
    }
  }

  update(time, delta) {
    if (!this.group.visible) return;

    // Subtle breathing pulse of city beacon beacons
    this.beacons.forEach((b, i) => {
      const pulse = Math.sin(time * 3.5 + i * 1.4) * 0.15;
      b.position.y = -0.6 + pulse * 0.1;
      b.userData.orb.position.y = 2.2 + pulse * 0.2;
    });

    // Slow majestic topographic map tilt
    this.group.rotation.y = Math.sin(time * 0.3) * 0.05;
  }

  setVisible(visible) {
    this.group.visible = visible;
  }
}
