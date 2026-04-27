import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { auth } from '../lib/firebase';
import { LogOut, User, PlusCircle, CheckCircle } from 'lucide-react';
import { UserRole } from '../types';

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="border-b border-line sticky top-0 z-50 bg-paper/90 backdrop-blur-md">
      <div className="editorial-container">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tighter uppercase group-hover:text-accent transition-colors">
              Eventix.
            </span>
          </Link>

          <div className="flex items-center gap-10">
            <Link to="/about" className="text-[11px] font-bold uppercase tracking-widest text-ink hover:text-accent transition-colors">
              About
            </Link>
            <Link to="/documentation" className="text-[11px] font-bold uppercase tracking-widest text-ink hover:text-accent transition-colors">
              Docs
            </Link>
            
            {user ? (
              <>
                <Link to="/tickets" className="text-[11px] font-bold uppercase tracking-widest text-ink hover:text-accent transition-colors">
                  My Tickets
                </Link>

                {(profile?.role === UserRole.ORGANIZER || profile?.role === UserRole.ADMIN) && (
                  <>
                    <Link to="/create-event" className="text-[11px] font-bold uppercase tracking-widest text-ink hover:text-accent transition-colors">
                      Host Event
                    </Link>
                    <Link to="/validate" className="text-[11px] font-bold uppercase tracking-widest text-ink hover:text-accent transition-colors">
                      Scanner
                    </Link>
                  </>
                )}

                <div className="relative group">
                  <button className="flex items-center gap-2 font-bold uppercase text-[11px] tracking-widest hover:text-accent transition-colors">
                    <User className="w-3.5 h-3.5" />
                    <span>{profile?.name.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 mt-4 w-48 bg-white border border-line shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                    <Link to="/dashboard" className="block px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink hover:bg-paper">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="block px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink hover:bg-paper">
                      Identity Profile
                    </Link>
                    <Link to="/settings" className="block px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-ink hover:bg-paper">
                      Lab Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-accent hover:bg-paper border-t border-line"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-ink text-white px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
