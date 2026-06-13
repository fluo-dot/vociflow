
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Da Authentifizierung entfernt wurde, leiten wir jeden Besucher der Auth-Seite direkt zum Dashboard weiter
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground animate-pulse">Weiterleitung zum Dashboard...</p>
    </div>
  );
}
