import { motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import { Lock, Eye, Database, Share2 } from 'lucide-react';

export default function PrivacyPage() {
  const { t, language } = useLanguage();

  const sections = [
    {
      icon: <Eye className="w-6 h-6 text-primary" />,
      title: language === 'ar' ? '1. المعلومات التي نجمعها' : '1. Information We Collect',
      content: language === 'ar' 
        ? 'نحن نجمع المعلومات التي تقدمها لنا مباشرة، مثل اسمك وعنوان بريدك الإلكتروني عند إنشاء حساب. كما نجمع تلقائياً بعض بيانات الاستخدام مثل عنوان IP ونوع المتصفح.'
        : 'We collect information you provide directly to us, such as your name and email address when you create an account. We also automatically collect certain usage data like your IP address and browser type.'
    },
    {
      icon: <Database className="w-6 h-6 text-purple-400" />,
      title: language === 'ar' ? '2. كيف نستخدم معلوماتك' : '2. How We Use Your Information',
      content: language === 'ar'
        ? 'نستخدم معلوماتك لتقديم خدماتنا وتحسينها، وتخصيص تجربتك، والتواصل معك بشأن التحديثات والعروض، وضمان أمان منصتنا.'
        : 'We use your information to provide and improve our services, personalize your experience, communicate with you about updates and offers, and ensure the security of our platform.'
    },
    {
      icon: <Share2 className="w-6 h-6 text-blue-400" />,
      title: language === 'ar' ? '3. مشاركة البيانات' : '3. Data Sharing',
      content: language === 'ar'
        ? 'نحن لا نبيع بياناتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك مع مزودي الخدمات الموثوقين الذين يساعدوننا في تشغيل منصتنا، وذلك بموجب اتفاقيات سرية صارمة.'
        : 'We do not sell your personal data to third parties. We may share your information with trusted service providers who help us operate our platform, under strict confidentiality agreements.'
    },
    {
      icon: <Lock className="w-6 h-6 text-amber-400" />,
      title: language === 'ar' ? '4. أمن البيانات' : '4. Data Security',
      content: language === 'ar'
        ? 'نتخذ إجراءات أمنية متقدمة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الإفشاء. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت آمنة بنسبة 100٪.'
        : 'We implement advanced security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure.'
    }
  ];

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
            {t('privacyTitle')}
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            {t('privacySubtitle')}
          </p>
          <div className="mt-8 text-sm text-white/40">
            {language === 'ar' ? 'آخر تحديث: 12 أبريل 2026' : 'Last updated: April 12, 2026'}
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              </div>
              <p className="text-white/70 leading-relaxed text-lg">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
