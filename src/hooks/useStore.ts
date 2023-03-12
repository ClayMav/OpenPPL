import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createJSONStorage,
  persist,
  // type StateStorage,
} from "zustand/middleware";
// import { MMKV } from "react-native-mmkv";
import { type Workouts } from "src/types";
import { type Exercise } from "src/screens/WorkoutScreen/types";

// const storage = new MMKV();

// const zustandStorage: StateStorage = {
//   setItem: (name, value) => {
//     storage.set(name, value);
//   },
//   getItem: (name) => {
//     const value = storage.getString(name);
//     return value ?? null;
//   },
//   removeItem: (name) => {
//     storage.delete(name);
//   },
// };

type ExerciseMaxes = Record<
  string,
  {
    sets: number;
    reps: number;
    weight: number;
    calculatedMax: number;
  }
>;

interface ZustandState {
  activeWorkout?: Workouts;
  setActiveWorkout: (newWorkout?: Workouts) => void;
  workoutStartTime?: number;
  setWorkoutStartTime: (newStart?: number) => void;
  workoutMuscleGroups?: string[];
  setWorkoutMuscleGroups: (newGroups?: string[]) => void;
  workoutExercises?: Exercise[][];
  setWorkoutExercises: (newExercises?: Exercise[][]) => void;
  workoutSelectedMuscleGroup?: number;
  setWorkoutSelectedMuscleGroup: (newSelected?: number) => void;
  workoutSelectedExercises?: number[];
  setWorkoutSelectedExercises: (newSelected?: number[]) => void;

  maxes: ExerciseMaxes;
  setMaxes: (maxes: ExerciseMaxes) => void;
}

export const useStore = create<ZustandState>()(
  persist(
    (set) => ({
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
      setWorkoutMuscleGroups: (newGroups?: string[]) => {
        set(() => {
          return { workoutMuscleGroups: newGroups };
        });
      },
      setWorkoutExercises: (newExercises?: Exercise[][]) => {
        set(() => {
          return { workoutExercises: newExercises };
        });
      },
      setWorkoutSelectedMuscleGroup: (newSelected?: number) => {
        set(() => {
          return { workoutSelectedMuscleGroup: newSelected };
        });
      },
      setWorkoutSelectedExercises: (newSelected?: number[]) => {
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
      // storage: createJSONStorage(() => zustandStorage),
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
