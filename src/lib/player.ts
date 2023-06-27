
import { Position, Game, Board } from './game.ts';
import { Trie } from './dictionary.ts';

interface Point { 
	x: number, 
	y: number 
}

let longestWord = "";
let longestWordPath: Point[] = [];

let isSafe = function (board: Game['board'], row: number, col: number, visited: boolean[][]) {
        let ROW = board.size, COL = board.size;
	return (row >= 0) && (row < ROW) && (col >= 0) && (col < COL) && !visited[row][col];
}

export abstract class Player {
    id: string;
    score: number; // Score of the current game
    usedWords: string[]; // List of used words

    constructor(id: string) {
        this.id = id;
        this.score = 0;
        this.usedWords = [];
    }

    makeMove(game: Game): Position { return new Position(0,0) }
}

export class BotPlayer extends Player {
    currentWord: string = "";
    dir: Point[] = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }];
    dictionary: Trie;

    constructor(id: string, dictionary: Trie) {
        super(id);
        this.dictionary = dictionary;
    }
    
    searchWord(board: Board, visited: boolean[][], row: number, col: number, path: Point[]): void {
        visited[row][col] = true;
        this.currentWord += board.cells[row][col];
        path.push({ x: row, y: col });

        if ((this.currentWord.length > longestWord.length) && this.dictionary.contains(this.currentWord)) {
            longestWord = this.currentWord;
            longestWordPath = [...path];
        }

        for (let k = 0; k < 4; ++k) {
            if (isSafe(board, row + this.dir[k].x, col + this.dir[k].y, visited)) {
                this.searchWord(board, visited, row + this.dir[k].x, col + this.dir[k].y, path);
            }
        }

        visited[row][col] = false;
        this.currentWord = this.currentWord.slice(0, this.currentWord.length - 1);
        path.pop();
    }

    findAllWords(board: Board): void {
        let visited = Array.from({ length: board.size }, () => new Array(board.size).fill(false));
        let path: Point[] = [];

        this.currentWord = "";
        longestWord = "";

        for (let i = 0; i < board.size; i++) {
            for (let j = 0; j < board.size; j++) {
                this.searchWord(board, visited, i, j, path);
            }
        }

        console.log('Longest word found is: ', longestWord);
    }

    makeMove(game: Game): Position {
        this.findAllWords(game.board);

        for (let p of longestWordPath) {
            if (game.board.cells[p.x][p.y] === "") {
                return new Position(p.x, p.y);
            }
        }

        // In case no move found, return an arbitrary position. Improve this.
        return new Position(0, 0);
    }
}
