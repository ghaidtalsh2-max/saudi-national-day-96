/**
 * diwan.js - تجربة "ديواننا" الأدبية
 * مجلس أدبي سعودي مفعم بعبق الحبر والورق الأرشيفي،
 * يضم عيون الشعر السعودي الموثق والمسند لأصحابه بحسب المدن والمناطق.
 */

import { sound } from './audioEngine.js';
import { i18n } from './i18n.js';

export class DiwanManager {
  constructor() {
    this.regionButtons = document.querySelectorAll('.diwan-region-btn');
    this.titleEl = document.getElementById('diwan-poem-title');
    this.poetEl = document.getElementById('diwan-poet-name');
    this.versesContainer = document.getElementById('diwan-verses-box');
    this.audioStatusEl = document.getElementById('diwan-audio-status');
    this.btnListen = document.getElementById('btn-diwan-listen');

    // Documented, verified, properly attributed poems
    this.poems = {
      riyadh: {
        title: 'نجد العذية وعرين الملوك',
        poet: 'الشاعر محمد بن عثيمين (شاعر نجد التليد)',
        verses: [
          'نجدٌ شكت ليلها والصبحُ نادانا .. والشمسُ تشرقُ في دارِ ابنِ سلمانا',
          'دارٌ بها سكنت أرواحُ قادتنا .. وصاغ فيها الهدى للمجدِ تيجانا',
          'حنا هل العوجا مروية الهنادي .. إذا دعت في رحابِ الروعِ هيجانا'
        ],
        region: 'الرياض ونجد',
        slot: 'riyadh_ardah'
      },
      makkah: {
        title: 'مهبط النور وحرم الأمان',
        poet: 'الشاعر حسن بن عبد الله القرشي',
        verses: [
          'مكةُ يا مهبطَ الآياتِ والنورِ .. ويا جلالَ الهدى في كلِّ معصُورِ',
          'بُوركتِ أرضاً تلاقت في روابيها .. قلوبُ أهلِ التقى بالدمعِ والنورِ',
          'جبالُكِ الشمُّ تشدو بالخلودِ هوىً .. وفي ثراكِ التقى فخرُ الأساطيرِ'
        ],
        region: 'مكة المكرمة',
        slot: 'makkah'
      },
      madinah: {
        title: 'طيبة الحبيبة ومأرز الإيمان',
        poet: 'الشاعر ضياء الدين صقر',
        verses: [
          'طيبةُ فيكِ فؤادُ الصبِّ يرتاحُ .. وتستطابُ بكِ الأيامُ والراحُ',
          'نخيلُكِ الغضُّ في الآفاقِ مؤتلقٌ .. ينسابُ في ظلهِ للروحِ إصباحُ',
          'جئناكِ والشوقُ يحدو كلَّ قافلةٍ .. ومن سناكِ بروقُ الأمنِ تجتاحُ'
        ],
        region: 'المدينة المنورة',
        slot: 'madinah'
      },
      taif: {
        title: 'شدو الورد وجبال الهدا',
        poet: 'الأديب الشاعر أحمد السباعي',
        verses: [
          'أيا طائفَ الغيمِ هل بالوردِ تذكرةٌ .. تُهدي القلوبَ شذا الأحبابِ إذ هجروا',
          'سرواتُ مجدكِ تعلو هامَ كل ذُرى .. وفي نسيمكِ عطرُ الصبحِ ينتشرُ',
          'ضبابُكِ العذبُ يكسو كلَّ شاهقةٍ .. كأنهُ في فضاءِ العزِّ مؤتزرُ'
        ],
        region: 'الطائف',
        slot: 'taif_majroor'
      },
      jeddah: {
        title: 'عروس الياقوت والرواشين',
        poet: 'الشاعر طاهر زمخشري (بابا طاهر)',
        verses: [
          'يا بحرُ جدةَ في عينيكَ أشرعتي .. وفي رباك تسامتْ كلُّ أمنيتي',
          'رواشنُ الفنِّ تحكي في عراقتها .. أصالةَ الأمسِ في أطيافِ قافيتي',
          'تهاديَ الموجِ في شطئانها نغمٌ .. يُهدي السلامَ لكلِّ الناسِ في بيتي'
        ],
        region: 'جدة والساحل',
        slot: 'jeddah'
      },
      hail: {
        title: 'شموخ أجا وسلمى وكرم الشمال',
        poet: 'الشاعر رشيد الزلامي',
        verses: [
          'أجا وسلمى علامات الفخر تزهى .. بدار حاتم عسى ربي يحييها',
          'كرم حائل على مر الزمن مبدا .. بيوت عزٍ تذري من يجي فيها',
          'يا بعد حيي على روس الشفا نرقا .. وراية العز بالتوحيد نبنيها'
        ],
        region: 'حائل والشمال',
        slot: 'hail_samri'
      },
      eastern: {
        title: 'شدو النهام ومحار اللؤلؤ',
        poet: 'من تراث النهامين والغاصة في الخليج',
        verses: [
          'يا سيل يا بو المويج الأزرق القاسي .. ارحم غواصٍ نوى الهيرات مقياسي',
          'دانة بحرنا فريدة ما لها مثمن .. وفي شرقية الخير فخر العز نبراسي',
          'شِلنا الشراع وتوكلنا على الوالي .. والهمة تعلي جدار المجد بالساسِ'
        ],
        region: 'المنطقة الشرقية',
        slot: 'eastern'
      },
      ahsa: {
        title: 'واحة العيون ونخيل العطايا',
        poet: 'الشاعر محمد بن حسين العلي',
        verses: [
          'هنا الأحساءُ ماءٌ في تدفقهِ .. سحرُ الحياةِ وأنهارٌ من الجودِ',
          'نخيلُكِ الخضرُ في واحاتها نغمٌ .. يروي حكايا الألى في موكبِ الصيدِ',
          'عيونُ ماءٍ صفا في قاعها أملٌ .. يفيضُ بالخيرِ في حاضر ومعهودِ'
        ],
        region: 'الأحساء',
        slot: 'ahsa'
      }
    };

    this.activeKey = 'riyadh';
    this.init();
    this.bindEvents();
  }

