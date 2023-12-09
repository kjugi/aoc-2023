import { readFileSync } from 'fs';

function main() {
    const fileContent = readFileSync('../input.txt')
    // const fileContent = readFileSync('../demo-input.txt')
    const lines = fileContent
        .toString()
        .split('\n')

    // console.log(lines);

    const cardNumbers = lines.map(line => {
        const [_, numbers] = line.split(': ');

        const [winningNumbers, yourNumbers] = numbers.split(' | ');

        return {
            winningNumbers: winningNumbers.split(' ').filter(n => n !== '').map(n => Number(n)),
            yourNumbers: yourNumbers.split(' ').filter(n => n !== '').map(n => Number(n)),
            score: 1
        }
    })

    // console.log(cardNumbers);

    const matchingCardNumbers = cardNumbers.map(card => {
        const { winningNumbers, yourNumbers } = card;
        return winningNumbers.filter(n => yourNumbers.includes(n));
    }).filter(numbers => numbers.length > 0);

    // console.log(matchingCardNumbers);

    const totalPoints = matchingCardNumbers.reduce((acc, numbers) => {
        let score = 1;

        if (numbers.length > 1) {
            score = Math.pow(2, numbers.length - 1);
        }

        return acc + score;
    }, 0);

    console.log('--- Day 4: Scratchcards --- part 1');
    console.log('How many points are they worth in total?')
    console.log(totalPoints)

    // part2

    const cardScoresTotal = cardNumbers.map((card, index) => {
        const { winningNumbers, yourNumbers } = card;

        const matchedNumberCount = winningNumbers.filter(n => yourNumbers.includes(n)).length;

        for (let y = 0; y < card.score; y++) {
            for (let i = 1; i <= matchedNumberCount; i++) {
                cardNumbers[index + i].score += 1;
            }
        }

        return card.score
    }).reduce((acc, score) => acc + score, 0);

    console.log('--- Day 4: Scratchcards --- part 2');
    console.log('how many total scratchcards do you end up with?')
    console.log(cardScoresTotal)
}

main()