import { type Workouts } from "src/types";

export interface Equipment {
  color: string;
  weight?: boolean;
  maxable?: boolean;
}

export type EquipmentData = Record<string, Equipment>;

export interface ExerciseType {
  name: string;
  options: Exercise[];
}

export interface Exercise {
  name: string;
  requirements?: string[];
  optional?: string[];
}

export type ExerciseData = {
  [key in Workouts]: Record<string, ExerciseType[]>;
};
