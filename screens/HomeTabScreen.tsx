import { StyleSheet, TouchableOpacity } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import PrimaryButton from "../components/PrimaryButton";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

function QuickStartButton({ children, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className=" shadow-black shadow-md bg-white p-6 grow m-4 rounded-xl h-32 flex align-center"
    >
      <Text className="text-center text-xl">{children}</Text>
    </TouchableOpacity>
  );
}

export default function HomeTabScreen({
  navigation,
}: RootTabScreenProps<"HomeTab">) {
  return (
    <View className="bg-white h-screen">
      <View className="m-6 mb-0">
        <Text className="text-2xl">Next Workout</Text>
        <Text className="text-3xl font-bold mt-2">Legs, Today at 5pm</Text>
        <PrimaryButton
          onPress={() => navigation.navigate("Modal", { workout: "Legs" })}
        >
          Start Legs
        </PrimaryButton>
        <Text className="mt-10 text-xl">Quick Start</Text>
      </View>
      <View className="flex flex-row m-2">
        <QuickStartButton
          onPress={() => navigation.navigate("Modal", { workout: "Push" })}
        >
          Push
        </QuickStartButton>
        <QuickStartButton
          onPress={() => navigation.navigate("Modal", { workout: "Pull" })}
        >
          Pull
        </QuickStartButton>
        <QuickStartButton
          onPress={() => navigation.navigate("Modal", { workout: "Legs" })}
        >
          Legs
        </QuickStartButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
