import { type Workouts } from "src/types";

export interface IRequirement {
  name: string;
  color: string;
}
export type EquipmentData = IRequirement[];

export interface Exercise {
  name: string;
  requirements?: number[];
}

export type ExerciseData = {
  [key in Workouts]: Record<string, Exercise[]>;
};
