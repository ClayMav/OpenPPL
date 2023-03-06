import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export function WorkoutActions({
  onEndPress,
  onNextPress,
  isLastExercise,
}: {
  onEndPress: () => void;
  onNextPress: () => void;
  isLastExercise: boolean;
}): JSX.Element {
  return (
    <View className=" flex-row w-full justify-between p-6 flex bg-transparent">
      <TouchableOpacity
        className=" bg-red-400 rounded-full py-4 px-8"
        onPress={onEndPress}
      >
        <Text className="font-bold text-black">End Workout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className=" bg-green-400 rounded-full py-4 px-8"
        onPress={onNextPress}
      >
        <Text className="text-black font-bold">
          {isLastExercise ? "Finish Workout" : "Next Muscle Group"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
