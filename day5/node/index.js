import { readFileSync } from 'fs';

function main() {
    const fileContent = readFileSync('../input.txt')
    // const fileContent = readFileSync('../demo-input.txt')
    const lines = fileContent
        .toString()
        .split('\n\n')

    // console.log(lines);

    const [seeds, ...restOfTheLines] = lines;
    const [_key, stringValues] = seeds.split(': ');
    const seedsArray = stringValues.split(' ');

    // console.log(seedsArray);

    const dataPerMap = restOfTheLines.reduce((acc, line) => {
        const [key, stringValues] = line.split(':\n');
        const threeValueArrayOfString = stringValues.split('\n');

        return {
            ...acc,
            [key]: threeValueArrayOfString
        }
    }, {})

    // console.log(dataPerMap);

    const findDataRange = seedsArray.reduce((acc, seed) => {
        let defaultValue = seed;
        const mappedValues = [];

        Object.values(dataPerMap).forEach((dataArray) => {
            const matchedArray = dataArray.find((data) => {
                const [_, numberB, mapLength] = data.split(' ');

                if (Number(defaultValue) <= Number(numberB) + Number(mapLength) &&
                    Number(defaultValue) >= Number(numberB)) {
                    return true;
                }

                return false;
            });

            if (matchedArray) {
                const [numberA, numberB, _] = matchedArray.split(' ');
                const positionInChain = Number(defaultValue) - Number(numberB);
                const properSearchedValue = Number(numberA) + (positionInChain < 0 ? positionInChain * -1 : positionInChain);

                mappedValues.push(properSearchedValue)
                defaultValue = properSearchedValue;
            } else {
                mappedValues.push(Number(defaultValue));
            }
        });

        return {
            ...acc,
            [seed]: mappedValues
        }
    }, {});

    // console.log(findDataRange);

    const lowestLocationNumber = Object.values(findDataRange)
        .map(mappedValues => mappedValues.at(-1))
        .sort((a, b) => a - b)[0];

    console.log('--- Day 5: If You Give A Seed A Fertilizer ---')
    console.log('--- Part One ---')
    console.log('What is the lowest location number that corresponds to any of the initial seed numbers?')
    console.log(lowestLocationNumber);

    // Part Two

    let lowestLocationNumberPartTwo = null;
    const filteredDataPerMap = Object.values(dataPerMap).map(dataArray => {
        return dataArray
            .filter(data => {
                const [first, second, _rangeLength] = data.split(' ')[0];

                return Number(first) < Number(second)
            })
    })

    // console.log(filteredDataPerMap);

    for (let i = 0, seedArrayLength = seedsArray.length; i < seedArrayLength; i += 2) {
        const seed = seedsArray[i];
        const seedRange = seedsArray[i + 1];

        for (let y = 0; y < seedRange; y++) {
            let defaultValue = Number(seed) + y;

            for (let x = 0, dataPerMapRange = filteredDataPerMap.length; x < dataPerMapRange; x++) {
                const matchedArray = filteredDataPerMap[x].find((data) => {
                    const [_, numberB, mapLength] = data.split(' ');

                    if (Number(defaultValue) <= Number(numberB) + Number(mapLength) &&
                        Number(defaultValue) >= Number(numberB)) {
                        return true;
                    }

                    return false;
                });

                if (matchedArray) {
                    const [numberA, numberB, _] = matchedArray.split(' ');
                    const positionInChain = Number(defaultValue) - Number(numberB);
                    const properSearchedValue = Number(numberA) + (positionInChain < 0 ? positionInChain * -1 : positionInChain);

                    defaultValue = properSearchedValue;
                }

                if (x === dataPerMapRange - 1) {
                    if (lowestLocationNumberPartTwo === null || lowestLocationNumberPartTwo > defaultValue) {
                        lowestLocationNumberPartTwo = defaultValue;
                    }
                }
            }
        }
    }

    console.log('--- Part Two ---')
    console.log('What is the lowest location number that corresponds to any of the initial seed numbers?')
    console.log(lowestLocationNumberPartTwo);
}

main()