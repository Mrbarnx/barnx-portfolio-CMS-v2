'use client';

import { motion, useReducedMotion } from 'framer-motion';

type RevealProps = { children: React.ReactNode; className?: string; delay?: number; id?: string };

export function MotionReveal({ children, className, delay = 0, id }: RevealProps) {
  const reduced = useReducedMotion();
  return <motion.div id={id} className={className} initial={reduced ? false : { opacity: 0, y: 38, filter: 'blur(8px)' }} whileInView={reduced ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: .14 }} transition={{ duration: .78, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function MotionSection({ children, className, delay = 0, id }: RevealProps) {
  const reduced = useReducedMotion();
  return <motion.section id={id} className={className} initial={reduced ? false : { opacity: 0, y: 44 }} whileInView={reduced ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .82, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.section>;
}

export function PageMotion({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return <motion.div className="pageMotion" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -8 }} transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
