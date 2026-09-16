/**
 * i18n.js - نظام الترجمة الثنائي المتكامل (العربية | English)
 * يدعم التبديل الفوري دون الحاجة لإعادة تحميل الصفحة
 * العربية هي اللغة الوجدانية والافتراضية، مع ترجمة دقيقة وكاملة للإنجليزية
 */

export const translations = {
  ar: {
    // Top Bar & Controls
    lang_btn: "English",
    sound_seal: "صدى الوطن",
    sound_mute: "كتم الصوت",
    sound_unmute: "تشغيل الصوت",
    sound_env_vol: "صوت البيئة",
    sound_music_vol: "صوت النغم والشعر",
    audio_not_uploaded: "الصوت لم يُرفع بعد (جاهز لملفات الصوت)",

    // Field Notebook Navigation
    nav_journey: "الرحلة",
    nav_cities: "المدن",
    nav_diwan: "ديواننا",
    nav_voices: "أصواتنا",
    nav_wordwall: "جدار الكلمات",
    nav_heritage: "موروثنا",
    nav_home: "بيت واحد",
    nav_paint: "ارسم سعوديتك",

    // Opening
    open_title_1: "اليوم الوطني السعودي",
    open_title_2: "٩٦",
    open_title_3: "رحلة في وطن",
    open_whisper: "نسيم الصحراء يفتح الدرب.. نخلة الشاهد تروي حكاية وطن",

    // Timeline & Palm Witness
    timeline_witness_title: "نخلة الشاهد الحي",
    timeline_witness_desc: "نخلةٌ ثابتة الجذور.. تتبدل القرون والأعوام من حولها، وتبقى شاهدةً على عزم الرجال وبناء المجد.",
    timeline_auto_playing: "الرحلة الزمنية تمضي تلقائياً..",
    timeline_pause: "إيقاف مؤقت",
    timeline_resume: "استئناف السفر",

    epoch_1727_title: "١٧٢٧ م — بداية الدولة السعودية الأولى",
    epoch_1727_desc: "من الدرعية.. عاصمة الطين الأولى والنخيل الراسخ، وضع الإمام محمد بن سعود لبنة الاستقرار ووحدة الصف.",
    
    epoch_1902_title: "١٩٠٢ م — استرداد الرياض",
    epoch_1902_desc: "قاد الملك عبد العزيز بن عبد الرحمن آل سعود ملحمة استرداد الرياض وحصن المصمك، إيذاناً بانطلاق مسيرة التوحيد الشامل.",
    
    epoch_1932_title: "١٩٣٢ م — توحيد المملكة العربية السعودية",
    epoch_1932_desc: "التأم شمل الوطن وارتفعت راية التوحيد الخضراء، وتوحدت أرجاء الجزيرة تحت اسم المملكة العربية السعودية.",
    
    epoch_dev_title: "البناء والتنمية — نهضة الوطن",
    epoch_dev_desc: "امتدت الطرق والكهرباء والتعليم والصحة والمطارات، وبدأت ملامح النهضة الكبرى في كل شبر من أرضنا.",

    tuwaiq_quote: "همة السعوديين مثل جبل طويق، ولن تنكسر إلا إذا انهد هذا الجبل وتساوى بالأرض.",
    saudi_2026: "السعودية — ٢٠٢٦",
    saudi_2026_desc: "٩٦ عاماً من السيادة والطموح.. حاضرٌ يعانق الفضاء وتقنيات المستقبل، متجذر في عراقة الماضي.",

    // Map & City Zoom
    map_title: "خريطة المملكة العربية السعودية",
    map_subtitle: "انقر على أي مدينة للسفر الفيزيائي المباشر إلى تضاريسها وأصواتها",
    btn_back_to_map: "⟵ العودة لخريطة الوطن",
    city_entering: "الكاميرا تغوص داخل تضاريس",

    // Cities
    city_riyadh: "الرياض",
    city_riyadh_badge: "نجد العذية وقلب الوطن",
    city_riyadh_quote: "«حنا هل العوجا مروية الهنادي.. وحماة الدار»",
    city_riyadh_art: "العرضة النجدية، السامري، وحداء الخيل",
    city_riyadh_env: "قلاع الطريف بالدرعية، أودية حنيفة، شموخ طويق، ونهضة الأبراج المعاصرة",
    city_riyadh_dialect: "«وش علومك؟ عساك طيب.. وسمّ بالرحمن، البيت بيتك»",

    city_jeddah: "جدة",
    city_jeddah_badge: "عروس البحر الأحمر وبوابة الحرمين",
    city_jeddah_quote: "«يا ريحانة الحجاز.. ونسيم البحر المضمّخ بالمسك»",
    city_jeddah_art: "الموروث الحجازي الساحلي، الدانات، والصهبة",
    city_jeddah_env: "رواشين البلد التاريخية، عبق أزقة الشام والمظلوم، والميناء التراثي",
    city_jeddah_dialect: "«يا سيدي منورنا والله.. كيف حالك وطيب إن شاء الله، على راسي»",

    city_makkah: "مكة المكرمة",
    city_makkah_badge: "مهبط الوحي وأشرف البقاع",
    city_makkah_quote: "«مهوى الأفئدة ومشرق النور الذي أضاء العالمين»",
    city_makkah_art: "الإنشاد والابتهالات الوجدانية والسكينة الروحانية",
    city_makkah_env: "جبال أجياد والنور، السكينة الإيمانية، والحرم الشريف",
    city_makkah_dialect: "«أهلاً ومرحباً بكم في البلد الحرام.. حياكم في رحاب أطهر البقاع»",

    city_madinah: "المدينة المنورة",
    city_madinah_badge: "طيبة الطيبة ومأرز الإيمان",
    city_madinah_quote: "«طيبة الحبيبة.. أرض السكينة والنخيل والوفاء»",
    city_madinah_art: "المدائح النبوية وشعر السكينة والتأمل",
    city_madinah_env: "جبل أحد، واحات العقيق، وبساتين النخيل وأريج النعناع المديني",
    city_madinah_dialect: "«أهلاً بأهلنا.. زارتنا البركة، طيبة نورت بقدومكم»",

    city_taif: "الطائف",
    city_taif_badge: "عروس المصايف ومدينة الورد",
    city_taif_quote: "«ضبابٌ يداعب قمم السروات.. ووردٌ ينثر شذاه في الأفق»",
    city_taif_art: "فن المجرور الطائفي الأصيل، والحدري",
    city_taif_env: "قمم الهدا والشفا، مزارع الورد الطائفي، والضباب البارد بين الصخور",
    city_taif_dialect: "«يا هلا والله.. مرحباً ألف في ديرة الغيم والورد»",

    city_yanbu: "ينبع",
    city_yanbu_badge: "ينبع البحر والنخل وشريان الساحل",
    city_yanbu_quote: "«نغم السمسمية ورائحة الشباك.. وأهازيج البحارة مع طلوع الفجر»",
    city_yanbu_art: "الفن الينبعاوي على أنغام السمسمية والمرواس، وأغاني البحر",
    city_yanbu_env: "ميناء ينبع التراثي، بيوت الحجر المنقبي، وأسواق الصيادين العتيقة",
    city_yanbu_dialect: "«يا هلا بالطيبين.. البحر خير، والموج صافي والقلوب بيضاء»",

    city_hail: "حائل",
    city_hail_badge: "ديار حاتم وأم الكرم الشامخة",
    city_hail_quote: "«يا بعد حيي وميتي.. دارٍ بها الكرم مضرب الأمثال»",
    city_hail_art: "السامري الحائلي، الهجيني، والعرضة الشمالية",
    city_hail_env: "جرانيت جبال أجا وسلمى، قفار التاريخية، ونفود حائل الفسيحة",
    city_hail_dialect: "«يا بعد حيي، اقلط حياك الله.. البيت بيتك والذبيحة لعيناك»",

    city_tabuk: "تبوك",
    city_tabuk_badge: "بوابة الشمال ومروج التاريخ العظيم",
    city_tabuk_quote: "«رمال حسمى الحمراء.. وواحات الديسة التي تسحر الألباب»",
    city_tabuk_art: "الدحية، الهجيني، وفنون البادية الشمالية الغربية",
    city_tabuk_env: "أعمدة جبال حسمى الصخرية، عيون وادي الديسة، ومزارع الزيتون",
    city_tabuk_dialect: "«مرحباً هلا والله.. نورتوا ديار الشمال وحيّاكم المولى»",

    city_qassim: "القصيم",
    city_qassim_badge: "واحة النماء وسلة الغذاء والتمر",
    city_qassim_quote: "«بريدة وعنيزة ورياض الخير.. سواني تصب العذب ونخلٌ يفيض»",
    city_qassim_art: "السامري القصيمي، العرضة، وأمثال الفلاحة النجدية",
    city_qassim_env: "واحات النخيل المليونية، أسواق التمور، وبيوت الطين التراثية",
    city_qassim_dialect: "«يا هلا والله وسهلين.. اقلطوا على السكري والقهوة، عساكم بخير»",

    city_eastern: "الخبر والشرقية",
    city_eastern_badge: "شاطئ الخليج وحاضنة الخير والطاقة",
    city_eastern_quote: "«دانة الخليج.. أصوات النهام وأمجاد الغوص على اللؤلؤ»",
    city_eastern_art: "فن الفجري، النهمة البحرية، والليوة",
    city_eastern_env: "شواطئ الخبر والدمام، مياه الخليج، وتاريخ الغوص على اللؤلؤ",
    city_eastern_dialect: "«حياكم الله يا الغاليين.. نورتوا الشرقية، بحرنا وقلبنا واحد»",

    city_ahsa: "الأحساء",
    city_ahsa_badge: "أكبر واحة نخيل في العالم والتراث الإنساني",
    city_ahsa_quote: "«واحة الماء والخضرة والعيون الجارية.. وأقدم حواضر التاريخ»",
    city_ahsa_art: "الأهازيج الحساوية، فن الليوة، وحداء الفلاحين",
    city_ahsa_env: "جبل القارة وكهوفه العجيبة، عيون الماء الرقراقة، وسوق القيصرية",
    city_ahsa_dialect: "«يا هلا وغلا بأهلنا.. اقلطوا على الخلاص ودهن العود، ديار الحسا دياركم»",

    // Diwanuna (ديواننا)
    diwan_title: "ديواننا",
    diwan_subtitle: "مجلس الأدب والشعر المنسوب في رحاب الوطن",
    diwan_select_region: "اختر جهة من جهات الوطن للاستماع لشعرها الموثق:",

    // Aswatuna (أصواتنا)
    voices_title: "أصواتنا",
    voices_subtitle: "كل وطنٍ له صوت.. وهذي أصواتنا",
    voices_shared_tab: "عبارات مشتركة بين كل السعوديين",
    voices_regional_tab: "عبارات مرتبطة بالمناطق",
    voices_personal_tab: "السعودية بالنسبة لي..",
    voices_listen_prompt: "استمع لصوت الإنسان قبل معرفة دياره",

    // User Contribution (وش تقولون عندكم؟)
    contrib_title: "وش تقولون عندكم؟",
    contrib_desc: "يمكن تكون كلمة بسيطة.. بس بالنسبة لك تحمل مكان كامل وذاكرة عائلة.",
    contrib_label_word: "الكلمة أو العبارة",
    contrib_label_meaning: "معناها",
    contrib_label_region: "من أي منطقة أو مدينة؟",
    contrib_label_context: "متى تقولونها؟ (السياق)",
    contrib_record_btn: "سجّل صوتك وأنت تقولها (اختياري)",
    contrib_submit_btn: "انثر كلمتك في جدار الوطن",
    contrib_badge_visitor: "مشاركة من زائر",
    contrib_success: "خُطّت عبارتك بحبر الوطن وأضيفت لجدار الكلمات!",

    // Living Word Wall (جدار الكلمات)
    wordwall_title: "جدار الكلمات",
    wordwall_subtitle: "جدار حي يجمع كلمات وعبارات أهل الوطن وضيوفه",
    filter_all: "الكل",

    // Bayt Wahid (السعودية بيت واحد)
    home_title: "السعودية بيت واحد",
    home_subtitle: "بيتٌ واحد.. وأصواتٌ كثيرة",
    home_quote: "«الدار داركم، والقهوة مهيلة، والقلوب متآلفة من الشمال للجنوب ومن الشرق للغرب»",

    // Ersem Saudiytak (ارسم سعوديتك)
    paint_title: "ارسم سعوديتك",
    paint_subtitle: "ريشة وماء ووجدان",
    paint_question: "كيف ترى السعودية؟",
    paint_placeholder: "مثال: صحراء واسعة، نخيل، مدينة حديثة، خيل، عائلة تجتمع حول القهوة، وجبال بعيدة...",
    paint_btn: "حوّلها إلى لوحة",
    paint_phase_1: "نجمع كلماتك...",
    paint_phase_2: "نرسم المكان وتضاريس الوطن...",
    paint_phase_3: "نضيف تفاصيل الحبر والصبغات المائية...",
    paint_phase_done: "هذه سعوديتك.",
    paint_btn_repaint: "إعادة الرسم",
    paint_btn_modify: "تعديل الوصف",
    paint_btn_share: "مشاركة اللوحة",

    // Mawruthuna (موروثنا)
    heritage_title: "موروثنا",
    heritage_subtitle: "حبر وذاكرة.. كل قطعة تروي تاريخاً",

    // Collective Memory & Climax
    climax_p1: "من كلمة… إلى حكاية.",
    climax_p2: "ومن حكاياتٍ كثيرة… وطنٌ واحد.",
    climax_p3: "٩٦ عامًا من المجد والبناء.",
    climax_p4: "وهذه الحكاية... ما زالت تُكتب.",
    climax_final: "هذه سعوديتنا.",
    btn_restart: "إعادة معايشة الرحلة"
  },

  en: {
    // Top Bar & Controls
    lang_btn: "العربية",
    sound_seal: "Echo of Homeland",
    sound_mute: "Mute Audio",
    sound_unmute: "Play Audio",
    sound_env_vol: "Environment Volume",
    sound_music_vol: "Music & Poetry Volume",
    audio_not_uploaded: "Audio not uploaded yet (slot ready for files)",

    // Field Notebook Navigation
    nav_journey: "Journey",
    nav_cities: "Cities",
    nav_diwan: "Diwan",
    nav_voices: "Voices",
    nav_wordwall: "Word Wall",
    nav_heritage: "Heritage",
    nav_home: "One Home",
    nav_paint: "Paint Your Saudi",

    // Opening
    open_title_1: "Saudi National Day",
    open_title_2: "96",
    open_title_3: "A Journey in a Homeland",
    open_whisper: "Desert winds open the path.. The witness palm tree narrates a nation's story",

    // Timeline & Palm Witness
    timeline_witness_title: "The Living Witness Palm",
    timeline_witness_desc: "A palm rooted deep in the earth.. As centuries and generations transform around it, it remains a silent witness to resolve and glory.",
    timeline_auto_playing: "The timeline journeys automatically..",
    timeline_pause: "Pause Journey",
    timeline_resume: "Resume Journey",

    epoch_1727_title: "1727 AD — Foundation of the First Saudi State",
    epoch_1727_desc: "From Diriyah.. the first mudbrick capital and steadfast palm groves, Imam Muhammad bin Saud laid the foundation of unity and stability.",
    
    epoch_1902_title: "1902 AD — Recovery of Riyadh",
    epoch_1902_desc: "King Abdulaziz bin Abdulrahman led the historic recovery of Riyadh and Masmak Fortress, marking the dawn of the unification epic.",
    
    epoch_1932_title: "1932 AD — Unification of the Kingdom of Saudi Arabia",
    epoch_1932_desc: "The homeland was unified under the green banner of monotheism, joining all provinces under the name of the Kingdom of Saudi Arabia.",
    
    epoch_dev_title: "Development & Renaissance",
    epoch_dev_desc: "Roads, electricity, schools, hospitals, and modern communications flourished, transforming every corner of our land.",

    tuwaiq_quote: "The determination of Saudis is like Jabal Tuwaiq; it shall never break unless this mountain collapses and levels with the earth.",
    saudi_2026: "Saudi Arabia — 2026",
    saudi_2026_desc: "96 years of sovereignty and ambition.. A present embracing space and future technologies, rooted in timeless heritage.",

    // Map & City Zoom
    map_title: "Map of the Kingdom of Saudi Arabia",
    map_subtitle: "Select any city to physically journey into its terrain, architecture, and sounds",
    btn_back_to_map: "⟵ Back to Homeland Map",
    city_entering: "Entering the realm of",

    // Cities
    city_riyadh: "Riyadh",
    city_riyadh_badge: "Najd Al-Adhiyah & The Heart of the Nation",
    city_riyadh_quote: "«We are the people of Al-Awja, wielders of swords, protectors of the land»",
    city_riyadh_art: "Najdi Ardah, Samri, and Horse Chants",
    city_riyadh_env: "At-Turaif Fortress in Diriyah, Wadi Hanifa, Jabal Tuwaiq, and modern skyscrapers",
    city_riyadh_dialect: "«How are you doing? Be welcomed in the name of God; our home is yours»",

    city_jeddah: "Jeddah",
    city_jeddah_badge: "Bride of the Red Sea & Gateway to the Holy Mosques",
    city_jeddah_quote: "«O basil of the Hijaz.. and breeze of the sea scented with musk»",
    city_jeddah_art: "Hijazi Coastal Heritage, Danat, and Sahba",
    city_jeddah_env: "Historic Al-Balad wooden Rawasheen, ancient alleyways, and heritage harbor",
    city_jeddah_dialect: "«You have brought light to us.. May you always be in good health and grace»",

    city_makkah: "Makkah Al-Mukarramah",
    city_makkah_badge: "Cradle of Revelation & The Holiest Sanctuary",
    city_makkah_quote: "«The beacon of hearts and the rising light that illuminated the worlds»",
    city_makkah_art: "Sacred Chants, Spiritual Serenades, and Divine Peace",
    city_makkah_env: "Mountains of Ajyad and Noor, spiritual tranquility, and the Holy Sanctuary",
    city_makkah_dialect: "«Welcome to the Sacred City.. Welcome to the purest sanctuary on earth»",

    city_madinah: "Al-Madinah Al-Munawwarah",
    city_madinah_badge: "Taibah Al-Taiba & Sanctuary of Faith",
    city_madinah_quote: "«Beloved Taibah.. land of serenity, palms, and timeless loyalty»",
    city_madinah_art: "Prophetic Praises and Poems of Peaceful Contemplation",
    city_madinah_env: "Mount Uhud, Wadi Al-Aqeeq, palm orchards, and the scent of Madini mint",
    city_madinah_dialect: "«Welcome to our family.. Your arrival brings blessed light to Taibah»",

    city_taif: "Taif",
    city_taif_badge: "City of Roses & Mountain Sanctuary",
    city_taif_quote: "«Mist gently kissing the peaks of Sarawat.. and roses perfuming the horizon»",
    city_taif_art: "Authentic Taif Al-Majroor and Hadri rhythmic folklore",
    city_taif_env: "Peaks of Al-Hada and Ash-Shafa, fragrant rose farms, and cool mountain fog",
    city_taif_dialect: "«A thousand welcomes to the land of clouds, roses, and mountain air»",

    city_yanbu: "Yanbu",
    city_yanbu_badge: "Yanbu of the Sea, Palms, and Coastal Lifeline",
    city_yanbu_quote: "«The melody of Simsimiyya, fishing nets, and seafarer chants at dawn»",
    city_yanbu_art: "Al-Yanbawi folklore on Simsimiyya and Mirwas drums, seafarer chants",
    city_yanbu_env: "Historic Yanbu port, coral stone architecture, and traditional fish markets",
    city_yanbu_dialect: "«Welcome to kind souls.. The sea is generous, waves clear, and hearts pure»",

    city_hail: "Hail",
    city_hail_badge: "Land of Hatim and Towering Generosity",
    city_hail_quote: "«O dearest to my soul.. a land whose hospitality is an eternal proverb»",
    city_hail_art: "Haili Samri, Hujeini, and Northern Ardah",
    city_hail_env: "Granite ridges of Aja and Salma, historic Qifar, and vast golden dunes",
    city_hail_dialect: "«Dearest of souls, step in.. The house is yours and honor is for you»",

    city_tabuk: "Tabuk",
    city_tabuk_badge: "Gateway to the North & Cradle of Ancient Epics",
    city_tabuk_quote: "«Red sandstone pillars of Hisma.. and breathtaking oases of Al-Disah»",
    city_tabuk_art: "Dahhah, Hujeini, and Northwestern nomadic arts",
    city_tabuk_env: "Sculpted sandstone towers of Hisma, natural springs of Wadi Al-Disah, olive groves",
    city_tabuk_dialect: "«Welcome and peace.. You have brought light to the Northern lands»",

    city_qassim: "Qassim",
    city_qassim_badge: "Oasis of Growth, Date Harvest, and Abundance",
    city_qassim_quote: "«Buraidah and Unaizah.. sweet flowing sawani springs and boundless palm trees»",
    city_qassim_art: "Qassimi Samri, Ardah, and Najdi farming proverbs",
    city_qassim_env: "Millions of date palms, world date souqs, and mudbrick heritage villages",
    city_qassim_dialect: "«Warm welcomes.. Come partake in Sukari dates and cardamom coffee»",

    city_eastern: "Al-Khobar & Eastern Province",
    city_eastern_badge: "Gulf Coast & Cradle of Energy and Heritage",
    city_eastern_quote: "«Pearl of the Arabian Gulf.. chants of the Nahham and diving epics»",
    city_eastern_art: "Fijiri, maritime Nahmah, and Liwa folklore",
    city_eastern_env: "Shores of Al-Khobar and Dammam, Gulf waters, and pearl diving history",
    city_eastern_dialect: "«Welcome, beloved guests.. Our sea and hearts are one»",

    city_ahsa: "Al-Ahsa",
    city_ahsa_badge: "World's Largest Palm Oasis & World Heritage",
    city_ahsa_quote: "«Oasis of water, lush canopy, and natural springs.. oldest haven of history»",
    city_ahsa_art: "Ahsawi folk chants, Liwa, and farmer harvest songs",
    city_ahsa_env: "Jabal Al-Qarah caves, flowing springs like Ain Um Sab'ah, and Qaisariyah Souq",
    city_ahsa_dialect: "«Welcome warmly.. Savor Khalas dates and oud scent; our oasis is your home»",

    // Diwanuna
    diwan_title: "Diwanuna",
    diwan_subtitle: "Gathering of Attributed Saudi Poetry Across Regions",
    diwan_select_region: "Select a province to listen to and explore its authenticated verse:",

    // Aswatuna
    voices_title: "Aswatuna (Our Voices)",
    voices_subtitle: "Every homeland has a voice.. and these are ours",
    voices_shared_tab: "Expressions Shared Across All Saudis",
    voices_regional_tab: "Region-Specific Expressions",
    voices_personal_tab: "Saudi Arabia to Me Is..",
    voices_listen_prompt: "Listen to the human greeting before discovering their province",

    // User Contribution
    contrib_title: "What Do You Say Where You Are From?",
    contrib_desc: "It might be a simple word.. but to you, it holds an entire place and family memory.",
    contrib_label_word: "The Word or Expression",
    contrib_label_meaning: "Its Meaning",
    contrib_label_region: "From Which Region or City?",
    contrib_label_context: "When Is It Said? (Context)",
    contrib_record_btn: "Record your voice saying it (Optional)",
    contrib_submit_btn: "Inscribe your word on the Living Wall",
    contrib_badge_visitor: "Visitor Contribution",
    contrib_success: "Your phrase was penned in ink and woven into the Living Word Wall!",

    // Living Word Wall
    wordwall_title: "The Living Word Wall",
    wordwall_subtitle: "A floating canvas gathering expressions of Saudis and visitors alike",
    filter_all: "All",

    // Bayt Wahid
    home_title: "Saudi Arabia: One Home",
    home_subtitle: "One Home.. Many Voices",
    home_quote: "«Our home is your home, the coffee is brewed, and hearts are united from North to South and East to West»",

    // Ersem Saudiytak
    paint_title: "Paint Your Saudi",
    paint_subtitle: "Brush, Water, and Soul",
    paint_question: "How do you see Saudi Arabia?",
    paint_placeholder: "e.g.: Vast golden desert, palms, modern city, Arabian horse, family gathered around coffee, distant mountains...",
    paint_btn: "Transform into a Painting",
    paint_phase_1: "Gathering your words...",
    paint_phase_2: "Sketching terrain and horizon...",
    paint_phase_3: "Infusing watercolor pigments and ink...",
    paint_phase_done: "This is your Saudi Arabia.",
    paint_btn_repaint: "Regenerate",
    paint_btn_modify: "Edit Description",
    paint_btn_share: "Share Painting",

    // Mawruthuna
    heritage_title: "Mawruthuna (Our Heritage)",
    heritage_subtitle: "Ink & Memory.. Each relic narrates living history",

    // Collective Memory & Climax
    climax_p1: "From a single word… to a story.",
    climax_p2: "And from countless stories… One Nation.",
    climax_p3: "96 years of sovereignty and glory.",
    climax_p4: "And this story... is still being written.",
    climax_final: "This is our Saudi Arabia.",
    btn_restart: "Relive the Journey"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = 'ar';
    this.listeners = [];
  }

  t(key) {
    const dict = translations[this.currentLang] || translations.ar;
    return dict[key] || translations.ar[key] || key;
  }

  getLang() {
    return this.currentLang;
  }

  setLanguage(lang) {
    if (lang !== 'ar' && lang !== 'en') return;
    this.currentLang = lang;

    // Update document direction and language attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Notify listeners
    this.listeners.forEach(fn => fn(lang));
  }

  toggleLanguage() {
    const nextLang = this.currentLang === 'ar' ? 'en' : 'ar';
    this.setLanguage(nextLang);
    return nextLang;
  }

  onLanguageChange(fn) {
    this.listeners.push(fn);
  }
}

export const i18n = new I18nManager();
