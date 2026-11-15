import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import MatchCard from '../components/MatchCard';
import SwapModal from '../components/SwapModal';
import { Loader, EmptyState } from '../components/misc';
import { buttonVariants } from '../components/ui/button';

export default function Dashboard() {
  const { user } = useAuth();
  const [matches, setMatches] = useState(null);
  const [swaps, setSwaps] = useState([]);
  const [mutualOnly, setMutualOnly] = useState(false);
  const [target, setTarget] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    api.get('/matches', { params: { mutualOnly } }).then((r) => setMatches(r.data.matches));
  }, [mutualOnly, tick]);
  useEffect(() => { api.get('/swaps').then((r) => setSwaps(r.data)); }, [tick]);

  const me = user._id;
  const stats = [
    ['Matches', matches?.length ?? '–'],
    ['Pending requests', swaps.filter((s) => s.status === 'pending' && s.to._id === me).length],
    ['Completed swaps', swaps.filter((s) => s.status === 'completed').length],
    ['Your rating', user.ratingCount ? user.ratingAvg : 'New'],
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-medium">Hi {user.name.split(' ')[0]}, here are your matches</h1>
        <p className="text-foreground/60 mt-1">People who can teach what you want to learn, or want what you can teach.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(([label, val]) => (
          <div key={label} className="card !p-5"><p className="text-3xl font-heading">{val}</p><p className="text-sm text-foreground/50 mt-1">{label}</p></div>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground/70">
        <input type="checkbox" checked={mutualOnly} onChange={(e) => setMutualOnly(e.target.checked)} /> Show mutual matches only
      </label>

      {!matches ? <Loader /> : matches.length === 0 ? (
        <EmptyState title="No matches yet">
          <p>Add the skills you can teach and the ones you want to learn, and matches will appear here.</p>
          <Link to="/profile/edit" className={buttonVariants({ variant: 'heroSecondary', size: 'sm' })}>Add your skills</Link>
        </EmptyState>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((m) => <MatchCard key={m.user._id} match={m} onRequest={setTarget} />)}
        </div>
      )}

      {target && <SwapModal target={target.user} defaults={{ skillOffered: target.iCanTeachThem[0], skillWanted: target.theyCanTeachMe[0] }} onClose={() => setTarget(null)} onSent={() => setTick((t) => t + 1)} />}
    </div>
  );
}
