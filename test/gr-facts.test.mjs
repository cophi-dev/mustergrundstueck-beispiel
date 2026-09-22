import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  GRZ_MAX_121_2,
  VARIANT_IDS,
  variantGrInfo,
  formatGrBadge,
  formatGrPanel
} from "../gr-facts.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const kit = JSON.parse(readFileSync(join(root, "kit.json"), "utf8"));
const html = readFileSync(join(root, "index.html"), "utf8");
const embed = JSON.parse(html.match(/<script id="kit-data"[^>]*>([\s\S]*?)<\/script>/)[1]);

const EXPECTED = {
  bungalow: 205,
  efh: 85,
  doppelhaus: 144,
  ersatz: 120
};

describe("kit GR values", () => {
  it("uses 176 m² as GRZ 0,25 max on 121/2", () => {
    assert.equal(GRZ_MAX_121_2, 176);
    assert.equal(Math.round(702 * 0.25), 176);
  });

  it("has the four variant GRs in kit.json and the embedded kit-data", () => {
    for (const [key, m2] of Object.entries(EXPECTED)) {
      const id = VARIANT_IDS[key];
      const kitPiece = kit.pieces.find((p) => p.id === id);
      const embedPiece = embed.pieces.find((p) => p.id === id);
      assert.equal(kitPiece.gr_m2, m2, `kit.json ${id}`);
      assert.equal(embedPiece.gr_m2, m2, `embed ${id}`);
    }
  });
});

describe("variantGrInfo + badge", () => {
  it("returns null when no variant is selected", () => {
    assert.equal(variantGrInfo(kit.pieces, null), null);
    assert.deepEqual(formatGrBadge(null), { text: "", visible: false, over: false });
    assert.equal(formatGrPanel(null).value, "—");
  });

  it("keeps badge and panel on the same GR for every variant", () => {
    for (const [key, m2] of Object.entries(EXPECTED)) {
      const info = variantGrInfo(kit.pieces, key);
      const badge = formatGrBadge(info);
      const panel = formatGrPanel(info);
      assert.equal(info.m2, m2);
      assert.equal(badge.visible, true);
      assert.match(badge.text, new RegExp("GR " + m2 + " m²"));
      assert.equal(panel.value, m2 + " m²");
    }
  });

  it("flags Bungalow as über GRZ and leaves EFH / Doppelhaus / Ersatz clean", () => {
    const bungalow = formatGrBadge(variantGrInfo(kit.pieces, "bungalow"));
    const panel = formatGrPanel(variantGrInfo(kit.pieces, "bungalow"));
    assert.equal(bungalow.over, true);
    assert.match(bungalow.text, /über GRZ/);
    assert.equal(panel.state, "warn");
    assert.match(panel.warnText, /205 m² > 176 m²/);

    for (const key of ["efh", "doppelhaus", "ersatz"]) {
      const badge = formatGrBadge(variantGrInfo(kit.pieces, key));
      const facts = formatGrPanel(variantGrInfo(kit.pieces, key));
      assert.equal(badge.over, false, key);
      assert.doesNotMatch(badge.text, /über GRZ/);
      assert.equal(facts.state, "ok", key);
    }
  });
});

describe("no stale hardcoded badge", () => {
  it("does not pin a literal GR 205 m² label in the viewer", () => {
    assert.equal((html.match(/makeLabel\("GR 205/g) || []).length, 0);
  });
});
