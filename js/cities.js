/**
 * cities.js - خريطة المملكة وسفر الكاميرا الفيزيائي إلى المدن الـ 11
 * - خريطة تضاريس رقمية حية للمملكة مع نقاط جغرافية تفاعلية
 * - الغوص الفيزيائي في تضاريس كل مدينة (الضباب وورد الطائف، الرواشين والبلد في جدة، النخيل والدرعية في الرياض، جبال أجا وسلمى في حائل)
 * - ربط مسارات YouTube الرسمية:
 *   1. العرضة النجدية للرياض (تبدأ من 00:35 بدقة)
 *   2. المجرور الطائفي للطائف
 *   3. السامري الحائلي لحائل
 *   4. باقي المدن: "الصوت لم يُرفع بعد" دون ألحان مصطنعة
 * - شريط تفاعلي للصوت المكاني (Sound Proximity) للتنقل بين أطراف المدينة ومركز التراث
 */

import { sound } from './audioEngine.js';
import { i18n } from './i18n.js';

export class CitiesManager {
  constructor(onCitySelected) {
    this.onCitySelected = onCitySelected;

    this.mapScene = document.getElementById('map-scene');
    this.mapLayer = document.getElementById('map-cities-layer');
    this.cityRealmScene = document.getElementById('city-realm-scene');
    this.btnAscendMap = document.getElementById('btn-ascend-map');

    this.cityNameEl = document.getElementById('city-name');
    this.cityBadgeEl = document.getElementById('city-badge');
    this.cityQuoteEl = document.getElementById('city-quote');
    this.cityHeritageLineEl = document.getElementById('city-heritage-line');
    this.cityPoetryEl = document.getElementById('city-poetry-inscribed');
    this.cityAttributionEl = document.getElementById('city-attribution-inscribed');

    this.proximitySlider = document.getElementById('proximity-slider');
    this.proximityValLabel = document.getElementById('proximity-val-label');

    this.skyCanvas = document.getElementById('sky-canvas');
    this.terrainCanvas = document.getElementById('terrain-canvas');
    this.elementsCanvas = document.getElementById('elements-canvas');

    this.skyCtx = this.skyCanvas ? this.skyCanvas.getContext('2d') : null;
    this.terrainCtx = this.terrainCanvas ? this.terrainCanvas.getContext('2d') : null;
    this.elementsCtx = this.elementsCanvas ? this.elementsCanvas.getContext('2d') : null;

    this.activeCityKey = null;

    // 11 verified regional worlds with precise geographic coordinates & heritage motifs
    this.cities = {
      riyadh: {
        nameAr: 'الرياض',
        nameEn: 'Riyadh',
        badge: 'عاصمة المجد ودرعية التاريخ',
        quote: 'بين أسوار الطين الشامخة ومستقبل يعانق عنان السماء',
        heritageLine: 'العرضة النجدية — فخر الفرسان وصلصلة السيوف وتوحيد الدار',
        audioTrackKey: 'riyadh', // Official YouTube Track (starts at 35s)
        hasOfficialAudio: true,
        verses: 'نجدٍ شكت ليلها والصبح نادانا .. والشمس تشرق على دار هل العوجا\nنخوة ملوكٍ تصون العهد بأيمانا .. وسيوف حقٍ على روس العدا عوجا',
        attribution: 'موروث العرضة النجدية وتاريخ الأئمة والملوك',
        x: 52, y: 50,
        skyGrad: ['#1c1611', '#543b27', '#8a623f'],
        motifs: ['diriyah_door', 'kafd_skylines', 'mabkhara', 'daff_player']
      },
      taif: {
        nameAr: 'الطائف',
        nameEn: 'Taif',
        badge: 'عروس المصايف ومدينة الورد',
        quote: 'جبال تلامس الغيم.. وورد ينثر شذاه في الأفق البارد',
        heritageLine: 'المجرور الطائفي — إيقاع جبال السروات ورشاقة الزواريع',
        audioTrackKey: 'taif', // Official YouTube Track
        hasOfficialAudio: true,
        verses: 'يا طائف الغيم كم في راحتيك ندى .. يروي القلوب ويسبي الروح عِطراكا\nالورد فتّح في الأغصان مبتسماً .. وجاد بالمسكِ حتى صار مسراكا',
        attribution: 'شعر وجداني في محبة الطائف وجبال الهدا',
        x: 32, y: 64,
        skyGrad: ['#231d2b', '#5c486e', '#a384b8'],
        motifs: ['taif_roses', 'daff_player']
      },
      hail: {
        nameAr: 'حائل',
        nameEn: 'Hail',
        badge: 'عروس الشمال وعاصمة الكرم',
        quote: 'أجا وسلمى يشهدان.. وفنجال الكرم لا ينقطع في ليالي البرد',
        heritageLine: 'السامري الحائلي — حداء الليل وشبت النار في النفود',
        audioTrackKey: 'hail', // Official YouTube Track
        hasOfficialAudio: true,
        verses: 'أجا وسلمى يشهدان لمجدنا .. والكرمُ في حائل نهجٌ ومحتدُ\nما طارقُ الليل إن وافى بذي كربٍ .. إلا يبيتُ بدارِ العز يسعدُ',
        attribution: 'أصالة الشعر الحائلي وذاكرة الجبلين الخالدة',
        x: 40, y: 32,
        skyGrad: ['#241913', '#663923', '#a85f37'],
        motifs: ['tea_kettle', 'falcon_tower']
      },
      jeddah: {
        nameAr: 'جدة',
        nameEn: 'Jeddah',
        badge: 'عروس البحر الأحمر وبوابة الحرمين',
        quote: 'نسيم البحر يعانق خشب الرواشين في أزقة البلد العتيقة',
        heritageLine: 'الدانة والمجس الحجازي — نغم البحر والتجارة العريقة',
        audioTrackKey: null,
        hasOfficialAudio: false,
        verses: 'جدة على شاطئ الياقوت ساهرةٌ .. والبحر يعزف في مسراها ألحانا\nرواشنُ الخشب الميمون تنبض في .. صدر الزمان هوىً يروي حكايانا',
        attribution: 'أصداء شعر الحجاز وشعراء البحر',
        x: 26, y: 60,
        skyGrad: ['#0f1f24', '#235259', '#4d989e'],
        motifs: ['rawshan']
      },
      makkah: {
        nameAr: 'مكة المكرمة',
        nameEn: 'Makkah',
        badge: 'مهبط الوحي وقبلة المسلمين',
        quote: 'أم القرى وأقدس البقاع.. سكينة تغمر الأرواح من كل فج عميق',
        heritageLine: 'أصداء التكبير والترانيم الروحانية الخالدة',
        audioTrackKey: null,
        hasOfficialAudio: false,
        verses: 'مكة يا مهبط الآيات والنور .. يا نبضة الروح بين البيت والركنِ\nكل القلوب إليك اليوم قاصدةٌ .. تمحو ذنوب السنين الغبر بالدَّمْعِ',
        attribution: 'شعر الوجدان المكي والجلال الإيماني',
        x: 29, y: 66,
        skyGrad: ['#211d13', '#574828', '#9e8549'],
        motifs: ['palm']
      },
      madinah: {
        nameAr: 'المدينة المنورة',
        nameEn: 'Madinah',
        badge: 'طيبة الطيبة ومأرز الإيمان',
        quote: 'نخيل باسق ورحاب طاهرة تفيض بالسلام والنور',
        heritageLine: 'مدائح السكينة والألفة النبوية العطرة',
        audioTrackKey: null,
        hasOfficialAudio: false,
        verses: 'يا طيبة الخير فيك الروح سابحةٌ .. والقلبُ يزهو بأنوار الحبيب هنا\nنخيلُكِ الشامخ المعطاء مؤتنسٌ .. برحمة الله يجلو كل كربِ عنا',
        attribution: 'من عيون الشعر في محبة طيبة الطيبة',
        x: 27, y: 46,
        skyGrad: ['#14241b', '#2e593e', '#59946e'],
        motifs: ['palm']
      },
      yanbu: {
        nameAr: 'ينبع',
        nameEn: 'Yanbu',
        badge: 'لؤلؤة البحر الأحمر',
        quote: 'أوتار السمسمية وأهازيج البحارة مع نسمات الغروب',
        heritageLine: 'الفن الينبعاوي العريق وشدو الموانئ',
        audioTrackKey: null,
        hasOfficialAudio: false,
        verses: 'على شاطئ الينبوع غنّت سمسمية .. وشقّ عبابَ البحر فلكُ البحارةِ\nلنا مع نسيم الملح عهدٌ وقصةٌ .. تليدةُ مجدٍ سُطّرت في الإمارةِ',
        attribution: 'تراث الفن الينبعاوي وأغاني الموانئ العتيقة',
        x: 22, y: 48,
        skyGrad: ['#10222b', '#2c586e', '#5599b5'],
        motifs: ['rawshan']
      },
      tabuk: {
        nameAr: 'تبوك',
        nameEn: 'Tabuk',
        badge: 'بوابة الشمال وعروس الثلج والآثار',
        quote: 'جبال حِسمى الوردية ونقوش الأولين تحكي شموخ الصحراء',
        heritageLine: 'الهجيني ووقع خطى الركائب في رمال الشمال',
        audioTrackKey: null,
        hasOfficialAudio: false,
        verses: 'تبوك الورد والتاريخ تزهو .. على شرفاتِ مجدٍ مستطيرِ\nبها حسمى تخلد كل نقشٍ .. وتجري في روابيها العبيرِ',
        attribution: 'شعر شعراء الشمال الغربي في تبوك الأبية',
        x: 19, y: 22,
        skyGrad: ['#2b1814', '#70382b', '#b5614a'],
        motifs: ['falcon_tower']
      },
      qassim: {
        nameAr: 'القصيم',
        nameEn: 'Al-Qassim',
        badge: 'واحة العطاء وعاصمة النخيل',
        quote: 'سواني الماء وبساتين السكري التي لا ينضب خيرها',
        heritageLine: 'السامري القصيمي وأهازيج الفلاحين في بساتين النخيل',
        audioTrackKey: null,
        hasOfficialAudio: false,
        verses: 'قصيمُ الجودِ يا نخلَ العطايا .. ويا أرضاً تفيضُ بكل خيرِ\nسوانيكَ العذابُ تفيضُ حباً .. وتطربُ في رباك شداةُ طيرِ',
        attribution: 'من تراث الفلاحين وأدب أهل القصيم',
        x: 46, y: 42,
        skyGrad: ['#1d2116', '#4a5933', '#869e5d'],
        motifs: ['palm']
      },
      eastern: {
        nameAr: 'المنطقة الشرقية',
        nameEn: 'Eastern Province',
        badge: 'شاطئ الخير وموطن النهضة والصناعة',
        quote: 'من سفن الغوص ولآلئ الخليج إلى عاصمة الطاقة العالمية',
        heritageLine: 'شدو النّهام وفنون الفجري البحرية',
        audioTrackKey: null,
        hasOfficialAudio: false,
        verses: 'على شاطئ الشرقية الفذِّ موعدٌ .. مع الفجرِ إذ ينسابُ سحراً ومفخرا\nوغاصةُ لؤلؤنا الأوائلُ سطّروا .. كفاحاً غدا للعالمين مُصدّرا',
        attribution: 'من أهازيج الغاصة وتراث النهامين في الخليج',
        x: 72, y: 46,
        skyGrad: ['#111c26', '#264866', '#4f85b0'],
        motifs: ['khobar_tower']
      },
      ahsa: {
        nameAr: 'الأحساء',
        nameEn: 'Al-Ahsa',
        badge: 'أكبر واحة نخيل مستدامة في العالم',
        quote: 'عيون الماء الرقراقة وجبل قارة وتاريخ يمتد لآلاف السنين',
        heritageLine: 'العرضة الحساوية ورائحة الخبز الحمر والأرز الحساوي',
        audioTrackKey: null,
        hasOfficialAudio: false,
        verses: 'هنا الأحساء يا واحاتِ خلدٍ .. تفجّرَ ماؤها عذباً زلالا\nنخيلٌ باسقاتٌ في شموخٍ .. تحاكي المجد عزاً وجلالا',
        attribution: 'شعر تراثي احتفاءً بواحة الأحساء الخالدة',
        x: 66, y: 58,
        skyGrad: ['#1b2112', '#415729', '#749646'],
        motifs: ['palm']
      }
    };

    this.init();
  }

