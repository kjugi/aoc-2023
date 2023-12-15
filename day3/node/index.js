import { readFileSync } from 'fs';

function main() {
    const fileContent = readFileSync('../input.txt')
    // const fileContent = readFileSync('../demo-input.txt')
    const lines = fileContent
        .toString()
        .split('\n')

    // console.log(lines);

    const possibleSymbols = [...new Set(lines
        .join('')
        .split('')
        .filter(char => Number.isNaN(Number(char)) && char !== '.'))]

    // console.log(possibleSymbols);

    /**
     * [
     *  {
     *     symbol: '#',
     *     x: 0, // index in the line
     *     y: 0 // number of the line
     *  }
     * ]
     */
    const foundSymbols = [];

    lines.forEach((lineValues, lineNumber) => {
        lineValues.split('').forEach((char, index) => {
            if (possibleSymbols.includes(char)) {
                foundSymbols.push({
                    symbol: char,
                    x: index,
                    y: lineNumber
                })
            }
        });
    });

    // console.log(foundSymbols);

    /**
     * [
     *  { 
     *     number: 1, 
     *     x: 0, // index in the line
     *     y: 0 // number of the line
     *  }
     * ]
     */
    const foundNumbers = [];

    lines.forEach((lineValues, lineNumber) => {
        let tempNumber = '';

        lineValues.split('').forEach((char, index) => {
            if (!Number.isNaN(Number(char))) {
                tempNumber += char;
            }

            if (Number.isNaN(Number(char)) && tempNumber !== '') {
                foundNumbers.push({
                    number: tempNumber,
                    // start index of the number
                    // index is on "." or symbol now, no need to -1
                    x: index - tempNumber.length,
                    y: lineNumber
                })
                tempNumber = '';
            } else if (index === lineValues.length - 1 && tempNumber !== '') {
                foundNumbers.push({
                    number: tempNumber,
                    // start index of the number
                    // index is on last char so it's accurate, -1 is required
                    x: index - (tempNumber.length - 1),
                    y: lineNumber
                })
                tempNumber = '';
            }
        })
    });

    // console.log(foundNumbers);

    const validNumbers = [];

    foundSymbols.forEach((symbol) => {
        const leftCoordinates = {
            x: symbol.x - 1,
            y: symbol.y
        }
        const rightCoordinates = {
            x: symbol.x + 1,
            y: symbol.y
        }
        const topCoordinates = {
            x: symbol.x,
            y: symbol.y - 1
        }
        const bottomCoordinates = {
            x: symbol.x,
            y: symbol.y + 1
        }
        const topLeftCoordinates = {
            x: symbol.x - 1,
            y: symbol.y - 1
        }
        const topRightCoordinates = {
            x: symbol.x + 1,
            y: symbol.y - 1
        }
        const bottomLeftCoordinates = {
            x: symbol.x - 1,
            y: symbol.y + 1
        }
        const bottomRightCoordinates = {
            x: symbol.x + 1,
            y: symbol.y + 1
        }
        const placesToValidate = [
            leftCoordinates,
            rightCoordinates,
            topCoordinates,
            bottomCoordinates,
            topLeftCoordinates,
            topRightCoordinates,
            bottomLeftCoordinates,
            bottomRightCoordinates
        ];

        placesToValidate.forEach((coordinates) => {
            const foundNumber = foundNumbers.find((number, index) => {
                const isNumberValid = Array.from(number.number).some((_, numberX) => {
                    return (number.x + numberX) === coordinates.x && number.y === coordinates.y
                })

                if (isNumberValid && !number?.included) {
                    foundNumbers[index].included = true;
                    return true;
                }

                return false;
            });

            if (foundNumber) {
                validNumbers.push(foundNumber.number);
            }
        })
    })

    // second approach
    // foundNumbers.forEach((number) => {
    //     const isNumberValid = Array.from(number.number).some((_, index) => {
    //         return possibleSymbols.includes(lines[number.y].split('')[number.x + 1 + index]) ||
    //             possibleSymbols.includes(lines[number.y].split('')[number.x - 1 + index]) ||
    //             possibleSymbols.includes(lines[number.y + 1]?.split('')[number.x + index]) ||
    //             possibleSymbols.includes(lines[number.y - 1]?.split('')[number.x + index]) ||
    //             possibleSymbols.includes(lines[number.y + 1]?.split('')[number.x + 1 + index]) ||
    //             possibleSymbols.includes(lines[number.y + 1]?.split('')[number.x - 1 + index]) ||
    //             possibleSymbols.includes(lines[number.y - 1]?.split('')[number.x + 1 + index]) ||
    //             possibleSymbols.includes(lines[number.y - 1]?.split('')[number.x - 1 + index])
    //     })

    //     if (isNumberValid) {
    //         validNumbers.push(number.number);
    //     }
    // });

    // console.log(validNumbers);

    const sum = validNumbers.reduce((acc, curr) => acc + Number(curr), 0);

    console.log('--- Day 3: Gear Ratios --- - Part 1:')
    console.log('What is the sum of all of the part numbers in the engine schematic?')
    console.log('Answer: ')
    console.log(sum)
}

main()