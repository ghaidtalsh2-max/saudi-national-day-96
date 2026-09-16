/**
 * cityWorlds.js - عوالم المدن المصغرة الحية ثلاثية الأبعاد (Three.js)
 * - تجربة غامرة كاملة لكل مدينة بهويتها الحقيقية:
 *   1. الرياض: هضبة نجد، قصر المصمك، وأبراج كافد المعاصرة
 *   2. الطائف: جبال الهدا، بساتين الورد الجوري، الضباب، والتلفريك
 *   3. حائل: رمال النفود الحمراء، جبال أجا وسلمى، وشبة النار
 *   4. جدة: حارات البلد القديمة برواشينها الخشبية، ونسيم البحر الأحمر
 *   5. العلا: وادي عشار، قاعة مرايا العاكسة، ومدائن صالح
 *   6. الأحساء: بحر النخيل اللانهائي، جبل القارة، وعيون الماء
 *   7. عسير وأبها: قمم السروات الشاهقة، قصور رجال ألمع الحجرية، وغابات العرعر
 */

import * as THREE from 'three';
import { sound } from './audioEngine.js';
import { CulturalGamesEngine } from './culturalGames.js';

export class CityWorldsManager {
  constructor(scene, camera, onBackToMap) {
    this.scene = scene;
    this.camera = camera;
    this.onBackToMap = onBackToMap;

    this.group = new THREE.Group();
    this.activeCityId = null;

    // DOM UI Hooks
    this.overlay = document.getElementById('city-world-overlay');
    this.cityNameEl = document.getElementById('city-active-name');
    this.cityTagEl = document.getElementById('city-active-tag');
    this.gameTitleEl = document.getElementById('game-active-title');
    this.btnBack = document.getElementById('btn-back-to-map');

    // Mini Game Engine Instance
    const gameCanvas = document.getElementById('city-interactive-canvas');
    this.gameEngine = gameCanvas ? new CulturalGamesEngine(gameCanvas) : null;

    this.cityData = {
      riyadh: {
        nameAr: 'الرياض',
        tag: 'عاصمة المجد ودرعية التاريخ وقلب المملكة',
        gameTitle: '⚔️ إيقاع طبول وسيوف العرضة النجدية',
        audioKey: 'riyadh', // Official Najdi Ardah (00:35)
        fogColor: 0x221810,
        skyColor: 0xdeb887
      },
      taif: {
        nameAr: 'الطائف',
        tag: 'عروس المصايف ومدينة الورد والضباب بين قمم الهدا والشفا',
        gameTitle: '🌸 قطف وتقطير الورد الطائفي في قدر النحاس',
        audioKey: 'taif', // Official Taif Al-Majroor
        fogColor: 0xd8e8f0,
        skyColor: 0xa8c8dc
      },
      hail: {
        nameAr: 'حائل',
        tag: 'عروس الشمال، جبال أجا وسلمى، وشبة النار في النفود',
        gameTitle: '🦅 سامري حائل وصيد الصقارة في النفود',
        audioKey: 'hail', // Official Hail Samri
        fogColor: 0x3d2010,
        skyColor: 0xe67e22
      },
      jeddah: {
        nameAr: 'جدة',
        tag: 'عروس البحر الأحمر وحارات البلد العتيق برواشينها الأصيلة',
        gameTitle: '🪟 ترميم الرواشين الحجازية وإنارة فوانيس البلد',
        audioKey: 'badawi',
        fogColor: 0x102830,
        skyColor: 0x4dd0e1
      },
      alula: {
        nameAr: 'العلا',
        tag: 'متحف التاريخ الحي، مدائن صالح، وقاعة مرايا الساحرة',
        gameTitle: '🪞 مرايا قاعة مرايا وانعكاس شمس الحِجر',
        audioKey: 'badawi',
        fogColor: 0x382216,
        skyColor: 0xd4a373
      },
      ahsa: {
        nameAr: 'الأحساء',
        tag: 'بحر النخيل اللانهائي، جبل القارة، وعيون الماء العذبة',
        gameTitle: '🌴 واحة عيون الماء وجني التمر الحساوي',
        audioKey: 'anthem',
        fogColor: 0x182c18,
        skyColor: 0x81c784
      },
      asir: {
        nameAr: 'عسير وأبها',
        tag: 'سيدة الضباب، جبال السروات الخضراء، وقصور رجال ألمع',
        gameTitle: '🎨 تلوين نقوش القط العسيري الهندسية التراثية',
        audioKey: 'anthem',
        fogColor: 0x223624,
        skyColor: 0x66bb6a
      }
    };

    this.initEvents();
    this.scene.add(this.group);
    this.group.visible = false;
  }

  initEvents() {
    this.btnBack?.addEventListener('click', () => {
      sound.playChime(520);
      this.exit();
      if (this.onBackToMap) this.onBackToMap();
    });
  }

