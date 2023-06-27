import type { BaldaGame } from "@/lib/game.ts";
import { Trie, TrieNode } from "@/lib/trie.ts";
import { log } from "console";
import { type } from "os";

type Position = [number, number];
interface WordData {
    positions: Position[],
    word: string,
    depth: number
    current: Position
    node: TrieNode
    endOfWord: boolean
}

export class BaldaBotPlayer {
    id: number;
    game: BaldaGame;
    trie: Trie;
    maxDepth: number;
    directions: Position[];

    constructor(game: BaldaGame, dictionary: Set<string>, id: number, maxDepth: number = 50) {
        this.game = game;
        this.trie = new Trie();
        for (let word of dictionary) {
            this.trie.insert(word);
        }
        this.id = id;
        this.maxDepth = maxDepth;
        this.directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];  // up, down, left, right
    }

    makeMove() {
        let max: WordData | undefined;
        let maxLen: number = -1;

        for (let i = 0; i < this.game.board.length; i++) {
            for (let j = 0; j < this.game.board[0].length; j++) {
                // DFS search for a valid word from position (i, j) woith Trie
                let result = this.findLongestWord({
                    word: '',
                    positions: [],
                    depth: 0,
                    current: [i, j],
                    node: this.trie.root,
                    endOfWord: false
                });
                if (result && result.word.length > maxLen) {
                    maxLen = result.word.length;
                    max = result
                }
            }
        }
        if (max) {
            log('Longest word: ' + max.word);
            log('Longest word positions: ' + max.positions.map((p) => p.join(',')).join(' => '));
            this.game.addLetterToBoard(max.word, max.positions);
            this.game.updateScore(this.id, max.word);
        }
    }

    findLongestWord(data: WordData): WordData | undefined {
        // log('Starting search at ' + JSON.stringify(data, null, 2));
        if (data.endOfWord && data.node.endOfWord) {
            return data
        }

        for (const direction of this.directions) {
            const current: Position = [data.current[0] + direction[0], data.current[1] + direction[1]];
            if (
                data.depth >= this.maxDepth ||
                current[0] < 0 || current[0] >= this.game.board.length ||
                current[1] < 0 || current[1] >= this.game.board[0].length
            ) {
                continue
            }

            const letters: string[] = data.endOfWord ?
                Array.from(data.node?.children.keys() || []) :
                [this.game.board[data.current[0]][data.current[1]]];

            if (
                letters.length === 0 ||
                data.positions.some(([x, y]) => x === data.current[0] && y === data.current[1])
            ) {
                return data
            }

            for (const letter of letters) {
                const node = data.node?.children.get(letter);
                if (node) {
                    const depth = data.depth + 1;
                    const word = data.word + letter;
                    const positions: Position[] = [...data.positions, data.current];
                    const endOfWord = data.endOfWord || this.game.board[current[0]][current[1]] === '_'

                    const next = this.findLongestWord({
                        word,
                        current,
                        depth,
                        positions,
                        node,
                        endOfWord
                    });

                    if (next && next.word.length > data.word.length) {
                        data = next;
                    }
                }
            }
        }
    }
}
