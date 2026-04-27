import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Globe, Cpu } from 'lucide-react';

export default function About() {
  return (
    <div className="pb-40">
      <header className="pt-10 pb-16 border-b border-line mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-6">
          <span className="text-[12px] uppercase tracking-[0.3em] font-bold text-accent">Our Manifesto</span>
          <h1 className="text-7xl font-black uppercase tracking-tighter leading-none max-w-4xl">
            Redefining the <br/>Physics of Access.
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <section className="space-y-8">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted border-b border-line pb-4 inline-block">The Vision</h2>
            <p className="text-xl font-serif italic text-muted leading-relaxed">
              Eventix was forged in the intersection of high-fidelity design and decentralized infrastructure. 
              We believe that every ticket is more than just a barcode; it is a digital key to an experience, 
              a piece of verifiable history in the cultural ledger.
            </p>
            <p className="text-lg leading-relaxed">
              Our mission is to eliminate the friction between the host and the attendee. No bloated interfaces, 
              no deceptive fees, just pure, direct-to-consumer experience architecture.
            </p>
          </section>

          <section className="grid grid-cols-2 gap-10 pt-10 border-t border-line">
            <div className="space-y-4">
              <div className="w-10 h-10 border border-line flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest">Protocol Security</h3>
              <p className="text-[10px] uppercase font-bold text-muted leading-relaxed tracking-widest">
                Military-grade digital signatures ensuring total transaction integrity.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 border border-line flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest">Instant Flux</h3>
              <p className="text-[10px] uppercase font-bold text-muted leading-relaxed tracking-widest">
                Real-time validation engine capable of handling mass-scale entry.
              </p>
            </div>
          </section>
        </div>

        <aside className="space-y-20">
          <div className="aspect-[4/5] bg-ink grayscale hover:grayscale-0 transition-all duration-1000 overflow-hidden relative group">
            <img 
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200" 
              alt="Crowd Concept" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 border-[20px] border-paper pointer-events-none" />
            <div className="absolute bottom-12 left-12 right-12 text-white">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Archive_Study_001</span>
              <p className="text-2xl font-black uppercase tracking-tighter leading-none">The Pulse of Collective Consciousness.</p>
            </div>
          </div>

          <div className="p-12 border border-line space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Technical Specs</h4>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted">Core Engine</span>
                <span className="text-[9px] font-black uppercase tracking-widest">Vite_Express_FB</span>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted">Uptime Status</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-green-500">99.98% Operational</span>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted">Location</span>
                <span className="text-[9px] font-black uppercase tracking-widest">Digital_Void</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
