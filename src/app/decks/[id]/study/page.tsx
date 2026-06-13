
"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useDataStore } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw, Award, ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import { FlashcardUI } from "@/components/FlashcardUI";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function StudyMode({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { decks, loading, updateCard } = useDataStore();
  
  // Hooks
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState({ known: 0, unknown: 0 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [swapSides, setSwapSides] = useState(false);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);

  const deck = decks.find(d => d.id === id);

  const handleMark = useCallback((known: boolean) => {
    if (!deck || swipeDir || completed) return;
    
    setSwipeDir(known ? 'right' : 'left');
    
    setTimeout(() => {
      const currentCard = deck.cards[currentIndex];
      updateCard(id, currentCard.id, { known });
      setStats(prev => ({
        known: known ? prev.known + 1 : prev.known,
        unknown: !known ? prev.unknown + 1 : prev.unknown
      }));

      setIsFlipped(false);
      setSwipeDir(null);

      if (currentIndex < deck.cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCompleted(true);
      }
    }, 300);
  }, [deck, currentIndex, id, updateCard, swipeDir, completed]);

  const toggleFlip = useCallback(() => {
    if (swipeDir) return;
    setIsFlipped(prev => !prev);
  }, [swipeDir]);

  useEffect(() => {
    if (completed) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        toggleFlip();
      } else if (e.code === "ArrowLeft") {
        handleMark(false);
      } else if (e.code === "ArrowRight") {
        handleMark(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [completed, toggleFlip, handleMark]);

  const resetStudy = () => {
    setCurrentIndex(0);
    setCompleted(false);
    setStats({ known: 0, unknown: 0 });
    setIsFlipped(false);
    setSwipeDir(null);
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background"><Navbar /><p className="animate-pulse">Lädt...</p></div>;
  if (!deck || deck.cards.length === 0) return <div className="flex min-h-screen items-center justify-center bg-background"><Navbar /><p className="text-destructive font-bold">Keine Karten vorhanden.</p></div>;

  if (completed) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-20 max-w-2xl text-center space-y-10">
          <div className="bg-white dark:bg-card p-12 rounded-[3rem] shadow-sm space-y-8 animate-in zoom-in duration-500">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="space-y-2">
              <h1 className="font-headline text-4xl font-bold">Abgeschlossen!</h1>
              <p className="text-muted-foreground text-lg">Alle Karten durchgesehen.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-3xl border border-green-100">
                <p className="text-green-600 font-bold text-3xl">{stats.known}</p>
                <p className="text-green-700 text-sm font-medium">Gekonnt</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl border border-red-100">
                <p className="text-red-600 font-bold text-3xl">{stats.unknown}</p>
                <p className="text-red-700 text-sm font-medium">Noch lernen</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/decks/${id}`} className="flex-1">
                <Button variant="outline" className="w-full rounded-2xl h-14 font-bold text-lg">Zum Heft</Button>
              </Link>
              <Button onClick={resetStudy} className="flex-1 rounded-2xl h-14 font-bold text-lg gap-2 shadow-lg shadow-primary/20">
                <RefreshCw className="h-5 w-5" /> Noch einmal
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentCard = deck.cards[currentIndex];
  const progressValue = ((currentIndex) / deck.cards.length) * 100;
  const displayFront = swapSides ? currentCard.back : currentCard.front;
  const displayBack = swapSides ? currentCard.front : currentCard.back;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-8">
        <div className="flex items-center justify-between">
          <Link href={`/decks/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-wider">
            <ArrowLeft className="h-4 w-4" /> Zurück zum Heft
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-2 rounded-xl border">
              <Switch id="swap-sides" checked={swapSides} onCheckedChange={(val) => {
                setSwapSides(val);
                setIsFlipped(false);
              }} />
              <Label htmlFor="swap-sides" className="text-xs font-bold cursor-pointer flex items-center gap-2">
                <ArrowLeftRight className="h-3 w-3" /> Seiten tauschen
              </Label>
            </div>
            <div className="text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full uppercase tracking-wider">KARTEN</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end mb-2">
            <h2 className="font-headline text-xl font-bold">Fortschritt</h2>
            <span className="text-sm font-medium text-muted-foreground">{currentIndex + 1} von {deck.cards.length}</span>
          </div>
          <Progress value={progressValue} className="h-3 rounded-full" />
        </div>

        <div className={cn(
          "transition-all duration-300 transform-gpu",
          swipeDir === 'left' && "-translate-x-full -rotate-12 opacity-0 scale-95",
          swipeDir === 'right' && "translate-x-full rotate-12 opacity-0 scale-95",
          !swipeDir && "translate-x-0 rotate-0 opacity-100 scale-100"
        )}>
           <FlashcardUI 
            key={currentCard.id}
            front={displayFront} 
            back={displayBack}
            isFlipped={isFlipped}
            onFlip={toggleFlip}
           />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full sm:w-64 h-20 rounded-3xl text-red-600 border-red-200 hover:bg-red-50 font-bold text-xl gap-3 transition-all hover:scale-105 active:scale-95"
            onClick={() => handleMark(false)}
            disabled={!!swipeDir}
          >
            <XCircle className="h-7 w-7" /> Weiß ich nicht
          </Button>
          <Button 
            size="lg" 
            className="w-full sm:w-64 h-20 rounded-3xl bg-green-600 hover:bg-green-700 text-white font-bold text-xl gap-3 transition-all shadow-xl shadow-green-200 hover:scale-105 active:scale-95"
            onClick={() => handleMark(true)}
            disabled={!!swipeDir}
          >
            <CheckCircle2 className="h-7 w-7" /> Kann ich
          </Button>
        </div>

        <p className="text-center text-muted-foreground text-sm font-medium">
          Tipp: Nutze <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border">Leertaste</kbd> zum Drehen, <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border">←</kbd> für Nicht-Wissen und <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border">→</kbd> für Wissen.
        </p>
      </main>
    </div>
  );
}
