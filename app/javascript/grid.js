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
                let block = this.grid[x][y], // TODO: this is how we can reassign the blocks
                    id = `block_${x}x${y}`,
                    blockEl = document.createElement('div');

                blockEl.id = id;
                blockEl.className = 'block';
                blockEl.style.background = block.colour;
                blockEl.addEventListener('click', (evt) => this.blockClicked(evt, block, id));
                colEl.appendChild(blockEl);
            }
        }

        return this;
    }

    blockClicked (e, block, id) {
        // document.getElementById(id).setAttribute('id', 'charlie');
        // is it possible to set element id based on its coordinates
        // for each column go through and update their coordinates

        // 1. Get the colors of the surrounding blocks.
        let ids = [];

        function getIdsOfAdjacentCellsWithTheSameColour(elemId) {
            var idOfBlockAbove = 'block_' + (block.x) + 'x' + (block.y + -1 );
            var idOfBlockBelow = 'block_' + (block.x) + 'x' + (block.y + 1 );
            var idOfBlockLeft = 'block_' + (block.x - 1) + 'x' + (block.y);
            var idOfBlockRight = 'block_' + (block.x + 1) + 'x' + (block.y);

            var blockColour = document.getElementById(elemId).style.background;
            var adjacentBlocks = [idOfBlockAbove, idOfBlockBelow, idOfBlockRight, idOfBlockLeft];

            return adjacentBlocks.reduce(function(accumulator, id) {
                var adjacentBlockColour = document.getElementById(id).style.background;
                if (adjacentBlockColour === blockColour) {
                    return [].concat(accumulator, id)
                }
                return accumulator;
            }, []);
        }

        console.log('IDs ----', getIdsOfAdjacentCellsWithTheSameColour(id)); // KEEP GOING TILL THERE ARE NONE
        console.log(e, block, id);
    }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());