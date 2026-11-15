import { useState } from 'react';
import { Plus } from 'lucide-react';
import { SkillTag } from './misc';

// Tag input. withLevel=true adds a level select (for skills you offer).
export default function SkillEditor({ items, onChange, withLevel = false, tone, placeholder }) {
  const [text, setText] = useState('');
  const [level, setLevel] = useState('intermediate');

  const add = () => {
    const name = text.trim();
    if (!name || items.some((i) => i.name.toLowerCase() === name.toLowerCase())) return setText('');
    onChange([...items, withLevel ? { name, level } : { name }]);
    setText('');
  };

  return (
    <div>
      <div className="flex gap-2">
        <input className="input" value={text} placeholder={placeholder} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} />
        {withLevel && (
          <select className="input !w-auto" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="expert">Expert</option>
          </select>
        )}
        <button type="button" onClick={add} className="rounded-xl bg-white/10 px-3 hover:bg-white/20" aria-label="Add skill"><Plus size={18} /></button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((i) => (
          <SkillTag key={i.name} tone={tone} onRemove={() => onChange(items.filter((x) => x.name !== i.name))}>
            {i.name}{i.level ? ` · ${i.level}` : ''}
          </SkillTag>
        ))}
      </div>
    </div>
  );
}
