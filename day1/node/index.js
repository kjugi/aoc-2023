import { readFileSync } from "node:fs"

function main() {
    const inputContent = readFileSync("../input.txt");
    const inputArray = inputContent.toString().split("\n");

    firstPart(inputArray);
    secondPart(inputArray);
}

function print(sum) {
    console.log("--- Day 1: Trebuchet?! ---");
    console.log("Question: What is the sum of all of the calibration values?")
    console.log(`Answer: ${sum}`);
}

function firstPart(inputArray) {
    const DIGIT_REGEX = /\d/g;
    let sum = 0;

    for (const line of inputArray) {
        if (line === "") continue;

        const digitsArray = line.match(DIGIT_REGEX);

        if (digitsArray === null) {
            throw new Error(`No digits found in line "${line}"`);
        }

        const firstDigit = digitsArray[0];
        let lastDigit = firstDigit;

        if (digitsArray.length > 1) {
            lastDigit = digitsArray.at(-1);
        }

        const finalNumber = Number(`${firstDigit}${lastDigit}`);

        sum += finalNumber;
    }

    print(sum);
}

function secondPart(inputArray) {
    let sum = 0;
    const mappedNumbers = {
        "one": 1,
        "two": 2,
        "three": 3,
        "four": 4,
        "five": 5,
        "six": 6,
        "seven": 7,
        "eight": 8,
        "nine": 9
    };
    const numberDigits = Object.values(mappedNumbers);
    const numberString = Object.keys(mappedNumbers);

    for (const line of inputArray) {
        if (line === "") continue;
        // the "best" demo line from input.txt
        // const line = 'onefxtprsml8fqptvmfthreesix2jbeightwor';

        let firstDigit = 0;
        let lastDigit = firstDigit;

        // check if the first or last letter is a number - if so, we can use it
        if (numberDigits.find(digit => String(digit) === line.slice(0, 1))) {
            firstDigit = line.slice(0, 1);
        }

        if (numberDigits.find(digit => String(digit) === line.slice(-1))) {
            lastDigit = line.slice(-1);
        }

        // we need to check the full string - first letter is not a number
        if (firstDigit === 0) {
            for (let i = 0; i < line.length; i++) {
                const startString = line.slice(0, i + 1);
                const startDigit = line.slice(i, i + 1);

                if (numberDigits.find(digit => digit === Number(startDigit))) {
                    firstDigit = startDigit;
                    break;
                }

                if (numberString.find(number => startString.indexOf(number) !== -1)) {
                    firstDigit = mappedNumbers[numberString.find(number => startString.indexOf(number) !== -1)];
                    break;
                }
            }
        }

        // we need to check the full string - last letter is not a number
        if (lastDigit === 0) {
            for (let i = 0; i < line.length; i++) {
                const endString = line.slice((i * -1) - 1);
                const endDigit = line.slice((i * -1) - 1, (i * -1));

                if (numberDigits.find(digit => digit === Number(endDigit))) {
                    lastDigit = endDigit;
                    break;
                }

                if (numberString.find(number => endString.indexOf(number) !== -1)) {
                    lastDigit = mappedNumbers[numberString.find(number => endString.indexOf(number) !== -1)];
                    break;
                }
            }
        }

        const finalNumber = Number(`${firstDigit}${lastDigit}`);

        sum += finalNumber;
    }

    print(sum);
}

main()