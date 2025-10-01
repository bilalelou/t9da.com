"use client";

import React from 'react';
import { Star, Users, Trophy, Shield, Heart, Zap, Globe, Award, CheckCircle, Target, Rocket } from 'lucide-react';

export default function AboutPage() {
    const stats = [
        { number: "50K+", label: "عميل سعيد", icon: <Users size={24} /> },
        { number: "10K+", label: "منتج متنوع", icon: <Trophy size={24} /> },
        { number: "99%", label: "رضا العملاء", icon: <Star size={24} /> },
        { number: "24/7", label: "دعم فني", icon: <Shield size={24} /> }
    ];

    const values = [
        {
            icon: <Heart size={28} />,
            title: "الجودة أولاً",
            description: "نختار منتجاتنا بعناية فائقة لضمان أعلى معايير الجودة"
        },
        {
            icon: <Shield size={28} />,
            title: "الثقة والأمان",
            description: "حماية تامة لبياناتك ومعاملاتك المالية مع ضمان الخصوصية"
        },
        {
            icon: <Zap size={28} />,
            title: "سرعة التوصيل",
            description: "توصيل سريع وآمن لجميع أنحاء المغرب في أقل وقت ممكن"
        },
        {
            icon: <Globe size={28} />,
            title: "تنوع المنتجات",
            description: "مجموعة واسعة من المنتجات عالية الجودة من أفضل الماركات"
        }
    ];

    const team = [
        {
            name: "أحمد المرابطي",
            role: "المؤسس والرئيس التنفيذي",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            description: "خبرة أكثر من 15 عاماً في مجال التجارة الإلكترونية"
        },
        {
            name: "فاطمة الزهراء",
            role: "مديرة العمليات",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            description: "متخصصة في إدارة سلسلة التوريد وخدمة العملاء"
        },
        {
            name: "يوسف بن علي",
            role: "مدير التقنية",
            image: "https://randomuser.me/api/portraits/men/46.jpg",
            description: "مهندس برمجيات مع خبرة في تطوير المنصات الرقمية"
        },
        {
            name: "مريم الإدريسي",
            role: "مديرة التسويق",
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            description: "خبيرة في التسويق الرقمي ووسائل التواصل الاجتماعي"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-50 to-white py-20 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Content */}
                        <div className="text-center lg:text-right">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-8">
                                <Award size={40} className="text-white" />
                            </div>
                            
                            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                من نحن؟
                            </h1>
                            
                            <p className="text-xl text-gray-600 leading-relaxed mb-8">
                                نحن أكثر من مجرد متجر إلكتروني، نحن شركاؤكم في تجربة تسوق استثنائية
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
                                    تسوق الآن
                                </button>
                                <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300">
                                    تواصل معنا
                                </button>
                            </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <div className="grid grid-cols-2 gap-6">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3 text-blue-600">
                                            {stat.icon}
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                                        <div className="text-sm text-gray-600">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                                قصتنا
                            </span>
                            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                                رحلة النجاح
                            </h2>
                            
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Rocket size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">البداية (2018)</h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                بدأت رحلتنا بحلم بسيط: إنشاء منصة تسوق إلكترونية تجمع بين الجودة والثقة والراحة.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Target size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">اليوم</h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                أصبحنا واحداً من أكثر المنصات الإلكترونية ثقة في المغرب، نخدم أكثر من 50,000 عميل سعيد.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-blue-50 p-6 rounded-xl mt-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-2">
                                        {[1,2,3,4].map((i) => (
                                            <div key={i} className="w-10 h-10 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-semibold">
                                                {i}
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">+50,000 عميل سعيد</p>
                                        <p className="text-sm text-gray-600">ينضم إلينا يومياً المئات من العملاء الجدد</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="relative">
                            <div className="bg-white p-4 rounded-2xl shadow-xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop" 
                                    alt="فريق العمل" 
                                    className="w-full h-80 object-cover rounded-xl"
                                />
                                
                                <div className="absolute -top-3 -right-3 bg-blue-600 text-white p-3 rounded-xl shadow-lg">
                                    <div className="text-center">
                                        <div className="text-lg font-bold">🏆</div>
                                        <div className="text-xs font-semibold">الأفضل</div>
                                    </div>
                                </div>
                                
                                <div className="absolute -bottom-3 -left-3 bg-white p-3 rounded-xl shadow-lg">
                                    <div className="flex items-center gap-1">
                                        <Star size={16} className="text-yellow-500 fill-current" />
                                        <span className="text-sm font-bold text-gray-800">4.9</span>
                                    </div>
                                    <div className="text-xs text-gray-600">تقييم العملاء</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            قيمنا ومبادئنا
                        </span>
                        <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                            ما يميزنا
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            نؤمن بمجموعة من القيم الأساسية التي توجه كل ما نقوم به لخدمة عملائنا
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-gray-50 hover:bg-blue-50 p-8 rounded-2xl text-center transition-all duration-300 hover:shadow-lg group">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 group-hover:bg-blue-700 text-white rounded-xl mb-6 transition-colors duration-300">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            فريق العمل
                        </span>
                        <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                            أبطال النجاح
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            مجموعة من المتخصصين الشغوفين الذين يعملون بإبداع لجعل تجربتك استثنائية
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
                                <div className="relative mb-6">
                                    <img 
                                        src={member.image} 
                                        alt={member.name}
                                        className="w-24 h-24 object-cover rounded-full mx-auto border-4 border-blue-100 group-hover:border-blue-200 transition-colors duration-300"
                                    />
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                                        <CheckCircle size={14} className="text-white" />
                                    </div>
                                </div>
                                
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {member.name}
                                </h3>
                                <p className="text-blue-600 font-semibold mb-3 text-sm">
                                    {member.role}
                                </p>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {member.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-20 bg-blue-600 text-white">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <span className="inline-block bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            رسالتنا ورؤيتنا
                        </span>
                        <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                            هدفنا وأحلامنا
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Mission Card */}
                        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Target size={24} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">رسالتنا</h3>
                            </div>
                            <p className="text-blue-100 leading-relaxed text-lg">
                                توفير تجربة تسوق إلكترونية استثنائية تجمع بين الجودة والثقة والراحة، مع ضمان وصول أفضل المنتجات لكل بيت مغربي بأسعار منافسة
                            </p>
                        </div>

                        {/* Vision Card */}
                        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Rocket size={24} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">رؤيتنا</h3>
                            </div>
                            <p className="text-blue-100 leading-relaxed text-lg">
                                أن نكون المنصة الإلكترونية الأولى والأكثر ثقة في المغرب والمنطقة، ونقطة الانطلاق لكل من يبحث عن منتجات عالية الجودة
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
                    <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                        انضم إلى عائلة T9DA.COM
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        اكتشف تجربة تسوق فريدة مع آلاف المنتجات عالية الجودة وخدمة عملاء متميزة
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-300">
                            ابدأ التسوق الآن
                        </button>
                        <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300">
                            اشترك في النشرة الإخبارية
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}