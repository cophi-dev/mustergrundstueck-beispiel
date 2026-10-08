# Ashausener Str. 12, Stelle – 3D-Modell (Bestand + Neubau Bungalow V1)

**Live:** https://oberhofer.vercel.app/ (nicht für Suchmaschinen indexiert)

Eine Seite mit zwei Ansichten:

| Ansicht | Pfad | Inhalt |
|---|---|---|
| Visualisierung | `/` (Standard), direkt: `/3d/` | Three.js-Viewer für das Blender-Modell (Bestand v2 + Neubau Bungalow V1, ein-/ausblendbar; `?bestand` = nur Bestand) |
| IFC-Modell | `/#ifc`, direkt: `/ifc/` | IFC4-Datei im Browser (web-ifc 0.0.77, lokal unter `ifc/lib/`); Bauteil anklicken → Klasse, Name, Materialschichten, Psets inkl. `Oberhofer_Info` |

Downloads unter `/dateien/`: IFC4, IFC2x3, Plan Bungalow V1 (PDF).

Weiterleitungen (`vercel.json`): `/viewer` → `/`, `/viewer/*` → `/3d/*`, `/modell` → `/`, `/ifc-modell` → `/#ifc`.

## Archiv: alter Baukasten-Viewer

Der frühere interaktive Baukasten (Root-`index.html`, `kit.json`, `gr-facts.js`, DXF) ist offline genommen und liegt unverändert im Tag
`archiv/baukasten-2026-10-08` bzw. im Branch `archiv/baukasten`. Wiederherstellen: `git checkout archiv/baukasten -- index.html kit.json gr-facts.js generate-dxf.js ashausener_str_12.dxf satellit.jpg test`.
