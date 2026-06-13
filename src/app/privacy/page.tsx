
"use client";

import { Navbar } from "@/components/Navbar";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl space-y-12 animate-in fade-in duration-500">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors font-bold uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Zurück zur Startseite
        </Link>

        <section className="space-y-8">
          <div className="flex items-center gap-3 text-green-500 font-bold text-sm bg-green-50 dark:bg-green-900/10 w-fit px-4 py-1.5 rounded-full uppercase tracking-widest">
            <ShieldCheck className="h-5 w-5" /> DATENSCHUTZ NACH DSG
          </div>
          
          <h1 className="text-4xl font-headline font-bold tracking-tight">Datenschutzerklärung</h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-400">
            <p className="text-lg leading-relaxed">
              Gestützt auf Artikel 13 der schweizerischen Bundesverfassung und die datenschutzrechtlichen Bestimmungen des Bundes (Datenschutzgesetz, DSG) hat jede Person Anspruch auf Schutz ihrer Privatsphäre sowie auf Schutz vor Missbrauch ihrer persönlichen Daten.
            </p>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">1. Local-First-Prinzip</h2>
              <p>
                VociFlow speichert <strong>keine</strong> personenbezogenen Daten auf externen Servern. Die Anwendung funktioniert lokal in Ihrem Webbrowser. Wir haben keinen Zugriff auf Ihre Lerninhalte oder Ihren Fortschritt.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">2. Datenspeicherung im Browser</h2>
              <p>
                Alle Daten werden mittels der Web Storage API (LocalStorage) direkt auf Ihrem Endgerät abgelegt. Diese Daten verbleiben dort, bis Sie diese manuell löschen oder den Browser-Cache leeren.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">3. Hosting</h2>
              <p>
                Beim Zugriff auf diese Website werden keine Log-Files oder Analysedaten gespeichert, die Rückschlüsse auf Ihre Person zulassen. Wir verwenden keine Cookies und keine Tracking-Tools.
              </p>
            </div>

            <div className="space-y-4 pt-8 border-t">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">4. Ihre Rechte</h2>
              <p>
                Da wir keine Daten von Ihnen besitzen, können Sie Ihre Rechte (Auskunft, Berichtigung, Löschung) direkt an Ihrem eigenen Gerät ausüben, indem Sie die lokalen Browserdaten verwalten.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
