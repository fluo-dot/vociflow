
"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { useDataStore } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Trash2, Play, Loader2, FolderKanban, Clock, ArrowRight, Download, Upload, Share2, FileJson, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const SPRACHEN = ["Deutsch", "Englisch", "Französisch", "Spanisch", "Italienisch", "Latein", "Japanisch", "Chinesisch"];

export default function Dashboard() {
  const { 
    decks, 
    folders, 
    loading, 
    addDeck, 
    deleteDeck, 
    addFolder, 
    deleteFolder,
    exportData,
    exportSingleDeck,
    exportSingleFolder,
    importData
  } = useDataStore();
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");
  const [deckModalOpen, setDeckModalOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [langFront, setLangFront] = useState("Deutsch");
  const [langBack, setLangBack] = useState("Englisch");
  const [folderTitle, setFolderTitle] = useState("");

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const message = await importData(file);
        toast({ title: "Import erfolgreich", description: message });
        setImportModalOpen(false);
      } catch (err) {
        toast({ title: "Fehler beim Import", description: "Die Datei konnte nicht gelesen werden.", variant: "destructive" });
      }
      e.target.value = ''; 
    }
  };

  const filteredDecks = decks.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) || 
    (d.description && d.description.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredFolders = folders.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    (f.description && f.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Deine Mediathek</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              100% lokal & privat in VociFlow.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl gap-2 hover:bg-slate-50 transition-colors">
                  <Download className="h-4 w-4" /> Alles sichern
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem] animate-in zoom-in-95 duration-200">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Mediathek sichern
                  </DialogTitle>
                  <DialogDescription className="pt-2">
                    Erstelle ein vollständiges Backup deiner gesamten VociFlow-Mediathek.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-border">
                  <FileJson className="h-12 w-12 text-slate-300 mb-2" />
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Backup-Datei (.json)</p>
                </div>
                <DialogFooter className="sm:justify-center">
                  <Button onClick={() => { exportData(); setExportModalOpen(false); }} className="w-full h-12 rounded-xl font-bold gap-2">
                    <Download className="h-4 w-4" /> Backup jetzt herunterladen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl gap-2 hover:bg-slate-50 transition-colors">
                  <Upload className="h-4 w-4" /> Importieren
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem] animate-in zoom-in-95 duration-200">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Daten importieren
                  </DialogTitle>
                  <DialogDescription className="pt-2">
                    Wähle eine VociFlow-Datei (.json) aus.
                  </DialogDescription>
                </DialogHeader>
                <div className="hidden">
                  <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" />
                </div>
                <DialogFooter>
                  <Button onClick={() => fileInputRef.current?.click()} className="w-full h-12 rounded-xl font-bold gap-2">
                    <Upload className="h-4 w-4" /> Datei vom Gerät auswählen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <div className="w-px h-10 bg-border mx-1 hidden sm:block"></div>

            <Dialog open={folderModalOpen} onOpenChange={setFolderModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl gap-2 font-semibold hover:bg-slate-50 transition-all">
                  <FolderKanban className="h-4 w-4" /> Ordner erstellen
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem] animate-in zoom-in-95 duration-200">
                <DialogHeader>
                  <DialogTitle>Neuer Ordner</DialogTitle>
                  <DialogDescription>Organisiere deine Lernsets in einem Ordner.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Ordnername</Label>
                    <Input value={folderTitle} onChange={(e) => setFolderTitle(e.target.value)} placeholder="z.B. Semester 1" />
                  </div>
                </div>
                <DialogFooter>
                  <Button className="w-full rounded-xl" onClick={() => { if(folderTitle) { addFolder(folderTitle, ""); setFolderModalOpen(false); setFolderTitle(""); } }}>Ordner anlegen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={deckModalOpen} onOpenChange={setDeckModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl px-6 gap-2 font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                  <Plus className="h-5 w-5" /> Neues Lernset
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem] animate-in zoom-in-95 duration-200">
                <DialogHeader>
                  <DialogTitle>Lernset erstellen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Titel</Label>
                    <Input placeholder="z.B. Spanisch Vokabeln" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Von</Label>
                      <Select value={langFront} onValueChange={setLangFront}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">{SPRACHEN.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Nach</Label>
                      <Select value={langBack} onValueChange={setLangBack}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">{SPRACHEN.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => { if(newTitle) { addDeck(newTitle, "", langFront, langBack); setDeckModalOpen(false); setNewTitle(""); } }} className="w-full rounded-xl h-12 font-bold">Lernset anlegen</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Deine Sammlungen durchsuchen..." 
            className="pl-12 h-14 rounded-2xl shadow-sm border-slate-200 dark:border-border focus:ring-primary/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Tabs defaultValue="decks" className="space-y-6">
          <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl h-14 w-fit">
            <TabsTrigger value="decks" className="px-8 py-2.5 rounded-xl font-bold data-[state=active]:shadow-md transition-all">Lernsets ({filteredDecks.length})</TabsTrigger>
            <TabsTrigger value="folders" className="px-8 py-2.5 rounded-xl font-bold data-[state=active]:shadow-md transition-all">Ordner ({filteredFolders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="decks" className="mt-0 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDecks.map((deck) => (
                <Card key={deck.id} className="hover:border-primary/40 transition-all shadow-sm hover:shadow-xl rounded-[2rem] overflow-hidden border-slate-100 dark:border-border bg-card group hover:-translate-y-1 duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {deck.languageFront} → {deck.languageBack}
                      </Badge>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary rounded-full">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-[2rem]">
                            <DialogHeader>
                              <DialogTitle>Lernset exportieren</DialogTitle>
                              <DialogDescription>Exportiere "{deck.title}" als JSON-Datei.</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button onClick={() => exportSingleDeck(deck.id)} className="w-full rounded-xl gap-2 font-bold">
                                <Download className="h-4 w-4" /> Lernset herunterladen
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-destructive rounded-full">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2rem]">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Lernset löschen?</AlertDialogTitle>
                              <AlertDialogDescription>Möchtest du das Lernset "{deck.title}" wirklich unwiderruflich löschen?</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Abbrechen</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteDeck(deck.id)} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">Löschen</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-headline font-bold line-clamp-1">{deck.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <Clock className="h-3 w-3" />
                      <span>{deck.cards?.length || 0} Karten</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 flex gap-2">
                    <Link href={`/deck?id=${deck.id}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl h-12 font-bold border-2">Öffnen</Button>
                    </Link>
                    <Link href={`/deck/study?id=${deck.id}`}>
                      <Button className="rounded-xl w-14 h-12 shadow-lg shadow-primary/20"><Play className="h-5 w-5 fill-current" /></Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="folders" className="mt-0 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredFolders.map((folder) => (
                 <Card key={folder.id} className="hover:border-primary/40 transition-all shadow-sm hover:shadow-xl rounded-[2rem] bg-card border-slate-100 dark:border-border group hover:-translate-y-1 duration-300">
                   <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-accent/10 text-accent border-none text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">ORDNER</Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary rounded-full">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-[2rem]">
                              <DialogHeader>
                                <DialogTitle>Ordner exportieren</DialogTitle>
                                <DialogDescription>Exportiere den Ordner "{folder.title}" inklusive aller Hefte.</DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button onClick={() => exportSingleFolder(folder.id)} className="w-full rounded-xl gap-2 font-bold">
                                  <Download className="h-4 w-4" /> Ordner herunterladen
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-destructive rounded-full">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2rem]">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Ordner löschen?</AlertDialogTitle>
                                <AlertDialogDescription>Möchtest du den Ordner "{folder.title}" löschen? (Hefte bleiben erhalten).</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl">Abbrechen</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteFolder(folder.id)} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">Löschen</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <CardTitle className="text-xl font-headline font-bold line-clamp-1">{folder.title}</CardTitle>
                   </CardHeader>
                   <CardContent className="pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <FolderKanban className="h-3 w-3" />
                        <span>{folder.deckIds?.length || 0} Hefte</span>
                      </div>
                   </CardContent>
                   <CardFooter className="pt-4">
                      <Link href={`/folder?id=${folder.id}`} className="w-full">
                        <Button className="w-full rounded-xl h-12 gap-2 font-bold shadow-lg shadow-primary/10">
                          Ordner ansehen <ArrowRight className="h-5 w-5" />
                        </Button>
                      </Link>
                   </CardFooter>
                 </Card>
               ))}
             </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
