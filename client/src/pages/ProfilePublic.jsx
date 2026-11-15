import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import SwapModal from '../components/SwapModal';
import { Loader, SkillTag, Rating, StarRating } from '../components/misc';
import { Button, buttonVariants } from '../components/ui/button';

export default function ProfilePublic() {
  const { id } = useParams();
  const { user: me } = useAuth();
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => { setData(null); api.get(`/users/${id}`).then((r) => setData(r.data)).catch(() => setData({ missing: true })); }, [id]);
  if (!data) return <Loader />;
  if (data.missing) return <p className="text-center text-foreground/60 py-20">This profile doesn’t exist.</p>;

  const { user, reviews } = data;
  const isMe = me?._id === user._id;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="card flex flex-col sm:flex-row sm:items-center gap-5">
        <img src={user.avatar} alt="" className="h-20 w-20 rounded-full bg-white/10" />
        <div className="flex-1">
          <h1 className="text-3xl font-medium">{user.name}</h1>
          {user.location && <p className="text-sm text-foreground/50">{user.location}</p>}
          <div className="mt-1"><Rating user={user} /></div>
          {user.bio && <p className="mt-3 text-foreground/80 text-sm">{user.bio}</p>}
        </div>
        {isMe ? <Link to="/profile/edit" className={buttonVariants({ variant: 'outline', size: 'sm' })}>Edit profile</Link>
          : me ? <Button variant="heroSecondary" onClick={() => setOpen(true)}>Request swap</Button>
          : <Link to="/login" className={buttonVariants({ variant: 'heroSecondary' })}>Log in to swap</Link>}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="card"><h2 className="font-medium mb-3">Can teach</h2>
          <div className="flex flex-wrap gap-2">{user.skillsOffered.map((s) => <SkillTag key={s.name} tone="offered">{s.name} · {s.level}</SkillTag>)}</div></div>
        <div className="card"><h2 className="font-medium mb-3">Wants to learn</h2>
          <div className="flex flex-wrap gap-2">{user.skillsWanted.map((s) => <SkillTag key={s.name} tone="wanted">{s.name}</SkillTag>)}</div></div>
      </div>

      {user.availability.length > 0 && <div className="card"><h2 className="font-medium mb-3">Availability</h2><div className="flex flex-wrap gap-2">{user.availability.map((a) => <SkillTag key={a}>{a}</SkillTag>)}</div></div>}

      <div className="card">
        <h2 className="font-medium mb-4">Reviews</h2>
        {reviews.length === 0 ? <p className="text-sm text-foreground/50">No reviews yet.</p> : (
          <ul className="space-y-4">{reviews.map((r) => (
            <li key={r._id} className="flex gap-3">
              <img src={r.reviewer.avatar} alt="" className="h-9 w-9 rounded-full bg-white/10" />
              <div><p className="text-sm font-medium">{r.reviewer.name} <StarRating value={r.rating} size={13} /></p>{r.comment && <p className="text-sm text-foreground/70">{r.comment}</p>}</div>
            </li>))}
          </ul>
        )}
      </div>
      {open && <SwapModal target={user} onClose={() => setOpen(false)} />}
    </div>
  );
}
