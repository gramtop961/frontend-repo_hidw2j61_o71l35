import React from 'react';
import { motion } from 'framer-motion';

export default function ScrollShowcase() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 py-24 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(800px_400px_at_20%_0%,rgba(14,165,233,.15),transparent),radial-gradient(800px_400px_at_80%_0%,rgba(59,130,246,.12),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="text-3xl font-semibold">Scroll‑triggered story flow</h2>
          <p className="mt-3 text-white/70">Sections reveal with soft motion as you explore the page.</p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="mb-4 h-48 w-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5" />
              <h3 className="text-lg font-medium">Elegant, guided visuals</h3>
              <p className="mt-1 text-white/70">
                Create clean panels and sequences that align perfectly with your narrative.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
