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
        let adjacentCellsChecked = [];
        var blockColour = document.getElementById(id).style.background;

        function getIdsOfAdjacentCellsWithTheSameColour(elemId) { // ensure that current is inserted
            // Make sure we haven't already run this check for an element.
            if (adjacentCellsChecked.indexOf(elemId) >= 0) return null;
            adjacentCellsChecked.push(elemId);

            var coordinates = elemId.substring(elemId.length - 3);
            var xAxis = parseInt(coordinates.slice(0, 1));
            var yAxis = parseInt(coordinates.slice(2, 3));

            var idOfBlockAbove = 'block_' + xAxis + 'x' + (yAxis - 1 );
            var idOfBlockBelow = 'block_' + xAxis + 'x' + (yAxis + 1 );
            var idOfBlockLeft = 'block_' + (xAxis - 1) + 'x' + yAxis;
            var idOfBlockRight = 'block_' + (xAxis + 1) + 'x' + yAxis;

            var adjacentBlocks = [idOfBlockAbove, idOfBlockBelow, idOfBlockRight, idOfBlockLeft];
            return adjacentBlocks.reduce(function(accumulator, id) {
                const adjacentElement = document.getElementById(id);

                if (!adjacentElement) return accumulator;

                if (adjacentElement.style.background === blockColour) {
                    return [].concat(accumulator, getIdsOfAdjacentCellsWithTheSameColour(id));
                }

                return accumulator;
            }, elemId);
        }

        const idsToBeDeleted = [].concat(getIdsOfAdjacentCellsWithTheSameColour(id));
        idsToBeDeleted.forEach(function(id) {
            if (id) {
                var elem = document.getElementById(id);
                elem.remove();
            }
        });

        //TODO: next step is to alter the IDs of the cells that have moved. Perhaps go through each column? Or find the nearest and don't rely on coords?

        console.log(e, block, id);
    }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());