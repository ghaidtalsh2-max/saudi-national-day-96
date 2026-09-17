/**
 * openingScene.js - البيئة الصحراوية السعودية الواقعية والسينمائية (Three.js)
 * - صحراء سعودية شاسعة بكثبان رملية متموجة ذات حواف حادة (Slip Faces) وظلال صباحية ممتدة
 * - نخل سعودي حقيقي أصيل: سعف ريشي متدلٍ كالشلال متصل بقمة الجذع، كرب وليف النخل، وقنوان تمر ذهبي
 * - عمارة نجدية أصيلة بتفاصيل دقيقة: جدران طين مائلة، شرفات مسننة، ميازيب خشبية، ومثلثات الفرجة
 * - عمارة حجازية أصيلة (يمين ورا): بيوت حجر المنقبي برواشين خشبية مفرغة وزهور الجهنمية البنفسجية المتسلقة
 * - معالم وطنية حديثة متقنة وواقعية: برج المملكة بقوسه الانسيابي المعكوس، الفيصلية بكرتها الذهبية،
 *   مركز إثراء بالظهران، وبرج مياه الخبر (الشرقية)، وناطحة سحاب كافد المتبلورة (الرياض)
 * - سماء فجرية متدرجة وشمس صباحية مشرقة
 */

import * as THREE from 'three';

