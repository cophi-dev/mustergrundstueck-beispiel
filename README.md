# Ashausener Straße 12, Stelle — Baukasten

Interaktiver 3D-Baukasten für **Ashausener Str. 12, 21435 Stelle** (Gemarkung Stelle, Flur 6, Flurstücke **121/1** und **121/2**).

**🔗 Live Demo:** **https://mustergrundstueck-beispiel.vercel.app/**

Zwei Browser mit derselben URL sehen synchronisierte Positionen (via Yjs). Sonnenstands-Slider, Varianten-Buttons und Objekt-Erstellung direkt im Viewer.

## Quellen

| Unterlage | Inhalt |
|-----------|--------|
| **Liegenschaftsgrafik 1:500** | LGLN Katasteramt Winsen, erstellt 28.01.2026 (Zeichen 090-A-00084/2026). Grundstücksgrenzen, Gebäudegrundrisse, Hausnummern. |
| **Bebauungsplan Osterfeld West** | Neufassung 1980, rechtskräftig 1982. WA I, GRZ 0,25, offene Bauweise, nur Einzel- und Doppelhäuser. |
| **Bestandspläne** | Wohnhaus H. Burmeister (1:100) und Anbau Geräteschuppen (Gisela Burmester). |

Die Katastergeometrie bleibt in `kit.json` (Meter, lokal). Die Original-Liegenschaftsgrafik wird wegen der LGLN-Nutzungsbedingungen **nicht** mitversioniert.

## Grundstück

Drei Zahlen, drei Bedeutungen (121/2):

| Zahl | Bedeutung |
|------|-----------|
| **702 m²** | amtliche **Grundstücksgröße** (ALKIS Flurstück) — die ~700 vom Telefon |
| **293 m²** | **überbaubare Fläche** nach Abständen (Baugrenze: 7 m Am Osterfeld, 3 m Seite/hinten) |
| **176 m²** | **max. Gebäudegrundfläche** nach GRZ 0,25 × 702 m² |

| Element | Wert |
|---------|------|
| **121/1** | **1.497 m²** ALKIS, Bestand Wohnhaus Nr. 12 + Garage, Ashausener Straße |
| **121/2** | **702 m²** ALKIS, unbebauter Gartenteil, Front **Am Osterfeld** |
| **Gesamt** | **2.199 m²** |
| **Baugrenze 121/2** | **293 m²** — 7 m von Am Osterfeld, 3 m seitlich und zur Grenze 121/1 (ca. 30,9 × 9,5 m). Das ist **nicht** die 702 m². |
| **GRZ 0,25** | max. ca. **176 m²** Grundfläche auf 121/2 (0,25 × 702) |

