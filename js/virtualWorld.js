/**
 * virtualWorld.js - المحرك السينمائي لعالم السعودية الافتراضي الموحد (Three.js WebGL Orchestrator)
 * - يدير المشهد الافتتاحي السينمائي (Phase 01) والرحلة المتصلة
 * - كاميرا سينمائية بانورامية ذات بارالاكس ناعم
 * - فيزياء العلم السعودي، البيئة الصحراوية، الإضاءة، والتحكم بالصوت
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

    // Camera & Parallax Targets (Expansive panoramic framing with generous depth and lateral breathing space)
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

    // DOM UI Hooks
    this.heroOverlay = document.getElementById('opening-hero-overlay');

    this.init();
  }

  init() {
    // 1. Scene Setup with Delicate Golden Morning Mist (crystal sky and landmark clarity)
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xf4e6d4, 0.0035);

    // 2. Camera Setup (Expansive 60 deg wide cinematic FOV giving distance and optical expanse)
    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 400);
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

    // 7. Start Ambient Desert Wind & National Anthem (Soft Fade-in)
    sound.startAmbientWind();
    sound.playTrack('anthem', 16);

    // 8. Timed Graceful Fadeout of ND96 Identity (Extended 120s display so viewer can read and admire comfortably)
    setTimeout(() => {
      if (this.heroOverlay && !this.heroOverlay.classList.contains('vanished')) {
        this.heroOverlay.classList.add('vanished');
      }
    }, 120000);
  }

  initWorldModules() {
    // Phase 01: 3D Saudi Flag Simulation & Vast Desert Environment
    this.flagSim = new SaudiFlagSimulation(this.scene);
    this.openingScene = new OpeningScene(this.scene);

    // Connected Journey Modules (Prepared for subsequent phases)
    this.palmHighway = new PalmHighwayScene(this.scene);
    this.stopScene = new RoyalStopScene(this.scene);

    this.historyStory = new HistoricalInkStory(() => {
      this.goToStage(STAGES.SAUDI_MAP);
    });

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

    // Resume audio on user interaction without prematurely dismissing text
    const handleAudioUnlock = () => {
      sound.resume();
    };

    window.addEventListener('pointerdown', handleAudioUnlock, { passive: true });
    window.addEventListener('keydown', handleAudioUnlock, { passive: true });
  }

  startJourney() {
    sound.playChime(640);
    if (this.heroOverlay) {
      this.heroOverlay.classList.add('vanished');
    }
    this.goToStage(STAGES.PALM_ROAD);
  }

  goToStage(stage) {
    this.currentStage = stage;

    if (stage !== STAGES.OPENING && this.heroOverlay) {
      this.heroOverlay.classList.add('vanished');
    }

    // Set Visibility
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

    this.resetCameraForStage(stage);
    this.orchestrateAudioForStage(stage);
  }

  resetCameraForStage(stage) {
    if (stage === STAGES.OPENING) {
      this.targetCameraPos.set(0.0, 3.2, 19.5);
      this.targetCameraLook.set(0.0, 2.2, -14.0);
      this.scene.fog.color.setHex(0xf4e6d4);
      this.scene.fog.density = 0.0035;
    } else if (stage === STAGES.PALM_ROAD) {
      this.targetCameraPos.set(0, 0.4, 2.0);
      this.targetCameraLook.set(0, 0.2, -60);
      this.scene.fog.color.setHex(0xf0dfc4);
      this.scene.fog.density = 0.012;
    } else if (stage === STAGES.LANDMARKS_DRIVE) {
      this.targetCameraPos.set(0, 3.2, 5.0);
      this.targetCameraLook.set(0, 4.0, -80);
      this.scene.fog.color.setHex(0xaec8d8);
      this.scene.fog.density = 0.008;
    } else if (stage === STAGES.ROYAL_STOP) {
      this.targetCameraPos.set(0, 2.2, 8.5);
      this.targetCameraLook.set(0, 3.2, -4.5);
      this.scene.fog.color.setHex(0xecd9be);
      this.scene.fog.density = 0.014;
    } else if (stage === STAGES.HISTORY_INK) {
      this.targetCameraPos.set(0, 0, 10);
      this.targetCameraLook.set(0, 0, 0);
    } else if (stage === STAGES.SAUDI_MAP) {
      this.targetCameraPos.set(0, 14, 15);
      this.targetCameraLook.set(0, -1, 0);
      this.scene.fog.color.setHex(0x0c1410);
      this.scene.fog.density = 0.018;
    }
  }

  goToCityWorld(cityId) {
    this.currentStage = STAGES.CITY_WORLDS;
    this.saudiMap.setVisible(false);

    this.targetCameraPos.set(0, 3.5, 14);
    this.targetCameraLook.set(0, 2.0, -10);
    this.cityWorlds.enterCity(cityId);
  }

  orchestrateAudioForStage(stage) {
    if (stage === STAGES.OPENING) {
      sound.playTrack('anthem', 16);
    } else if (stage === STAGES.PALM_ROAD || stage === STAGES.LANDMARKS_DRIVE) {
      sound.stopTrack('anthem', 2.0);
      sound.startAmbientWind();
    } else if (stage === STAGES.ROYAL_STOP) {
      sound.playTrack('badawi', 18);
    } else if (stage === STAGES.HISTORY_INK) {
      sound.stopTrack('badawi', 1.5);
    } else if (stage === STAGES.SAUDI_MAP) {
      sound.playTrack('anthem', 10);
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
    if (this.currentStage === STAGES.OPENING) {
      const breathX = Math.sin(time * 0.45) * 0.035;
      const breathY = Math.cos(time * 0.55) * 0.025;
      this.camera.position.x = this.targetCameraPos.x + this.mouseX * 0.35 + breathX;
      this.camera.position.y = this.targetCameraPos.y - this.mouseY * 0.18 + breathY;
      this.camera.position.z = this.targetCameraPos.z;
    } else {
      this.camera.position.lerp(this.targetCameraPos, 0.045);
    }

    this.camera.lookAt(this.targetCameraLook);

    // Update Modules
    if (this.currentStage === STAGES.OPENING) {
      this.flagSim.update(time, delta);
      this.openingScene.update(time, delta);
    } else if (this.currentStage === STAGES.PALM_ROAD || this.currentStage === STAGES.LANDMARKS_DRIVE) {
      this.palmHighway.update(delta, time);
      this.camera.position.y = this.targetCameraPos.y + Math.sin(time * 12) * 0.015;
    } else if (this.currentStage === STAGES.ROYAL_STOP) {
      this.stopScene.update(time, delta);
    } else if (this.currentStage === STAGES.SAUDI_MAP) {
      this.saudiMap.update(time, delta);
    } else if (this.currentStage === STAGES.CITY_WORLDS) {
      this.cityWorlds.update(time, delta);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
