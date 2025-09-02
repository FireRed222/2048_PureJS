import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const board = document.getElementById("board");

const grid = new Grid(board);
grid.getRandomEmptyCell().linkTile(new Tile(board));
grid.getRandomEmptyCell().linkTile(new Tile(board));
setupInput();

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchend", handleTouchEnd, { passive: true });
}

let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(e) {
  const firstTouch = e.changedTouches[0];
  touchStartX = firstTouch.clientX;
  touchStartY = firstTouch.clientY;
}

function handleTouchEnd(e) {
  const lastTouch = e.changedTouches[0];
  const dx = lastTouch.clientX - touchStartX;
  const dy = lastTouch.clientY - touchStartY;

  // Pick horizontal or vertical based on which delta is larger
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 50) {
      handleInput({ key: "ArrowRight" }); // Swipe right
    } else if (dx < -50) {
      handleInput({ key: "ArrowLeft" }); // Swipe left
    }
  } else {
    if (dy > 50) {
      handleInput({ key: "ArrowDown" }); // Swipe down
    } else if (dy < -50) {
      handleInput({ key: "ArrowUp" }); // Swipe up
    }
  }
}

async function handleInput(event) {
  switch (event.key) {
    case "ArrowUp":
    case "W":
    case "w":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowRight":
    case "D":
    case "d":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    case "ArrowDown":
    case "S":
    case "s":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
    case "A":
    case "a":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;

    default:
      setupInput();
      return;
  }

  const newTile = new Tile(board);
  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveRight() && !canMoveLeft()) {
    await newTile.waitForAnimationEnd();
    alert("Try Again!");
    window.location.reload();
    return;
  }

  setupInput();
}

async function moveUp() {
  await slideTiles(grid.cellsGroupedByCol.map((col) => col));
}

async function moveDown() {
  await slideTiles(grid.cellsGroupedByCol.map((col) => [...col].reverse()));
}

async function moveLeft() {
  await slideTiles(grid.cellsGroupedByRow.map((row) => row));
}

async function moveRight() {
  await slideTiles(grid.cellsGroupedByRow.map((row) => [...row].reverse()));
}

async function slideTiles(groupedCells) {
  const promises = [];

  await Promise.all(promises);

  groupedCells.forEach((group) => {
    slideTilesInGroup(group, promises);
  });

  grid.cells.forEach((cell) => {
    cell.hasTileForMerge() && cell.mergeTiles();
  });
}

function slideTilesInGroup(group, promises) {
  for (let i = 1; i < group.length; i++) {
    if (group[i].isEmpty()) {
      continue;
    }

    const cellWithTile = group[i];

    let targetCell;
    let j = i - 1;
    while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
      targetCell = group[j];
      j--;
    }

    if (!targetCell) {
      continue;
    }

    promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

    if (targetCell.isEmpty()) {
      targetCell.linkTile(cellWithTile.linkedTile);
    } else {
      targetCell.linkTileForMerge(cellWithTile.linkedTile);
    }

    cellWithTile.unlinkTile();
  }
}

function canMoveUp() {
  return canMove(grid.cellsGroupedByCol.map((col) => col));
}
function canMoveRight() {
  return canMove(grid.cellsGroupedByRow.map((row) => [...row].reverse()));
}
function canMoveDown() {
  return canMove(grid.cellsGroupedByCol.map((col) => [...col].reverse()));
}
function canMoveLeft() {
  return canMove(grid.cellsGroupedByRow.map((row) => row));
}

function canMove(groupedCells) {
  return groupedCells.some((group) => canMoveInGroup(group));
}

function canMoveInGroup(group) {
  return group.some((cell, index) => {
    if (index === 0) {
      return false;
    }

    if (cell.isEmpty()) {
      return false;
    }

    const targetCell = group[index - 1];
    return targetCell.canAccept(cell.linkedTile);
  });
}

window.addEventListener("touchmove", (e) => {
  e.preventDefault();
}, { passive: false });
