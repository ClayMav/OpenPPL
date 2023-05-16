import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Linking, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useStore } from "../../../hooks/useStore";
import { type EquipmentData, type Exercise } from "../types";
import { RestTimer } from "./RestTimer";
import equipment from "../../../data/equipment/equipment.json";

const equipmentData = equipment as EquipmentData;

const NumberEntry = ({
  onChangeText,
  value,
  label,
  classNames,
  unit,
}: {
  onChangeText: (val: string) => void;
  value: number;
  label: string;
  classNames?: string;
  unit?: string;
}): JSX.Element => {
  return (
    <View className={classNames}>
      <Text className="text-black dark:text-white text-xl text-center mb-2">
        {label}
      </Text>
      <View className="flex flex-row w-full">
        <View className="border-2 border-black dark:border-white h-12 text-center rounded-lg grow mr-2 px-4 py-0 flex flex-row items-center">
          <TextInput
            onChangeText={onChangeText}
            value={value >= 0 ? String(value) : undefined}
            keyboardType="numeric"
            className="grow text-black dark:text-white text-xl "
          />
          {unit !== undefined && (
            <Text className="text-black dark:text-gray-400 text-xl">
              {unit}
            </Text>
          )}
        </View>
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
  const [percent, setPercent] = useState(60); // TODO: Make interactive and not constant
  const [sets, setSets] = useState(3); // TODO: Make interactive and not constant
  const [reps, setReps] = useState(10); // TODO: Make interactive and not constant
  const [weight, setWeight] = useState(0); // TODO: Make interactive and not constant

  // Derived values
  // weightable decides if we should save a weight for it
  const [weighted] = useState(
    exercise.requirements?.find((req) => {
      return equipmentData[req].weight;
    }) !== undefined
  );
  // maxable decides if we should save a max for it
  const [maxable] = useState(
    exercise.requirements?.find((req) => {
      return equipmentData[req].maxable;
    }) !== undefined
  );

  useEffect(() => {
    if (firstTime) {
      // If this is the first time doing this exercise
      // We need to support entry of the sets, reps, and weight that they were able to do
      setSets(3); // always 3 x 10 in order to maintain simple math
      setReps(10);
      setWeight(0); // Set weight to something temporary
    } else {
      // If they have done this exercise before, we need to calculate their sets, reps, and weight
      // TODO: Should we handle barbell/dumbell differently or can we calculate the correct weights
      // for both using the same max?
      setPercent(60); // %
      setSets(3); // TODO decide when to do different sets and reps
      setReps(10);
      if (maxes[exercise.name].calculatedMax !== undefined) {
        setWeight(
          Math.floor(
            ((maxes[exercise.name].calculatedMax as number) * percent) / 100
          )
        ); // set weight to the best percentage weight
      } else if (maxes[exercise.name].weight !== undefined) {
        setWeight(maxes[exercise.name].weight as number);
      }
    }
  }, []);

  // If weighted & maxable
  // show weight input and submit button and calculate and publish max on submit
  // If weighted & !maxable
  // show weight input and submit button and publish weight and no max on submit
  // If !weighted & maxable
  // not possible
  // If !weighted & !maxable
  // do not show a weight or submit button

  const onChangeSetsAchieved = (val: string): void => {
    setSets(Number(val));
  };
  const onChangeRepsAchieved = (val: string): void => {
    setReps(Number(val));
  };
  const onChangeWeightAchieved = (val: string): void => {
    setWeight(Number(val));
  };

  const saveMax = (calculate = true): void => {
    // const calculatedMax = weightAchieved * reps * 0.0333 + weight;
    let calculatedMax: number | undefined;
    if (calculate) {
      calculatedMax = weight * 1.428; // Calculated to compensate for 3x10 at 70% being near total capacity
    }
    setMaxes({
      ...maxes,
      [exercise.name]: {
        sets,
        reps,
        weight,
        calculatedMax,
      },
    });
  };

  const onSubmit = (): void => {
    if (maxable) {
      saveMax();
    } else {
      saveMax(false);
    }
    Toast.show({
      type: "success",
      text1: "Great work",
      text2: "Your maxes are saved",
    });
  };

  const openExerciseInfoLink = async (): Promise<void> => {
    await Linking.openURL(exercise.link);
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
        <TouchableOpacity
          onPress={() => {
            void openExerciseInfoLink();
          }}
        >
          <Text className="text-2xl font-bold text-black dark:text-white ml-6 pr-20">
            {exercise.name}
          </Text>
        </TouchableOpacity>
      </View>
      {maxable ? (
        <>
          {firstTime ? (
            <>
              <Text className="text-black dark:text-white text-2xl font-bold">
                Choose a weight
              </Text>
              <Text className="text-black dark:text-white text-md">
                Complete your sets and enter the weight below
              </Text>
            </>
          ) : (
            <Text className="text-xl text-black dark:text-white">
              {`Based on ${percent}% of previous workouts:`}
            </Text>
          )}
        </>
      ) : (
        <></>
      )}
      <View className="flex flex-row justify-between m-6 mt-4 pr-12">
        <View className="flex flex-row justify-evenly w-full flex-wrap">
          <NumberEntry
            label="Sets Goal"
            onChangeText={(val) => {
              onChangeSetsAchieved(val);
            }}
            value={sets}
          />
          <NumberEntry
            label="Reps Goal"
            onChangeText={(val) => {
              onChangeRepsAchieved(val);
            }}
            value={reps}
          />
          {weighted && maxable && (
            <NumberEntry
              label={!firstTime ? "Weight Goal" : "Weight Achieved"}
              onChangeText={(val) => {
                onChangeWeightAchieved(val);
              }}
              unit="lbs"
              value={weight}
              classNames=" grow mt-2"
            />
          )}
        </View>
        <View className="flex justify-center">
          <TouchableOpacity
            className="border-2 border-black dark:border-teal-400 py-2 px-5 rounded-full bg-transparent flex flex-row items-center"
            onPress={onSubmit}
          >
            <Text className="text-black dark:text-white text-center text-lg font-bold">
              Save
            </Text>
          </TouchableOpacity>
        </View>
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
