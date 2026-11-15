import { Link } from 'react-router-dom';
import { SkillTag, Rating } from './misc';
import { Button } from './ui/button';

const cap = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());

export default function MatchCard({ match, onRequest }) {
  const { user, theyCanTeachMe, iCanTeachThem, isMutual } = match;
  return (
    <div className="card flex flex-col gap-4 hover:-translate-y-0.5 transition">
      <div className="flex items-center gap-3">
        <img src={user.avatar} alt="" className="h-12 w-12 rounded-full bg-white/10" />
        <div className="min-w-0 flex-1">
          <Link to={`/u/${user._id}`} className="block truncate font-heading text-lg font-medium hover:underline">{user.name}</Link>
          <Rating user={user} />
        </div>
        {isMutual && <span className="gradient-text text-xs font-semibold whitespace-nowrap">Mutual match</span>}
      </div>

      {theyCanTeachMe.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs text-foreground/50">They can teach you</p>
          <div className="flex flex-wrap gap-1.5">{theyCanTeachMe.map((s) => <SkillTag key={s} tone="offered">{cap(s)}</SkillTag>)}</div>
        </div>
      )}
      {iCanTeachThem.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs text-foreground/50">You can teach them</p>
          <div className="flex flex-wrap gap-1.5">{iCanTeachThem.map((s) => <SkillTag key={s} tone="wanted">{cap(s)}</SkillTag>)}</div>
        </div>
      )}
      <Button variant="heroSecondary" className="mt-auto" onClick={() => onRequest(match)}>Request swap</Button>
    </div>
  );
}
