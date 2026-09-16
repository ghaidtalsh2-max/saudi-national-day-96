/**
 * saudiRegionsMap.js - خريطة المملكة العربية السعودية الجغرافية الرسمية الحقيقية
 * - مبنية على المخطط الجغرافي المعتمد لكافة مناطق المملكة الـ 13
 * - كل منطقة بلونها المستقل وتوهج جمالي وتسميات دقيقة
 * - صور فوتوغرافية حقيقية عالية الدقة للمدن وتجارب حية وألعاب مصغرة (تلفريك الطائف)
 */

import { OFFICIAL_SAUDI_MAP } from './officialSaudiMapData.js';
import { CityMiniGamesEngine } from './cityMiniGames.js';
import { sound } from './audioEngine.js';

export class SaudiRegionsMapManager {
  constructor() {
    this.mapContainer = document.getElementById('map-svg-container');
    this.worldView = document.getElementById('map-world-view');
    this.citySubscene = document.getElementById('city-subscene');
    this.btnBackToMap = document.getElementById('btn-back-to-map-grid');

    this.cityNameEl = document.getElementById('city-title-text');
    this.cityTagEl = document.getElementById('city-tag-text');
    this.cityQuoteEl = document.getElementById('city-quote-text');
    this.featTerrain = document.getElementById('feat-terrain');
    this.featFlora = document.getElementById('feat-flora');
    this.featExperience = document.getElementById('feat-experience');
    this.gameActions = document.getElementById('city-game-actions');
    this.btnPlayMinigame = document.getElementById('btn-play-minigame');

    this.miniGameCanvas = document.getElementById('city-minigame-canvas');
    this.miniGameEngine = null;

    this.activeCityKey = null;

    // Verified Photographic Landmark and Cultural Data
    this.citiesData = {
      taif: {
        nameAr: 'الطائف',
        nameEn: 'Taif',
        photo: 'assets/images/landmarks/taif_cablecar.jpg',
        tag: 'عروس المصايف ومدينة الورد والضباب',
        quote: 'جبال تلامس الغيم.. وورد ينثر شذاه في الأفق البارد بين قمم الهدا والشفا',
        terrain: 'جبال السروات الشاهقة، قمم الهدا والشفا، أودية عذبة ومرتفعات تعانق الضباب.',
        flora: 'الورد الجوري الطائفي النفيس، مزارع الرمان الشفوي، العنب، والتين الشوكي (البرشومي).',
        architecture: 'قصور حجرية تراثية بنوافذ خشبية وشرفات مدمجة مع صخور الجبال.',
        experience: 'اركب تلفريك الهدا وانطلق به عبر الضباب فوق مزارع الورد حتى القمة!',
        gameBtnText: '🚡 صعود التلفريك نحو القمة 🚀',
        color: '#e91e63'
      },
      riyadh: {
        nameAr: 'الرياض',
        nameEn: 'Riyadh',
        photo: 'assets/images/landmarks/riyadh_skyline.jpg',
        subPhoto: 'assets/images/landmarks/riyadh_masmak.jpg',
        tag: 'عاصمة المجد ودرعية التاريخ وقلب المملكة',
        quote: 'بين أسوار الطين الشامخة في طريف ومستقبل يعانق عنان السماء في كافد',
        terrain: 'هضبة نجد، حافة طويق الشامخة، وادي حنيفة ورياض الخزامى.',
        flora: 'نخيل السكري العريق، نبات العرعر، شجيرات الرمث، وزهور الخزامى والنفل البري.',
        architecture: 'الطراز السلماني النجدي: بيوت الطين بروازنها المثلثة المدمجة مع أبراج الزجاج الحديثة.',
        experience: 'معايشة إيقاع العرضة النجدية وتاريخ المصمك وأبراج الرياض المتلألئة.',
        gameBtnText: '⚔️ إيقاع طبول وسيوف العرضة',
        color: '#d4af37'
      },
      jeddah: {
        nameAr: 'جدة',
        nameEn: 'Jeddah',
        photo: 'assets/images/landmarks/jeddah_balad.jpg',
        tag: 'عروس البحر الأحمر وبوابة الحرمين الشريفين',
        quote: 'رواشين الخشب تحكي أسرار القرون.. وموج البحر يغازل كورنيش الأصالة',
        terrain: 'ساحل البحر الأحمر والشعاب المرجانية وسهل تهامة المنبسط.',
        flora: 'أشجار المانجروف الساحلية (القرم)، النيم، ونخيل الزينة الشاطئي.',
        architecture: 'الحجر المنقبي ورواشين خشب التيك والجاوي المنقوشة بدقة فلكية في حارة البلد.',
        experience: 'جولة بين أزقة حي البلد التاريخي وسماع نداء البحر ونوارس الكورنيش.',
        gameBtnText: '🌊 جولة في رواشين البلد',
        color: '#00b4d8'
      },
      asir: {
        nameAr: 'عسير (أبها ورجال ألمع)',
        nameEn: 'Asir (Abha & Rijal Almaa)',
        photo: 'assets/images/landmarks/asir_rijal.jpg',
        tag: 'سيدة الضباب وألوان القط العسيري',
        quote: 'مدرجات خضراء تعانق السحاب ونقوش تحكي بهجة الروح وأصالة أهل الجنوب',
        terrain: 'جبل السودة أعلى قمم المملكة، مدرجات زراعية خضراء، ومنحدرات تهامية سحيقة.',
        flora: 'غابات العرعر الكثيفة، نبات الشيح والريحان والكادي والضيمران العطري.',
        architecture: 'قصور رجال ألمع الحجرية المتعددة الأدوار ونقوش القط العسيري المسجلة عالمياً.',
        experience: 'تنسيق ألوان القط العسيري التراثية في سفوح جبال السودة الماطرة.',
        gameBtnText: '🎨 إبداع نقوش القط العسيري',
        color: '#8338ec'
      },
      eastern: {
        nameAr: 'الأحساء والشرقية',
        nameEn: 'Al-Ahsa & Eastern Province',
        photo: 'assets/images/landmarks/ahsa_oasis.jpg',
        tag: 'أكبر واحة نخيل في العالم وبحر الخير',
        quote: 'عيون الماء الرقراقة وجبل قارة.. ونخيل يمتد إلى الأفق كبحر أخضر لا ينتهي',
        terrain: 'واحات طبيعية غناء، جبل قارة ومغاراته الكلسية الباردة، وشواطئ الخليج العربي.',
        flora: 'أكثر من 3 ملايين نخلة (تمر الخلاص)، والأرز الحساوي الأحمر الشهير.',
        architecture: 'طراز الواحات الحساوي: الأقواس الجصية البيضاء، البوابات الخشبية الضخمة، والقصور الطينية.',
        experience: 'استكشاف نسيم عيون الماء وتدفقها بين بساتين النخيل وجبل قارة.',
        gameBtnText: '🌴 تدفق عيون الأحساء وجبل قارة',
        color: '#2a9d8f'
      },
      hail: {
        nameAr: 'حائل',
        nameEn: 'Hail',
        photo: 'assets/images/landmarks/hail_jubbah.jpg',
        tag: 'دار الكرم وعروس الشمال وجبال أجا وسلمى',
        quote: 'أجا وسلمى يشهدان.. وفنجال الكرم الحاتمي لا ينقطع في ليالي البرد والسمر',
        terrain: 'جبال الغرانيت الحمراء (أجا وسلمى)، رمال النفود الكبير الذهبية، والوديان العذبة.',
        flora: 'أشجار الغضا والرمث والأرطى، ونخيل الحلوة الحائلية الشهيرة.',
        architecture: 'قلاع الحجر واللبن التاريخية مثل قلعة عيرف وقشلة حائل العتيدة وموقع جبة العالمي.',
        experience: 'شبة النار التفاعلية وصب الفنجال الحاتمي وسماع أهازيج السامري.',
        gameBtnText: '☕ شبة النار والسامري الحائلي',
        color: '#e76f51'
      },
      baha: {
        nameAr: 'الباحة',
        nameEn: 'Al-Baha',
        photo: 'assets/images/landmarks/baha_theeain.jpg',
        tag: 'حديقة الحجاز وقرية ذي عين الرخامية',
        quote: 'حصون رخامية بيضاء تطل على وادٍ أخضر.. وسحاب يلامس رؤوس الشجر',
        terrain: 'مرتفعات السراة الخضراء، أودية تهامة الدافئة، وغابات رغدان الكثيفة.',
        flora: 'أشجار العرعر، شجيرات الكادي والريحان، ومزارع الموز والليمون العطري.',
        architecture: 'عمارة الحجر التراثية بقصورها متعددة الأدوار وتناسقها مع المنحدرات الصخرية.',
        experience: 'استكشاف نبع عين الماء التاريخي وأزقة قرية ذي عين الحجرية الشامخة.',
        gameBtnText: '🏰 جولة قرية ذي عين الرخامية',
        color: '#2d6a4f'
      },
      tabuk: {
        nameAr: 'تبوك ونيوم',
        nameEn: 'Tabuk & NEOM',
        photo: 'assets/images/landmarks/tabuk_disah.jpg',
        tag: 'بوابة الشمال ومستقبل نيوم ووادي الديسة الساحر',
        quote: 'أعمدة الصخر الحمر الشاهقة تحتضن عيون الماء العذبة.. ومستقبل يصنع المعجزات',
        terrain: 'أخاديد وادي الديسة العظيمة، شواطئ البحر الأحمر النقية، وجبال اللوز المغطاة بالثلوج شتاءً.',
        flora: 'أشجار الدوم والنخيل البري، نباتات القصب المائية، والزهور الجبلية النادرة.',
        architecture: 'بين قلاع العهد العثماني القديمة وأحدث تصاميم العمارة المستقبلية في نيوم وذا لاين.',
        experience: 'رحلة سفاري بين أعمدة صخور وادي الديسة وتدفق الجداول الرقراقة.',
        gameBtnText: '🏜️ سفاري وادي الديسة ونيوم',
        color: '#0077b6'
      },
      jazan: {
        nameAr: 'جازان وجزر فرسان',
        nameEn: 'Jazan & Farasan',
        photo: 'assets/images/landmarks/jazan_farasan.jpg',
        tag: 'لؤلؤة الجنوب ومملكة الفل والكادي وجبال فيفا',
        quote: 'عقود الفل العاطرة تضيء الوجوه.. وموج الفيروز يداعب شواطئ الغزلان في فرسان',
        terrain: 'جبال فيفا (جارة القمر) المدرجة، أرخبيل جزر فرسان المرجانية، وسهول تهامة الخصبة.',
        flora: 'الفل الجازاني الأبيض النادر، الكادي، المانجو والبابايا الاستوائية الفاخرة، والبن الخولاني السعودي.',
        architecture: 'البيوت الأسطوانية (العشة) الساحلية، والبيوت الحجرية المعلقة في قمم فيفا الشاهقة.',
        experience: 'غوص بين شعاب فرسان المرجانية وتنسيق عقود الفل الجازاني الفواح.',
        gameBtnText: '🪸 غوص فرسان وعقود الفل',
        color: '#38b000'
      },
      najran: {
        nameAr: 'نجران',
        nameEn: 'Najran',
        photo: 'assets/images/landmarks/najran_palace.jpg',
        tag: 'أرض الأخدود وقصور الطين وقلاع الصمود',
        quote: 'بيوت الطين الشامخة بسبعة طوابق.. وتاريخ نقوش حمير وآبار حمى الشاهدة عبر العصور',
        terrain: 'واحة وادي نجران الممتدة، رمال الربع الخالي الشاسعة، وجبال صخرية ملونة بنقوش أثرية.',
        flora: 'نخيل البياض الشهير، مزارع العنب والحمضيات النجرانية اللذيذة، والقمح البري.',
        architecture: 'قصور الطين النجرانية (المدرّه والمشولق) المزينة بالجبس الأبيض الشاهق عبر 7 طوابق.',
        experience: 'استكشاف فن العمارة الطينية النجرانية ونقوش آبار حما الأثرية المسجلة باليونسكو.',
        gameBtnText: '🏛️ استكشاف قصور الطين وآبار حمى',
        color: '#b08968'
      },
      jouf: {
        nameAr: 'الجوف',
        nameEn: 'Al-Jouf',
        photo: 'assets/images/landmarks/jouf_marid.jpg',
        tag: 'عاصمة الزيتون ومقر قلعة مارد التاريخية',
        quote: 'أكثر من 20 مليون شجرة زيتون تعانق السماء.. وقلعة مارد تحكي قصة الصمود العربي',
        terrain: 'سهول زراعية خصبة، بحيرة دومة الجندل، ورمال النفود الشمالية الذهبية.',
        flora: 'بساتين الزيتون العضوية البكر، ونخيل الحلوة الجوفية الفاخرة.',
        architecture: 'قلعة مارد الحجرية الشامخة، ومسجد الخليفة عمر بن الخطاب بمئذنته الفريدة.',
        experience: 'عصر زيت الزيتون البكر الحائز على جوائز عالمية واستكشاف ممرات قلعة مارد.',
        gameBtnText: '🫒 قطاف زيتون الجوف وقلعة مارد',
        color: '#588157'
      },
      qassim: {
        nameAr: 'القصيم',
        nameEn: 'Al-Qassim',
        photo: 'assets/images/landmarks/ahsa_oasis.jpg',
        tag: 'سلة غذاء الوطن وموطن السكري وأكبر سوق تمور بالعالم',
        quote: 'نخيل السكري يمتد إلى الأفق كبحر أخضر.. وأصالة نجدية تفيض بالكرم والحفاوة',
        terrain: 'واحات وادي الرمة الشاسعة، رمال مستوية خصبة، ونفود الثويرات البرية.',
        flora: 'أكثر من 8 ملايين نخلة، التمر السكري الفاخر، والقمح النجدي الأصيل.',
        architecture: 'البلدات التراثية الطينية مثل أشيقر والمذنب بأزقتها المسقوفة بالخشب والنخيل.',
        experience: 'مزاد تمور القصيم العالمي وتذوق الكليجا الحارة المخبوزة بالهيل والدبس.',
        gameBtnText: '🌴 بهجة نخيل السكري والكليجا',
        color: '#bc6c25'
      },
      north: {
        nameAr: 'الحدود الشمالية',
        nameEn: 'Northern Borders',
        photo: 'assets/images/landmarks/tabuk_disah.jpg',
        tag: 'ديار الصقور والمراعي الفيحاء وبوابة الشمال',
        quote: 'هواء نقي يعبر الوديان.. وصقور تحلق في سماء الأصالة حيث يطيب المقناص',
        terrain: 'هضاب حجرية متموجة، أودية واسعة تزدهر بالربيع، وسهول فسيحة.',
        flora: 'نباتات الشيح والقيصوم، الخزامى البرية الفواحة، وزهور الديدحان الحمراء.',
        architecture: 'محطات خط التابلاين التاريخي، وقرى الشمال التراثية المضيافة.',
        experience: 'إطلاق الصقر في رحلة المقناص الشتوي وسط مساحات الربيع الممتدة.',
        gameBtnText: '🦅 هدد الصقور في البر الفسيح',
        color: '#495057'
      },
      alula: {
        nameAr: 'العلا والمدينة',
        nameEn: 'AlUla & Madinah',
        photo: 'assets/images/landmarks/alula_hegra.jpg',
        tag: 'أكبر متحف حي مفتوح في العالم وأرض الحضارات',
        quote: 'مقابر الحِجر المنحوتة في الصخر.. وملايين السنين من الإبداع الإنساني الخالد',
        terrain: 'صخور رملية نحتتها الرياح، جبل الفيل، وواحة العلا الخضراء بين الأخاديد.',
        flora: 'أشجار البان العربي والحمضيات الطازجة والنخيل الباسق في الوادي.',
        architecture: 'واجهات نبطية منحوتة في الصخر الصلب بدقة هندسية ملكية.',
        experience: 'التحليق بالمنطاد الهوائي فوق جبل الفيل وآثار الحِجر النبطية.',
        gameBtnText: '🎈 التحليق بالمنطاد فوق الحِجر',
        color: '#9d4edd'
      }
    };

    this.init();
  }

