import { readFileSync } from 'fs';

function main() {
    // const fileContent = readFileSync('../input.txt')
    const fileContent = readFileSync('../demo-input.txt')
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

    const unrolledData = Object.entries(dataPerMap).reduce((acc, [key, values]) => {
        let lineUnrolledData = {}

        values.forEach((value) => {
            const [numberA, numberB, mapLength] = value.split(' ');

            const outputData = mapDataToGivenObject(+numberA, +numberB, +mapLength, lineUnrolledData);

            lineUnrolledData = {
                ...outputData
            };
        });

        return {
            ...acc,
            [key]: lineUnrolledData
        }
    }, {});

    // console.log(unrolledData);

    const seedsResolved = seedsArray.reduce((acc, seed) => {
        let defaultValue = seed;
        const mappedValues = [];

        Object.values(unrolledData).forEach((data) => {
            if (isDataMapped(defaultValue, data)) {
                mappedValues.push(Number(data[defaultValue]));
                defaultValue = data[defaultValue];
            } else {
                mappedValues.push(Number(defaultValue));
            }
        });

        return {
            ...acc,
            [seed]: mappedValues
        }
    }, {});

    console.log(seedsResolved);

    const lowestLocationNumber = Object.values(seedsResolved)
        .map(mappedValues => mappedValues.at(-1))
        .sort((a, b) => a - b)[0];

    console.log('--- Day 5: If You Give A Seed A Fertilizer ---')
    console.log('--- Part One ---')
    console.log('What is the lowest location number that corresponds to any of the initial seed numbers?')
    console.log(lowestLocationNumber);
}

function mapDataToGivenObject(numberA, numberB, mapLength, inputData) {
    const outputData = {
        ...inputData
    }

    for (let i = 0; i < mapLength; i++) {
        if (!isDataMapped(numberB + i, outputData)) {
            outputData[numberB + i] = numberA + i;
        }
    }

    return outputData;
}

function isDataMapped(numberA, object) {
    return object[numberA] !== undefined;
}

main()