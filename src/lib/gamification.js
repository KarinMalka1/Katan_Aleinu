import { differenceInCalendarDays, differenceInMonths, format, parseISO } from "date-fns";

export const PRIORITIES = [
  { id: "language", label: "שפה ודיבור", emoji: "💬" },
  { id: "motor", label: "מוטוריקה", emoji: "🤸" },
  { id: "social", label: "חברתי", emoji: "🤝" },
  { id: "emotional", label: "רגשי", emoji: "💛" },
  { id: "cognitive", label: "חשיבה", emoji: "🧩" },
  { id: "creativity", label: "יצירתיות", emoji: "🎨" },
];

export const BADGES = {
  first: { label: "הצעד הראשון", emoji: "🌱" },
  streak3: { label: "3 ימים ברצף", emoji: "🔥" },
  streak7: { label: "שבוע שלם", emoji: "🌟" },
  streak14: { label: "שבועיים ברצף", emoji: "🏅" },
  act10: { label: "10 פעילויות", emoji: "🎈" },
  act25: { label: "25 פעילויות", emoji: "🏆" },
  photo: { label: "צלם/ת רגעים", emoji: "📸" },
};

export const today = () => format(new Date(), "yyyy-MM-dd");

export const ageInMonths = (birth) => (birth ? Math.max(0, differenceInMonths(new Date(), parseISO(birth))) : 0);

export const ageLabel = (birth) => {
  const m = ageInMonths(birth);
  if (m < 12) return `${m} חודשים`;
  const y = Math.floor(m / 12);
  const r = m % 12;
  return r ? `${y} שנים ו-${r} חודשים` : `${y} שנים`;
};

// Returns the child field updates + earned info for a new report
export function applyReport(child, source) {
  const t = today();
  let streak = child.streak || 0;
  if (child.last_report_date !== t) {
    const gap = child.last_report_date ? differenceInCalendarDays(parseISO(t), parseISO(child.last_report_date)) : null;
    streak = gap === 1 ? streak + 1 : 1;
  }
  const total = (child.total_activities || 0) + 1;
  const points = 10 + (streak >= 3 ? 5 : 0);
  const have = new Set(child.badges || []);
  const earned = [];
  const award = (id, ok) => { if (ok && !have.has(id)) { have.add(id); earned.push(id); } };
  award("first", total >= 1);
  award("streak3", streak >= 3);
  award("streak7", streak >= 7);
  award("streak14", streak >= 14);
  award("act10", total >= 10);
  award("act25", total >= 25);
  award("photo", source === "photo");
  return {
    points,
    earned,
    update: {
      points: (child.points || 0) + points,
      streak,
      best_streak: Math.max(child.best_streak || 0, streak),
      total_activities: total,
      last_report_date: t,
      badges: [...have],
    },
  };
}