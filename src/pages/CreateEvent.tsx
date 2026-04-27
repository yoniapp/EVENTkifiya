import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../App';
import { MapPin, Image as ImageIcon, Type, Layout, Save, Trash2, Plus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    dateTime: '',
    category: 'Cultural',
    bannerUrl: '',
  });

  const [ticketTypes, setTicketTypes] = useState([
    { name: 'Standard Access', price: 25, quantityTotal: 100 }
  ]);

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: 'Exclusive Access', price: 75, quantityTotal: 25 }]);
  };

  const removeTicketType = (index: number) => {
    if (ticketTypes.length === 1) return;
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const updateTicketType = (index: number, field: string, value: any) => {
    const newTypes = [...ticketTypes];
    (newTypes[index] as any)[field] = value;
    setTicketTypes(newTypes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const eventRef = await addDoc(collection(db, 'events'), {
        ...formData,
        organizerId: user.uid,
        status: 'published',
        createdAt: new Date().toISOString(),
      });

      for (const type of ticketTypes) {
        await addDoc(collection(db, 'events', eventRef.id, 'ticketTypes'), {
          ...type,
          eventId: eventRef.id,
          quantitySold: 0
        });
      }

      toast.success('Experience launched.');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('System failure during publishing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-40">
      <header className="pt-10 pb-16 border-b border-line mb-20">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-10 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Dashboard
        </button>
        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="space-y-6">
            <span className="text-[12px] uppercase tracking-[0.3em] font-bold text-accent">Production Hub</span>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
              Catalogue <br/>A New Journey.
            </h1>
          </div>
          <div className="flex gap-4">
            <button 
              form="event-form"
              disabled={loading}
              className="bg-ink text-white px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-all flex items-center gap-3 disabled:bg-muted"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Processing...' : 'Launch Digital Event'}</span>
            </button>
          </div>
        </div>
      </header>

      <form id="event-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20">
        <div className="space-y-20">
          <section className="space-y-12">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted border-b border-line pb-4 inline-block">01 Core Narrative</h2>
            <div className="space-y-10">
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-4 group-focus-within:text-accent transition-colors">Manifesto Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value.toUpperCase()})}
                  className="w-full bg-transparent border-b-2 border-line py-4 text-3xl font-black uppercase tracking-tighter outline-none focus:border-ink transition-colors placeholder:text-line"
                  placeholder="E.G. SONIC UNDERGROUND"
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-4 group-focus-within:text-accent transition-colors">Detailed Description</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-paper border border-line p-8 text-lg font-serif italic outline-none focus:border-ink transition-colors resize-none placeholder:text-line"
                  placeholder="Describe the atmosphere, the sound, and the mission..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-4 group-focus-within:text-accent transition-colors">Temporal Coordinates</label>
                  <input 
                    required
                    type="datetime-local" 
                    value={formData.dateTime}
                    onChange={e => setFormData({...formData, dateTime: e.target.value})}
                    className="w-full bg-transparent border-b border-line py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-ink transition-colors"
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted mb-4 group-focus-within:text-accent transition-colors">Spatial Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                    <input 
                      required
                      type="text" 
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      className="w-full bg-transparent border-b border-line pl-8 py-4 text-xs font-black uppercase tracking-widest outline-none focus:border-ink transition-colors"
                      placeholder="VENUE ADDRESS OR VIRTUAL LINK"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-12">
            <div className="flex justify-between items-end border-b border-line pb-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">02 Access Tiers</h2>
              <button 
                type="button" 
                onClick={addTicketType}
                className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2 hover:text-ink transition-colors"
              >
                <Plus className="w-3 h-3" /> New Tier
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ticketTypes.map((type, index) => (
                <div key={index} className="p-8 border border-line space-y-8 group hover:border-ink transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 mr-4">
                      <label className="block text-[8px] font-black text-muted uppercase tracking-widest mb-2">Name</label>
                      <input 
                        type="text" 
                        value={type.name}
                        onChange={e => updateTicketType(index, 'name', e.target.value.toUpperCase())}
                        className="w-full bg-transparent border-b border-line py-2 text-xs font-black uppercase tracking-widest outline-none focus:border-ink"
                      />
                    </div>
                    <button onClick={() => removeTicketType(index)} type="button" className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 text-muted hover:text-accent" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[8px] font-black text-muted uppercase tracking-widest mb-2">Unit Price [ETB]</label>
                      <input 
                        type="number" 
                        value={type.price}
                        onChange={e => updateTicketType(index, 'price', Number(e.target.value))}
                        className="w-full bg-transparent border-b border-line py-2 text-xl font-black uppercase tracking-tighter outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-black text-muted uppercase tracking-widest mb-2">Inventory</label>
                      <input 
                        type="number" 
                        value={type.quantityTotal}
                        onChange={e => updateTicketType(index, 'quantityTotal', Number(e.target.value))}
                        className="w-full bg-transparent border-b border-line py-2 text-xl font-black uppercase tracking-tighter outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-12">
          <section className="space-y-12">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted border-b border-line pb-4 inline-block">03 Aesthetics</h2>
            <div className="space-y-8">
              <div 
                className="aspect-[4/5] bg-paper border border-line overflow-hidden flex flex-col items-center justify-center p-10 text-center group cursor-pointer"
                onClick={() => document.getElementById('banner-input')?.focus()}
              >
                {formData.bannerUrl ? (
                  <img src={formData.bannerUrl} alt="Preview" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" />
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-line mb-6 group-hover:text-accent transition-colors" />
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] leading-relaxed">System requires a <br/>high-resolution portrait <br/>catalogue image</p>
                  </>
                )}
              </div>
              <div className="group">
                <label className="block text-[8px] font-black text-muted uppercase tracking-widest mb-3">Resource Location [URL]</label>
                <input 
                  id="banner-input"
                  type="text" 
                  placeholder="HTTPS://IMAGE.SOURCE" 
                  value={formData.bannerUrl}
                  onChange={e => setFormData({...formData, bannerUrl: e.target.value})}
                  className="w-full bg-transparent border border-line p-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-ink transition-colors"
                />
              </div>
            </div>
          </section>

          <div className="p-8 border-l-4 border-accent bg-paper space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest">Protocol Tip</h4>
            <p className="text-[10px] font-serif italic text-muted leading-relaxed">
              Ensure all metadata corresponds with the event's actual atmosphere. Users expect high-fidelity information.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
