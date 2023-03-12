import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { type Workouts } from "src/types";
import { useStore } from "../hooks/useStore";

function QuickStartButton({ children, onPress }: any): JSX.Element {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="border-2 border-black dark:border-teal-400 px-2 py-6 grow basis-0 w-0 my-4 mx-3 rounded-xl h-32 flex align-center"
    >
      <Text className="text-center text-xl text-black dark:text-white">
        {children}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeTabScreen({
  navigation,
}: {
  navigation: any;
}): JSX.Element {
  const setWorkoutStartTime = useStore((state) => state.setWorkoutStartTime);
  const onPress = (workout: Workouts): void => {
    setWorkoutStartTime(Date.now());
    navigation.navigate("Modal", { workout });
  };
  return (
    <View className="h-screen">
      <View className="m-6 mb-0">
        <Text className="text-2xl text-black dark:text-white">
          Next Workout
        </Text>
        <Text className="text-3xl font-bold mt-2 text-black dark:text-white mb-6">
          Legs, Today at 5pm
        </Text>
        <TouchableOpacity
          onPress={() => {
            onPress("Legs");
          }}
          className="rounded-full bg-transparent border-2 border-black dark:border-teal-400 flex items-center justify-center py-3 px-6"
        >
          <Text className="text-black dark:text-white text-xl font-bold">
            Start Legs
          </Text>
        </TouchableOpacity>
        <Text className="mt-10 text-xl text-black dark:text-white">
          Quick Start
        </Text>
      </View>
      <View className="flex flex-row m-2">
        <QuickStartButton
          onPress={() => {
            onPress("Push");
          }}
        >
          Push
        </QuickStartButton>
        <QuickStartButton
          onPress={() => {
            onPress("Pull");
          }}
        >
          Pull
        </QuickStartButton>
        <QuickStartButton
          onPress={() => {
            onPress("Legs");
          }}
        >
          Legs
        </QuickStartButton>
      </View>
    </View>
  );
}
