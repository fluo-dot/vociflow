
# ⚡️ VociFlow

VociFlow ist eine moderne, professionelle Web-Anwendung zum Vokabellernen, die zu 100 % lokal in deinem Browser funktioniert. Maximale Privatsphäre trifft auf erstklassiges Design.

## 🚀 Veröffentlichung auf GitHub Pages

Da VociFlow ein Next.js-Projekt ist, wird die statische Seite beim Build-Vorgang generiert:

1. Führe im Terminal `npm run build` aus.
2. Next.js erstellt einen Ordner namens `out`.
3. Der Inhalt dieses `out`-Ordners (inklusive der generierten `index.html`) muss in den `gh-pages` Branch deines GitHub-Repositorys hochgeladen werden.

## 🛠 Neues Repository verknüpfen

Wenn du ein neues Repository erstellt hast, kannst du es mit diesen Befehlen verknüpfen:

```bash
# Falls noch ein alter Remote existiert:
git remote remove origin

# Neues Repository hinzufügen:
git remote add origin https://github.com/DEIN_NUTZERNAME/DEIN_NEUES_REPO.git

# Änderungen hochladen:
git add .
git commit -m "Projekt-Update"
git push -u origin main
```

## 🛡️ Privacy First
- **Keine Cloud-Speicherung:** Alle Vokabeln liegen im LocalStorage deines Browsers.
- **Kein Tracking:** Wir wissen nicht, wer du bist oder was du lernst.
- **100% Offline:** Die App benötigt nach dem Laden keine Internetverbindung.
- **Export/Import:** Du hast die volle Kontrolle über deine Daten als JSON-Dateien.

## 🛠 Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **UI Komponenten:** Shadcn UI
- **Animationen:** Tailwind CSS Animate

## 📄 Rechtliches
Dieses Projekt ist Open-Source und für private Bildungszwecke konzipiert. Die Nutzung erfolgt auf eigene Verantwortung. Da alle Daten lokal auf deinem Gerät verbleiben, ist VociFlow von Natur aus datenschutzfreundlich.
