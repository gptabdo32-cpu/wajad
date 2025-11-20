// wajad/frontend/src/components/EmergencyMap.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// يفترض أن لديك مكتبة خرائط (مثل Leaflet أو Google Maps) مثبتة
// سنستخدم هنا مكون وهمي (Placeholder) مع منطق جلب البيانات

const EmergencyMap = ({ userLocation }) => {
    const [emergencyPois, setEmergencyPois] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEmergencyPois = async () => {
        setIsLoading(true);
        setError('');
        
        if (!userLocation.lat || !userLocation.lng) {
            setError('تعذر تحديد موقعك لعرض خدمات الطوارئ القريبة.');
            setIsLoading(false);
            return;
        }

        const queryParams = new URLSearchParams({
            lat: userLocation.lat,
            lng: userLocation.lng,
            radius: 5, // 5 كم
        }).toString();

        try {
            const response = await fetch(`/api/v1/poi/emergency?${queryParams}`);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'فشل جلب مواقع الطوارئ.');
            }

            setEmergencyPois(data.data);
        } catch (err) {
            setError('فشل تحميل بيانات الطوارئ: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmergencyPois();
    }, [userLocation.lat, userLocation.lng]);

    return (
        <motion.div
            className="emergency-map-container"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {/* هنا سيتم دمج مكون الخريطة الفعلي (مثلاً Leaflet MapContainer) */}
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e9ecef' }}>
                {isLoading && <p>جاري تحديد موقعك وجلب خدمات الطوارئ...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!isLoading && !error && (
                    <>
                        <p style={{ fontWeight: 'bold' }}>📍 مواقع الطوارئ القريبة:</p>
                        {emergencyPois.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'right' }}>
                                {emergencyPois.map(poi => (
                                    <li key={poi.id}>{poi.name} ({poi.distance.toFixed(2)} كم)</li>
                                ))}
                            </ul>
                        ) : (
                            <p>لا توجد خدمات طوارئ قريبة في نطاق 5 كم.</p>
                        )}
                        <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>* هنا سيتم عرض الخريطة التفاعلية فعلياً.</p>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default EmergencyMap;
