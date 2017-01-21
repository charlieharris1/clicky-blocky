/* eslint-env browser */
import { assert } from 'chai';
import _ from 'lodash';
import { Block, BlockGrid, COLOURS } from '../app/javascript/grid';

const { describe, it, beforeEach } = window;


beforeEach(() => {
  const element = document.getElementById('test');
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
});

describe('Block', () => {
  it('should be created correctly', () => {
    const testCoords = [
            [1, 2],
            [4, 9],
            [0, 0],
    ];

    testCoords.forEach((testCoord) => {
      const block = new Block(...testCoord);
      assert.equal(block.x, testCoord[0], 'x is set correctly');
      assert.equal(block.y, testCoord[1], 'y is set correctly');
      assert.ok(COLOURS.indexOf(block.colour) > -1, 'colour is valid');
    });
  });
});

describe('BlockGrid', () => {
  it('should be created correctly', () => {
    const X = 2;
    const Y = 2;

    const blockGrid = new BlockGrid(X, Y).render(document.querySelector('#test'));
    const columnElements = document.getElementsByClassName('col');

    assert.equal(columnElements.length, 2, 'two columns created correctly');
    assert.equal(document.getElementsByClassName('block').length, 4, 'four blocks created correctly');

    assert.equal(columnElements[0].childNodes.length, 2, 'column has two child nodes');
    assert.ok(columnElements[0].childNodes[0].className === 'block', 'col child nodes should be blocks');
    assert.ok(columnElements[0].childNodes[1].className === 'block', 'col child nodes should be blocks');

    const blockColours = _.flatten(blockGrid.grid).map(block => block.colour);
    assert.includeMembers(COLOURS, blockColours, 'all block colours are valid');
  });
});

describe('blockClicked', () => {
  it('should get rid of a square if there are none around it with the same colour', () => {
    const X = 2;
    const Y = 2;

    const setBlocksToBlue = blocks => [].forEach.call(blocks, (block => block.setAttribute('style', 'color: blue')));
    const setBlocksToRed = blocks => [].forEach.call(blocks, (block => block.setAttribute('style', 'color: red')));

    const blockGrid = new BlockGrid(X, Y);
    blockGrid.render(document.querySelector('#test'));

    const blocks = document.getElementsByClassName('block');
    const targetBlock = document.getElementById('block_1x0');
    const adjacentBlocks = [].filter.call(blocks, (block => block.id !== targetBlock.id));

    setBlocksToBlue(adjacentBlocks);
    setBlocksToRed([targetBlock]);

    assert.ok(document.getElementById(targetBlock.id), 'target element should exist before clicked');

    blockGrid.blockClicked(targetBlock.id);

    assert.isNotOk(document.getElementById(targetBlock.id), 'target element should be removed once clicked');
    assert.equal(document.getElementsByClassName('block').length, 3, 'the three blue blocks should still exist');
  });
});
