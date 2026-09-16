/**
 * wordWall.js - تجربة "وش تقولون عندكم؟" وجدار الكلمات الحي
 * تفاعل حقيقي يتيح للزوار مشاركة تعابيرهم ولهجاتهم مع المعنى والمنطقة والسياق،
 * مع وسوم أمان واضحة ("مشاركة من زائر / Visitor Contribution") لمنع الخلط بالتوثيق الرسمي.
 */

import { sound } from './audioEngine.js';
import { i18n } from './i18n.js';

export class WordWallManager {
  constructor() {
    this.form = document.getElementById('contrib-form');
    this.inputWord = document.getElementById('contrib-word');
    this.inputMeaning = document.getElementById('contrib-meaning');
    this.selectRegion = document.getElementById('contrib-region');
    this.inputContext = document.getElementById('contrib-context');
    this.btnRecord = document.getElementById('btn-contrib-record');
    this.btnSubmit = document.getElementById('btn-contrib-submit');
    this.statusEl = document.getElementById('contrib-status');

    this.wallGrid = document.getElementById('living-word-wall-grid');
    this.filterButtons = document.querySelectorAll('.wall-filter-btn');

    this.activeFilter = 'all';
    this.recordedBlob = null;
    this.isRecording = false;

    // Base collection of shared and authentic regional expressions
    this.expressions = [
      {
        word: 'حياكم الله',
        meaning: 'دعاء بالحياة والترحيب الحار بقدوم الضيف',
        region: 'shared',
        regionName: 'مشترك بين كل السعوديين',
        context: 'أول ما يدخل الضيف المجلس أو البيت',
        isVisitor: false
      },
      {
        word: 'أبشر بسعدك',
        meaning: 'تعهد قاطع بإنجاز الطلب وإدخال السرور على السائل',
        region: 'shared',
        regionName: 'مشترك بين كل السعوديين',
        context: 'عندما يطلب شخص منك عوناً أو حاجة',
        isVisitor: false
      },
      {
        word: 'سمّ طال عمرك',
        meaning: 'إجابة مهذبة تعني الاستجابة الفورية والتقدير',
        region: 'shared',
        regionName: 'مشترك بين كل السعوديين',
        context: 'عند مناداة الوالدين أو الضيوف أو كبار القدر',
        isVisitor: false
      },
      {
        word: 'وش علومك؟',
        meaning: 'سؤال ودي وافٍ عن الصحة والأحوال والأخبار',
        region: 'riyadh',
        regionName: 'الرياض ونجد',
        context: 'في مستهل اللقاء والسلام بعد غيبة',
        isVisitor: false
      },
      {
        word: 'يا بعد حيي',
        meaning: 'تعبير وجداني عظيم عن المحبة، معناه: يا بعد كل حي من أهلي',
        region: 'hail',
        regionName: 'حائل',
        context: 'في الترحيب الحار وإكرام القادم وإظهار المودة',
        isVisitor: false
      },
      {
        word: 'أرحبوا تراحيب المطر',
        meaning: 'ترحيب بهيج يشبه إقبال الضيف ببركة الغيث والخصب',
        region: 'asir',
        regionName: 'عسير والجنوب',
        context: 'عند استقبال الوفود والزوار في المناسبات',
        isVisitor: false
      },
      {
        word: 'يا سيدي على راسي',
        meaning: 'تقدير عالي واستعداد فوري لخدمة السائل بمحبة',
        region: 'jeddah',
        regionName: 'جدة ومكة والحجاز',
        context: 'عند التخاطب بين الأحبة وخدمة القاصد',
        isVisitor: false
      },
      {
        word: 'عيوني لك',
        meaning: 'بذل أعز ما يملك الإنسان إكراماً للخاطر',
        region: 'shared',
        regionName: 'مشترك بين كل السعوديين',
        context: 'عند الرد على من يسألك معروفاً عزيزاً',
        isVisitor: false
      },
      {
        word: 'حي الله من جانا',
        meaning: 'استبشار بقدوم الزائر وسرور بمحضره',
        region: 'eastern',
        regionName: 'الشرقية والأحساء',
        context: 'أول ما يطرق الزائر الباب أو يخطو في الدار',
        isVisitor: false
      }
    ];

    this.loadSavedExpressions();
    this.renderWall();
    this.bindEvents();
  }

