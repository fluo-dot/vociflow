
"use client";

import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ImprintPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-3xl space-y-12 animate-in fade-in duration-500">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors font-bold uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Zurück zur Startseite
        </Link>

        <section className="space-y-8">
          <h1 className="text-4xl font-headline font-bold tracking-tight">Impressum</h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Angaben gemäss Art. 3 Abs. 1 lit. s UWG</h2>
              <p>
                [Vorname Name / Projektbezeichnung]<br />
                [Strasse / Nr.]<br />
                [PLZ / Ort]<br />
                Schweiz
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Kontakt</h2>
              <p>
                E-Mail: [Deine E-Mail-Adresse]<br />
                Website: [Deine Website URL]
              </p>
            </div>

            <div className="pt-8 space-y-4 border-t">
              <h2 className="text-2xl font-headline font-bold text-slate-900 dark:text-slate-100">Haftungsausschluss</h2>
              <p>
                Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen.
              </p>
              <p>
                Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen.
              </p>
              <p>
                VociFlow ist eine Open-Source-Anwendung für private Lernzwecke. Die Nutzung erfolgt auf eigene Gefahr. Alle Daten werden ausschliesslich lokal in Ihrem Browser gespeichert.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
