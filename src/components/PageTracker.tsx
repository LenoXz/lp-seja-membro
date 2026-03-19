"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function PageTracker() {
  useEffect(() => {
    supabase.from("page_views").insert({
      page: window.location.pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    });
  }, []);

  return null;
}
