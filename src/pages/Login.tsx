import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { signInWithGoogle } from '../lib/firebase';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;
  if (user) return <Navigate to="/" />;

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success('Welcome back.');
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect);
    } catch (error) {
      console.error(error);
      toast.error('Gaining access failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-12 text-center"
      >
        <div className="space-y-6">
          <span className="text-[12px] uppercase tracking-[0.4em] font-black text-accent">Identification Required</span>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
            Join The<br/>
            Culture.
          </h1>
          <p className="text-muted text-[11px] uppercase tracking-widest font-bold max-w-[280px] mx-auto leading-relaxed">
            Verify your identity to access exclusive experiences and manage your digital vouchers.
          </p>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="w-full bg-ink text-white py-6 text-xs font-black uppercase tracking-[0.3em] hover:shadow-2xl transition-all flex items-center justify-center gap-4 group"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
          Authenticate with Google
        </button>

        <div className="pt-10 border-t border-line">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted">
            By proceeding, you agree to our <span className="text-ink underline cursor-pointer">Charter of Conduct</span> and <span className="text-ink underline cursor-pointer">Protocol</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
