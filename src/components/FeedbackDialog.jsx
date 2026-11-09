import { useEffect, useState } from "react";
import { Loader2, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const QUESTIONS = [
  { key: "engagement", text: "עד כמה הילד/ה היו מעורבים בפעילות?", options: ["מעט", "בינוני", "הרבה"] },
  { key: "experience", text: "איך היה לכם לבצע את הפעילות?", options: ["קשה", "בסדר", "קל וכיף"] },
];

export default function FeedbackDialog({ open, saving, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [answers, setAnswers] = useState({});
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) { setRating(0); setAnswers({}); setNotes(""); }
  }, [open]);

  const ready = rating > 0 && QUESTIONS.every((q) => answers[q.key]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !saving && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">איך היה?</DialogTitle>
          <DialogDescription>משוב קצר ואז מקבלים את הנקודות</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-1" dir="ltr">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} aria-label={`${n} כוכבים`}>
              <Star className={`h-9 w-9 ${n <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
            </button>
          ))}
        </div>
        {QUESTIONS.map((q) => (
          <div key={q.key} className="space-y-2">
            <p className="font-semibold">{q.text}</p>
            <div className="grid grid-cols-3 gap-2">
              {q.options.map((o) => (
                <button key={o} onClick={() => setAnswers({ ...answers, [q.key]: o })} className={`rounded-2xl px-2 py-3 text-sm font-medium ${answers[q.key] === o ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{o}</button>
              ))}
            </div>
          </div>
        ))}
        <div className="space-y-2">
          <p className="font-semibold">הערות חופשיות (לא חובה)</p>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="מה שתרצו לזכור מהפעילות…" className="rounded-2xl" />
        </div>
        <Button disabled={!ready || saving} onClick={() => onSubmit({ rating, ...answers, notes: notes.trim() })} className="h-12 w-full rounded-2xl text-base">
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "שליחה וקבלת נקודות"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}