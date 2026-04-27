import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Globe, Terminal, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-line mt-40">
      <div className="editorial-container py-20 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="md:col-span-1 space-y-10">
            <Link to="/" className="text-xl font-black uppercase tracking-tighter hover:text-accent transition-colors">
              EVENTIX.
            </Link>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted leading-relaxed">
              Decentralized Access Architecture <br/>
              Protocol v1.0.0_BETA
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-line flex items-center justify-center hover:border-ink transition-colors">
                 <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 border border-line flex items-center justify-center hover:border-ink transition-colors">
                 <Terminal className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent border-b border-line pb-4">Resources</h4>
            <nav className="flex flex-col gap-4">
              <Link to="/about" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-ink transition-colors">Manifesto</Link>
              <Link to="/documentation" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-ink transition-colors">Documentation</Link>
              <Link to="/api/v1/health" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-ink transition-colors">System Status</Link>
            </nav>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent border-b border-line pb-4">Account</h4>
            <nav className="flex flex-col gap-4">
              <Link to="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-ink transition-colors">Dashboard</Link>
              <Link to="/tickets" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-ink transition-colors">Vault</Link>
            </nav>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent border-b border-line pb-4">Protocol Office</h4>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted">Ais-Studio Build_System</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted leading-none">Cloud_Region: Europe_West_3</p>
            </div>
            <div className="pt-4 flex items-center gap-3">
              <Shield className="w-3.5 h-3.5 text-accent" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-ink">Encrypted_End_To_End</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
