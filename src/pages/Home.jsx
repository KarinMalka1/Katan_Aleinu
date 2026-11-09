import { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Camera, Lightbulb, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import useChildren from "@/hooks/useChildren";
import useReminders from "@/hooks/useReminders";
import PlaceTiles from "@/components/PlaceTiles";
import { ageInMonths, ageLabel, applyReport, today } from "@/lib/gamification";
import ChildrenOverview from "@/components/ChildrenOverview";
import ChildPlacesDialog from "@/components/ChildPlacesDialog";
import StatsStrip from "@/components/StatsStrip";
import SuggestionCard from "@/components/SuggestionCard";
import CelebrationDialog from "@/components/CelebrationDialog";
import FeedbackDialog from "@/components/FeedbackDialog";

export default function Home() {
  const { children, active, select, isLoading, refetch } = useChildren();
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [result, setResult] = useState(null);
  const [placeEnv, setPlaceEnv] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const fileRef = useRef(null);
  useReminders(active);

  if (isLoading) return <div className="flex justify-center pt-32"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>;
  if (!active) return <Navigate to="/onboarding" replace />;

  const ask = async (source, photoUrl) => {
    setLoading(true);
    setSuggestion(null);
    try {
      const res = await base44.functions.invoke("suggestActivity", {
        name: active.name,
        age_months: ageInMonths(active.birth_date),
        priorities: active.priorities || [],
        notes: [active.development_notes, active.challenge && `אתגר מרכזי: ${active.challenge}`, active.daily_minutes && `זמן פנוי: ${active.daily_minutes}`, active.day_type && `מבנה היום: ${active.day_type}`, active.routine?.length && `רגעי שגרה מתאימים: ${active.routine.join(", ")}`, active.child_interests?.length && `תחומי עניין של הילד: ${active.child_interests.join(", ")}`, active.parent_interests?.length && `תחומי עניין של ההורה: ${active.parent_interests.join(", ")}`].filter(Boolean).join(". "),
        photo_url: photoUrl,
      });
      if (res.data?.error) throw new Error(res.data.error);
      setSuggestion({ ...res.data, source });
    } catch {
      toast.error("לא הצלחנו להכין רעיון, נסו שוב");
    }
    setLoading(false);
  };

  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setLoading(true);
    const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
    const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri, expires_in: 600 });
    await ask("photo", signed_url);
  };

  const report = async (feedback) => {
    setReporting(true);
    const r = applyReport(active, suggestion.source);
    await base44.entities.Report.create({
      child_id: active.id,
      child_name: active.name,
      activity_title: suggestion.title,
      activity_description: suggestion.description,
      source: suggestion.source,
      points: r.points,
      report_date: today(),
      ...feedback,
      parent_emails: active.parent_emails || [],
    });
    await base44.entities.Child.update(active.id, r.update);
    await refetch();
    setResult({ points: r.points, streak: r.update.streak, earned: r.earned });
    setSuggestion(null);
    setFeedbackOpen(false);
    setReporting(false);
  };

  return (
    <div className="space-y-6">
      <ChildrenOverview children={children} active={active} onSelect={(id) => { select(id); setSuggestion(null); }} />
      <ChildPlacesDialog key={active.id} child={active} env={placeEnv} onClose={() => setPlaceEnv(null)} onStart={(a) => { setPlaceEnv(null); setSuggestion({ ...a, source: "idea" }); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
      <header>
        <p className="text-sm text-muted-foreground">{ageLabel(active.birth_date)}</p>
        <h1 className="font-heading text-3xl font-bold">הי, מה עושים עם {active.name}?</h1>
      </header>
      <StatsStrip child={active} />

      {!active.day_type && (
        <Link to="/complete-profile" className="block rounded-2xl bg-accent p-4 text-accent-foreground">
          <p className="font-semibold">השלימו את הפרופיל של {active.name}</p>
          <p className="text-sm">כמה שאלות קצרות לרעיונות מדויקים יותר</p>
        </Link>
      )}

      {!suggestion && !loading && (
        <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          <button onClick={() => ask("idea")} className="flex h-24 w-full items-center justify-center gap-3 rounded-[2rem] bg-primary text-xl font-semibold text-primary-foreground shadow-md transition-transform active:scale-[0.98]">
            <Lightbulb className="h-7 w-7" /> רעיון לעכשיו
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex h-20 w-full items-center justify-center gap-3 rounded-[2rem] bg-accent text-lg font-semibold text-accent-foreground transition-transform active:scale-[0.98]">
            <Camera className="h-6 w-6" /> צלמו חפץ או מקום וקבלו רעיון
          </button>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onPhoto} />
        </div>
      )}

      {!suggestion && !loading && (
        <PlaceTiles childName={active.name} onPick={setPlaceEnv} />
      )}

      <SuggestionCard suggestion={suggestion} loading={loading} reporting={false} onReport={() => setFeedbackOpen(true)} onDismiss={() => setSuggestion(null)} />
      <FeedbackDialog open={feedbackOpen} saving={reporting} onClose={() => setFeedbackOpen(false)} onSubmit={report} />
      <CelebrationDialog result={result} onClose={() => setResult(null)} />
    </div>
  );
}