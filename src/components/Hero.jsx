import React from 'react';
import Spline from '@splinetool/react-spline';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Subtle gradient/blur overlay that doesn't block 3D interaction */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-6 pt-28 pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-teal-300" />
          <span className="text-sm text-white/80">Glassmorphic 3D editor for science visuals</span>
        </div>

        <h1 className="max-w-4xl bg-gradient-to-br from-white to-white/70 bg-clip-text text-5xl font-semibold leading-tight text-transparent sm:text-6xl">
          Create stunning article figures & graphical abstracts
        </h1>

        <p className="max-w-2xl text-lg text-white/70">
          Design with precision using a modern, minimalist canvas. Drag, connect, annotate, and export high‑quality visuals.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#editor"
            className="group inline-flex items-center gap-2 rounded-xl border border-teal-300/30 bg-teal-400/10 px-6 py-3 text-teal-200 shadow-[0_0_0_1px_rgba(45,212,191,0.15)] transition hover:bg-teal-400/20 backdrop-blur-xl"
          >
            Start Designing
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-white/90 transition hover:bg-white/10 backdrop-blur-xl"
          >
            Explore Features
          </a>
        </div>
      </div>
    </section>
  );
}
