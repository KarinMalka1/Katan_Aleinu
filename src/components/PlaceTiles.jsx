import { ENVIRONMENTS } from "@/lib/places";

export default function PlaceTiles({ childName, onPick }) {
  return (
    <section className="space-y-3">
      <h2 className="font-heading text-xl font-bold">איפה אתם עכשיו עם {childName}?</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {ENVIRONMENTS.map((e) => (
          <button key={e.id} onClick={() => onPick(e)} className="flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl bg-card text-lg font-semibold shadow-sm ring-1 ring-border transition-transform active:scale-[0.97]">
            <span className="text-5xl">{e.emoji}</span>{e.label}
          </button>
        ))}
      </div>
    </section>
  );
}