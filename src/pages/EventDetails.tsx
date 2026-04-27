import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, runTransaction } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Event, TicketType, Booking, Ticket } from '../types';
import { useAuth } from '../App';
import { ChevronRight, Ticket as TicketIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const eventSnap = await getDoc(doc(db, 'events', id));
        if (eventSnap.exists()) {
          setEvent({ id: eventSnap.id, ...eventSnap.data() } as Event);
          
          const typesSnap = await getDocs(collection(db, 'events', id, 'ticketTypes'));
          setTicketTypes(typesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TicketType)));
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please sign in to book tickets');
      navigate('/login');
      return;
    }
    if (!selectedType) {
      toast.error('Please select a ticket type');
      return;
    }

    setBookingInProgress(true);
    try {
      const typeData = ticketTypes.find(t => t.id === selectedType);
      if (!typeData) throw new Error("Ticket type not found");

      // Check availability before redirecting
      if (typeData.quantitySold >= typeData.quantityTotal) {
        throw new Error("Tickets are sold out!");
      }

      const tx_ref = `EVX-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
      
      const paymentTitle = (event?.title || 'Event Ticket').substring(0, 16);
      const paymentDesc = `Access Pass ${typeData.name}`.replace(/[^a-zA-Z0-9.\-_ ]/g, '');

      // Chapa Inline Popup Integration
      if ((window as any).Chapa) {
        (window as any).Chapa.pay({
          public_key: import.meta.env.VITE_CHAPA_PUBLIC_KEY,
          tx_ref: tx_ref,
          amount: typeData.price,
          currency: 'ETB',
          email: user.email,
          first_name: user.displayName?.split(' ')[0] || 'Customer',
          last_name: user.displayName?.split(' ')[1] || 'User',
          title: paymentTitle,
          description: paymentDesc,
          callback_url: `${window.location.origin}/api/v1/payments/webhook`,
          return_url: `${window.location.origin}/payment-result?tx_ref=${tx_ref}&eventId=${id}&ticketTypeId=${selectedType}`,
          customization: {
            title: paymentTitle,
            description: paymentDesc,
          },
          onClose: () => {
            setBookingInProgress(false);
          },
          onSuccess: (data: any) => {
            // Some implementations use this, others rely solely on return_url
            console.log('Chapa Success:', data);
            navigate(`/payment-result?tx_ref=${tx_ref}&eventId=${id}&ticketTypeId=${selectedType}`);
          }
        });
      } else {
        // Fallback to server-side initialization if script failed to load
        const payload = {
          amount: typeData.price,
          currency: 'ETB',
          email: user.email,
          first_name: user.displayName?.split(' ')[0] || 'Customer',
          last_name: user.displayName?.split(' ')[1] || 'User',
          tx_ref,
          callback_url: `${window.location.origin}/api/v1/payments/webhook`,
          return_url: `${window.location.origin}/payment-result?tx_ref=${tx_ref}&eventId=${id}&ticketTypeId=${selectedType}`,
          customization: {
            title: paymentTitle,
            description: paymentDesc,
          }
        };

        const response = await fetch('/api/v1/payments/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (data.status === 'success' && data.data?.checkout_url) {
          toast.loading('Redirecting to secure gateway...');
          window.location.href = data.data.checkout_url;
        } else {
          const errorMsg = data.message || data.error || 'Payment initialization failed';
          throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
        }
      }
    } catch (error: any) {
      console.error('Booking Error:', error);
      toast.error(error.message || 'Booking failed');
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) return (
    <div className="editorial-container py-20 animate-pulse space-y-12">
      <div className="h-[600px] bg-line" />
      <div className="grid grid-cols-3 gap-10">
        <div className="col-span-2 space-y-6">
          <div className="h-20 bg-line w-full" />
          <div className="h-60 bg-line w-full" />
        </div>
        <div className="h-80 bg-line w-full" />
      </div>
    </div>
  );

  if (!event) return <div className="text-center py-40 uppercase font-black tracking-widest leading-loose">Event not found.</div>;

  const date = new Date(event.dateTime);

  return (
    <div className="pb-40">
      {/* Header Info */}
      <section className="pt-10 pb-16 border-b border-line">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-10 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to experiences
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
          <div className="space-y-6">
            <span className="text-[12px] uppercase tracking-[0.3em] font-bold text-accent">
              Experience / {event.category || 'General'}
            </span>
            <h1 className="text-[6vw] lg:text-[80px] leading-[0.9] font-black uppercase tracking-tighter">
              {event.title.split(' ').map((word, i) => (
                <React.Fragment key={i}>{word}<br/></React.Fragment>
              ))}
            </h1>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-4 border-t border-line lg:border-t-0 lg:border-l lg:pl-12">
            <div className="space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted">Date & Time</span>
              <p className="text-[16px] font-bold uppercase tracking-tight">{format(date, 'dd MMM — HH:mm')}</p>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted">Venue Location</span>
              <p className="text-[16px] font-bold uppercase tracking-tight">{event.location}</p>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-muted">Organizer</span>
              <p className="text-[16px] font-bold uppercase tracking-tight italic">Verified Host</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20">
          <div className="space-y-16">
            <div className="aspect-[16/9] lg:aspect-video bg-line overflow-hidden border border-line">
              <img src={event.bannerUrl || "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=2000"} alt={event.title} className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000" />
            </div>
            
            <div className="max-w-2xl space-y-8">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] border-b border-line pb-4 inline-block">Event Narrative</h3>
              <p className="font-serif text-xl md:text-2xl leading-relaxed italic text-ink/80 whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>

          <aside>
            <div className="bg-white border border-line p-10 space-y-10 sticky top-32 shadow-2xl">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-6">Booking Portal</h3>
                <div className="text-5xl font-black tracking-tighter mb-2">
                  {selectedType ? ticketTypes.find(t => t.id === selectedType)?.price : ticketTypes[0]?.price || '0'}.00 <span className="text-sm">ETB</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Starting per individual access</p>
              </div>

              <div className="space-y-4">
                {ticketTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    disabled={type.quantitySold >= type.quantityTotal}
                    className={`w-full flex justify-between items-center py-6 border-b transition-all group ${
                      selectedType === type.id 
                      ? 'border-accent text-accent font-black' 
                      : 'border-line hover:border-ink'
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    <span className="text-xs uppercase font-bold tracking-widest">{type.name}</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                      {type.quantitySold >= type.quantityTotal ? 'Sold Out' : `${type.price} ETB`}
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-6 pt-10">
                <button 
                  onClick={handleBooking}
                  disabled={!selectedType || bookingInProgress}
                  className="w-full bg-ink text-white font-black py-6 text-xs uppercase tracking-[0.3em] hover:bg-accent transition-colors disabled:bg-muted disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {bookingInProgress ? 'Processing...' : 'Secure Access'}
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="text-[9px] font-serif italic text-muted text-center uppercase tracking-widest">
                  Secured digital verification required upon entry.
                </div>
              </div>

              {/* Decorative QR Preview */}
              <div className="absolute -bottom-12 right-6 bg-white border border-line p-4 w-32 shadow-2xl rotate-3 hidden xl:block">
                <div className="aspect-square bg-line flex items-center justify-center">
                  <TicketIcon className="w-12 h-12 text-muted" />
                </div>
                <p className="text-[8px] font-black mt-3 text-center uppercase">Digital Voucher #EVX</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
