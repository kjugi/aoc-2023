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
}

main()