export const COLOURS = ['red', 'green', 'blue', 'yellow'];
const MAX_X = 10;
const MAX_Y = 10;

export class Block {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    }
}

export class BlockGrid {
    constructor () {
        this.grid = [];

        for (let x = 0; x < MAX_X; x++) {
            let col = [];
            for (let y = 0; y < MAX_Y; y++) {
                col.push(new Block(x, y));
            }

            this.grid.push(col);
        }

        return this;
    }

    render (el = document.querySelector('#gridEl')) {
        for (let x = 0; x < MAX_X; x++) {
            let id = 'col_' + x;
            let colEl = document.createElement('div');
            colEl.className = 'col';
            colEl.id = id;
            el.appendChild(colEl);

            for (let y = MAX_Y - 1; y >= 0; y--) {
                let block = this.grid[x][y],
                    id = `block_${x}x${y}`,
                    blockEl = document.createElement('div');

                blockEl.id = id;
                blockEl.className = 'block';
                blockEl.style.background = block.colour;
                blockEl.addEventListener('click', (evt) => this.blockClicked(id));
                colEl.appendChild(blockEl);
            }
        }

        return this;
    }

    blockClicked (targetBlockId) {
        let blocksChecked = [];
        const targetBlockColour = document.getElementById(targetBlockId).style.background;

        function connectedBlocksWithSameColour(blockId) {
            const blockHasBeenChecked = blocksChecked.indexOf(blockId) >= 0;

            if (blockHasBeenChecked) return null;
            blocksChecked.push(blockId);

            const block = document.getElementById(blockId).getBoundingClientRect();

            const middleVertical = block.top + (block.height / 2);
            const middleHorizontal = block.left + (block.width / 2);

            const blockBelow = document.elementFromPoint(middleHorizontal, block.bottom + 1);
            const blockAbove = document.elementFromPoint(middleHorizontal, block.top - 1);
            const blockLeft = document.elementFromPoint(block.left -1 , middleVertical);
            const blockRight = document.elementFromPoint(block.right + 1, middleVertical);

            const adjacentBlocks = [blockBelow, blockAbove, blockLeft, blockRight];

            return adjacentBlocks.reduce((accumulator, adjacentBlock)  => {
                if (!adjacentBlock) return accumulator;

                if (adjacentBlock.style.background === targetBlockColour) {
                    return [].concat(accumulator, connectedBlocksWithSameColour(adjacentBlock.id));
                }

                return accumulator;
            }, [ blockId ]);
        }

        connectedBlocksWithSameColour(targetBlockId)
          .forEach((id) => (id ? document.getElementById(id).remove() : null))
    }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());