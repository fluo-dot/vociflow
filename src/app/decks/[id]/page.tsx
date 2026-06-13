"use client";

import { use } from "react";
import { useDataStore } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PencilLine, Layers, Loader2, Edit3, BookOpen, Share2, Download } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function DeckDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { decks, loading, exportSingleDeck } = useDataStore();
  
  const deck = decks.find(d => d.id === id);

  if (loading) return <div className="p-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>;
  if (!deck) return <div className="p-20 text-center text-destructive font-bold">Heft nicht gefunden</div>;

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all mb-4 font-bold uppercase tracking-wider group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Zurück zum Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-card p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-border hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 w-fit px-4 py-1.5 rounded-full uppercase tracking-widest">
              {deck.languageFront} → {deck.languageBack}
            </div>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{deck.title}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">{deck.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Link href={`/decks/${id}/study`}>
              <Button variant="outline" size="lg" className="rounded-2xl gap-3 h-16 px-8 text-lg font-bold border-2 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95">
                <Layers className="h-6 w-6" /> Karten
              </Button>
            </Link>
            <Link href={`/decks/${id}/quiz`}>
              <Button size="lg" className="rounded-2xl gap-3 h-16 px-8 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                <PencilLine className="h-6 w-6" /> Schreiben
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
            <h2 className="font-headline text-2xl font-bold flex items-center gap-3">
              <BookOpen className="h-7 w-7 text-primary" />
              Vokabelliste ({deck.cards.length})
            </h2>
            
            <div className="flex items-center gap-2">
              <Link href={`/decks/${id}/edit`}>
                <Button variant="ghost" className="text-slate-500 hover:text-primary font-bold gap-2 rounded-xl transition-all">
                  <Edit3 className="h-4 w-4" /> Bearbeiten
                </Button>
              </Link>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-slate-500 hover:text-primary font-bold gap-2 rounded-xl transition-all">
                    <Share2 className="h-4 w-4" /> Exportieren
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2rem] animate-in zoom-in-95">
                  <DialogHeader>
                    <DialogTitle>Lernset exportieren</DialogTitle>
                    <DialogDescription>
                      Exportiere das Lernset "{deck.title}" als JSON-Datei. Du kannst diese Datei an Freunde senden, damit sie das Set importieren können.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button onClick={() => exportSingleDeck(id)} className="w-full h-12 rounded-xl font-bold gap-2">
                      <Download className="h-4 w-4" /> Datei jetzt herunterladen
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="space-y-4">
            {deck.cards.map((card, idx) => (
              <Card 
                key={card.id} 
                className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all rounded-[1.5rem] bg-white dark:bg-card border border-slate-50 dark:border-border animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{deck.languageFront}</span>
                      <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{card.front}</p>
                    </div>
                    <div className="space-y-1 md:border-l md:pl-8 border-slate-100 dark:border-border">
                      <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{deck.languageBack}</span>
                      <p className="text-xl text-slate-700 dark:text-slate-300">{card.back}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {deck.cards.length === 0 && (
              <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/20 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-border animate-in fade-in">
                <p className="text-muted-foreground font-medium mb-6">Dieses Heft ist noch leer.</p>
                <Link href={`/decks/${id}/edit`}>
                  <Button className="rounded-full px-8 h-12 font-bold hover:scale-105 active:scale-95 transition-transform">Vokabeln hinzufügen</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
