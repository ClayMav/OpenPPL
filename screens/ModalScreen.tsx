import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "../components/Themed";
import exercises from "../data/exercises/exercises.json";
import equipment from "../data/equipment/equipment.json";
import { sendNotification, shuffle } from "../utils";
import { RestTimer } from "../components/RestTimer";
import { Workouts } from "../types";
import { WorkoutActions } from "../components/WorkoutActions";

interface Requirement {
  name: string;
  color: string;
}
type EquipmentData = Requirement[];
const equipmentData = equipment as EquipmentData;
const exercisesData = exercises as ExerciseData;

interface Exercise {
  name: string;
  requirements?: number[];
}

type ExerciseData = {
  [key in Workouts]: {
    [key: string]: Exercise[];
  };
};

function MuscleGroupListItem({
  title,
  onPress,
  active,
}: {
  title: string;
  onPress: any;
  active: boolean;
}) {
  return (
    <TouchableOpacity
      className={`w-32 h-32 bg-slate-600 flex justify-end p-2${
        active ? " border-t-8 border-green-300" : ""
      }`}
      onPress={onPress}
    >
      <Text className="text-white font-bold text-xl">{title}</Text>
    </TouchableOpacity>
  );
}

function Requirement({ requirement }: { requirement: Requirement }) {
  return (
    <View
      className="rounded-full py-1 px-4 mr-1 mb-1"
      style={{ backgroundColor: requirement.color }}
    >
      <Text className="text-center dark:text-black">{requirement.name}</Text>
    </View>
  );
}

