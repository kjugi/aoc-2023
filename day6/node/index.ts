import { readFileSync } from "node:fs";

const SPEED_INCREASE_PER_MILLISECOND = 1 as const;

function main() {
  const fileContent = readFileSync("../input.txt");
  // const fileContent = readFileSync("../demo-input.txt");
  const lines = fileContent.toString().split("\n");

  // console.log(lines);

  const [timeLine, distanceLine] = lines;
  const [_timeLabel, timeValues] = timeLine.split(":");
  const [_distanceLabel, distanceValues] = distanceLine.split(":");
  const clearTimeValues = timeValues
    .trim()
    .split(" ")
    .filter((v) => v !== "")
    .map((v) => Number(v.trim()));
  const clearDistanceValues = distanceValues
    .trim()
    .split(" ")
    .filter((v) => v !== "")
    .map((v) => Number(v.trim()));

  // console.log(clearTimeValues);
  // console.log(clearDistanceValues);

  const beatResultsMap: {
    [key: string]: {
      time: number;
      distance: number;
      speed: number;
      remainingTime: number;
    }[];
  } = {};

  clearTimeValues.forEach((time, index) => {
    const distanceToBeat = clearDistanceValues[index];
    beatResultsMap[index] = [];

    for (let i = 0; i < time; i++) {
      const remainingTime = time - i;
      const speed = SPEED_INCREASE_PER_MILLISECOND * i;
      const distance = speed * remainingTime;

      if (distance > distanceToBeat) {
        beatResultsMap[index].push({ time: i, distance, speed, remainingTime });
      }
    }
  });

  // console.log(beatResultsMap);

  const numberOfWaysMultiplied = Object.values(beatResultsMap).reduce(
    (acc, v) => {
      return acc * v.length;
    },
    1
  );

  console.log("--- Day 6: Wait For It ---");
  console.log("--- Part One ---");
  console.log("What do you get if you multiply these numbers together?");
  console.log("Answer:");
  console.log(numberOfWaysMultiplied);

  // part2

  const singleTimeValue = Number(
    timeValues
      .split(" ")
      .filter((v) => v !== "")
      .join("")
  );
  const singleDistanceValue = Number(
    distanceValues
      .split(" ")
      .filter((v) => v !== "")
      .join("")
  );

  // console.log(singleTimeValue);
  // console.log(singleDistanceValue);

  let amountOfTimesToBeat = 0;

  for (let i = 0; i < singleTimeValue; i++) {
    const remainingTime = singleTimeValue - i;
    const speed = SPEED_INCREASE_PER_MILLISECOND * i;
    const distance = speed * remainingTime;

    if (distance > singleDistanceValue) {
      amountOfTimesToBeat++;
    }
  }

  console.log("--- Part Two ---");
  console.log(
    "How many ways can you beat the record in this one much longer race?"
  );
  console.log("Answer:");
  console.log(amountOfTimesToBeat);
}

main();
