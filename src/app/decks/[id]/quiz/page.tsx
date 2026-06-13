
"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useDataStore } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw, Trophy, ChevronRight, Info, ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function QuizMode({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { decks, loading, updateCard } = useDataStore();
  
  // Alle Hooks müssen oben stehen
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [swapSides, setSwapSides] = useState(false);

  const deck = decks.find(d => d.id === id);

  const nextQuestion = useCallback(() => {
    if (!deck) return;
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput("");
      setIsAnswered(false);
    } else {
      setCompleted(true);
    }
  }, [currentIndex, deck]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isAnswered) {
        e.preventDefault();
        nextQuestion();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAnswered, nextQuestion]);

  const resetQuiz = () => {
    setCurrentIndex(0);
    setUserInput("");
    setIsAnswered(false);
    setScore(0);
    setCompleted(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isAnswered || !deck) return;
    
    const currentCard = deck.cards[currentIndex];
    const answerText = swapSides ? currentCard.front : currentCard.back;
    
    const correct = userInput.trim() === answerText.trim();
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) {
      setScore(s => s + 1);
    }
    updateCard(id, currentCard.id, { lastScore: correct ? 1 : 0 });
  };

  // Bedingte Returns ERST NACH den Hooks
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background"><Navbar /><p className="animate-pulse">Lädt...</p></div>;
  if (!deck || deck.cards.length === 0) return <div className="flex min-h-screen items-center justify-center bg-background"><Navbar /><p className="text-destructive font-bold">Keine Vokabeln vorhanden.</p></div>;

  if (completed) {
    const percentage = Math.round((score / deck.cards.length) * 100);
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-20 max-w-2xl text-center">
          <div className="bg-white dark:bg-card p-12 rounded-[3rem] shadow-sm space-y-8 animate-in zoom-in duration-300">
            <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="font-headline text-4xl font-bold">Ergebnis</h1>
              <p className="text-muted-foreground text-lg">Du hast {score} von {deck.cards.length} richtig beantwortet.</p>
            </div>
            <div className="py-6">
              <div className="text-6xl font-headline font-bold text-primary mb-2">{percentage}%</div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Genauigkeit</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/decks/${id}`} className="flex-1">
                <Button variant="outline" className="w-full rounded-2xl h-14 font-bold text-lg">Zum Heft</Button>
              </Link>
              <Button onClick={resetQuiz} className="flex-1 rounded-2xl h-14 font-bold text-lg gap-2 shadow-lg shadow-primary/20">
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
  const promptText = swapSides ? currentCard.back : currentCard.front;
  const answerText = swapSides ? currentCard.front : currentCard.back;
  const promptLang = swapSides ? deck.languageBack : deck.languageFront;
  const answerLang = swapSides ? deck.languageFront : deck.languageBack;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-12">
        <div className="flex items-center justify-between">
          <Link href={`/decks/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-wider">
            <ArrowLeft className="h-4 w-4" /> Zurück zum Heft
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-2 rounded-xl border">
              <Switch id="swap-sides-quiz" checked={swapSides} onCheckedChange={(val) => {
                setSwapSides(val);
                resetQuiz();
              }} />
              <Label htmlFor="swap-sides-quiz" className="text-xs font-bold cursor-pointer flex items-center gap-2">
                <ArrowLeftRight className="h-3 w-3" /> Seiten tauschen
              </Label>
            </div>
            <div className="text-sm font-bold text-accent bg-accent/10 px-4 py-1.5 rounded-full uppercase tracking-wider">SCHREIBEN</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end mb-2">
            <h2 className="font-headline text-xl font-bold">Fortschritt</h2>
            <span className="text-sm font-medium text-muted-foreground">{currentIndex + 1} von {deck.cards.length}</span>
          </div>
          <Progress value={progressValue} className="h-3 rounded-full" />
        </div>

        <div className="bg-white dark:bg-card p-12 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-border min-h-[300px] flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-500">
           <div className="space-y-2 text-center">
             <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 block">{promptLang}</span>
             <h2 className="text-4xl font-headline font-bold text-slate-900 dark:text-slate-100">{promptText}</h2>
           </div>

           <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
              <div className="space-y-4">
                <Input 
                  autoFocus
                  placeholder={`Übersetzung in ${answerLang}...`} 
                  className={cn(
                    "h-16 text-xl text-center rounded-2xl transition-all duration-300",
                    isAnswered && isCorrect && "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400",
                    isAnswered && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                  )}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isAnswered}
                />
                
                {isAnswered && (
                  <div className={cn(
                    "p-6 rounded-2xl animate-in slide-in-from-top-2 duration-300",
                    isCorrect ? "bg-green-100 dark:bg-green-900/30 border-green-200" : "bg-red-100 dark:bg-red-900/30 border-red-200"
                  )}>
                    <div className="flex items-center gap-3 mb-2">
                      {isCorrect ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <XCircle className="h-6 w-6 text-red-600" />}
                      <span className={cn("font-bold text-lg", isCorrect ? "text-green-800" : "text-red-800")}>
                        {isCorrect ? "Richtig!" : "Nicht ganz..."}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="space-y-1">
                        <p className="text-sm text-red-700/60 font-bold uppercase tracking-tight">KORREKTE ANTWORT:</p>
                        <p className="text-lg text-red-900 dark:text-red-100 font-medium">{answerText}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!isAnswered ? (
                <Button className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg" disabled={!userInput}>Prüfen</Button>
              ) : (
                <Button onClick={nextQuestion} className="w-full h-14 rounded-2xl font-bold text-lg gap-2" variant="secondary">
                  Weiter <ChevronRight className="h-5 w-5" />
                </Button>
              )}
           </form>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground justify-center text-sm font-medium">
          <Info className="h-4 w-4" />
          <span>Groß-/Kleinschreibung wird beachtet. Nutze Enter zum Bestätigen/Weitergehen.</span>
        </div>
      </main>
    </div>
  );
}
