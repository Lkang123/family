"use client";

import { motion } from "framer-motion";

interface Props {
  year: number;
}

export default function YearDivider({ year }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="relative flex justify-center mb-6 md:mb-8"
    >
      <div
        className="bg-warm-800 text-warm-50 px-5 py-1.5 md:px-6 md:py-2 rounded-full text-base md:text-lg font-bold shadow-md z-10"
        style={{ fontFamily: "var(--font-serif-sc)" }}
      >
        {year}
      </div>
    </motion.div>
  );
}
