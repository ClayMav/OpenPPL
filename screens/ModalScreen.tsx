import { useEffect, useState } from "react";
import { Button, ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "../components/Themed";
import exercises from "../data/exercises/exercises.json";
import equipment from "../data/equipment/equipment.json";

function shuffle(array: any[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

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
      style={{ backgroundColor: requirement.color }}
      className="rounded-full inline-flex p-1 pl-4 pr-4 mr-1"
    >
      <Text className="text-center">{requirement.name}</Text>
    </View>
  );
}

interface Requirement {
  name: string;
  color: string;
}
type EquipmentData = Requirement[];
const equipmentData = equipment as EquipmentData;
const exercisesData = exercises as ExerciseData;

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
      className="bg-white rounded-full shadow-sm shadow-black flex p-6 pl-8 pr-8 flex-row items-center m-6 mb-0"
      onPress={onPress}
    >
      <Text className="font-bold text-xl w-32">{title}</Text>
      {requirements && (
        <View className="ml-4">
          <Text>Requires:</Text>
          <View className="flex flex-row mt-1">
            {requirements?.map((requirement, index) => {
              return (
                <Requirement key={index} requirement={equipment[requirement]} />
              );
            })}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

interface Exercise {
  name: string;
  requirements?: number[];
}

interface ExerciseData {
  [key: string]: {
    [key: string]: Exercise[];
  };
}

function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const startSeconds = 120;
function Exercising({
  exercise,
  onBack,
}: {
  exercise: Exercise;
  onBack: () => void;
}) {
  const [seconds, setSeconds] = useState(startSeconds);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: number = 0;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    }
    if (seconds < 1) {
      clearInterval(interval);
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [seconds, timerActive]);

  const startTimer = () => {
    setSeconds(startSeconds);
    setTimerActive(true);
  };

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
      <View className="flex items-center justify-center mt-8">
        <Text className="text-2xl font-bold">Rest Timer</Text>
        <TouchableOpacity
          className="mt-6 w-48 h-48 bg-teal-500 rounded-full flex items-center justify-center p-8"
          onPress={() => startTimer()}
        >
          <Text className="text-white text-4xl font-bold text-center">
            {seconds}s
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ModalScreen({ navigation, route }: any) {
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>(
    []
  );
  const [selectedGroup, setSelectedGroup] = useState<number>(0);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  const { workout } = route.params;
  const data = exercisesData[workout];
  const muscleGroups = Object.keys(data);

  useEffect(() => {
    const tempSelectedMuscleGroups = [...shuffle(muscleGroups)];
    // 6 is the number of exercises to include
    const numExercises = 6;
    // Need to include 6 exercises from the list of groups but if there is less, randomly add
    const numMissing = numExercises - muscleGroups.length;
    if (numMissing > 0) {
      const shuffledMuscleGroups = shuffle(muscleGroups);
      for (let i = 0; i < numMissing; i++) {
        tempSelectedMuscleGroups.push(shuffledMuscleGroups.pop() as string);
      }
    }
    setSelectedMuscleGroups(tempSelectedMuscleGroups);
  }, []);

  const handleSelectedExercise = (exercise: Exercise | undefined) => {
    // selected exercises
    if (!exercise) {
      delete selectedExercises[selectedGroup];
    } else {
      selectedExercises[selectedGroup] = exercise;
    }
    setSelectedExercises([...selectedExercises]);
  };

  console.log(selectedMuscleGroups, selectedExercises);
  return (
    <View className="bg-white h-screen">
      <Text className="text-2xl font-bold m-6">Muscle Groups</Text>
      <View className="h-32">
        <ScrollView horizontal={true} className="flex flex-row">
          {selectedMuscleGroups.map((group, index) => {
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
        <View className="">
          <Text className="text-xl font-bold m-6 mb-0">
            Which Exercise do you want to do?
          </Text>
          <ScrollView className="pb-32" style={{ height: 500 }}>
            {selectedMuscleGroups.length > 0 &&
              shuffle(data[selectedMuscleGroups[selectedGroup]])
                .slice(
                  0,
                  Math.min(5, data[selectedMuscleGroups[selectedGroup]].length)
                )
                .map((exercise, index) => {
                  return (
                    <ExerciseListItem
                      key={index}
                      title={exercise.name}
                      requirements={exercise.requirements}
                      onPress={() => handleSelectedExercise(exercise)}
                    />
                  );
                })}
          </ScrollView>
        </View>
      )}
      <View className="flex flex-row w-full justify-between p-6 absolute bottom-36 bg-transparent">
        <TouchableOpacity className=" bottom-0 bg-red-400 rounded-full p-4 pl-8 pr-8">
          <Text className="font-medium">End Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className=" bottom-0 bg-green-400 rounded-full p-4 pl-8 pr-8"
          onPress={() => {
            if (selectedGroup === muscleGroups.length) {
              navigation.goBack();
            } else {
              setSelectedGroup(selectedGroup + 1);
            }
          }}
        >
          <Text className="font-medium">Next Muscle Group</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
