# Mustergrundstück Oberhofer — Baukasten Demo

> **WICHTIG: Dies ist ein MUSTER / SAMPLE** — nicht das echte Grundstück.  
> Alle Geometrien sind fiktiv und dienen nur zur Demonstration der Methodik.  
> Reale Geometrie kommt aus den Plänen des Auftraggebers.

## Übersicht

Interaktiver 3D-Baukasten für ein fiktives Mustergrundstück (ca. 2400 m²). Der Viewer ermöglicht das Verschieben von Bebauungsoptionen im Browser – ohne CAD-Software. Ein DXF-Export erlaubt die Weiterverarbeitung in AutoCAD oder anderen CAD-Programmen.

**Live Demo:** Öffnen Sie `index.html` direkt im Browser oder via GitHub Pages / raw.githack.

## Features

- **Shared Kit List**: Eine JSON-Datei (`kit.json`) definiert alle Geometrien — eine Quelle für HTML-Viewer, DXF und DAE
- **3D Viewer**: Three.js-basierter Viewer mit Orbit-Steuerung und Drag-and-Drop
- **DXF Export**: AutoCAD-kompatibler Export (R2010, Meter, benannte Layer/Blöcke)
- **DAE Export für SketchUp**: Collada-Export der aktuellen Konfiguration → in SketchUp öffnen → als .skp speichern
- **Deutsche UI**: Alle Labels und Beschriftungen auf Deutsch

## Das Demo-Szenario

Das Muster zeigt ein fiktives Grundstück mit ähnlichen Eigenschaften wie reale Projekte:

| Element | Beschreibung |
|---------|-------------|
| **Grundstück** | ca. 2400 m² (40×60 m), unregelmäßige Parzellen |
| **Bestand** | Wohnhaus, Schuppen, Garage als einfache Volumenblöcke |
| **Baufenster** | ca. 700 m² bebaubare Fläche (gelb markiert) |
| **Grenzabstände** | 3 m Abstandsflächen (schematisch) |
| **Durchfahrt** | Zufahrtsstraße mit Lärmschutzstreifen |
| **Bäume** | Bestandsbäume als Kronenradien |

### Bebauungsoptionen (verschiebbar)

1. **Seniorengerechter Bungalow** — 16×12 m, 1 Geschoss, große Grundfläche (grün)
2. **Kompaktes 2-geschossiges EFH** — 10×8 m, 2 Geschosse (blau)
3. **3-Familien-Haus** — 14×10 m, 3 Geschosse (lila)
4. **Ersatzneubau** — Ersetzt Bestandsvolumen, 14×11 m (orange)

### Zusätzliche Kit-Teile

- PV-Anlage (Platzhalter)
- Zisterne / Regenwassertank
- Grünfläche / Bepflanzung

## Dateien

```
├── index.html        # 3D-Viewer (öffnet direkt im Browser)
├── kit.json          # Shared Kit Definition (Geometrie-Daten)
├── generate-dxf.js   # Node.js Script für DXF-Export
└── README.md         # Diese Datei
```

## Nutzung

### Browser-Viewer

Einfach `index.html` öffnen:
- Direkt als lokale Datei (funktioniert mit CORS-Einschränkungen bei manchen Browsern)
- Via lokalem Server: `npx serve .` oder `python -m http.server`
- Via GitHub Pages oder raw.githack für öffentlichen Zugang

**Steuerung:**
- Linksklick + Ziehen: Kit-Teile verschieben
- Rechte Maustaste: Orbit
- Mausrad: Zoom
- Button "DXF exportieren": Lädt aktuelle Konfiguration als DXF-Datei
- Button "Für SketchUp exportieren": Lädt aktuelle Konfiguration als Collada DAE

**Parkplatz:**
Die graue Fläche rechts neben dem Grundstück ist ein Parkplatz für ungenutzte Baukasten-Teile. Ziehen Sie Optionen vom Parkplatz auf das Baufenster (gelb), um sie zu platzieren. Ziehen Sie sie zurück auf den Parkplatz, um sie aus der Planung zu nehmen. Geparkte Teile werden im DXF/DAE-Export auf einem separaten PARKPLATZ-Layer abgelegt.

### DXF-Export (Kommandozeile)

```bash
node generate-dxf.js                    # Erzeugt muster_oberhofer.dxf
node generate-dxf.js ausgabe.dxf        # Erzeugt ausgabe.dxf
```

### SketchUp-Export (DAE → SKP)