  enterCity(cityId) {
    this.activeCityId = cityId;
    const data = this.cityData[cityId] || this.cityData.riyadh;

    // 1. Update Overlay Text
    if (this.cityNameEl) this.cityNameEl.textContent = data.nameAr;
    if (this.cityTagEl) this.cityTagEl.textContent = data.tag;
    if (this.gameTitleEl) this.gameTitleEl.textContent = data.gameTitle;

    // 2. Clear old city 3D objects
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }

    // 3. Build Distinct 3D Mini-World for this city
    this.buildCity3DWorld(cityId);

    // 4. Start Cultural Mini Game
    if (this.gameEngine) {
      this.gameEngine.start(cityId);
    }

    // 5. Trigger Official Local City Audio with Crossfade
    sound.playTrack(data.audioKey, 18);

    // 6. Show Overlay
    this.group.visible = true;
    this.overlay?.classList.add('active');
  }

  exit() {
    if (this.gameEngine) {
      this.gameEngine.stop();
    }
    this.overlay?.classList.remove('active');
    this.group.visible = false;
    sound.stopTrack(this.cityData[this.activeCityId]?.audioKey, 1.0);
  }

  buildCity3DWorld(cityId) {
    // 1. Terrain Base
    const terrainGeo = new THREE.PlaneGeometry(60, 60, 32, 32);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: (cityId === 'asir' || cityId === 'ahsa') ? 0x2e5c26 : 0xd2a56d,
      roughness: 0.9
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -2.2;
    terrain.receiveShadow = true;
    this.group.add(terrain);

    // 2. City Specific Monument
    if (cityId === 'riyadh') {
      // Masmak Wall + Kingdom Tower Arch
      const masmak = new THREE.Mesh(
        new THREE.BoxGeometry(16, 6, 4),
        new THREE.MeshStandardMaterial({ color: 0xc49c67, roughness: 0.95 })
      );
      masmak.position.set(-6, 0.8, -12);
      this.group.add(masmak);

      const kTower = new THREE.Mesh(
        new THREE.BoxGeometry(4, 28, 4),
        new THREE.MeshStandardMaterial({ color: 0x4a7c9d, metalness: 0.8, roughness: 0.2 })
      );
      kTower.position.set(10, 11.8, -20);
      this.group.add(kTower);
    } else if (cityId === 'taif') {
      // Sarawat Mountain Crests & Teleferic Cables
      for (let m = 0; m < 5; m++) {
        const mGeo = new THREE.ConeGeometry(8 + m * 2, 18 + m * 4, 6);
        const mMat = new THREE.MeshStandardMaterial({ color: 0x6e523f, roughness: 0.9 });
        const mountain = new THREE.Mesh(mGeo, mMat);
        mountain.position.set(-20 + m * 10, 7, -25);
        this.group.add(mountain);
      }
    } else if (cityId === 'alula') {
      // Maraya Mirrored Cube & Hegra Sandstone Tombs
      const marayaGeo = new THREE.BoxGeometry(18, 10, 18);
      const marayaMat = new THREE.MeshStandardMaterial({
        color: 0xddffff,
        metalness: 0.98,
        roughness: 0.05
      });
      const maraya = new THREE.Mesh(marayaGeo, marayaMat);
      maraya.position.set(0, 2.8, -15);
      this.group.add(maraya);
    } else if (cityId === 'jeddah') {
      // Balad Coral Stone Mansions with Rawashin
      for (let b = 0; b < 4; b++) {
        const bGeo = new THREE.BoxGeometry(6, 12 + b * 2, 6);
        const bMat = new THREE.MeshStandardMaterial({ color: 0xdfd3be, roughness: 0.8 });
        const bMesh = new THREE.Mesh(bGeo, bMat);
        bMesh.position.set(-12 + b * 8, 4 + b, -14);
        this.group.add(bMesh);
      }
    } else if (cityId === 'hail') {
      // Twin Granite Peaks of Aja & Salma
      const aja = new THREE.Mesh(
        new THREE.ConeGeometry(14, 22, 5),
        new THREE.MeshStandardMaterial({ color: 0x8d5b4c, roughness: 0.95 })
      );
      aja.position.set(-10, 8.8, -22);
      const salma = new THREE.Mesh(
        new THREE.ConeGeometry(12, 19, 5),
        new THREE.MeshStandardMaterial({ color: 0x8d5b4c, roughness: 0.95 })
      );
      salma.position.set(10, 7.3, -24);
      this.group.add(aja, salma);
    }
  }

  update(time, delta) {
    if (!this.group.visible) return;
    // Gentle ambient camera float while inside the city
    this.group.rotation.y = Math.sin(time * 0.2) * 0.02;
  }
}
