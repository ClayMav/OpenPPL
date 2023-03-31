import React, { useEffect } from "react";
import { View } from "react-native";
import exercises from "../../data/exercises/exercises.json";
import { shuffle } from "../../utils";
import { WorkoutActions } from "./sections/WorkoutActions";
import { ExerciseSelectionList, Exercising, WorkoutHeader } from "./sections";
import { type ExerciseType, type Exercise, type ExerciseData } from "./types";
import { type Workouts } from "../../types";
import { useStore } from "../../hooks/useStore";
import { Toast } from "react-native-toast-message/lib/src/Toast";

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

interface WorkoutScreenProps {
  navigation: any;
  route: {
    params?: {
      workout?: Workouts;
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
  });

  if (activeWorkout === undefined && route.params?.workout === undefined) {
    navigation.navigate("Home");
    Toast.show({
      type: "error",
      text1: "Something went wrong",
      text2: "Select a workout to continue",
    });
  }

  const workout: Workouts =
    route.params?.workout === undefined ? activeWorkout! : route.params.workout; // name of the workout
  const workoutData = exercisesData[workout];

  // const [muscleGroups, setMuscleGroups] = useState<string[]>([]); // List of muscle groups to be tackled in this workout
  const [muscleGroups, setMuscleGroups] = useStore((state) => [
    state.workoutMuscleGroups,
    state.setWorkoutMuscleGroups,
  ]); // List of muscle groups to be tackled in this workout
  // const [exercises, setExercises] = useState<Exercise[][]>([]); // List of exercises offered to be tackled in this workout
  const [exercises, setExercises] = useStore((state) => [
    state.workoutExercises,
    state.setWorkoutExercises,
  ]); // List of exercises offered to be tackled in this workout
  // const [selectedGroup, setSelectedGroup] = useState<number>(0); // Index in the muscleGroup array of the currently selected muscle group
  const [selectedGroup, setSelectedGroup] = useStore((state) => [
    state.workoutSelectedMuscleGroup,
    state.setWorkoutSelectedMuscleGroup,
  ]); // Index in the muscleGroup array of the currently selected muscle group
  // const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]); // Exercise data for selected exercise in each group
  const [selectedExercises, setSelectedExercises] = useStore((state) => [
    state.workoutSelectedExercises,
    state.setWorkoutSelectedExercises,
  ]); // Exercise data for selected exercise in each group

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
