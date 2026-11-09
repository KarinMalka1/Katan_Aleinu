import { Flame, Star } from "lucide-react";
import { ageLabel } from "@/lib/gamification";

export default function ChildrenOverview({ children, active, onSelect }) {
  return (
    <section>
      <h2 className="mb-2 font-semibold">הילדים שלי</h2>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {children.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`min-w-[9rem] shrink-0 rounded-2xl p-4 text-right transition-all ${c.id === active?.id ? "bg-primary text-primary-foreground shadow-md" : "bg-card ring-1 ring-border"}`}
          >
            <div className="font-heading text-lg font-bold">{c.name}</div>
            <div className="text-xs opacity-80">{ageLabel(c.birth_date)}</div>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1"><Flame className="h-4 w-4" />{c.streak || 0}</span>
              <span className="flex items-center gap-1"><Star className="h-4 w-4" />{c.points || 0}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}