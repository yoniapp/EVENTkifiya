import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../App';
import { Ticket, Event, UserRole } from '../types';
import { Camera, Loader2, RefreshCcw, ShieldCheck, ArrowLeft, ScanLine } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function ValidateTicket() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState<{ ticket: Ticket; event: Event } | null>(null);
  const [validating, setValidating] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (profile?.role !== UserRole.ORGANIZER) return;

    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scannerRef.current.render(onScanSuccess, onScanFailure);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => console.error("Failed to clear scanner", error));
      }
    };
  }, [profile]);

  async function onScanSuccess(decodedText: string) {
    if (decodedText === lastScanned || validating) return;
    
    setLastScanned(decodedText);
    setValidating(true);
    setErrorBanner(null);
    setTicketData(null);

    const [bookingId, ticketId] = decodedText.split('-');
    
    try {
      if (!ticketId) throw new Error("INVALID PROTOCOL: MALFORMED QR DATA");

      const tSnap = await getDoc(doc(db, 'tickets', ticketId));
      if (!tSnap.exists()) throw new Error("ASSET NOT FOUND: TICKET UID VOID");

      const ticket = { id: tSnap.id, ...tSnap.data() } as Ticket;
      const eSnap = await getDoc(doc(db, 'events', ticket.eventId));
      const event = { id: eSnap.id, ...eSnap.data() } as Event;

      if (event.organizerId !== user?.uid) {
        throw new Error("UNAUTHORIZED: ACCESS DENIED BY SYSTEM");
      }

      if (ticket.status === 'used') {
        throw new Error(`PREVIOUSLY SCANNED: ${new Date(ticket.scannedAt!).toLocaleTimeString()}`);
      }

      if (ticket.status === 'refunded') {
        throw new Error("ASSET REVOKED: REFUNDED STATUS");
      }

      await updateDoc(doc(db, 'tickets', ticketId), {
        status: 'used',
        scannedAt: new Date().toISOString(),
        scannedBy: user?.uid
      });

      setTicketData({ ticket, event });
      toast.success('VALIDATED');
    } catch (err: any) {
      setErrorBanner(err.message || 'VALIDATION FAILURE');
      toast.error(err.message || 'SYSTEM ERROR');
    } finally {
      setValidating(false);
    }
  }

  function onScanFailure(error: any) {}

  const resetScanner = () => {
    setTicketData(null);
    setErrorBanner(null);
    setLastScanned(null);
  };

  return (
    <div className="pb-40">
      <header className="pt-10 pb-16 border-b border-line mb-20 flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="space-y-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Dashboard
          </button>
          <span className="text-[12px] uppercase tracking-[0.3em] font-bold text-accent">Security Protocol</span>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
            Digital Entry <br/>Verification.
          </h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-ink text-white p-6 flex flex-col border border-ink">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Status</span>
            <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Scanner Active
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Scanner Component */}
        <div className="border border-line p-2 relative">
          <div id="reader" className="w-full bg-paper aspect-square grayscale" />
          
          <AnimatePresence>
            {validating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-ink/90 flex flex-col items-center justify-center z-10"
              >
                <Loader2 className="w-12 h-12 text-white animate-spin mb-6" />
                <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Processing Digital Signature</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-10 left-10 w-10 h-10 border-t-2 border-l-2 border-accent" />
          <div className="absolute top-10 right-10 w-10 h-10 border-t-2 border-r-2 border-accent" />
          <div className="absolute bottom-10 left-10 w-10 h-10 border-b-2 border-l-2 border-accent" />
          <div className="absolute bottom-10 right-10 w-10 h-10 border-b-2 border-r-2 border-accent" />
        </div>

        {/* Results Sidebar */}
        <div className="space-y-10">
          <AnimatePresence mode="wait">
            {ticketData ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-4 border-ink p-12 space-y-10"
              >
                <div className="space-y-4">
                  <span className="bg-ink text-white px-4 py-1 text-[9px] font-black uppercase tracking-[0.3em] inline-block">ACCESS GRANTED</span>
                  <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Identity Confirmed</h2>
                </div>

                <div className="space-y-8 py-10 border-y border-line">
                  <div className="grid grid-cols-2 gap-10">
                    <div>
                      <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-3 italic">Resource Title</p>
                      <p className="text-sm font-black uppercase tracking-widest leading-snug">{ticketData.event.title}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-3 italic">Verified Tier</p>
                      <p className="text-sm font-black uppercase tracking-widest text-accent">PRIMARY PROTOCOL</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-3 italic">Subject Identifier</p>
                    <p className="text-sm font-black uppercase tracking-widest">UID_REF: {ticketData.ticket.userId.toUpperCase()}</p>
                  </div>
                </div>

                <button 
                  onClick={resetScanner}
                  className="w-full bg-ink text-white font-black py-6 text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-accent transition-all"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span>Resume Scanning</span>
                </button>
              </motion.div>
            ) : errorBanner ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-4 border-accent p-12 space-y-10"
              >
                <div className="space-y-4">
                  <span className="bg-accent text-white px-4 py-1 text-[9px] font-black uppercase tracking-[0.3em] inline-block">SECURITY ALERT</span>
                  <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Void Access</h2>
                </div>

                <div className="p-8 bg-paper border border-line">
                  <p className="text-xs font-black uppercase tracking-widest italic text-accent">{errorBanner}</p>
                </div>

                <button 
                  onClick={resetScanner}
                  className="w-full bg-ink text-white font-black py-6 text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black transition-all"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span>Re-initiate Protocol</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 border border-line space-y-8 bg-paper group"
              >
                <div className="w-20 h-20 border-2 border-line flex items-center justify-center mb-10 group-hover:border-accent transition-colors">
                  <ScanLine className="w-10 h-10 text-line group-hover:text-accent transition-colors" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Awaiting Signal</h3>
                  <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] leading-relaxed max-w-xs">
                    Please position the subject's digital signature within the optical validation window to proceed.
                  </p>
                </div>
                <div className="pt-10 border-t border-line">
                  <p className="text-[8px] font-bold text-line uppercase tracking-[0.3em]">System Version: ED_v4.2.0</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
