import { themas } from "@/global/themes";
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const itemWidth = (width - 10) / 2;

export const styles = StyleSheet.create({
  addExerciseUl: {
    width: itemWidth,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    paddingTop: 10,
    gap: 8,
    marginLeft: 5,
    backgroundColor: "red"
  },
  imagemURl: {
    width: itemWidth - 20,
    height: itemWidth - 20,
    borderRadius: 10,
    backgroundColor: themas.Colors.lightGray,
  },
  nameExercise: {
    marginTop: 6,
    textAlign: "center",
    height: 38,
    width: "100%",
  },
  styledButton: {
    width: "90%",
  },
});
