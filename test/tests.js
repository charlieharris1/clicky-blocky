/* eslint-env browser */
import { assert } from 'chai';
import _ from 'lodash';
import { Block, BlockGrid, COLOURS } from '../app/javascript/grid';

const { describe, it, beforeEach, after } = window;
const setBlueBackground = blocks => [].forEach.call(blocks, (block => block.setAttribute('style', 'background: blue')));
const setRedBackground = blocks => [].forEach.call(blocks, (block => block.setAttribute('style', 'background: red')));

beforeEach(() => {
  const element = document.getElementById('test');
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
});

after(() => document.getElementById('test').remove());

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
  it('should create a grid when given the max number of blocks for x and y axes', () => {
    const X = 2;
    const Y = 2;

    const blockGrid = new BlockGrid(X, Y).render(document.querySelector('#test'));
    assert.equal(blockGrid.MAX_X, 2, 'max x-axis value is 2');
    assert.equal(blockGrid.MAX_Y, 2, 'max x-axis value is 2');

    assert.equal(blockGrid.grid.length, 2, 'grid property is an array containing two elements');
    assert.equal(blockGrid.grid[0].length, 2, 'grid property element is an array containing two blocks');

    const block = blockGrid.grid[0][0];
    assert.property(block, 'colour', 'block has colour property');
    assert.property(block, 'x', 'block has x property');
    assert.property(block, 'y', 'block has y property');
  });
});

describe('BlockGrid render', () => {
  it('should be created correctly', () => {
    const X = 2;
    const Y = 2;

    new BlockGrid(X, Y).render(document.querySelector('#test'));

    const columnElements = document.getElementsByClassName('col');
    const blockElements = document.getElementsByClassName('block');

    assert.equal(columnElements.length, 2, 'two columns created correctly');
    assert.equal(blockElements.length, 4, 'four blocks created correctly');

    assert.equal(columnElements[0].childNodes.length, 2, 'column has two child nodes');
    assert.ok(columnElements[0].childNodes[0].className === 'block', 'col child nodes should be blocks');
    assert.ok(columnElements[0].childNodes[1].className === 'block', 'col child nodes should be blocks');

    const blockElementColourIsAllowed = [].map.call(blockElements, block => _.includes(COLOURS, block.style.backgroundColor));
    assert.notInclude(blockElementColourIsAllowed, false, 'all block elements should have valid colours');

    const blockElementIds = [].map.call(blockElements, block => block.id);
    assert.equal(_.uniq(blockElementIds).length, blockElements.length, 'all block element ids should be unique');
  });
});


describe('BlockGrid blockClicked', () => {
  it('should remove only the target block if there are no blocks connected to it with the same colour', () => {
    const X = 2;
    const Y = 2;

    const blockGrid = new BlockGrid(X, Y);
    blockGrid.render(document.querySelector('#test'));

    const blocks = document.getElementsByClassName('block');
    const targetBlock = document.getElementById('block_1x0');
    const remaniningBlocks = [].filter.call(blocks, (block => block.id !== targetBlock.id));

    setBlueBackground(remaniningBlocks);
    setRedBackground([targetBlock]);

    assert.ok(document.getElementById(targetBlock.id), 'target element should exist before clicked');

    blockGrid.blockClicked(targetBlock.id);

    assert.isNotOk(document.getElementById(targetBlock.id), 'target block should be removed once clicked');
    assert.equal(document.getElementsByClassName('block').length, 3, 'the three blue blocks should be present');
  });

  it('should not remove a block of the same colour if it is not connected', () => {
    const X = 2;
    const Y = 2;

    const blockGrid = new BlockGrid(X, Y);
    blockGrid.render(document.querySelector('#test'));

    const blocks = document.getElementsByClassName('block');
    const targetBlock = document.getElementById('block_1x1');
    const unconnectedBlock = document.getElementById('block_0x0');
    const remainingBlocks = [].filter.call(blocks, (block => (block.id !== targetBlock.id) && (block.id !== unconnectedBlock.id)));

    setBlueBackground(remainingBlocks);
    setRedBackground([targetBlock, unconnectedBlock]);

    blockGrid.blockClicked(targetBlock.id);

    assert.isNotOk(document.getElementById(targetBlock.id), 'target block should be removed once clicked');
    assert.ok(document.getElementById(unconnectedBlock.id), 'unconnected block with same colour as target should be present');
    assert.equal(document.getElementsByClassName('block').length, 3, 'three blocks should be present');
  });

  it('should remove all connected blocks with the same colour as the target', () => {
    const X = 3;
    const Y = 3;

    const blockGrid = new BlockGrid(X, Y);
    blockGrid.render(document.querySelector('#test'));

    const blocks = document.getElementsByClassName('block');

    const targetBlock = document.getElementById('block_1x1');
    const connectedBlockAbove = document.getElementById('block_1x0');
    const connectedBlockBelow = document.getElementById('block_1x2');
    const connectedBlockLeft = document.getElementById('block_0x1');
    const connectedBlockRight = document.getElementById('block_2x1');

    const unconnectedBlocks = [].filter.call(blocks,
      (block =>
        block.id !== targetBlock.id
        && block.id !== connectedBlockAbove.id
        && block.id !== connectedBlockBelow.id
        && block.id !== connectedBlockLeft.id
        && block.id !== connectedBlockRight.id));

    setBlueBackground(unconnectedBlocks);
    setRedBackground([targetBlock, connectedBlockAbove, connectedBlockBelow, connectedBlockLeft, connectedBlockRight]);

    blockGrid.blockClicked(targetBlock.id);
    assert.isNotOk(document.getElementById(targetBlock.id), 'target block should be removed once clicked');
    assert.isNotOk(document.getElementById(connectedBlockAbove.id), 'connected block above with same colour should be removed');
    assert.isNotOk(document.getElementById(connectedBlockBelow.id), 'connected block below with same colour should be removed');
    assert.isNotOk(document.getElementById(connectedBlockLeft.id), 'connected block left with same colour should be removed');
    assert.isNotOk(document.getElementById(connectedBlockRight.id), 'connected block right with same colour should be removed');
    assert.equal(document.getElementsByClassName('block').length, 4, 'the four blue blocks should still exist');
  });

  it('should remove a block of the same colour as the target when it is connected to it a through a block of the same colour', () => {
    const X = 2;
    const Y = 2;

    const blockGrid = new BlockGrid(X, Y);
    blockGrid.render(document.querySelector('#test'));

    const blocks = document.getElementsByClassName('block');
    const targetBlock = document.getElementById('block_1x1');
    const blockNotDirectlyConnected = document.getElementById('block_0x0');
    const connectedAdjacentBlock = document.getElementById('block_0x1');
    const remainingBlocks = [].filter.call(blocks, (block => (block.id !== targetBlock.id) && (block.id !== blockNotDirectlyConnected.id)));

    setBlueBackground(remainingBlocks);
    setRedBackground([targetBlock, blockNotDirectlyConnected, connectedAdjacentBlock]);

    blockGrid.blockClicked(targetBlock.id);

    assert.isNotOk(document.getElementById(targetBlock.id), 'target block should be removed once clicked');
    assert.isNotOk(document.getElementById(connectedAdjacentBlock.id), 'adjacent connected block with same colour as target should be removed');
    assert.isNotOk(document.getElementById(blockNotDirectlyConnected.id), 'block connected via block adjacent to the target, with same colour, should be removed');
    assert.equal(document.getElementsByClassName('block').length, 1, 'one block should be present');
  });
});
