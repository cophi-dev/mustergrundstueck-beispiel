#!/usr/bin/env node
/**
 * DXF Generator for Mustergrundstück Kit
 * 
 * Generates AutoCAD-compatible DXF (R2010) from kit.json
 * Units: meters, named layers and blocks
 * 
 * Usage: node generate-dxf.js [output.dxf]
 */

const fs = require('fs');
const path = require('path');

const kitPath = path.join(__dirname, 'kit.json');
const outputPath = process.argv[2] || path.join(__dirname, 'muster_oberhofer.dxf');

function generateDXF(data, positions = {}) {
  let dxf = "";
  
  dxf += "0\nSECTION\n2\nHEADER\n";
  dxf += "9\n$ACADVER\n1\nAC1024\n";
  dxf += "9\n$INSUNITS\n70\n6\n";
  dxf += "9\n$MEASUREMENT\n70\n1\n";
  dxf += "9\n$EXTMIN\n10\n" + (-data.site.width/2 - 5) + "\n20\n" + (-data.site.depth/2 - 5) + "\n30\n0\n";
  dxf += "9\n$EXTMAX\n10\n" + (data.site.width/2 + 5) + "\n20\n" + (data.site.depth/2 + 5) + "\n30\n20\n";
  dxf += "0\nENDSEC\n";
  
  dxf += "0\nSECTION\n2\nTABLES\n";
  
  dxf += "0\nTABLE\n2\nLTYPE\n70\n2\n";
  dxf += "0\nLTYPE\n2\nCONTINUOUS\n70\n0\n3\nSolid line\n72\n65\n73\n0\n40\n0\n";
  dxf += "0\nLTYPE\n2\nDASHED\n70\n0\n3\nDashed line\n72\n65\n73\n2\n40\n1.0\n49\n0.5\n49\n-0.5\n";
  dxf += "0\nENDTAB\n";
  
  dxf += "0\nTABLE\n2\nLAYER\n70\n" + (Object.keys(data.layers).length + 1) + "\n";
  dxf += "0\nLAYER\n2\n0\n70\n0\n62\n7\n6\nCONTINUOUS\n";
  
  for (const [layerName, layerDef] of Object.entries(data.layers)) {
    dxf += "0\nLAYER\n2\n" + layerName + "\n";
    dxf += "70\n0\n";
    dxf += "62\n" + (layerDef.dxfColor || 7) + "\n";
    dxf += "6\nCONTINUOUS\n";
  }
  dxf += "0\nENDTAB\n";
  
  dxf += "0\nTABLE\n2\nSTYLE\n70\n1\n";
  dxf += "0\nSTYLE\n2\nSTANDARD\n70\n0\n40\n0\n41\n1\n50\n0\n71\n0\n42\n2.5\n3\ntxt\n4\n\n";
  dxf += "0\nENDTAB\n";
  
  dxf += "0\nENDSEC\n";
  
  dxf += "0\nSECTION\n2\nBLOCKS\n";
  
  dxf += "0\nBLOCK\n2\n*MODEL_SPACE\n70\n0\n10\n0\n20\n0\n30\n0\n3\n*MODEL_SPACE\n";
  dxf += "0\nENDBLK\n";
  dxf += "0\nBLOCK\n2\n*PAPER_SPACE\n70\n0\n10\n0\n20\n0\n30\n0\n3\n*PAPER_SPACE\n";
  dxf += "0\nENDBLK\n";
  
  for (const piece of data.pieces) {
    if (piece.type === "box") {
      const blockName = piece.id.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
      dxf += "0\nBLOCK\n2\n" + blockName + "\n";
      dxf += "70\n0\n10\n0\n20\n0\n30\n0\n";
      
      const [w, d, h] = piece.size;
      const hw = w / 2, hd = d / 2;
      
      dxf += "0\nLWPOLYLINE\n8\n" + piece.layer + "\n";
      dxf += "90\n4\n70\n1\n";
      dxf += "10\n" + (-hw) + "\n20\n" + (-hd) + "\n";
      dxf += "10\n" + hw + "\n20\n" + (-hd) + "\n";
      dxf += "10\n" + hw + "\n20\n" + hd + "\n";
      dxf += "10\n" + (-hw) + "\n20\n" + hd + "\n";
      
      dxf += "0\n3DFACE\n8\n" + piece.layer + "\n";
      dxf += "10\n" + (-hw) + "\n20\n" + (-hd) + "\n30\n0\n";
      dxf += "11\n" + hw + "\n21\n" + (-hd) + "\n31\n0\n";
      dxf += "12\n" + hw + "\n22\n" + hd + "\n32\n0\n";
      dxf += "13\n" + (-hw) + "\n23\n" + hd + "\n33\n0\n";
      
      dxf += "0\n3DFACE\n8\n" + piece.layer + "\n";
      dxf += "10\n" + (-hw) + "\n20\n" + (-hd) + "\n30\n" + h + "\n";
      dxf += "11\n" + hw + "\n21\n" + (-hd) + "\n31\n" + h + "\n";
      dxf += "12\n" + hw + "\n22\n" + hd + "\n32\n" + h + "\n";
      dxf += "13\n" + (-hw) + "\n23\n" + hd + "\n33\n" + h + "\n";
      
      dxf += "0\nLINE\n8\n" + piece.layer + "\n";
      dxf += "10\n" + (-hw) + "\n20\n" + (-hd) + "\n30\n0\n";
      dxf += "11\n" + (-hw) + "\n21\n" + (-hd) + "\n31\n" + h + "\n";
      
      dxf += "0\nLINE\n8\n" + piece.layer + "\n";
      dxf += "10\n" + hw + "\n20\n" + (-hd) + "\n30\n0\n";
      dxf += "11\n" + hw + "\n21\n" + (-hd) + "\n31\n" + h + "\n";
      
      dxf += "0\nLINE\n8\n" + piece.layer + "\n";
      dxf += "10\n" + hw + "\n20\n" + hd + "\n30\n0\n";
      dxf += "11\n" + hw + "\n21\n" + hd + "\n31\n" + h + "\n";
      
      dxf += "0\nLINE\n8\n" + piece.layer + "\n";
      dxf += "10\n" + (-hw) + "\n20\n" + hd + "\n30\n0\n";
      dxf += "11\n" + (-hw) + "\n21\n" + hd + "\n31\n" + h + "\n";
      
      const labelText = piece.label || piece.name;
      dxf += "0\nTEXT\n8\n" + piece.layer + "\n";
      dxf += "10\n0\n20\n0\n30\n" + (h + 0.3) + "\n";
      dxf += "40\n0.6\n1\n" + labelText + "\n";
      dxf += "72\n1\n11\n0\n21\n0\n31\n" + (h + 0.3) + "\n";
      
      dxf += "0\nENDBLK\n";
    }
    else if (piece.type === "cylinder") {
      const blockName = piece.id.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
      dxf += "0\nBLOCK\n2\n" + blockName + "\n";
      dxf += "70\n0\n10\n0\n20\n0\n30\n0\n";
      
      dxf += "0\nCIRCLE\n8\n" + piece.layer + "\n";
      dxf += "10\n0\n20\n0\n30\n0\n";
      dxf += "40\n" + piece.radius + "\n";
      
      dxf += "0\nCIRCLE\n8\n" + piece.layer + "\n";
      dxf += "10\n0\n20\n0\n30\n" + piece.height + "\n";
      dxf += "40\n" + piece.radius + "\n";
      
      const labelText = piece.label || piece.name;
      dxf += "0\nTEXT\n8\n" + piece.layer + "\n";
      dxf += "10\n0\n20\n0\n30\n" + (piece.height + 0.3) + "\n";
      dxf += "40\n0.5\n1\n" + labelText + "\n";
      dxf += "72\n1\n11\n0\n21\n0\n31\n" + (piece.height + 0.3) + "\n";
      
      dxf += "0\nENDBLK\n";
    }
  }
  
  dxf += "0\nENDSEC\n";
  
  dxf += "0\nSECTION\n2\nENTITIES\n";
  
  const hw = data.site.width / 2, hd = data.site.depth / 2;
  dxf += "0\nLWPOLYLINE\n8\nSITE_BOUNDARY\n";
  dxf += "90\n4\n70\n1\n";
  dxf += "10\n" + (-hw) + "\n20\n" + (-hd) + "\n";
  dxf += "10\n" + hw + "\n20\n" + (-hd) + "\n";
  dxf += "10\n" + hw + "\n20\n" + hd + "\n";
  dxf += "10\n" + (-hw) + "\n20\n" + hd + "\n";
  
  for (const piece of data.pieces) {
    if (piece.type === "polygon") {
      let verts = piece.vertices;
      const pos = positions[piece.id];
      if (pos) {
        verts = verts.map(v => [v[0] + pos.x, v[1] + pos.z]);
      } else if (piece.position) {
        verts = verts.map(v => [v[0] + piece.position[0], v[1] + piece.position[1]]);
      }
      
      dxf += "0\nLWPOLYLINE\n8\n" + piece.layer + "\n";
      dxf += "90\n" + verts.length + "\n70\n1\n";
      for (const v of verts) {
        dxf += "10\n" + v[0] + "\n20\n" + v[1] + "\n";
      }
      
      if (piece.label) {
        const cx = verts.reduce((s, v) => s + v[0], 0) / verts.length;
        const cy = verts.reduce((s, v) => s + v[1], 0) / verts.length;
        dxf += "0\nTEXT\n8\n" + piece.layer + "\n";
        dxf += "10\n" + cx + "\n20\n" + cy + "\n30\n0\n";
        dxf += "40\n0.5\n1\n" + piece.label + "\n";
        dxf += "72\n1\n11\n" + cx + "\n21\n" + cy + "\n31\n0\n";
      }
    }
    else if (piece.type === "box" || piece.type === "cylinder") {
      const blockName = piece.id.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
      const pos = positions[piece.id];
      const x = pos ? pos.x : piece.position[0];
      const z = pos ? pos.z : piece.position[1];
      
      dxf += "0\nINSERT\n8\n" + piece.layer + "\n";
      dxf += "2\n" + blockName + "\n";
      dxf += "10\n" + x + "\n20\n" + z + "\n30\n0\n";
      dxf += "41\n1\n42\n1\n43\n1\n50\n0\n";
    }
    else if (piece.type === "tree") {
      dxf += "0\nCIRCLE\n8\n" + piece.layer + "\n";
      dxf += "10\n" + piece.position[0] + "\n20\n" + piece.position[1] + "\n30\n0\n";
      dxf += "40\n" + piece.radius + "\n";
      
      dxf += "0\nCIRCLE\n8\n" + piece.layer + "\n";
      dxf += "10\n" + piece.position[0] + "\n20\n" + piece.position[1] + "\n30\n" + piece.height + "\n";
      dxf += "40\n" + (piece.radius * 0.3) + "\n";
      
      dxf += "0\nPOINT\n8\n" + piece.layer + "\n";
      dxf += "10\n" + piece.position[0] + "\n20\n" + piece.position[1] + "\n30\n0\n";
    }
  }
  
  dxf += "0\nTEXT\n8\nSITE_BOUNDARY\n";
  dxf += "10\n0\n20\n" + (-hd - 3) + "\n30\n0\n";
  dxf += "40\n1.2\n1\n" + data.meta.name + " (ca. " + data.site.area_m2 + " m²)\n";
  dxf += "72\n1\n11\n0\n21\n" + (-hd - 3) + "\n31\n0\n";
  
  dxf += "0\nTEXT\n8\nSITE_BOUNDARY\n";
  dxf += "10\n0\n20\n" + (-hd - 5) + "\n30\n0\n";
  dxf += "40\n0.7\n1\nNUR MUSTER - Reale Geometrie aus Kundenplaenen\n";
  dxf += "72\n1\n11\n0\n21\n" + (-hd - 5) + "\n31\n0\n";
  
  dxf += "0\nTEXT\n8\nSITE_BOUNDARY\n";
  dxf += "10\n0\n20\n" + (-hd - 6.5) + "\n30\n0\n";
  dxf += "40\n0.5\n1\nEinheiten: Meter | DXF Version: R2010 (AC1024)\n";
  dxf += "72\n1\n11\n0\n21\n" + (-hd - 6.5) + "\n31\n0\n";
  
  dxf += "0\nENDSEC\n";
  dxf += "0\nEOF\n";
  
  return dxf;
}

try {
  const kitJson = fs.readFileSync(kitPath, 'utf8');
  const kitData = JSON.parse(kitJson);
  
  console.log('Mustergrundstück DXF Generator');
  console.log('==============================');
  console.log('Kit:', kitData.meta.name);
  console.log('Fläche:', kitData.site.area_m2, 'm²');
  console.log('Teile:', kitData.pieces.length);
  console.log('Layer:', Object.keys(kitData.layers).length);
  console.log('');
  
  const dxfContent = generateDXF(kitData);
  fs.writeFileSync(outputPath, dxfContent);
  
  console.log('DXF exportiert:', outputPath);
  console.log('');
  console.log('Hinweis: Dies ist ein MUSTER - reale Geometrie');
  console.log('         kommt aus den Plänen des Auftraggebers.');
  
} catch (err) {
  console.error('Fehler:', err.message);
  process.exit(1);
}
