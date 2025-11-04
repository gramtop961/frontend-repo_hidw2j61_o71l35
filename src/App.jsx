import React from 'react';
import Hero from './components/Hero';
import FeatureGrid from './components/FeatureGrid';
import ScrollShowcase from './components/ScrollShowcase';
import Editor from './components/Editor';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Hero />
      <FeatureGrid />
      <ScrollShowcase />
      <Editor />
      <footer className="border-t border-white/5 bg-slate-950/60 py-12 text-center text-white/60">
        Built with love for science & design • Glassmorphic UI • 3D hero powered by Spline
      </footer>
    </div>
  );
}
