import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StepPartner({ data, set, onFinish, saving }) {
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-2xl font-bold">להזמין את בן/בת הזוג?</h2>
      <p className="text-sm text-muted-foreground">שניכם תראו את אותו פרופיל, רצף ונקודות. אפשר גם לדלג ולהוסיף אחר כך.</p>
      <Input type="email" dir="ltr" placeholder="email@example.com" value={data.partner_email} onChange={(e) => set({ partner_email: e.target.value })} className="h-12 rounded-2xl" />
      <Button disabled={saving} onClick={onFinish} className="h-12 w-full rounded-2xl">
        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "סיימנו, יוצאים לדרך"}
      </Button>
    </div>
  );
}