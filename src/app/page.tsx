
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ShieldCheck, ArrowRight, Lock, Share2, Layers } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  const faqs = [
    {
      question: "Ist VociFlow wirklich kostenlos?",
      answer: "Ja, VociFlow ist komplett kostenlos und werbefrei. Da wir keine Server für deine Daten benötigen, bleibt die App dauerhaft kostenfrei."
    },
    {
      question: "Wo werden meine Daten gespeichert?",
      answer: "Deine Daten werden ausschließlich lokal im Speicher deines Browsers (LocalStorage) auf deinem Gerät gesichert. Deine Vokabeln verlassen niemals dein Gerät."
    },
    {
      question: "Wie kann ich meine Vokabeln sichern?",
      answer: "Über die Backup-Funktion im Dashboard kannst du jederzeit deine gesamte Mediathek als .json-Datei herunterladen. So sind deine Daten sicher, auch wenn du den Browser wechselst."
    },
    {
      question: "Kann ich meine Lernsets mit anderen teilen?",
      answer: "Ja! Du kannst jedes Lernset einzeln exportieren und die Datei an Freunde senden. Diese können die Datei einfach importieren und sofort mit dem Lernen beginnen."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 px-4 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="container mx-auto max-w-5xl text-center space-y-10 relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 animate-in fade-in slide-in-from-top-4 duration-700">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">100% Lokal 100% Kostenlos</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Vokabeln meistern <br /> 
              <span className="text-primary italic">mit Flow.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Die intelligente Art zu lernen. Ohne Accounts, ohne Cloud und komplett offline. Deine Daten gehören nur dir.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Link href="/dashboard">
                <Button size="lg" className="h-16 px-12 text-xl rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  Jetzt starten <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 border-y bg-slate-50/50 dark:bg-slate-900/10">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: <Lock className="h-8 w-8 text-primary" />,
                  title: "Privatsphäre zuerst",
                  desc: "Keine Anmeldung, kein Tracking. Deine Lernsets werden lokal gespeichert und verlassen nie dein Gerät.",
                },
                {
                  icon: <Share2 className="h-8 w-8 text-accent" />,
                  title: "Einfaches Teilen",
                  desc: "Exportiere Lernsets als JSON-Datei und teile sie mit Freunden. Ein Import genügt zum Loslegen.",
                },
                {
                  icon: <Layers className="h-8 w-8 text-amber-500" />,
                  title: "Fokus auf Erfolg",
                  desc: "Intelligente Modi wie Karteikarten-Wischen und Schreib-Training für maximalen Lernerfolg.",
                }
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-950 border border-slate-100 dark:border-border shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="bg-slate-50 dark:bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-4 bg-white dark:bg-slate-950">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-bold tracking-tight">Häufige Fragen</h2>
              <p className="text-slate-500 font-medium font-headline uppercase tracking-widest text-sm">Alles Wichtige auf einen Blick</p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-2xl px-6 bg-slate-50/30 dark:bg-slate-900/10 border-slate-100 dark:border-border overflow-hidden">
                  <AccordionTrigger className="text-lg font-bold hover:no-underline py-6 text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-slate-500 dark:text-slate-400 text-base pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-4 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
          <div className="container mx-auto max-w-4xl text-center space-y-10 relative">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Bereit für den Flow?</h2>
            <p className="text-xl opacity-90 font-medium">Starte jetzt und erlebe Vokabellernen ohne Grenzen.</p>
            <Link href="/dashboard" className="inline-block">
              <Button size="lg" variant="secondary" className="h-16 px-12 text-xl rounded-2xl font-bold text-primary shadow-2xl hover:bg-white transition-all">
                Kostenlos starten
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="py-12 border-t bg-white dark:bg-background">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-primary p-2 rounded-xl">
              <Zap className="h-5 w-5 text-white fill-current" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tight text-primary">VociFlow</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Entwickelt für privates Lernen. 100% Local-First.</p>
        </div>
      </footer>
    </div>
  );
}
