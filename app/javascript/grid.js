/* eslint-env browser */
export const COLOURS = ['red', 'green', 'blue', 'yellow'];
const MAX_X = 10;
const MAX_Y = 10;

export class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
  }
}

export class BlockGrid {
  constructor() {
    this.grid = [];

    for (let x = 0; x < MAX_X; x += 1) {
      const col = [];
      for (let y = 0; y < MAX_Y; y += 1) {
        col.push(new Block(x, y));
      }

      this.grid.push(col);
    }

    return this;
  }

  render(el = document.querySelector('#gridEl')) {
    for (let x = 0; x < MAX_X; x += 1) {
      const colId = `col_${x}`;
      const colEl = document.createElement('div');
      colEl.className = 'col';
      colEl.id = colId;
      el.appendChild(colEl);

      for (let y = MAX_Y - 1; y >= 0; y -= 1) {
        const block = this.grid[x][y];
        const blockId = `block_${x}x${y}`;
        const blockEl = document.createElement('div');

        blockEl.id = blockId;
        blockEl.className = 'block';
        blockEl.style.background = block.colour;
        blockEl.addEventListener('click', () => this.blockClicked(blockId));
        colEl.appendChild(blockEl);
      }
    }

    return this;
  }

  blockClicked(targetBlockId) {
    const blocksChecked = [];
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
      const blockLeft = document.elementFromPoint(block.left - 1, middleVertical);
      const blockRight = document.elementFromPoint(block.right + 1, middleVertical);

      const adjacentBlocks = [blockBelow, blockAbove, blockLeft, blockRight];

      return adjacentBlocks.reduce((accumulator, adjacentBlock) => {
        if (!adjacentBlock) return accumulator;

        if (adjacentBlock.style.background === targetBlockColour) {
          return [].concat(accumulator, connectedBlocksWithSameColour(adjacentBlock.id));
        }

        return accumulator;
      }, [blockId]);
    }

    connectedBlocksWithSameColour(targetBlockId)
          .forEach(id => (id ? document.getElementById(id).remove() : null));
  }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());