  init() {
    this.renderOfficialMap();
    this.bindEvents();

    if (this.miniGameCanvas) {
      this.miniGameEngine = new CityMiniGamesEngine(this.miniGameCanvas);
    }
  }

  renderOfficialMap() {
    if (!this.mapContainer) return;

    const pathsHtml = OFFICIAL_SAUDI_MAP.regions.map(reg => `
      <path id="${reg.id}" 
            class="saudi-official-region-path" 
            d="${reg.d}" 
            fill="${reg.color}"
            data-city="${reg.key}"
            data-name="${reg.name}" />
    `).join('\n');

    const pinsHtml = OFFICIAL_SAUDI_MAP.regions.map(reg => `
      <g class="city-official-pin" data-city="${reg.key}" transform="translate(${reg.cx}, ${reg.cy})">
        <circle class="pin-halo" r="55" fill="${reg.color}" opacity="0.35" />
        <circle class="pin-core" r="30" fill="#ffffff" stroke="${reg.color}" stroke-width="8" />
        <text class="pin-symbol" x="0" y="10" text-anchor="middle" font-size="28">${reg.icon}</text>
        <text class="pin-title-official" x="0" y="75" text-anchor="middle">${reg.name}</text>
      </g>
    `).join('\n');

    this.mapContainer.innerHTML = `
      <div class="saudi-official-map-wrapper">
        <svg viewBox="${OFFICIAL_SAUDI_MAP.viewBox}" class="saudi-official-svg-map">
          <defs>
            <filter id="map-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="rgba(0,0,0,0.18)" />
            </filter>
          </defs>
          <g id="regions-group" filter="url(#map-glow)">
            ${pathsHtml}
          </g>
          <g id="pins-group">
            ${pinsHtml}
          </g>
        </svg>
      </div>
    `;
  }

