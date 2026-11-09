export default function ChildSwitcher({ children, active, onSelect }) {
  if (children.length < 2) return null;
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {children.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
            c.id === active?.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}