import React, { useEffect, useState } from "react";
import { View } from "react-native";
import exercises from "../../data/exercises/exercises.json";
import { shuffle } from "../../utils";
import { WorkoutActions } from "./sections/WorkoutActions";
import { ExerciseSelectionList, Exercising, WorkoutHeader } from "./sections";
import { type Exercise, type ExerciseData } from "./types";
import { type Workouts } from "../../types";
import { useStore } from "../../hooks/useStore";

const exercisesData = exercises as ExerciseData;

const numExercises = 5; // TODO make smarter
function selectMuscleGroups(workoutDataMuscleGroups: string[]): string[] {
  const tempMuscleGroups = [...shuffle(workoutDataMuscleGroups)];
  // If there are less muscle groups in the workout than the required number of exercises
  // we need to add some more of the same groups to the end
  // we can do requiredNum(5)/numGroups(2) = 2.2
  // the ceil of that is how many times we need to append shuffled versions of the start list to the end
  const howManyArrays = Math.ceil(
    numExercises / workoutDataMuscleGroups.length
  );
  for (let j = 0; j < howManyArrays; j++) {
    const repeatGroups = shuffle([...workoutDataMuscleGroups]);
    tempMuscleGroups.push(...repeatGroups);
  }
  return tempMuscleGroups.slice(0, numExercises);
}

export default function WorkoutScreen({ navigation, route }: any): JSX.Element {
  const { setActiveWorkout } = useStore((state) => {
    return { setActiveWorkout: state.setActiveWorkout };
  });

  const workout: Workouts = route.params.workout; // name of the workout
  const workoutData = exercisesData[workout];

  const [muscleGroups, setMuscleGroups] = useState<string[]>([]); // List of muscle groups to be tackled in this workout
  const [exercises, setExercises] = useState<Exercise[][]>([]); // List of exercises offered to be tackled in this workout
  const [selectedGroup, setSelectedGroup] = useState<number>(0); // Index in the muscleGroup array of the currently selected muscle group
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]); // Exercise data for selected exercise in each group

  // Hook for setting the selected muscle groups for the workout
  useEffect(() => {
    setActiveWorkout(workout);
    setMuscleGroups(selectMuscleGroups(Object.keys(workoutData)));
  }, []);

  // Hook for storing the possible exercises for the selected group
  useEffect(() => {
    if (muscleGroups.length < 1 || exercises[selectedGroup]?.length > 0) {
      return;
    }

    const workoutDataMuscleGroupExercises =
      workoutData[muscleGroups[selectedGroup]];
    const tempExercises = [...exercises];
    tempExercises[selectedGroup] = shuffle(
      workoutDataMuscleGroupExercises
    ).slice(0, Math.min(5, workoutDataMuscleGroupExercises.length));
    setExercises(tempExercises);
  }, [muscleGroups, selectedGroup]);

  const handleSelectedExercise = (exercise: Exercise | undefined): void => {
    // selected exercises
    if (exercise == null) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete selectedExercises[selectedGroup];
    } else {
      selectedExercises[selectedGroup] = exercise;
    }
    setSelectedExercises([...selectedExercises]);
  };

  const onEndPress = (): void => {
    navigation.goBack();
  };
  const onNextPress = (): void => {
    if (selectedGroup === muscleGroups.length - 1) {
      navigation.goBack();
    } else {
      setSelectedGroup(selectedGroup + 1);
    }
  };

  return (
    <View className=" h-full flex">
      <WorkoutHeader
        muscleGroups={muscleGroups}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />
      <View className="flex grow">
        {selectedExercises[selectedGroup] !== undefined ? (
          <Exercising
            exercise={selectedExercises[selectedGroup]}
            onBack={() => {
              handleSelectedExercise(undefined);
            }}
          />
        ) : (
          <ExerciseSelectionList
            exercises={exercises[selectedGroup]}
            onSelectedExercise={handleSelectedExercise}
          />
        )}
        <WorkoutActions
          onEndPress={onEndPress}
          onNextPress={onNextPress}
          isLastExercise={selectedGroup === muscleGroups.length - 1}
        />
      </View>
    </View>
  );
}
