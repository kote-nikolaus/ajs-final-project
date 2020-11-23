import Character from './Character';

export default class Zombie extends Character {
  constructor(level) {
    super(level);
    this.type = 'zombie';
    this.attack = 40;
    this.defence = 10;
    this.movementDistance = 2;
    this.attackDistance = 2;
  }
}