  bindEvents() {
    const clickableEls = this.mapContainer.querySelectorAll('[data-city]');
    clickableEls.forEach(el => {
      el.addEventListener('click', () => {
        const cityKey = el.getAttribute('data-city');
        this.openCityImmersion(cityKey);
      });
    });

    if (this.btnBackToMap) {
      this.btnBackToMap.addEventListener('click', () => {
        this.closeCityImmersion();
      });
    }

    const btnCityInfo = document.getElementById('btn-city-info');
    const cityInfoModal = document.getElementById('city-info-modal');
    const btnCloseCityCard = document.getElementById('btn-close-city-card');

    if (btnCityInfo && cityInfoModal) {
      btnCityInfo.addEventListener('click', () => {
        cityInfoModal.style.display = 'flex';
      });
    }

    if (btnCloseCityCard && cityInfoModal) {
      btnCloseCityCard.addEventListener('click', () => {
        cityInfoModal.style.display = 'none';
      });
    }

    if (cityInfoModal) {
      cityInfoModal.addEventListener('click', (e) => {
        if (e.target === cityInfoModal) {
          cityInfoModal.style.display = 'none';
        }
      });
    }

    // Canvas click delegation to mini-game engine
    if (this.miniGameCanvas) {
      this.miniGameCanvas.addEventListener('pointerdown', (e) => {
        const rect = this.miniGameCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (this.miniGameEngine) {
          this.miniGameEngine.handleClick(x, y);
        }
      });
    }

    if (this.btnPlayMinigame) {
      this.btnPlayMinigame.addEventListener('click', () => {
        if (this.miniGameEngine) {
          this.miniGameEngine.handleClick(this.miniGameCanvas.width * 0.5, this.miniGameCanvas.height * 0.5);
        }
      });
    }
  }

