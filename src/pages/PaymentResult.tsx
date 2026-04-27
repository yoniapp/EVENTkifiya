import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { doc, collection, setDoc, updateDoc, runTransaction } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../App';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your transaction...');

  const tx_ref = searchParams.get('tx_ref');
  const eventId = searchParams.get('eventId');
  const ticketTypeId = searchParams.get('ticketTypeId');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!tx_ref || !user || !eventId || !ticketTypeId) {
        setStatus('error');
        setMessage('Missing transaction details.');
        return;
      }

      try {
        const response = await fetch(`/api/v1/payments/verify/${tx_ref}`);
        const data = await response.json();

        if (data.status === 'success' && data.data.status === 'success') {
          // Payment verified by Chapa
          // Now perform the Firestore transaction to issue the ticket
          await runTransaction(db, async (transaction) => {
            const typeRef = doc(db, 'events', eventId, 'ticketTypes', ticketTypeId);
            const typeDoc = await transaction.get(typeRef);
            
            if (!typeDoc.exists()) throw new Error("Ticket type not found");
            
            const typeData = typeDoc.data() as any;
            if (typeData.quantitySold >= typeData.quantityTotal) {
              throw new Error("Tickets are sold out!");
            }

            const bookingId = doc(collection(db, 'bookings')).id;
            const bookingData = {
              id: bookingId,
              userId: user.uid,
              eventId: eventId,
              status: 'confirmed',
              totalAmount: typeData.price,
              tx_ref: tx_ref,
              createdAt: new Date().toISOString(),
            };
            transaction.set(doc(db, 'bookings', bookingId), bookingData);

            const ticketId = doc(collection(db, 'tickets')).id;
            const ticketData = {
              id: ticketId,
              bookingId: bookingId,
              eventId: eventId,
              ticketTypeId: ticketTypeId,
              userId: user.uid,
              qrCode: `${bookingId}-${ticketId}`,
              status: 'valid',
              createdAt: new Date().toISOString(),
            };
            transaction.set(doc(db, 'tickets', ticketId), ticketData);

            transaction.update(typeRef, {
              quantitySold: typeData.quantitySold + 1
            });
          });

          setStatus('success');
          setMessage('Payment verified. Your ticket has been issued.');
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
        } else {
          setStatus('error');
          setMessage(data.message || 'Payment verification failed.');
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(error.message || 'An error occurred during verification.');
      }
    };

    verifyPayment();
  }, [tx_ref, user, eventId, ticketTypeId]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-12 border border-line bg-white shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
        {status === 'loading' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 text-accent animate-spin" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">Synchronizing Protocol</h2>
            <p className="text-muted text-[10px] font-black uppercase tracking-widest">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-ink">Access Granted</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted leading-relaxed">
                Your transaction has been verified across the secure ledger. 
                Your digital pass is now active in your vault.
              </p>
            </div>
            <button 
              onClick={() => navigate('/tickets')}
              className="w-full bg-ink text-white py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-all flex items-center justify-center gap-3"
            >
              Enter Vault <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-accent text-white rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-ink">Protocol Error</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-accent leading-relaxed">
                {message || 'The payment verification could not be completed.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="border border-line py-4 text-[10px] font-black uppercase tracking-widest hover:border-ink transition-all"
              >
                Retry
              </button>
              <button 
                onClick={() => navigate('/')}
                className="bg-ink text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all"
              >
                Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
