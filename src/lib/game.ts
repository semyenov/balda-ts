import { log } from "console";

export class BaldaGame {
    board: string[][] = []
    dictionary: Set<string>;
    words: [string[], string[]] = [[], []];
    score: [number, number] = [0, 0];

    // assuming startingWord is the word with which game is initialised
    constructor(dictionary: Set<string>, boardSize: number, startingWord: string) {
        this.dictionary = dictionary;

        // initializing the board loop
        for (let i = 0; i < boardSize; i++) {
            this.board.push(new Array(boardSize).fill('_'));
        }
        // setting up the starting word in the middle of the board
        const startRow = Math.floor(boardSize / 2);
        for (let j = 0; j < startingWord.length; j++) {
            this.board[startRow][j] = startingWord[j];
        }
    }

    // checks if 'word' is in the dictionary and can be formed on the board
    // 'positions' is an array of tuples representing the positions of the letters in 'word' on the board
    isValidWord(word: string, positions: [number, number][]): boolean {
        return this.dictionary.has(word) && this.isSequentialOnBoard(positions);
    }

    isSequentialOnBoard(positions: [number, number][]): boolean {
        // code to check if positions are contiguous (up, down, left, or right) on the board
        // this can be done by checking if every pair of adjacent positions are neighbors
        for (let i = 0; i < positions.length - 1; i++) {
            if (!this.areNeighbors(positions[i], positions[i + 1])) {
                return false;
            }
        }
        return true;
    }

    addLetterToBoard(word: string, positions: [number, number][]): void {
        for (let i in positions) {
            this.board[positions[i][0]][positions[i][1]] = word[i];
        }
    }

    areNeighbors(pos1: [number, number], pos2: [number, number]): boolean {
        return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]) === 1;
    }

    // Updates the score
    updateScore(playerId: number, word: string): void {
        this.score[playerId] += word.length;
    }

    /**
     * Prints the game board and the current word being constructed.
     */
    printBoard(): void {
        // Print top border of board
        console.log('---------------------');

        // Print each row of the board with '|' separating cells
        for (let i = 0; i < this.board.length; i++) {
            console.log("| " + this.board[i].join(' | ') + " |");
            console.log('---------------------'); // Print border after each row
        }
    }
}
