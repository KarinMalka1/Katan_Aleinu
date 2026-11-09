import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BADGES } from "@/lib/gamification";

export default function CelebrationDialog({ result, onClose }) {
  useEffect(() => {
    if (result) confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 }, colors: ["#8fb996", "#f4b393", "#f7dc9b"], scalar: 0.8 });
  }, [result]);
  if (!result) return null;
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent dir="rtl" className="max-w-xs rounded-[2rem] text-center">
        <div className="text-5xl">🎉</div>
        <DialogTitle className="text-center font-heading text-2xl">כל הכבוד!</DialogTitle>
        <DialogDescription className="text-center text-base text-foreground/80">
          +{result.points} נקודות · רצף של {result.streak} {result.streak === 1 ? "יום" : "ימים"} 🔥
        </DialogDescription>
        {result.earned.map((id) => (
          <div key={id} className="rounded-2xl bg-accent p-3 text-accent-foreground">
            <span className="text-2xl">{BADGES[id].emoji}</span>
            <div className="text-sm font-semibold">תג חדש: {BADGES[id].label}</div>
          </div>
        ))}
        <Button onClick={onClose} className="h-12 rounded-2xl">מעולה</Button>
      </DialogContent>
    </Dialog>
  );
}