/** Shared GR / GRZ helpers for the Ashausener Str. 12 viewer. */

export const GRZ_MAX_121_2 = 176;

export const VARIANT_IDS = {
  bungalow: "option_bungalow",
  efh: "option_efh",
  doppelhaus: "option_doppelhaus",
  ersatz: "option_ersatz"
};

export function variantGrInfo(pieces, variantKey, variantIds = VARIANT_IDS) {
  if (!variantKey || !Array.isArray(pieces)) return null;
  const id = variantIds[variantKey];
  const piece = pieces.find((p) => p.id === id);
  if (!piece) return null;
  const m2 = Number.isFinite(piece.gr_m2)
    ? piece.gr_m2
    : Math.round((piece.size?.[0] || 0) * (piece.size?.[1] || 0));
  const on1212 = variantKey !== "ersatz";
  return { m2, on1212, label: String(piece.name || "").replace(/^Option \d+:\s*/, "") };
}

export function formatGrBadge(info, grzMax = GRZ_MAX_121_2) {
  if (!info) return { text: "", visible: false, over: false };
  const over = Boolean(info.on1212 && info.m2 > grzMax);
  return {
    text: "GR " + info.m2 + " m²" + (over ? " · über GRZ" : ""),
    visible: true,
    over
  };
}

export function formatGrPanel(info, grzMax = GRZ_MAX_121_2) {
  if (!info) {
    return {
      value: "—",
      label: "GR (Variante wählen)",
      state: null,
      over: false,
      warnText: ""
    };
  }
  if (!info.on1212) {
    return {
      value: info.m2 + " m²",
      label: "GR " + info.label + " (auf 121/1)",
      state: "ok",
      over: false,
      warnText: ""
    };
  }
  const over = info.m2 > grzMax;
  return {
    value: info.m2 + " m²",
    label: "GR " + info.label + (over ? " · über GRZ 0,25" : ""),
    state: over ? "warn" : "ok",
    over,
    warnText: over ? info.m2 + " m² > " + grzMax + " m² (GRZ 0,25)" : ""
  };
}
