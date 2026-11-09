import { Button } from "@/components/ui/button";

const Q = [
  { key: "parent_role", title: "מי אתם?", options: ["אמא", "אבא", "הורה אחר"] },
  { key: "challenge", title: "מה הכי מאתגר עכשיו?", options: ["שינה", "אוכל", "משחק עצמאי", "ויסות רגשי", "דיבור", "שום דבר מיוחד"] },
  { key: "daily_minutes", title: "כמה זמן פנוי ביום לפעילות?", options: ["עד 5 דקות", "5–15 דקות", "יותר מ-15 דקות"] },
];

export default function StepQuiz({ data, set, onNext }) {
  const ok = Q.every((q) => data[q.key]);
  return (
    <div className="space-y-5">
      <h2 className="font-heading text-2xl font-bold">שלוש שאלות קצרות</h2>
      {Q.map((q) => (
        <div key={q.key}>
          <p className="mb-2 text-sm font-medium">{q.title}</p>
          <div className="flex flex-wrap gap-2">
            {q.options.map((o) => (
              <button key={o} onClick={() => set({ [q.key]: o })} className={`rounded-full px-4 py-2 text-sm transition-all ${data[q.key] === o ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                {o}
              </button>
            ))}
          </div>
        </div>
      ))}
      <Button disabled={!ok} onClick={onNext} className="h-12 w-full rounded-2xl">המשך</Button>
    </div>
  );
}