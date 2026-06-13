
"use client";

import { useState, useEffect, useCallback } from 'react';

export interface Card {
  id: string;
  front: string;
  back: string;
  known?: boolean;
  lastScore?: number;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  cards: Card[];
  languageFront: string;
  languageBack: string;
  createdAt: number;
}

export interface Folder {
  id: string;
  title: string;
  description: string;
  deckIds: string[];
  createdAt: number;
}

export function useDataStore() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  // Initiales Laden aus LocalStorage - Mit Abwärtskompatibilität für Namensänderungen
  useEffect(() => {
    const load = () => {
      const storageKeys = ['vociflow_decks', 'vokalokal_decks', 'lernflux_decks', 'vokabelflux_decks'];
      const folderKeys = ['vociflow_folders', 'vokalokal_folders', 'lernflux_folders', 'vokabelflux_folders'];
      
      let savedDecks = null;
      for (const key of storageKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          savedDecks = data;
          break;
        }
      }

      let savedFolders = null;
      for (const key of folderKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          savedFolders = data;
          break;
        }
      }
      
      if (savedDecks) setDecks(JSON.parse(savedDecks));
      if (savedFolders) setFolders(JSON.parse(savedFolders));
      
      setLoading(false);
    };
    
    const raf = requestAnimationFrame(load);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Speichern in LocalStorage bei Änderungen
  const saveToStorage = useCallback((newDecks: Deck[], newFolders: Folder[]) => {
    localStorage.setItem('vociflow_decks', JSON.stringify(newDecks));
    localStorage.setItem('vociflow_folders', JSON.stringify(newFolders));
    setDecks(newDecks);
    setFolders(newFolders);
  }, []);

  const addDeck = (title: string, description: string, languageFront: string = 'Deutsch', languageBack: string = 'Englisch') => {
    const newDeck: Deck = {
      id: Math.random().toString(36).substring(2, 11),
      title,
      description,
      languageFront,
      languageBack,
      cards: [],
      createdAt: Date.now()
    };
    saveToStorage([...decks, newDeck], folders);
  };

  const updateDeck = (id: string, updates: Partial<Deck>) => {
    const newDecks = decks.map(d => d.id === id ? { ...d, ...updates } : d);
    saveToStorage(newDecks, folders);
  };

  const deleteDeck = (id: string) => {
    const newDecks = decks.filter(d => d.id !== id);
    const newFolders = folders.map(f => ({
      ...f,
      deckIds: f.deckIds.filter(dId => dId !== id)
    }));
    saveToStorage(newDecks, newFolders);
  };

  const addCard = (deckId: string, front: string, back: string) => {
    const newDecks = decks.map(d => {
      if (d.id === deckId) {
        return {
          ...d,
          cards: [...d.cards, { id: Math.random().toString(36).substring(2, 11), front, back }]
        };
      }
      return d;
    });
    saveToStorage(newDecks, folders);
  };

  const updateCard = (deckId: string, cardId: string, updates: Partial<Card>) => {
    const newDecks = decks.map(d => {
      if (d.id === deckId) {
        return {
          ...d,
          cards: d.cards.map(c => c.id === cardId ? { ...c, ...updates } : c)
        };
      }
      return d;
    });
    saveToStorage(newDecks, folders);
  };

  const deleteCard = (deckId: string, cardId: string) => {
    const newDecks = decks.map(d => {
      if (d.id === deckId) {
        return { ...d, cards: d.cards.filter(c => c.id !== cardId) };
      }
      return d;
    });
    saveToStorage(newDecks, folders);
  };

  const addFolder = (title: string, description: string) => {
    const newFolder: Folder = {
      id: Math.random().toString(36).substring(2, 11),
      title,
      description,
      deckIds: [],
      createdAt: Date.now()
    };
    saveToStorage(decks, [...folders, newFolder]);
  };

  const deleteFolder = (id: string) => {
    saveToStorage(decks, folders.filter(f => f.id !== id));
  };

  const addDeckToFolder = (folderId: string, deckId: string) => {
    const newFolders = folders.map(f => {
      if (f.id === folderId && !f.deckIds.includes(deckId)) {
        return { ...f, deckIds: [...f.deckIds, deckId] };
      }
      return f;
    });
    saveToStorage(decks, newFolders);
  };

  const removeDeckFromFolder = (folderId: string, deckId: string) => {
    const newFolders = folders.map(f => {
      if (f.id === folderId) {
        return { ...f, deckIds: f.deckIds.filter(id => id !== deckId) };
      }
      return f;
    });
    saveToStorage(decks, newFolders);
  };

  const exportFullBackup = () => {
    const data = { decks, folders, type: "full_backup", version: "1.0", exportedAt: Date.now() };
    downloadJson(data, `VociFlow_Backup_${new Date().toISOString().split('T')[0]}.json`);
  };

  const exportSingleDeck = (id: string) => {
    const deck = decks.find(d => d.id === id);
    if (!deck) return;
    const data = { ...deck, type: "deck_export", version: "1.0", exportedAt: Date.now() };
    downloadJson(data, `VociSet_${deck.title.replace(/\s+/g, '_')}.json`);
  };

  const exportSingleFolder = (id: string) => {
    const folder = folders.find(f => f.id === id);
    if (!folder) return;
    const folderDecks = decks.filter(d => folder.deckIds.includes(d.id));
    const data = { folder, decks: folderDecks, type: "folder_export", version: "1.0", exportedAt: Date.now() };
    downloadJson(data, `VociFolder_${folder.title.replace(/\s+/g, '_')}.json`);
  };

  const downloadJson = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          
          if (imported.type === "full_backup") {
            saveToStorage(imported.decks, imported.folders);
            resolve("Backup erfolgreich importiert.");
          } else if (imported.type === "deck_export") {
            const newDeck = { ...imported, id: Math.random().toString(36).substring(2, 11) };
            delete newDeck.type;
            delete newDeck.version;
            delete newDeck.exportedAt;
            saveToStorage([...decks, newDeck], folders);
            resolve(`Lernset "${newDeck.title}" importiert.`);
          } else if (imported.type === "folder_export") {
            const newFolder = { ...imported.folder, id: Math.random().toString(36).substring(2, 11), deckIds: [] as string[] };
            const newImportedDecks = imported.decks.map((d: any) => ({
              ...d,
              id: Math.random().toString(36).substring(2, 11)
            }));
            newFolder.deckIds = newImportedDecks.map((d: any) => d.id);
            
            saveToStorage([...decks, ...newImportedDecks], [...folders, newFolder]);
            resolve(`Ordner "${newFolder.title}" inklusive ${newImportedDecks.length} Heften importiert.`);
          } else {
            reject(new Error("Unbekanntes Dateiformat"));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  };

  return {
    decks,
    folders,
    loading,
    addDeck,
    updateDeck,
    deleteDeck,
    addCard,
    updateCard,
    deleteCard,
    addFolder,
    deleteFolder,
    addDeckToFolder,
    removeDeckFromFolder,
    exportData: exportFullBackup,
    exportSingleDeck,
    exportSingleFolder,
    importData
  };
}
