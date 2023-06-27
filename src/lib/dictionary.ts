
import { promises as fs } from 'node:fs';

export class Node {
    children: Map<string, Node>;
    isEndOfWord: boolean;

	constructor() {
		this.isEndOfWord = false;
		this.children = new Map<string, Node>();
	}
}

export class Trie {
	root: Node;

	constructor() {
		this.root = new Node();
	}

	insert(word: string): void {
		let currentNode = this.root;
		for (let i = 0; i < word.length; i++) {
			let character = word.charAt(i);
			let node = currentNode.children.get(character);

			if (node == null) {
				node = new Node();
				currentNode.children.set(character, node);
			}

			currentNode = node;

			// mark the current node as end of the word if this is the last character
			if (i === word.length - 1) {
				node.isEndOfWord = true;
			}
		}
	}

	contains(word: string): boolean {
		let currentNode = this.root;
		
		for (let i = 0; i < word.length; i++) {
			let character = word.charAt(i);
			let node = currentNode.children.get(character);

			if (node == null) {
				return false;
			}

			currentNode = node;
		}

		// the word is found if we have reached the end of the word in the trie
		return currentNode.isEndOfWord;
	}

	find(prefix: string): Node | null {
		let currentNode = this.root;

		for (let i = 0; i < prefix.length; i++) {
			let character = prefix.charAt(i);
			let node = currentNode.children.get(character);

			if (node == null) {
				return null;
			}

			currentNode = node;
		}

		// Return the node if we have reached the last character of the prefix in the trie
		return currentNode;
	}

    getAllPossibleNextLetters(prefix: string): string[] {
        let lastNodeOfPrefix = this.find(prefix);
        let possibleLetters: string[] = [];
      
        if (lastNodeOfPrefix) {
            for (let [letter] of lastNodeOfPrefix.children) {
                possibleLetters.push(letter);
            }
        }

        return possibleLetters;
    }

    async readFileLines(path: string): Promise<Set<string>> {
        const content = await fs.readFile(path, 'utf8');
        return new Set(content.split(/\r?\n/));
    }
  
    async initializeFromDictionary(path: string): Promise<void> {
        const words = await this.readFileLines(path);
        for (let word of words) {
            this.insert(word);
        }
    }
}