function ExerciseListItem({
  title,
  requirements,
  onPress,
}: {
  title: string;
  requirements?: number[];
  onPress: any;
}) {
  return (
    <TouchableOpacity
      className=" dark:border-2 dark:border-teal-400 rounded-full dark:shadow-none shadow-sm shadow-black flex p-6 pl-8 pr-8 flex-row items-center mt-6 mx-4 mb-0 justify-between"
      onPress={onPress}
    >
      <Text className="font-bold text-xl grow basis-44 min-w-0">{title}</Text>
      {requirements !== undefined && requirements.length > 0 && (
        <View className="ml-4 bg-transparent min-w-[8rem] w-0 grow basis-0">
          <Text>Requires:</Text>
          <View className="flex flex-row mt-1 bg-transparent flex-wrap">
            {requirements.map((requirement, index) => {
              const equipment = equipmentData[requirement];
              return <Requirement key={index} requirement={equipment} />;
            })}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const startSeconds = 120;
function Exercising({
  exercise,
  onBack,
}: {
  exercise: Exercise;
  onBack: () => void;
}) {
  return (
    <View className="m-6">
      <Button title="Back" onPress={onBack} />
      <Text className="text-3xl font-bold">{exercise.name}</Text>
      <Text className="text-xl mt-6">Based on 60% of previous workouts:</Text>
      <View className="flex flex-row justify-between m-6">
        <Text>3 Sets</Text>
        <Text>10 Reps</Text>
        <Text>135 lbs</Text>
      </View>
      <RestTimer seconds={startSeconds} />
    </View>
  );
}

function selectMuscleGroups(workoutDataMuscleGroups: string[]): string[] {
  let tempMuscleGroups = [...shuffle(workoutDataMuscleGroups)];
  // If there are less muscle groups in the workout than the required number of exercises
  // we need to add some more of the same groups to the end
  const numMissing = numExercises - workoutDataMuscleGroups.length;
  if (numMissing > 0) {
    const repeatGroups = shuffle(workoutDataMuscleGroups);
    for (let i = 0; i < numMissing; i++) {
      tempMuscleGroups.push(repeatGroups.pop() as string); // Removes a group from the list as it adds them so no duplicates
    }
  }
  return tempMuscleGroups;
}

function Loading() {
  return (
    <View className="flex h-full items-center justify-center">
      <ActivityIndicator size="large" color="#00ff00" />
    </View>
  );
}

const numExercises = 5; // TODO
export default function ModalScreen({ navigation, route }: any) {
  const [workout] = useState<Workouts>(route.params.workout); // name of the workout
  const [workoutData] = useState(exercisesData[workout]);

  const [muscleGroups, setMuscleGroups] = useState<string[]>([]); // List of muscle groups to be tackled in this workout
  const [exercises, setExercises] = useState<Exercise[][]>([]); // List of exercises offered to be tackled in this workout
  const [selectedGroup, setSelectedGroup] = useState<number>(0); // Index in the muscleGroup array of the currently selected muscle group
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]); // Exercise data for selected exercise in each group

  const [loading, setLoading] = useState(true);

  // Hook for setting the selected muscle groups for the workout
  useEffect(() => {
    setMuscleGroups(selectMuscleGroups(Object.keys(workoutData)));
  }, []);

  // Hook for storing the possible exercises for the selected group
  useEffect(() => {
    if (muscleGroups.length < 1 || exercises[selectedGroup]?.length > 0) {
      return;
    }

    let workoutDataMuscleGroupExercises =
      workoutData[muscleGroups[selectedGroup]];
    const tempExercises = [...exercises];
    tempExercises[selectedGroup] = shuffle(
      workoutDataMuscleGroupExercises
    ).slice(0, Math.min(5, workoutDataMuscleGroupExercises.length));
    setExercises(tempExercises);
  }, [muscleGroups, selectedGroup]);

  // Loading hook
  useEffect(() => {
    if (muscleGroups.length > 0 && exercises.length > 0) {
      setLoading(false);
    }
  }, [muscleGroups, exercises]);

  const handleSelectedExercise = (exercise: Exercise | undefined) => {
    // selected exercises
    if (!exercise) {
      delete selectedExercises[selectedGroup];
    } else {
      selectedExercises[selectedGroup] = exercise;
    }
    setSelectedExercises([...selectedExercises]);
  };

  const onEndPress = () => {
    navigation.goBack();
  };
  const onNextPress = () => {
    if (selectedGroup === muscleGroups.length - 1) {
      navigation.goBack();
    } else {
      setSelectedGroup(selectedGroup + 1);
    }
  };

  console.log(
    `ModalScreen:
    groups: ${JSON.stringify(muscleGroups)},
    group: ${selectedGroup},
    exercises: ${JSON.stringify(
      exercises.map((exercise) => exercise[selectedGroup]?.name)
    )},
    selectedExercises: ${JSON.stringify(selectedExercises)},
    workout: ${workout}`
  );
  if (loading) {
    return <Loading />;
  }
  return (
    <View className=" h-full flex">
      <Text className="text-2xl font-bold m-6">Muscle Groups</Text>
      <View className="h-32">
        <ScrollView horizontal={true} className="flex flex-row">
          {muscleGroups.map((group, index) => {
            return (
              <MuscleGroupListItem
                key={index}
                title={group}
                onPress={() => setSelectedGroup(index)}
                active={index === selectedGroup}
              />
            );
          })}
        </ScrollView>
      </View>
      {selectedExercises[selectedGroup] ? (
        <Exercising
          exercise={selectedExercises[selectedGroup]}
          onBack={() => handleSelectedExercise(undefined)}
        />
      ) : (
        <View className="flex grow">
          <Text className="text-xl font-bold m-6 mb-0">
            Which Exercise do you want to do?
          </Text>
          <View className=" grow h-64">
            <ScrollView className="">
              {!loading && exercises[selectedGroup]?.length > 0 ? (
                exercises[selectedGroup].map((exercise, index) => {
                  return (
                    <ExerciseListItem
                      key={index}
                      title={exercise.name}
                      requirements={exercise.requirements}
                      onPress={() => handleSelectedExercise(exercise)}
                    />
                  );
                })
              ) : (
                <Loading />
              )}
              <ExerciseListItem
                title="Other"
                onPress={() => handleSelectedExercise({ name: "Other" })}
              />
            </ScrollView>
          </View>
          <WorkoutActions
            onEndPress={onEndPress}
            onNextPress={onNextPress}
            isLastExercise={selectedGroup === muscleGroups.length - 1}
          />
        </View>
      )}
    </View>
  );
}
