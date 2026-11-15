import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../lib/api';
import { Button } from '../components/ui/button';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [f, setF] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (f.newPassword !== f.confirm) return toast.error('New passwords do not match');
    setBusy(true);
    try {
      await api.put('/auth/password', { currentPassword: f.currentPassword, newPassword: f.newPassword });
      toast.success('Password updated');
      navigate('/dashboard');
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-md pt-8">
      <form onSubmit={submit} className="card space-y-4">
        <h1 className="text-3xl font-medium">Change password</h1>
        <input className="input" type="password" placeholder="Current password" required value={f.currentPassword} onChange={set('currentPassword')} />
        <input className="input" type="password" placeholder="New password (min 6 characters)" required minLength={6} value={f.newPassword} onChange={set('newPassword')} />
        <input className="input" type="password" placeholder="Confirm new password" required minLength={6} value={f.confirm} onChange={set('confirm')} />
        <Button disabled={busy} className="w-full">{busy ? 'Saving…' : 'Update password'}</Button>
      </form>
    </div>
  );
}