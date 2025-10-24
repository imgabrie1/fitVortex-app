import { themas } from "@/global/themes";
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window")

export const styles = StyleSheet.create({
  repsWeightInfo: {
    padding: 5,
  },

  blocks: {
    backgroundColor: themas.Colors.blocks,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 20,
    gap: 10,
    marginTop: 10,
    marginBottom: 5,
  },

  name: {
    fontSize: 20,
    fontFamily: "GeologicaBold",
  },

  info: {
    fontSize: 15,
    fontFamily: "GeologicaBold",
    color: themas.Colors.lightGray,
  },

  infoWorkoutWrap: {
    paddingBottom: 15,
    borderBottomColor: themas.Colors.gray,
    borderBottomWidth: 0.5,
    gap: 5,
  },

  nameAndMenuWrap: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  exerciseImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    backgroundColor: themas.Colors.text,
  },

  editAndDeleteWrap: {
    position: "absolute",
    width: width * 0.4,
    right: 12,
    top: 0,
    backgroundColor: "#3737376c",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    zIndex: 999,
    elevation: 60,
    shadowColor: "#888888ff",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  exercisesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Alterado para space-between
    marginTop: 8, // Reduzido de 12 para 8
  },

  exerciseItem: {
    width: width / 2.8,
    alignItems: "center",
    marginBottom: 12, // Adicionado espaçamento na parte inferior
  },

  exerciseName: {
    fontSize: 14,
    fontFamily: "GeologicaBold",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
    height: height / 18,
  },

  setsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    width: width / 2.5
  },

  setItem: {
    padding: 6,
    alignItems: "center",
  },

  setInfo: {
    fontSize: 12,
    fontFamily: "GeologicaBold",
    color: themas.Colors.gray,
    textAlign: "center",
  },

  set: {
    color: themas.Colors.primary,
  },

  notes: {
    fontSize: 10,
    fontFamily: "GeologicaBold",
    color: themas.Colors.noSelectColor,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 2,
  },
});
