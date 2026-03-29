"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

type ConfettiBurstProps = {
  active: boolean;
};

const PIECES = ["🎉", "✨", "⭐", "🌟", "💫", "🎊"] as const;

export function ConfettiBurst({ active }: ConfettiBurstProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        emoji: PIECES[i % PIECES.length]!,
        x: (Math.random() - 0.5) * 200,
        y: -80 - Math.random() * 120,
        rot: Math.random() * 360,
        delay: Math.random() * 0.15,
      })),
    [active],
  );

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden
        >
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute text-3xl sm:text-4xl"
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: 0,
                rotate: p.rot,
              }}
              transition={{
                duration: 1.1,
                delay: p.delay,
                ease: "easeOut",
              }}
              role="img"
              aria-hidden
            >
              {p.emoji}
            </motion.span>
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
