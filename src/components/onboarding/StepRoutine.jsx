import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PRIORITIES } from "@/lib/gamification";

export default function StepRoutine({ data, set, onNext }) {
  const toggle = (id) => set({ priorities: data.priorities.includes(id) ? data.priorities.filter((p) => p !== id) : [...data.priorities, id] });
  const addTime = (t) => t && !data.notify_times.includes(t) && set({ notify_times: [...data.notify_times, t].sort() });
  const enableNotif = () => typeof Notification !== "undefined" && Notification.requestPermission();
  return (
    <div className="space-y-5">
      <h2 className="font-heading text-2xl font-bold">מה חשוב לכם?</h2>
      <div className="flex flex-wrap gap-2">
        {PRIORITIES.map((p) => (
          <button key={p.id} onClick={() => toggle(p.id)} className={`rounded-full px-4 py-2 text-sm transition-all ${data.priorities.includes(p.id) ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
            {p.emoji} {p.label}
          </button>
        ))}
      </div>
      <div>
        <label className="mb-1 block text-sm text-muted-foreground">מתי נעדכן אתכם? (בוקר, אחה״צ, לפני שינה…)</label>
        <Input type="time" onChange={(e) => { addTime(e.target.value); e.target.value = ""; }} className="h-12 rounded-2xl" />
        <div className="mt-2 flex flex-wrap gap-2">
          {data.notify_times.map((t) => (
            <span key={t} className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">
              {t}<button onClick={() => set({ notify_times: data.notify_times.filter((x) => x !== t) })}><X className="h-3.5 w-3.5" /></button>
            </span>
          ))}
        </div>
        <button onClick={enableNotif} className="mt-3 text-sm text-primary underline">אפשרו התראות בדפדפן</button>
      </div>
      <Button onClick={onNext} className="h-12 w-full rounded-2xl">המשך</Button>
    </div>
  );
}