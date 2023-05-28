import React, { useEffect } from "react";
import { View } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { shallow } from "zustand/shallow";

import { selectMuscleGroups } from "./exerciseSelection";
import { ExerciseSelectionList, Exercising, WorkoutHeader } from "./sections";
import { WorkoutActions } from "./sections/WorkoutActions";
import { type ExerciseType, type Exercise, type ExerciseData } from "./types";
import exercises from "../../data/exercises/exercises.json";
import { useStore } from "../../hooks/useStore";
import { type Workout } from "../../types";
import { shuffle } from "../../utils";

const exercisesData = exercises as ExerciseData;

interface WorkoutScreenProps {
  navigation: any;
  route: {
    params?: {
      workout?: Workout;
    };
  };
}

export default function WorkoutScreen({
  navigation,
  route,
}: WorkoutScreenProps): JSX.Element {
  const { activeWorkout, setActiveWorkout } = useStore((state) => {
    return {
      activeWorkout: state.activeWorkout,
      setActiveWorkout: state.setActiveWorkout,
    };
  }, shallow);

  if (activeWorkout === undefined && route.params?.workout === undefined) {
    navigation.navigate("Home");
    Toast.show({
      type: "error",
      text1: "Something went wrong",
      text2: "Select a workout to continue",
    });
  }

  const workout: Workout =
    route.params?.workout === undefined ? activeWorkout! : route.params.workout; // name of the workout
  const workoutData = exercisesData[workout];

  const [muscleGroups, setMuscleGroups] = useStore(
    (state) => [state.workoutMuscleGroups, state.setWorkoutMuscleGroups],
    shallow
  ); // List of muscle groups to be tackled in this workout
  const [exercises, setExercises] = useStore(
    (state) => [state.workoutExercises, state.setWorkoutExercises],
    shallow
  ); // List of exercises offered to be tackled in this workout
  const [selectedGroup, setSelectedGroup] = useStore(
    (state) => [
      state.workoutSelectedMuscleGroup,
      state.setWorkoutSelectedMuscleGroup,
    ],
    shallow
  ); // Index in the muscleGroup array of the currently selected muscle group
  const [selectedExercises, setSelectedExercises] = useStore(
    (state) => [
      state.workoutSelectedExercises,
      state.setWorkoutSelectedExercises,
    ],
    shallow
  ); // Exercise data for selected exercise in each group

  // Hook for setting the selected muscle groups for the workout
  useEffect(() => {
    if (activeWorkout === undefined) {
      setActiveWorkout(workout);
    }
    if (muscleGroups.length < 1) {
      setMuscleGroups(selectMuscleGroups(Object.keys(workoutData)));
    }
  }, []);

  // Hook for storing the possible exercises for the selected group
  useEffect(() => {
    if (muscleGroups.length < 1 || exercises[selectedGroup]?.length > 0) {
      return;
    }

    const workoutDataMuscleGroupExercises =
      workoutData[muscleGroups[selectedGroup]];
    const tempExercises = [...exercises];
    const exerciseSets = shuffle(workoutDataMuscleGroupExercises).slice(
      0,
      Math.min(5, workoutDataMuscleGroupExercises.length)
    );
    const groupExercises = exerciseSets.map(
      (exerciseType: ExerciseType) => shuffle(exerciseType.options)[0]
    );
    tempExercises[selectedGroup] = groupExercises;
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
    setActiveWorkout(undefined);
    setExercises([]);
    setMuscleGroups([]);
    setSelectedExercises([]);
    setSelectedGroup(0);
    navigation.goBack();
  };
  const onNextPress = (): void => {
    if (selectedGroup === muscleGroups.length - 1) {
      setActiveWorkout(undefined);
      setExercises([]);
      setMuscleGroups([]);
      setSelectedExercises([]);
      setSelectedGroup(0);
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
