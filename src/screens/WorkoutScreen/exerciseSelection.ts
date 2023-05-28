import { shuffle } from "../../utils";

const numExercises = 5; // TODO make smarter
export function selectMuscleGroups(
  workoutDataMuscleGroups: string[]
): string[] {
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
