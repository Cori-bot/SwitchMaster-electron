// Valorant Competitive Tiers mapping
// Based on valorant.js library by Liam Cottle

export const VALORANT_TIERS: Record<number, string> = {
    0: "Non classé",
    1: "Non classé",
    2: "Non classé",
    3: "Fer 1",
    4: "Fer 2",
    5: "Fer 3",
    6: "Bronze 1",
    7: "Bronze 2",
    8: "Bronze 3",
    9: "Argent 1",
    10: "Argent 2",
    11: "Argent 3",
    12: "Or 1",
    13: "Or 2",
    14: "Or 3",
    15: "Platine 1",
    16: "Platine 2",
    17: "Platine 3",
    18: "Diamant 1",
    19: "Diamant 2",
    20: "Diamant 3",
    21: "Ascendant 1",
    22: "Ascendant 2",
    23: "Ascendant 3",
    24: "Immortel 1",
    25: "Immortel 2",
    26: "Immortel 3",
    27: "Radiant",
};

export function getTierName(tier: number): string {
    return VALORANT_TIERS[tier] || "Non classé";
}

export function getTierColor(tier: number): string {
    if (tier >= 27) return "#fffbaa"; // Radiant
    if (tier >= 24) return "#c34b6b"; // Immortel
    if (tier >= 21) return "#2e9e62"; // Ascendant
    if (tier >= 18) return "#a865c9"; // Diamant
    if (tier >= 15) return "#2cc1c1"; // Platine
    if (tier >= 12) return "#c4a84c"; // Or
    if (tier >= 9) return "#b4b4b4"; // Argent
    if (tier >= 6) return "#ad7a4e"; // Bronze
    if (tier >= 3) return "#6e6e6e"; // Fer
    return "#666"; // Non classé
}
