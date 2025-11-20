import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import EmergencyMap from '../components/EmergencyMap';
import '../styles/SafetyPage.css';

const EMERGENCY_NUMBERS = [
    { service: 'الشرطة', number: '193' },
    { service: 'الإسعاف', number: '190' },
    { service: 'المطافئ', number: '195' },
    { service: 'الطوارئ العامة', number: '112' },
];

const SAFETY_TIPS = [
    { title: 'احتفظ بنسخ من الوثائق', description: 'صور جواز السفر والتأشيرة وتذاكر الطيران على هاتفك أو في السحابة.' },
    { title: 'شارك موقعك', description: 'استخدم تطبيقات مشاركة الموقع مع صديق أو فرد من العائلة موثوق به.' },
    { title: 'كن حذراً من الغرباء', description: 'تجنب قبول المشروبات أو الطعام من أشخاص لا تعرفهم.' },
    { title: 'تأمين الممتلكات', description: 'استخدم خزنة الفندق لحفظ الأشياء الثمينة ولا تتركها في الأماكن العامة.' },
];

const SafetyPage = () => {
    const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

    // محاكاة جلب موقع المستخدم
    useEffect(() => {
        // في التطبيق الحقيقي، ستستخدم navigator.geolocation
        // سنستخدم إحداثيات افتراضية لطرابلس، ليبيا
        setTimeout(() => {
            setUserLocation({ lat: 32.8872, lng: 13.5887 });
        }, 1000);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="safety-page">
            <Header />
            <div className="safety-header">
                <h1>🏥 الأمان والسلامة</h1>
                <p className="subtitle">معلومات الطوارئ ونصائح الأمان لرحلة آمنة</p>
            </div>

            <motion.div
                className="safety-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* قسم الخريطة (العمود الأول) */}
                <motion.div variants={itemVariants}>
                    <EmergencyMap userLocation={userLocation} />
                </motion.div>

                {/* قسم المعلومات (العمود الثاني) */}
                <motion.div variants={itemVariants} className="info-column">
                    {/* أرقام الطوارئ */}
                    <motion.div className="emergency-info" variants={itemVariants}>
                        <h2>أرقام الطوارئ المحلية</h2>
                        <ul className="emergency-numbers-list">
                            {EMERGENCY_NUMBERS.map((item) => (
                                <li key={item.service}>
                                    <span className="service">{item.service}</span>
                                    <a href={`tel:${item.number}`} className="number">{item.number}</a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* نصائح الأمان */}
                    <motion.div className="safety-tips" variants={itemVariants} style={{ marginTop: '30px' }}>
                        <h2>نصائح أمان أساسية</h2>
                        {SAFETY_TIPS.map((tip) => (
                            <motion.div key={tip.title} className="tip-item" variants={itemVariants}>
                                <h4>{tip.title}</h4>
                                <p>{tip.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SafetyPage;
