import React, { useEffect, useState } from 'react';
import { useAuth } from '../App';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Event, Booking, UserRole } from '../types';
import { Calendar, Ticket, User, TrendingUp, Users, Wallet, CheckCircle, ChevronRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [organizerEvents, setOrganizerEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const bq = query(collection(db, 'bookings'), where('userId', '==', user.uid));
        const bSnap = await getDocs(bq);
        setUserBookings(bSnap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));

        if (profile?.role === UserRole.ORGANIZER || profile?.role === UserRole.ADMIN) {
          const eq = query(collection(db, 'events'), where('organizerId', '==', user.uid));
          const eSnap = await getDocs(eq);
          setOrganizerEvents(eSnap.docs.map(d => ({ id: d.id, ...d.data() } as Event)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, profile]);

  const becomeOrganizer = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        role: UserRole.ORGANIZER
      });
      await refreshProfile();
      toast.success('You are now an organizer! Host your first event.');
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  if (loading) return (
    <div className="editorial-container py-20 animate-pulse space-y-12">
      <div className="h-32 bg-line w-full" />
      <div className="grid grid-cols-3 gap-10">
        <div className="h-40 bg-line" />
        <div className="h-40 bg-line" />
        <div className="h-40 bg-line" />
      </div>
    </div>
  );

  return (
    <div className="pb-40">
      <header className="pt-10 pb-16 border-b border-line mb-20 flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="space-y-6">
          <span className="text-[12px] uppercase tracking-[0.3em] font-bold text-accent">Control Center</span>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
            Welcome Back,<br/>{profile?.name.split(' ')[0]}.
          </h1>
          <div className="flex gap-3">
            <span className="border border-ink text-ink px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em]">
              {profile?.role}
            </span>
            {profile?.role !== UserRole.ORGANIZER && (
              <button 
                onClick={becomeOrganizer}
                className="bg-accent text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-black transition-colors"
              >
                Request Host Status
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <Link to="/tickets" className="border border-line px-8 py-5 text-[10px] font-black uppercase tracking-widest hover:border-ink transition-colors flex items-center gap-3">
            <Ticket className="w-3.5 h-3.5" /> My Vault
          </Link>
          {(profile?.role === UserRole.ORGANIZER || profile?.role === UserRole.ADMIN) && (
            <Link to="/create-event" className="bg-ink text-white px-8 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-colors flex items-center gap-3">
              <Plus className="w-3.5 h-3.5" /> Launch Event
            </Link>
          )}
        </div>
      </header>

      {/* Numerical Evidence */}
      <div className="grid grid-cols-1 md:grid-cols-3 border border-line mb-20">
        <div className="p-12 border-b md:border-b-0 md:border-r border-line hover:bg-paper transition-colors group">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-8 italic">Total Reservations</p>
          <div className="flex items-end justify-between">
            <span className="text-6xl font-black tracking-tighter leading-none">{userBookings.length}</span>
            <Ticket className="w-8 h-8 text-line group-hover:text-accent transition-colors" />
          </div>
        </div>

        {(profile?.role === UserRole.ORGANIZER || profile?.role === UserRole.ADMIN) && (
          <>
            <div className="p-12 border-b md:border-b-0 md:border-r border-line hover:bg-paper transition-colors group">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-8 italic">Platform Revenue</p>
              <div className="flex items-end justify-between">
                <span className="text-6xl font-black tracking-tighter leading-none">{(organizerEvents.length * 12.5).toFixed(1)}k <span className="text-sm">ETB</span></span>
                <Wallet className="w-8 h-8 text-line group-hover:text-accent transition-colors" />
              </div>
            </div>
            <div className="p-12 hover:bg-paper transition-colors group">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-8 italic">Live Catalog</p>
              <div className="flex items-end justify-between">
                <span className="text-6xl font-black tracking-tighter leading-none">{organizerEvents.length}</span>
                <Calendar className="w-8 h-8 text-line group-hover:text-accent transition-colors" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* User Activity */}
        <section className="space-y-10">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b border-line pb-4 flex items-center gap-3 text-muted">
            <TrendingUp className="w-4 h-4" /> Recent Journal
          </h2>
          <div className="space-y-2">
            {userBookings.length > 0 ? (
              userBookings.slice(0, 5).map(booking => (
                <div key={booking.id} className="p-8 border border-line hover:border-ink transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest leading-none">ORDER #{booking.id.slice(-6)}</p>
                      <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-2">Verified {new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <p className="text-sm font-black uppercase tracking-tighter">{booking.totalAmount} ETB</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-line group-hover:text-accent transition-all" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 border border-dashed border-line text-center text-[10px] font-bold uppercase tracking-widest text-muted">
                Transaction history is empty.
              </div>
            )}
          </div>
        </section>

        {/* Organizer Controls */}
        {(profile?.role === UserRole.ORGANIZER || profile?.role === UserRole.ADMIN) && (
          <section className="space-y-10">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] border-b border-line pb-4 flex items-center gap-3 text-muted">
              <Plus className="w-4 h-4" /> Production Assets
            </h2>
            <div className="space-y-2">
              {organizerEvents.map(event => (
                <Link to={`/event/${event.id}`} key={event.id} className="p-8 border border-line hover:border-ink transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-line overflow-hidden grayscale group-hover:grayscale-0 transition-all shrink-0">
                      <img src={event.bannerUrl || "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=100"} alt="event" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-widest truncate">{event.title}</p>
                      <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1 italic">{event.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-10 ml-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1 leading-none">Schedule</p>
                      <p className="text-xs font-black uppercase tracking-tight">{new Date(event.dateTime).toLocaleDateString('en-GB')}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-line group-hover:text-accent transition-all" />
                  </div>
                </Link>
              ))}
              {organizerEvents.length === 0 && (
                <div className="p-20 border border-dashed border-line text-center text-[10px] font-bold uppercase tracking-widest text-muted">
                  No active production assets found.
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