**Geoportal Hamburg:** Geo-Online / der Hamburger B-Plan-WMS decken Stelle **nicht** ab (Südgrenze ca. 53,394°N, Grundstück bei 53,384°N). Stelle liegt in Niedersachsen, Landkreis Harburg. Kataster: [LGLN ALKIS](https://opendata.lgln.niedersachsen.de/doorman/noauth/alkis_wfs_einfach). B-Plan: LK Harburg, Osterfeld West (`32_50`).

Koordinaten im Viewer: Meter, **+X Ost, +Z Nord**, Ursprung an 121/2-ALKIS (UTM E0=574305.224, N0=5914743.962, EPSG:25832). Das Grundstück liegt als **Diorama-Insel** im Studio (Katastergrenze plus Straßenkragen, Sockel ~2,5 m). Beim Laden ist **Norden oben und Osten rechts**. **Ziehen** neigt in die 3D-Ansicht. **Kompass** (oder Doppelklick / Esc) holt die Karte zurück. **Satellit** legt das LGLN-DOP20 auf die Insel (sonst Rasen).

### Bestand

Grundrisse aus **ALKIS Gebäude** (LGLN), Lage geprüft gegen DOP20 / Satellit:

- Wohnhaus Nr. 12 nach Bestandsplan H. Burmeister (M 1:100): **roter Klinker**, Sockel, 1 VG + **Kniestock-DG** im steilen **Walmdach** (First 4,00 m über DG-Fußboden, Firstlänge 4,00 m, parallel zur Straße). Hauptkörper **11,48 × 8,58 m**. Zur Ashausener Straße: **Erker 4,00 × 1,15 m** mit dreiflügeligem Fenster, je ein EG-Fenster links und rechts, Eingang in der Erker-Ecke mit Treppe, **Zwerchhaus** (Satteldach, 2 quadratische Fenster) — keine weiteren OG-Fenster in der Straßenfassade. Schornstein auf dem First. Rückwärtig **W.-Küche 3,90 × 4,90 m** (eingeschossig) und späterer Ostflügel (ALKIS). Hausnummer 12, Hecke an der Straße.
- Freistehende **L-Garage/Werkstatt** östlich des Hauses (ALKIS): langer Schenkel grob Nord–Süd an der Ostgrenze, kurzer Schenkel nach Westen, Hof dazwischen, **weißes Lamellentor** am Südgiebel
- **Bäume** aus dem DOP20 (gebüschelte Laubkronen auf 121/2, Lebensbäume am Hof, Hecke an der Ashausener). Button **Bäume** blendet die 3D-Kronen. Bei Satellit zeigt das DOP20 die Wege; ohne Satellit liegen Hof und der gebogene Weg von der Ashausener als Kies. Hof-Pkw wie im Luftbild. Studio-Vignette und Kontaktschatten unter der Insel.
- Nachbarn als Kontext an ihrer ALKIS-Lage: Am Osterfeld 7 (östlich), Ashausener Str. 14 (südöstlich), Am Osterfeld 1 (nordwestlich)

### Bebauungsoptionen (verschiebbar)

Passend zu WA I / GRZ 0,25 / nur Einzel- und Doppelhäuser:

1. **Mittelstädt Flachdach-Bungalow** (Burmester/Oberhofer, Projekt 2026A044, T. Hansen 16.03.2026) — **17,875 × 12,50 m**, 1 VG, Wohnfläche **163,90 m²**. Helle Klinker, anthrazite Attika, U-Grundriss mit überdachter Terrasse (Nord, 6,875 m) und zurückgesetzter Diele (Süd, 2,125 m). **Passung 121/2:** Die 12,50 m Tiefe überschreitet die **9,5 m Baugrenze**; Grundfläche ~205 m² liegt über GRZ 0,25 (176 m²). Im Viewer bewusst in echter Größe, damit der Konflikt sichtbar ist.
2. **Kompaktes EFH mit Dachgeschoss** — 10×8,5 m, 1 VG + DG
3. **Doppelhaus** — 16×9 m, 1 VG + DG (statt 3-Familien-Haus, das der B-Plan nicht vorsieht)
4. **Ersatzneubau** — 12×10 m anstelle des Bestands auf 121/1

Bungalow / EFH / Doppelhaus werden auf das Baufenster von **121/2** gesetzt. Der Ersatzneubau sitzt auf **121/1** und blendet den gesamten Bestand auf 121/1 aus.

## Dateien

```
├── index.html              # 3D-Viewer
├── kit.json                # Geometrie aus Lageplan + B-Plan
├── satellit.jpg            # LGLN DOP20, georeferenziert auf das lokale Meter-System
├── generate-dxf.js         # DXF-Export
└── README.md
```

## Nutzung

`index.html` öffnen (lokal, `npx serve .`, oder die Vercel-URL).

**Steuerung:** Ziehen neigt von der Aufsicht in die 3D-Ansicht · Kompass, Doppelklick oder Esc holt die Karte zurück · Linksklick auf Kit-Teile verschiebt sie · rechte Maustaste verschiebt die Karte · Mausrad Zoom · Varianten-Leiste · Satellit · Sonne nach Uhrzeit und Monat (Standort Stelle).

## Hinweise

- Die gelbe Fläche im Viewer ist die **Baugrenze** (~293 m²), nicht das Grundstück. 121/2 ist amtlich **702 m²** (ALKIS).
- Baugrenze aus den gedruckten WA-I-Maßen (7 m / 3 m), nicht ein pauschaler 3 m-Abstand. Die Strichpunktlinie im Scan 1:1000 lässt sich nicht sauber vektorisieren.
- GRZ 0,25 und 1 Vollgeschoss stammen aus der Planzeichenerklärung / den Nutzungsschablonen (WA I) im B-Plan Osterfeld West.
- Das 3D-Wohnhaus folgt dem Bestandsplan (Ansichten + Grundrisse), die Lage auf dem Grundstück bleibt ALKIS/DOP20. Der Bungalow auf 121/2 folgt dem Mittelstädt-EG Burmester/Oberhofer (Flachdach, 17,88 × 12,50 m). **12,50 m Tiefe vs. 9,5 m Baugrenze** und GRZ sind im Modell nicht wegskaliert. Keine Innenräume, keine verbindliche Bauvoranfrage.

## Lizenz

Interne Planungsgrundlage. Katasterdaten: LGLN, AGNB beachten. Keine Garantie für Vollständigkeit gegenüber dem Originalplan.

---

*Baukasten entwickelt von Phillipp Zarindast.*