  openCityImmersion(cityKey) {
    const data = this.citiesData[cityKey] || this.citiesData['taif'];
    this.activeCityKey = cityKey;
    sound.playFinjanClink();

    // Populate City Details
    if (this.cityNameEl) this.cityNameEl.textContent = data.nameAr;
    if (this.cityTagEl) this.cityTagEl.textContent = data.tag;
    if (this.cityQuoteEl) this.cityQuoteEl.textContent = data.quote;
    if (this.featTerrain) this.featTerrain.textContent = data.terrain;
    if (this.featFlora) this.featFlora.textContent = data.flora;
    if (this.featExperience) this.featExperience.textContent = data.experience;
    if (this.btnPlayMinigame) this.btnPlayMinigame.innerHTML = `<span>${data.gameBtnText}</span>`;

    const infoNameEl = document.getElementById('btn-city-info-name');
    if (infoNameEl) infoNameEl.textContent = data.nameAr;

    // Remove any previous static photo wrap to let the living canvas shine
    const photoContainer = document.getElementById('city-hero-photo-wrap');
    if (photoContainer && photoContainer.parentNode) {
      photoContainer.parentNode.removeChild(photoContainer);
    }

    // Switch view
    if (this.worldView) this.worldView.style.display = 'none';
    if (this.citySubscene) {
      this.citySubscene.style.display = 'block';
      this.citySubscene.style.opacity = '1';
    }

    // Start Mini Game Living Arena
    if (this.miniGameEngine) {
      this.miniGameEngine.resize();
      this.miniGameEngine.startMiniGame(cityKey);
    }
  }

  closeCityImmersion() {
    this.activeCityKey = null;
    sound.playFinjanClink();

    const cityInfoModal = document.getElementById('city-info-modal');
    if (cityInfoModal) cityInfoModal.style.display = 'none';

    if (this.miniGameEngine) {
      this.miniGameEngine.stop();
    }

    if (this.citySubscene) this.citySubscene.style.display = 'none';
    if (this.worldView) {
      this.worldView.style.display = 'block';
      this.worldView.style.opacity = '1';
    }
  }
}
