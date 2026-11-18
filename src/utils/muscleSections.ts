import {
  getRootMuscle,
  getFirstLevelChild,
  MUSCLE_GROUP_HIERARCHY,
} from "./muscleHierarchy";

export type MuscleSection = "Tronco" | "Inferior" | "Membros" | "Outros";

const ROOT_TO_SECTION: Record<string, MuscleSection> = {
  "Peito (Total)": "Tronco",
  "Costas (Total)": "Tronco",
  "Ombros (Total)": "Tronco",
  "Abdominais (Total)": "Tronco",
  "Pernas (Total)": "Inferior",
  "Bíceps (Total)": "Membros",
  "Tríceps (Total)": "Membros",
};

export const getMuscleSection = (muscle: string): MuscleSection => {
  const root = getRootMuscle(muscle);
  return ROOT_TO_SECTION[root] ?? "Outros";
};

export const getMuscleSubsection = (muscle: string): string => {
  const root = getRootMuscle(muscle);
  const rootLabel = root.replace(/\s*\(Total\)$/, "");

  if (muscle === root) return rootLabel;

  if (root === "Pernas (Total)") {
    const firstChild = getFirstLevelChild(muscle);
    if (firstChild) return firstChild.replace(/\s*\(Total\)$/, "");
  }

  return rootLabel;
};

export const SECTION_ORDER: MuscleSection[] = [
  "Tronco",
  "Inferior",
  "Membros",
  "Outros",
];
