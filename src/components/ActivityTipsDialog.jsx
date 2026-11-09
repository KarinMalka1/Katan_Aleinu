import { useEffect, useState } from "react";
import { Loader2, Lightbulb } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";

export default function ActivityTipsDialog({ activity, onClose, onStart }) {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!activity) return;
    setFailed(false);
    if (activity.tips?.length) { setTips(activity.tips); return; }
    setTips([]);
    setLoading(true);
    base44.functions.invoke("activityTips", { activity_id: activity.id })
      .then((res) => { if (res.data?.error) throw new Error(); setTips(res.data.tips || []); })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [activity?.id]);

  return (
    <Dialog open={!!activity} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl" dir="rtl">
        {activity && (
          <>
            {activity.image_url && <Image src={activity.image_url} alt={activity.title} className="h-44 w-full rounded-2xl" />}
            <DialogHeader className="text-right">
              <DialogTitle className="font-heading text-2xl">{activity.title}</DialogTitle>
              <DialogDescription className="text-right">{activity.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <h3 className="flex items-center gap-1 font-semibold text-primary"><Lightbulb className="h-4 w-4" />טיפים והמלצות להורה</h3>
              {loading && <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />מכינים טיפים…</div>}
              {failed && <p className="text-sm text-muted-foreground">לא הצלחנו לטעון טיפים, נסו לפתוח שוב.</p>}
              <ul className="space-y-2">
                {tips.map((t, i) => <li key={i} className="rounded-2xl bg-accent px-4 py-3 text-sm text-accent-foreground">{t}</li>)}
              </ul>
            </div>
            <Button onClick={() => onStart(activity)} className="h-12 w-full rounded-2xl text-base">מתחילים את הפעילות</Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}