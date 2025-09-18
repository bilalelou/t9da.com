'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
    Users, 
    Package, 
    Award, 
    LifeBuoy, 
    CheckCircle, 
    Heart, 
    Zap, 
    DollarSign, 
    Shield, 
    Zap as InnovationIcon,
    Linkedin,
    Twitter,
    Mail
} from 'lucide-react';

// Define interfaces
interface TeamMember {
  id: string;
  name: string;
  position: string;
  description: string;
  image: string;
  social: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

interface Statistic {
  id: string;
  value: number;
  label: string;
  icon: React.ReactNode;
}

interface Value {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Data Section
//==============================================
const teamMembers: TeamMember[] = [
    {
        id: '1',
        name: 'أحمد محمد العلي',
        position: 'المدير التنفيذي',
        description: 'خبرة أكثر من 15 عاماً في مجال التجارة الإلكترونية وإدارة الأعمال.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
        social: { linkedin: '#', twitter: '#', email: 'ahmed@mystore.com' }
    },
    {
        id: '2',
        name: 'فاطمة سالم النجار',
        position: 'مديرة التسويق',
        description: 'متخصصة في التسويق الرقمي واستراتيجيات النمو للمتاجر الإلكترونية.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
        social: { linkedin: '#', twitter: '#', email: 'fatima@mystore.com' }
    },
    {
        id: '3',
        name: 'خالد عبدالله الشمري',
        position: 'مدير التقنية',
        description: 'مطور خبير في تقنيات الويب الحديثة وأنظمة التجارة الإلكترونية.',
        image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
        social: { linkedin: '#', twitter: '#', email: 'khalid@mystore.com' }
    },
    {
        id: '4',
        name: 'نورا أحمد الزهراني',
        position: 'مديرة خدمة العملاء',
        description: 'متخصصة في تجربة العملاء وضمان أعلى مستويات الرضا والخدمة.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
        social: { linkedin: '#', twitter: '#', email: 'nora@mystore.com' }
    }
];

const statistics: Statistic[] = [
  { id: '1', value: 50000, label: 'عميل راضٍ', icon: <Users className="w-8 h-8" /> },
  { id: '2', value: 100000, label: 'منتج متنوع', icon: <Package className="w-8 h-8" /> },
  { id: '3', value: 5, label: 'سنوات خبرة', icon: <Award className="w-8 h-8" /> },
  { id: '4', value: 24, label: 'دعم العملاء', icon: <LifeBuoy className="w-8 h-8" /> }
];

const values: Value[] = [
  { id: '1', title: 'الجودة العالية', description: 'نحرص على تقديم منتجات عالية الجودة من أفضل العلامات التجارية العالمية والمحلية.', icon: <CheckCircle /> },
  { id: '2', title: 'خدمة عملاء متميزة', description: 'فريق دعم متخصص متاح على مدار الساعة لضمان رضا عملائنا.', icon: <Heart /> },
  { id: '3', title: 'الشحن السريع', description: 'نوفر خدمات شحن متنوعة وسريعة لضمان وصول طلباتكم في الوقت المحدد.', icon: <Zap /> },
  { id: '4', title: 'الأسعار التنافسية', description: 'نقدم أفضل الأسعار في السوق مع عروض وخصومات مستمرة.', icon: <DollarSign /> },
  { id: '5', title: 'الأمان والثقة', description: 'نضمن أمان معلوماتكم بأحدث تقنيات الحماية.', icon: <Shield /> },
  { id: '6', title: 'الابتكار المستمر', description: 'نسعى دائماً لتطوير خدماتنا وتحسين تجربة التسوق لتواكب أحدث التطورات.', icon: <InnovationIcon /> }
];
//==============================================


// Helper Components
//==============================================
const Counter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      const start = 0;
      const end = value;
      if (start === end) return;

      const duration = 2000;
      let startTime: number | null = null;
      
      const animateCount = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = timestamp - startTime;
          const newCount = Math.min(Math.floor((progress / duration) * end), end);
          setCount(newCount);
          if (newCount < end) {
              requestAnimationFrame(animateCount);
          }
      };

