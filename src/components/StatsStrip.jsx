export default function StatsStrip({ child }) {
  const stats = [
    { emoji: "🔥", value: child.streak || 0, label: "ימים ברצף" },
    { emoji: "⭐", value: child.points || 0, label: "נקודות" },
    { emoji: "🎈", value: child.total_activities || 0, label: "פעילויות" },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-3xl bg-card p-3 text-center shadow-sm ring-1 ring-border">
          <div className="text-xl">{s.emoji}</div>
          <div className="text-xl font-bold text-foreground">{s.value}</div>
          <div className="text-[11px] text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  );
}