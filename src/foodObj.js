
export class Food {
  constructor() {
    this.foodLevel = 0;
  }

  checkForFood() {
    return this.foodLevel;
  }

  fill() {
    this.foodLevel = 9
  }

  eatFrom() {
    this.foodLevel = this.foodLevel > 0 && this.foodLevel - 1
  }
}