import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface IPadding {
  paddingTop?: number | null;
  paddingRight?: number | null;
  paddingBottom?: number | null;
  paddingLeft?: number | null;
}

interface ICollapseProps {
  isOpen: boolean;
  children: React.ReactNode;
  duration?: number;
  ease?: 'easeInOut' | 'easeIn' | 'easeOut' | 'linear';
  padding?: IPadding | null;
}

const paddingDefault: IPadding = {
  paddingTop: 16,
  paddingRight: 24,
  paddingBottom: 16,
  paddingLeft: 24,
};

const Collapse: React.FC<ICollapseProps> = ({ isOpen, children, duration = 0.35, ease = 'easeInOut', padding = {} }) => {
  const [paddings, setPaddings] = useState<IPadding | null>(paddingDefault);
  const { paddingTop, paddingRight, paddingBottom, paddingLeft } = paddings || {};

  useEffect(() => {
    setPaddings(() => ({ ...paddingDefault, ...padding }));
  }, [padding, isOpen]);

  return (
    <motion.div
      initial={false}
      animate={{
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
        scale: isOpen ? 1 : 0.95,
        paddingLeft: isOpen ? `${paddingLeft ?? 0}px` : '0',
        paddingRight: isOpen ? `${paddingRight ?? 0}px` : '0',
        paddingTop: isOpen ? `${paddingTop ?? 0}px` : '0',
        paddingBottom: isOpen ? `${paddingBottom ?? 0}px` : '0',
      }}
      style={{ overflow: 'hidden' }}
      className="bg-secondary block"
      transition={{
        duration,
        ease,
      }}
    >
      {children}
    </motion.div>
  );
};

export default Collapse;