Der Browser exportiert Collada (.dae), nicht natives SketchUp (.skp). Das .skp-Format ist proprietär und kann im Browser nicht zuverlässig geschrieben werden.

**Workflow:**
1. Im Browser: Teile verschieben bis die Konfiguration passt
2. Button "Für SketchUp exportieren" klicken → lädt `muster_oberhofer_export.dae`
3. In SketchUp Desktop: Datei → Importieren → die .dae-Datei öffnen
4. In SketchUp: Datei → Speichern unter → als .skp speichern

> **Hinweis:** Die DAE-Datei enthält die **aktuellen verschobenen Positionen** aller Kit-Teile. Beide Exporte (DXF und DAE) verwenden dieselbe Datenquelle (kit.json + aktuelle Transforms).

### Kit-Definition anpassen

Die Datei `kit.json` enthält alle Geometrien:

```json
{
  "meta": { "name": "...", "units": "meters" },
  "site": { "width": 40, "depth": 60, "area_m2": 2400 },
  "layers": {
    "BAUFENSTER": { "color": "#d4a017", "dxfColor": 2 }
  },
  "pieces": [
    {
      "id": "option_bungalow",
      "name": "Option 1: Seniorengerechter Bungalow",
      "layer": "OPTION_BUNGALOW",
      "type": "box",
      "draggable": true,
      "position": [6, 14],
      "size": [16, 12, 3.5],
      "color": "#4a9f4a"
    }
  ]
}
```

**Piece-Typen:**
- `box`: Quader (size: [Breite, Tiefe, Höhe])
- `cylinder`: Zylinder (radius, height)
- `polygon`: Polygon (vertices: [[x,y], ...])
- `tree`: Baummassen (radius, height)

## Technische Details

### HTML-Viewer
- Three.js 0.160
- CSS2DRenderer für Labels
- OrbitControls für Navigation
- Keine externen Abhängigkeiten außer Three.js CDN

### DXF-Export
- Format: AutoCAD R2010 (AC1024)
- Einheiten: Meter
- Benannte Layer für jede Kategorie
- Benannte Blöcke für verschiebbare Elemente
- 3D-Flächen für Volumenblöcke
- Exportiert aktuelle Drag-Positionen

### DAE-Export (für SketchUp)
- Format: Collada 1.4.1
- Einheiten: Meter (Y-up)
- Farbige Materialien pro Stück
- 3D-Meshes für alle Volumenkörper
- **Kein natives .skp** — SketchUp importiert DAE und speichert dann als .skp
- Exportiert aktuelle Drag-Positionen

### Layer im DXF

| Layer | DXF-Farbe | Inhalt |
|-------|-----------|--------|
| SITE_BOUNDARY | 3 (grün) | Grundstücksgrenze |
| BESTAND | 30 (orange) | Bestandsgebäude |
| BAUFENSTER | 2 (gelb) | Bebaubare Fläche |
| ABSTAND | 52 | Grenzabstände |
| LAERMSTREIFEN | 1 (rot) | Lärmschutzzone |
| OPTION_BUNGALOW | 82 (grün) | Bungalow-Option |
| OPTION_EFH | 150 (blau) | EFH-Option |
| OPTION_MFH | 200 (magenta) | MFH-Option |
| OPTION_ERSATZ | 30 | Ersatzneubau |
| TECHNIK | 9 | PV, Zisterne |
| BAEUME | 84 | Bestandsbäume |
| PARKPLATZ | 8 | Geparkte/ungenutzte Teile |

## Hinweise zur Methodik

Dieser Baukasten dient als **erste Gesprächsgrundlage** mit dem Auftraggeber:

1. **Keine echten Daten**: Alle Maße sind fiktiv
2. **Keine Detailplanung**: Nur Massen/Volumen, keine Innenräume
3. **Keine Simulation**: Lärmstreifen ist schematisch, keine Akustikberechnung
4. **Kein Ersatz für CAD**: DXF/DAE-Exporte sind Ausgangspunkte, keine finale Planung
5. **Kein natives .skp**: Browser kann kein echtes SketchUp-Format schreiben — DAE ist der Weg

**Nächste Schritte für echtes Projekt:**
- Vermessungsplan einlesen
- Bebauungsplan-Vorgaben prüfen
- Echte Grundstücksgrenzen übernehmen
- Detaillierte Massenmodelle erstellen

## Lizenz

Dieses Muster ist für interne Demonstrationszwecke. Keine Garantie für Richtigkeit oder Vollständigkeit.

---

*Erstellt als Sample für Planspiele. Reale Geometrie kommt aus den Plänen des Auftraggebers.*
