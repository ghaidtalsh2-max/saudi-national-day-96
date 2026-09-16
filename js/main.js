/**
 * main.js - إطلاق المسار السينمائي الواحد لليوم الوطني السعودي 96
 * مشهد نهاري مشرق، علم يرفرف بنعومة، خط الزمن وانكشاف طريق النخيل
 */

import { sound } from './audioEngine.js';
import { SaudiMasterJourney } from './journey.js';

// Setup YouTube IFrame API Global Callback
window.onYouTubeIframeAPIReady = function() {
  const sources = [
    { key: 'anthem', id: 'yt-anthem', videoId: '-jU8Wt1LU4g' },
    { key: 'taif', id: 'yt-taif', videoId: 'STG5eMd8chI' },
    { key: 'riyadh', id: 'yt-riyadh', videoId: 'IyHhWFIecc8' },
    { key: 'hail', id: 'yt-hail', videoId: 'mNxZ7O_r-fs' }
  ];

  sources.forEach(src => {
    try {
      if (window.YT && window.YT.Player) {
        new window.YT.Player(src.id, {
          videoId: src.videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1
          },
          events: {
            onReady: (event) => {
              sound.registerYTPlayer(src.key, event.target);
            }
          }
        });
      }
    } catch (e) {
      console.warn('Could not init YT player:', src.key, e);
    }
  });
};

function startExperience() {
  const canvas = document.getElementById('journey-canvas');
  if (!canvas) return;

  const journey = new SaudiMasterJourney(canvas);

  // HUD Sound Button
  const btnSound = document.getElementById('hud-sound-toggle');
  const soundLabel = document.getElementById('sound-label-text');
  if (btnSound) {
    btnSound.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = sound.toggleMute();
      if (soundLabel) {
        soundLabel.textContent = isActive ? 'صوت المكان: نشط' : 'صوت المكان: صامت';
      }
    });
  }

  // Global Audio Unlock on first interaction
  const unlockAudio = () => {
    sound.resumeAudio();
    sound.startAmbientWind();
    sound.playTrack('anthem');
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startExperience);
} else {
  startExperience();
}
