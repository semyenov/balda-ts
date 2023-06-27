
import { Player } from './player.ts';

export class Position {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

export class Board {
    size: number
    cells: string[][]
    
    constructor(size: number) {
        this.size = size
        this.cells = Array.from<string>({ length: size }).map(() => {
            return Array.from<string>({ length: size }).fill('');
        })
    }
}

export class Game {
    currentTurn: Player['id']
    board: Board
    players: {[key: string]: Player} = {}

    constructor(size: number, players: Player[], startWord: string) {
        this.board = new Board(size)
        players.forEach(player => this.players[player.id] = player);
        this.currentTurn = players[0].id

        // Add startWord in the center of the board
        const startRow = Math.floor(size / 2);
        const startCol = Math.floor((size - startWord.length) / 2);
       
        for (let i = 0; i < startWord.length; i++) {
          this.board.cells[startRow][startCol + i] = startWord[i];
        }
    }

    addLetter(position: Position, letter: string): void {
        this.board.cells[position.x][position.y] = letter
    }

     // Check if the game is over
    isGameOver(): boolean {
        return !this.board.cells.flat().includes('');
    }

    // Get the current player
    getCurrentPlayer(): Player {
        return this.players[this.currentTurn];
    }

    // Calculate the next turn
    calculateNextTurn(): Player['id'] {
        return Object.values(this.players).find(player => player.id !== this.currentTurn)!.id;
    }

    // Shift to the next player's turn
    nextTurn(): void {
        this.currentTurn = this.calculateNextTurn();
    }

    // Player makes a move (adds a letter) and the turn changes to the next player
    makeMove(position: Position, letter: string): void {
        this.addLetter(position, letter);
        if (!this.isGameOver()) {
            this.nextTurn();
        }
    }

    // Calculate player's score
    calculateScore(word: string): number {
        // Each letter equals one point
        return word.length;
    }

    // The player plays a word, adding points to their score
    playWord(word: string): void {
        this.getCurrentPlayer().score += this.calculateScore(word);
        // this.makeMove(this.getCurrentPlayer().movePosition(word), this.getCurrentPlayer().moveLetter(word));
    }

    // Determine the winner
    getWinner(): Player {
        return Object.values(this.players).reduce((winner, current) => winner.score > current.score ? winner : current);
    }
}
