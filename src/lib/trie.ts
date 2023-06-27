interface ITrieNode {
    children: Map<string, ITrieNode>;
    endOfWord: boolean;
}

export class TrieNode implements ITrieNode {
    children: Map<string, ITrieNode> = new Map();
    endOfWord: boolean = false;
}

export class Trie {
    root: ITrieNode = new TrieNode();

    insert(word: string) {
        let currentNode: ITrieNode = this.root;

        for (let i: number = 0; i < word.length; i++) {
            if (!currentNode.children.has(word[i])) {
                currentNode.children.set(word[i], new TrieNode());
            }
            currentNode = currentNode.children.get(word[i])!
        }

        currentNode.endOfWord = true;
    }

    searchPrefix(word: string): ITrieNode | undefined {
        let currentNode: ITrieNode = this.root;

        for (let i: number = 0; i < word.length; i++) {
            if (!currentNode.children.has(word[i])) {
                return;
            }
            currentNode = currentNode.children.get(word[i])!
        }
        return currentNode;
    }
}
