import GamePlay from './GamePlay'
import GameState from './GameState'
import GameStateService from './GameStateService'
import themes from './themes'
import {characterGenerator, generateTeam} from './generators'
import Character from './Character';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Magician from './Magician';
import Zombie from './Zombie';
import Daemon from './Daemon';
import Undead from './Undead';
import Team from './Team';
import cursors from './cursors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gameState = new GameState();
    this.gameStateService = new GameStateService(localStorage);
    this.gamePlay.drawUi(themes[this.gameState.level - 1]);
    this.gamePlay.redrawPositions(this.gameState.bothTeams);
    this.gamePlay.addCellEnterListener(e => this.onCellEnter(e));
    this.gamePlay.addCellLeaveListener(e => this.onCellLeave(e));
    this.gamePlay.addCellClickListener(e => this.onCellClick(e));
    this.gamePlay.addNewGameListener(e => this.init(e));
    this.gamePlay.addSaveGameListener(e => this.onSaveGameClick(e));
    this.gamePlay.addLoadGameListener(e => this.onLoadGameClick(e));
  }

  onSaveGameClick() {
    this.gameStateService.save(this.gameState);
  }

  onLoadGameClick() {
    this.gameState = this.gameStateService.load();
    this.gamePlay.redrawPositions(this.gameState.bothTeams);
    console.log(this.gameStateService);
  }

  onCellClick(index) {

    // Выбор персонажа

    let cell = this.gamePlay.cells[index];
    if (cell.firstChild !== null && cell.firstChild.classList.contains('character')) {
      if (cell.firstChild.classList.contains('bowman') || cell.firstChild.classList.contains('swordsman') || cell.firstChild.classList.contains('magician')) {
        if (this.gameState.myTurn) {
            for (let i = 0; i < this.gameState.myTeam.length; i++) {
              if (this.gameState.myTeam[i].position === index) {
                this.gameState.activeCharacter = this.gameState.myTeam[i];
                this.gamePlay.selectCell(index, 'yellow');
              } else {
                this.gamePlay.deselectCell(this.gameState.myTeam[i].position);
              }
            }
        }
      } //else {
        //GamePlay.showError('Этот персонаж не в вашей команде');
      //}
    }

    //Перемещение персонажа

    if (cell.classList.contains('selected-green')) {
      this.gamePlay.deselectCell(this.gameState.activeCharacter.position);
      this.gameState.activeCharacter.position = index;
      this.gamePlay.redrawPositions(this.gameState.bothTeams);
      this.gameState.activeCharacter = null;
      this.gameState.myTurn = false;
    }

    // Атака

      if (cell.classList.contains('selected-red')) {
        let enemy

        for (let i = 0; i < this.gameState.enemyTeam.length; i++) {
          if (this.gameState.enemyTeam[i].position === index) {
            enemy = this.gameState.enemyTeam[i];
          }
        }

        this.attack(this.gameState.activeCharacter, enemy, this.gameState.enemyTeam, index);
        this.gamePlay.deselectCell(this.gameState.activeCharacter.position);
        this.gameState.activeCharacter = null;
        this.gameState.myTurn = false;
      }

      //Ответный ход компьютера: выбор персонажа для атаки и жертвы

      if (!this.gameState.myTurn) {

        let indexOfEnemy = 0;
        let indexOfVictim = 0;
        let minDistance = 1000;

        for (let j = 0; j < this.gameState.myTeam.length; j++) {
          let xMe = this.gameState.myTeam[j].position % 8;
          let yMe = Math.floor(this.gameState.myTeam[j].position / 8);

          for (let i = 0; i < this.gameState.enemyTeam.length; i++) {
            let xEnemy = this.gameState.enemyTeam[i].position % 8;
            let yEnemy = Math.floor(this.gameState.enemyTeam[i].position / 8);
            const distance = Math.abs(xMe - xEnemy) + Math.abs(yMe - yEnemy);

            if (minDistance > distance) {
              minDistance = distance;
              indexOfEnemy = i;
              indexOfVictim = j;
            }
          }
        }

        let attackingEnemy = this.gameState.enemyTeam[indexOfEnemy];
        let victim = this.gameState.myTeam[indexOfVictim];

        //Ответный ход компьютера: выбор стратегии перемещения

        if (GameController.allowCellSelection(attackingEnemy.position, victim.position, attackingEnemy.character.attackDistance)) {
          this.attack(attackingEnemy, victim, this.gameState.myTeam, index);
          this.gameState.myTurn = true;
        } else {
          let destination;
          let shortestWay = 1000;
          let xVictim = victim.position % 8;
          let yVictim = Math.floor(victim.position / 8);

          for (let i = 0; i < 64; i++) {
            if (GameController.allowCellSelection(attackingEnemy.position, i, attackingEnemy.character.movementDistance) && i !== victim.position) {
              let xCell = i % 8;
              let yCell = Math.floor(i / 8);
              const distance = Math.abs(xCell - xVictim) + Math.abs(yCell - yVictim);

              if (shortestWay > distance) {
                shortestWay = distance;
                destination = i;
              }
            }
          }

          attackingEnemy.position = destination;
          this.gamePlay.redrawPositions(this.gameState.bothTeams);;
          this.gameState.myTurn = true;
        }

      }
  }

  onCellEnter(index) {
    let cell = this.gamePlay.cells[index];

    this.gamePlay.setCursor(cursors.notallowed);

    if (cell.firstChild !== null && cell.firstChild.classList.contains('character')) {
      this.gamePlay.setCursor(cursors.pointer);
      for (let i = 0; i < this.gameState.bothTeams.length; i++) {
        if (this.gameState.bothTeams[i].position === index) {
          const character = this.gameState.bothTeams[i].character;
          let message = `\u{1F396}${character.level}\u{2694}${character.attack}\u{1F6E1}${character.defence}\u{2764}${character.health}`;
          this.gamePlay.showCellTooltip(message, index);
          break;
        }
      }
    }

      if (this.gameState.activeCharacter !== null) {
        if (cell.firstChild !== null && (cell.firstChild.classList.contains('zombie') || cell.firstChild.classList.contains('undead') || cell.firstChild.classList.contains('daemon'))) {
          this.gamePlay.setCursor(cursors.notallowed);
          if (GameController.allowCellSelection(this.gameState.activeCharacter.position, index, this.gameState.activeCharacter.character.attackDistance)) {
                this.gamePlay.selectCell(index, 'red');
                this.gamePlay.setCursor(cursors.crosshair);
        }
      } else if (cell.firstChild === null) {
        if (GameController.allowCellSelection(this.gameState.activeCharacter.position, index, this.gameState.activeCharacter.character.movementDistance)) {
                  this.gamePlay.selectCell(index, 'green');
                  this.gamePlay.setCursor(cursors.pointer);
              }
            }
      }
}

  onCellLeave(index) {
    let cell = this.gamePlay.cells[index];
    if (cell.firstChild === null) {
      this.gamePlay.hideCellTooltip(index);
    }
    if (cell.classList.contains('selected-green') || cell.classList.contains('selected-red')) {
      this.gamePlay.deselectCell(index);
    }
  }

  static allowCellSelection(charPosition, cellIndex, radius) {
    let xChar = charPosition % 8;
    let yChar = Math.floor(charPosition / 8);
    let xCell = cellIndex % 8;
    let yCell = Math.floor(cellIndex / 8);

    if (Math.abs(xCell - xChar) <= radius && yCell === yChar) {
      return true;
    } else if (Math.abs(yCell - yChar) <= radius && xCell === xChar) {
      return true;
    } else if (Math.abs(xCell - xChar) === Math.abs(yCell - yChar)) {
      if (Math.abs(xCell - xChar) <= radius)
      return true;
    }
    return false;
  }

  attack(assaulter, victim, oppositeTeam, index) {
    const damage = Math.max(assaulter.character.attack - victim.character.defence, assaulter.character.attack * 0.1);
    victim.character.health -= damage;
    this.gamePlay.redrawPositions(this.gameState.bothTeams);
    const responsePromise = this.gamePlay.showDamage(index, damage);
    Promise.resolve(responsePromise);
    if (victim.character.health <= 0) {
      let i = oppositeTeam.indexOf(victim);
      oppositeTeam.splice(i, 1);
      this.gameState.bothTeams = this.gameState.myTeam.concat(this.gameState.enemyTeam);
      this.gamePlay.redrawPositions(this.gameState.bothTeams);
      if (this.gameState.myTeam.length === 0) {
        GamePlay.showMessage('Вы проиграли! Игра окончена. Вы набрали ' + this.gameState.myScores + ' очков');
      }
      if (this.gameState.enemyTeam.length === 0) {
        if (this.gameState.level < 4) {
            this.nextLevel();
        } else {
          GamePlay.showMessage('Вы выиграли! Игра окончена. Вы набрали ' + this.gameState.myScores + ' очков');
          this.lockField();
        }
      }
    }
  }

nextLevel() {
    for (let i = 0; i < this.gameState.myTeam.length; i++) {
      this.gameState.myScores = this.gameState.myScores + this.gameState.myTeam[i].character.health;
      this.gameState.myTeam[i].character.levelUp();
    }
      this.gameState.level += 1;
      this.gamePlay.drawUi(themes[this.gameState.level - 1]);
      let newMembers
      if (this.gameState.level === 2) {
        newMembers = generateTeam(this.gameState.myAllowedTypes, 1, 1);
      } else {
        newMembers = generateTeam(this.gameState.myAllowedTypes, this.gameState.level - 1, 2);
      }
      this.gameState.myTeam = this.gameState.myTeam.concat(newMembers);
      this.gameState.enemyTeam = generateTeam(this.gameState.enemyAllowedTypes, this.gameState.level, this.gameState.myTeam.length);
      this.gameState.bothTeams = this.gameState.myTeam.concat(this.gameState.enemyTeam);
      this.gamePlay.redrawPositions(this.gameState.bothTeams);
      this.gameState.myTurn;
  }

  lockField() {
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
    this.gamePlay.setCursor(cursors.notallowed);
  }
}
