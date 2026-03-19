"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default function PageTracker() {
  useEffect(() => {
    async function track() {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const visitorId = result.visitorId;

      const { error } = await supabase.from("page_views").insert({
        page: window.location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        visitor_id: visitorId,
      });

      if (error) console.error("[PageTracker] Erro ao registrar acesso:", error);
    }

    track();
  }, []);

  return null;
}
