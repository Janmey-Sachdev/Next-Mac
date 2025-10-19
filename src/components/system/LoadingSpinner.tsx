'use client';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  const circleVariants = {
    hidden: { scale: 0 },
    visible: (i: number) => ({
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    }),
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-white"
          variants={circleVariants}
          initial="hidden"
          animate="visible"
          custom={i}
        />
      ))}
    </div>
  );
};

export default LoadingSpinner;
