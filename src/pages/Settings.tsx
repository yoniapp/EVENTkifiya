import React, { useState } from 'react';
import { useAuth } from '../App';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Save, User, Bell, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Settings() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', profile.id), {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      await refreshProfile();
      toast.success('CORE ATTRIBUTES SYNCHRONIZED');
      navigate('/profile');
    } catch (error) {
      console.error(error);
      toast.error('PROTOCOL SYNCHRONIZATION FAILURE');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-40">
      <header className="pt-10 pb-16 border-b border-line mb-20 flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="space-y-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Identity Profile
          </button>
          <span className="text-[12px] uppercase tracking-[0.3em] font-bold text-accent">Configuration Lab</span>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
            Modify Entity <br/>Attributes.
          </h1>
        </div>
        <div className="flex gap-4">
          <button 
            form="settings-form"
            disabled={loading}
            className="bg-ink text-white px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-all flex items-center gap-3 disabled:bg-muted"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Transmitting...' : 'Commit Changes'}</span>
          </button>
        </div>
      </header>

      <form id="settings-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20">
        <div className="space-y-20">
          <section className="space-y-12">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted border-b border-line pb-4 inline-block">01 Fundamental Data</h2>
            <div className="space-y-10">
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-4 group-focus-within:text-accent transition-colors">Entity Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-transparent border-b-2 border-line py-4 text-3xl font-black uppercase tracking-tighter outline-none focus:border-ink transition-colors placeholder:text-line"
                  placeholder="E.G. JOHN DOE"
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-4 group-focus-within:text-accent transition-colors">Communication Link (Phone)</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-transparent border-b border-line py-4 text-sm font-black uppercase tracking-widest outline-none focus:border-ink transition-colors placeholder:text-line"
                  placeholder="+44 000 000 000"
                />
              </div>
            </div>
          </section>

          <section className="space-y-12 opacity-50 pointer-events-none">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted border-b border-line pb-4 inline-block">02 Security Layer [LOCKED]</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-8 border border-line">
                <div className="flex items-center gap-4">
                  <Shield className="w-5 h-5 text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Double Factor Integration</span>
                </div>
                <div className="w-10 h-5 bg-line rounded-full" />
              </div>
              <div className="flex items-center justify-between p-8 border border-line">
                <div className="flex items-center gap-4">
                  <Bell className="w-5 h-5 text-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Protocol Alerts</span>
                </div>
                <div className="w-10 h-5 bg-ink rounded-full" />
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-12">
          <div className="p-8 border-l-4 border-accent bg-paper space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest">Encryption Protocol</h4>
            <p className="text-[10px] font-serif italic text-muted leading-relaxed">
              All changes to entity attributes are signed and logged in the system ledger. 
              Unauthorized modification of core data is strictly prohibited.
            </p>
          </div>
          
          <div className="p-8 bg-ink text-white space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">Session Info</h4>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Status</span>
                <span className="text-[8px] font-black uppercase tracking-widest">Active</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Auth Level</span>
                <span className="text-[8px] font-black uppercase tracking-widest">{profile?.role}</span>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
