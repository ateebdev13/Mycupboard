export const OCCASIONS = [
  { key: "WORK", label: "Work / Business" },
  { key: "CASUAL", label: "Casual Daily" },
  { key: "FORMAL", label: "Formal / Event" },
  { key: "WEEKEND", label: "Weekend" },
];

export function occasionLabel(key) {
  return OCCASIONS.find((o) => o.key === key)?.label ?? "Everyday Editorial";
}
