"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ScrollToQuerySection() {
  const search = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const target = search.get("scroll");
    if (!target) return;

    const section = document.getElementById(target);
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });

    const params = new URLSearchParams(search.toString());
    params.delete("scroll");
    const nextQuery = params.toString();
    router.replace(nextQuery ? `/?${nextQuery}` : "/", { scroll: false });
  }, [search, router]);

  return null;
}

