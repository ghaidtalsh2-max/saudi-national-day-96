/**
 * oneHome.js - تجربة "السعودية بيت واحد"
 * المشتركات الوجدانية العميقة في حياة السعوديين رغم اتساع الجغرافيا:
 * القهوة، الدلة، التمر، كرم المجلس، جمعة الأهل، وصباحات العيد.
 * لغة الناس العفوية بدلاً من السرد الموسوعي.
 */

import { sound } from './audioEngine.js';

export class OneHome {
  constructor() {
    this.quoteText = document.getElementById('majlis-quote-text');
    this.contextLabel = document.getElementById('majlis-context-label');
    this.tabs = document.querySelectorAll('.dialogue-tab');
    this.hotspots = document.querySelectorAll('.majlis-hotspot');

    this.narratives = {
      hospitality: {
        quote: '"يا هلا والله ومسهلا.. اقلطوا توّ ما نَوّر البيت، الفنجان باليمين، والقلوب أوسع من الدار."',
        context: 'آداب الضيافة وحفاوة الاستقبال الموروثة في كل بيت سعودي',
        soundAction: () => sound.playBrassDallahResonance()
      },
      eid: {
        quote: '"من العايدين الفايزين.. عساكم من عوّاده، ريحة العود تخالط دهن الورد، وضحكات الصغار تملى الممرات."',
        context: 'فجر الأعياد واجتماع الأسر من نجد للحجاز ومن الشرق للجنوب والشمال',
        soundAction: () => sound.playFinjanClink()
      },
      coffee: {
        quote: '"صب الفنجان ثلثه ولا تمليه، والهزة تكفي عن الكلام.. قهوتنا مهيلة وزعفرانها يسبق طاروقها."',
        context: 'سنع القهوة السعودية وأسرار تقدير الضيف ومهابته',
        soundAction: () => {
          sound.playBrassDallahResonance();
          setTimeout(() => sound.playFinjanClink(), 350);
        }
      },
      greetings: {
        quote: '"وش علومكم؟ عساكم بخير؟.. الله يحييكم ويبقيكم.. البيت بيتكم والدار أمان."',
        context: 'دفء الكلمات اليومية المتوارثة بين الأجيال',
        soundAction: () => sound.playFinjanClink()
      }
    };

    this.hotspotDetails = {
      dallah: {
        quote: '"الدلّة اللي ما تفارق نارها.. عنوان الكرم اللي ما يعرف حساب، فنجانها يقرّب البعيد ويداوي خاطر العاني."',
        context: 'الدلة السعودية.. رمز الجود وأول علامات الترحيب',
        soundAction: () => sound.playBrassDallahResonance()
      },
      dates: {
        quote: '"قدوع الضيف.. سكري القصيم، وخلاص الحسا، وصفري بيشة.. حلاوة أرض بارك الله بنخلها."',
        context: 'سفرة التمر.. بركة النخلة ورفيق الفنجان اليومي',
        soundAction: () => sound.playFinjanClink()
      },
      mabkhara: {
        quote: '"ما عقب العود قعود.. المبخرة تدور على الرؤوس إكراماً وطيباً، ريحةٍ ما تغيب عن ذاكرة الأعياد."',
        context: 'المبخرة وطيب العود.. هيبة المجالس وتكريم أهل البيت لزوارهم',
        soundAction: () => sound.playBrassDallahResonance()
      },
      gathering: {
        quote: '"جمعة العائلة الكبيرة حول الصينية، سوالف الشيبان وحكايا الأولين، هذا الدفء هو الوطن الصغير."',
        context: 'روح الأسرة السعودية.. بيت واحد وأصوات متآلفة',
        soundAction: () => sound.playFinjanClink()
      }
    };

    this.bindEvents();
  }

  bindEvents() {
    // Tabs switching
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const key = tab.getAttribute('data-content');
        if (this.narratives[key]) {
          this.displayNarrative(this.narratives[key]);
        }
      });
    });

    // Hotspot clicks directly on the majlis art
    this.hotspots.forEach(spot => {
      spot.addEventListener('click', () => {
        const topic = spot.getAttribute('data-topic');
        if (this.hotspotDetails[topic]) {
          this.displayNarrative(this.hotspotDetails[topic]);
        }
      });
    });
  }

  displayNarrative(data) {
    if (!this.quoteText || !this.contextLabel) return;

    this.quoteText.style.opacity = '0';
    this.quoteText.style.transform = 'translateY(8px)';

    setTimeout(() => {
      this.quoteText.textContent = data.quote;
      this.contextLabel.textContent = data.context;
      this.quoteText.style.opacity = '1';
      this.quoteText.style.transform = 'translateY(0)';
    }, 200);

    if (data.soundAction) {
      data.soundAction();
    }
  }
}
