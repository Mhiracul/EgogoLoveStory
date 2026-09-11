import { motion } from "framer-motion";

export const FadeUp = ({ children, delay = 0, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{
      duration: 1.1,
      delay,
      ease: [0.16, 1, 0.3, 1],
    }}
  >
    {children}
  </motion.div>
);

export const FadeLeft = ({ children, delay = 0, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, x: -70 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{
      duration: 1.1,
      delay,
      ease: [0.16, 1, 0.3, 1],
    }}
  >
    {children}
  </motion.div>
);

export const FadeRight = ({ children, delay = 0, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, x: 70 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{
      duration: 1.1,
      delay,
      ease: [0.16, 1, 0.3, 1],
    }}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{
      duration: 1.2,
      delay,
      ease: [0.16, 1, 0.3, 1],
    }}
  >
    {children}
  </motion.div>
);
