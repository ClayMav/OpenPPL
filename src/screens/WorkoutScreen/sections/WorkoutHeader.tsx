import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { shallow } from "zustand/shallow";

import muscleGroups from "../../../assets/images/musclegroups";
import { useStore } from "../../../hooks/useStore";

function MuscleGroupListItem({
  title,
  onPress,
  active,
}: {
  title: string;
  onPress: any;
  active: boolean;
}): JSX.Element {
  return (
    <TouchableOpacity className={`w-28 h-28 relative`} onPress={onPress}>
      <Image
        source={muscleGroups[title.toLowerCase()]}
        className={`w-28 h-28 bg-black`}
        style={{
          opacity: active ? 0.8 : 0.3,
        }}
      />
      <View className={`w-28 h-28 flex justify-end p-2 absolute`}>
        <Text className="text-white font-bold text-xl">{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function WorkoutHeader({
  muscleGroups,
  setSelectedGroup,
  selectedGroup,
}: {
  muscleGroups: string[];
  setSelectedGroup: (index: number) => void;
  selectedGroup: number;
}): JSX.Element {
  const startTime = useStore((state) => {
    return state.workoutStartTime;
  }, shallow);
  if (startTime === undefined) {
    return <></>;
  }
  return (
    <View>
      {/* <View className="flex flex-row items-center justify-between"> */}
      {/* <DurationDisplay startTime={startTime} /> */}
      {/* </View> */}
      <View className="h-28">
        <ScrollView horizontal={true} className="flex flex-row">
          {muscleGroups.map((group, index) => {
            return (
              <MuscleGroupListItem
                key={index}
                title={group}
                onPress={() => {
                  setSelectedGroup(index);
                }}
                active={index === selectedGroup}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
