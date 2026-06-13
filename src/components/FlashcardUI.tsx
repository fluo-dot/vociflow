
"use client";

import { cn } from "@/lib/utils";
import { RotateCcw, BrainCircuit, CheckCircle } from "lucide-react";

interface FlashcardUIProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashcardUI({ front, back, isFlipped, onFlip }: FlashcardUIProps) {
  return (
    <div 
      className="relative w-full h-[400px] cursor-pointer perspective-1000 group select-none active:scale-[0.98] transition-transform duration-150"
      onClick={onFlip}
    >
      <div className={cn(
        "relative w-full h-full transition-all duration-700 transform-style-3d rounded-[2.5rem]",
        isFlipped ? "rotate-y-180" : ""
      )}>
        {/* Front Side */}
        <div className="absolute inset-0 bg-white dark:bg-card backface-hidden flex flex-col items-center justify-center p-10 rounded-[2.5rem] border-2 shadow-sm transition-all group-hover:shadow-xl group-hover:border-primary/20">
          <div className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-bold text-primary tracking-widest opacity-60">
            <BrainCircuit className="h-5 w-5" />
            <span>BEGRIFF</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-headline text-center font-bold text-foreground leading-tight px-4">
            {front}
          </h2>
          
          <div className="absolute bottom-8 flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
             <RotateCcw className="h-4 w-4" />
             <span>Zum Drehen klicken / Leertaste</span>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 bg-primary backface-hidden rotate-y-180 flex flex-col items-center justify-center p-10 rounded-[2.5rem] text-primary-foreground shadow-2xl">
          <div className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-bold text-primary-foreground tracking-widest opacity-60">
            <CheckCircle className="h-5 w-5" />
            <span>DEFINITION</span>
          </div>
          
          <p className="text-2xl md:text-3xl text-center font-body font-medium leading-relaxed max-w-md px-4">
            {back}
          </p>
          
          <div className="absolute bottom-8 flex items-center gap-2 text-primary-foreground/60 text-xs font-bold uppercase tracking-widest">
             <RotateCcw className="h-4 w-4" />
             <span>Zurückdrehen</span>
          </div>
        </div>
      </div>
    </div>
  );
}
