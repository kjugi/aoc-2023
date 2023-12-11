import { readFileSync } from 'fs';

function main() {
    const fileContent = readFileSync('../input.txt')
    // const fileContent = readFileSync('../demo-input.txt')
    const lines = fileContent
        .toString()
        .split('\n')

    // console.log(lines);
}

main()