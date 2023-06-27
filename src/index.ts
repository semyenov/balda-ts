import { BaldaGame } from './lib/game.ts';
import { BaldaBotPlayer } from './lib/bot.ts';
import { promises as fs } from 'node:fs';

// readFileLines iterate file line by line and returns Set of strings 
async function readFileLines(path: string): Promise<Set<string>> {
  const content = await fs.readFile(path, 'utf8');
  return new Set(content.split(/\r?\n/));
}

const words = await readFileLines('./words.txt');
const game = new BaldaGame(words, 5, 'балда');
const botPlayer = new BaldaBotPlayer(game, words, 1);

for (let i = 0; i < 10; i++) {
  botPlayer.makeMove();
  game.printBoard();
}
