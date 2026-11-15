import { useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Modal } from './misc';
import { Button } from './ui/button';

// I teach `skillOffered`, they teach `skillWanted`
export default function SwapModal({ target, defaults = {}, onClose, onSent }) {
  const { user: me } = useAuth();
  const [f, setF] = useState({
    skillOffered: defaults.skillOffered || '', skillWanted: defaults.skillWanted || '',
    message: '', proposedTime: '', mode: 'online',
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/swaps', { to: target._id, ...f });
      toast.success('Swap request sent');
      onSent?.();
      onClose();
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-medium">Swap with {target.name}</h2>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label className="block text-sm">I will teach
          <input className="input mt-1" list="mine" required value={f.skillOffered} onChange={set('skillOffered')} placeholder="e.g. Guitar" />
          <datalist id="mine">{me.skillsOffered.map((s) => <option key={s.name} value={s.name} />)}</datalist>
        </label>
        <label className="block text-sm">I want to learn
          <input className="input mt-1" list="theirs" required value={f.skillWanted} onChange={set('skillWanted')} placeholder="e.g. Photoshop" />
          <datalist id="theirs">{target.skillsOffered.map((s) => <option key={s.name} value={s.name} />)}</datalist>
        </label>
        <label className="block text-sm">Message
          <textarea className="input mt-1" rows={3} maxLength={500} value={f.message} onChange={set('message')} placeholder="Say hi and suggest what to cover" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">Proposed time<input type="datetime-local" className="input mt-1" value={f.proposedTime} onChange={set('proposedTime')} /></label>
          <label className="block text-sm">Mode
            <select className="input mt-1" value={f.mode} onChange={set('mode')}><option value="online">Online</option><option value="in-person">In person</option></select>
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={busy}>{busy ? 'Sending…' : 'Send request'}</Button>
        </div>
      </form>
    </Modal>
  );
}
