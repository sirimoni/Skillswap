import { Star, X } from 'lucide-react';

export const Loader = () => (
  <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-purple-400" /></div>
);

export const EmptyState = ({ title, children }) => (
  <div className="card text-center py-12">
    <h3 className="text-xl font-medium">{title}</h3>
    <div className="mt-2 text-foreground/60 text-sm flex flex-col items-center gap-4">{children}</div>
  </div>
);

const TONES = { offered: 'bg-indigo-500/15 text-indigo-200 border-indigo-400/30', wanted: 'bg-amber-400/10 text-amber-200 border-amber-300/30', neutral: 'bg-white/5 text-foreground/80 border-white/10' };
export const SkillTag = ({ children, tone = 'neutral', onRemove }) => (
  <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs capitalize ${TONES[tone]}`}>
    {children}
    {onRemove && <button type="button" onClick={onRemove} aria-label="Remove"><X size={12} /></button>}
  </span>
);

export function StarRating({ value = 0, onChange, size = 16 }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={!onChange} onClick={() => onChange?.(n)} aria-label={`${n} stars`} className={onChange ? 'cursor-pointer' : 'cursor-default'}>
          <Star size={size} className={n <= Math.round(value) ? 'fill-amber-300 text-amber-300' : 'text-foreground/25'} />
        </button>
      ))}
    </div>
  );
}

export const Rating = ({ user }) => (
  <div className="flex items-center gap-2 text-xs text-foreground/60">
    <StarRating value={user.ratingAvg} size={14} />
    <span>{user.ratingCount ? `${user.ratingAvg} (${user.ratingCount})` : 'No reviews yet'}</span>
  </div>
);

export const Modal = ({ onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal">{children}</div>
  </div>
);
