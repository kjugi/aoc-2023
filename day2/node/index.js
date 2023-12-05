import { readFileSync } from 'node:fs';

const RED_CUBES_MAX = 12
const GREEN_CUBES_MAX = 13
const BLUE_CUBES_MAX = 14

function main() {
    const fileContent = readFileSync('../input.txt')
    const lines = fileContent
        .toString()
        .split('\n')

    const gamesObject = lines
        .reduce((acc, line) => {
            const [gameId, values] = line.split(': ');
            const [_slug, id] = gameId.split(' ');

            const games = values.split('; ');

            /**
             * [
             *  {
             *      red: 1,
             *      green: 2,
             *      blue: 3
             *  },
             *  ...
             * ]
             */
            const arrayOfColors = [];

            games.forEach(game => {
                const colorValues = game.split(', ')
                const colorsObject = {
                    blue: 0,
                    green: 0,
                    red: 0,
                }

                colorValues.forEach(singleColor => {
                    const [value, colorName] = singleColor.split(' ');
                    colorsObject[colorName] = Number(value);
                });

                arrayOfColors.push(colorsObject)
            });

            return {
                ...acc,
                [id]: arrayOfColors
            }
        }, {})

    console.log(gamesObject)

    const possibleGames = Object.entries(gamesObject).filter(([_, games]) => {
        const isRedValid = games.every(game => game.red <= RED_CUBES_MAX);
        const isGreenValid = games.every(game => game.green <= GREEN_CUBES_MAX);
        const isBlueValid = games.every(game => game.blue <= BLUE_CUBES_MAX);

        return isRedValid && isGreenValid && isBlueValid;
    }).reduce((acc, [id, games]) => ({ ...acc, [id]: games }), {});

    // console.log(possibleGames)

    const gamesIdsSum = Object.keys(possibleGames).reduce((acc, id) => acc + Number(id), 0);

    console.log('--- Day 2: Cube Conundrum ---')
    console.log('What is the sum of the IDs of those games?')
    console.log(gamesIdsSum)
}

main()