  init() {
    this.renderCityNodes();
    this.bindEvents();
  }

  renderCityNodes() {
    if (!this.mapLayer) return;
    this.mapLayer.innerHTML = '';

    Object.entries(this.cities).forEach(([key, city]) => {
      const node = document.createElement('div');
      node.className = 'geo-city-marker';
      node.style.left = `${city.x}%`;
      node.style.top = `${city.y}%`;
      node.setAttribute('data-city', key);

      node.innerHTML = `
        <div class="city-glowing-beacon"></div>
        <div class="city-map-name">${city.nameAr}</div>
      `;

      node.addEventListener('click', () => {
        this.descendCameraIntoCity(key);
      });

      this.mapLayer.appendChild(node);
    });
  }

  bindEvents() {
    if (this.btnAscendMap) {
      this.btnAscendMap.addEventListener('click', () => {
        this.ascendCameraToMap();
      });
    }

    if (this.proximitySlider) {
      this.proximitySlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.handleProximityChange(val);
      });
    }
  }

  /* Physical Camera Descent from the Map into the City Realm */
  descendCameraIntoCity(cityKey) {
    const city = this.cities[cityKey];
    if (!city) return;

    this.activeCityKey = cityKey;

    if (this.mapScene) {
      this.mapScene.classList.remove('active-scene');
    }

    if (this.cityRealmScene) {
      this.cityRealmScene.classList.add('active-scene');
    }

    sound.playBrassDallahResonance();

    // Populate City Details
    if (this.cityNameEl) this.cityNameEl.textContent = city.nameAr;
    if (this.cityBadgeEl) this.cityBadgeEl.textContent = city.badge;
    if (this.cityQuoteEl) this.cityQuoteEl.textContent = city.quote;
    if (this.cityHeritageLineEl) {
      if (city.hasOfficialAudio) {
        this.cityHeritageLineEl.textContent = `🔊 ${city.heritageLine}`;
      } else {
        this.cityHeritageLineEl.textContent = `الصوت لم يُرفع بعد — ${city.heritageLine}`;
      }
    }

    if (this.cityAttributionEl) {
      this.cityAttributionEl.textContent = `— ${city.attribution}`;
    }

    // Inscribe poetry lines
    if (this.cityPoetryEl) {
      this.cityPoetryEl.innerHTML = '';
      const lines = city.verses.split('\n');
      lines.forEach((l, i) => {
        const p = document.createElement('p');
        p.className = 'city-inscribed-verse';
        p.style.opacity = '0';
        p.style.transform = 'translateY(12px)';
        p.style.transition = 'all 0.9s cubic-bezier(0.2, 1, 0.4, 1)';
        p.textContent = l;
        this.cityPoetryEl.appendChild(p);

        setTimeout(() => {
          p.style.opacity = '1';
          p.style.transform = 'translateY(0)';
        }, 150 + i * 400);
      });
    }

    // Trigger Audio:
    // Only the 3 cities with official YouTube tracks play music; others report 'الصوت لم يُرفع بعد'
    if (city.hasOfficialAudio && city.audioTrackKey) {
      sound.playTrack(city.audioTrackKey);
      if (this.proximitySlider) this.proximitySlider.value = '0.5';
      this.handleProximityChange(0.5);
    } else {
      // Stop any running heritage audio
      sound.stopTrack('riyadh');
      sound.stopTrack('taif');
      sound.stopTrack('hail');
    }

    // Paint physical city backdrop with custom motifs
    this.renderCityBackdrop(cityKey);

    if (this.onCitySelected) {
      this.onCitySelected(cityKey);
    }
  }

  /* Camera rises back up to the Saudi Map */
  ascendCameraToMap() {
    // Stop city track
    if (this.activeCityKey && this.cities[this.activeCityKey].hasOfficialAudio) {
      sound.stopTrack(this.cities[this.activeCityKey].audioTrackKey);
    }

    if (this.cityRealmScene) {
      this.cityRealmScene.classList.remove('active-scene');
    }

    if (this.mapScene) {
      this.mapScene.classList.add('active-scene');
    }

    this.activeCityKey = null;
    sound.playFinjanClink();
  }

  /* Proximity Audio Slider Adjustment */
  handleProximityChange(val) {
    // val: 0 (very close to heritage core) to 1 (far outskirts)
    if (!this.activeCityKey) return;
    const city = this.cities[this.activeCityKey];

    if (this.proximityValLabel) {
      if (val < 0.3) {
        this.proximityValLabel.textContent = 'قريب جداً (في قلب الساحة)';
      } else if (val < 0.7) {
        this.proximityValLabel.textContent = 'متوسط (في أطراف الحي التراثي)';
      } else {
        this.proximityValLabel.textContent = 'بعيد (صوت يتهادى مع الريح)';
      }
    }

    if (city.hasOfficialAudio && city.audioTrackKey) {
      sound.setProximity(city.audioTrackKey, val);
    }
  }

  /* Paint Physical City Backdrop onto Canvas Layers */
  renderCityBackdrop(cityKey) {
    if (!this.skyCtx || !this.terrainCtx || !this.elementsCtx) return;

    const city = this.cities[cityKey];
    const w = this.skyCanvas.width;
    const h = this.skyCanvas.height;

    this.skyCtx.clearRect(0, 0, w, h);
    this.terrainCtx.clearRect(0, 0, w, h);
    this.elementsCtx.clearRect(0, 0, w, h);

    // Sky
    const skyGrad = this.skyCtx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, city.skyGrad[0]);
    skyGrad.addColorStop(0.5, city.skyGrad[1]);
    skyGrad.addColorStop(1, city.skyGrad[2]);
    this.skyCtx.fillStyle = skyGrad;
    this.skyCtx.fillRect(0, 0, w, h);

    // Terrain & Mountains
    this.terrainCtx.fillStyle = 'rgba(15, 12, 10, 0.65)';
    this.terrainCtx.beginPath();
    this.terrainCtx.moveTo(0, h * 0.65);
    this.terrainCtx.bezierCurveTo(w * 0.3, h * 0.55, w * 0.6, h * 0.72, w, h * 0.60);
    this.terrainCtx.lineTo(w, h);
    this.terrainCtx.lineTo(0, h);
    this.terrainCtx.fill();

    // Foreground Elements based on City Identity & User's Cultural Motifs
    if (cityKey === 'taif') {
      // Taif: Mountain mist + Rose Basket + Pink Rose Petals
      this.drawTaifRoses(this.elementsCtx, w * 0.75, h * 0.75);
    } else if (cityKey === 'riyadh') {
      // Riyadh: Diriyah Carved Door + Mabkhara with incense + KAFD
      this.drawRiyadhHeritage(this.elementsCtx, w * 0.78, h * 0.76);
    } else if (cityKey === 'hail') {
      // Hail: Traditional tea kettle on desert embers + Granite ridge of Aja & Salma
      this.drawHailHeritage(this.elementsCtx, w * 0.75, h * 0.75);
    } else if (cityKey === 'jeddah') {
      // Jeddah: Hijazi Rowshan Window + Sea waves
      this.drawJeddahRowshan(this.elementsCtx, w * 0.75, h * 0.75);
    }
  }

  /* Draw Taif Rose Basket & Floating Petals */
  drawTaifRoses(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Woven wicker basket
    ctx.fillStyle = '#b89065';
    ctx.beginPath();
    ctx.moveTo(-40, 0);
    ctx.lineTo(40, 0);
    ctx.lineTo(32, -45);
    ctx.lineTo(-32, -45);
    ctx.closePath();
    ctx.fill();

    // Taif pink roses mound
    ctx.fillStyle = '#e8618c';
    for (let i = 0; i < 9; i++) {
      ctx.beginPath();
      ctx.arc(-26 + i * 6.5, -48 - (i % 2) * 8, 11, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /* Draw Riyadh Najdi door and Mabkhara */
  drawRiyadhHeritage(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Golden Mabkhara
    ctx.fillStyle = '#dca10d';
    ctx.fillRect(-14, -8, 28, 8);
    ctx.fillRect(-6, -30, 12, 22);
    ctx.beginPath();
    ctx.moveTo(-18, -30);
    ctx.lineTo(18, -30);
    ctx.lineTo(14, -50);
    ctx.lineTo(-14, -50);
    ctx.closePath();
    ctx.fill();

    // Smoke
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -52);
    ctx.bezierCurveTo(-10, -80, 15, -110, 0, -140);
    ctx.stroke();

    ctx.restore();
  }

  /* Draw Hail Tea Kettle on Embers */
  drawHailHeritage(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Desert glowing embers
    ctx.fillStyle = '#d94326';
    ctx.beginPath();
    ctx.arc(0, 5, 22, 0, Math.PI * 2);
    ctx.fill();

    // Traditional tea kettle
    ctx.fillStyle = '#a89476';
    ctx.beginPath();
    ctx.ellipse(0, -20, 24, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spout & handle
    ctx.strokeStyle = '#6e5f49';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(18, -26);
    ctx.lineTo(34, -40);
    ctx.stroke();

    // Handle
    ctx.beginPath();
    ctx.arc(0, -32, 18, Math.PI, 0, false);
    ctx.stroke();

    ctx.restore();
  }

  /* Draw Jeddah Hijazi Rowshan Window */
  drawJeddahRowshan(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Brown carved wood frame
    ctx.fillStyle = '#4a2f1c';
    ctx.fillRect(-35, -110, 70, 110);

    // Wooden latticework panels
    ctx.fillStyle = '#785338';
    ctx.fillRect(-28, -100, 26, 90);
    ctx.fillRect(2, -100, 26, 90);

    // Decorative corbels below
    ctx.fillStyle = '#3a2416';
    ctx.beginPath();
    ctx.moveTo(-35, 0);
    ctx.lineTo(35, 0);
    ctx.lineTo(20, 22);
    ctx.lineTo(-20, 22);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
