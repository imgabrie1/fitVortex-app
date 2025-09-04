import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={container.container}>
      <Text style={textWhite.container}>testando!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const container = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const textWhite = StyleSheet.create({
  container: {
    color: 'red'
  },
});