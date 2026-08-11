export const OCCASION_GROUPS = [
  {
    label: "Daily",
    icon: "weather-sunny",
    occasions: [
      { key: "CASUAL_DAILY", label: "Casual Daily" },
      { key: "UNIVERSITY", label: "University / College" },
      { key: "WORK_OFFICE", label: "Work / Office" },
      { key: "GROCERY_RUN", label: "Grocery Run" },
      { key: "GYM", label: "Gym / Activewear" },
      { key: "HOME_LOUNGE", label: "Home / Lounge" },
    ],
  },
  {
    label: "Social",
    icon: "glass-cocktail",
    occasions: [
      { key: "DATE_NIGHT", label: "Dinner / Date Night" },
      { key: "PARTY", label: "Party" },
      { key: "FRIENDS_CATCHUP", label: "Friends Catch-up" },
      { key: "WEEKEND_HANGOUT", label: "Weekend Hangout" },
    ],
  },
  {
    label: "Festive & Formals",
    icon: "star-four-points-outline",
    occasions: [
      { key: "WEDDING", label: "Wedding / Reception" },
      { key: "MEHNDI", label: "Mehndi / Mayun" },
      { key: "EID", label: "Eid / Festival" },
      { key: "FORMAL_GALA", label: "Formal / Gala" },
      { key: "DAWAT", label: "Dawat" },
    ],
  },
  {
    label: "Seasonal & Travel",
    icon: "airplane",
    occasions: [
      { key: "SUMMER", label: "Summer / Warm" },
      { key: "WINTER", label: "Winter / Layering" },
      { key: "VACATION", label: "Vacation / Travel" },
      { key: "OUTDOOR_PICNIC", label: "Outdoor / Picnic" },
    ],
  },
];

export const OCCASIONS = OCCASION_GROUPS.flatMap((group) => group.occasions);

export function occasionLabel(key) {
  return OCCASIONS.find((o) => o.key === key)?.label ?? "your occasion";
}

const FORMALITY_WEIGHT = {
  CASUAL_DAILY: 0,
  UNIVERSITY: 0,
  WORK_OFFICE: 2,
  GROCERY_RUN: 0,
  GYM: 0,
  HOME_LOUNGE: 0,
  DATE_NIGHT: 2,
  PARTY: 2,
  FRIENDS_CATCHUP: 1,
  WEEKEND_HANGOUT: 0,
  WEDDING: 3,
  MEHNDI: 3,
  EID: 3,
  FORMAL_GALA: 3,
  DAWAT: 2,
  SUMMER: 1,
  WINTER: 1,
  VACATION: 1,
  OUTDOOR_PICNIC: 0,
};

export function formalityWeight(key) {
  return FORMALITY_WEIGHT[key] ?? 1;
}
