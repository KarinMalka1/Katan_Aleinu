import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import useChildren from "@/hooks/useChildren";
import StepQuiz from "@/components/onboarding/StepQuiz";
import StepInterests from "@/components/onboarding/StepInterests";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { active, isLoading } = useChildren();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(null);
  if (isLoading) return null;
  if (!active) { navigate("/onboarding"); return null; }
  const d = data || { parent_role: active.parent_role || "", challenge: active.challenge || "", daily_minutes: active.daily_minutes || "", day_type: active.day_type || "", routine: active.routine || [], child_interests: active.child_interests || [], parent_interests: active.parent_interests || [] };
  const set = (patch) => setData({ ...d, ...patch });

  const save = async () => {
    await base44.entities.Child.update(active.id, d);
    await qc.invalidateQueries({ queryKey: ["children"] });
    navigate("/");
  };

  return (
    <div className="space-y-6 pt-4">
      <p className="text-sm text-muted-foreground">השלמת הפרופיל של {active.name}</p>
      {step === 0 ? <StepQuiz data={d} set={set} onNext={() => setStep(1)} /> : <StepInterests data={d} set={set} onNext={save} />}
    </div>
  );
}