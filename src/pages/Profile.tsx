import React from 'react';
import { useAuth } from '../App';
import { User, Mail, Calendar, ShieldCheck, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className="pb-40">
      <header className="pt-10 pb-16 border-b border-line mb-20 flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="space-y-6">
          <span className="text-[12px] uppercase tracking-[0.3em] font-bold text-accent">Identity Profile</span>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
            {profile.name.split(' ')[0]} <br/>System Entity.
          </h1>
        </div>
        <div className="flex gap-4">
          <Link to="/settings" className="border border-line px-8 py-5 text-[10px] font-black uppercase tracking-widest hover:border-ink transition-colors flex items-center gap-3">
            <Edit3 className="w-3.5 h-3.5" /> Modify Attributes
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <section className="p-12 border border-line space-y-10 group hover:border-ink transition-all">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-ink text-white flex items-center justify-center font-black text-3xl">
                {profile.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tighter">{profile.name}</h2>
                <div className="flex gap-2">
                  <span className="text-[8px] font-black uppercase tracking-widest bg-accent text-white px-2 py-0.5">
                    {profile.role}
                  </span>
                  {profile.role === 'admin' && (
                    <span className="text-[8px] font-black uppercase tracking-widest bg-ink text-white px-2 py-0.5">
                      Root Access
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6 border-t border-line pt-10">
              <div className="flex items-center gap-4">
                <Mail className="w-4 h-4 text-muted" />
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted mb-1">Communication Channel</p>
                  <p className="text-sm font-black uppercase tracking-widest">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Calendar className="w-4 h-4 text-muted" />
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted mb-1">Entity Registration</p>
                  <p className="text-sm font-black uppercase tracking-widest">{new Date(profile.createdAt).toLocaleDateString('en-GB')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-4 h-4 text-muted" />
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted mb-1">Security Status</p>
                  <p className="text-sm font-black uppercase tracking-widest text-green-500">Verified Signature</p>
                </div>
              </div>
            </div>
          </section>

          <div className="p-8 border-l-4 border-accent bg-paper">
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-3">Identity Note</h4>
            <p className="text-[10px] font-serif italic text-muted leading-relaxed">
              Your profile serves as your unique identifier within the Eventix protocol. 
              Ensure your communication channels are secured to prevent unauthorized access to your asset vault.
            </p>
          </div>
        </div>

        <aside className="space-y-12">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b border-line pb-4 text-muted">
            Recent Synchronization
          </h2>
          <div className="p-20 border border-dashed border-line text-center text-[10px] font-bold uppercase tracking-widest text-muted">
            No recent protocol activity detected.
          </div>
        </aside>
      </div>
    </div>
  );
}
