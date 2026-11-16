export const MUSCLE_GROUP_HIERARCHY: Record<string, string[]> = {
  "Peito (Total)": ["Peito Superior", "Peito Médio", "Peito Inferior"],
  "Costas (Total)": [
    "Costas Superior",
    "Costas Inferior",
    "Dorsais (Latíssimo do Dorso)",
    "Rombóides",
  ],
  "Pernas (Total)": [
    "Quadríceps (Total)",
    "Posterior de Coxa (Total)",
    "Panturrilhas (Total)",
    "Glúteos",
  ],
  "Quadríceps (Total)": [
    "Reto Femoral",
    "Vasto Lateral",
    "Vasto Medial",
    "Vasto Intermédio",
  ],
  "Posterior de Coxa (Total)": [
    "Bíceps Femoral",
    "Semitendíneo",
    "Semimembranoso",
  ],
  "Panturrilhas (Total)": ["Gastrocnêmio", "Sóleo"],
  "Ombros (Total)": [
    "Deltóide Anterior",
    "Deltóide Lateral",
    "Deltóide Posterior",
  ],
  "Bíceps (Total)": [
    "Cabeça Longa do Bíceps",
    "Cabeça Curta do Bíceps",
    "Braquial",
  ],
  "Tríceps (Total)": [
    "Cabeça Longa do Tríceps",
    "Cabeça Medial do Tríceps",
    "Cabeça Lateral do Tríceps",
  ],
  "Abdominais (Total)": [
    "Abdominais Superiores",
    "Abdominais Inferiores",
    "Oblíquos",
  ],
};

export const getMuscleGroupParents = (muscle: string): string[] => {
  const parents: string[] = [];
  for (const parent in MUSCLE_GROUP_HIERARCHY) {
    if (MUSCLE_GROUP_HIERARCHY[parent].includes(muscle)) {
      parents.push(parent);
      parents.push(...getMuscleGroupParents(parent));
    }
  }
  return [...new Set(parents)];
};

export const getRootMuscle = (muscle: string): string => {
  const parents = getMuscleGroupParents(muscle);
  return parents.length > 0 ? parents[parents.length - 1] : muscle;
};

export const getFirstLevelChild = (muscle: string): string | null => {
  for (const root in MUSCLE_GROUP_HIERARCHY) {
    if (MUSCLE_GROUP_HIERARCHY[root].includes(muscle)) {
      return muscle;
    }
    const deeper = getMuscleGroupParents(muscle);
    if (deeper.includes(root)) {
      return (
        MUSCLE_GROUP_HIERARCHY[root].find((child) =>
          [muscle, ...deeper].includes(child),
        ) ?? null
      );
    }
  }
  return null;
};
