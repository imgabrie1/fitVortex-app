import { useState, useEffect } from "react";
import api from "@/services/api";

export const useMuscleFilters = (getAllExercise: Function) => {
  const [muscles, setMuscles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const checkMuscleHasExercises = async (
    muscleLabel: string
  ): Promise<boolean> => {
    try {
      const filters = `primaryMuscle=${encodeURIComponent(muscleLabel)}`;
      const response = await getAllExercise(1, 1, filters);
      return response.data && response.data.length > 0;
    } catch (error) {
      return false;
    }
  };

  const loadMuscles = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<any[]>("muscles");

      // ✅ Todas as verificações em paralelo - MUITO MAIS RÁPIDO
      const verificationPromises = data.map(async (muscle) => {
        try {
          const hasExercises = await checkMuscleHasExercises(muscle.label);
          return hasExercises ? muscle : null;
        } catch (error) {
          console.warn(`Erro ao verificar ${muscle.label}:`, error);
          return null;
        }
      });

      const results = await Promise.all(verificationPromises);
      const verifiedMuscles = results.filter(Boolean);

      setMuscles(verifiedMuscles);
    } catch (error) {
      console.error("Erro ao carregar músculos:", error);
      setMuscles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMuscles();
  }, []);

  return { muscles, loading, refetch: loadMuscles };
};