  loadSavedExpressions() {
    try {
      const saved = localStorage.getItem('saudi96_wordwall_contribs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          this.expressions = [...parsed, ...this.expressions];
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  saveVisitorContribution(item) {
    try {
      const saved = JSON.parse(localStorage.getItem('saudi96_wordwall_contribs') || '[]');
      saved.unshift(item);
      localStorage.setItem('saudi96_wordwall_contribs', JSON.stringify(saved));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  bindEvents() {
    // Form submit
    if (this.btnSubmit) {
      this.btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleContributionSubmit();
      });
    }

    // Voice record button
    if (this.btnRecord) {
      this.btnRecord.addEventListener('click', () => {
        this.toggleRecording();
      });
    }

    // Filter tabs
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.getAttribute('data-filter') || 'all';
        this.renderWall();
      });
    });
  }

  async toggleRecording() {
    if (!this.isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];
        this.mediaRecorder.ondataavailable = e => this.audioChunks.push(e.data);
        this.mediaRecorder.onstop = () => {
          this.recordedBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          if (this.btnRecord) this.btnRecord.textContent = '✓ تم تسجيل نبرتك الصوتية';
        };
        this.mediaRecorder.start();
        this.isRecording = true;
        if (this.btnRecord) this.btnRecord.textContent = '⏹ جاري التسجيل.. اضغط للإيقاف';
      } catch {
        if (this.btnRecord) this.btnRecord.textContent = 'الميكروفون غير متاح (يمكنك المشاركة كتابياً)';
      }
    } else {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
      this.isRecording = false;
    }
  }

  handleContributionSubmit() {
    const word = this.inputWord ? this.inputWord.value.trim() : '';
    const meaning = this.inputMeaning ? this.inputMeaning.value.trim() : '';
    const regionVal = this.selectRegion ? this.selectRegion.value : 'shared';
    const regionText = this.selectRegion ? this.selectRegion.options[this.selectRegion.selectedIndex].text : '';
    const context = this.inputContext ? this.inputContext.value.trim() : '';

    if (!word) {
      if (this.statusEl) this.statusEl.textContent = 'يرجى كتابة الكلمة أو العبارة للمشاركة';
      return;
    }

    const newContrib = {
      word,
      meaning: meaning || 'تعبير وجداني شاركه أحد زوار الوطن',
      region: regionVal,
      regionName: regionText,
      context: context || 'تعبير متوارث في المجالس والأسر',
      isVisitor: true,
      hasAudio: !!this.recordedBlob,
      timestamp: Date.now()
    };

    this.expressions.unshift(newContrib);
    this.saveVisitorContribution(newContrib);
    this.renderWall();

    // Success feedback
    sound.playFinjanClink();
    sound.playBrassDallahResonance();

    if (this.statusEl) {
      this.statusEl.textContent = i18n.t('contrib_success');
      this.statusEl.style.display = 'block';
    }

    // Reset inputs
    if (this.inputWord) this.inputWord.value = '';
    if (this.inputMeaning) this.inputMeaning.value = '';
    if (this.inputContext) this.inputContext.value = '';
    if (this.btnRecord) this.btnRecord.textContent = i18n.t('contrib_record_btn');
    this.recordedBlob = null;
  }

  renderWall() {
    if (!this.wallGrid) return;
    this.wallGrid.innerHTML = '';

    const filtered = this.expressions.filter(item => {
      if (this.activeFilter === 'all') return true;
      if (this.activeFilter === 'shared') return item.region === 'shared';
      return item.region === this.activeFilter;
    });

    filtered.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = `wall-word-item ${item.isVisitor ? 'visitor-item' : 'heritage-item'}`;
      card.style.animationDelay = `${idx * 0.06}s`;

      const safetyBadge = item.isVisitor 
        ? `<span class="badge-visitor">${i18n.t('contrib_badge_visitor')}</span>` 
        : `<span class="badge-heritage">موروث موثق</span>`;

      card.innerHTML = `
        <div class="word-card-top">
          <h4 class="card-phrase">${item.word}</h4>
          ${safetyBadge}
        </div>
        <div class="card-meaning">${item.meaning}</div>
        <div class="card-meta">
          <span class="meta-region">📍 ${item.regionName}</span>
          ${item.context ? `<span class="meta-context">⏳ ${item.context}</span>` : ''}
        </div>
      `;

      card.addEventListener('click', () => {
        sound.playFinjanClink();
      });

      this.wallGrid.appendChild(card);
    });
  }
}
