import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import equipment from "../../../data/equipment/equipment.json";
import { type Equipment, type EquipmentData, type Exercise } from "../types";

export const equipmentData = equipment as EquipmentData;

function Requirement({
  requirement,
  equipment,
}: {
  requirement: string;
  equipment: Equipment;
}): JSX.Element {
  return (
    <View
      className="rounded-full py-1 px-4 mr-1 mb-1"
      style={{ backgroundColor: equipment.color }}
    >
      <Text className="text-center text-black text-sm whitespace-nowrap">
        {requirement}
      </Text>
    </View>
  );
}

function ExerciseListItem({
  title,
  requirements,
  onPress,
}: {
  title: string;
  requirements?: string[];
  onPress: any;
}): JSX.Element {
  return (
    <TouchableOpacity
      className=" dark:border-2 dark:border-teal-400 rounded-full dark:shadow-none shadow-sm shadow-black flex p-6 px-8 flex-row items-center mt-6 mx-4 mb-0 justify-between"
      onPress={onPress}
    >
      <Text className="font-bold text-xl grow basis-12 min-w-0 text-black dark:text-white">
        {title}
      </Text>
      {requirements !== undefined && requirements.length > 0 && (
        <View className="ml-4 bg-transparent min-w-[8rem] w-0 grow basis-0">
          <Text className="text-black dark:text-white">Requires:</Text>
          <View className="flex flex-row mt-1 bg-transparent flex-wrap">
            {requirements.map((requirement, index) => {
              const equipment = equipmentData[requirement];
              return (
                <Requirement
                  key={index}
                  equipment={equipment}
                  requirement={requirement}
                />
              );
            })}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function ExerciseSelectionList({
  exercises,
  onSelectedExercise,
}: {
  exercises: Exercise[];
  onSelectedExercise: (exercise: Exercise) => void;
}): JSX.Element {
  return (
    <View className="grow">
      <Text className="text-xl font-bold m-6 mb-0 text-black dark:text-white">
        Which Exercise do you want to do?
      </Text>
      <View className=" grow h-64">
        <ScrollView className="">
          {exercises?.length > 0 && (
            <>
              {exercises.map((exercise, index) => {
                return (
                  <ExerciseListItem
                    key={index}
                    title={exercise.name}
                    requirements={exercise.requirements}
                    onPress={() => {
                      onSelectedExercise(exercise);
                    }}
                  />
                );
              })}
              <ExerciseListItem
                title="Other"
                onPress={() => {
                  onSelectedExercise({ name: "Other" });
                }}
              />
              <View className="h-24" />
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
