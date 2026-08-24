# Mustergrundstück Oberhofer — Baukasten Demo

> **WICHTIG: Dies ist ein MUSTER / SAMPLE** — nicht das echte Grundstück.  
> Alle Geometrien sind fiktiv und dienen nur zur Demonstration der Methodik.  
> Reale Geometrie kommt aus den Plänen des Auftraggebers.

## Übersicht

Interaktiver 3D-Baukasten für ein fiktives Mustergrundstück (ca. 2400 m²). Der Viewer ermöglicht das Verschieben von Bebauungsoptionen im Browser – ohne CAD-Software.

**🔗 Live Demo:** **https://cophi-dev.github.io/mustergrundstueck-beispiel/**

Zwei Browser mit derselben URL sehen synchronisierte Positionen (via Yjs). Sonnenstands-Slider, Varianten-Buttons und Objekt-Erstellung direkt im Viewer.

## Features

- **Shared Kit List**: Eine JSON-Datei (`kit.json`) definiert alle Geometrien
- **3D Viewer**: Three.js-basierter Viewer mit Orbit-Steuerung und Drag-and-Drop
- **Varianten-Auswahl**: Schnelles Umschalten zwischen Bungalow, EFH, MFH und Ersatzneubau
- **Sonnenstands-Simulation**: Einstellbarer Sonnenstand nach Uhrzeit und Monat
- **Live-Sync**: Mehrere Browser sehen synchronisierte Positionen (Yjs)
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
- Varianten-Buttons: Schnelles Umschalten zwischen Bebauungsoptionen
- Sonne-Slider: Sonnenstand einstellen (Uhrzeit, Monat)

**Parkplatz:**
Die graue Fläche rechts neben dem Grundstück ist ein Parkplatz für ungenutzte Baukasten-Teile. Wählen Sie eine Variante über die Buttons oben — die gewählte Option erscheint auf dem Baufenster (gelb), alle anderen Optionen werden auf den Parkplatz verschoben. Teile können auch manuell per Drag-and-Drop verschoben werden.

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
- SunCalc für realistische Sonnenstände
- Yjs für Echtzeit-Synchronisation
- Keine externen Abhängigkeiten außer CDNs

## Hinweise zur Methodik

Dieser Baukasten dient als **erste Gesprächsgrundlage** mit dem Auftraggeber:

1. **Keine echten Daten**: Alle Maße sind fiktiv
2. **Keine Detailplanung**: Nur Massen/Volumen, keine Innenräume
3. **Keine Simulation**: Lärmstreifen ist schematisch, keine Akustikberechnung

**Nächste Schritte für echtes Projekt:**
- Vermessungsplan einlesen
- Bebauungsplan-Vorgaben prüfen
- Echte Grundstücksgrenzen übernehmen
- Detaillierte Massenmodelle erstellen

## Lizenz

Dieses Muster ist für interne Demonstrationszwecke. Keine Garantie für Richtigkeit oder Vollständigkeit.

---

*Erstellt als Sample für Planspiele. Reale Geometrie kommt aus den Plänen des Auftraggebers.*
