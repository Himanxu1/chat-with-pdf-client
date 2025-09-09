"use client";

import { motion } from "framer-motion";
import React from "react";

interface MotionWrapperProps {
  children: React.ReactNode;
}

export function MotionWrapper({ children }: MotionWrapperProps) {
  return (
    <motion.div
      key={Math.random()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className=" w-full bg-background p-4"
    >
      {children}
    </motion.div>
  );
}

