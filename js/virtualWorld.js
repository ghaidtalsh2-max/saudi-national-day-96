/**
 * virtualWorld.js - المحرك السينمائي الشامل لعالم السعودية الافتراضي الموحد (Three.js WebGL Orchestrator)
 * - يدير الرحلة الرقمية المتصلة الكاملة:
 *   1. المشهد الافتتاحي (Opening): فجر طويق + الحرمان الشريفان + المعالم + العلم السعودي بفيزياء القماش
 *   2. رحلة الطريق (Palm & Asphalt Road): تحرك الكاميرا للأمام من رمال الصحراء إلى النخيل والأسفلت والتراث والأفق المعاصر
 *   3. المشهد الملكي (Royal Memorial): وقار القيادة على شرفة مطلة مع صوت "أنا بدوي ولد بدوي"
 *   4. الفيلم التاريخي (Historical Film): ريشة التأسيس والمحطات الموثقة من 1727 حتى 2026
 *   5. مساحة الاستكشاف (Exploration Hub): "وش ودك تكتشف؟" - الفضاء الفخم الذي يفتح البوابات الخمس
 *   6. خريطة المملكة 3D وعوالم المدن الأربع (Saudi 3D Map & City Dive)
 *   7. صانع طابع البريد التذكاري (سعوديتك)
 *   8. ديواننا، من لساننا، والسعودية بيت واحد
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
  ROYAL_STOP: 2,
  HISTORY_INK: 3,
  EXPLORATION_HUB: 4,
  SAUDI_MAP: 5,
  CITY_WORLDS: 6,
  STAMP_MAKER: 7,
  DIWAN: 8,
  LEXICON: 9,
  ONE_HOME: 10
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

    // Camera & Parallax Targets
    this.currentStage = STAGES.OPENING;
    this.targetCameraPos = new THREE.Vector3(0.0, 3.2, 19.5);
    this.targetCameraLook = new THREE.Vector3(0.0, 2.2, -14.0);

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    // Sub-modules
    this.flagSim = null;
    this.openingScene = null;
    this.palmHighway = null;
    this.stopScene = null;
    this.historyStory = null;
    this.saudiMap = null;
    this.cityWorlds = null;

    // UI Overlays
    this.heroOverlay = document.getElementById('opening-hero-overlay');
    this.roadHud = document.getElementById('road-journey-hud');
    this.royalOverlay = document.getElementById('royal-tribute-overlay');
    this.historyOverlay = document.getElementById('history-ink-overlay');
    this.hubOverlay = document.getElementById('exploration-hub-overlay');
    this.cityOverlay = document.getElementById('city-world-overlay');
    this.quickHubBtn = document.getElementById('btn-quick-hub');

    this.init();
  }

  init() {
    // 1. Scene Setup with Delicate Golden Morning Mist
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xf4e6d4, 0.0035);

    // 2. Camera Setup (Expansive 60 deg wide cinematic FOV)
    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 450);
    this.camera.position.copy(this.targetCameraPos);
    this.camera.lookAt(this.targetCameraLook);

    // 3. Renderer with PCF Soft Shadows and ACES Filmic Tone Mapping
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.86;
    this.container.appendChild(this.renderer.domElement);

    // 4. Initialize Core World Modules
    this.initWorldModules();

    // 5. Setup Window Events & Parallax
    this.initEvents();

    // 6. Start Master Animation Loop
    this.animate = this.animate.bind(this);
    this.animate();

    // 7. Start Ambient Desert Wind & National Anthem
    sound.startAmbientWind();
    sound.playTrack('anthem', 16);
  }

  initWorldModules() {
    // Phase 01: 3D Saudi Flag Simulation & Vast Desert Environment
    this.flagSim = new SaudiFlagSimulation(this.scene);
    this.openingScene = new OpeningScene(this.scene);

    // Phase 02 & 03: Road Journey & Royal Memorial
    this.palmHighway = new PalmHighwayScene(this.scene, () => {
      this.goToStage(STAGES.ROYAL_STOP);
    });
    this.stopScene = new RoyalStopScene(this.scene);

    // Phase 04: Historical Film
    this.historyStory = new HistoricalInkStory(() => {
      this.goToStage(STAGES.EXPLORATION_HUB);
    });

    // Phase 05 & 06: Saudi 3D Map & City Worlds
    this.saudiMap = new Saudi3DMap(this.scene, this.camera, (cityId) => {
      this.goToCityWorld(cityId);
    });

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

    // Subtle, natural camera parallax with mouse / touch
    window.addEventListener('pointermove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Audio unlock listener
    const handleAudioUnlock = () => {
      sound.resume();
    };
    window.addEventListener('pointerdown', handleAudioUnlock, { passive: true });
    window.addEventListener('keydown', handleAudioUnlock, { passive: true });

    // Road Skip Button
    const btnSkipRoad = document.getElementById('btn-skip-road');
    btnSkipRoad?.addEventListener('click', () => {
      sound.playChime(580);
      this.goToStage(STAGES.ROYAL_STOP);
    });

    // Royal Continue Button
    const btnRoyalContinue = document.getElementById('btn-royal-continue');
    btnRoyalContinue?.addEventListener('click', () => {
      sound.playChime(620);
      this.goToStage(STAGES.HISTORY_INK);
    });

    // Quick Hub Shortcut Button
    this.quickHubBtn?.addEventListener('click', () => {
      sound.playChime(640);
      this.goToStage(STAGES.EXPLORATION_HUB);
    });

    // City to Hub Button
    const btnCityHub = document.getElementById('btn-city-to-hub');
    btnCityHub?.addEventListener('click', () => {
      sound.playChime(580);
      this.goToStage(STAGES.EXPLORATION_HUB);
    });
  }

  startJourney() {
    sound.playChime(640);
    this.goToStage(STAGES.PALM_ROAD);
  }

  goToStage(stage) {
    this.currentStage = stage;

    // 1. Hide / Show Hero Overlay
    if (this.heroOverlay) {
      this.heroOverlay.classList.toggle('vanished', stage !== STAGES.OPENING);
    }

    // 2. Hide / Show Road HUD
    if (this.roadHud) {
      this.roadHud.style.display = (stage === STAGES.PALM_ROAD) ? 'flex' : 'none';
    }

    // 3. Hide / Show Royal Overlay
    if (this.royalOverlay) {
      this.royalOverlay.style.display = (stage === STAGES.ROYAL_STOP) ? 'flex' : 'none';
    }

    // 4. Hide / Show Exploration Hub
    if (this.hubOverlay) {
      this.hubOverlay.classList.toggle('active', stage === STAGES.EXPLORATION_HUB);
    }

    // 5. Hide / Show Hub Shortcut in Top Nav
    if (this.quickHubBtn) {
      this.quickHubBtn.style.display = (stage >= STAGES.EXPLORATION_HUB) ? 'inline-flex' : 'none';
    }

    // 6. Close any open sub-experience modals when switching stage
    this.closeSubModals();

    // 7. Update 3D Module Visibilities
    this.flagSim?.setVisible(stage === STAGES.OPENING || stage === STAGES.EXPLORATION_HUB);
    this.openingScene?.setVisible(stage === STAGES.OPENING || stage === STAGES.EXPLORATION_HUB);
    this.palmHighway?.setVisible(stage === STAGES.PALM_ROAD);
    this.stopScene?.setVisible(stage === STAGES.ROYAL_STOP);
    this.saudiMap?.setVisible(stage === STAGES.SAUDI_MAP);

    if (stage !== STAGES.CITY_WORLDS && this.cityWorlds) {
      this.cityWorlds.exit();
    }

    if (stage === STAGES.HISTORY_INK) {
      this.historyStory?.open();
    } else {
      this.historyStory?.close();
    }

    // 8. Adjust 3D Camera & Atmospheric Lighting
    this.resetCameraForStage(stage);

    // 9. Coordinate Audio Seamlessly
    this.orchestrateAudioForStage(stage);
  }

  closeSubModals() {
    ['paint-saudi-overlay', 'diwan-overlay', 'lexicon-overlay', 'onehome-overlay'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });
  }

  resetCameraForStage(stage) {
    if (stage === STAGES.OPENING) {
      this.targetCameraPos.set(0.0, 3.2, 19.5);
      this.targetCameraLook.set(0.0, 2.2, -14.0);
      this.scene.fog.color.setHex(0xf4e6d4);
      this.scene.fog.density = 0.0035;
    } else if (stage === STAGES.PALM_ROAD) {
      this.targetCameraPos.set(0, 0.35, 2.5);
      this.targetCameraLook.set(0, 0.2, -70);
      this.scene.fog.color.setHex(0xf0dfc4);
      this.scene.fog.density = 0.012;
      this.palmHighway?.reset();
    } else if (stage === STAGES.ROYAL_STOP) {
      this.targetCameraPos.set(0, 2.2, 8.5);
      this.targetCameraLook.set(0, 3.2, -4.5);
      this.scene.fog.color.setHex(0xecd9be);
      this.scene.fog.density = 0.014;
    } else if (stage === STAGES.HISTORY_INK) {
      this.targetCameraPos.set(0, 0, 10);
      this.targetCameraLook.set(0, 0, 0);
    } else if (stage === STAGES.EXPLORATION_HUB) {
      this.targetCameraPos.set(0, 8.5, 32);
      this.targetCameraLook.set(0, 2.5, -15);
      this.scene.fog.color.setHex(0x0e1812);
      this.scene.fog.density = 0.006;
    } else if (stage === STAGES.SAUDI_MAP) {
      this.targetCameraPos.set(0, 14, 15);
      this.targetCameraLook.set(0, -1, 0);
      this.scene.fog.color.setHex(0x0c1410);
      this.scene.fog.density = 0.018;
    }
  }

  goToCityWorld(cityId) {
    this.currentStage = STAGES.CITY_WORLDS;
    this.saudiMap?.setVisible(false);

    this.targetCameraPos.set(0, 3.5, 14);
    this.targetCameraLook.set(0, 2.0, -10);
    this.cityWorlds?.enterCity(cityId);
  }

  orchestrateAudioForStage(stage) {
    if (stage === STAGES.OPENING) {
      sound.playTrack('anthem', 16);
    } else if (stage === STAGES.PALM_ROAD) {
      sound.stopTrack('anthem', 2.0);
      sound.startAmbientWind();
    } else if (stage === STAGES.ROYAL_STOP) {
      sound.playTrack('badawi', 18);
    } else if (stage === STAGES.HISTORY_INK) {
      sound.stopTrack('badawi', 1.5);
    } else if (stage === STAGES.EXPLORATION_HUB || stage === STAGES.SAUDI_MAP) {
      sound.playTrack('anthem', 12);
    }
  }

  animate() {
    this.animId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Smooth Damped Mouse Parallax
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;

    // Camera Interpolation toward Target
    if (this.currentStage === STAGES.OPENING || this.currentStage === STAGES.EXPLORATION_HUB) {
      const breathX = Math.sin(time * 0.45) * 0.035;
      const breathY = Math.cos(time * 0.55) * 0.025;
      this.camera.position.x = this.targetCameraPos.x + this.mouseX * 0.35 + breathX;
      this.camera.position.y = this.targetCameraPos.y - this.mouseY * 0.18 + breathY;
      this.camera.position.z = this.targetCameraPos.z;
    } else {
      this.camera.position.lerp(this.targetCameraPos, 0.045);
    }

    this.camera.lookAt(this.targetCameraLook);

    // Update Stage Specific 3D Modules
    if (this.currentStage === STAGES.OPENING || this.currentStage === STAGES.EXPLORATION_HUB) {
      this.flagSim?.update(time, delta);
      this.openingScene?.update(time, delta);
    } else if (this.currentStage === STAGES.PALM_ROAD) {
      this.palmHighway?.update(delta, time);
      this.camera.position.y = this.targetCameraPos.y + Math.sin(time * 14) * 0.018; // Road vehicle vibration
    } else if (this.currentStage === STAGES.ROYAL_STOP) {
      this.stopScene?.update(time, delta);
    } else if (this.currentStage === STAGES.SAUDI_MAP) {
      this.saudiMap?.update(time, delta);
    } else if (this.currentStage === STAGES.CITY_WORLDS) {
      this.cityWorlds?.update(time, delta);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
