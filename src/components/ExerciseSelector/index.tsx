import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, FlatList, ActivityIndicator, Pressable } from "react-native";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { UserContext } from "@/contexts/User/UserContext";
import { Exercise } from "@/contexts/User/interface";
import AppText from "../AppText";
import BackAndTitle from "../BackAndTitle";
import ExerciseItem from "../ExerciseItem";
import FiltersByMuscle from "../FiltersByMuscle";
import { formatMuscleLabel } from "@/utils/formatMuscleLabel";
import { themas } from "@/global/themes";
import { styles } from "./styles";

interface ExerciseSelectorProps {
  onSelect: (exercise: Exercise) => void;
  onBack: () => void;
  checkExerciseExists?: (exerciseId: string) => boolean;
  title?: string;
  staticData?: Exercise[];
}

const ExerciseSelector = ({
  onSelect,
  onBack,
  checkExerciseExists,
  title = "ADICIONAR EXERCÍCIO",
  staticData,
}: ExerciseSelectorProps) => {
  const { getAllExercise } = useContext(UserContext);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[] | null>(
    null,
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadExercises = useCallback(
    async (pageNumber: number, limit: number = 10) => {
      if (staticData) {
        setExercises(staticData);
        setHasMore(false);
        return;
      }

      if (loadingMore || !hasMore) return;
      setLoadingMore(true);

      try {
        const data: any = await getAllExercise(pageNumber, limit);

        if (data?.data?.length) {
          setExercises((prev) => {
            const newExercises = data.data.filter(
              (newEx: Exercise) =>
                !prev.some((existingEx) => existingEx.id === newEx.id),
            );
            return [...prev, ...newExercises];
          });
          setPage(pageNumber + 1);
        } else {
          setHasMore(false);
        }
      } catch (err: any) {
        if (
          err?.response?.status === 404 ||
          err?.response?.data === "No exercises"
        ) {
          setHasMore(false);
        } else {
          console.error("Erro ao carregar os exercícios:", err);
        }
      } finally {
        setLoadingMore(false);
      }
    },
    [loadingMore, hasMore, getAllExercise, staticData],
  );

  useEffect(() => {
    loadExercises(1);
  }, [loadExercises]);

  const handleLoadMore = useCallback(() => {
    if (staticData) return;
    if (!loadingMore && hasMore && !activeFilter) {
      loadExercises(page);
    }
  }, [loadingMore, hasMore, page, loadExercises, activeFilter, staticData]);

  const handleSelectPrimaryMuscle = async (muscleLabel: string) => {
    try {
      setLoading(true);
      setActiveFilter(muscleLabel);
      const filtersPrimaryMuscle = `primaryMuscle=${encodeURIComponent(
        muscleLabel,
      )}`;
      const { data } = await getAllExercise(1, 10, filtersPrimaryMuscle);

      setFilteredExercises(data);
      setShowFilters(false);
    } catch (err) {
      console.error("Erro ao filtrar exercícios:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilter = useCallback(() => {
    setFilteredExercises(null);
    setActiveFilter(null);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={themas.Colors.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* lista de exercícios */}
      <View style={{ flex: 1, display: showFilters ? "none" : "flex" }}>
        <FlatList
          data={filteredExercises ?? exercises}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => (
            <ExerciseItem
              item={item}
              onAddExercise={onSelect}
              exerciseExists={
                checkExerciseExists ? checkExerciseExists(item.id) : false
              }
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          windowSize={7}
          initialNumToRender={6}
          removeClippedSubviews={true}
          ListHeaderComponent={
            <>
              <View>
                <View style={styles.nameAndFilter}>
                  <BackAndTitle onBack={onBack} title={title} />
                  {!staticData && (
                    <Pressable
                      onPress={() => {
                        setShowFilters(true);
                        setFiltersLoaded(true);
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      delayLongPress={0}
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : 1,
                        backgroundColor: pressed
                          ? "rgba(255,255,255,0.1)"
                          : "transparent",
                        padding: 8,
                        borderRadius: 8,
                        transform: [{ scale: pressed ? 0.95 : 1 }],
                      })}
                    >
                      <FontAwesome6
                        style={styles.filter}
                        name="filter"
                        size={20}
                        color={themas.Colors.secondary}
                      />
                    </Pressable>
                  )}
                </View>
              </View>
              {activeFilter && (
                <View style={styles.activeFilterDeleteWrapper}>
                  <View style={styles.activeFilter}>
                    <AppText>{formatMuscleLabel(activeFilter)}</AppText>
                  </View>
                  <View style={styles.activeFilter}>
                    <Pressable
                      onPress={handleClearFilter}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      delayLongPress={0}
                    >
                      <FontAwesome6 name="xmark" size={15} color="white" />
                    </Pressable>
                  </View>
                </View>
              )}
            </>
          }
          ListFooterComponent={() =>
            loadingMore ? <ActivityIndicator size="large" /> : null
          }
          ListEmptyComponent={() => (
            <AppText style={{ textAlign: "center", marginTop: 20 }}>
              Nenhum Exercício Encontrado
            </AppText>
          )}
        />
      </View>

      {/* filtros */}
      {(showFilters || filtersLoaded) && !staticData && (
        <View
          style={[styles.container, { display: showFilters ? "flex" : "none" }]}
        >
          <Pressable
            onPress={() => setShowFilters(false)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            delayLongPress={0}
            style={{ marginVertical: 10, marginLeft: 10 }}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>
          <FiltersByMuscle
            getAllExercise={getAllExercise}
            onSelectMuscle={handleSelectPrimaryMuscle}
          />
        </View>
      )}
    </View>
  );
};

export default ExerciseSelector;
