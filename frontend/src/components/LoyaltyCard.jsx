// wajad/frontend/src/components/LoyaltyCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './LoyaltyCard.css'; // سنقوم بإنشاء هذا الملف لاحقًا

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, type: "spring", stiffness: 100 } },
  hover: { scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)" }
};

const LoyaltyCard = ({ totalPoints, username }) => {
  const level = totalPoints >= 500 ? 'ذهبي' : totalPoints >= 100 ? 'فضي' : 'برونزي';
  const nextLevelPoints = level === 'ذهبي' ? 'مكافأة دائمة' : level === 'فضي' ? 500 : 100;
  const progress = level === 'ذهبي' ? 100 : (totalPoints / nextLevelPoints) * 100;

  return (
    <motion.div
      className={`loyalty-card ${level.toLowerCase()}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="card-header">
        <h2 className="card-title">برنامج الولاء</h2>
        <span className="card-level">{level}</span>
      </div>
      <div className="card-body">
        <p className="card-username">مرحباً، {username || 'عضو واجد'}</p>
        <div className="points-display">
          <span className="points-value">{totalPoints}</span>
          <span className="points-label">نقطة ولاء</span>
        </div>
      </div>
      <div className="card-footer">
        <div className="progress-bar-container">
          <motion.div
            className="progress-bar"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5 }}
          ></motion.div>
        </div>
        <p className="next-level-info">
          {level !== 'ذهبي' ? `تبقى لك ${nextLevelPoints - totalPoints} نقطة للوصول إلى المستوى ${nextLevelPoints === 500 ? 'الذهبي' : 'الفضي'}` : 'أنت في أعلى مستوى!'}
        </p>
      </div>
    </motion.div>
  );
};

export default LoyaltyCard;
