import { getMuscleGroupParents } from "./muscleHierarchy";

export interface VolumeAnalysisResult {
  seriesDiretas: Record<string, number>;
  volumeDeSets: Record<string, number>;
  cargaVolumePorMusculo: Record<string, number>;
}

export const analyzeVolume = (cycleItems: any[]): VolumeAnalysisResult => {
  const seriesDiretas: Record<string, number> = {};
  const volumeDeSets: Record<string, number> = {};
  const cargaVolumePorMusculo: Record<string, number> = {};

  const addVolumeDeSetsToHierarchy = (muscle: string, setsVal: number) => {
    volumeDeSets[muscle] = (volumeDeSets[muscle] || 0) + setsVal;
    const parents = getMuscleGroupParents(muscle);
    for (const parent of parents) {
      volumeDeSets[parent] = (volumeDeSets[parent] || 0) + setsVal;
    }
  };

  const addCargaToHierarchy = (muscle: string, cargaVal: number) => {
    cargaVolumePorMusculo[muscle] =
      (cargaVolumePorMusculo[muscle] || 0) + cargaVal;
    const parents = getMuscleGroupParents(muscle);
    for (const parent of parents) {
      cargaVolumePorMusculo[parent] =
        (cargaVolumePorMusculo[parent] || 0) + cargaVal;
    }
  };

  cycleItems.forEach((item) => {
    if (item.workout && item.workout.workoutExercises) {
      item.workout.workoutExercises.forEach((workoutExercise: any) => {
        const primary = workoutExercise.exercise.primaryMuscle;
        const secondaries = workoutExercise.exercise.secondaryMuscle || [];
        const sets = workoutExercise.targetSets || 0;

        if (primary) {
          seriesDiretas[primary] = (seriesDiretas[primary] || 0) + sets;
          addVolumeDeSetsToHierarchy(primary, sets);
        }

        secondaries.forEach((sec: string) => {
          addVolumeDeSetsToHierarchy(sec, sets * 0.5);
        });
      });
    }

    if (item.sets && item.sets.length > 0) {
      item.sets.forEach((set: any) => {
        const reps = set.reps || 0;
        const weight = parseFloat(set.weight) || 0;
        const setVolume = reps * weight;
        const primary = set.exercise?.primaryMuscle;
        const secondaries = set.exercise?.secondaryMuscle || [];

        if (primary) {
          addCargaToHierarchy(primary, setVolume);
        }

        secondaries.forEach((sec: string) => {
          addCargaToHierarchy(sec, setVolume * 0.5);
        });
      });
    }
  });

  return { seriesDiretas, volumeDeSets, cargaVolumePorMusculo };
};
