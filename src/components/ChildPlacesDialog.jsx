import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import ActivityTipsDialog from "@/components/ActivityTipsDialog";

export default function ChildPlacesDialog({ child, env, onClose, onStart }) {
  const [sub, setSub] = useState(null);
  const [selected, setSelected] = useState(null);
  const place = env && sub ? `${env.id}.${sub.id}` : null;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["places", child.id, place],
    enabled: !!place,
    retry: false,
    queryFn: async () => {
      const load = async () => (await base44.entities.Activity.filter({ child_id: child.id, place }, { limit: 20 })).items ?? [];
      const items = await load();
      if (items.length) return items;
      const res = await base44.functions.invoke("placeIdeas", { child_id: child.id, place });
      if (res.data?.error) throw new Error(res.data.error);
      return load();
    },
  });
  const close = () => { setSub(null); onClose(); };

  return (
    <Dialog open={!!env} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="font-heading text-2xl">{env?.emoji} {env?.label}{sub ? ` · ${sub.label}` : ""}</DialogTitle>
          <DialogDescription className="text-right">{sub ? `רעיונות ל${child.name}, מותאמים לגיל ולסיטואציה` : "מה עושים עכשיו?"}</DialogDescription>
        </DialogHeader>
        {!sub && (
          <div className="grid grid-cols-2 gap-3">
            {env?.subs.map((s) => (
              <button key={s.id} onClick={() => setSub(s)} className="flex h-24 flex-col items-center justify-center gap-1 rounded-3xl bg-secondary font-semibold transition-transform active:scale-[0.97]">
                <span className="text-3xl">{s.emoji}</span>{s.label}
              </button>
            ))}
          </div>
        )}
        {sub && <button onClick={() => setSub(null)} className="flex items-center gap-1 text-sm text-primary"><ArrowRight className="h-4 w-4" />חזרה</button>}
        {sub && isLoading && <div className="flex flex-col items-center gap-2 py-10 text-sm text-muted-foreground"><Loader2 className="h-7 w-7 animate-spin text-primary" />מכינים רעיונות ל{child.name}…</div>}
        {sub && isError && <p className="py-6 text-center text-sm text-muted-foreground">לא הצלחנו להכין רעיונות, נסו שוב.</p>}
        <div className="grid grid-cols-2 gap-3">
          {(sub ? data || [] : []).map((a) => (
            <button key={a.id} onClick={() => setSelected(a)} className="relative aspect-square overflow-hidden rounded-3xl bg-secondary text-right active:scale-[0.97]">
              {a.image_url && <Image src={a.image_url} alt={a.title} className="absolute inset-0 h-full w-full" />}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                <span className="font-semibold leading-tight text-white">{a.title}</span>
              </div>
            </button>
          ))}
        </div>
        <ActivityTipsDialog activity={selected} onClose={() => setSelected(null)} onStart={(a) => { setSelected(null); setSub(null); onStart(a); }} />
      </DialogContent>
    </Dialog>
  );
}