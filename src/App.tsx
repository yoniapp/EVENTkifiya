import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { UserProfile, UserRole } from './types';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import EventDetails from './pages/EventDetails';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import Tickets from './pages/Tickets';
import ValidateTicket from './pages/ValidateTicket';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PaymentResult from './pages/PaymentResult';
import About from './pages/About';
import Documentation from './pages/Documentation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    const path = `users/${uid}`;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      const currentUserEmail = auth.currentUser?.email;
      const isAdminEmail = currentUserEmail === 'allyonasmedia@gmail.com';

      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        // Force admin role if email matches
        if (isAdminEmail && data.role !== UserRole.ADMIN) {
          const updatedProfile = { ...data, role: UserRole.ADMIN };
          await setDoc(docRef, updatedProfile);
          setProfile(updatedProfile);
        } else {
          setProfile(data);
        }
      } else {
        // Create default profile for first time users
        const newProfile: UserProfile = {
          id: uid,
          name: auth.currentUser?.displayName || 'Anonymous',
          email: currentUserEmail || '',
          role: isAdminEmail ? UserRole.ADMIN : UserRole.USER,
          createdAt: new Date().toISOString(),
        };
        await setDoc(docRef, newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchProfile(user.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="text-center space-y-8 animate-pulse">
          <div className="w-16 h-16 border-4 border-ink border-t-accent rounded-full animate-spin mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-ink">Synchronizing Protocol</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile: () => fetchProfile(user?.uid || '') }}>
      <Router>
        <div className="min-h-screen bg-paper text-ink font-sans selection:bg-accent selection:text-white">
          <Navbar />
          <main className="editorial-container py-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/create-event" element={(profile?.role === UserRole.ORGANIZER || profile?.role === UserRole.ADMIN) ? <CreateEvent /> : <Navigate to="/" />} />
              <Route path="/tickets" element={user ? <Tickets /> : <Navigate to="/login" />} />
              <Route path="/validate" element={(profile?.role === UserRole.ORGANIZER || profile?.role === UserRole.ADMIN) ? <ValidateTicket /> : <Navigate to="/" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
              <Route path="/payment-result" element={user ? <PaymentResult /> : <Navigate to="/login" />} />
              <Route path="/about" element={<About />} />
              <Route path="/documentation" element={<Documentation />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="bottom-right" />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
