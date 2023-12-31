import { readFileSync } from "node:fs";

const HAND_STRENGTH = {
  FIVE_OF_A_KIND: 7,
  FOUR_OF_A_KIND: 6,
  FULL_HOUSE: 5,
  THREE_OF_A_KIND: 4,
  TWO_PAIRS: 3,
  ONE_PAIR: 2,
  HIGH_CARD: 1,
  COMMON: 0,
} as const;

function main() {
  const fileContent = readFileSync("../input.txt");
  // const fileContent = readFileSync("../demo-input.txt");
  const lines = fileContent.toString().split("\n");

  // console.log(lines);

  const cardStrengthMap: Record<string, number> = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
  };
  const cardKeys = Object.keys(cardStrengthMap);

  const handByStrength: Array<{
    hand: number[];
    handStrength: (typeof HAND_STRENGTH)[keyof typeof HAND_STRENGTH];
    cards: string[];
    bid: number;
  }> = [];

  lines.forEach((line) => {
    const [hand, bid] = line.split(" ");
    const cards = hand.split("");
    const mappedCards = cards.map((card) => {
      return cardStrengthMap[card];
    });
    let handStrength: (typeof HAND_STRENGTH)[keyof typeof HAND_STRENGTH] =
      HAND_STRENGTH.COMMON;

    if (cards.every((card) => card === cards[0])) {
      handStrength = HAND_STRENGTH.FIVE_OF_A_KIND;
    } else if (
      cardKeys.find((card) => cards.filter((c) => c === card).length === 4)
    ) {
      handStrength = HAND_STRENGTH.FOUR_OF_A_KIND;
    } else if (
      cardKeys.find((card) => cards.filter((c) => c === card).length === 3) &&
      cardKeys
        .filter(
          (card) =>
            card !==
            cardKeys.find(
              (card) => cards.filter((c) => c === card).length === 3
            )
        )
        .find((card) => cards.filter((c) => c === card).length === 2)
    ) {
      handStrength = HAND_STRENGTH.FULL_HOUSE;
    } else if (
      cardKeys.find((card) => cards.filter((c) => c === card).length === 3)
    ) {
      handStrength = HAND_STRENGTH.THREE_OF_A_KIND;
    } else if (
      cardKeys.find((card) => cards.filter((c) => c === card).length === 2) &&
      cardKeys
        .filter(
          (card) =>
            card !==
            cardKeys.find(
              (card) => cards.filter((c) => c === card).length === 2
            )
        )
        .find((card) => cards.filter((c) => c === card).length === 2)
    ) {
      handStrength = HAND_STRENGTH.TWO_PAIRS;
    } else if (
      cardKeys.find((card) => cards.filter((c) => c === card).length === 2)
    ) {
      handStrength = HAND_STRENGTH.ONE_PAIR;
    } else if (
      mappedCards.every((cardValue, index) =>
        index === 0 ? true : cardValue === mappedCards[index - 1] + 1
      )
    ) {
      handStrength = HAND_STRENGTH.HIGH_CARD;
    }

    handByStrength.push({
      hand: mappedCards,
      handStrength,
      cards,
      bid: Number(bid),
    });
  });

  handByStrength.sort((a, b) => {
    if (a.handStrength > b.handStrength) {
      return -1;
    } else if (a.handStrength < b.handStrength) {
      return 1;
    } else {
      // same strength, sort by card value
      const handLength = a.hand.length;
      let sortValue = 0;

      for (let i = 0; i < handLength; i++) {
        if (a.hand[i] === b.hand[i]) {
          continue;
        } else if (a.hand[i] > b.hand[i]) {
          sortValue = -1;
          break;
        } else if (a.hand[i] < b.hand[i]) {
          sortValue = 1;
          break;
        }
      }

      return sortValue;
    }
  });

  // console.log(handByStrength);

  const bestPossibleRank = handByStrength.length;
  const handByRank: Array<{
    hand: number[];
    handStrength: number;
    cards: string[];
    bid: number;
    rank: number;
  }> = handByStrength.map((hand, index) => {
    return {
      ...hand,
      rank: bestPossibleRank - index,
    };
  });

  // console.log(handByRank);

  const totalWinnings = handByRank.reduce((acc, hand) => {
    return acc + hand.bid * hand.rank;
  }, 0);

  console.log("--- Day 7: Camel Cards ---");
  console.log("--- Part One ---");
  console.log("What are the total winnings?");
  console.log(totalWinnings);

  // Part Two
  const jokerCardStrengthMap: Record<string, number> = {
    A: 13,
    K: 12,
    Q: 11,
    T: 10,
    "9": 9,
    "8": 8,
    "7": 7,
    "6": 6,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
    J: 0,
  };
  const jokerCardKeys = Object.keys(cardStrengthMap);

  // TODO: set the line loop to with defining handStrength - make a method from it to reuse
  // TODO: at the end check for J card
  // TODO: possible checks:
  // - 5 J cards = explicit AAAAA
  // - 4 J cards = get remaining card and take it's value to make it FIVE_OF_A_KIND
  // - 3 J cards
  //   - if got ONE_PAIR - take it's value to make it FIVE_OF_A_KIND
  //   - if got nothing/two different - take higher value to make it FOUR_OF_A_KIND
  // - 2 J cards
  //   - if got FULL_HOUSE/THREE_OF_A_KIND - take it's value to make it FIVE_OF_A_KIND
  //   - if got ONE_PAIR - take it's value to make it FOUR_OF_A_KIND
  //   - if got nothing/three different - take highest card value to make it THREE_OF_A_KIND
  // - 1 J card
  //   - if got FOUR_OF_A_KIND - take it's value to make it FIVE_OF_A_KIND
  //   - if got THREE_OF_A_KIND - take it's value to make it FOUR_OF_A_KIND
  //   - if got TWO_PAIRS - take higher pair value to make it FULL_HOUSE
  //   - if got ONE_PAIR - take highest card from ALL to make it FULL_HOUSE
  //   - if got nothing - take highest card from ALL to make it ONE_PAIR
  // - 0 J cards = return original handStrength

  // TODO: repeat the sort, rank and totalWinnings

  console.log("--- Part Two ---");
  console.log("What are the new total winnings?");
}

main();
