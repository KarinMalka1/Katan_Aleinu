import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import useChildren from "@/hooks/useChildren";
import { BADGES } from "@/lib/gamification";
import ChildrenOverview from "@/components/ChildrenOverview";
import StatsStrip from "@/components/StatsStrip";

export default function Progress() {
  const { children, active, select } = useChildren();
  const { data: reports, isLoading } = useQuery({
    queryKey: ["reports", active?.id],
    enabled: !!active,
    queryFn: async () => (await base44.entities.Report.filter({ child_id: active.id }, { sort: "-created_date", limit: 50 })).items ?? [],
  });

  if (!active) return <p className="pt-20 text-center text-muted-foreground">עוד אין ילדים. הוסיפו ילד כדי להתחיל.</p>;

  return (
    <div className="space-y-6">
      <ChildrenOverview children={children} active={active} onSelect={select} />
      <h1 className="font-heading text-3xl font-bold">ההתקדמות של {active.name}</h1>
      <StatsStrip child={active} />
      <section>
        <h2 className="mb-2 font-semibold">תגים</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(BADGES).map(([id, b]) => {
            const got = (active.badges || []).includes(id);
            return (
              <div key={id} className={`rounded-2xl px-3 py-2 text-sm ${got ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground opacity-50"}`}>
                {b.emoji} {b.label}
              </div>
            );
          })}
        </div>
      </section>
      <section>
        <h2 className="mb-2 font-semibold">היסטוריית פעילויות</h2>
        {isLoading ? <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" /> : !reports?.length ? (
          <p className="text-sm text-muted-foreground">עוד לא דווחה פעילות. הרעיון הראשון מחכה בבית.</p>
        ) : (
          <ul className="space-y-2">
            {reports.map((r) => (
              <li key={r.id} className="flex items-center justify-between rounded-2xl bg-card p-4 ring-1 ring-border">
                <div>
                  <div className="font-medium">{r.activity_title}</div>
                  <div className="text-xs text-muted-foreground">{r.report_date && format(parseISO(r.report_date), "dd/MM/yyyy")} · {r.created_by?.split("@")[0]}</div>
                </div>
                <span className="text-sm font-semibold text-primary">+{r.points}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}