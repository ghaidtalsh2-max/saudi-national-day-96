/**
 * motifs.js - رموز الوطن وموروث الأصالة المستوحاة من الرسم اليدوي
 * مقتبسة من لوحة الرموز الثقافية السعودية (الروشان، باب الدرعية، عازف الدف، سلة الورد، المبخرة، أبراج كافد، برج الخبر، النخلة، السيفان...)
 */

import { sound } from './audioEngine.js';

export const SAUDI_MOTIFS = [
  {
    id: 'palm',
    titleAr: 'النخلة الباسقة',
    titleEn: 'The Enduring Palm',
    regionAr: 'في كل شبر من أرض الوطن',
    descAr: 'رمز الجود والبقاء، والشاهد الحي على مسيرة ثلاثة قرون من التأسيس إلى الحاضر.',
    tag: 'شعار وهوية',
    icon: '🌴'
  },
  {
    id: 'rawshan',
    titleAr: 'الروشان الحجازي',
    titleEn: 'Hijazi Rawshan',
    regionAr: 'جدة التاريخية والبلد',
    descAr: 'تحفة الخشب المنقوش التي تزين واجهات بيوت جدة العتيقة وتسمح بمرور نسيم البحر.',
    tag: 'عمارة تراثية',
    icon: '🪟'
  },
  {
    id: 'diriyah_door',
    titleAr: 'باب الدرعية النجدي',
    titleEn: 'Najdi Diriyah Gate',
    regionAr: 'الدرعية والرياض',
    descAr: 'الأبواب الخشبية المحفورة بزخارف هندسية ومثلثات نجدية، تحكي قصة الصمود والكرم.',
    tag: 'عمارة وتاريخ',
    icon: '🚪'
  },
  {
    id: 'daff_player',
    titleAr: 'عازف الدف والمرواس',
    titleEn: 'The Daff & Mirwas Drummer',
    regionAr: 'العرضة النجدية والمجرور والسامري',
    descAr: 'نبض الإيقاع في احتفالات الوطن وأهازيج الفخر والفروسية.',
    tag: 'فنون وإيقاعات',
    icon: '🥁'
  },
  {
    id: 'taif_roses',
    titleAr: 'سلة ورد الطائف',
    titleEn: 'Taif Rose Basket',
    regionAr: 'جبال الهدا والشفا — الطائف',
    descAr: 'الورد الجوري الطائفي النفيس الذي يُقطف مع الفجر ويُعطر كسوة الكعبة المشرفة ومجالس الكرام.',
    tag: 'طبيعة وموروث',
    icon: '🧺'
  },
  {
    id: 'falcon_tower',
    titleAr: 'الصقر وبرج المراقبة',
    titleEn: 'The Falcon & Watchtower',
    regionAr: 'نجد والشمال',
    descAr: 'رمز العزة والشموخ وبراعة الصيد في الصحراء على قمة أبراج الطين التاريخية.',
    tag: 'فروسية وأصالة',
    icon: '🦅'
  },
  {
    id: 'mabkhara',
    titleAr: 'المبخرة النجدية',
    titleEn: 'Traditional Mabkhara',
    regionAr: 'كافة أرجاء المملكة',
    descAr: 'تفوح برائحة دهن العود والبخور الأصيل، عنوان إكرام الضيف في كل مجلس سعودي.',
    tag: 'ضيافة وكرم',
    icon: '🏺'
  },
  {
    id: 'qatt_asiri',
    titleAr: 'نقوش القط العسيري',
    titleEn: 'Al-Qatt Al-Asiri Art',
    regionAr: 'عسير وجبال السروات',
    descAr: 'فن زخرفي نسائي عريق مسجل في اليونسكو، يتميز بألوانه الطبيعية المبهجة وأشكاله الهندسية.',
    tag: 'فنون عالمية',
    icon: '🎨'
  },
  {
    id: 'khobar_tower',
    titleAr: 'برج مياه الخبر',
    titleEn: 'Al-Khobar Water Tower',
    regionAr: 'المنطقة الشرقية',
    descAr: 'أيقونة المعمار على كورنيش الخبر وعين على مياه الخليج العربي والنهضة المبكرة.',
    tag: 'معالم حديثة',
    icon: '🗼'
  },
  {
    id: 'kafd_skylines',
    titleAr: 'أبراج كافد والمملكة',
    titleEn: 'KAFD & Kingdom Tower',
    regionAr: 'العاصمة الرياض',
    descAr: 'منارات التقنية والمال والأعمال، تترجم طموح رؤية السعودية وعنان السماء في ٢٠٢٦.',
    tag: 'المستقبل والريادة',
    icon: '🏙️'
  },
  {
    id: 'tea_kettle',
    titleAr: 'إبريق الشاي على الجمر',
    titleEn: 'Desert Tea Kettle',
    regionAr: 'حائل والبادية والمجالس',
    descAr: 'رفيق السمر وشبت النار في ليالي الصحراء، وشاي الخَدَر المفعم بروح الألفة.',
    tag: 'مجالس وسمر',
    icon: '🫖'
  },
  {
    id: 'camel_stamp',
    titleAr: 'طابع الجمل التذكاري',
    titleEn: 'Saudi Camel Postage Stamp',
    regionAr: 'البريد والذاكرة السعودية',
    descAr: 'طابع البريد العريق بفئاته الكلاسيكية حاملاً سفينة الصحراء كرمز للاتصال والرحلات.',
    tag: 'ذاكرة ووثائق',
    icon: '💌'
  }
];

export class MotifsManager {
  constructor() {
    this.container = document.getElementById('motifs-gallery-grid');
    this.modalEl = document.getElementById('motif-detail-modal');
    this.init();
  }

  init() {
    this.renderMotifsGrid();
  }

  renderMotifsGrid() {
    if (!this.container) return;
    this.container.innerHTML = '';

    SAUDI_MOTIFS.forEach(motif => {
      const item = document.createElement('div');
      item.className = 'motif-card-clean';
      item.setAttribute('data-id', motif.id);

      item.innerHTML = `
        <div class="motif-card-icon">${motif.icon}</div>
        <div class="motif-card-info">
          <span class="motif-tag">${motif.tag}</span>
          <h4 class="motif-name">${motif.titleAr}</h4>
          <p class="motif-region">${motif.regionAr}</p>
        </div>
      `;

      item.addEventListener('click', () => {
        this.openMotif(motif);
      });

      this.container.appendChild(item);
    });
  }

  openMotif(motif) {
    sound.playFinjanClink();
    const detailTitle = document.getElementById('motif-modal-title');
    const detailTag = document.getElementById('motif-modal-tag');
    const detailRegion = document.getElementById('motif-modal-region');
    const detailDesc = document.getElementById('motif-modal-desc');
    const detailIcon = document.getElementById('motif-modal-icon');

    if (detailTitle) detailTitle.textContent = motif.titleAr;
    if (detailTag) detailTag.textContent = motif.tag;
    if (detailRegion) detailRegion.textContent = motif.regionAr;
    if (detailDesc) detailDesc.textContent = motif.descAr;
    if (detailIcon) detailIcon.textContent = motif.icon;

    if (this.modalEl) {
      this.modalEl.style.display = 'flex';
    }
  }

  closeModal() {
    if (this.modalEl) {
      this.modalEl.style.display = 'none';
    }
  }
}