export class OpeningScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();

    this.palms = [];
    this.flora = [];
    this.dustParticles = null;
    this.sandWisps = null;
    this.frondTexture = null;
    this.trunkTexture = null;

    this.initCinematicLighting();
    this.initAtmosphericSky();
    this.initVastDesertTerrain();
    this.initModernSaudiSkyline();
    this.initSacredMosques();
    this.initAlUlaMonuments();
    this.initHeritageArchitecture();
    this.initTuwaiqHorizon();
    this.initSaudiFlora();
    this.initDesertAmbience();

    this.scene.add(this.group);
  }

  initCinematicLighting() {
    // 1. Warm morning ambient fill (softened to prevent bleaching)
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.85);
    this.group.add(ambientLight);

    // 2. Radiant Saudi Morning Sun (Softened directional light with rich desert shadow contrast)
    const sunLight = new THREE.DirectionalLight(0xffeed8, 2.15);
    sunLight.position.set(14, 22, 16);
    sunLight.target.position.set(0, -2, -15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -36;
    sunLight.shadow.camera.right = 36;
    sunLight.shadow.camera.top = 36;
    sunLight.shadow.camera.bottom = -36;
    sunLight.shadow.bias = -0.0003;
    this.group.add(sunLight);
    this.group.add(sunLight.target);
    this.sunLight = sunLight;

    // 3. Golden Hour Fill Light (balanced rim warmth)
    const fillLight = new THREE.DirectionalLight(0xffc272, 0.50);
    fillLight.position.set(-18, 14, 8);
    this.group.add(fillLight);

    // 4. Sky & Desert Ground Bounce
    const hemiLight = new THREE.HemisphereLight(0x7eb2d4, 0xdba468, 0.40);
    this.group.add(hemiLight);
  }

  initAtmosphericSky() {
    // High-resolution Photorealistic Sky Dome Texture (2048 x 1024)
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Authentic Saudi Arabian Dawn Gradient (Smooth, deep atmospheric ramp)
    const grad = ctx.createLinearGradient(0, 0, 0, 1024);
    grad.addColorStop(0, '#153b61');    // Celestial morning deep sapphire
    grad.addColorStop(0.18, '#2b5f88'); // Morning azure
    grad.addColorStop(0.38, '#5994ba'); // Cerulean morning haze
    grad.addColorStop(0.55, '#f5ba8a'); // Warm apricot dawn blush
    grad.addColorStop(0.70, '#ffdbaf'); // Radiant golden dawn horizon glow
    grad.addColorStop(0.85, '#f2ad61'); // Warm desert horizon gold
    grad.addColorStop(1, '#d8853b');    // Horizon desert amber
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 2048, 1024);

    // 2. Whispering Morning Cirrus & Stratus Cloud Veils with Sunlit Golden Rims
    ctx.save();
    for (let c = 0; c < 24; c++) {
      const cy = 80 + c * 20 + (c % 4) * 14;
      const cLen = 380 + (c % 6) * 190;
      const cx = (c * 170 + (c % 3) * 60) % 2048;

      const cloudGrad = ctx.createLinearGradient(cx, cy, cx + cLen, cy);
      cloudGrad.addColorStop(0, 'rgba(255, 245, 235, 0)');
      cloudGrad.addColorStop(0.25, 'rgba(255, 252, 246, 0.42)');
      cloudGrad.addColorStop(0.65, 'rgba(255, 226, 180, 0.32)');
      cloudGrad.addColorStop(1, 'rgba(255, 245, 235, 0)');

      ctx.fillStyle = cloudGrad;
      ctx.beginPath();
      ctx.ellipse(cx + cLen / 2, cy, cLen / 2, 8 + (c % 4) * 5, 0.015, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Luminous Morning Sun Painted Directly onto Sky Canvas (Upper-Right Celestial Position)
    const sunX = 1460;
    const sunY = 280;

    // Radiant Solar Corona & Morning Light Bloom (gentle, warm, non-glaring)
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 520);
    sunGrad.addColorStop(0, 'rgba(255, 255, 250, 0.95)');
    sunGrad.addColorStop(0.08, 'rgba(255, 248, 222, 0.78)');
    sunGrad.addColorStop(0.24, 'rgba(255, 220, 140, 0.42)');
    sunGrad.addColorStop(0.55, 'rgba(255, 180, 85, 0.16)');
    sunGrad.addColorStop(1, 'rgba(255, 140, 50, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 520, 0, Math.PI * 2);
    ctx.fill();

    // Soft Volumetric Golden Solar Rays (God Rays) Radiating into the Sky
    ctx.save();
    ctx.translate(sunX, sunY);
    for (let r = 0; r < 20; r++) {
      const rAngle = -Math.PI * 0.90 + (r / 20) * Math.PI * 1.80;
      const rayGrad = ctx.createRadialGradient(0, 0, 40, 0, 0, 960);
      rayGrad.addColorStop(0, 'rgba(255, 252, 235, 0.18)');
      rayGrad.addColorStop(0.4, 'rgba(255, 225, 160, 0.08)');
      rayGrad.addColorStop(1, 'rgba(255, 170, 70, 0)');
      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 960, rAngle - 0.035, rAngle + 0.035);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 4. Soaring Arabian Desert Falcons / Birds in Distant Sky (صقور تحلق في سماء الوطن)
    ctx.save();
    ctx.fillStyle = 'rgba(42, 32, 22, 0.65)';
    const falconFlock = [
      { x: 1320, y: 240, scale: 0.75, flap: 0.1 },
      { x: 1355, y: 220, scale: 0.90, flap: -0.2 },
      { x: 1395, y: 250, scale: 0.60, flap: 0.15 },
      { x: 1280, y: 260, scale: 0.70, flap: 0.05 },
      { x: 1240, y: 285, scale: 0.55, flap: -0.1 },
      { x: 780,  y: 310, scale: 0.50, flap: 0.2 },
      { x: 810,  y: 295, scale: 0.65, flap: -0.15 },
      { x: 845,  y: 320, scale: 0.45, flap: 0.1 }
    ];

    falconFlock.forEach(f => {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.scale(f.scale, f.scale);
      // Falcon arched wings silhouette
      ctx.beginPath();
      ctx.moveTo(-16, f.flap * 10);
      ctx.quadraticCurveTo(-8, -10 + f.flap * 5, 0, 0);
      ctx.quadraticCurveTo(8, -10 + f.flap * 5, 16, f.flap * 10);
      ctx.quadraticCurveTo(8, -4, 0, 2);
      ctx.quadraticCurveTo(-8, -4, -16, f.flap * 10);
      ctx.fill();
      ctx.restore();
    });
    ctx.restore();

    const skyTex = new THREE.CanvasTexture(canvas);
    skyTex.mapping = THREE.EquirectangularReflectionMapping;
    if (this.scene) {
      this.scene.environment = skyTex;
    }

    const skyGeo = new THREE.SphereGeometry(240, 32, 24);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTex,
      side: THREE.BackSide,
      fog: false
    });

    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.group.add(skyMesh);
  }

  generateProceduralSandTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Base warm golden Arabian desert sand palette (#e2a358)
    ctx.fillStyle = '#e2a358';
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. High-Fidelity Wind Ripple Waves (تموجات السافي الذهبي بزاوية ريح طبيعية)
    ctx.save();
    ctx.translate(512, 512);
    ctx.rotate(0.24); // Prevailing desert wind angle
    ctx.translate(-512, -512);

    for (let y = -200; y < 1224; y += 3.5) {
      const freq1 = 0.052;
      const freq2 = 0.11;
      const rippleWave = Math.sin(y * freq1) * 0.85 + Math.sin(y * freq2) * 0.15;
      const highlightAlpha = Math.max(0, rippleWave) * 0.20;
      const shadowAlpha = Math.max(0, -rippleWave) * 0.16;

      // Sunlit ripple crest (Golden quartz highlight)
      ctx.fillStyle = `rgba(255, 249, 230, ${highlightAlpha})`;
      ctx.fillRect(-200, y, 1424, 1.8);

      // Sheltered ripple trough shadow (Warm umber)
      ctx.fillStyle = `rgba(135, 82, 28, ${shadowAlpha})`;
      ctx.fillRect(-200, y + 1.8, 1424, 1.7);
    }
    ctx.restore();

    // 3. Tactile Micro Sand Grains & Golden Quartz Sparkle Noise
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const noise = (Math.random() - 0.5) * 28;
      d[i] = Math.min(255, Math.max(0, d[i] + noise));
      d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise * 0.86));
      d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise * 0.55));
    }
    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(40, 40);
    tex.anisotropy = 16;
    return tex;
  }

  generateProceduralSandBumpTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);

    ctx.save();
    ctx.translate(256, 256);
    ctx.rotate(0.24);
    ctx.translate(-256, -256);

    for (let y = -100; y < 612; y += 3.5) {
      const val = 128 + Math.sin(y * 0.10) * 44;
      ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
      ctx.fillRect(-100, y, 712, 1.8);
    }
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(40, 40);
    return tex;
  }

  /**
   * Tuwaiq Escarpment Geological Strata Texture:
   * Layered sandstone, limestone caprock, desert varnish, and vertical erosional fissures
   */
  generateTuwaiqRockTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Base warm Najdi sandstone (#b8824a)
    ctx.fillStyle = '#b8824a';
    ctx.fillRect(0, 0, 1024, 1024);

    // Horizontal Sedimentary Geological Strata Lines (الطبقات الرسوبية الأفقية لجبال طويق)
    for (let y = 0; y < 1024; y += 6) {
      const strataType = Math.sin(y * 0.035) + Math.cos(y * 0.012);
      if (strataType > 0.4) {
        // Golden limestone ledge
        ctx.fillStyle = 'rgba(225, 185, 125, 0.45)';
        ctx.fillRect(0, y, 1024, 3.5);
      } else if (strataType < -0.4) {
        // Dark terracotta / iron-rich desert varnish band
        ctx.fillStyle = 'rgba(110, 60, 25, 0.50)';
        ctx.fillRect(0, y, 1024, 3.0);
      } else {
        // Sandstone midtone
        ctx.fillStyle = 'rgba(175, 120, 65, 0.25)';
        ctx.fillRect(0, y, 1024, 2.5);
      }
    }

    // Vertical erosional weathering channels & canyon striations
    for (let x = 0; x < 1024; x += 18) {
      const vAlpha = 0.08 + Math.random() * 0.12;
      ctx.fillStyle = `rgba(75, 40, 15, ${vAlpha})`;
      ctx.fillRect(x + Math.sin(x) * 4, 0, 2 + Math.random() * 3, 1024);
    }

    // Micro rock grain noise
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 22;
      d[i] = Math.min(255, Math.max(0, d[i] + n));
      d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n * 0.85));
      d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n * 0.60));
    }
    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 2);
    tex.anisotropy = 16;
    return tex;
  }

  /**
   * Snøhetta's Iconic Ithra Metallic Facade Texture:
   * 350 km of continuous wrapped stainless steel flat tubing (أنابيب الفولاذ المقاوم للصدأ)
   * Dense horizontal parallel pipe lines with metallic highlights, grooves, and authentic titanium-pewter gray body
   */
  generateIthraFacadeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Snøhetta's authentic titanium-pewter metallic steel base (#768593 - Clean architectural pewter gray, NOT black!)
    ctx.fillStyle = '#768593';
    ctx.fillRect(0, 0, 512, 512);

    // 350 km continuous horizontal wrapped stainless steel flat tubing
    for (let y = 0; y < 512; y += 4) {
      // Soft shadow recess between tubes (soft subtle pewter groove, NEVER black!)
      ctx.fillStyle = 'rgba(80, 92, 105, 0.30)';
      ctx.fillRect(0, y, 512, 1.2);

      // Metallic sunlit tube highlight crest
      ctx.fillStyle = 'rgba(240, 248, 255, 0.75)';
      ctx.fillRect(0, y + 1.2, 512, 1.0);

      // Brushed stainless steel midtone
      ctx.fillStyle = 'rgba(195, 210, 225, 0.55)';
      ctx.fillRect(0, y + 2.2, 512, 1.6);
    }

    // Micro metallic brush noise
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 16;
      d[i] = Math.min(255, Math.max(0, d[i] + n));
      d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n));
      d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n * 1.15));
    }
    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 16);
    tex.anisotropy = 16;
    return tex;
  }

  /**
   * Authentic Hijazi Mashrabiya & Rawshan Lattice Texture Generator (نقوش المنجور والمشربيات الحجازية):
   * Diagonal interlocking woodwork, carved geometric rosettes, and slatted louvers
   */
  generateRawshanLatticeTexture(baseHex = '#3a2212', darkHex = '#1a0d06') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 1. Dark interior void behind lattice
    ctx.fillStyle = '#0f0804';
    ctx.fillRect(0, 0, 512, 512);

    // 2. Intricate Criss-Cross Diagonal Wood Lattice (المنجور الحجازي المفرغ)
    ctx.strokeStyle = baseHex;
    ctx.lineWidth = 6;

    const step = 24;
    ctx.beginPath();
    for (let x = -512; x < 1024; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 512, 512);
      ctx.moveTo(x + 512, 0);
      ctx.lineTo(x, 512);
    }
    ctx.stroke();

    // 3. Central Carved Star / Geometric Rosette Medallions (النقوش الخشبية الحجازية)
    ctx.fillStyle = baseHex;
    for (let y = 64; y < 512; y += 128) {
      for (let x = 64; x < 512; x += 128) {
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillRect(x - 14, y - 3, 28, 6);
        ctx.fillRect(x - 3, y - 14, 6, 28);
      }
    }

    // 4. Horizontal Slatted Louver Shutters on Lower Panels (شرائح الأبجورات الخشبية)
    ctx.fillStyle = darkHex;
    for (let y = 300; y < 512; y += 10) {
      ctx.fillRect(0, y, 512, 4);
    }

    // 5. Outer Beveled Frame Borders
    ctx.lineWidth = 16;
    ctx.strokeStyle = baseHex;
    ctx.strokeRect(8, 8, 496, 496);

    // Inner dividing rails
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, 256);
    ctx.lineTo(512, 256);
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 512);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 16;
    return tex;
  }

  /**
   * Continuous Mathematical Terrain Elevation Function:
   * Multi-octave natural rolling barchan dunes with sweeping crests dipping between landmarks
   */
  getTerrainHeight(x, z) {
    // 1. Primary rolling barchan dunes creating majestic crests and valleys
    const dune1 = Math.sin(x * 0.08 + 0.4) * Math.cos(z * 0.07 - 0.2) * 1.85;
    const dune2 = Math.sin(x * 0.16 + z * 0.14) * 0.75;
    const dune3 = Math.cos(x * 0.05 - z * 0.06) * 0.95;
    let elevation = dune1 + dune2 + dune3;

    // 2. Stable, dignified podium for the Sacred Mosques (Kaaba & Madinah at z around -22)
    if (Math.abs(x) < 8.5 && z > -27.0 && z < -17.0) {
      elevation = elevation * 0.35 + 0.65;
    }

    // 3. Desert dune swale for Maraya and Hegra at z around -32
    if (z < -27.0 && z > -38.0) {
      elevation += Math.sin(x * 0.15) * 0.60;
    }

    // 4. Distant skyline dune crests
    if (z < -45.0 && z > -68.0) {
      elevation += Math.sin((x + 3.0) * 0.24) * 0.95;
    }

    // 5. Elevated golden sand ridge for heritage architecture on the right
    if (x > 12.0 && z > -28.0 && z < -10.0) {
      const ridgeBase = Math.min(1.0, (x - 12.0) / 4.0) * Math.sin(((z - -28.0) / 18.0) * Math.PI) * 1.5;
      elevation += ridgeBase;
    }

    // 6. Foreground dune under flagpole and text
    if (z > 0.0 && z < 10.0 && x < 0.0) {
      elevation += Math.sin((x + 5.0) * 0.25) * Math.cos(z * 0.22) * 0.65;
    }

    // Gently settle far behind distant skyline (z < -70)
    if (z < -70) {
      const t = Math.max(0, Math.min(1, (z - -95) / (-70 - -95)));
      elevation *= t;
    }

    return -2.4 + elevation;
  }

  /**
   * Vast, Seamless, Continuous Desert Terrain (360m x 360m):
   * Zero clipped edges, perfectly solid from foreground to far horizon
   */
  initVastDesertTerrain() {
    const terrainGeo = new THREE.PlaneGeometry(360, 360, 200, 200);
    terrainGeo.rotateX(-Math.PI / 2); // Orient directly on X-Z plane

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, this.getTerrainHeight(x, z));
    }
    terrainGeo.computeVertexNormals();

    const sandTexture = this.generateProceduralSandTexture();
    const sandBump = this.generateProceduralSandBumpTexture();

    const terrainMat = new THREE.MeshStandardMaterial({
      map: sandTexture,
      bumpMap: sandBump,
      bumpScale: 0.040, // Crisp 3D tactile sand ripples catching morning shadows
      roughness: 0.86,
      metalness: 0.02
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.position.set(0, 0, 0);
    terrainMesh.receiveShadow = true;
    this.group.add(terrainMesh);
  }

  /**
   * Heritage Architecture (المعمار التراثي الأصيل على اليمين فوق ارتفاع رملي كامل وواضح):
   * 1. Al Masmak Citadel (قصر المصمك النجدي التراثي بالرياض - قلعة كاملة بأبراجها الأربعة وشرفاتها)
   * 2. Bayt Naseef (بيت نصيف الحجازي الأصيل بجدة التاريخية - مبنى كامل برواشين متعددة وجهنمية)
   * كلاهما يتربعان على هضبة رملية مرتفعة ويظهران بالكامل داخل الشاشة
   */
  initHeritageArchitecture() {
    const heritageQuarter = new THREE.Group();
    heritageQuarter.position.set(0, -2.4, 0);

    // Shared Heritage Materials
    const mudMat = new THREE.MeshStandardMaterial({
      color: 0xb8834c, // Warm Najdi adobe mud (طين ولبن أصيل)
      roughness: 0.95,
      metalness: 0.02
    });

    const mudWhitePlasterMat = new THREE.MeshStandardMaterial({
      color: 0xede4d3, // White gypsum plaster accents (الجص الأبيض النجدي)
      roughness: 0.90
    });

    const coralMat = new THREE.MeshStandardMaterial({
      color: 0xe2d6c3, // Jeddah coral limestone (حجر المنقبي)
      roughness: 0.88,
      metalness: 0.02
    });

    const darkWoodMat = new THREE.MeshStandardMaterial({
      color: 0x3a2212, // Aged teak/tamarisk wood (خشب الساج والأثل العتيق)
      roughness: 0.80,
      metalness: 0.08
    });

    const bougainvilleaPetalMat = new THREE.MeshStandardMaterial({
      color: 0xdf1684, // Vivid magenta Bougainvillea (زهور الجهنمية الفاقعة)
      roughness: 0.55
    });

    const bougainvilleaLeafMat = new THREE.MeshStandardMaterial({
      color: 0x225518, // Rich green leaves
      roughness: 0.65
    });

    // Historic Hijazi Dark Green Rawashin Material (الرواشين الخضراء الداكنة العريقة لبيوت جدة البلد)
    const darkGreenWoodMat = new THREE.MeshStandardMaterial({
      color: 0x16381e, // Authentic historic Jeddah dark green
      roughness: 0.74,
      metalness: 0.08
    });

    // --- 1. AL MASMAK CITADEL (قصر المصمك النجدي - متمركز بفخامة في الجناح التراثي الأيمن) ---
    const masmak = this.createAlMasmakCitadel(mudMat, mudWhitePlasterMat, darkWoodMat);
    const masmakX = 16.5, masmakZ = -17.5;
    const masmakGroundY = this.getTerrainHeight(masmakX, masmakZ) - (-2.4);
    masmak.position.set(masmakX, masmakGroundY, masmakZ);
    masmak.scale.set(0.88, 0.88, 0.88);
    masmak.rotation.y = -Math.PI * 0.12;
    heritageQuarter.add(masmak);

    // --- 2. SECOND HEJAZI MANSION (مبنى حجازي ثانٍ - رواشين خضراء داكنة شامخة في عمق التراث) ---
    const secondHejazi = this.createSecondHejaziBuilding(coralMat, darkGreenWoodMat, bougainvilleaPetalMat, bougainvilleaLeafMat);
    const hejazi2X = 21.0, hejazi2Z = -25.5;
    const hejazi2GroundY = this.getTerrainHeight(hejazi2X, hejazi2Z) - (-2.4);
    secondHejazi.position.set(hejazi2X, hejazi2GroundY, hejazi2Z);
    secondHejazi.scale.set(0.95, 1.15, 0.95);
    secondHejazi.rotation.y = -Math.PI * 0.14;
    heritageQuarter.add(secondHejazi);

    // --- 3. BAYT NASEEF (بيت نصيف الحجازي الأصيل - يمين الشاشة برواشينه وزهور الجهنمية) ---
    const naseef = this.createBaytNaseef(coralMat, darkWoodMat, bougainvilleaPetalMat, bougainvilleaLeafMat);
    const naseefX = 25.5, naseefZ = -19.5;
    const naseefGroundY = this.getTerrainHeight(naseefX, naseefZ) - (-2.4);
    naseef.position.set(naseefX, naseefGroundY, naseefZ);
    naseef.scale.set(0.90, 0.90, 0.90);
    naseef.rotation.y = -Math.PI * 0.18;
    heritageQuarter.add(naseef);

    this.group.add(heritageQuarter);
  }

  /**
   * Complete 3D Architectural Model of Al Masmak Fortress (قصر المصمك التراثي بالرياض):
   * - Rectangular mud fortress with inward sloping walls
   * - 4 Round corner watchtowers with crenellated battlements
   * - Stepped triangular crenellations (الشرفات النجدية المسننة)
   * - Triangular ventilation holes (مثلثات الفرجة)
   * - Traditional tamarisk rain spouts (ميازيب خشب الأثل)
   * - Historic fortress gate with wicket door (باب الخوخة)
   */
  createAlMasmakCitadel(mudMat, plasterMat, woodMat) {
    const citadel = new THREE.Group();

    const w = 11.0;
    const h = 6.8;
    const d = 8.5;

    // Subterranean mud foundation plinth (4m deep into the sand dunes)
    const masmakSubBase = new THREE.Mesh(new THREE.BoxGeometry(w + 1.2, 4.0, d + 1.2), mudMat);
    masmakSubBase.position.y = -2.0;
    citadel.add(masmakSubBase);

    // 1. Main Citadel Fortress Block (inward tapering adobe walls)
    const mainBodyGeo = new THREE.CylinderGeometry(w * 0.46, w * 0.51, h, 4);
    const mainBody = new THREE.Mesh(mainBodyGeo, mudMat);
    mainBody.rotation.y = Math.PI / 4;
    mainBody.scale.set(1.0, 1.0, d / w);
    mainBody.position.y = h / 2;
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    citadel.add(mainBody);

    // 2. Four Majestic Cylindrical Corner Watchtowers (الأبراج الأسطوانية الأربعة)
    const towerH = 8.8;
    const towerRTop = 1.05;
    const towerRBot = 1.35;
    const towerGeo = new THREE.CylinderGeometry(towerRTop, towerRBot, towerH, 16);

    const cornerOffsets = [
      { x: -w / 2 + 0.3, z: -d / 2 + 0.3 },
      { x: w / 2 - 0.3, z: -d / 2 + 0.3 },
      { x: -w / 2 + 0.3, z: d / 2 - 0.3 },
      { x: w / 2 - 0.3, z: d / 2 - 0.3 }
    ];

    cornerOffsets.forEach(pos => {
      const tower = new THREE.Mesh(towerGeo, mudMat);
      tower.position.set(pos.x, towerH / 2, pos.z);
      tower.castShadow = true;
      tower.receiveShadow = true;
      citadel.add(tower);

      // Tower stepped crenellations on top (شرفات البرج المسننة)
      for (let t = 0; t < 8; t++) {
        const ang = (t / 8) * Math.PI * 2;
        const cren = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.45, 3), plasterMat);
        cren.position.set(
          pos.x + Math.cos(ang) * (towerRTop - 0.08),
          towerH + 0.22,
          pos.z + Math.sin(ang) * (towerRTop - 0.08)
        );
        citadel.add(cren);
      }

      // Tower arrow slits / lookout vents
      const slitMat = new THREE.MeshBasicMaterial({ color: 0x1f140b });
      for (let s = 0; s < 4; s++) {
        const sAng = (s / 4) * Math.PI * 2 + Math.PI / 4;
        const slit = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.38, 0.12), slitMat);
        slit.position.set(
          pos.x + Math.cos(sAng) * (towerRTop + 0.04),
          towerH - 1.2,
          pos.z + Math.sin(sAng) * (towerRTop + 0.04)
        );
        slit.rotation.y = -sAng;
        citadel.add(slit);
      }
    });

    // 3. Stepped Triangular Crenellations along Main Parapets (الشرفات المسننة للأسوار)
    const crenStepX = (w - 2.0) / 10;
    for (let c = 0; c <= 10; c++) {
      const cx = -w / 2 + 1.0 + c * crenStepX;
      // Front parapet
      const crenF = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.48, 3), plasterMat);
      crenF.position.set(cx, h + 0.24, d / 2);
      // Back parapet
      const crenB = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.48, 3), plasterMat);
      crenB.position.set(cx, h + 0.24, -d / 2);
      citadel.add(crenF, crenB);
    }

    // Side parapet crenellations
    const crenStepZ = (d - 2.0) / 8;
    for (let s = 1; s < 8; s++) {
      const cz = -d / 2 + 1.0 + s * crenStepZ;
      const crenL = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.48, 3), plasterMat);
      crenL.position.set(-w / 2, h + 0.24, cz);
      const crenR = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.48, 3), plasterMat);
      crenR.position.set(w / 2, h + 0.24, cz);
      citadel.add(crenL, crenR);
    }

    // 4. Horizontal Bands of Triangular Ventilation Openings (مثلثات الفرجة والنقوش النجدية)
    const ventMat = new THREE.MeshBasicMaterial({ color: 0x1f140b });
    for (let v = 0; v < 8; v++) {
      const vx = -w / 2 + 1.6 + v * (w - 3.2) / 7;
      // Upper tier of triangular vents
      const vent1 = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.24, 3), ventMat);
      vent1.position.set(vx, h - 0.95, d / 2 + 0.05);
      // Lower inverted tier forming diamond motifs
      const vent2 = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.24, 3), ventMat);
      vent2.rotation.z = Math.PI;
      vent2.position.set(vx + 0.35, h - 1.55, d / 2 + 0.05);
      citadel.add(vent1, vent2);
    }

    // 5. Projecting Wooden Rain Spouts (الميازيب الخشبية من خشب الأثل)
    for (let m = 0; m < 5; m++) {
      const mx = -w / 2 + 2.0 + m * (w - 4.0) / 4;
      const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.95, 6), woodMat);
      spout.rotation.x = Math.PI / 2;
      spout.position.set(mx, h - 0.18, d / 2 + 0.48);
      citadel.add(spout);
    }

    // 6. The Historic Masmak Gate with Wicket Door (باب المصمك وباب الخوخة الشهير)
    const gateFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.4, 0.25), woodMat);
    gateFrame.position.set(0, 1.7, d / 2 + 0.06);
    gateFrame.castShadow = true;
    citadel.add(gateFrame);

    // The small wicket door (باب الخوخة)
    const wicketMat = new THREE.MeshStandardMaterial({ color: 0x27160c, roughness: 0.85 });
    const wicketDoor = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.5, 0.1), wicketMat);
    wicketDoor.position.set(-0.25, 1.0, d / 2 + 0.16);
    citadel.add(wicketDoor);

    // Decorative lintel above gate (العتبة الخشبية)
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.25, 0.35), woodMat);
    lintel.position.set(0, 3.5, d / 2 + 0.12);
    citadel.add(lintel);

    return citadel;
  }

  /**
   * Complete 3D Architectural Model of Bayt Naseef (بيت نصيف التاريخي بجدة):
   * - Stately 4-story coral limestone mansion (حجر المنقبي)
   * - Multiple protruding carved wooden Rawasheen (رواشين خشبية بارزة مع مشربيات ومنجور مفرغ)
   * - Horizontal wooden tie-beams (التكاليل الخشبية الحجازية)
   * - Realistic cascading Bougainvillea vines (أغصان جهنمية متسلقة طبيعية وأوراق وزهور)
   * - Traditional arched entryway and roof sunshade (الخرجة الحجازية)
   */
  createBaytNaseef(coralMat, woodMat, petalMat, leafMat) {
    const naseef = new THREE.Group();

    const w = 8.5;
    const h = 12.5;
    const d = 7.0;

    // Subterranean coral stone foundation plinth (4m deep into the sand dunes)
    const naseefSubBase = new THREE.Mesh(new THREE.BoxGeometry(w + 1.0, 4.0, d + 1.0), coralMat);
    naseefSubBase.position.y = -2.0;
    naseef.add(naseefSubBase);

    // 1. Stately 4-Story Coral Limestone Mansion Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), coralMat);
    body.position.y = h / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    naseef.add(body);

    // 2. Horizontal Wooden Tie-Beams (التكاليل الخشبية الحجازية الفاصلة بين الأدوار)
    for (let floor = 1; floor <= 3; floor++) {
      const beamY = floor * 3.1;
      const beam = new THREE.Mesh(new THREE.BoxGeometry(w + 0.16, 0.15, d + 0.16), woodMat);
      beam.position.y = beamY;
      naseef.add(beam);
    }

    // 3. Ground Floor: Traditional Arched Doorway & Recessed Service Windows
    const entrance = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.6, 0.15), woodMat);
    entrance.position.set(0, 1.3, d / 2 + 0.08);
    entrance.castShadow = true;
    naseef.add(entrance);

    // Flanking ground floor grilled windows
    const winMat = new THREE.MeshStandardMaterial({ color: 0x221309, roughness: 0.9 });
    const winGeo = new THREE.BoxGeometry(0.9, 1.1, 0.1);
    const winL = new THREE.Mesh(winGeo, winMat);
    winL.position.set(-2.6, 1.4, d / 2 + 0.05);
    const winR = new THREE.Mesh(winGeo, winMat);
    winR.position.set(2.6, 1.4, d / 2 + 0.05);
    naseef.add(winL, winR);

    // Procedural Brown Teak Lattice Texture (المنجور الحجازي البني)
    const brownLatticeTex = this.generateRawshanLatticeTexture('#4a2e18', '#1a0c06');

    // 4. Floor 2: Twin Grand Projecting Rawasheen (رواشين الدور الثاني)
    const rawshan2L = this.createDetailedRawshan(2.0, 2.5, 0.85, woodMat, brownLatticeTex);
    rawshan2L.position.set(-2.3, 4.6, d / 2 + 0.42);
    const rawshan2R = this.createDetailedRawshan(2.0, 2.5, 0.85, woodMat, brownLatticeTex);
    rawshan2R.position.set(2.3, 4.6, d / 2 + 0.42);
    naseef.add(rawshan2L, rawshan2R);

    // 5. Floor 3: Triple Central Rawshan Gallery (رواشين الدور الثالث الكبرى)
    const rawshan3Center = this.createDetailedRawshan(2.4, 2.7, 0.95, woodMat, brownLatticeTex);
    rawshan3Center.position.set(0, 7.8, d / 2 + 0.48);
    naseef.add(rawshan3Center);

    const rawshan3L = this.createDetailedRawshan(1.6, 2.2, 0.75, woodMat, brownLatticeTex);
    rawshan3L.position.set(-2.6, 7.8, d / 2 + 0.38);
    const rawshan3R = this.createDetailedRawshan(1.6, 2.2, 0.75, woodMat, brownLatticeTex);
    rawshan3R.position.set(2.6, 7.8, d / 2 + 0.38);
    naseef.add(rawshan3L, rawshan3R);

    // 6. Floor 4: Rooftop Shaded Pavilion / Terrace (الخرجة / الطيارة الحجازية)
    const pavilion = new THREE.Group();
    pavilion.position.set(0, h, 0);

    const parapetF = new THREE.Mesh(new THREE.BoxGeometry(w, 0.7, 0.25), coralMat);
    parapetF.position.set(0, 0.35, d / 2);
    pavilion.add(parapetF);

    const roofCover = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.15, 3.2), woodMat);
    roofCover.position.set(0, 2.2, 0.6);
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.2, 8);
    for (let p = 0; p < 4; p++) {
      const px = (p % 2 === 0 ? -1 : 1) * 1.9;
      const pz = (p < 2 ? -1 : 1) * 1.4 + 0.6;
      const post = new THREE.Mesh(postGeo, woodMat);
      post.position.set(px, 1.1, pz);
      pavilion.add(post);
    }
    pavilion.add(roofCover);
    naseef.add(pavilion);

    // 7. Realistic Cascading Bougainvillea with Gnarled Vine & Lush Flowers
    const bougainvillea = this.createRealisticBougainvillea(w, h, d, petalMat, leafMat, 1);
    naseef.add(bougainvillea);

    return naseef;
  }

  /**
   * Complete 3D Architectural Model of Second Historic Hejazi Building (المبنى الحجازي الثاني ورا المصمك):
   * - 3-Story authentic Jeddah mansion, slightly shorter than Bayt Naseef (h: 9.8m vs 12.5m)
   * - Signature Dark Green Rawasheen (الرواشين الحجازية الخضراء الداكنة العريقة)
   * - Horizontal wooden tie-beams, arched gate, and climbing bougainvillea
   */
  createSecondHejaziBuilding(coralMat, greenWoodMat, petalMat, leafMat) {
    const bld = new THREE.Group();

    const w = 7.6;
    const h = 14.2; // 4 Grand Stately Historic Stories (طوله بارز وشامخ جداً ليرتفع وراء المصمك)
    const d = 6.6;

    // Subterranean coral stone foundation plinth (6m deep into sand dunes for grounded stability)
    const subBase = new THREE.Mesh(new THREE.BoxGeometry(w + 1.2, 6.0, d + 1.2), coralMat);
    subBase.position.y = -3.0;
    bld.add(subBase);

    // 1. 4-Story Coral Limestone Mansion Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), coralMat);
    body.position.y = h / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    bld.add(body);

    // 2. Horizontal Wooden Tie-Beams separating each of the 4 floors (التكاليل الحجازية الخضراء)
    for (let floor = 1; floor <= 3; floor++) {
      const beamY = floor * 3.55;
      const beam = new THREE.Mesh(new THREE.BoxGeometry(w + 0.18, 0.16, d + 0.18), greenWoodMat);
      beam.position.y = beamY;
      bld.add(beam);
    }

    // 3. Ground Floor: Traditional Arched Doorway with wicket detail
    const entrance = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.5, 0.15), greenWoodMat);
    entrance.position.set(0, 1.25, d / 2 + 0.08);
    entrance.castShadow = true;
    bld.add(entrance);

    // Ground floor barred iron service windows
    const winGeo = new THREE.BoxGeometry(0.8, 1.0, 0.1);
    const winL = new THREE.Mesh(winGeo, greenWoodMat);
    winL.position.set(-2.2, 1.35, d / 2 + 0.05);
    const winR = new THREE.Mesh(winGeo, greenWoodMat);
    winR.position.set(2.2, 1.35, d / 2 + 0.05);
    bld.add(winL, winR);

    // Procedural Historic Jeddah Dark Green Rawshan Lattice Texture
    const greenLatticeTex = this.generateRawshanLatticeTexture('#22522e', '#0b2011');

    // 4. Floor 2: Twin Authentic Dark Green Rawasheen (رواشين الدور الثاني)
    const rawshan2L = this.createDetailedRawshan(1.9, 2.3, 0.80, greenWoodMat, greenLatticeTex);
    rawshan2L.position.set(-2.0, 5.2, d / 2 + 0.40);
    const rawshan2R = this.createDetailedRawshan(1.9, 2.3, 0.80, greenWoodMat, greenLatticeTex);
    rawshan2R.position.set(2.0, 5.2, d / 2 + 0.40);
    bld.add(rawshan2L, rawshan2R);

    // 5. Floor 3: Grand Central Triple Dark Green Rawshan Gallery (رواشين الدور الثالث الكبرى)
    const rawshan3Center = this.createDetailedRawshan(2.3, 2.5, 0.90, greenWoodMat, greenLatticeTex);
    rawshan3Center.position.set(0, 8.8, d / 2 + 0.45);
    bld.add(rawshan3Center);

    const rawshan3L = this.createDetailedRawshan(1.6, 2.1, 0.70, greenWoodMat, greenLatticeTex);
    rawshan3L.position.set(-2.4, 8.8, d / 2 + 0.35);
    const rawshan3R = this.createDetailedRawshan(1.6, 2.1, 0.70, greenWoodMat, greenLatticeTex);
    rawshan3R.position.set(2.4, 8.8, d / 2 + 0.35);
    bld.add(rawshan3L, rawshan3R);

    // 6. Floor 4: Upper Crown Dark Green Rawasheen (رواشين الدور الرابع الشامخة فوق المصمك)
    const rawshan4Center = this.createDetailedRawshan(2.1, 2.2, 0.80, greenWoodMat, greenLatticeTex);
    rawshan4Center.position.set(0, 12.3, d / 2 + 0.40);
    bld.add(rawshan4Center);

    const rawshan4L = this.createDetailedRawshan(1.5, 1.9, 0.65, greenWoodMat, greenLatticeTex);
    rawshan4L.position.set(-2.3, 12.3, d / 2 + 0.32);
    const rawshan4R = this.createDetailedRawshan(1.5, 1.9, 0.65, greenWoodMat, greenLatticeTex);
    rawshan4R.position.set(2.3, 12.3, d / 2 + 0.32);
    bld.add(rawshan4L, rawshan4R);

    // 7. Rooftop Parapet with Stepped Islamic Crenellations (السترة العلوية المسننة)
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(w, 0.70, 0.22), coralMat);
    parapet.position.set(0, h + 0.35, d / 2);
    bld.add(parapet);

    // 8. Traditional Wooden Rooftop Pergola Trellis (عريشة السطح الخشبية الحجازية التراثية)
    const pergolaGroup = new THREE.Group();
    const postGeo = new THREE.BoxGeometry(0.12, 1.8, 0.12);
    const postPositions = [
      [-w / 2 + 0.8, d / 2 - 0.8],
      [w / 2 - 0.8, d / 2 - 0.8],
      [-w / 2 + 0.8, -d / 2 + 0.8],
      [w / 2 - 0.8, -d / 2 + 0.8]
    ];
    postPositions.forEach(([px, pz]) => {
      const post = new THREE.Mesh(postGeo, greenWoodMat);
      post.position.set(px, h + 0.9, pz);
      pergolaGroup.add(post);
    });
    // Slatted roof rafters
    for (let r = -2.2; r <= 2.2; r += 0.8) {
      const rafter = new THREE.Mesh(new THREE.BoxGeometry(w - 1.2, 0.08, 0.10), greenWoodMat);
      rafter.position.set(0, h + 1.85, r);
      pergolaGroup.add(rafter);
    }
    bld.add(pergolaGroup);

    // 9. Cascading Bougainvillea on left corner (زهور الجهنمية المتسلقة لكامل الارتفاع)
    const boug = this.createRealisticBougainvillea(w, h, d, petalMat, leafMat, -1);
    bld.add(boug);

    return bld;
  }

  /**
   * Intricate 3D Hejazi Rawshan (الروشان الحجازي التراثي فائق التفاصيل):
   * - Stepped multi-tiered console corbels (الكوابيل المنحوتة)
   * - Procedural Mashrabiya / Mangour lattice woodwork with carved rosettes and louvers
   * - Sloped wooden sun-hood with decorative dentil cornice
   * - Projecting mid-belt railing shelf and side lattice panels
   */
  createDetailedRawshan(w, h, d, woodMat, latticeTex, hoodDentils = true) {
    const rawshan = new THREE.Group();

    // 1. Projecting Wooden Bay Box (Main structural body)
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), woodMat);
    box.castShadow = true;
    rawshan.add(box);

    // 2. High-Detail Mashrabiya / Mangour Lattice Panels on Front & Sides
    const screenMat = new THREE.MeshStandardMaterial({
      map: latticeTex,
      bumpMap: latticeTex,
      bumpScale: 0.025,
      roughness: 0.82,
      metalness: 0.06
    });

    // Front Screen Panel
    const screenF = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.90, h * 0.82), screenMat);
    screenF.position.set(0, 0, d / 2 + 0.02);
    rawshan.add(screenF);

    // Side Screen Panels (Left & Right)
    const screenL = new THREE.Mesh(new THREE.PlaneGeometry(d * 0.82, h * 0.80), screenMat);
    screenL.rotation.y = -Math.PI / 2;
    screenL.position.set(-w / 2 - 0.02, 0, 0);
    const screenR = new THREE.Mesh(new THREE.PlaneGeometry(d * 0.82, h * 0.80), screenMat);
    screenR.rotation.y = Math.PI / 2;
    screenR.position.set(w / 2 + 0.02, 0, 0);
    rawshan.add(screenL, screenR);

    // 3. Protruding Horizontal Railing & Middle Belt Shelf (الحزام الخشبي الأوسط)
    const midBelt = new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, 0.12, d + 0.12), woodMat);
    midBelt.position.y = 0;
    rawshan.add(midBelt);

    // 4. Sloped Wooden Sun-Hood Cornice (المظلة الخشبية المائلة مع الإفريز)
    const hoodGeo = new THREE.CylinderGeometry(w * 0.42, w * 0.58, 0.45, 4);
    const hood = new THREE.Mesh(hoodGeo, woodMat);
    hood.rotation.y = Math.PI / 4;
    hood.position.set(0, h / 2 + 0.22, 0);
    hood.scale.set(1.0, 1.0, d / w);
    rawshan.add(hood);

    // Decorative Dentils along Hood Rim (الشرفات الخشبية المسننة)
    if (hoodDentils) {
      const dentilCount = Math.max(3, Math.floor(w / 0.42));
      for (let dt = 0; dt < dentilCount; dt++) {
        const dtx = -w / 2 + 0.18 + dt * (w - 0.36) / (dentilCount - 1 || 1);
        const dentil = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.08), woodMat);
        dentil.position.set(dtx, h / 2 + 0.08, d / 2 + 0.08);
        rawshan.add(dentil);
      }
    }

    // 5. Multi-Tier Stepped Console Corbels Underneath (الكوابيل المنحوتة المتدرجة الحاملة)
    const corbelCount = w > 2.0 ? 3 : 2;
    for (let cb = 0; cb < corbelCount; cb++) {
      const cbx = corbelCount === 3
        ? (-w / 2 + 0.35 + cb * (w - 0.7) / 2)
        : (cb === 0 ? -w / 2 + 0.35 : w / 2 - 0.35);

      const corbelGroup = new THREE.Group();
      corbelGroup.position.set(cbx, -h / 2, 0);

      const step1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.32, d * 0.90), woodMat);
      step1.position.set(0, -0.16, 0);
      const step2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.30, d * 0.65), woodMat);
      step2.position.set(0, -0.42, d * 0.12);
      const step3 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.26, d * 0.40), woodMat);
      step3.position.set(0, -0.66, d * 0.24);

      corbelGroup.add(step1, step2, step3);
      rawshan.add(corbelGroup);
    }

    return rawshan;
  }

  /**
   * Realistic Botanical Bougainvillea (الجهنمية الحجازية المتسلقة بواقعية فائقة):
   * - Gnarled, woody climbing vine trunk crawling up building corner
   * - Horizontal runner branches wrapping around Rawashin and beams
   * - Multi-layered foliage with deep green leaf backing
   * - Vivid cascading petal bracts in rich fuchsia, magenta, and crimson
   */
  createRealisticBougainvillea(w, h, d, petalMat, leafMat, cornerX = 1) {
    const boug = new THREE.Group();

    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x4a321f, // Aged bark brown
      roughness: 0.92,
      metalness: 0.04
    });

    const bx = (w / 2 - 0.15) * cornerX;
    const bz = d / 2 + 0.10;

    // 1. Gnarled Woody Climbing Trunk
    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(bx, 0, bz),
      new THREE.Vector3(bx + 0.14 * cornerX, h * 0.22, bz + 0.06),
      new THREE.Vector3(bx - 0.10 * cornerX, h * 0.45, bz + 0.14),
      new THREE.Vector3(bx + 0.16 * cornerX, h * 0.68, bz + 0.10),
      new THREE.Vector3(bx - 0.06 * cornerX, h * 0.90, bz + 0.18),
      new THREE.Vector3(bx - 0.35 * cornerX, h + 0.25, bz + 0.12)
    ]);
    const trunk = new THREE.Mesh(new THREE.TubeGeometry(trunkCurve, 24, 0.075, 8, false), stemMat);
    boug.add(trunk);

    // 2. Horizontal Runner Branches along Floors
    const runner1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(bx, h * 0.38, bz),
      new THREE.Vector3(bx - 1.2 * cornerX, h * 0.39, bz + 0.20),
      new THREE.Vector3(bx - 2.4 * cornerX, h * 0.36, bz + 0.42)
    ]);
    boug.add(new THREE.Mesh(new THREE.TubeGeometry(runner1, 16, 0.042, 6, false), stemMat));

    const runner2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(bx, h * 0.64, bz),
      new THREE.Vector3(bx - 1.4 * cornerX, h * 0.65, bz + 0.26),
      new THREE.Vector3(bx - 2.8 * cornerX, h * 0.62, bz + 0.48)
    ]);
    boug.add(new THREE.Mesh(new THREE.TubeGeometry(runner2, 16, 0.042, 6, false), stemMat));

    // 3. Flower Petal & Foliage Clusters
    const clusterSites = [
      { x: bx, y: 1.8, z: bz + 0.15, count: 26, r: 0.65 },
      { x: bx, y: 3.5, z: bz + 0.25, count: 34, r: 0.85 },
      { x: bx - 1.2 * cornerX, y: 4.8, z: bz + 0.48, count: 40, r: 1.0 },  // Under floor 2 Rawshan
      { x: bx, y: 6.2, z: bz + 0.30, count: 38, r: 0.90 },
      { x: bx - 2.0 * cornerX, y: 7.8, z: bz + 0.55, count: 44, r: 1.1 },  // Drape on floor 3 Rawshan
      { x: bx - 0.4 * cornerX, y: h + 0.2, z: bz + 0.35, count: 48, r: 1.2 }, // Rooftop spill
      { x: bx - 1.8 * cornerX, y: h + 0.1, z: bz + 0.25, count: 36, r: 0.95 }
    ];

    const petalGeo = new THREE.DodecahedronGeometry(0.12, 0);
    const leafGeo = new THREE.PlaneGeometry(0.18, 0.12);

    const darkPetalMat = new THREE.MeshStandardMaterial({ color: 0xb51268, roughness: 0.60 });
    const brightPetalMat = new THREE.MeshStandardMaterial({ color: 0xf52598, roughness: 0.50 });
    const deepLeafMat = new THREE.MeshStandardMaterial({ color: 0x1a4512, roughness: 0.70, side: THREE.DoubleSide });

    clusterSites.forEach(site => {
      for (let i = 0; i < site.count; i++) {
        // Leaves densely backing the flower cluster
        const lx = site.x + (Math.random() - 0.5) * site.r;
        const ly = site.y + (Math.random() - 0.5) * site.r;
        const lz = site.z + (Math.random() - 0.5) * site.r * 0.7;

        const leaf = new THREE.Mesh(leafGeo, i % 2 === 0 ? leafMat : deepLeafMat);
        leaf.position.set(lx, ly, lz);
        leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        boug.add(leaf);

        // Flower Blossom Petals (in 3 harmonized magenta/crimson/fuchsia tones)
        const px = lx + (Math.random() - 0.5) * 0.25;
        const py = ly + (Math.random() - 0.5) * 0.25;
        const pz = lz + 0.08 + Math.random() * 0.15;

        const pMat = i % 3 === 0 ? darkPetalMat : (i % 3 === 1 ? petalMat : brightPetalMat);
        const petal = new THREE.Mesh(petalGeo, pMat);
        petal.position.set(px, py, pz);
        const s = 0.8 + Math.random() * 0.45;
        petal.scale.set(s, s, s);
        boug.add(petal);
      }
    });

    return boug;
  }

  /**
   * Modern Saudi Architectural Landmarks (Harmonized, realistic, uncluttered horizon z = -80 to -86):
   * 1. Kingdom Centre Tower (برج المملكة - الرياض): Inverted parabolic catenary arch, golden skybridge, reflective glass
   * 2. Al Faisaliah Tower (برج الفيصلية - الرياض): 4-sided pyramid, golden geodesic sphere, needle spire
   * 3. Ithra (مركز الملك عبد العزيز الثقافي العالمي - إثراء بالظهران / الشرقية): Smooth stainless steel pebble stones
   * 4. Khobar Water Tower (برج مياه الخبر - معلم الشرقية الأيقوني): Slender stem, flared observation deck, sea-glass dome
   * 5. KAFD PIF Tower (مركز الملك عبد الله المالي - الرياض): Faceted crystalline skyscraper
   */
  initModernSaudiSkyline() {
    const skyline = new THREE.Group();
    // Firmly grounded on the vast desert horizon at z = -58.0 with generous lateral spacing
    skyline.position.set(0.0, -2.4, -58.0);
    skyline.scale.set(1.0, 1.25, 1.0);

    // =========================================================================
    // Authentic Architectural Materials (Photorealistic Daylight Palette)
    // =========================================================================
    // Kingdom Centre: Reflective solar sky-blue glass
    const kingdomGlassMat = new THREE.MeshStandardMaterial({
      color: 0x6e9ec0,
      metalness: 0.35,
      roughness: 0.16
    });

    // Golden Skybridge
    const goldenSkyMat = new THREE.MeshStandardMaterial({
      color: 0xffc838,
      metalness: 0.65,
      roughness: 0.20,
      emissive: 0xd49818,
      emissiveIntensity: 0.50
    });

    // Procedural Rock Texture for Hegra / Madain Saleh & AlUla
    const rockTex = this.generateTuwaiqRockTexture();

    // Ithra: Snøhetta's authentic titanium-pewter brushed stainless steel (350 km tubular wrap)
    const ithraTex = this.generateIthraFacadeTexture();
    const ithraSteelMat = new THREE.MeshStandardMaterial({
      color: 0x9bb0c4, // Clean titanium-pewter brushed stainless steel
      map: ithraTex,
      bumpMap: ithraTex,
      bumpScale: 0.032,
      metalness: 0.82,
      roughness: 0.28
    });

    // Ithra: Stainless steel tubing cladding wrap rings
    const ithraRingMat = new THREE.MeshStandardMaterial({
      color: 0xd8e4ef,
      metalness: 0.90,
      roughness: 0.18
    });

    // Ithra: Deep reflective cyan-grey solar ribbon glass
    const ithraGlassMat = new THREE.MeshStandardMaterial({
      color: 0x142533,
      metalness: 0.92,
      roughness: 0.08
    });

    // Ithra: Modern dark architectural granite podium terrace
    const ithraGraniteMat = new THREE.MeshStandardMaterial({
      color: 0x54504c,
      roughness: 0.88,
      metalness: 0.08
    });

    // White Architectural Structural Elements & Norman Foster Chevron Trusses
    const whiteTrussMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.12,
      roughness: 0.35
    });

    // Al Faisaliah Core: Reflective silver-blue glass pyramid
    const faisaliahCoreMat = new THREE.MeshStandardMaterial({
      color: 0x68889a,
      metalness: 0.30,
      roughness: 0.22
    });

    // Makkah Clock Tower: Saudi desert cream limestone & beige granite
    const makkahStoneMat = new THREE.MeshStandardMaterial({
      color: 0xded5c4,
      roughness: 0.70,
      metalness: 0.05
    });

    // Makkah Clock Tower: Recessed lancet windows (reflective slate-blue)
    const makkahWindowMat = new THREE.MeshStandardMaterial({
      color: 0x4d708a,
      roughness: 0.32,
      metalness: 0.22
    });

    // Makkah Clock Tower Spire Materials (Aged Islamic limestone & bronze structural ribs)
    const makkahSpireMat = new THREE.MeshStandardMaterial({
      color: 0xbcaa96, // Warm aged Islamic desert limestone
      roughness: 0.68,
      metalness: 0.12
    });
    const makkahBronzeMat = new THREE.MeshStandardMaterial({
      color: 0x9e7938, // Warm Islamic structural bronze
      roughness: 0.38,
      metalness: 0.68
    });

    // Khobar Water Tower: Warm Sunset Sand/Coral-Cream Concrete
    const khobarConcreteMat = new THREE.MeshStandardMaterial({
      color: 0xf2e8dd, // Warm sandstone/coral cream concrete
      roughness: 0.60,
      metalness: 0.08
    });

    // Khobar Water Tower: Glowing Persian Gulf Turquoise Sea-Glass
    const khobarTurquoiseGlassMat = new THREE.MeshStandardMaterial({
      color: 0x148c7c, // Radiant turquoise sea-glass
      roughness: 0.10,
      metalness: 0.82,
      emissive: 0x095248,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.94
    });

    // Khobar Water Tower: Illuminated Top Beacon Lantern
    const khobarLanternMat = new THREE.MeshStandardMaterial({
      color: 0x2ae2c6,
      metalness: 0.50,
      roughness: 0.15,
      emissive: 0x106b5d,
      emissiveIntensity: 0.55
    });

    // Ithra: Dark Ribbon Window Inlay
    const ithraDarkRibbonMat = new THREE.MeshStandardMaterial({
      color: 0x161c22, // Deep charcoal obsidian ribbon
      roughness: 0.25,
      metalness: 0.88
    });

    // Ithra: Violet/Purple Ambient Glow Accent at Tower Base
    const ithraPurpleGlowMat = new THREE.MeshStandardMaterial({
      color: 0x7b2cbf,
      emissive: 0x5a189a,
      emissiveIntensity: 0.85,
      roughness: 0.20,
      metalness: 0.30
    });

    // Ithra: Faceted Geodesic Pavilion Material
    const ithraFacetedMat = new THREE.MeshStandardMaterial({
      color: 0xb0c2d4,
      metalness: 0.75,
      roughness: 0.30,
      flatShading: true
    });

    // Landscaped Greenery Turf
    const ithraGreenTurfMat = new THREE.MeshStandardMaterial({
      color: 0x2e6b34,
      roughness: 0.90,
      metalness: 0.02
    });

    // Warm Golden Interior Canopy Light
    const warmCanopyGlowMat = new THREE.MeshStandardMaterial({
      color: 0xffe29a,
      emissive: 0xd49818,
      emissiveIntensity: 0.70,
      roughness: 0.30
    });

    // Pure 24-Carat Gold Accent (The Globe, Golden Crescent, Spire Finials)
    const pureGoldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.65,
      roughness: 0.22,
      emissive: 0xa87e12,
      emissiveIntensity: 0.30
    });

    // =========================================================================
    // 1. ITHRA - CULTURAL CENTER (مركز الملك عبد العزيز للثقافة العالمية - إثراء بالظهران)
    // Left Wing at x = -23.0
    // =========================================================================
    const ithra = new THREE.Group();
    const ithraWorldX = -23.0, ithraWorldZ = -58.0;
    const ithraGroundY = this.getTerrainHeight(ithraWorldX, ithraWorldZ) - (-2.4);
    ithra.position.set(-23.0, ithraGroundY + 1.4, 0.0);

    // Deep underground foundation plinth
    const ithraFoundation = new THREE.Mesh(
      new THREE.BoxGeometry(32.0, 8.0, 22.0),
      new THREE.MeshStandardMaterial({ color: 0x242220, roughness: 0.95 })
    );
    ithraFoundation.position.y = -4.0;
    ithra.add(ithraFoundation);

    // Modern Architectural Stepped Granite Plaza Terrace
    const ithraPlaza1 = new THREE.Mesh(new THREE.BoxGeometry(30.0, 1.6, 20.0), ithraGraniteMat);
    ithraPlaza1.position.y = 0.8;
    ithraPlaza1.receiveShadow = true;
    const ithraPlaza2 = new THREE.Mesh(new THREE.BoxGeometry(27.0, 1.0, 17.0), ithraGraniteMat);
    ithraPlaza2.position.y = 1.8;
    ithraPlaza2.receiveShadow = true;
    ithra.add(ithraPlaza1, ithraPlaza2);

    // Sinuous Landscaped Green Turf Ribbons
    const turf1 = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.8, 0.25, 32, 1, false, 0, Math.PI * 0.95), ithraGreenTurfMat);
    turf1.position.set(4.5, 2.4, 4.2);
    turf1.rotation.y = 0.35;
    const turf2 = new THREE.Mesh(new THREE.CylinderGeometry(6.0, 6.5, 0.25, 32, 1, false, Math.PI * 0.4, Math.PI * 0.9), ithraGreenTurfMat);
    turf2.position.set(-5.5, 2.4, 3.8);
    turf2.rotation.y = -0.25;
    ithra.add(turf1, turf2);

    // Sweeping Curved Earth-Sheltered Canopy
    const entranceWall = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 9.0, 1.6, 32, 1, false, 0.1, 1.2), ithraSteelMat);
    entranceWall.position.set(3.8, 2.2, 5.5);
    entranceWall.rotation.y = Math.PI * 0.75;
    ithra.add(entranceWall);

    // Warm-Lit Arched Entrance Portals inside Canopy
    for (let ap = 0; ap < 3; ap++) {
      const archPortal = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 0.4), warmCanopyGlowMat);
      archPortal.position.set(1.5 + ap * 2.2, 2.4, 6.2);
      archPortal.rotation.y = 0.28;
      ithra.add(archPortal);
    }

    // A. THE KNOWLEDGE TOWER
    const towerH = 15.8;
    const ithraTower = new THREE.Mesh(
      new THREE.CylinderGeometry(2.5, 3.3, towerH, 32),
      ithraSteelMat
    );
    ithraTower.position.set(0, 2.3 + towerH / 2, 0);
    ithraTower.rotation.z = 0.035;
    ithraTower.rotation.x = -0.02;
    ithraTower.scale.set(1.24, 1.0, 0.90);
    ithraTower.castShadow = true;
    ithra.add(ithraTower);

    // Beveled Slanted Roof Crown
    const ithraCrown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 2.5, 1.7, 32),
      ithraSteelMat
    );
    ithraCrown.position.set(0.35, 2.3 + towerH + 0.48, -0.25);
    ithraCrown.rotation.z = -0.22;
    ithraCrown.rotation.x = -0.035;
    ithraCrown.scale.set(1.22, 0.90, 0.88);
    ithra.add(ithraCrown);

    // Signature dark ribbon bands
    const vertRibbon = new THREE.Mesh(new THREE.BoxGeometry(0.55, towerH * 0.92, 3.4), ithraDarkRibbonMat);
    vertRibbon.position.set(0.1, 2.3 + towerH / 2, 0.15);
    vertRibbon.rotation.z = 0.06;
    vertRibbon.rotation.y = 0.12;
    ithra.add(vertRibbon);

    const diagRibbon = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.65, 3.2), ithraDarkRibbonMat);
    diagRibbon.position.set(0.2, 2.3 + towerH * 0.72, 0.1);
    diagRibbon.rotation.z = -0.28;
    ithra.add(diagRibbon);

    const midRibbon = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.58, 3.2), ithraDarkRibbonMat);
    midRibbon.position.set(0.0, 2.3 + towerH * 0.42, 0.1);
    midRibbon.rotation.z = 0.14;
    ithra.add(midRibbon);

    // Purple illuminated notch glow
    const purpleGlowBox = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 0.6), ithraPurpleGlowMat);
    purpleGlowBox.position.set(0.8, 3.6, 1.5);
    purpleGlowBox.rotation.y = 0.25;
    ithra.add(purpleGlowBox);

    // 4 Distinct Pebble Formations at Ithra Base
    const p1Geo = new THREE.SphereGeometry(4.8, 32, 20);
    const p1Mesh = new THREE.Mesh(p1Geo, ithraSteelMat);
    p1Mesh.position.set(-7.5, 3.8, 0.8);
    p1Mesh.scale.set(1.95, 0.72, 1.05);
    p1Mesh.rotation.y = 0.22;
    p1Mesh.rotation.z = -0.06;
    p1Mesh.castShadow = true;
    p1Mesh.receiveShadow = true;
    ithra.add(p1Mesh);

    const p2Geo = new THREE.SphereGeometry(3.6, 32, 20);
    const p2Mesh = new THREE.Mesh(p2Geo, ithraSteelMat);
    p2Mesh.position.set(6.2, 3.5, 1.2);
    p2Mesh.scale.set(1.35, 0.85, 0.95);
    p2Mesh.rotation.y = -0.32;
    p2Mesh.rotation.z = 0.08;
    p2Mesh.castShadow = true;
    p2Mesh.receiveShadow = true;
    ithra.add(p2Mesh);

    const p3Geo = new THREE.DodecahedronGeometry(3.8, 1);
    const p3Mesh = new THREE.Mesh(p3Geo, ithraFacetedMat);
    p3Mesh.position.set(3.2, 3.0, 4.5);
    p3Mesh.scale.set(1.10, 0.75, 0.90);
    p3Mesh.rotation.y = 0.45;
    p3Mesh.castShadow = true;
    ithra.add(p3Mesh);

    const p4Geo = new THREE.SphereGeometry(3.2, 28, 18);
    const p4Mesh = new THREE.Mesh(p4Geo, ithraSteelMat);
    p4Mesh.position.set(-3.2, 3.2, -3.8);
    p4Mesh.scale.set(1.40, 0.70, 0.95);
    p4Mesh.rotation.y = 0.15;
    ithra.add(p4Mesh);

    // 6 Distinct Stainless Steel Cladding Wrap Rings
    for (let r = 0; r < 6; r++) {
      const ringY = 4.2 + r * 2.1;
      const ringRadius = 2.8 - r * 0.08;
      const ringMesh = new THREE.Mesh(
        new THREE.TorusGeometry(ringRadius, 0.045, 8, 36),
        ithraRingMat
      );
      ringMesh.position.set(0, ringY, 0);
      ringMesh.rotation.x = Math.PI / 2 + 0.05;
      ringMesh.rotation.y = (r % 2 === 0 ? 0.08 : -0.06);
      ithra.add(ringMesh);
    }

    skyline.add(ithra);

    // =========================================================================
    // 2. KHOBAR WATER TOWER (برج مياه الخبر - معلم المنطقة الشرقية الأيقوني)
    // Left Wing at x = -15.0
    // =========================================================================
    const khobar = new THREE.Group();
    const khobarWorldX = -15.0, khobarWorldZ = -58.0;
    const khobarGroundY = this.getTerrainHeight(khobarWorldX, khobarWorldZ) - (-2.4);
    khobar.position.set(-15.0, khobarGroundY, 0.0);

    // Deep underground foundation plinth
    const khobarFoundation = new THREE.Mesh(
      new THREE.CylinderGeometry(3.2, 3.8, 8.0, 24),
      new THREE.MeshStandardMaterial({ color: 0x242d35, roughness: 0.90 })
    );
    khobarFoundation.position.y = -4.0;
    khobar.add(khobarFoundation);

    // Podium Base Terrace
    const kPodium = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 5.4, 1.4, 32), khobarConcreteMat);
    kPodium.position.y = 0.7;
    kPodium.receiveShadow = true;
    khobar.add(kPodium);

    // Flared Hyperbolic Concrete Stem Base
    const stemGeo = new THREE.CylinderGeometry(1.65, 3.4, 16.2, 32, 16);
    const stemPos = stemGeo.attributes.position;
    for (let i = 0; i < stemPos.count; i++) {
      const sy = stemPos.getY(i);
      const st = (sy + 8.1) / 16.2;
      const flare = Math.pow(1 - st, 2.2) * 1.4 + Math.pow(st, 3.5) * 1.85;
      const sx = stemPos.getX(i);
      const sz = stemPos.getZ(i);
      const rad = Math.hypot(sx, sz);
      if (rad > 0.01) {
        stemPos.setX(i, (sx / rad) * (rad + flare));
        stemPos.setZ(i, (sz / rad) * (rad + flare));
      }
    }
    stemGeo.computeVertexNormals();

    const stemMesh = new THREE.Mesh(stemGeo, khobarConcreteMat);
    stemMesh.position.y = 1.4 + 8.1;
    stemMesh.castShadow = true;
    khobar.add(stemMesh);

    // 16 Vertical Concrete Ribs/Fins
    for (let f = 0; f < 16; f++) {
      const fAngle = (f / 16) * Math.PI * 2;
      const finMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 16.2, 0.35), khobarConcreteMat);
      finMesh.position.set(Math.cos(fAngle) * 1.95, 1.4 + 8.1, Math.sin(fAngle) * 1.95);
      finMesh.rotation.y = -fAngle;
      khobar.add(finMesh);
    }

    // 360° Circular Islamic Pointed Arched Observation Gallery
    const deckH = 3.6;
    const deckR = 4.6;
    const deckGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(deckR, deckR * 0.92, deckH, 32),
      khobarTurquoiseGlassMat
    );
    deckGlass.position.y = 17.6 + deckH / 2;
    khobar.add(deckGlass);

    // 16 Arched Lancet Framing Columns
    for (let c = 0; c < 16; c++) {
      const cAng = (c / 16) * Math.PI * 2;
      const colMesh = new THREE.Mesh(new THREE.BoxGeometry(0.20, deckH * 1.05, 0.28), khobarConcreteMat);
      colMesh.position.set(Math.cos(cAng) * (deckR + 0.06), 17.6 + deckH / 2, Math.sin(cAng) * (deckR + 0.06));
      colMesh.rotation.y = -cAng;
      khobar.add(colMesh);
    }

    // Tiered Ribbed Conical Dome
    const kRoofRing = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.85, 0.5, 32), khobarConcreteMat);
    kRoofRing.position.y = 21.45;
    khobar.add(kRoofRing);

    const kDome = new THREE.Mesh(new THREE.ConeGeometry(4.0, 2.8, 32), khobarConcreteMat);
    kDome.position.y = 23.1;
    khobar.add(kDome);

    // Crowning Glowing Beacon Lantern Cupola & Spire
    const kCupola = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 1.2, 24), khobarLanternMat);
    kCupola.position.y = 25.1;
    khobar.add(kCupola);

    const kMiniDome = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), khobarConcreteMat);
    kMiniDome.position.y = 25.7;
    khobar.add(kMiniDome);

    const kSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.15, 4.0, 16), pureGoldMat);
    kSpire.position.y = 27.9;
    const kBeaconOrb = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), pureGoldMat);
    kBeaconOrb.position.y = 29.9;
    khobar.add(kSpire, kBeaconOrb);

    skyline.add(khobar);

    // =========================================================================
    // 3. KINGDOM CENTRE TOWER (برج المملكة - الرياض)
    // Center-Left at x = -7.0
    // =========================================================================
    const kingdom = new THREE.Group();
    const kingdomWorldX = -7.0, kingdomWorldZ = -58.0;
    const kingdomGroundY = this.getTerrainHeight(kingdomWorldX, kingdomWorldZ) - (-2.4);
    kingdom.position.set(-7.0, kingdomGroundY, 0.0);

    const kw = 5.8, kh = 24.5, kd = 2.6;

    const kingdomFoundation = new THREE.Mesh(
      new THREE.BoxGeometry(kw + 1.0, 8.0, kd + 1.0),
      new THREE.MeshStandardMaterial({ color: 0x242d35, roughness: 0.90 })
    );
    kingdomFoundation.position.y = -4.0;
    kingdom.add(kingdomFoundation);

    const archBaseY = 14.2;
    const archTopY = 23.0;
    const archTopHalfW = 2.05;
    const apexFilletR = 0.50;
    const halfW_base = kw / 2;
    const halfW_top = kw * 0.44;
    const cornerR = 0.38;

    const kingdomShape = new THREE.Shape();
    kingdomShape.moveTo(-halfW_base + cornerR, 0);
    kingdomShape.lineTo(halfW_base - cornerR, 0);
    kingdomShape.quadraticCurveTo(halfW_base, 0, halfW_base, cornerR);
    kingdomShape.lineTo(halfW_top, kh - cornerR);
    kingdomShape.quadraticCurveTo(halfW_top, kh, halfW_top - cornerR, kh);
    kingdomShape.lineTo(-halfW_top + cornerR, kh);
    kingdomShape.quadraticCurveTo(-halfW_top, kh, -halfW_top, kh - cornerR);
    kingdomShape.lineTo(-halfW_base, cornerR);
    kingdomShape.quadraticCurveTo(-halfW_base, 0, -halfW_base + cornerR, 0);

    const archHole = new THREE.Path();
    archHole.moveTo(archTopHalfW - 0.2, archTopY);
    archHole.quadraticCurveTo(archTopHalfW, archTopY, archTopHalfW, archTopY - 0.2);
    archHole.bezierCurveTo(
      archTopHalfW * 0.85, (archTopY + archBaseY) * 0.62,
      apexFilletR * 1.8, archBaseY + 1.2,
      apexFilletR, archBaseY + 0.15
    );
    archHole.quadraticCurveTo(0, archBaseY, -apexFilletR, archBaseY + 0.15);
    archHole.bezierCurveTo(
      -apexFilletR * 1.8, archBaseY + 1.2,
      -archTopHalfW * 0.85, (archTopY + archBaseY) * 0.62,
      -archTopHalfW, archTopY - 0.2
    );
    archHole.quadraticCurveTo(-archTopHalfW, archTopY, -archTopHalfW + 0.2, archTopY);
    archHole.lineTo(archTopHalfW - 0.2, archTopY);
    kingdomShape.holes.push(archHole);

    const extrudeSettings = {
      depth: kd,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
      curveSegments: 36
    };

    const kingdomGeo = new THREE.ExtrudeGeometry(kingdomShape, extrudeSettings);
    kingdomGeo.translate(0, 0, -kd / 2);

    const kingdomMesh = new THREE.Mesh(kingdomGeo, kingdomGlassMat);
    kingdomMesh.castShadow = true;
    kingdomMesh.receiveShadow = true;
    kingdom.add(kingdomMesh);

    // 18 Horizontal White Architectural Floor Spandrel Lines
    for (let f = 1; f <= 18; f++) {
      const ringY = f * 1.05;
      if (ringY < archBaseY) {
        const fRing = new THREE.Mesh(new THREE.BoxGeometry(kw * 0.94, 0.06, kd * 1.02), whiteTrussMat);
        fRing.position.y = ringY;
        kingdom.add(fRing);
      } else if (ringY < archTopY) {
        const t = (ringY - archBaseY) / (archTopY - archBaseY);
        const innerX = apexFilletR + t * (archTopHalfW - apexFilletR);
        const wingW = halfW_top - innerX;
        if (wingW > 0.3) {
          const wingLX = -(innerX + wingW / 2);
          const wingRX = innerX + wingW / 2;
          const fRingL = new THREE.Mesh(new THREE.BoxGeometry(wingW, 0.06, kd * 1.02), whiteTrussMat);
          fRingL.position.set(wingLX, ringY, 0);
          const fRingR = new THREE.Mesh(new THREE.BoxGeometry(wingW, 0.06, kd * 1.02), whiteTrussMat);
          fRingR.position.set(wingRX, ringY, 0);
          kingdom.add(fRingL, fRingR);
        }
      }
    }

    // Golden Skybridge
    const skybridgeH = kh - archTopY + 0.15;
    const skybridge = new THREE.Mesh(
      new THREE.BoxGeometry(halfW_top * 2.05, skybridgeH, kd + 0.18),
      goldenSkyMat
    );
    skybridge.position.set(0, (archTopY + kh) / 2, 0);
    kingdom.add(skybridge);

    skyline.add(kingdom);

    // =========================================================================
    // 4. MAKKAH ROYAL CLOCK TOWER (ساعة مكة المكرمة - أبراج البيت)
    // Center Horizon at x = 0.0 (Tallest supreme monument)
    // =========================================================================
    const makkahTower = new THREE.Group();
    const makkahWorldX = 0.0, makkahWorldZ = -60.0;
    const makkahGroundY = this.getTerrainHeight(makkahWorldX, makkahWorldZ) - (-2.4);
    makkahTower.position.set(0.0, makkahGroundY, 0.0);

    const mw = 6.3, mh = 28.0;

    const makkahFoundation = new THREE.Mesh(
      new THREE.BoxGeometry(mw + 1.4, 8.0, mw + 1.4),
      makkahStoneMat
    );
    makkahFoundation.position.y = -4.0;
    makkahTower.add(makkahFoundation);

    const mShaft = new THREE.Mesh(new THREE.BoxGeometry(mw, 15.5, mw), makkahStoneMat);
    mShaft.position.y = 7.75;
    mShaft.castShadow = true;
    makkahTower.add(mShaft);

    // Vertical Fluted Pilasters & Recessed Arched Windows
    for (let p = 0; p < 4; p++) {
      const pAngle = (p * Math.PI) / 2;
      const pFace = new THREE.Mesh(new THREE.BoxGeometry(mw * 0.86, 14.5, 0.20), makkahWindowMat);
      pFace.position.set(0, 7.75, mw / 2 + 0.10);
      const pWrap = new THREE.Group();
      pWrap.rotation.y = pAngle;
      pWrap.add(pFace);
      makkahTower.add(pWrap);
    }

    // 4-Sided Clock Enclosure Cube
    const clockCubeH = 5.2;
    const clockCube = new THREE.Mesh(new THREE.BoxGeometry(mw + 0.6, clockCubeH, mw + 0.6), makkahStoneMat);
    clockCube.position.y = 15.5 + clockCubeH / 2;
    makkahTower.add(clockCube);

    // 4 Illuminated Emerald Clock Faces
    const clockDialMat = new THREE.MeshStandardMaterial({
      color: 0x006c35,
      emissive: 0x004d24,
      emissiveIntensity: 0.85,
      roughness: 0.28,
      metalness: 0.20
    });
    const clockHandsMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfffaea,
      emissiveIntensity: 0.95
    });
    const clockRimMat = pureGoldMat;

    for (let c = 0; c < 4; c++) {
      const cAngle = (c * Math.PI) / 2;
      const dialFace = new THREE.Group();
      dialFace.position.set(0, 15.5 + clockCubeH / 2, (mw + 0.6) / 2 + 0.06);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.11, 12, 32), clockRimMat);
      dialFace.add(rim);

      const dial = new THREE.Mesh(new THREE.CircleGeometry(1.80, 32), clockDialMat);
      dialFace.add(dial);

      const tickMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      for (let tk = 0; tk < 12; tk++) {
        const tAng = (tk / 12) * Math.PI * 2;
        const tick = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.02), tickMat);
        tick.position.set(Math.sin(tAng) * 1.55, Math.cos(tAng) * 1.55, 0.02);
        tick.rotation.z = -tAng;
        dialFace.add(tick);
      }

      const hHand = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.85, 0.04), clockHandsMat);
      hHand.position.set(0.15, 0.35, 0.04);
      hHand.rotation.z = -0.42;
      const mHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.25, 0.04), clockHandsMat);
      mHand.position.set(-0.25, 0.52, 0.05);
      mHand.rotation.z = 0.52;
      dialFace.add(hHand, mHand);

      const wrapDial = new THREE.Group();
      wrapDial.rotation.y = cAngle;
      wrapDial.add(dialFace);
      makkahTower.add(wrapDial);
    }

    // Authentic Multi-Tiered Islamic Clock Spire & Golden Crescent
    const spireBaseH = 20.7;
    const sP1 = new THREE.Mesh(new THREE.BoxGeometry(mw - 0.2, 1.2, mw - 0.2), makkahStoneMat);
    sP1.position.y = spireBaseH + 0.6;
    const sP2 = new THREE.Mesh(new THREE.BoxGeometry(mw - 1.2, 1.2, mw - 1.2), makkahStoneMat);
    sP2.position.y = spireBaseH + 1.8;
    makkahTower.add(sP1, sP2);

    const octBase = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.3, 2.4, 8), makkahSpireMat);
    octBase.position.y = spireBaseH + 3.6;
    makkahTower.add(octBase);

    const lanternMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.7, 3.2, 8), makkahSpireMat);
    lanternMesh.position.y = spireBaseH + 6.4;
    makkahTower.add(lanternMesh);

    const upCone = new THREE.Mesh(new THREE.ConeGeometry(1.35, 6.2, 8), makkahSpireMat);
    upCone.position.y = spireBaseH + 11.1;
    makkahTower.add(upCone);

    // Supreme Golden Crescent (Hilal)
    const hilalGroup = new THREE.Group();
    hilalGroup.position.y = spireBaseH + 14.8;

    const hilalRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.10, 0.22, 16, 32, Math.PI * 1.55),
      pureGoldMat
    );
    hilalRing.rotation.z = Math.PI * 0.22;
    const hStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), pureGoldMat);
    hStar.position.set(0.25, 0.45, 0);
    hilalGroup.add(hilalRing, hStar);
    makkahTower.add(hilalGroup);

    skyline.add(makkahTower);

    // =========================================================================
    // 5. AL FAISALIAH TOWER (برج الفيصلية - الرياض)
    // Center-Right at x = +6.5
    // =========================================================================
    const faisaliah = new THREE.Group();
    const faisaliahWorldX = 6.5, faisaliahWorldZ = -58.0;
    const faisaliahGroundY = this.getTerrainHeight(faisaliahWorldX, faisaliahWorldZ) - (-2.4);
    faisaliah.position.set(6.5, faisaliahGroundY, 0.0);

    const fh = 20.5;
    const fBaseW = 4.9;

    const faisaliahFoundation = new THREE.Mesh(
      new THREE.BoxGeometry(fBaseW + 1.2, 8.0, fBaseW + 1.2),
      new THREE.MeshStandardMaterial({ color: 0x242d35, roughness: 0.90 })
    );
    faisaliahFoundation.position.y = -4.0;
    faisaliah.add(faisaliahFoundation);

    const fCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, fBaseW * 0.70, fh - 4.2, 4),
      faisaliahCoreMat
    );
    fCore.rotation.y = Math.PI / 4;
    fCore.position.y = (fh - 4.2) / 2;
    fCore.castShadow = true;
    faisaliah.add(fCore);

    // Diagonal Chevron Cross-Bracing Steel Trusses
    const trussCount = 8;
    for (let tr = 0; tr < trussCount; tr++) {
      const trT = tr / trussCount;
      const trY = trT * (fh - 5.2) + 1.0;
      const trW = (1 - trT * 0.82) * fBaseW;

      const ring = new THREE.Mesh(new THREE.BoxGeometry(trW, 0.14, trW), whiteTrussMat);
      ring.position.y = trY;
      faisaliah.add(ring);

      if (tr < trussCount - 1) {
        const nextY = ((tr + 1) / trussCount) * (fh - 5.2) + 1.0;
        const dH = nextY - trY;
        const diagL = new THREE.Mesh(new THREE.BoxGeometry(0.08, dH * 1.35, 0.08), whiteTrussMat);
        diagL.position.set(0, trY + dH / 2, trW / 2);
        diagL.rotation.z = 0.65;
        const diagR = new THREE.Mesh(new THREE.BoxGeometry(0.08, dH * 1.35, 0.08), whiteTrussMat);
        diagR.position.set(0, trY + dH / 2, trW / 2);
        diagR.rotation.z = -0.65;
        faisaliah.add(diagL, diagR);
      }
    }

    // Golden Geodesic Faceted Sphere ("The Globe")
    const globeSphere = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.35, 3),
      pureGoldMat
    );
    globeSphere.position.y = fh - 4.4;
    faisaliah.add(globeSphere);

    for (let a = 0; a < 4; a++) {
      const archAngle = (a * Math.PI) / 2 + Math.PI / 4;
      const archPost = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.14, 3.6, 8), whiteTrussMat);
      archPost.position.set(Math.cos(archAngle) * 1.05, fh - 4.4, Math.sin(archAngle) * 1.05);
      archPost.rotation.z = (Math.cos(archAngle) > 0 ? 1 : -1) * 0.18;
      faisaliah.add(archPost);
    }

    const fSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.14, 4.2, 12), ithraRingMat);
    fSpire.position.y = fh - 1.8;
    faisaliah.add(fSpire);

    skyline.add(faisaliah);

    this.group.add(skyline);
  }

  /**
   * Dedicated Sacred Mosques Zone (منطقة الحرمين الشريفين - قلب الوطن النابض):
   * 1. The Holy Kaaba & Al-Haram Al-Makki (الكعبة المشرفة وصحن المطاف والأروقة والمآذن)
   * 2. The Prophet's Mosque in Madinah (المسجد النبوي الشريف والقبة الخضراء والمظلات والمآذن)
   * Both positioned with grand, dignified scale at z = -22.0 in the open central panorama.
   */
  initSacredMosques() {
    const sacredGroup = new THREE.Group();
    sacredGroup.position.set(0, -2.4, 0);

    const makkahStoneMat = new THREE.MeshStandardMaterial({
      color: 0xded5c4,
      roughness: 0.70,
      metalness: 0.05
    });

    const pureGoldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.85,
      roughness: 0.16,
      emissive: 0xc89612,
      emissiveIntensity: 0.45
    });

    // 1. THE HOLY KAABA & MAKKAH GRAND MOSQUE (الكعبة المشرفة والحرم المكي الشريف)
    const kaabaHaram = this.createHolyKaabaAndHaram(makkahStoneMat, pureGoldMat);
    const kaabaX = -3.2, kaabaZ = -22.0;
    const kaabaGroundY = this.getTerrainHeight(kaabaX, kaabaZ) - (-2.4);
    kaabaHaram.position.set(kaabaX, kaabaGroundY, kaabaZ);
    sacredGroup.add(kaabaHaram);

    // 2. THE PROPHET'S MOSQUE IN MADINAH (المسجد النبوي الشريف بالمدينة المنورة)
    const madinahHaram = this.createProphetsMosqueMadinah(makkahStoneMat, pureGoldMat);
    const madinahX = 3.4, madinahZ = -22.0;
    const madinahGroundY = this.getTerrainHeight(madinahX, madinahZ) - (-2.4);
    madinahHaram.position.set(madinahX, madinahGroundY, madinahZ);
    sacredGroup.add(madinahHaram);

    this.group.add(sacredGroup);
  }

  /**
   * Dedicated AlUla Historic & Modern Monuments Zone (معالم العلا التراثية والعالمية):
   * 1. Maraya Concert Hall (قاعة مرايا بالعلا - مرآة حقيقية عاكسة للسماء والصحراء 100%)
   * 2. Hegra / Qasr Al-Farid (قصر الفريد في مدائن صالح / الحجر - منحوتة الصخر النبطية)
   * Positioned with ample breathing room at z = -32.0.
   */
  initAlUlaMonuments() {
    const alUlaGroup = new THREE.Group();
    alUlaGroup.position.set(0, -2.4, 0);

    const warmCanopyGlowMat = new THREE.MeshStandardMaterial({
      color: 0xffe29a,
      emissive: 0xd49818,
      emissiveIntensity: 0.70,
      roughness: 0.30
    });

    const rockTex = this.generateTuwaiqRockTexture();

    // 1. MARAYA CONCERT HALL (قاعة مرايا في العلا - مرايا فعلية عاكسة)
    const marayaHall = this.createMarayaAlUla(warmCanopyGlowMat);
    const marayaX = -9.2, marayaZ = -32.0;
    const marayaGroundY = this.getTerrainHeight(marayaX, marayaZ) - (-2.4);
    marayaHall.position.set(marayaX, marayaGroundY, marayaZ);
    alUlaGroup.add(marayaHall);

    // 2. HEGRA / QASR AL-FARID (قصر الفريد في مدائن صالح / الحجر)
    const hegraTomb = this.createQasrAlFaridHegra(rockTex);
    const hegraX = 9.8, hegraZ = -32.0;
    const hegraGroundY = this.getTerrainHeight(hegraX, hegraZ) - (-2.4);
    hegraTomb.position.set(hegraX, hegraGroundY, hegraZ);
    alUlaGroup.add(hegraTomb);

    this.group.add(alUlaGroup);
  }

  /**
   * Dynamic Real Mirror Environment Map for Maraya Hall:
   * Captures the crystal blue morning sky, glowing golden sun corona,
   * Mount Tuwaiq sandstone canyon cliffs, and undulating golden sand dunes.
   */
  generateMarayaMirrorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 1. Azure morning sky with radiant dawn gradient (y: 0 -> 256)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 256);
    skyGrad.addColorStop(0, '#153b61');
    skyGrad.addColorStop(0.3, '#2e6b98');
    skyGrad.addColorStop(0.6, '#6ba8d0');
    skyGrad.addColorStop(0.85, '#ffdbaf');
    skyGrad.addColorStop(1, '#f2a855');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 1024, 256);

    // 2. Radiant Sun Disc in Sky with Golden Light Halo
    const sunGrad = ctx.createRadialGradient(720, 80, 8, 720, 80, 180);
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    sunGrad.addColorStop(0.25, 'rgba(255, 245, 200, 0.85)');
    sunGrad.addColorStop(0.55, 'rgba(255, 200, 110, 0.45)');
    sunGrad.addColorStop(1, 'rgba(255, 150, 50, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(720, 80, 180, 0, Math.PI * 2);
    ctx.fill();

    // 3. High-Detail Jagged Sandstone Canyons & Tuwaiq Plateau Escarpments on Horizon
    ctx.fillStyle = '#b87538';
    ctx.beginPath();
    ctx.moveTo(0, 256);
    for (let x = 0; x <= 1024; x += 16) {
      const cliffH = 205 + Math.sin(x * 0.02) * 22 + Math.sin(x * 0.055) * 14 + Math.cos(x * 0.11) * 8;
      ctx.lineTo(x, cliffH);
    }
    ctx.lineTo(1024, 256);
    ctx.closePath();
    ctx.fill();

    // Darker rock strata band
    ctx.fillStyle = '#8a4c1c';
    ctx.beginPath();
    ctx.moveTo(0, 256);
    for (let x = 0; x <= 1024; x += 24) {
      const cliffH = 228 + Math.sin(x * 0.03) * 15 + Math.cos(x * 0.075) * 9;
      ctx.lineTo(x, cliffH);
    }
    ctx.lineTo(1024, 256);
    ctx.closePath();
    ctx.fill();

    // 4. Undulating golden Arabian desert sand dunes & wind ripples (y: 256 -> 512)
    const sandGrad = ctx.createLinearGradient(0, 256, 0, 512);
    sandGrad.addColorStop(0, '#e59d4c');
    sandGrad.addColorStop(0.35, '#d88732');
    sandGrad.addColorStop(0.75, '#be6a1e');
    sandGrad.addColorStop(1, '#944810');
    ctx.fillStyle = sandGrad;
    ctx.fillRect(0, 256, 1024, 256);

    for (let y = 260; y < 512; y += 6) {
      ctx.fillStyle = 'rgba(255, 238, 190, 0.22)';
      ctx.fillRect(0, y, 1024, 2.0);
      ctx.fillStyle = 'rgba(95, 42, 10, 0.15)';
      ctx.fillRect(0, y + 2.0, 1024, 1.8);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  /**
   * 1. AL-HARAM AL-MAKKI & THE HOLY KAABA (الحرم المكي الشريف والكعبة المشرفة)
   * - Grand, prominent Kaaba draped in pure black Kiswah with 24k gold embroidered Hizam belt
   * - Golden Bab Al-Kaaba door, Mizab Ar-Rahmah spout, Maqam Ibrahim kiosk, and Shadharwan marble base
   * - Polished circular Thassos white marble Mataf plaza with concentric rings
   * - Grand Mosque multi-tier colonnades with repeating Islamic arches and white domes
   * - Twin stately Makkah minarets (h = 19.5m) with green LED accents and golden crescent finials
   */
  createHolyKaabaAndHaram(makkahStoneMat, pureGoldMat) {
    const haram = new THREE.Group();

    // Sacred Materials
    const kiswahMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.88,
      metalness: 0.05
    });

    const kiswahGoldBeltMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.88,
      roughness: 0.16,
      emissive: 0xc89612,
      emissiveIntensity: 0.55
    });

    const matafMarbleMat = new THREE.MeshStandardMaterial({
      color: 0xfbf9f5,
      roughness: 0.14,
      metalness: 0.08
    });

    const whiteHaramMat = new THREE.MeshStandardMaterial({
      color: 0xf5efe6,
      roughness: 0.60,
      metalness: 0.04
    });

    const greenLedMat = new THREE.MeshStandardMaterial({
      color: 0x00ff66,
      emissive: 0x00cc44,
      emissiveIntensity: 0.95
    });

    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xe0e6ed,
      metalness: 0.92,
      roughness: 0.18
    });

    // 1. Al-Mataf (صحن المطاف الرخامي الأبيض الدائري الفسيح)
    const mataf = new THREE.Mesh(new THREE.CylinderGeometry(8.8, 9.5, 0.50, 48), matafMarbleMat);
    mataf.position.y = 0.25;
    mataf.receiveShadow = true;
    haram.add(mataf);

    // Concentric Marble Rings of Mataf
    for (let r = 1; r <= 4; r++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 2.0, 0.04, 8, 48), whiteHaramMat);
      ring.position.y = 0.52;
      ring.rotation.x = Math.PI / 2;
      haram.add(ring);
    }

    // 2. THE HOLY KAABA (الكعبة المشرفة - بيت الله الحرام الشامخ)
    const kaabaGroup = new THREE.Group();
    kaabaGroup.position.set(0, 0.50, 0);

    // Marble Shadharwan Base with Gold Rope Pegs
    const shadharwan = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.30, 4.4), matafMarbleMat);
    shadharwan.position.y = 0.15;
    kaabaGroup.add(shadharwan);

    // Main Black Kiswah Cube (w: 4.0m, h: 4.8m, d: 4.0m)
    const kaabaBody = new THREE.Mesh(new THREE.BoxGeometry(4.0, 4.8, 4.0), kiswahMat);
    kaabaBody.position.y = 2.55;
    kaabaBody.castShadow = true;
    kaabaGroup.add(kaabaBody);

    // Hizam Al-Kiswah (حزام الكسوة الذهبي المطرز بآيات القرآن الكريم)
    const hizamBelt = new THREE.Mesh(new THREE.BoxGeometry(4.08, 0.60, 4.08), kiswahGoldBeltMat);
    hizamBelt.position.y = 3.90;
    kaabaGroup.add(hizamBelt);

    // Secondary lower gold embroidery band
    const lowerBelt = new THREE.Mesh(new THREE.BoxGeometry(4.06, 0.22, 4.06), kiswahGoldBeltMat);
    lowerBelt.position.y = 2.60;
    kaabaGroup.add(lowerBelt);

    // Bab Al-Kaaba (باب الكعبة المشرفة من الذهب الخالص)
    const babKaaba = new THREE.Mesh(new THREE.BoxGeometry(1.15, 2.2, 0.14), kiswahGoldBeltMat);
    babKaaba.position.set(0.55, 2.30, 2.04);
    kaabaGroup.add(babKaaba);

    // Mizab Ar-Rahmah (ميزاب الرحمة الذهبي في أعلى الكعبة)
    const mizab = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.16, 0.65), pureGoldMat);
    mizab.position.set(-0.55, 4.90, 1.95);
    kaabaGroup.add(mizab);

    // Al-Hajar Al-Aswad (الحجر الأسود بإطاره الفضي النقي في الركن)
    const hajarAswad = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), silverMat);
    hajarAswad.position.set(2.02, 1.20, 2.02);
    hajarAswad.scale.set(1.0, 1.4, 1.0);
    kaabaGroup.add(hajarAswad);

    haram.add(kaabaGroup);

    // 3. Maqam Ibrahim (مقام سيدنا إبراهيم عليه السلام)
    const maqamKiosk = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 1.4, 8), pureGoldMat);
    maqamKiosk.position.set(0.0, 1.20, 3.8);
    const maqamDome = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), pureGoldMat);
    maqamDome.position.set(0.0, 1.90, 3.8);
    haram.add(maqamKiosk, maqamDome);

    // 4. Grand Mosque Colonnade Arcade (أروقة الحرم المكي الشريف ذات العقود الإسلامية)
    const arcadeGeo = new THREE.CylinderGeometry(10.5, 11.2, 2.4, 32, 1, true, -Math.PI * 0.75, Math.PI * 1.5);
    const arcade = new THREE.Mesh(arcadeGeo, whiteHaramMat);
    arcade.position.y = 1.2;
    haram.add(arcade);

    // 6 White Domes on Colonnade Roof
    for (let d = 0; d < 6; d++) {
      const dAng = -Math.PI * 0.65 + d * (Math.PI / 3.8);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.95, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2), whiteHaramMat);
      dome.position.set(Math.cos(dAng) * 10.8, 2.4, Math.sin(dAng) * 10.8);
      haram.add(dome);
    }

    // 5. Twin Grand Makkah Minarets (مآذن الحرم المكي الشريف الشامخة: h = 19.5m)
    [-8.2, 8.2].forEach(minX => {
      const minaret = new THREE.Group();
      minaret.position.set(minX, 0, -4.5);

      // Square Base Plinth
      const bPlinth = new THREE.Mesh(new THREE.BoxGeometry(2.2, 4.5, 2.2), whiteHaramMat);
      bPlinth.position.y = 2.25;
      minaret.add(bPlinth);

      // Octagonal Main Shaft
      const octShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 1.05, 8.5, 8), whiteHaramMat);
      octShaft.position.y = 4.5 + 4.25;
      minaret.add(octShaft);

      // Mid Balcony Gallery
      const midBalcony = new THREE.Mesh(new THREE.CylinderGeometry(1.20, 0.90, 0.65, 12), whiteHaramMat);
      midBalcony.position.y = 13.5;
      minaret.add(midBalcony);

      // Green LED Balustrade Accent (إضاءة المئذنة الخضراء الأيقونية)
      const greenRing = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.065, 8, 24), greenLedMat);
      greenRing.position.y = 13.85;
      greenRing.rotation.x = Math.PI / 2;
      minaret.add(greenRing);

      // Upper Circular Lantern
      const upLantern = new THREE.Mesh(new THREE.CylinderGeometry(0.60, 0.70, 3.2, 8), whiteHaramMat);
      upLantern.position.y = 15.4;
      minaret.add(upLantern);

      // Conical Spire & Golden Crescent
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.62, 2.6, 8), whiteHaramMat);
      spire.position.y = 18.2;
      const mCrescent = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), pureGoldMat);
      mCrescent.position.y = 19.6;
      minaret.add(spire, mCrescent);

      haram.add(minaret);
    });

    return haram;
  }

  /**
   * 2. AL-MASJID AN-NABAWI - MADINAH (المسجد النبوي الشريف - المدينة المنورة)
   * - The Holy Green Dome (القبة الخضراء المشرفة) on octagonal limestone drum base
   * - Tall, elegant white marble Madinah minarets (h = 21.0m) with conical spires & golden crescents
   * - Iconic convertible giant umbrellas (مظلات المسجد النبوي الشريف) with folded lotus canopies
   * - Surrounding silver-white domes & Thassos marble courtyard
   */
  createProphetsMosqueMadinah(makkahStoneMat, pureGoldMat) {
    const madinah = new THREE.Group();

    // Sacred Madinah Materials
    const greenDomeMat = new THREE.MeshStandardMaterial({
      color: 0x00693e, // Authentic Prophet's Green
      roughness: 0.20,
      metalness: 0.35,
      emissive: 0x004225,
      emissiveIntensity: 0.45
    });

    const whiteMarbleMat = new THREE.MeshStandardMaterial({
      color: 0xfcfbfa,
      roughness: 0.28,
      metalness: 0.05
    });

    const umbrellaFabricMat = new THREE.MeshStandardMaterial({
      color: 0xf8f8f8,
      roughness: 0.70,
      metalness: 0.02
    });

    const umbrellaGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.18
    });

    // 1. Paved Courtyard Platform
    const courtyard = new THREE.Mesh(new THREE.BoxGeometry(19.0, 0.50, 14.0), whiteMarbleMat);
    courtyard.position.y = 0.25;
    courtyard.receiveShadow = true;
    madinah.add(courtyard);

    // 2. THE PROPHET'S GREEN DOME (القبة الخضراء المشرفة)
    const greenDomeGroup = new THREE.Group();
    greenDomeGroup.position.set(0, 0.50, 0);

    // Octagonal Drum Base with Arched Windows
    const drumBase = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.1, 2.2, 8), whiteMarbleMat);
    drumBase.position.y = 1.1;
    greenDomeGroup.add(drumBase);

    // The Iconic Emerald Green Dome (Prominent and majestic)
    const greenDome = new THREE.Mesh(
      new THREE.SphereGeometry(3.2, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2),
      greenDomeMat
    );
    greenDome.position.y = 2.2;
    greenDome.castShadow = true;
    greenDomeGroup.add(greenDome);

    // Golden Spire Finial atop Green Dome
    const domeSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.16, 2.2, 12), pureGoldMat);
    domeSpire.position.y = 5.6;
    const domeCrescent = new THREE.Mesh(new THREE.SphereGeometry(0.30, 16, 16), pureGoldMat);
    domeCrescent.position.y = 6.8;
    greenDomeGroup.add(domeSpire, domeCrescent);

    // 3 Accompanying Silver-White Domes
    const whiteDomeSites = [
      { x: -4.2, z: 0.5, r: 1.6 },
      { x: -4.2, z: -3.2, r: 1.4 },
      { x: 0.3, z: -4.0, r: 1.5 }
    ];
    whiteDomeSites.forEach(wd => {
      const wBase = new THREE.Mesh(new THREE.CylinderGeometry(wd.r * 1.05, wd.r * 1.1, 1.0, 16), whiteMarbleMat);
      wBase.position.set(wd.x, 0.5, wd.z);
      const wDome = new THREE.Mesh(new THREE.SphereGeometry(wd.r, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), whiteMarbleMat);
      wDome.position.set(wd.x, 1.0, wd.z);
      greenDomeGroup.add(wBase, wDome);
    });

    madinah.add(greenDomeGroup);

    // 3. Iconic Convertible Giant Umbrellas (مظلات المسجد النبوي الشريف)
    const umbrellaSites = [
      { x: 5.5, z: 3.0 },
      { x: 5.5, z: -3.0 },
      { x: -5.8, z: 3.2 },
      { x: -5.8, z: -3.2 }
    ];

    umbrellaSites.forEach(site => {
      const umb = new THREE.Group();
      umb.position.set(site.x, 0.50, site.z);

      // Fluted White Marble Support Column (h = 4.6m)
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 4.6, 16), whiteMarbleMat);
      col.position.y = 2.3;
      col.castShadow = true;
      umb.add(col);

      // Folded Origami Lotus Teflon Canopy
      const canopy = new THREE.Mesh(new THREE.ConeGeometry(2.0, 2.8, 8), umbrellaFabricMat);
      canopy.position.y = 5.4;
      canopy.scale.set(1.0, 1.0, 0.9);
      umb.add(canopy);

      // Golden Filigree Border Ring around Umbrella
      const gRing = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.045, 8, 24), umbrellaGoldMat);
      gRing.position.y = 4.4;
      gRing.rotation.x = Math.PI / 2;
      umb.add(gRing);

      madinah.add(umb);
    });

    // 4. Stately White Madinah Minarets (مآذن المسجد النبوي الشريف: h = 21.0m)
    [-8.8, 8.8].forEach(minX => {
      const minaret = new THREE.Group();
      minaret.position.set(minX, 0, -4.5);

      // Square Base
      const bPlinth = new THREE.Mesh(new THREE.BoxGeometry(2.2, 5.0, 2.2), whiteMarbleMat);
      bPlinth.position.y = 2.5;
      minaret.add(bPlinth);

      // Octagonal Main Shaft
      const octShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 1.0, 9.0, 8), whiteMarbleMat);
      octShaft.position.y = 5.0 + 4.5;
      minaret.add(octShaft);

      // Balcony with Golden Railing
      const balcony = new THREE.Mesh(new THREE.CylinderGeometry(1.20, 0.85, 0.60, 16), whiteMarbleMat);
      balcony.position.y = 14.3;
      const bRail = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.05, 8, 24), umbrellaGoldMat);
      bRail.position.y = 14.65;
      bRail.rotation.x = Math.PI / 2;
      minaret.add(balcony, bRail);

      // Upper Cupola Lantern
      const cupola = new THREE.Mesh(new THREE.CylinderGeometry(0.60, 0.70, 3.4, 8), whiteMarbleMat);
      cupola.position.y = 16.5;
      minaret.add(cupola);

      // Cylindrical Spire & Golden Crescent
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.60, 3.0, 12), whiteMarbleMat);
      spire.position.y = 19.5;
      const mCrescent = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), pureGoldMat);
      mCrescent.position.y = 21.0;
      minaret.add(spire, mCrescent);

      madinah.add(minaret);
    });

    return madinah;
  }

  /**
   * 3. MARAYA CONCERT HALL - ALULA (قاعة مرايا في العلا - أكبر مبنى مرايا بالعالم)
   * - Guinness World Record Mirrored Monolith (100% real reflective mirror glass reflecting desert sand, sun & cliffs)
   * - High-resolution 500-panel grid lines with beveled seams
   * - Recessed minimalist dark basalt entrance portal with glowing warm golden interior
   * - Flanked by organic sandstone Ashar canyon boulders
   */
  createMarayaAlUla(warmCanopyGlowMat) {
    const maraya = new THREE.Group();

    // Ultra-Reflective 100% Mirror Glass Material with Real Desert & Sky Reflection
    const mirrorEnvTex = this.generateMarayaMirrorTexture();
    const mirrorGlassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,      // Pure Specular Mirror
      roughness: 0.0,      // Zero blur, crystal sharp mirror reflections
      envMap: mirrorEnvTex,
      envMapIntensity: 3.5 // Radiant sunlit reflection brilliance
    });

    const darkBasaltMat = new THREE.MeshStandardMaterial({
      color: 0x181a1c,
      roughness: 0.90,
      metalness: 0.10
    });

    const canyonRockMat = new THREE.MeshStandardMaterial({
      color: 0xb8824a,
      roughness: 0.92,
      metalness: 0.02
    });

    const mw = 12.0, mh = 6.4, md = 8.5;

    // 1. Underground Plinth
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(mw + 1.2, 4.0, md + 1.2), darkBasaltMat);
    plinth.position.y = -2.0;
    maraya.add(plinth);

    // 2. THE MONOLITHIC MIRRORED CUBE (مكعب المرايا العاكس الأيقوني)
    const mirrorCube = new THREE.Mesh(new THREE.BoxGeometry(mw, mh, md), mirrorGlassMat);
    mirrorCube.position.y = mh / 2;
    mirrorCube.castShadow = true;
    mirrorCube.receiveShadow = true;
    maraya.add(mirrorCube);

    // 3. High-Precision 500 Mirror Panel Grid Seams (فواصل ألواح المرايا الـ 500)
    const seamMat = new THREE.MeshBasicMaterial({ color: 0x4a5866 });
    // Vertical seams across front facade
    for (let vx = -mw / 2 + 1.2; vx < mw / 2; vx += 1.2) {
      const seam = new THREE.Mesh(new THREE.BoxGeometry(0.02, mh * 0.98, 0.02), seamMat);
      seam.position.set(vx, mh / 2, md / 2 + 0.02);
      maraya.add(seam);
    }
    // Horizontal seams across front facade
    for (let hy = 0.8; hy < mh; hy += 0.8) {
      const seam = new THREE.Mesh(new THREE.BoxGeometry(mw * 0.98, 0.02, 0.02), seamMat);
      seam.position.set(0, hy, md / 2 + 0.02);
      maraya.add(seam);
    }
    // Side facade seams
    for (let vz = -md / 2 + 1.2; vz < md / 2; vz += 1.2) {
      const seamL = new THREE.Mesh(new THREE.BoxGeometry(0.02, mh * 0.98, 0.02), seamMat);
      seamL.position.set(-mw / 2 - 0.02, mh / 2, vz);
      const seamR = new THREE.Mesh(new THREE.BoxGeometry(0.02, mh * 0.98, 0.02), seamMat);
      seamR.position.set(mw / 2 + 0.02, mh / 2, vz);
      maraya.add(seamL, seamR);
    }

    // 4. Recessed Minimalist Entrance Portal (المدخل المعماري الغائر بإضاءة ذهبية دافئة)
    const portalVoid = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.0, 0.8), darkBasaltMat);
    portalVoid.position.set(0, 1.0, md / 2 - 0.2);
    const portalGlow = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.7, 0.1), warmCanopyGlowMat);
    portalGlow.position.set(0, 1.0, md / 2 - 0.5);
    maraya.add(portalVoid, portalGlow);

    // 5. Sandstone Canyon Boulders Flanking Maraya (صخور وادي عشار المنحوتة بجوار القاعة)
    const boulder1 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.4, 1), canyonRockMat);
    boulder1.position.set(-mw / 2 - 1.4, 1.4, 0.8);
    boulder1.scale.set(1.2, 1.4, 0.9);
    const boulder2 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.0, 1), canyonRockMat);
    boulder2.position.set(mw / 2 + 1.3, 1.2, -0.6);
    boulder2.scale.set(1.1, 1.3, 0.8);
    maraya.add(boulder1, boulder2);

    return maraya;
  }

  /**
   * 4. HEGRA / QASR AL-FARID - MADAIN SALEH (الحِجر / مدائن صالح - قصر الفريد بالعلا)
   * - UNESCO World Heritage Site: Free-standing monumental sandstone monolith rock
   * - Signature carved classical Nabataean facade with 5-step stepped crowstep crenellations
   * - Egyptian cavetto cornice, classical triangular pediment, and 4 carved pilasters with Nabataean capitals
   * - Monumental carved tomb doorway with deep dark interior void
   */
  createQasrAlFaridHegra(rockTex) {
    const hegra = new THREE.Group();

    // Nabataean Rock & Chiseled Facade Materials
    const naturalRockMat = new THREE.MeshStandardMaterial({
      color: 0xba7942, // Warm weathered Hegra sandstone
      map: rockTex,
      bumpMap: rockTex,
      bumpScale: 0.045,
      roughness: 0.94,
      metalness: 0.02
    });

    const chiseledFacadeMat = new THREE.MeshStandardMaterial({
      color: 0xc9864c, // Finely chiseled Nabataean tomb stone
      map: rockTex,
      roughness: 0.88,
      metalness: 0.03
    });

    const tombVoidMat = new THREE.MeshStandardMaterial({
      color: 0x140d07, // Deep shadow interior tomb void
      roughness: 0.98
    });

    // 1. THE MASSIVE SANDSTONE ROCK MONOLITH (صخرة قصر الفريد الطبيعية المنحوتة)
    const rockBase = new THREE.Mesh(
      new THREE.CylinderGeometry(5.2, 6.4, 11.2, 16),
      naturalRockMat
    );
    rockBase.position.y = 5.6;
    rockBase.scale.set(1.35, 1.0, 1.20);
    rockBase.castShadow = true;
    rockBase.receiveShadow = true;
    hegra.add(rockBase);

    // Weathered Rock Summit Cap
    const rockCap = new THREE.Mesh(new THREE.DodecahedronGeometry(3.6, 1), naturalRockMat);
    rockCap.position.set(0.2, 9.0, -0.4);
    rockCap.scale.set(1.4, 0.8, 1.1);
    hegra.add(rockCap);

    // 2. THE CARVED MONUMENTAL NABATAEAN FACADE (الواجهة النبطية المنحوتة في الصخر)
    const facadeGroup = new THREE.Group();
    facadeGroup.position.set(0, 0, 3.8); // Front chiseled face

    // Flat chiseled facade backdrop (w: 5.6m, h: 7.6m)
    const fPanel = new THREE.Mesh(new THREE.BoxGeometry(5.4, 7.6, 0.5), chiseledFacadeMat);
    fPanel.position.y = 4.0;
    facadeGroup.add(fPanel);

    // A. Stepped Crowstep Crenellations at Summit (الدرج النبطي المسنن الأيقوني لقصر الفريد)
    for (let st = 0; st < 5; st++) {
      const stepW = 1.8 - st * 0.32;
      const stepH = 0.26;
      // Left 5-step pyramid
      const lStep = new THREE.Mesh(new THREE.BoxGeometry(stepW, stepH, 0.35), chiseledFacadeMat);
      lStep.position.set(-1.6 + st * 0.16, 7.6 + st * stepH, 0.2);
      // Right 5-step pyramid
      const rStep = new THREE.Mesh(new THREE.BoxGeometry(stepW, stepH, 0.35), chiseledFacadeMat);
      rStep.position.set(1.6 - st * 0.16, 7.6 + st * stepH, 0.2);
      facadeGroup.add(lStep, rStep);
    }

    // B. Egyptian Cavetto / Gorge Cornice & Attic Molding
    const cavetto = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.38, 0.45), chiseledFacadeMat);
    cavetto.position.set(0, 7.4, 0.25);
    facadeGroup.add(cavetto);

    // C. Triangular Classical Pediment & Entablature (الإفريز والمثلث النبطي الكلاسيكي)
    const entablature = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.42, 0.40), chiseledFacadeMat);
    entablature.position.set(0, 6.8, 0.22);
    facadeGroup.add(entablature);

    // D. 4 Carved Pilasters with Nabataean Horned Capitals (الأعمدة النبطية الأربعة ذات التيجان القرنية)
    const pilasterX = [-2.2, -0.9, 0.9, 2.2];
    pilasterX.forEach(px => {
      // Column Base
      const cBase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.35), chiseledFacadeMat);
      cBase.position.set(px, 0.4, 0.25);
      // Column Shaft
      const cShaft = new THREE.Mesh(new THREE.BoxGeometry(0.42, 5.8, 0.28), chiseledFacadeMat);
      cShaft.position.set(px, 3.4, 0.22);
      // Nabataean Horned Capital (التاج النبطي ذو القرون)
      const cCap = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.45, 0.38), chiseledFacadeMat);
      cCap.position.set(px, 6.4, 0.26);
      facadeGroup.add(cBase, cShaft, cCap);
    });

    // E. Monumental Carved Tomb Doorway (مدخل المقبرة المنحوت بإطار بارز)
    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 0.25), chiseledFacadeMat);
    doorFrame.position.set(0, 2.0, 0.25);
    const doorVoid = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.3, 0.6), tombVoidMat);
    doorVoid.position.set(0, 1.8, 0.35);
    const doorPediment = new THREE.Mesh(new THREE.ConeGeometry(0.9, 0.5, 4), chiseledFacadeMat);
    doorPediment.rotation.y = Math.PI / 4;
    doorPediment.position.set(0, 3.5, 0.25);
    facadeGroup.add(doorFrame, doorVoid, doorPediment);

    hegra.add(facadeGroup);

    return hegra;
  }

  initTuwaiqHorizon() {
    // Authentic Distant Rocky Plateau Escarpments & Mount Tuwaiq (جبال طويق الصخرية الشامخة وحافة العالم)
    // Continuous majestic layered sandstone & limestone escarpment spanning the vast horizon (z = -128)
    const horizonGroup = new THREE.Group();
    horizonGroup.position.set(0, -2.4, -128);

    // High-Detail Geological Strata Textures (Layered sedimentary rock)
    const rockTex = this.generateTuwaiqRockTexture();

    const tuwaiqCliffMat = new THREE.MeshStandardMaterial({
      color: 0xc89255, // Warm Najdi sandstone cliff face
      map: rockTex,
      bumpMap: rockTex,
      bumpScale: 0.045,
      roughness: 0.90,
      metalness: 0.04
    });

    const tuwaiqTalusMat = new THREE.MeshStandardMaterial({
      color: 0xa8683c, // Deep terracotta talus scree base
      map: rockTex,
      bumpMap: rockTex,
      bumpScale: 0.030,
      roughness: 0.94,
      metalness: 0.02
    });

    const tuwaiqCapMat = new THREE.MeshStandardMaterial({
      color: 0xe0be84, // Sunlit limestone plateau caprock
      map: rockTex,
      roughness: 0.85,
      metalness: 0.03
    });

    // 9 Monumental Escarpment Sections with Natural Promontories ("خشوم طويق وحافة العالم")
    const tuwaiqSections = [
      { x: -145, w: 55, h: 28, d: 24, rotY: 0.14, type: 'escarpment' },
      { x: -105, w: 50, h: 32, d: 26, rotY: -0.06, type: 'cliff' },
      { x: -68,  w: 46, h: 35, d: 25, rotY: 0.08, type: 'headland' }, // Prominent promontory left
      { x: -32,  w: 42, h: 26, d: 22, rotY: -0.10, type: 'canyon' },   // Canyon gap
      { x: 0,    w: 48, h: 36, d: 28, rotY: 0.04, type: 'pinnacle' }, // Center Tuwaiq landmark
      { x: 34,   w: 44, h: 29, d: 24, rotY: -0.08, type: 'canyon' },
      { x: 72,   w: 52, h: 38, d: 27, rotY: 0.10, type: 'headland' }, // Edge of the World sheer cliff
      { x: 112,  w: 48, h: 31, d: 25, rotY: -0.05, type: 'cliff' },
      { x: 152,  w: 58, h: 27, d: 24, rotY: 0.12, type: 'escarpment' }
    ];

    tuwaiqSections.forEach((sec, idx) => {
      const secGroup = new THREE.Group();
      secGroup.position.set(sec.x, 0, (idx % 2 === 0 ? 0 : -8));
      secGroup.rotation.y = sec.rotY;

      // 1. Lower Sloping Talus Apron (المنحدر الركامي الصخري لقاعدة الجبل)
      const talusH = sec.h * 0.35;
      const talus = new THREE.Mesh(new THREE.CylinderGeometry(sec.w * 0.44, sec.w * 0.58, talusH, 12), tuwaiqTalusMat);
      talus.position.y = talusH / 2;
      talus.scale.set(1.0, 1.0, sec.d / sec.w);
      secGroup.add(talus);

      // 2. Sheer Vertical Sandstone Cliff Wall (الواجهة الصخرية العمودية الشاهقة)
      const cliffH = sec.h * 0.55;
      const cliff = new THREE.Mesh(new THREE.CylinderGeometry(sec.w * 0.40, sec.w * 0.44, cliffH, 16), tuwaiqCliffMat);
      cliff.position.y = talusH + cliffH / 2;
      cliff.scale.set(1.0, 1.0, sec.d / sec.w);
      cliff.castShadow = true;
      secGroup.add(cliff);

      // 3. Protruding Rock Promontory / Headland Buttresses ("خشوم طويق" البارزة)
      const buttressCount = Math.max(2, Math.floor(sec.w / 12));
      for (let bt = 0; bt < buttressCount; bt++) {
        const bx = -sec.w * 0.36 + bt * (sec.w * 0.72 / (buttressCount - 1 || 1));
        const buttressH = cliffH * (0.85 + (bt % 2) * 0.20);
        const buttress = new THREE.Mesh(
          new THREE.BoxGeometry(3.6, buttressH, 5.5),
          tuwaiqCliffMat
        );
        buttress.position.set(bx, talusH + buttressH / 2, sec.d * 0.42);
        buttress.rotation.y = (bt % 2 === 0 ? 0.08 : -0.08);
        secGroup.add(buttress);
      }

      // 4. Horizontal Sedimentary Strata Cornices (الأفاريز الجيولوجية الرسوبية)
      for (let s = 1; s <= 4; s++) {
        const sY = talusH + s * (cliffH / 5);
        const sCornice = new THREE.Mesh(
          new THREE.CylinderGeometry(sec.w * 0.41, sec.w * 0.43, 0.55, 16),
          (s % 2 === 0 ? tuwaiqCapMat : tuwaiqTalusMat)
        );
        sCornice.position.y = sY;
        sCornice.scale.set(1.04, 1.0, (sec.d / sec.w) * 1.04);
        secGroup.add(sCornice);
      }

      // 5. Flat Limestone Caprock Plateau (هضبة القمة الصخرية لجبل طويق)
      const capH = sec.h * 0.10;
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(sec.w * 0.38, sec.w * 0.40, capH, 16), tuwaiqCapMat);
      cap.position.y = talusH + cliffH + capH / 2;
      cap.scale.set(1.0, 1.0, sec.d / sec.w);
      secGroup.add(cap);

      // 6. Iconic Tuwaiq Pinnacle Rock / "اصبع فيصل" (Natural rock spire rising beside cliff)
      if (sec.type === 'pinnacle' || sec.type === 'headland') {
        const spireH = sec.h * 0.48;
        const pinnacleSpire = new THREE.Mesh(
          new THREE.CylinderGeometry(1.2, 2.4, spireH, 8),
          tuwaiqCliffMat
        );
        pinnacleSpire.position.set(sec.w * 0.38, talusH + spireH / 2, sec.d * 0.35);
        pinnacleSpire.rotation.z = 0.04;
        secGroup.add(pinnacleSpire);

        const spireCap = new THREE.Mesh(new THREE.ConeGeometry(1.3, 2.2, 8), tuwaiqCapMat);
        spireCap.position.set(sec.w * 0.38 + 0.08, talusH + spireH + 1.0, sec.d * 0.35);
        secGroup.add(spireCap);
      }

      horizonGroup.add(secGroup);
    });

    this.group.add(horizonGroup);
  }

  generateFrondLeafletTexture() {
    if (this.frondTexture) return this.frondTexture;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 256, 1024);

    // Central Woody Spine / Rachis (جريدة النخل)
    ctx.strokeStyle = '#5a7526';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(128, 0);
    ctx.lineTo(128, 1024);
    ctx.stroke();

    // Leaflets (خوص النخل): Radiating sharply outwards along both sides
    const leafletCount = 94;
    for (let i = 0; i < leafletCount; i++) {
      const y = (i / leafletCount) * 960 + 35;
      const norm = Math.sin((i / leafletCount) * Math.PI);
      const len = norm * 120 + 14;

      // Color: rich emerald base to sunlit golden green tip
      const grad = ctx.createLinearGradient(128, y, 128 - len, y);
      grad.addColorStop(0, '#24561b');
      grad.addColorStop(0.65, '#3b7826');
      grad.addColorStop(1, '#949e32');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';

      // Left leaflet
      ctx.beginPath();
      ctx.moveTo(128, y);
      ctx.quadraticCurveTo(128 - len * 0.5, y - 8, 128 - len, y - 24);
      ctx.stroke();

      // Right leaflet
      ctx.beginPath();
      ctx.moveTo(128, y);
      ctx.quadraticCurveTo(128 + len * 0.5, y - 8, 128 + len, y - 24);
      ctx.stroke();
    }

    this.frondTexture = new THREE.CanvasTexture(canvas);
    this.frondTexture.anisotropy = 16;
    return this.frondTexture;
  }

  generatePalmTrunkTexture() {
    if (this.trunkTexture) return this.trunkTexture;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#4c3420';
    ctx.fillRect(0, 0, 512, 1024);

    // Overlapping Diamond Frond Base Scales (كرب النخل)
    const rows = 32;
    const cols = 8;
    const rowH = 1024 / rows;
    const colW = 512 / cols;

    for (let r = 0; r < rows; r++) {
      const y = r * rowH;
      const offset = (r % 2) * (colW / 2);

      for (let c = -1; c <= cols; c++) {
        const x = c * colW + offset;

        ctx.beginPath();
        ctx.moveTo(x + colW / 2, y);
        ctx.lineTo(x + colW, y + rowH * 0.6);
        ctx.lineTo(x + colW / 2, y + rowH);
        ctx.lineTo(x, y + rowH * 0.6);
        ctx.closePath();

        const scarGrad = ctx.createLinearGradient(x, y, x, y + rowH);
        scarGrad.addColorStop(0, '#785635');   // Sunlit top ridge
        scarGrad.addColorStop(0.5, '#5a3d24'); // Mid bark
        scarGrad.addColorStop(1, '#2a1a0e');   // Deep shadow
        ctx.fillStyle = scarGrad;
        ctx.fill();

        ctx.strokeStyle = '#22140a';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Fibrous vertical striations (ليف النخل)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let fx = 0; fx < 512; fx += 3) {
      ctx.fillRect(fx, 0, 1.5, 1024);
    }

    this.trunkTexture = new THREE.CanvasTexture(canvas);
    this.trunkTexture.wrapS = THREE.RepeatWrapping;
    this.trunkTexture.wrapT = THREE.RepeatWrapping;
    this.trunkTexture.repeat.set(1, 4);
    this.trunkTexture.anisotropy = 16;
    return this.trunkTexture;
  }

  initSaudiFlora() {
    // Saudi Date Palms:
    // Natural tall, majestic palms (النخيل السامق) with authentic proportions (9.4-10.5m)
    // Distributed with wide organic spacing across depths, framing the scene without queuing or clustering
    const palmLocations = [
      // Left perimeter framing (framing the far-left screen border, 100% open optical corridor for Maraya, Ithra & Khobar)
      { x: -11.5, z: 4.0,   scale: 1.05, lean: -0.12 }, // Far-left foreground arching gently outwards away from center
      { x: -28.0, z: -14.0, scale: 0.95, lean: -0.10 }, // Far-left midground desert border
      { x: -34.0, z: -28.0, scale: 0.90, lean: 0.10 },  // Far-left background desert border
      { x: -38.0, z: -42.0, scale: 0.88, lean: 0.12 },  // Far-left deep horizon border

      // Right perimeter framing (framing the far-right screen border, 100% clear of Masmak & Bayt Naseef)
      { x: 29.5,  z: -12.0, scale: 0.95, lean: -0.15 }, // Far-right foreground flanking outside Bayt Naseef
      { x: 35.0,  z: -24.0, scale: 0.88, lean: 0.10 },  // Far-right midground desert border
      { x: 39.0,  z: -36.0, scale: 0.85, lean: -0.08 }  // Far-right deep background border
    ];

    palmLocations.forEach(loc => {
      const palm = this.createAuthenticDatePalm(loc.scale, loc.lean);
      const groundY = this.getTerrainHeight(loc.x, loc.z);
      palm.position.set(loc.x, groundY, loc.z);
      this.group.add(palm);
      this.palms.push(palm);
    });

    this.createRealisticSaudiLavender();
  }

  /**
   * Real Saudi Date Palm Tree (نخلة بلح سعودية أصيلة حقيقية):
   * - Natural tall trunk (9.4-10.5m) with stepped diamond bark and fiber collar
   * - Weeping fountain crown of lush feathery fronds
   * - Golden date bunches on curved amber stalks
   */
  createAuthenticDatePalm(scale = 1.0, leanAmount = 0.48) {
    const palm = new THREE.Group();
    const h = 9.4 * scale; // Natural majestic height for Saudi date palms

    // 1. Natural Curved Trunk with Segmented Diamond Bark
    const trunkGeo = new THREE.CylinderGeometry(0.26 * scale, 0.46 * scale, h, 16, 28);
    const pos = trunkGeo.attributes.position;

    const maxLean = leanAmount * scale;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = (y + h / 2) / h; // 0 at base, 1 at top
      // Continuous natural parabolic lean
      const leanX = Math.pow(Math.max(0, t), 1.75) * maxLean;
      pos.setX(i, pos.getX(i) + leanX);

      // Micro-scallop rings along the trunk height for physical scaly steps
      const ringBump = Math.sin(t * Math.PI * 32) * (0.014 * scale);
      const rad = Math.hypot(pos.getX(i), pos.getZ(i));
      if (rad > 0.01) {
        pos.setZ(i, pos.getZ(i) * (1 + ringBump));
      }
    }
    trunkGeo.computeVertexNormals();

    const trunkTex = this.generatePalmTrunkTexture();
    const trunkMat = new THREE.MeshStandardMaterial({
      map: trunkTex,
      roughness: 0.92,
      metalness: 0.04
    });

    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = h / 2;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    palm.add(trunk);

    // Exact top coordinates of trunk
    const topX = maxLean;
    const topY = h;

    // 2. Trunk Fiber Crown Collar (ليف النخل البني الحاضن لقواعد السعف)
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x3e2817,
      roughness: 0.95
    });
    const collarGeo = new THREE.CylinderGeometry(0.30 * scale, 0.27 * scale, 0.48 * scale, 12);
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.set(topX, topY - 0.20 * scale, 0);
    palm.add(collar);

    // 3. Crown of Weeping Cascading Feathery Fronds (Sprouting directly from trunk tip with ZERO GAP!)
    const crown = new THREE.Group();
    crown.position.set(topX, topY, 0);

    const frondTex = this.generateFrondLeafletTexture();
    const frondMat = new THREE.MeshStandardMaterial({
      map: frondTex,
      transparent: true,
      alphaTest: 0.35,
      side: THREE.DoubleSide,
      roughness: 0.70
    });

    // Three natural weeping tiers of cascading fronds (Lush, magnificent, well-proportioned):
    // Tier 1: Inner upright fronds arching outward (10 fronds)
    this.addWeepingFrondTier(crown, frondMat, 10, 4.2 * scale, 1.10 * scale, 0.28, 1.25 * scale);
    // Tier 2: Middle weeping fountain fronds arching out and cascading down (14 fronds)
    this.addWeepingFrondTier(crown, frondMat, 14, 5.2 * scale, 1.20 * scale, 0.60, 2.30 * scale);
    // Tier 3: Lower mature skirt fronds drooping steeply toward the ground (14 fronds)
    this.addWeepingFrondTier(crown, frondMat, 14, 5.5 * scale, 1.15 * scale, 1.02, 3.10 * scale);

    // 4. Golden Date Fruit Clusters on Curved Amber Stalks (عذوق التمر السكري وقنوانه)
    const dateClusterMat = new THREE.MeshStandardMaterial({
      color: 0xd98c28,
      roughness: 0.42,
      metalness: 0.08
    });
    const stalkMat = new THREE.MeshStandardMaterial({
      color: 0xc47e22,
      roughness: 0.65
    });

    for (let d = 0; d < 6; d++) {
      const dAng = (d / 6) * Math.PI * 2 + 0.3;
      const cluster = new THREE.Group();
      cluster.position.set(
        Math.cos(dAng) * 0.28 * scale,
        -0.20 * scale,
        Math.sin(dAng) * 0.28 * scale
      );

      // Curved date stalk arching downward from under the fronds
      const stalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.020 * scale, 0.015 * scale, 0.72 * scale, 6),
        stalkMat
      );
      stalk.position.y = -0.35 * scale;
      stalk.rotation.z = 0.25;
      cluster.add(stalk);

      // Hanging dates clustered tightly
      for (let b = 0; b < 18; b++) {
        const dateBerry = new THREE.Mesh(
          new THREE.SphereGeometry(0.080 * scale, 8, 8),
          dateClusterMat
        );
        dateBerry.scale.set(0.85, 1.45, 0.85);
        dateBerry.position.set(
          (Math.random() - 0.5) * 0.30 * scale,
          -0.35 * scale - Math.random() * 0.40 * scale,
          (Math.random() - 0.5) * 0.30 * scale
        );
        cluster.add(dateBerry);
      }
      crown.add(cluster);
    }

    palm.add(crown);
    palm.userData = { crown: crown, fronds: crown.userData.fronds || [] };
    return palm;
  }

  /**
   * Generates authentically weeping palm fronds:
   * - Base starts EXACTLY at (0, 0, 0) of the crown center (Zero gap!)
   * - Rises smoothly, reaches out, and cascades gracefully downward toward the earth
   * - Natural tapering width and V-fold channel along the central spine
   */
  addWeepingFrondTier(crown, material, count, length, width, angleOutward, droopAmount) {
    if (!crown.userData.fronds) crown.userData.fronds = [];

    for (let f = 0; f < count; f++) {
      const azimuth = (f / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.12;

      // Plane geometry along local Y from 0 to length
      const frondGeo = new THREE.PlaneGeometry(width, length, 6, 24);
      // Shift so the base vertex is exactly at (0, 0, 0)
      frondGeo.translate(0, length / 2, 0);

      const pos = frondGeo.attributes.position;

      for (let j = 0; j < pos.count; j++) {
        const y = pos.getY(j);
        const t = Math.max(0, Math.min(1, y / length)); // 0 at base, 1 at tip

        // Natural tapering width: zero at base, widest around 45%, tapering to tip
        const widthFactor = Math.sin(Math.pow(t, 0.65) * Math.PI);
        pos.setX(j, pos.getX(j) * (0.12 + widthFactor * 0.88));

        // Graceful weeping arch: rises in first 30% and then cascades downward
        const archUp = Math.sin(t * Math.PI * 0.65) * (length * 0.30);
        const weepingFall = -Math.pow(t, 2.05) * droopAmount;
        const forwardReach = Math.pow(t, 0.88) * (length * 0.80);

        // V-gutter fold along the spine
        const vFold = Math.abs(pos.getX(j)) * 0.38;

        pos.setY(j, archUp + weepingFall);
        pos.setZ(j, forwardReach + vFold);
      }
      frondGeo.computeVertexNormals();

      const frondMesh = new THREE.Mesh(frondGeo, material);
      frondMesh.castShadow = true;
      frondMesh.position.set(0, 0, 0);

      const pivot = new THREE.Group();
      pivot.position.set(0, 0, 0);
      pivot.rotation.y = azimuth;
      pivot.rotation.x = angleOutward;

      pivot.add(frondMesh);
      crown.add(pivot);
      crown.userData.fronds.push(pivot);
    }
  }

  /**
   * Authentic Botanical Saudi Wild Lavender (زهر الخزامى البري - Horwoodia dicksoniae):
   * - Natural branching herb (25-35cm) with sage-green slender stems and leaves
   * - Terminal floral spikes clustered with delicate violet & purple florets and pale white tips
   * - Blooming in scenic clusters across the desert sand dunes, distributed away from center text (يمين ويسار وورا)
   */
  createRealisticSaudiLavender() {
    // Shared botanical materials
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x486b36, // Desert sage-green
      roughness: 0.85
    });

    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x426830,
      roughness: 0.80,
      side: THREE.DoubleSide
    });

    const violetMat = new THREE.MeshStandardMaterial({
      color: 0x8536b8, // Deep Arabian lavender violet
      roughness: 0.65,
      emissive: 0x431263,
      emissiveIntensity: 0.22
    });

    const lilacMat = new THREE.MeshStandardMaterial({
      color: 0xb76ce8, // Light purple bloom
      roughness: 0.60,
      emissive: 0x5a207a,
      emissiveIntensity: 0.18
    });

    const whiteTipMat = new THREE.MeshStandardMaterial({
      color: 0xf5ecfc, // White tip petals
      roughness: 0.55
    });

    // Scenic Blooming Patches: naturally distributed across foreground flanks, dune crests, and heritage valleys
    // for harmonious purple-violet accents ("زيد وزع خزامى فالاماكن بس بشكل غير مبالغ فيه فقط عشان تكون لون وتناسق")
    const lavenderPatches = [
      // --- Foreground Flanks (مقدمة المشهد يميناً ويساراً بجوار الكثبان) ---
      { x: -8.0, z: 5.5, count: 4, spread: 1.1 },
      { x: -12.5, z: 2.0, count: 5, spread: 1.2 },
      { x: 6.8, z: 4.8, count: 5, spread: 1.1 },
      { x: 11.5, z: 2.5, count: 5, spread: 1.2 },
      { x: 7.5, z: -0.5, count: 4, spread: 1.0 },

      // --- Left Dunes (يسار المشهد عبر الكثبان) ---
      { x: -9.5, z: -3.0, count: 5, spread: 1.3 },
      { x: -13.0, z: -8.0, count: 5, spread: 1.4 },
      { x: -17.5, z: -16.0, count: 6, spread: 1.6 },
      { x: -22.0, z: -26.0, count: 5, spread: 1.8 },

      // --- Heritage Sand Dunes (محيطة بقصر المصمك والمباني الحجازية دون تداخل) ---
      { x: 6.5, z: -11.0, count: 5, spread: 1.2 },
      { x: 17.5, z: -11.0, count: 5, spread: 1.2 },
      { x: 20.5, z: -14.0, count: 5, spread: 1.3 },
      { x: 8.5, z: -16.5, count: 4, spread: 1.1 },
      { x: 12.0, z: -25.5, count: 4, spread: 1.3 },
      { x: 23.0, z: -26.0, count: 5, spread: 1.8 },

      // --- Depth & Midground (ورا في العمق عبر الكثبان الرملية) ---
      { x: -4.5, z: -11.0, count: 4, spread: 1.3 },
      { x: 4.5, z: -12.0, count: 4, spread: 1.3 },
      { x: -1.5, z: -19.0, count: 5, spread: 1.5 },
      { x: 2.5, z: -27.0, count: 5, spread: 1.6 },
      { x: -6.0, z: -34.0, count: 4, spread: 1.8 },
      { x: 5.5, z: -38.0, count: 4, spread: 1.8 },
      { x: 0.0, z: -44.0, count: 4, spread: 2.0 }
    ];

    lavenderPatches.forEach(patch => {
      for (let p = 0; p < patch.count; p++) {
        const ox = (Math.random() - 0.5) * patch.spread;
        const oz = (Math.random() - 0.5) * patch.spread;
        const px = patch.x + ox;
        const pz = patch.z + oz;
        const groundY = this.getTerrainHeight(px, pz);

        const bush = this.createLavenderBush(stemMat, leafMat, violetMat, lilacMat, whiteTipMat);
        bush.position.set(px, groundY, pz);
        bush.rotation.y = Math.random() * Math.PI * 2;
        this.group.add(bush);
        this.flora.push(bush);
      }
    });
  }

  createLavenderBush(stemMat, leafMat, violetMat, lilacMat, whiteTipMat) {
    const bush = new THREE.Group();
    const stemCount = 7 + Math.floor(Math.random() * 4);

    const stemGeo = new THREE.CylinderGeometry(0.009, 0.014, 0.42, 6);
    const leafGeo = new THREE.PlaneGeometry(0.04, 0.12);
    const floretGeo = new THREE.DodecahedronGeometry(0.038, 0);

    for (let s = 0; s < stemCount; s++) {
      const sAngle = (s / stemCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const sTilt = 0.12 + Math.random() * 0.22;
      const sHeight = 0.35 + Math.random() * 0.15;

      const stemGroup = new THREE.Group();
      stemGroup.rotation.y = sAngle;
      stemGroup.rotation.x = sTilt;

      // Slender branching green stem
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = sHeight / 2;
      stem.scale.y = sHeight / 0.42;
      stemGroup.add(stem);

      // 2-3 delicate leaves
      for (let l = 0; l < 3; l++) {
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.set((l % 2 === 0 ? 1 : -1) * 0.025, 0.10 + l * 0.07, 0);
        leaf.rotation.z = (l % 2 === 0 ? -1 : 1) * 0.45;
        stemGroup.add(leaf);
      }

      // Clustered Violet Floral Spike (قمة زهرة الخزامى العطرة)
      const spikeY = sHeight + 0.04;
      const spikeTiers = 5;
      for (let t = 0; t < spikeTiers; t++) {
        const ty = spikeY + t * 0.032;
        const floretMat = (t === spikeTiers - 1) ? whiteTipMat : (t % 2 === 0 ? violetMat : lilacMat);
        const ringCount = 3 + (t < 3 ? 1 : 0);

        for (let r = 0; r < ringCount; r++) {
          const rAng = (r / ringCount) * Math.PI * 2;
          const floret = new THREE.Mesh(floretGeo, floretMat);
          floret.position.set(
            Math.cos(rAng) * 0.026,
            ty,
            Math.sin(rAng) * 0.026
          );
          stemGroup.add(floret);
        }
      }

      bush.add(stemGroup);
    }

    return bush;
  }

  initDesertAmbience() {
    // 1. Fine Golden Dust Drift Particles (Airborne sparkle)
    const count = 120;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 44;
      pos[i + 1] = Math.random() * 7 - 1;
      pos[i + 2] = (Math.random() - 0.5) * 36;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xfce1ba,
      size: 0.075,
      transparent: true,
      opacity: 0.72
    });

    this.dustParticles = new THREE.Points(geo, mat);
    this.group.add(this.dustParticles);

    // 2. Low-altitude Ground Sand Wisps (Sweeping along dune crests)
    const wispCount = 90;
    const wispGeo = new THREE.BufferGeometry();
    const wispPos = new Float32Array(wispCount * 3);

    for (let j = 0; j < wispCount * 3; j += 3) {
      wispPos[j] = (Math.random() - 0.5) * 55;
      wispPos[j + 1] = -2.1 + Math.random() * 0.7;
      wispPos[j + 2] = (Math.random() - 0.5) * 45;
    }
    wispGeo.setAttribute('position', new THREE.BufferAttribute(wispPos, 3));

    const wispMat = new THREE.PointsMaterial({
      color: 0xecd0a2,
      size: 0.065,
      transparent: true,
      opacity: 0.48
    });

    this.sandWisps = new THREE.Points(wispGeo, wispMat);
    this.group.add(this.sandWisps);
  }

  update(time, delta) {
    // 1. Dynamic sway of palm crowns & individual fronds ("الظل اريده واضح ومتحرك")
    this.palms.forEach((p, idx) => {
      if (p.userData?.crown) {
        const swayZ = Math.sin(time * 1.45 + idx * 1.1) * 0.048;
        const swayX = Math.cos(time * 1.15 + idx * 0.85) * 0.035;
        p.userData.crown.rotation.z = swayZ;
        p.userData.crown.rotation.x = swayX;
      }
      if (p.userData?.fronds) {
        // Individual fronds flexing in the desert wind -> casts clearly moving feathery shadows onto the sand!
        p.userData.fronds.forEach((fPivot, fIdx) => {
          fPivot.rotation.z = Math.sin(time * 2.1 + fIdx * 0.35 + idx) * 0.022;
        });
      }
    });

    // 2. Dynamic Living Sunlight: Subtle natural oscillation of morning sun position
    // Keeps desert sand shadows subtly moving, breathing, and visually rich across dunes
    if (this.sunLight) {
      this.sunLight.position.x = 14 + Math.sin(time * 0.28) * 0.95;
      this.sunLight.position.z = 16 + Math.cos(time * 0.28) * 0.65;
    }

    // 3. Wind sway on native wild flora
    this.flora.forEach((plant, idx) => {
      plant.rotation.z = Math.sin(time * 2.2 + idx * 0.6) * 0.045;
      plant.rotation.x = Math.cos(time * 1.8 + idx * 0.4) * 0.03;
    });

    // 3. Airborne dust drift
    if (this.dustParticles) {
      const pos = this.dustParticles.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i) + delta * 0.38;
        if (x > 22) x = -22;
        pos.setX(i, x);
      }
      pos.needsUpdate = true;
    }

    // 4. Ground-level sand wisps blowing across dunes
    if (this.sandWisps) {
      const pos = this.sandWisps.geometry.attributes.position;
      for (let j = 0; j < pos.count; j++) {
        let x = pos.getX(j) + delta * 0.65;
        if (x > 27) x = -27;
        pos.setX(j, x);
      }
      pos.needsUpdate = true;
    }
  }

  setVisible(visible) {
    this.group.visible = visible;
  }
}
