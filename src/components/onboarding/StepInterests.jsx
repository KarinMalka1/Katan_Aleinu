import { Button } from "@/components/ui/button";

const SINGLE = [
  { key: "day_type", title: "איך נראה היום של הילד/ה?", options: ["בבית עם הורה", "בגן/מעון בבוקר", "עם מטפלת/סבא וסבתא", "משתנה"] },
];

const MULTI = [
  { key: "routine", title: "באילו רגעים ביום אפשר לשלב פעילות?", options: ["ארוחות", "החלפה/הלבשה", "מקלחת", "נסיעה", "משחק חופשי", "טיול בחוץ", "לפני שינה", "בדרך מהגן"] },
  { key: "child_interests", title: "מה הילד/ה אוהב/ת?", options: ["מוזיקה ושירים", "חיות", "רכבים", "בובות", "ספרים", "מים", "ציור ויצירה", "תנועה וריקוד", "בנייה וקוביות"] },
  { key: "parent_interests", title: "מה אתם אוהבים לעשות?", options: ["בישול", "טבע וטיולים", "קריאה", "ספורט", "מוזיקה", "אמנות", "טכנולוגיה", "משחקי קופסה"] },
];

export default function StepInterests({ data, set, onNext }) {
  const toggle = (key, o) => set({ [key]: data[key].includes(o) ? data[key].filter((x) => x !== o) : [...data[key], o] });
  const chip = (on) => `rounded-full px-4 py-2 text-sm transition-all ${on ? "bg-primary text-primary-foreground" : "bg-secondary"}`;
  const ok = data.day_type && MULTI.every((q) => data[q.key].length);
  return (
    <div className="space-y-5">
      <h2 className="font-heading text-2xl font-bold">סדר יום ותחומי עניין</h2>
      {SINGLE.map((q) => (
        <div key={q.key}>
          <p className="mb-2 text-sm font-medium">{q.title}</p>
          <div className="flex flex-wrap gap-2">
            {q.options.map((o) => <button key={o} onClick={() => set({ [q.key]: o })} className={chip(data[q.key] === o)}>{o}</button>)}
          </div>
        </div>
      ))}
      {MULTI.map((q) => (
        <div key={q.key}>
          <p className="mb-2 text-sm font-medium">{q.title} <span className="text-muted-foreground">(אפשר כמה)</span></p>
          <div className="flex flex-wrap gap-2">
            {q.options.map((o) => <button key={o} onClick={() => toggle(q.key, o)} className={chip(data[q.key].includes(o))}>{o}</button>)}
          </div>
        </div>
      ))}
      <Button disabled={!ok} onClick={onNext} className="h-12 w-full rounded-2xl">המשך</Button>
    </div>
  );
}