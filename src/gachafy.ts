/*
Q – 0.1962%
J – 0.1965%
Z – 0.2722%
X – 0.2902%
V – 1.0074%
K – 1.1016%
W – 1.2899%
Y – 1.7779%
F – 1.8121%
B – 2.0720%
G – 2.4705%
H – 3.0034%
M – 3.0129%
P – 3.1671%
D – 3.3844%
U – 3.6308%
C – 4.5388%
L – 5.4893%
S – 5.7351%
N – 6.6544%
T – 6.9509%
O – 7.1635%
I – 7.5448%
R – 7.5809%
A – 8.4966%
E – 11.1607%
*/
const tiers = {
  common: ["Q", "J", "Z", "X"],
  uncommon: ["V", "K", "W", "Y"],
  rare: ["F", "B", "G", "H", "M", "P", "D", "U", "C"],
  legendary: ["L", "S", "N", "T", "O", "I", "R", "A", "E"],
};

/*
  Chances of pulling each tier:
    common: 50%
    uncommon: 40%
    rare: 8%
    legendary: 2%
  Within each tier, the chances are evenly distributed.
*/
export const singlePull = (): string => {
  const rarity = Math.random();
  const tier =
        rarity < 0.5
          ? "common"
          : rarity < 0.9
            ? "uncommon"
            : rarity < 0.98
              ? "rare"
              : "legendary";
  const index = Math.floor(Math.random() * tiers[tier].length);
  return tiers[tier][index];
};

export const gachafyMeCapn = (pulls: number): string[] => {
  return Array.from({ length: pulls }).map(singlePull);
};
