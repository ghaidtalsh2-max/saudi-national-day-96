/**
 * virtualWorld.js - المحرك الرئيسي لعالم السعودية الافتراضي الموحد (Three.js WebGL Orchestrator)
 * - يدير المشاهد الـ 13 المطلوبة في رحلة سينمائية واحدة مستمرة متصلة الكاميرا بالكامل (Zero Hard Cuts)
 * - ينسق بين:
 *   1. Opening Scene & SaudiFlagSimulation
 *   2. PalmHighwayScene
 *   3. RoyalStopScene
 *   4. HistoricalInkStory
 *   5. Saudi3DMap
 *   6. CityWorldsManager
 *   7. AudioEngine & HUD Subtitles
 */

import * as THREE from 'three';
import { SaudiFlagSimulation } from './flagSimulation.js';
import { OpeningScene } from './openingScene.js';
import { PalmHighwayScene } from './palmHighwayScene.js';
import { RoyalStopScene } from './stopScene.js';
import { HistoricalInkStory } from './historicalInkStory.js';
import { Saudi3DMap } from './saudi3DMap.js';
import { CityWorldsManager } from './cityWorlds.js';
import { sound } from './audioEngine.js';

export const STAGES = {
  OPENING: 0,
  PALM_ROAD: 1,
  LANDMARKS_DRIVE: 2,
  ROYAL_STOP: 3,
  HISTORY_INK: 4,
  SAUDI_MAP: 5,
  CITY_WORLDS: 6
};

export class SaudiVirtualWorld {
  constructor(container) {
    this.container = container;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    this.animId = null;

    // Current State
    this.currentStage = STAGES.OPENING;
    this.targetCameraPos = new THREE.Vector3(0, 1.4, 7.5);
    this.targetCameraLook = new THREE.Vector3(0.3, 1.2, 0);

    // Sub-modules
    this.flagSim = null;
    this.openingScene = null;
    this.palmHighway = null;
    this.stopScene = null;
    this.historyStory = null;
    this.saudiMap = null;
    this.cityWorlds = null;

    // DOM UI elements
    this.stageButtons = document.querySelectorAll('.stage-dot-btn');
    this.captionTitle = document.getElementById('caption-title');
    this.captionBody = document.getElementById('caption-body');
    this.captionPrompt = document.getElementById('caption-prompt-action');
    this.heroOverlay = document.getElementById('opening-hero-overlay');
    this.btnEmbark = document.getElementById('btn-embark-world');

    this.init();
  }

  init() {
    // 1. Three.js Scene Setup with Atmospheric Fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xf6ebd9, 0.016);

    // 2. Camera Setup
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 250);
    this.camera.position.copy(this.targetCameraPos);
    this.camera.lookAt(this.targetCameraLook);

    // 3. WebGL Renderer with High Precision & Soft Shadows
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.container.appendChild(this.renderer.domElement);

    // 4. Initialize Core World Stages
    this.initWorldStages();

    // 5. Setup Window Events & User Interactions
    this.initEvents();

    // 6. Start Main Animation Loop
    this.animate = this.animate.bind(this);
    this.animate();

