import { Cell } from "./cell.js";

export class Grid {
  constructor(gridEl) {
    this.cells = [];

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        this.cells.push(new Cell(gridEl, x, y));
      }
    }

    this.cellsGroupedByCol = this.groupCellsByCol();
    this.cellsGroupedByRow = this.groupCellsByRow();
  }

  getRandomEmptyCell() {
    const emptyCells = this.cells.filter((cell) => cell.isEmpty());
    if (emptyCells.length === 0) return undefined;
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  groupCellsByCol() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.x] = groupedCells[cell.x] || [];
      groupedCells[cell.x][cell.y] = cell;
      return groupedCells;
    }, []);
  }

  groupCellsByRow() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.y] = groupedCells[cell.y] || [];
      groupedCells[cell.y][cell.x] = cell;
      return groupedCells;
    }, []);
  }
}
