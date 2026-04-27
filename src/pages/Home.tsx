import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Event } from '../types';
import EventCard from '../components/EventCard';
import { Search, SlidersHorizontal, Calendar, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const path = 'events';
      try {
        const q = query(
          collection(db, path),
          where('status', '==', 'published'),
          limit(20)
        );
        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
        setEvents(eventsData);
      } catch (error: any) {
        if (error.code === 'unavailable' || error.message.includes('unavailable')) {
          setErrorStatus('LOCAL_LINK_FAILURE');
        }
        handleFirestoreError(error, OperationType.LIST, path);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="pt-10 pb-20 border-b border-line">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[12px] uppercase tracking-[0.3em] font-bold text-accent mb-6"
            >
              Featured Experiences / 2026
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[8vw] lg:text-[100px] leading-[0.85] font-black uppercase tracking-tighter"
            >
              Discover<br />
              <span className="text-accent italic">The New</span><br />
              Standard.
            </motion.h1>
          </div>
          <div className="max-w-xs text-sm font-medium leading-relaxed opacity-60 uppercase tracking-wider pb-4">
            An curated selection of immersive multisensory journeys through sound, light, and culture. Limited capacity experiences.
          </div>
        </div>
      </section>

      {/* Search & Tool Strip */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between py-6 border-b border-line">
        <div className="relative w-full md:max-w-xl">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            placeholder="SEARCH BY NAME, LOCATION OR DATE..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none py-4 pl-8 pr-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:placeholder:opacity-0 transition-all"
          />
        </div>
        <div className="flex items-center gap-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
            {filteredEvents.length} Events Found
          </span>
          <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:text-accent transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Event Grid */}
      <div className="space-y-12">
        {errorStatus ? (
          <div className="text-center py-40 border border-accent bg-paper space-y-6">
            <div className="w-16 h-16 border border-accent flex items-center justify-center mx-auto">
              <WifiOff className="w-8 h-8 text-accent" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter">{errorStatus}</h3>
              <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em] max-w-sm mx-auto">
                Protocol link failed. Please verify your connection to the grid and refresh the entity cache.
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-ink text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-colors"
            >
              Restart Protocol
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-6 animate-pulse">
                <div className="bg-line aspect-[4/5]" />
                <div className="space-y-2">
                  <div className="bg-line h-8 w-3/4" />
                  <div className="bg-line h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border border-dashed border-line">
            <h3 className="text-2xl font-black uppercase">No results found</h3>
            <p className="text-muted text-sm mt-2 uppercase tracking-widest">Adjust your filters and try again.</p>
          </div>
        )}
      </div>

      {/* Footer Strip */}
      <footer className="pt-20 border-t border-line flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          Live: 2,408 Users Exploring Now
        </div>
        <div>&copy; 2026 Eventix Platform &mdash; Editorial v1.0</div>
      </footer>
    </div>
  );
}
