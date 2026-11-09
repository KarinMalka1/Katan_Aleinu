import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import useChildren from "@/hooks/useChildren";
import StepChild from "@/components/onboarding/StepChild";
import StepChoice from "@/components/onboarding/StepChoice";
import StepRoutine from "@/components/onboarding/StepRoutine";
import StepPartner from "@/components/onboarding/StepPartner";
import StepQuiz from "@/components/onboarding/StepQuiz";
import StepInterests from "@/components/onboarding/StepInterests";

export default function Onboarding() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { pathname } = useLocation();
  const { children } = useChildren();
  const isFirst = pathname !== "/add-child";
  const [step, setStep] = useState(0);
  const [full, setFull] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({ name: "", birth_date: "", development_notes: "", priorities: [], notify_times: ["09:00"], partner_email: "", parent_role: "", challenge: "", daily_minutes: "", day_type: "", routine: [], child_interests: [], parent_interests: [] });
  const set = (patch) => setData((d) => ({ ...d, ...patch }));
  const next = () => setStep((s) => s + 1);

  const finish = async () => {
    setSaving(true);
    const me = await base44.auth.me();
    const partner = data.partner_email.trim();
    const { partner_email, ...child } = data;
    const notify_times = isFirst ? child.notify_times : children[0]?.notify_times || child.notify_times;
    const created = await base44.entities.Child.create({ ...child, notify_times, parent_emails: partner ? [me.email, partner] : [me.email], points: 0, streak: 0, total_activities: 0, badges: [] });
    if (partner) {
      try { await base44.users.inviteUser(partner, "user"); } catch { /* partner may already exist or invite is not permitted */ }
    }
    await qc.invalidateQueries({ queryKey: ["children"] });
    localStorage.setItem("growwith_active_child", created.id);
    navigate("/");
  };

  const steps = [
    <StepChild key="c" data={data} set={set} onNext={next} />,
    <StepChoice key="ch" onFull={() => { setFull(true); next(); }} onSkip={() => { setFull(false); next(); }} />,
    ...(full ? [
      <StepQuiz key="q" data={data} set={set} onNext={next} />,
      <StepInterests key="i" data={data} set={set} onNext={next} />,
    ] : []),
    ...(isFirst ? [<StepRoutine key="r" data={data} set={set} onNext={next} />] : []),
    <StepPartner key="p" data={data} set={set} onFinish={finish} saving={saving} />,
  ];

  return (
    <div className="space-y-6 pt-4">
      <div className="flex gap-2">
        {steps.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-secondary"}`} />)}
      </div>
      {steps[step]}
    </div>
  );
}