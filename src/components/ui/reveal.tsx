'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView, Variant, Variants } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | number;

interface RevealProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  duration?: number;
  delay?: number;
  amount?: number;
  once?: boolean;
  ease?: string;
  opacity?: [number, number];
  scale?: [number, number];
  x?: Direction;
  y?: Direction;
  rotate?: [number, number];
  custom?: any;
  variants?: Variants;
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, scale: 1, x: 0, y: 0, rotate: 0 },
  visible: { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 },
};

const getDirectionValue = (direction: Direction): number => {
  if (typeof direction === 'number') return direction;
  switch (direction) {
    case 'up':
    case 'left':
      return 50;
    case 'down':
    case 'right':
      return -50;
    default:
      return 0;
  }
};

export const Reveal: React.FC<RevealProps> = ({
  children,
  id,
  className,
  duration = 0.5,
  delay = 0,
  amount = 0,
  once = true,
  ease = 'easeOut',
  opacity = [0, 1],
  scale = [1, 1],
  x,
  y,
  rotate = [0, 0],
  custom,
  variants = defaultVariants,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount, once });
  const controls = useAnimation();

  const defaultHidden: Variant = {
    opacity: opacity[0],
    scale: scale[0],
    x: x ? getDirectionValue(x) : 0,
    y: y ? getDirectionValue(y) : 0,
    rotate: rotate[0],
  };

  const defaultVisible: Variant = {
    opacity: opacity[1],
    scale: scale[1],
    x: 0,
    y: 0,
    rotate: rotate[1],
  };

  const finalVariants = variants || {
    hidden: defaultHidden,
    visible: defaultVisible,
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  return (
    <motion.div
      id={id}
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={finalVariants}
      transition={{ duration, delay, ease }}
      custom={custom}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
