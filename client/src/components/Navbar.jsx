import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import logo from '../assets/logo.svg';
import { useAuth } from '../context/AuthContext';
import { Button, buttonVariants } from './ui/button';

const NAV = [
  { label: 'How it works', to: '/register', chevron: true },
  { label: 'Browse skills', to: '/browse' },
  { label: 'Matches', to: '/dashboard' },
  { label: 'Community', to: '/browse', chevron: true },
];

export default function Navbar({ hero = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className={hero ? 'relative z-20' : 'sticky top-0 z-40 bg-background/70 backdrop-blur-md'}>
      <nav className="flex items-center justify-between py-5 px-8">
        <Link to="/"><img src={logo} alt="SkillSwap" style={{ height: 32 }} /></Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <button key={n.label} onClick={() => navigate(n.to)} className="flex items-center gap-1 text-sm text-foreground/90 hover:text-foreground transition">
              {n.label}{n.chevron && <ChevronDown size={14} />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link to="/login" className="text-sm text-foreground/80 hover:text-foreground transition">Log in</Link>
              <Link to="/register" className={buttonVariants({ variant: 'heroSecondary', size: 'sm' })}>Sign Up</Link>
            </>
          )}
          {user && hero && <Link to="/dashboard" className={buttonVariants({ variant: 'heroSecondary', size: 'sm' })}>Dashboard</Link>}
          {user && !hero && (
            <div className="relative">
              <button onClick={() => setOpen(!open)} className="flex items-center gap-2" aria-label="Account menu">
                <img src={user.avatar} alt="" className="h-9 w-9 rounded-full bg-white/10" />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 p-1 text-sm" style={{ background: 'hsl(260 60% 6%)' }} onClick={() => setOpen(false)}>
                  <Link className="block rounded-lg px-3 py-2 hover:bg-white/5" to="/dashboard">Dashboard</Link>
                  <Link className="block rounded-lg px-3 py-2 hover:bg-white/5" to="/profile/edit">Edit profile</Link>
                  <Link className="block rounded-lg px-3 py-2 hover:bg-white/5" to="/settings/password">Change password</Link>
                  <Link className="block rounded-lg px-3 py-2 hover:bg-white/5" to="/swaps">My swaps</Link>
                  <button className="block w-full text-left rounded-lg px-3 py-2 hover:bg-white/5" onClick={() => { logout(); navigate('/'); }}>Log out</button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      <div className="mt-[3px] h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
    </header>
  );
}
