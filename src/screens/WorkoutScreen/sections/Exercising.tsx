import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useStore } from "../../../hooks/useStore";
import { type Exercise } from "../types";
import { RestTimer } from "./RestTimer";

const NumberEntry = ({
  firstTime,
  onChangeText,
  value,
  onSubmit,
  label,
  classNames,
}: {
  firstTime: boolean;
  onChangeText: (val: string) => void;
  value: number;
  onSubmit?: () => void;
  label: string;
  classNames?: string;
}): JSX.Element => {
  return (
    <View className={classNames}>
      <Text className="text-black dark:text-white text-xl text-center mb-2">
        {label}
      </Text>
      <View className="flex flex-row w-full">
        <TextInput
          className="text-black dark:text-white text-3xl border-2 border-white h-12 text-center rounded-lg grow mr-2 px-4 py-0"
          onChangeText={onChangeText}
          value={value > 0 ? String(value) : undefined}
          keyboardType="numeric"
        />
        {onSubmit !== undefined && (
          <Button title={firstTime ? "Save" : "Update"} onPress={onSubmit} />
        )}
      </View>
    </View>
  );
};

const startSeconds = 10;
export function Exercising({
  exercise,
  onBack,
}: {
  exercise: Exercise;
  onBack: () => void;
}): JSX.Element {
  const { maxes, setMaxes } = useStore((state) => {
    return state;
  });
  const [firstTime] = useState(maxes[exercise.name] === undefined);

  let percent = 60;
  let sets = 3;
  let reps = 10;
  let weight = 30;
  if (firstTime) {
    // If this is the first time doing this exercise
    // We need to support entry of the sets, reps, and weight that they were able to do
    sets = 3; // always 3 x 10 in order to maintain simple math
    reps = 10;
    weight = 0; // Set weight to something temporary
  } else {
    // If they have done this exercise before, we need to calculate their sets, reps, and weight
    // TODO: Should we handle barbell/dumbell differently or can we calculate the correct weights
    // for both using the same max?
    percent = 60; // %
    sets = 3; // TODO decide when to do different sets and reps
    reps = 10;
    weight = Math.floor((maxes[exercise.name].calculatedMax * percent) / 100); // set weight to the best percentage weight
  }
  const [setsAchieved, setSetsAchieved] = useState(sets);
  const [repsAchieved, setRepsAchieved] = useState(reps);
  const [weightAchieved, setWeightAchieved] = useState(weight);

  const onChangeSetsAchieved = (val: string): void => {
    setSetsAchieved(Number(val));
  };
  const onChangeRepsAchieved = (val: string): void => {
    setRepsAchieved(Number(val));
  };
  const onChangeWeightAchieved = (val: string): void => {
    setWeightAchieved(Number(val));
  };
  const calculateMax = (): void => {
    // const calculatedMax = weightAchieved * reps * 0.0333 + weight;
    const calculatedMax = weightAchieved * 1.428; // Calculated to compensate for 3x10 at 70% being near total capacity
    setMaxes({
      ...maxes,
      [exercise.name]: {
        sets: setsAchieved,
        reps: repsAchieved,
        weight: weightAchieved,
        calculatedMax,
      },
    });
  };

  return (
    <View className="m-6 grow">
      <View className="flex flex-row items-center mb-6">
        <TouchableOpacity
          className="border-2 border-black dark:border-teal-400 py-2 px-5 rounded-full bg-transparent flex flex-row items-center"
          onPress={onBack}
        >
          <Ionicons
            name="chevron-back-outline"
            className="text-black dark:text-white mr-1 w-3"
          />
          <Text className="text-black dark:text-white text-center text-lg font-bold">
            Back
          </Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-black dark:text-white ml-6">
          {exercise.name}
        </Text>
      </View>
      {!firstTime ? (
        <Text className="text-xl text-black dark:text-white">
          {`Based on ${percent}% of previous workouts:`}
        </Text>
      ) : (
        <>
          <Text className="text-black dark:text-white text-2xl font-bold">
            Choose a weight
          </Text>
          <Text className="text-black dark:text-white text-md">
            Complete your sets and enter the weight below
          </Text>
        </>
      )}
      <View className="flex flex-row justify-around m-6 mt-4 flex-wrap">
        <NumberEntry
          label="Sets Goal"
          firstTime={firstTime}
          onChangeText={(val) => {
            onChangeSetsAchieved(val);
          }}
          value={setsAchieved}
        />
        <NumberEntry
          label="Reps Goal"
          firstTime={firstTime}
          onChangeText={(val) => {
            onChangeRepsAchieved(val);
          }}
          value={repsAchieved}
        />
        <NumberEntry
          label={!firstTime ? "Weight Goal" : "Weight Achieved"}
          firstTime={firstTime}
          onChangeText={(val) => {
            onChangeWeightAchieved(val);
          }}
          value={weightAchieved}
          onSubmit={() => {
            calculateMax();
            Toast.show({
              type: "success",
              text1: "Great work",
              text2: "Your maxes are saved",
            });
          }}
          classNames=" w-full mt-2"
        />
      </View>
      <RestTimer seconds={startSeconds} />
    </View>
  );
}
// TODO: Deal with different max conditions:
// - Some exercises are easy here: on a machine, you max out at 100, you do 70% at 70 lbs, so we show you 70 lbs
// - Some exercises use a barbell: if you max out at 100, its still 70% at 70 lbs, but its helpful to know that (70-45[lbs bar])/2[per side] = 12.5 lbs
// - Some exercises use dumbells: Maxes need to be recorded either per side or together and then we need a formula to calculate the one side from both side, or just treat them different, some people may need different weights for each side.
// - Some exercises don't have maxes unless weighted (pull up)
// - Some exercises don't have maxes but you do want to store the weight (russian twist)

// Basically, we can derive the "weighted" boolean based on if any equipment required is weighted
// And we can add an optional list to include things like resistance bands, plates, plate chains, dumbbells or otherwise
// If an exercise has an optional weight included in the list, it is weightable.
// If an exercise is

// Since I have added new variants, I want to show one of the variants from the list, but have styling
// to deliniate that once a variant is selected, you can change variants
