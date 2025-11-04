import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Shapes, Type, Layout, Wand2, ImageDown, Link2, Layers } from 'lucide-react';

const features = [
  {
    icon: PenTool,
    title: 'Precise Annotations',
    desc: 'Add arrows, callouts, and labels that snap cleanly to elements.'
  },
  {
    icon: Shapes,
    title: 'Smart Shapes',
    desc: 'Rectangles, ellipses, pills, and connectors with glass styles.'
  },
  {
    icon: Type,
    title: 'Beautiful Typography',
    desc: 'Crisp, publication-ready text with fine control.'
  },
  {
    icon: Layout,
    title: 'Grid & Guides',
    desc: 'Align with subtle grids and snapping for clarity.'
  },
  {
    icon: Wand2,
    title: 'Glassmorphism',
    desc: 'Frosted surfaces, soft shadows, and neon edges.'
  },
  {
    icon: Layers,
    title: 'Layers',
    desc: 'Arrange, group, and reorder complex figures.'
  },
  {
    icon: Link2,
    title: 'Connectors',
    desc: 'Draw relationships with smooth, adjustable arrows.'
  },
  {
    icon: ImageDown,
    title: 'Export PNG/SVG',
    desc: 'One‑click export with transparent backgrounds.'
  }
];

export default function FeatureGrid() {
  return (
    <section id="features" className="relative w-full bg-slate-950 py-24 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_200px_at_50%_0%,rgba(56,189,248,0.12),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Designed for clear scientific storytelling</h2>
          <p className="mt-3 text-white/70">Everything you need to build elegant figures and graphical abstracts.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
              >
                <div className="mb-3 inline-flex rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-2 text-cyan-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-medium">{f.title}</h3>
                <p className="mt-1 text-sm text-white/70">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
