import { useEffect } from "react";
import { format } from "date-fns";

// Browser notifications while the app is open, at the child's chosen times.
export default function useReminders(child) {
  useEffect(() => {
    if (!child?.notify_times?.length || typeof Notification === "undefined") return;
    const id = setInterval(() => {
      const now = format(new Date(), "HH:mm");
      const key = `gw_notified_${child.id}_${format(new Date(), "yyyy-MM-dd")}_${now}`;
      if (child.notify_times.includes(now) && Notification.permission === "granted" && !localStorage.getItem(key)) {
        localStorage.setItem(key, "1");
        new Notification(`רגע התפתחותי עם ${child.name}`, { body: "לחצו לקבל רעיון קצר לפעילות עכשיו" });
      }
    }, 20000);
    return () => clearInterval(id);
  }, [child]);
}