      requestAnimationFrame(animateCount);
    }
  }, [inView, value]);

  return <span ref={ref}>{count.toLocaleString('ar-EG')}</span>;
};

const Section = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.section
    className={`py-16 sm:py-24 ${className}`}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6 }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
  </motion.section>
);

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-center mb-16">
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{title}</h2>
    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
  </div>
);
//==============================================


// Main Page Component
//==============================================
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            من نحن
          </motion.h1>
          <motion.p 
            className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            رحلتنا في عالم التجارة الإلكترونية: شغف بالجودة، التزام بالابتكار، وهدفنا رضاكم.
          </motion.p>
        </div>
      </header>

      {/* Company Story */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">قصتنا: من فكرة إلى وجهة تسوق</h2>
            <p>بدأت رحلتنا في عام 2019 برؤية واضحة: تقديم تجربة تسوق إلكتروني استثنائية للعملاء في المملكة العربية السعودية ومنطقة الخليج.</p>
            <p>انطلقنا من فكرة بسيطة وهي توفير منصة موثوقة وسهلة الاستخدام تجمع أفضل المنتجات من مختلف الفئات، مع ضمان الجودة والأسعار التنافسية.</p>
            <p>اليوم، نفخر بخدمة آلاف العملاء الراضين، ونقدم تشكيلة واسعة من المنتجات من أفضل العلامات التجارية المحلية والعالمية.</p>
          </div>
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
              <Image src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" alt="قصة الشركة" layout="fill" className="object-cover" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-indigo-600 rounded-full flex items-center justify-center shadow-xl transform rotate-12">
              <Zap className="w-12 h-12 text-white" />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Statistics */}
      <Section className="bg-white">
        <SectionHeader title="إنجازاتنا بالأرقام" subtitle="أرقام تعكس ثقة عملائنا ونجاحنا في تقديم خدمة متميزة." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statistics.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-blue-600 transform transition-transform duration-300 hover:scale-110">
                {stat.icon}
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                <Counter value={stat.value} />
                {stat.id !== '4' && '+'}
                {stat.id === '4' && '/7'}
              </div>
              <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {[{ title: "رسالتنا", text: "نسعى لتقديم تجربة تسوق إلكتروني استثنائية من خلال توفير منتجات عالية الجودة بأسعار تنافسية، مع خدمة عملاء متميزة وتوصيل سريع وآمن." },
           { title: "رؤيتنا", text: "أن نصبح المنصة الرائدة للتجارة الإلكترونية في المنطقة، ونكون الوجهة المفضلة للعملاء الباحثين عن الجودة والثقة والابتكار." }]
          .map(item => (
            <motion.div key={item.title} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-700 leading-relaxed text-lg">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Company Values */}
      <Section className="bg-white">
        <SectionHeader title="قيمنا ومبادئنا" subtitle="المبادئ التي نؤمن بها وتوجه عملنا اليومي لخدمة عملائنا." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div 
              key={value.id} 
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5 text-blue-600">{value.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-700 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Team Section */}
      <Section>
        <SectionHeader title="فريق العمل" subtitle="تعرف على الفريق المتميز الذي يعمل بشغف لتقديم أفضل خدمة ممكنة." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-56">
                <Image src={member.image} alt={member.name} layout="fill" className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-indigo-600 font-semibold mb-3">{member.position}</p>
                <div className="flex justify-center space-x-3 space-x-reverse mt-4">
                  <a href={member.social.linkedin} className="text-gray-400 hover:text-indigo-600 transition-colors"><Linkedin /></a>
                  <a href={member.social.twitter} className="text-gray-400 hover:text-indigo-600 transition-colors"><Twitter /></a>
                  <a href={`mailto:${member.social.email}`} className="text-gray-400 hover:text-indigo-600 transition-colors"><Mail /></a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">جاهز لتجربة تسوق لا مثيل لها؟</h2>
          <p className="text-xl text-blue-100 mb-8">انضم إلى عائلة عملائنا السعداء واكتشف عالماً من الجودة والتوفير.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/products" className="block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-colors">
                اكتشف منتجاتنا
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/contact" className="block border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
                تواصل معنا
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
