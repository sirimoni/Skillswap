import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Loader, EmptyState, Modal, StarRating } from '../components/misc';
import { Button } from '../components/ui/button';

const BADGE = { pending: 'bg-amber-400/15 text-amber-200', accepted: 'bg-indigo-500/20 text-indigo-200', completed: 'bg-emerald-400/15 text-emerald-200', rejected: 'bg-red-400/15 text-red-200', cancelled: 'bg-white/10 text-foreground/60' };

export default function MySwaps() {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState(null);
  const [tab, setTab] = useState('incoming');
  const [review, setReview] = useState(null);
  const load = () => api.get('/swaps').then((r) => setSwaps(r.data));
  useEffect(() => { load(); }, []);

  const me = user._id;
  const TABS = {
    incoming: (s) => s.to._id === me && s.status === 'pending',
    outgoing: (s) => s.from._id === me && s.status === 'pending',
    active: (s) => s.status === 'accepted',
    completed: (s) => s.status === 'completed',
  };

  const act = async (s, action, body) => {
    try { await api.patch(`/swaps/${s._id}/${action}`, body); toast.success(`Swap ${action}ed`.replace('eed', 'ed')); load(); }
    catch (e) { toast.error(errMsg(e)); }
  };
  const accept = (s) => {
    const meetingLink = window.prompt('Add a meeting link (optional)') || '';
    act(s, 'accept', { meetingLink });
  };

  if (!swaps) return <Loader />;
  const list = swaps.filter(TABS[tab]);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-medium">My swaps</h1>
      <div className="flex gap-2 overflow-x-auto">
        {Object.keys(TABS).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full border px-4 py-1.5 text-sm capitalize whitespace-nowrap ${tab === t ? 'bg-foreground text-background border-foreground' : 'border-white/15 hover:bg-white/5'}`}>
            {t} ({swaps.filter(TABS[t]).length})
          </button>
        ))}
      </div>

      {list.length === 0 ? <EmptyState title={`No ${tab} swaps`}>Requests you send or receive will show up here.</EmptyState> : list.map((s) => {
        const mine = s.from._id === me;
        const other = mine ? s.to : s.from;
        return (
          <div key={s._id} className="card space-y-3">
            <div className="flex items-center gap-3">
              <img src={other.avatar} alt="" className="h-11 w-11 rounded-full bg-white/10" />
              <div className="flex-1">
                <p className="font-medium">{other.name}</p>
                <p className="text-sm text-foreground/60">{mine ? `You teach ${s.skillOffered}, they teach ${s.skillWanted}` : `They teach ${s.skillOffered}, you teach ${s.skillWanted}`}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs capitalize ${BADGE[s.status]}`}>{s.status}</span>
            </div>
            {s.message && <p className="text-sm text-foreground/80">“{s.message}”</p>}
            <p className="text-xs text-foreground/50">
              {s.mode}{s.proposedTime && ` · ${new Date(s.proposedTime).toLocaleString()}`}
              {s.meetingLink && <> · <a className="underline" href={s.meetingLink} target="_blank" rel="noreferrer">Meeting link</a></>}
            </p>
            <div className="flex flex-wrap gap-2">
              {tab === 'incoming' && <><Button size="sm" onClick={() => accept(s)}>Accept</Button><Button size="sm" variant="outline" onClick={() => act(s, 'reject')}>Reject</Button></>}
              {tab === 'outgoing' && <Button size="sm" variant="outline" onClick={() => act(s, 'cancel')}>Cancel request</Button>}
              {tab === 'active' && <Button size="sm" onClick={() => act(s, 'complete')}>Mark as completed</Button>}
              {tab === 'completed' && (s.reviewedByMe ? <span className="text-xs text-foreground/50">You reviewed this swap</span> : <Button size="sm" variant="heroSecondary" onClick={() => setReview({ swap: s, other })}>Leave a review</Button>)}
            </div>
          </div>
        );
      })}

      {review && <ReviewModal data={review} onClose={() => setReview(null)} onDone={load} />}
    </div>
  );
}

function ReviewModal({ data, onClose, onDone }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try { await api.post('/reviews', { swap: data.swap._id, rating, comment }); toast.success('Review posted'); onDone(); onClose(); }
    catch (err) { toast.error(errMsg(err)); }
  };
  return (
    <Modal onClose={onClose}>
      <h2 className="text-2xl font-medium">Review {data.other.name}</h2>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <StarRating value={rating} onChange={setRating} size={28} />
        <textarea className="input" rows={3} maxLength={300} placeholder="How did the session go?" value={comment} onChange={(e) => setComment(e.target.value)} />
        <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button>Post review</Button></div>
      </form>
    </Modal>
  );
}
