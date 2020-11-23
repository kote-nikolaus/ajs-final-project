import {characterGenerator, generateTeam} from './generators'
import Character from './Character';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Magician from './Magician';
import Zombie from './Zombie';
import Daemon from './Daemon';
import Undead from './Undead';
import Team from './Team';
import GamePlay from './GamePlay'

export default class GameState {
  constructor() {
    this.level = 1;
    this.myScores = 0;
    this.myTurn = true;
    this.activeCharacter = null;
    this.myAllowedTypes = [Bowman, Swordsman, Magician];
    this.enemyAllowedTypes = [Zombie, Daemon, Undead];
    this.myTeam = generateTeam(this.myAllowedTypes, this.level, 2);
    this.enemyTeam = generateTeam(this.enemyAllowedTypes, this.level, 2);
    this.bothTeams = this.myTeam.concat(this.enemyTeam)
  }
  static from(object) {
    // TODO: create object
    return null;
  }
}
