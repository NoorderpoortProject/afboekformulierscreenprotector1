# Screenprotectors · Smartbar

Registratie van misplakkers, klachtcompensatie en garantie, plus het
verwerken van voorraadtellingen en het vullen van het officiële
afboekformulier.

## Hosting

Deze repo is gekoppeld aan Cloudflare Pages. Een push naar `main` zet de
nieuwe versie automatisch live.

Instellingen in Cloudflare Pages:

| Instelling | Waarde |
|---|---|
| Framework preset | None |
| Build command | *(leeg laten)* |
| Build output directory | `/` |

Er is geen bouwstap: de app is één zelfstandig HTML-bestand met een paar
hulpbestanden ernaast.

## Backend

De gegevens staan in Supabase (project `ykhkijmlcbljwutartts`), in de
tabellen `sp_producten`, `sp_registraties`, `sp_tellingen`,
`sp_medewerkers`, `sp_barcodes` en `sp_instellingen`.

> **Houd deze repo privé.** `index.html` bevat de Supabase-sleutel, en
> daarmee kan de database gelezen én gewijzigd worden.

## Inloggen

De teamleider gebruikt de hoofdpincode uit `sp_instellingen`. Medewerkers
krijgen een eigen code via Beheer → Medewerkers en pincodes; zij zien
alleen het tabblad Registreren en hun naam komt automatisch op elke
registratie.

## Bestanden

| Bestand | Rol |
|---|---|
| `index.html` | de volledige app |
| `diagnose.html` | testpagina als er iets niet werkt |
| `afboekformulier.xlsx` | het officiële formulier dat de app invult |
| `exceljs.min.js` | vult dat formulier in de browser |
| `zxing.min.js` | terugvalscanner voor toestellen zonder werkende ingebouwde scanner |
| `qrcode.min.js` | maakt de QR-labels voor op de balie |
| `sw.js` | service worker, laat de app offline werken |
| `_headers` | zorgt dat updates niet in de cache blijven hangen |

## Na een wijziging

Verhoog `BUILD` in `index.html` en `CACHE` in `sw.js`, anders blijven
toestellen de oude versie tonen.
