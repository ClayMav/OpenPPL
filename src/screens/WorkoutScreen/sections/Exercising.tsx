import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { type Exercise } from "../types";
import { RestTimer } from "./RestTimer";

const startSeconds = 120;
export function Exercising({
  exercise,
  onBack,
}: {
  exercise: Exercise;
  onBack: () => void;
}): JSX.Element {
  return (
    <View className="m-6 grow">
      <TouchableOpacity
        className="border-2 border-black dark:border-teal-400 py-2 px-6 mb-6 rounded-full bg-transparent"
        onPress={onBack}
      >
        <Text className="text-black dark:text-white text-center text-lg font-bold">
          Back to List
        </Text>
      </TouchableOpacity>
      <Text className="text-3xl font-bold text-black dark:text-white">
        {exercise.name}
      </Text>
      <Text className="text-xl mt-6 text-black dark:text-white">
        Based on 60% of previous workouts:
      </Text>
      <View className="flex flex-row justify-between m-6 mb-10">
        <Text className="text-black dark:text-white">3 Sets</Text>
        <Text className="text-black dark:text-white">10 Reps</Text>
        <Text className="text-black dark:text-white">135 lbs</Text>
      </View>
      <RestTimer seconds={startSeconds} />
    </View>
  );
}
