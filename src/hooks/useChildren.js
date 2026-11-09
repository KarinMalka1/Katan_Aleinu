import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const KEY = "growwith_active_child";

export default function useChildren() {
  const [activeId, setActiveId] = useState(() => localStorage.getItem(KEY));
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["children"],
    queryFn: async () => (await base44.entities.Child.list({ sort: "created_date", limit: 20 })).items ?? [],
  });
  const children = data || [];
  const active = children.find((c) => c.id === activeId) || children[0] || null;
  const select = (id) => { localStorage.setItem(KEY, id); setActiveId(id); };
  return { children, active, select, isLoading, refetch };
}