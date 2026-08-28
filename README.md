# Ashausener Straße 12, Stelle — Baukasten

Interaktiver 3D-Baukasten für **Ashausener Str. 12, 21435 Stelle** (Gemarkung Stelle, Flur 6, Flurstücke **121/1** und **121/2**).

**🔗 Live Demo:** **https://cophi-dev.github.io/mustergrundstueck-beispiel/**

Zwei Browser mit derselben URL sehen synchronisierte Positionen (via Yjs). Sonnenstands-Slider, Varianten-Buttons und Objekt-Erstellung direkt im Viewer.

## Quellen

| Unterlage | Inhalt |
|-----------|--------|
| **Liegenschaftsgrafik 1:500** | LGLN Katasteramt Winsen, erstellt 28.01.2026 (Zeichen 090-A-00084/2026). Grundstücksgrenzen, Gebäudegrundrisse, Hausnummern. |
| **Bebauungsplan Osterfeld West** | Neufassung 1980, rechtskräftig 1982. WA I, GRZ 0,25, offene Bauweise, nur Einzel- und Doppelhäuser. |
| **Bestandspläne** | Wohnhaus H. Burmeister (1:100) und Anbau Geräteschuppen (Gisela Burmester). |

Die Katastergeometrie bleibt in `kit.json` (Meter, lokal). Die Original-Liegenschaftsgrafik wird wegen der LGLN-Nutzungsbedingungen **nicht** mitversioniert.

## Grundstück

| Element | Wert |
|---------|------|
| **121/1** | 1.532 m², Bestand Wohnhaus Nr. 12 + Garage, Zugang Ashausener Straße |
| **121/2** | 719 m², unbebauter Gartenteil, Front **Am Osterfeld** |
| **Gesamt** | **2.251 m²** |
| **Baufenster** | ca. 417 m² auf 121/2 (3 m Grenzabstand, schematisch — Baugrenze am B-Plan prüfen) |
| **B-Plan** | WA I, 1 Vollgeschoss, GRZ 0,25 → max. ca. 180 m² Grundfläche auf 121/2 |

Koordinaten im Viewer: Meter, **+X Ost, +Z Nord**, Ursprung = Flächenschwerpunkt beider Flurstücke.

### Bestand

- Wohnhaus Nr. 12: ca. 11,5 × 8,9 m, EG + Dachgeschoss, Satteldach (aus Kataster + Bestandsplan)
- Garage / Nebengebäude: ca. 6,4 × 4,0 m
- Nachbarn als Kontext: Nr. 1, Nr. 7 (Am Osterfeld), Nr. 14

### Bebauungsoptionen (verschiebbar)

Passend zu WA I / GRZ 0,25 / nur Einzel- und Doppelhäuser:

1. **Seniorengerechter Bungalow** — 14×12 m, 1 VG, 168 m² (GRZ 0,23)
2. **Kompaktes EFH mit Dachgeschoss** — 10×8,5 m, 1 VG + DG
3. **Doppelhaus** — 16×10 m, 1 VG + DG (statt 3-Familien-Haus, das der B-Plan nicht vorsieht)
4. **Ersatzneubau** — 12×10 m anstelle des Bestands auf 121/1

Bungalow / EFH / Doppelhaus werden auf das Baufenster von **121/2** gesetzt. Der Ersatzneubau sitzt auf **121/1** und blendet den Bestand (Wohnhaus + Garage) aus.

## Dateien

```
├── index.html              # 3D-Viewer
├── kit.json                # Geometrie aus Lageplan + B-Plan
├── generate-dxf.js         # DXF-Export
└── README.md
```

## Nutzung

`index.html` öffnen (lokal, `npx serve .`, oder GitHub Pages).

**Steuerung:** Linksklick verschiebt Kit-Teile · rechte Maustaste Orbit · Mausrad Zoom · Varianten-Buttons · Sonne nach Uhrzeit und Monat (Standort Stelle).

## Hinweise

- Baufenster ist ein **3 m-Abstand** nach NBauO, keine abgezeichnete Baugrenze.
- GRZ 0,25 und 1 Vollgeschoss stammen aus der Planzeichenerklärung / den Nutzungsschablonen (WA I) im B-Plan Osterfeld West.
- Keine Innenräume, keine verbindliche Bauvoranfrage.

## Lizenz

Interne Planungsgrundlage. Katasterdaten: LGLN, AGNB beachten. Keine Garantie für Vollständigkeit gegenüber dem Originalplan.

---

*Baukasten entwickelt von Phillipp Zarindast.*
