import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import SkillEditor from '../components/SkillEditor';
import { Button } from '../components/ui/button';

const SLOTS = ['Weekday mornings', 'Weekday evenings', 'Weekends', 'Flexible'];

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [f, setF] = useState({
    name: user.name, bio: user.bio || '', location: user.location || '',
    availability: user.availability || [], skillsOffered: user.skillsOffered || [], skillsWanted: user.skillsWanted || [],
  });
  const [busy, setBusy] = useState(false);
  const toggle = (s) => setF({ ...f, availability: f.availability.includes(s) ? f.availability.filter((x) => x !== s) : [...f.availability, s] });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.put('/users/me', f);
      setUser(data);
      toast.success('Profile saved');
      navigate('/dashboard');
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };

  return (
    <form onSubmit={save} className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-4xl font-medium">Your profile</h1>
      <div className="card space-y-4">
        <label className="block text-sm">Name<input className="input mt-1" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label className="block text-sm">Location<input className="input mt-1" value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} /></label>
        <label className="block text-sm">Bio ({f.bio.length}/300)<textarea className="input mt-1" rows={3} maxLength={300} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} /></label>
      </div>
      <div className="card"><h2 className="font-medium mb-3">Skills I can teach</h2>
        <SkillEditor withLevel tone="offered" placeholder="e.g. Guitar (press Enter)" items={f.skillsOffered} onChange={(v) => setF({ ...f, skillsOffered: v })} /></div>
      <div className="card"><h2 className="font-medium mb-3">Skills I want to learn</h2>
        <SkillEditor tone="wanted" placeholder="e.g. Spanish (press Enter)" items={f.skillsWanted} onChange={(v) => setF({ ...f, skillsWanted: v })} /></div>
      <div className="card"><h2 className="font-medium mb-3">Availability</h2>
        <div className="flex flex-wrap gap-2">{SLOTS.map((s) => (
          <button type="button" key={s} onClick={() => toggle(s)} className={`rounded-full border px-3 py-1 text-sm transition ${f.availability.includes(s) ? 'bg-foreground text-background border-foreground' : 'border-white/15 hover:bg-white/5'}`}>{s}</button>
        ))}</div></div>
      <Button disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</Button>
    </form>
  );
}
