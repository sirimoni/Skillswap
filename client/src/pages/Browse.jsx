import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Loader, EmptyState, SkillTag, Rating } from '../components/misc';

const CHIPS = ['Guitar', 'Python', 'Photoshop', 'Spanish', 'Yoga', 'Figma', 'Excel', 'Photography', 'Cooking', 'React', 'Chess', 'Public Speaking'];

export default function Browse() {
  const [q, setQ] = useState('');
  const [skill, setSkill] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      api.get('/users', { params: { q, skill, page } }).then((r) => setData(r.data));
    }, 250);
    return () => clearTimeout(t);
  }, [q, skill, page]);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-medium">Browse skills</h1>
      <input className="input max-w-md" placeholder="Search by name" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
      <div className="flex flex-wrap gap-2">
        {CHIPS.map((c) => (
          <button key={c} onClick={() => { setSkill(skill === c ? '' : c); setPage(1); }}
            className={`rounded-full border px-3 py-1 text-sm transition ${skill === c ? 'bg-foreground text-background border-foreground' : 'border-white/15 hover:bg-white/5'}`}>{c}</button>
        ))}
      </div>

      {!data ? <Loader /> : data.users.length === 0 ? <EmptyState title="Nobody found">Try a different name or skill.</EmptyState> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.users.map((u) => (
            <Link key={u._id} to={`/u/${u._id}`} className="card flex flex-col gap-3 hover:-translate-y-0.5 transition">
              <div className="flex items-center gap-3">
                <img src={u.avatar} alt="" className="h-12 w-12 rounded-full bg-white/10" />
                <div><p className="font-heading text-lg font-medium">{u.name}</p><Rating user={u} /></div>
              </div>
              <div className="flex flex-wrap gap-1.5">{u.skillsOffered.map((s) => <SkillTag key={s.name} tone="offered">{s.name}</SkillTag>)}</div>
            </Link>
          ))}
        </div>
      )}

      {data && data.pages > 1 && (
        <div className="flex items-center justify-center gap-4 text-sm">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="disabled:opacity-30">Previous</button>
          <span className="text-foreground/60">Page {page} of {data.pages}</span>
          <button disabled={page >= data.pages} onClick={() => setPage(page + 1)} className="disabled:opacity-30">Next</button>
        </div>
      )}
    </div>
  );
}
