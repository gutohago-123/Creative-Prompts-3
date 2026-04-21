import { motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';

export default function GuideDetailsPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const isArabic = language === 'ar';

  const guideData: any = {
    'prompt-writing-basics': {
      title: isArabic ? 'أساسيات كتابة البرومبت' : 'Prompt Writing Basics',
      content: (
        <div className="space-y-6">
          <p>{isArabic ? 'كتابة البرومبت هي فن وعلم في آن واحد. للحصول على أفضل النتائج، اتبع هذه القواعد:' : 'Prompt writing is both an art and a science. To get the best results, follow these rules:'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? '1. حدد الموضوع بوضوح' : '1. Define the Subject Clearly'}</h3>
          <p>{isArabic ? 'ابدأ بوصف مباشر لما تريد رؤيته. بدلاً من "صورة لقطة"، استخدم "قطة شيرازية بيضاء تجلس على أريكة مخملية".' : 'Start with a direct description of what you want to see. Instead of "a cat", use "a white Persian cat sitting on a velvet sofa".'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? '2. أضف التفاصيل الفنية' : '2. Add Technical Details'}</h3>
          <p>{isArabic ? 'حدد نوع الإضاءة، زاوية الكاميرا، ونوع العدسة. أمثلة: "إضاءة ناعمة"، "زاوية منخفضة"، "عدسة 85mm".' : 'Specify lighting type, camera angle, and lens type. Examples: "soft lighting", "low angle", "85mm lens".'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? '3. اختر الأسلوب الفني' : '3. Choose Artistic Style'}</h3>
          <p>{isArabic ? 'هل تريد الصورة واقعية؟ كرتونية؟ زيتية؟ حدد الأسلوب في نهاية البرومبت.' : 'Do you want the image to be realistic? Cartoonish? Oil painting? Specify the style at the end of the prompt.'}</p>
        </div>
      )
    },
    'pro-tips': {
      title: isArabic ? 'نصائح للمحترفين' : 'Pro Tips',
      content: (
        <div className="space-y-6">
          <p>{isArabic ? 'للانتقال من مستوى المبتدئين إلى المحترفين، استخدم هذه التقنيات المتقدمة:' : 'To move from beginner to pro, use these advanced techniques:'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? 'استخدام الأوزان (Weights)' : 'Using Weights'}</h3>
          <p>{isArabic ? 'في بعض المولدات، يمكنك إعطاء أهمية أكبر لكلمة معينة باستخدام الأقواس، مثل (كلمة:1.5).' : 'In some generators, you can give more importance to a specific word using parentheses, like (word:1.5).'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? 'الكلمات السلبية (Negative Prompts)' : 'Negative Prompts'}</h3>
          <p>{isArabic ? 'حدد ما لا تريد رؤيته في الصورة، مثل "مشوه"، "أصابع إضافية"، "نص".' : 'Specify what you don\'t want to see in the image, such as "deformed", "extra fingers", "text".'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? 'التكرار المتعمد' : 'Intentional Repetition'}</h3>
          <p>{isArabic ? 'تكرار الكلمات المهمة يعزز من حضورها في النتيجة النهائية.' : 'Repeating important words reinforces their presence in the final result.'}</p>
        </div>
      )
    },
    'using-generator': {
      title: isArabic ? 'استخدام المولد بفعالية' : 'Using the Generator Effectively',
      content: (
        <div className="space-y-6">
          <p>{isArabic ? 'لتحقيق أقصى استفادة من أداة التوليد، اتبع الخطوات التالية:' : 'To get the most out of the generator tool, follow these steps:'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? '1. تجربة الإعدادات' : '1. Experiment with Settings'}</h3>
          <p>{isArabic ? 'لا تكتفِ بالإعدادات الافتراضية. جرب تغيير نسبة العرض إلى الارتفاع (Aspect Ratio) لتناسب احتياجاتك.' : 'Don\'t just stick to default settings. Try changing the aspect ratio to suit your needs.'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? '2. التكرار والتحسين' : '2. Iteration and Refinement'}</h3>
          <p>{isArabic ? 'نادراً ما تحصل على النتيجة المثالية من المحاولة الأولى. قم بتعديل البرومبت بناءً على النتائج السابقة.' : 'You rarely get the perfect result on the first try. Refine the prompt based on previous results.'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? '3. حفظ النتائج' : '3. Saving Results'}</h3>
          <p>{isArabic ? 'قم بحفظ النتائج التي تعجبك فوراً، لأن المولد قد لا يعطيك نفس النتيجة تماماً في المرة القادمة.' : 'Save the results you like immediately, as the generator might not give you the exact same result next time.'}</p>
        </div>
      )
    },
    'usage-rights': {
      title: isArabic ? 'حقوق الاستخدام والخصوصية' : 'Usage Rights & Privacy',
      content: (
        <div className="space-y-6">
          <p>{isArabic ? 'فهم حقوقك أمر بالغ الأهمية عند استخدام الذكاء الاصطناعي:' : 'Understanding your rights is crucial when using AI:'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? 'ملكية الصور' : 'Image Ownership'}</h3>
          <p>{isArabic ? 'جميع الصور التي تولدها عبر منصتنا هي ملكك بالكامل. يمكنك استخدامها في أي مشروع.' : 'All images you generate through our platform are fully yours. You can use them in any project.'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? 'الاستخدام التجاري' : 'Commercial Use'}</h3>
          <p>{isArabic ? 'نعم، يمكنك استخدام الصور لأغراض تجارية (مثل الإعلانات، الكتب، المواقع) دون الحاجة لذكر المصدر.' : 'Yes, you can use the images for commercial purposes (like ads, books, websites) without needing to credit the source.'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? 'الخصوصية' : 'Privacy'}</h3>
          <p>{isArabic ? 'نحن لا نستخدم صورك المولدة في تدريب نماذجنا دون إذنك، ونحترم خصوصية بياناتك.' : 'We do not use your generated images to train our models without your permission, and we respect your data privacy.'}</p>
        </div>
      )
    },
    'image-styles': {
      title: isArabic ? 'فهم أنماط الصور' : 'Understanding Image Styles',
      content: (
        <div className="space-y-6">
          <p>{isArabic ? 'النمط هو ما يحدد "روح" الصورة. إليك أشهر الأنماط:' : 'The style is what defines the "soul" of the image. Here are the most popular styles:'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? 'النمط الواقعي (Photorealistic)' : 'Photorealistic Style'}</h3>
          <p>{isArabic ? 'يهدف لمحاكاة الواقع بدقة عالية، مع تفاصيل دقيقة وإضاءة طبيعية.' : 'Aims to simulate reality with high precision, detailed textures, and natural lighting.'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? 'النمط الفني (Artistic/Oil Painting)' : 'Artistic Style'}</h3>
          <p>{isArabic ? 'يستخدم ضربات فرشاة واضحة وألوان غنية لمحاكاة اللوحات الفنية الكلاسيكية.' : 'Uses clear brushstrokes and rich colors to simulate classic art paintings.'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? 'النمط الكرتوني (Cartoon/Anime)' : 'Cartoon/Anime Style'}</h3>
          <p>{isArabic ? 'يتميز بخطوط واضحة، ألوان زاهية، وتفاصيل مبسطة.' : 'Features clear lines, vibrant colors, and simplified details.'}</p>
        </div>
      )
    },
    'advanced-search': {
      title: isArabic ? 'البحث المتقدم في المعرض' : 'Advanced Gallery Search',
      content: (
        <div className="space-y-6">
          <p>{isArabic ? 'كيف تجد البرومبت المثالي بسرعة؟' : 'How to find the perfect prompt quickly?'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? 'استخدام الفلاتر' : 'Using Filters'}</h3>
          <p>{isArabic ? 'استخدم الفلاتر المتاحة في المعرض لتضييق نطاق البحث حسب الفئة أو النمط.' : 'Use the filters available in the gallery to narrow down your search by category or style.'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? 'الكلمات الدلالية' : 'Keywords'}</h3>
          <p>{isArabic ? 'البحث بالكلمات الدلالية (مثل "إضاءة"، "بورتريه"، "طبيعة") يعطيك نتائج أكثر دقة.' : 'Searching by keywords (like "lighting", "portrait", "nature") gives you more accurate results.'}</p>
          <h3 className="text-xl font-bold text-white">{isArabic ? 'حفظ البرومبتات' : 'Saving Prompts'}</h3>
          <p>{isArabic ? 'عندما تجد برومبت يعجبك، احفظه في مفضلتك للعودة إليه لاحقاً وتعديله.' : 'When you find a prompt you like, save it to your favorites to return to it later and edit it.'}</p>
        </div>
      )
    }
  };

  const guide = guideData[id as string];

  if (!guide) {
    return <div className="min-h-screen flex items-center justify-center text-white">Guide not found</div>;
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/guides')}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className={cn("w-4 h-4 mr-2", isArabic && "rotate-180 ml-2 mr-0")} />
            {isArabic ? 'العودة للأدلة' : 'Back to Guides'}
          </Button>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-10 rounded-[2rem] backdrop-blur-sm"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-8">{guide.title}</h1>
          <div className="text-lg text-white/70 leading-relaxed">
            {guide.content}
          </div>
        </motion.article>
      </div>
    </main>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
