import React, { useEffect, useState } from 'react';
import { useAuth } from '../App';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Ticket, Event, TicketType } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import { MapPin, Download, Share2, Info, ChevronRight, Ticket as TicketIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Tickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<(Ticket & { event?: Event; type?: TicketType })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;
      try {
        const tq = query(collection(db, 'tickets'), where('userId', '==', user.uid));
        const tSnap = await getDocs(tq);
        
        const ticketsData = await Promise.all(tSnap.docs.map(async (tDoc) => {
          const t = { id: tDoc.id, ...tDoc.data() } as Ticket;
          const eSnap = await getDoc(doc(db, 'events', t.eventId));
          const typeSnap = await getDoc(doc(db, 'events', t.eventId, 'ticketTypes', t.ticketTypeId));
          
          return {
            ...t,
            event: eSnap.exists() ? { id: eSnap.id, ...eSnap.data() } as Event : undefined,
            type: typeSnap.exists() ? { id: typeSnap.id, ...typeSnap.data() } as TicketType : undefined,
          };
        }));
        
        setTickets(ticketsData);
        if (ticketsData.length > 0) setSelectedTicket(ticketsData[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [user]);

  if (loading) return (
    <div className="editorial-container py-20 animate-pulse space-y-12">
      <div className="h-20 bg-line w-1/3" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-line w-full" />)}
        </div>
        <div className="lg:col-span-2 h-[600px] bg-line w-full" />
      </div>
    </div>
  );

  const currentTicket = tickets.find(t => t.id === selectedTicket);

  return (
    <div className="pb-40">
      <header className="pt-10 pb-16 border-b border-line mb-20">
        <span className="text-[12px] uppercase tracking-[0.3em] font-bold text-accent mb-6 block">User Vault</span>
        <h1 className="text-6xl font-black uppercase tracking-tighter">Your Digital<br/>Vouchers.</h1>
      </header>

      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* Ticket List */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-10">Select Reservation</h3>
            <div className="space-y-2">
              {tickets.map(ticket => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket.id)}
                  className={`w-full p-8 border transition-all text-left flex items-center gap-6 group ${
                    selectedTicket === ticket.id 
                    ? 'bg-ink text-white border-ink' 
                    : 'bg-white border-line hover:border-ink'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black uppercase tracking-widest truncate mb-1">
                      {ticket.event?.title}
                    </p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedTicket === ticket.id ? 'text-white/60' : 'text-muted'}`}>
                      {ticket.type?.name}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    selectedTicket === ticket.id ? 'text-accent translate-x-1' : 'text-line'
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Detail Card */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentTicket && (
                <motion.div
                  key={currentTicket.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="bg-white border border-line overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.05)]"
                >
                  <div className="p-12 border-b border-line flex flex-col md:flex-row justify-between items-start gap-10">
                    <div className="space-y-6 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="bg-accent text-white text-[9px] font-black px-3 py-1 uppercase tracking-widest">
                          CONFIRMED ACCESS
                        </span>
                        <span className="text-[9px] font-black text-muted uppercase tracking-widest">
                          ID: #{currentTicket.id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter leading-tight">
                        {currentTicket.event?.title}
                      </h2>
                      <div className="flex flex-wrap gap-8 text-[11px] font-bold uppercase tracking-widest text-muted">
                        <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-accent" /> {currentTicket.event?.location}</div>
                        <div className="flex items-center gap-2 italic font-serif lowercase tracking-normal text-sm">Gates open 1hr prior</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 pt-2">
                      <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Category</p>
                      <p className="text-2xl font-black uppercase tracking-tighter text-ink">{currentTicket.type?.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_300px]">
                    <div className="p-12 space-y-12 border-b md:border-b-0 md:border-r border-line">
                      <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-1">
                          <span className="block text-[9px] font-black text-muted uppercase tracking-widest">Date</span>
                          <p className="text-[15px] font-black uppercase tracking-tight">{format(new Date(currentTicket.event?.dateTime || ''), 'dd MMM yyyy')}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="block text-[9px] font-black text-muted uppercase tracking-widest">Time</span>
                          <p className="text-[15px] font-black uppercase tracking-tight">{format(new Date(currentTicket.event?.dateTime || ''), 'HH:mm')} HRS</p>
                        </div>
                        <div className="space-y-1">
                          <span className="block text-[9px] font-black text-muted uppercase tracking-widest">Access Point</span>
                          <p className="text-[15px] font-black uppercase tracking-tight">Main East Gate</p>
                        </div>
                        <div className="space-y-1">
                          <span className="block text-[9px] font-black text-muted uppercase tracking-widest">Holder</span>
                          <p className="text-[15px] font-black uppercase tracking-tight truncate">{user?.displayName}</p>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button className="flex-1 flex items-center justify-center gap-3 border border-ink py-5 text-[10px] font-black uppercase tracking-widest hover:bg-paper transition-colors">
                          <Download className="w-3.5 h-3.5" /> Save PDF
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-3 border border-ink py-5 text-[10px] font-black uppercase tracking-widest hover:bg-paper transition-colors">
                          <Share2 className="w-3.5 h-3.5" /> Transfer
                        </button>
                      </div>
                    </div>

                    <div className="p-12 flex flex-col items-center justify-center bg-paper/50">
                      <div className="bg-white p-6 border border-line shadow-xl rotate-1 mb-8">
                        <QRCodeSVG 
                          value={currentTicket.qrCode} 
                          size={180} 
                          level="H" 
                          includeMargin={false}
                          fgColor="#111111"
                        />
                      </div>
                      <p className="text-[9px] font-black text-muted uppercase tracking-[0.3em] text-center max-w-[200px] leading-relaxed">
                        DIGITAL VERIFICATION REQUIRED AT TERMINAL
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="py-40 border border-dashed border-line text-center space-y-10">
          <div className="space-y-2">
            <h3 className="text-3xl font-black uppercase tracking-tighter">Vault Empty</h3>
            <p className="text-muted text-xs uppercase tracking-widest font-bold">Your journey has yet to begin.</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/" className="inline-block bg-ink text-white px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-colors">
              Explore Events
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
}
