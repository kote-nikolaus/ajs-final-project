export default class Character {
  constructor(level, type = 'generic') {
    this.level = level + 1;
    this.attack = 0;
    this.defence = 0;
    this.health = 100;
    this.type = type;

    if (new.target.name === 'Character') {
      throw new Error('Instances of Character are not allowed');
    }
  }

  levelUp() {
    if (this.health > 0) {
      this.level += 1;
      this.attack = Math.max(this.attack, this.attack * (80 + this.health) / 100);
      this.defence = Math.max(this.defence, this.defence * (80 + this.health) / 100);
      this.health = this.health + 80;
      if (this.health > 100) {
        this.health = 100;
      }
    } else {
      throw new Error('Невозможно повысить уровень: персонаж уже умер');
    }
  }
}
