import * as Notifications from "expo-notifications";

export function shuffle<T>(array: T[]): T[] {
  if (array.length < 2) {
    return array;
  }
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
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

export async function sendNotification(
  body: string,
  title = "PushPullLegs"
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      vibrate: [10, 10, 10],
    },
    trigger: null,
  });
}
