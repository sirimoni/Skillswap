import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../lib/api';
import { Button } from '../components/ui/button';

export default function Auth({ mode }) {
  const isReg = mode === 'register';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await (isReg ? register(f) : login(f));
      toast.success(isReg ? 'Account created. Add your skills to get matched.' : 'Welcome back');
      navigate(isReg ? '/profile/edit' : '/dashboard');
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-md pt-8">
      <form onSubmit={submit} className="card space-y-4">
        <h1 className="text-3xl font-medium">{isReg ? 'Create your account' : 'Log in'}</h1>
        {isReg && <input className="input" placeholder="Full name" required value={f.name} onChange={set('name')} />}
        <input className="input" type="email" placeholder="Email" required value={f.email} onChange={set('email')} />
        <input className="input" type="password" placeholder="Password (min 6 characters)" required minLength={6} value={f.password} onChange={set('password')} />
        <Button disabled={busy} className="w-full">{busy ? 'Please wait…' : isReg ? 'Sign up' : 'Log in'}</Button>
        <p className="text-sm text-foreground/60 text-center">
          {isReg ? 'Already have an account? ' : 'New here? '}
          <Link className="text-foreground underline" to={isReg ? '/login' : '/register'}>{isReg ? 'Log in' : 'Create an account'}</Link>
        </p>
        {!isReg && <p className="text-xs text-foreground/40 text-center">Demo: aarav@demo.com / password123</p>}
      </form>
    </div>
  );
}