    // Start Ambient Breeze
    sound.startAmbientWind();
    // Start Saudi National Anthem with soft fade in
    sound.playTrack('anthem', 16);
  }

  initWorldStages() {
    // Stage 0: 3D Flag & Natural Opening Desert
    this.flagSim = new SaudiFlagSimulation(this.scene);
    this.openingScene = new OpeningScene(this.scene);

    // Stage 1 & 2: Palm Farm & Continuous Driving Through Saudi Arabia
    this.palmHighway = new PalmHighwayScene(this.scene);

    // Stage 3: Royal Overlook & Monument of the Leaders
    this.stopScene = new RoyalStopScene(this.scene);

    // Stage 4: Historical Ink Story Engine
    this.historyStory = new HistoricalInkStory(() => {
      this.goToStage(STAGES.SAUDI_MAP);
    });

    // Stage 5: 3D Topographic Interactive Map
    this.saudiMap = new Saudi3DMap(this.scene, this.camera, (cityId) => {
      this.goToCityWorld(cityId);
    });

    // Stage 6: City Living Mini-Worlds & Cultural Games
    this.cityWorlds = new CityWorldsManager(this.scene, this.camera, () => {
      this.goToStage(STAGES.SAUDI_MAP);
    });
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      if (this.historyStory) this.historyStory.resize();
    });

    // Embark Button on Hero Overlay
    this.btnEmbark?.addEventListener('click', () => {
      this.startJourney();
    });

    // Stage Tracker Top Buttons
    this.stageButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stageIdx = parseInt(e.currentTarget.getAttribute('data-stage'), 10);
        sound.playDrumBeat('tar', 110);
        this.goToStage(stageIdx);
      });
    });

    // Camera reset button
    const btnCamReset = document.getElementById('btn-camera-reset');
    btnCamReset?.addEventListener('click', () => {
      sound.playChime(580);
      this.resetCameraForStage(this.currentStage);
    });
  }

  startJourney() {
    sound.playChime(640);
    if (this.heroOverlay) {
      this.heroOverlay.classList.add('vanished');
    }
    // Seamless camera move forward into the Palm Farm Highway
    this.goToStage(STAGES.PALM_ROAD);
  }

  goToStage(stage) {
    this.currentStage = stage;
    this.updateStageTracker(stage);

    // Hide hero inscription if user jumped ahead
    if (stage !== STAGES.OPENING && this.heroOverlay) {
      this.heroOverlay.classList.add('vanished');
    }

    // Set Visibility per stage
    this.flagSim.setVisible(stage === STAGES.OPENING);
    this.openingScene.setVisible(stage === STAGES.OPENING);

    const isRoad = (stage === STAGES.PALM_ROAD || stage === STAGES.LANDMARKS_DRIVE);
    this.palmHighway.setVisible(isRoad);

    this.stopScene.setVisible(stage === STAGES.ROYAL_STOP);
    this.saudiMap.setVisible(stage === STAGES.SAUDI_MAP);
    if (stage !== STAGES.CITY_WORLDS && this.cityWorlds) {
      this.cityWorlds.exit();
    }

    if (stage === STAGES.HISTORY_INK) {
      this.historyStory.open();
    } else {
      this.historyStory.close();
    }

    // Camera Positioning & Lighting choreography
    this.resetCameraForStage(stage);

    // Audio Orchestration per stage
    this.orchestrateAudioForStage(stage);

    // Dynamic Captions
    this.updateCaptionsForStage(stage);
  }

  resetCameraForStage(stage) {
    if (stage === STAGES.OPENING) {
      this.targetCameraPos.set(0, 1.4, 7.5);
      this.targetCameraLook.set(0.3, 1.2, 0);
      this.scene.fog.color.setHex(0xf6ebd9);
      this.scene.fog.density = 0.016;
    } else if (stage === STAGES.PALM_ROAD) {
      // Driver Eye-Level inside vehicle looking down the palm corridor
      this.targetCameraPos.set(0, 0.4, 2.0);
      this.targetCameraLook.set(0, 0.2, -60);
      this.scene.fog.color.setHex(0xf0dfc4);
      this.scene.fog.density = 0.012;
    } else if (stage === STAGES.LANDMARKS_DRIVE) {
      // Higher dynamic chase camera revealing the expanding modern skyline
      this.targetCameraPos.set(0, 3.2, 5.0);
      this.targetCameraLook.set(0, 4.0, -80);
      this.scene.fog.color.setHex(0xaec8d8);
      this.scene.fog.density = 0.008;
    } else if (stage === STAGES.ROYAL_STOP) {
      // Royal overlook camera
      this.targetCameraPos.set(0, 2.2, 8.5);
      this.targetCameraLook.set(0, 3.2, -4.5);
      this.scene.fog.color.setHex(0xecd9be);
      this.scene.fog.density = 0.014;
    } else if (stage === STAGES.HISTORY_INK) {
      this.targetCameraPos.set(0, 0, 10);
      this.targetCameraLook.set(0, 0, 0);
    } else if (stage === STAGES.SAUDI_MAP) {
      // Elevated aerial angle over the 3D Kingdom relief map
      this.targetCameraPos.set(0, 14, 15);
      this.targetCameraLook.set(0, -1, 0);
      this.scene.fog.color.setHex(0x0c1410);
      this.scene.fog.density = 0.018;
    }
  }

  goToCityWorld(cityId) {
    this.currentStage = STAGES.CITY_WORLDS;
    this.updateStageTracker(STAGES.CITY_WORLDS);

    // Hide map mesh while inside city
    this.saudiMap.setVisible(false);

    // Seamless camera dive
    this.targetCameraPos.set(0, 3.5, 14);
    this.targetCameraLook.set(0, 2.0, -10);

    this.cityWorlds.enterCity(cityId);

    // Update bottom caption
    const cData = this.cityWorlds.cityData[cityId];
    if (this.captionTitle) this.captionTitle.textContent = `عالم: ${cData.nameAr}`;
    if (this.captionBody) this.captionBody.textContent = cData.tag;
    if (this.captionPrompt) {
      this.captionPrompt.innerHTML = `<span>تفاعل مع النشاط التفاعلي لـ <strong>${cData.nameAr}</strong> أدناه</span>`;
    }
  }

  orchestrateAudioForStage(stage) {
    if (stage === STAGES.OPENING) {
      sound.playTrack('anthem', 16);
    } else if (stage === STAGES.PALM_ROAD || stage === STAGES.LANDMARKS_DRIVE) {
      // Fade anthem down, let wind & road speed dominate
      sound.stopTrack('anthem', 2.0);
      sound.startAmbientWind();
    } else if (stage === STAGES.ROYAL_STOP) {
      // Cultural anthem for royal stop scene
      sound.playTrack('badawi', 18);
    } else if (stage === STAGES.HISTORY_INK) {
      sound.stopTrack('badawi', 1.5);
    } else if (stage === STAGES.SAUDI_MAP) {
      sound.playTrack('anthem', 10);
    }
  }

  updateCaptionsForStage(stage) {
    if (!this.captionTitle) return;

    if (stage === STAGES.OPENING) {
      this.captionTitle.textContent = 'واحة البداية والعلم الخفاق 🇸🇦';
      this.captionBody.textContent = 'أفق الصباح الذهبي ونخيل الوطن يعانق الراية الخضراء خفاقة في سماء العز بمناسبة اليوم الوطني ٩٦.';
      this.captionPrompt.innerHTML = '<span>انقر على زر الانطلاق أو في أي مكان لبدء رحلة الوطن</span>';
    } else if (stage === STAGES.PALM_ROAD) {
      this.captionTitle.textContent = 'طريق النخيل وأصالة الدار 🌴';
      this.captionBody.textContent = 'طريق الأسفلت ينفتح في قلب الصحراء تكتنفه مزارع النخيل الباسقة على الجانبين.';
      this.captionPrompt.innerHTML = '<span>السيارة تمضي للأمام.. استمتع بنسيم النخيل وظلال الطريق</span>';
    } else if (stage === STAGES.LANDMARKS_DRIVE) {
      this.captionTitle.textContent = 'مسار النهضة والمعالم الكبرى 🏢';
      this.captionBody.textContent = 'من أصالة الطين وبوابة المصمك إلى صروح الرياض وكافد وأبراج المستقبل التي تعانق السماء.';
      this.captionPrompt.innerHTML = '<span>الأفق يتسع نحو عاصمة المجد وصروح النهضة المعمارية</span>';
    } else if (stage === STAGES.ROYAL_STOP) {
      this.captionTitle.textContent = 'هضبة المجد والوفاء الملكي 👑';
      this.captionBody.textContent = 'وقفة وفاء وعرفان لمؤسس الدولة الملك عبدالعزيز، وخادم الحرمين الشريفين، وسمو ولي العهد الأمين.';
      this.captionPrompt.innerHTML = '<span>أنا بدوي ولد بدوي.. شموخ وتاريخ يتجدد</span>';
    } else if (stage === STAGES.HISTORY_INK) {
      this.captionTitle.textContent = 'ريشة التأسيس — ملاحم التاريخ الخالدة ✒️';
      this.captionBody.textContent = 'شاهد التاريخ يُخط أمام عينك بمداد الذهب من عام ١٧٢٧م وحتى اليوم الوطني ٩٦ لعام ٢٠٢٦م.';
      this.captionPrompt.innerHTML = '<span>استخدم أزرار التنقل لمتابعة المحطات حتى التحول للخريطة</span>';
    } else if (stage === STAGES.SAUDI_MAP) {
      this.captionTitle.textContent = 'خريطة المملكة العربية السعودية المجسمة 🗺️';
      this.captionBody.textContent = 'خريطة تضاريسية حية للمملكة بمناطقها ومدنها الـ ١٣ الشامخة من البحر الأحمر حتى الخليج العربي.';
      this.captionPrompt.innerHTML = '<span>انقر على أي مدينة لتغوص الكاميرا مباشرة في عالمها المصغر ونشاطها التفاعلي</span>';
    }
  }

  updateStageTracker(activeStage) {
    this.stageButtons.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === activeStage);
    });
  }

  animate() {
    this.animId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // 1. Smooth Camera Interpolation towards Target (Damped Orbit)
    this.camera.position.lerp(this.targetCameraPos, 0.045);
    // Smooth lookAt target tracking
    this.camera.lookAt(this.targetCameraLook);

    // 2. Update Active Stage Modules
    if (this.currentStage === STAGES.OPENING) {
      this.flagSim.update(time, delta);
      this.openingScene.update(time, delta);
    } else if (this.currentStage === STAGES.PALM_ROAD || this.currentStage === STAGES.LANDMARKS_DRIVE) {
      this.palmHighway.update(delta, time);
      // Subtle cockpit bobbing
      this.camera.position.y = this.targetCameraPos.y + Math.sin(time * 12) * 0.015;
    } else if (this.currentStage === STAGES.ROYAL_STOP) {
      this.stopScene.update(time, delta);
    } else if (this.currentStage === STAGES.SAUDI_MAP) {
      this.saudiMap.update(time, delta);
    } else if (this.currentStage === STAGES.CITY_WORLDS) {
      this.cityWorlds.update(time, delta);
    }

    // 3. Render Three.js WebGL Frame
    this.renderer.render(this.scene, this.camera);
  }
}
