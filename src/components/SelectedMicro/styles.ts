import { themas } from "@/global/themes";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themas.Colors.background,
    marginTop: 50,
  },

  repsWeightInfo: {
    padding: 5,
  },

  containerModal: {
    flex: 1,
    backgroundColor: themas.Colors.background,
    paddingTop: 30,
  },

  infoHeader: {
    fontFamily: "GeologicaBold",
    fontSize: 16,
    color: themas.Colors.text,
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
  blockHeader: {
    backgroundColor: themas.Colors.blackTransparent,
    borderWidth: 2,
    borderColor: themas.Colors.secondary,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 20,
    gap: 1,
    marginTop: 10,
    marginBottom: 5,
  },
  name: {
    fontSize: 20,
    fontFamily: "GeologicaBold",
  },
  infosWrap: {
    gap: 5,
  },
  info: {
    fontSize: 15,
    fontFamily: "GeologicaBold",
    color: themas.Colors.noSelectColor,
  },
  nameAndBackWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  macrosTitles: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blockSelected: {
    backgroundColor: themas.Colors.primary,
  },
  infoSelected: {
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





  addExerciseUl: {
    width: "33%",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 240,
    marginBottom: 5,
    paddingTop: 5,
    gap: 5
  },
  imagemURl: {
    width: 110,
    height: 110,
    borderRadius: 10,
    backgroundColor: themas.Colors.lightGray,
  },
  nameExercise: {
    marginTop: 6,
    textAlign: "center",
    height: 38
  },



  styledButton: {
    width: "85%",
  }
});
