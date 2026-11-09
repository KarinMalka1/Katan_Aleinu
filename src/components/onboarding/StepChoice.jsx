import { Button } from "@/components/ui/button";

export default function StepChoice({ onFull, onSkip }) {
  return (
    <div className="space-y-5">
      <h2 className="font-heading text-2xl font-bold">רוצים להתאים את ההמלצות עוד יותר?</h2>
      <p className="text-muted-foreground">כמה שאלות קצרות על השגרה ותחומי העניין יעזרו לנו להציע פעילויות מדויקות. אפשר גם לדלג ולהשלים בהמשך בתוך האפליקציה.</p>
      <Button onClick={onFull} className="h-12 w-full rounded-2xl">אמלא את השאלון עכשיו</Button>
      <Button variant="secondary" onClick={onSkip} className="h-12 w-full rounded-2xl">דלגו, אשלים אחר כך</Button>
    </div>
  );
}