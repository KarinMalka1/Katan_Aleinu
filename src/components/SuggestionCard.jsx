import { Button } from "@/components/ui/button";
import { Loader2, Clock, Sparkles, Check } from "lucide-react";

export default function SuggestionCard({ suggestion, loading, reporting, onReport, onDismiss }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[2rem] bg-card p-8 shadow-sm ring-1 ring-border">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">מכינים רעיון מותאם בשבילכם…</p>
      </div>
    );
  }
  if (!suggestion) return null;
  return (
    <div className="space-y-4 rounded-[2rem] bg-card p-6 shadow-md ring-1 ring-border animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1 text-primary"><Sparkles className="h-3.5 w-3.5" />{suggestion.source === "photo" ? "מהתמונה שלכם" : "רעיון לעכשיו"}</span>
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{Math.round(suggestion.minutes || 5)} דק׳</span>
      </div>
      <h2 className="font-heading text-2xl font-bold leading-snug">{suggestion.title}</h2>
      <p className="leading-relaxed text-foreground/80">{suggestion.description}</p>
      <p className="rounded-2xl bg-accent px-4 py-3 text-sm text-accent-foreground">💡 {suggestion.why}</p>
      <Button onClick={onReport} disabled={reporting} className="h-14 w-full rounded-2xl text-lg">
        {reporting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Check className="me-2 h-5 w-5" />עשינו את זה!</>}
      </Button>
      <button onClick={onDismiss} className="w-full text-sm text-muted-foreground">לא עכשיו</button>
    </div>
  );
}