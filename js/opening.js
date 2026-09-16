import { sound } from './audioEngine.js';

export class CinematicOpening {
  constructor(onOpeningDone) {
    this.onOpeningDone = onOpeningDone;
    this.scene = document.getElementById('opening-scene');
    this.veil = document.getElementById('opening-veil');
    this.hasEntered = false;

    this.init();
  }

  init() {
    // Click anywhere to enter immediately
    const enterNow = () => {
      this.enter();
    };

    if (this.scene) {
      this.scene.addEventListener('click', enterNow);
      this.scene.style.cursor = 'pointer';
    }

    // Start ambient wind and distant anthem
    sound.playTrack('anthem');
    sound.startAmbientWind();

    // Auto enter after 3.5 seconds if user didn't click
    setTimeout(() => {
      this.enter();
    }, 3500);
  }

  enter() {
    if (this.hasEntered) return;
    this.hasEntered = true;

    sound.resumeAudio();

    if (this.scene) {
      this.scene.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
      this.scene.style.opacity = '0';
      this.scene.style.transform = 'scale(1.04)';
      this.scene.style.pointerEvents = 'none';

      setTimeout(() => {
        this.scene.classList.remove('active-scene');
        this.scene.style.display = 'none';
        if (this.onOpeningDone) this.onOpeningDone();
      }, 1200);
    } else {
      if (this.onOpeningDone) this.onOpeningDone();
    }
  }
}

