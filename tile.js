export class Tile {
  constructor(gridEl) {
    this.tileEl = document.createElement("div");
    this.tileEl.classList.add("tile");
    this.setValue(Math.random() > 0.5 ? 2 : 4);
    gridEl.append(this.tileEl);
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
    this.tileEl.style.setProperty("--x", x);
    this.tileEl.style.setProperty("--y", y);
  }

  setValue(value) {
    this.value = value; // <-- use the passed value, not a random reroll
    this.tileEl.textContent = this.value;

    this.tileEl.setAttribute("value", this.value);
  }

  removeFromDOM() {
    this.tileEl.remove();
  }

  waitForTransitionEnd() {
    return new Promise((resolve) => {
      this.tileEl.addEventListener("transitionend", resolve, { once: true });
    });
  }
  waitForAnimationEnd() {
    return new Promise((resolve) => {
      this.tileEl.addEventListener("animationend", resolve, { once: true });
    });
  }
}
