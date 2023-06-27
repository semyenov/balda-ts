
import { Trie } from './lib/dictionary.ts';
import { Game } from './lib/game.ts';
import { BotPlayer } from './lib/player.ts';

const dictionary = new Trie()
await dictionary.initializeFromDictionary('./words.txt')

const player1 = new BotPlayer('player1', dictionary);
const player2 = new BotPlayer('player2', dictionary);
const game = new Game(5, [player1, player2], 'судка');


let round = 1;
while (!game.isGameOver()) {
    console.log(`Round ${round}`);

    const currentPlayer = game.getCurrentPlayer();
    console.log(`Current player is: ${currentPlayer.id}`);

    const move = currentPlayer.makeMove(game); // move should return an object {word: string, position: Position, letter: string}

    if (move) {
        
        // Validate the word here according to Balda game rules
        const isValidWord = true; // replace this with actual word validation logic

        if (isValidWord) {
            console.log(`Player ${currentPlayer.id} plays the word: ${currentPlayer.usedWords}`);
            // game.playWord(word);
            // game.makeMove(position, letter);
        } else {
            console.log(`Player ${currentPlayer.id} tried to play invalid word: ${currentPlayer.usedWords}`);
        }
    }

    game.nextTurn();
    round++;
}

console.log(`Game Over. The winner is ${game.getWinner().id}`);
