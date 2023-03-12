import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useStore } from "../../../hooks/useStore";

import muscleGroups from "../../../assets/images/musclegroups";

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
    <TouchableOpacity className={`w-32 h-32 relative`} onPress={onPress}>
      <Image
        source={muscleGroups[title.toLowerCase()]}
        className={`w-32 h-32 bg-black`}
        style={{
          opacity: active ? 0.8 : 0.3,
        }}
      />
      <View className={`w-32 h-32 flex justify-end p-2 absolute`}>
        <Text className="text-white font-bold text-xl">{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const zeroPad = (num: number, places: number): string =>
  String(num).padStart(places, "0");

function DurationDisplay({ startTime }: { startTime: number }): JSX.Element {
  const getTimeSince = (): number => {
    return Date.now() - startTime;
  };
  const [duration, setDuration] = useState(getTimeSince);

  useEffect(() => {
    setInterval(() => {
      setDuration(getTimeSince());
    }, 1000);
  }, []);

  const minutes = Math.floor(duration / 60 / 1000);
  const seconds = Math.floor(duration / 1000 - minutes * 60);
  return (
    <Text className="text-black dark:text-white text-xl">
      Duration: {`${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)}`}
    </Text>
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
  });
  if (startTime === undefined) {
    return <></>;
  }
  return (
    <View>
      <View className="flex flex-row items-center justify-between">
        <Text className="text-2xl font-bold m-6 text-black dark:text-white">
          Muscle Groups
        </Text>
        <DurationDisplay startTime={startTime} />
      </View>
      <View className="h-32">
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
