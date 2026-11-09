import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function StepChild({ data, set, onNext }) {
  const ok = data.name.trim() && data.birth_date;
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-2xl font-bold">נכיר את הילד/ה</h2>
      <Input placeholder="שם" value={data.name} onChange={(e) => set({ name: e.target.value })} className="h-12 rounded-2xl" />
      <div>
        <label className="mb-1 block text-sm text-muted-foreground">תאריך לידה</label>
        <Input type="date" max={new Date().toISOString().slice(0, 10)} value={data.birth_date} onChange={(e) => set({ birth_date: e.target.value })} className="h-12 rounded-2xl" />
      </div>
      <Textarea placeholder="משהו שחשוב שנדע? (למשל: פגות, מילים ראשונות, אתגרים)" value={data.development_notes} onChange={(e) => set({ development_notes: e.target.value })} className="rounded-2xl" />
      <Button disabled={!ok} onClick={onNext} className="h-12 w-full rounded-2xl">המשך</Button>
    </div>
  );
}