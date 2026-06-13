
"use client";

import { use, useState } from "react";
import { useDataStore } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GraduationCap, Plus, BookOpen, Trash2, Languages, Loader2, Play, Share2, Download } from "lucide-react";
import Link from "next/link";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function FolderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { folders, decks, loading, addDeckToFolder, removeDeckFromFolder, exportSingleFolder } = useDataStore();
  const router = useRouter();
  
  const [addModalOpen, setAddModalOpen] = useState(false);

  const folder = folders.find(f => f.id === id);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!folder) return <div className="p-20 text-center font-bold text-destructive">Ordner nicht gefunden</div>;

  const folderDecks = decks.filter(d => folder.deckIds?.includes(d.id));
  const availableDecks = decks.filter(d => !folder.deckIds?.includes(d.id));

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-10">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors font-bold uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Zurück zur Übersicht
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white dark:bg-card p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-border">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-accent font-bold text-sm bg-accent/10 w-fit px-4 py-1.5 rounded-full uppercase tracking-widest">
              <GraduationCap className="h-5 w-5" /> ORDNER
            </div>
            <h1 className="font-headline text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{folder.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xl leading-relaxed max-w-2xl">{folder.description}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="rounded-2xl h-16 px-8 gap-3 font-bold text-lg border-2">
                  <Share2 className="h-6 w-6" /> Exportieren
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem]">
                <DialogHeader>
                  <DialogTitle>Ordner exportieren</DialogTitle>
                  <DialogDescription>
                    Dieser Export enthält den Ordner "{folder.title}" sowie alle {folderDecks.length} darin enthaltenen Lernsets.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={() => exportSingleFolder(id)} className="w-full h-12 rounded-xl font-bold gap-2">
                    <Download className="h-4 w-4" /> Ordner-Paket herunterladen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="rounded-2xl h-16 px-8 gap-3 font-bold text-lg shadow-xl shadow-primary/20">
                  <Plus className="h-6 w-6" /> Hefte hinzufügen
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-[2rem]">
                <DialogHeader>
                  <DialogTitle>Hefte zum Ordner hinzufügen</DialogTitle>
                  <DialogDescription>
                    Wähle aus deinen lokalen Vokabelheften.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[400px] overflow-y-auto space-y-2 py-4">
                  {availableDecks.length === 0 ? (
                    <p className="text-center py-10 text-slate-400 font-medium">Keine weiteren Hefte verfügbar.</p>
                  ) : (
                    availableDecks.map(deck => (
                      <div key={deck.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-border group hover:border-primary/30 transition-all">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 dark:text-slate-100">{deck.title}</p>
                          <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">{deck.languageFront} → {deck.languageBack}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-primary font-bold hover:bg-primary/10 rounded-xl" onClick={() => addDeckToFolder(id, deck.id)}>
                          Hinzufügen
                        </Button>
                      </div>
                    ))
                  )}
                </div>
                <DialogFooter>
                  <Button className="w-full rounded-xl" onClick={() => setAddModalOpen(false)}>Fertig</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-headline text-3xl font-bold flex items-center gap-4 px-2">
            <BookOpen className="h-8 w-8 text-primary" />
            In diesem Ordner ({folderDecks.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {folderDecks.map((deck) => (
              <Card key={deck.id} className="group border-none shadow-sm hover:shadow-lg transition-all rounded-[2.5rem] bg-white dark:bg-card overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full flex items-center gap-2 border border-slate-100 dark:border-border">
                      <Languages className="h-4 w-4 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{deck.languageFront} → {deck.languageBack}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-destructive transition-colors" onClick={() => removeDeckFromFolder(id, deck.id)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <CardTitle className="font-headline text-2xl mt-4 leading-tight">{deck.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-base">{deck.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-0 flex gap-3">
                  <Link href={`/decks/${deck.id}`} className="flex-1">
                    <Button variant="outline" className="w-full rounded-2xl h-12 font-bold border-2">
                      Ansehen
                    </Button>
                  </Link>
                  <Link href={`/decks/${deck.id}/study`}>
                    <Button className="rounded-2xl w-14 h-12">
                      <Play className="h-5 w-5" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}

            {folderDecks.length === 0 && (
              <div className="md:col-span-2 text-center py-24 bg-slate-50/50 dark:bg-slate-900/10 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-border">
                <div className="bg-white dark:bg-card w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <BookOpen className="h-10 w-10 text-slate-200 dark:text-slate-700" />
                </div>
                <p className="text-slate-400 text-lg font-medium mb-6">Noch keine Hefte in diesem Ordner.</p>
                <Button variant="outline" className="rounded-full px-8 h-12 border-2" onClick={() => setAddModalOpen(true)}>
                  Hefte jetzt hinzufügen
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
