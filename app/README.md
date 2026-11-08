# Venster (fase 1)

Telefoon-app (PWA) voor het logboek van je venster van stresstolerantie. Zie `../PLAN.md` voor het hele plan.

## Draaien

```bash
npm install
npm run dev
```

Open http://localhost:5173. Om op je telefoon in hetzelfde wifi-netwerk te kijken: `npm run dev -- --host` en open het getoonde netwerkadres.

## Bouwen

```bash
npm run build
```

De map `dist/` is een statische site met service worker en manifest. Hosten op GitHub Pages of een andere statische host (HTTPS is nodig om te installeren als app).

Voor GitHub Pages onder een subpad, bouw met het pad als basis:

```powershell
$env:BASE_PATH = '/windowed/'; npm run build
```

(In Git Bash: `MSYS_NO_PATHCONV=1 BASE_PATH=/windowed/ npm run build`, anders wordt het pad omgezet naar een Windows-pad.)

## Installeren op je telefoon

- **iPhone (Safari)**: open de gehoste site, tik op Delen, kies "Zet op beginscherm".
- **Android (Chrome)**: open de site, kies in het menu "App installeren" of "Toevoegen aan startscherm".

Alle gegevens blijven op de telefoon (IndexedDB). Exporteren kan via de knop in het logboek.

## Structuur

- `src/lib/types.ts`: zones, schaal 1-6, standaardtriggers (uit werkblad Venster 2), signalen.
- `src/lib/db.ts`: Dexie-database (check-ins, ontregelingen, triggers).
- `src/lib/store.svelte.ts`: reactieve state via liveQuery.
- `src/lib/export.ts`: tekst-export en delen/downloaden.
- `src/components/Venster.svelte`: het venster met de dagcurve; tikken is de check-in.
- `src/components/CheckInSheet.svelte`: optionele details na een check-in.
- `src/components/OntregelingForm.svelte`: ontregeling vastleggen en afronden.
- `src/components/Logboek.svelte`: overzicht per dag en export.
