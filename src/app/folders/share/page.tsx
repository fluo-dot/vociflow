
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDataStore, Folder, Deck } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Download, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function ShareContent() {
  const searchParams = useSearchParams();
  const folderId = searchParams.get("id");
  const router = useRouter();
  const { importData } = useDataStore();

  const [sharedData, setSharedData] = useState<{ folder: Folder; decks: Deck[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Da wir keine Cloud mehr haben, ist diese Seite primär ein Platzhalter für 
    // zukünftige lokale Peer-to-Peer Dateifreigaben oder einfach zum Anzeigen von Fehlern.
    setError("Einladungslinks über die Cloud werden nicht mehr unterstützt. Bitte verwende den Datei-Import.");
    setLoading(false);
  }, [folderId]);

  const handleImport = async () => {
    // Platzhalter für Import-Logik
    setImporting(true);
    setTimeout(() => {
        setImporting(false);
        setError("Dieser Link ist ungültig oder abgelaufen.");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-slate-500 font-medium">Lade Informationen...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-2xl">
        {error && (
          <Alert variant="destructive" className="rounded-3xl border-destructive/20 mb-8">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Hinweis</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success ? (
          <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center space-y-6 animate-in zoom-in duration-300">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-headline font-bold">Import erfolgreich!</h1>
            <p className="text-slate-500">Du wirst jetzt zu deiner Übersicht weitergeleitet...</p>
          </div>
        ) : sharedData ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <div className="bg-accent/10 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-accent" />
              </div>
              <h1 className="text-4xl font-headline font-bold tracking-tight">Einladung erhalten</h1>
              <p className="text-slate-500 text-lg">Ordner importieren.</p>
            </div>

            <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
              <CardHeader className="p-10 pb-6 border-b bg-slate-50/50">
                <CardTitle className="text-3xl font-headline">{sharedData.folder.title}</CardTitle>
                <CardDescription className="text-lg">{sharedData.folder.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Enthaltene Hefte ({sharedData.decks.length})
                  </h3>
                  <div className="grid gap-2">
                    {sharedData.decks.map(deck => (
                      <div key={deck.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                        <span className="font-bold text-slate-700">{deck.title}</span>
                        <span className="text-xs font-bold text-primary bg-white px-3 py-1 rounded-full border border-primary/10">
                          {deck.cards.length} Karten
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleImport} 
                  disabled={importing}
                  className="w-full h-16 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20 gap-3"
                >
                  {importing ? <Loader2 className="h-6 w-6 animate-spin" /> : <Download className="h-6 w-6" />}
                  In mein Profil importieren
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-20">
            <Button variant="outline" className="rounded-full px-8" onClick={() => router.push("/dashboard")}>
              Zurück zum Dashboard
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
      <ShareContent />
    </Suspense>
  );
}
