"use client";

import { useEffect, useState } from "react";

export function useCompanyId() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/company", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setCompanyId(d.companyId ?? null))
      .finally(() => setLoading(false));
  }, []);

  return { companyId, loading };
}
