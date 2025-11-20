import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';
import { convertTo3D, getCenterPosition } from '../utils/gisUtils';

// 1. مكون يمثل نقطة اهتمام (POI) ثلاثية الأبعاد
const POI3D = ({ position, name, category, onClick, index }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // تأثير النبض عند التحويم
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y,
        hovered ? 1.5 : 1,
        0.1
      );
    }
  });

  // تحديد لون النقطة بناءً على الفئة
  const getColor = (cat) => {
    switch (cat) {
      case 'Archaeological': return '#8B4513'; // بني
      case 'Nature': return '#228B22'; // أخضر
      case 'Food': return '#FF6347'; // برتقالي
      case 'Accommodation': return '#4169E1'; // أزرق
      default: return '#2c7a9e';
    }
  };

  return (
    <motion.mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        setClicked(!clicked);
        onClick({ name, category, position });
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      // Framer Motion for initial appearance
      initial={{ y: position[1] + 5, opacity: 0 }}
      animate={{ y: position[1], opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, delay: index * 0.1 }}
    >
      <boxGeometry args={[0.5, 1, 0.5]} />
      <meshStandardMaterial color={getColor(category)} emissive={hovered ? getColor(category) : 'black'} emissiveIntensity={hovered ? 0.5 : 0} />
      
      {/* اسم النقطة يظهر عند النقر */}
      {clicked && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      )}
    </motion.mesh>
  );
};

// 2. المكون الرئيسي للخريطة ثلاثية الأبعاد
const Map3D = ({ pois, onPOISelect }) => {
  // إحداثيات مركز الخمس التقريبية
  const centerPosition = getCenterPosition();

  return (
    <Canvas
      camera={{ position: [centerPosition[0] + 10, 15, centerPosition[2] + 10], fov: 50 }}
      style={{ width: '100%', height: '600px', background: '#a8dadc' }}
    >
      {/* تحكم المستخدم في الكاميرا */}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      
      {/* إضاءة المشهد */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* خلفية النجوم */}
      <Stars />

      {/* سطح الأرض (الخريطة) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#4CAF50" /> {/* لون أخضر يمثل الأرض */}
      </mesh>

      {/* نقاط الاهتمام */}
      {pois.map((poi, index) => (
        <POI3D
          key={poi.id}
          position={convertTo3D(poi.latitude, poi.longitude)}
          name={poi.name}
          category={poi.category}
          onClick={onPOISelect}
          index={index}
        />
      ))}
    </Canvas>
  );
};

export default Map3D;