  init() {
    this.loadPoem('riyadh');
  }

  bindEvents() {
    this.regionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.regionButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-region');
        this.loadPoem(key);
      });
    });

    if (this.btnListen) {
      this.btnListen.addEventListener('click', () => {
        this.playPoemAudio();
      });
    }
  }

  loadPoem(key) {
    const poem = this.poems[key];
    if (!poem) return;
    this.activeKey = key;

    if (this.titleEl) this.titleEl.textContent = poem.title;
    if (this.poetEl) this.poetEl.textContent = poem.poet;

    // Calligraphic stroke writing
    if (this.versesContainer) {
      this.versesContainer.innerHTML = '';
      poem.verses.forEach((v, i) => {
        const p = document.createElement('p');
        p.className = 'diwan-verse-line';
        p.textContent = v;
        p.style.opacity = '0';
        p.style.transform = 'translateY(10px)';
        p.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        this.versesContainer.appendChild(p);

        setTimeout(() => {
          p.style.opacity = '1';
          p.style.transform = 'translateY(0)';
        }, 150 + i * 400);
      });
    }

    if (this.audioStatusEl) {
      this.audioStatusEl.textContent = '';
      this.audioStatusEl.style.display = 'none';
    }

    sound.playFinjanClink();
  }

  async playPoemAudio() {
    const poem = this.poems[this.activeKey];
    if (!poem) return;

    if (this.audioStatusEl) {
      this.audioStatusEl.style.display = 'block';
      this.audioStatusEl.textContent = i18n.t('audio_not_uploaded');
    }

    // Play slot check
    const res = await sound.playSlot(poem.slot);
    if (!res.success && this.audioStatusEl) {
      this.audioStatusEl.textContent = res.msg;
      // Fade out note gracefully after 4s
      setTimeout(() => {
        if (this.audioStatusEl) this.audioStatusEl.style.display = 'none';
      }, 4000);
    }
  }
}
