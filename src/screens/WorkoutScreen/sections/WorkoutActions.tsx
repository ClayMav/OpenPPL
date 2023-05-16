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
    <View className="absolute bottom-0 left-0 right-0 flex-row p-4 justify-between flex">
      <TouchableOpacity
        className=" relative bg-red-400 rounded-full py-4 px-5"
        onPress={onEndPress}
      >
        <Text className="font-bold text-black">End Workout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className=" relative bg-green-400 rounded-full py-4 px-5"
        onPress={onNextPress}
      >
        <Text className="text-black font-bold">
          {isLastExercise ? "Finish Workout" : "Next Muscle Group"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
