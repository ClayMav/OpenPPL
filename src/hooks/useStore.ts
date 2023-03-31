import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { type Workouts } from "src/types";
import { type Exercise } from "src/screens/WorkoutScreen/types";

type ExerciseMaxes = Record<
  string,
  {
    sets: number;
    reps: number;
    weight: number | undefined;
    calculatedMax: number | undefined;
  }
>;

interface ZustandState {
  activeWorkout?: Workouts;
  setActiveWorkout: (newWorkout?: Workouts) => void;
  workoutStartTime?: number;
  setWorkoutStartTime: (newStart?: number) => void;
  workoutMuscleGroups: string[];
  setWorkoutMuscleGroups: (newGroups: string[]) => void;
  workoutExercises: Exercise[][];
  setWorkoutExercises: (newExercises: Exercise[][]) => void;
  workoutSelectedMuscleGroup: number;
  setWorkoutSelectedMuscleGroup: (newSelected: number) => void;
  workoutSelectedExercises: Exercise[];
  setWorkoutSelectedExercises: (newSelected: Exercise[]) => void;

  maxes: ExerciseMaxes;
  setMaxes: (maxes: ExerciseMaxes) => void;
}

export const useStore = create<ZustandState>()(
  persist(
    (set) => ({
      workoutMuscleGroups: [],
      workoutExercises: [],
      workoutSelectedMuscleGroup: 0,
      workoutSelectedExercises: [],
      setActiveWorkout: (newWorkout?: Workouts) => {
        set(() => {
          return { activeWorkout: newWorkout };
        });
      },
      setWorkoutStartTime: (newStart?: number) => {
        set(() => {
          return { workoutStartTime: newStart };
        });
      },
      setWorkoutMuscleGroups: (newGroups: string[]) => {
        set(() => {
          return { workoutMuscleGroups: newGroups };
        });
      },
      setWorkoutExercises: (newExercises: Exercise[][]) => {
        set(() => {
          return { workoutExercises: newExercises };
        });
      },
      setWorkoutSelectedMuscleGroup: (newSelected: number) => {
        set(() => {
          return { workoutSelectedMuscleGroup: newSelected };
        });
      },
      setWorkoutSelectedExercises: (newSelected: Exercise[]) => {
        set(() => {
          return { workoutSelectedExercises: newSelected };
        });
      },
      maxes: {},
      setMaxes: (maxes: ExerciseMaxes) => {
        set(() => {
          return { maxes };
        });
      },
    }),
    {
      name: "openppl-state",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
