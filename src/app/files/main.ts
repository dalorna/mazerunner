/**
 * Created by jason on 8/22/2017.
 */

import {Menu} from "./menu";
import { MazeGame } from './mazegame'

export class Main{
  game: Phaser.Game;

  constructor(){
    //this.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'content');
    this.game = new Phaser.Game(1240, 700, Phaser.AUTO, 'content');
    this.game.state.add('Menu', Menu, false);
    this.game.state.add('GamePlay', MazeGame, false);
    this.game.state.start('Menu', true, true);
  }
}
