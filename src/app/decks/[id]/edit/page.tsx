
"use client";

import { use, useState, useEffect } from "react";
import { useDataStore, Card as CardType } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Trash2, Loader2, GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function EditDeck({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { decks, loading, updateCard, addCard, deleteCard, updateDeck } = useDataStore();
  const router = useRouter();
  
  const deck = decks.find(d => d.id === id);
  const [localTitle, setLocalTitle] = useState("");
  const [localDescription, setLocalDescription] = useState("");

  useEffect(() => {
    if (deck) {
      setLocalTitle(deck.title);
      setLocalDescription(deck.description || "");
    }
  }, [deck]);

  if (loading) return <div className="p-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>;
  if (!deck) return <div className="p-20 text-center text-destructive font-bold">Heft nicht gefunden</div>;

  const handleSaveInfo = async () => {
    await updateDeck(id, { title: localTitle, description: localDescription });
  };

  const handleAddCard = () => {
    addCard(id, "", "");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <Navbar />
      
      <div className="sticky top-16 z-40 bg-white dark:bg-card border-b shadow-sm py-4">
        <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push(`/decks/${id}`)} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="font-headline font-bold text-xl hidden sm:block">Lernset bearbeiten</h2>
          </div>
          <Button 
            onClick={() => router.push(`/decks/${id}`)} 
            className="rounded-xl px-8 h-12 font-bold bg-primary shadow-lg shadow-primary/20"
          >
            Fertig
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-10">
        <section className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Titel</label>
              <Input 
                value={localTitle} 
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={handleSaveInfo}
                placeholder="Gib deinem Lernset einen Titel..."
                className="h-14 text-2xl font-headline font-bold border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 border-b-2 border-slate-200 dark:border-slate-800 rounded-none px-1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Beschreibung</label>
              <Input 
                value={localDescription} 
                onChange={(e) => setLocalDescription(e.target.value)}
                onBlur={handleSaveInfo}
                placeholder="Füge eine Beschreibung hinzu..."
                className="h-12 text-lg border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 border-b-2 border-slate-200 dark:border-slate-800 rounded-none px-1"
              />
            </div>
          </div>
        </section>

        <section className="space-y-8">
          {deck.cards.map((card, index) => (
            <EditCardRow 
              key={card.id} 
              card={card} 
              index={index} 
              languageFront={deck.languageFront}
              languageBack={deck.languageBack}
              onUpdate={(updates) => updateCard(id, card.id, updates)}
              onDelete={() => deleteCard(id, card.id)}
            />
          ))}

          <Button 
            onClick={handleAddCard}
            className="w-full h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary bg-white dark:bg-card hover:bg-primary/5 text-slate-500 hover:text-primary rounded-2xl transition-all font-bold text-xl uppercase tracking-widest flex flex-col gap-2"
            variant="ghost"
          >
            <Plus className="h-8 w-8" />
            <span>+ Karte hinzufügen</span>
          </Button>
        </section>

        <div className="flex justify-center pt-8">
          <Button 
            onClick={() => router.push(`/decks/${id}`)} 
            size="lg"
            className="rounded-2xl px-12 h-16 font-bold text-xl shadow-2xl shadow-primary/30"
          >
            Lernset speichern & beenden
          </Button>
        </div>
      </main>
    </div>
  );
}

function EditCardRow({ 
  card, 
  index, 
  onUpdate, 
  onDelete, 
  languageFront, 
  languageBack 
}: { 
  card: CardType; 
  index: number; 
  languageFront: string;
  languageBack: string;
  onUpdate: (updates: Partial<CardType>) => void;
  onDelete: () => void;
}) {
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);

  useEffect(() => {
    setFront(card.front);
    setBack(card.back);
  }, [card.front, card.back]);

  const handleBlur = () => {
    if (front !== card.front || back !== card.back) {
      onUpdate({ front, back });
    }
  };

  return (
    <Card className="rounded-2xl border-none shadow-sm overflow-visible bg-white dark:bg-card group">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-t-2xl">
          <span className="font-headline font-bold text-slate-400">{index + 1}</span>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-slate-400 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[2rem]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Karte löschen?</AlertDialogTitle>
                  <AlertDialogDescription>Möchtest du diese Vokabelkarte wirklich löschen?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Abbrechen</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">Löschen</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <GripVertical className="h-5 w-5 text-slate-300 cursor-grab active:cursor-grabbing" />
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <Input 
                value={front}
                onChange={(e) => setFront(e.target.value)}
                onBlur={handleBlur}
                placeholder={`Begriff (${languageFront})`}
                className="h-12 text-lg border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 border-b-2 border-slate-200 dark:border-slate-800 rounded-none px-1"
              />
            </div>

            <div className="space-y-4">
              <Input 
                value={back}
                onChange={(e) => setBack(e.target.value)}
                onBlur={handleBlur}
                placeholder={`Definition (${languageBack})`}
                className="h-12 text-lg border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 border-b-2 border-slate-200 dark:border-slate-800 rounded-none px-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
