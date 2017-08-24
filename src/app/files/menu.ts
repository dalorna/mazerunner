/**
 * Created by jason on 8/22/2017.
 */
export class Menu extends Phaser.State {

  game: Phaser.Game;
  constructor(){
    super();
  }

  // the map itself
  map: Phaser.Image;
  // a couple of variables used to save start touch position
  startX: number;
  startY: number;
  // dummy variable to handle multitouch, if any
  moveIndex: any;
  // map scrolling speed. The higher the number, the fastest
  // the scrolling. Leaving it at 1, it's like you are dragging the map
  mapSpeed: number = 1;
  // group where map and town are placed
  mapGroup: Phaser.Group;
  // the town you are about to select
  candidateTown: any;
  saveX: number;
  saveY: number;

  preload() {
    this.game.load.image("map", "../../assets/images/map.png");
    this.game.load.image("town", "../../assets/images/town.png");
  }
  create() {
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.startFullScreen();

    this.mapGroup = this.game.add.group();
    this.map = this.game.add.image(0, 0, "map");
    this.mapGroup.add(this.map);

    for(var i = 0;i < 10; i++){
      var town = this.game.add.image(this.game.rnd.between(50, this.map.width - 50), this.game.rnd.between(50, this.map.height - 50), "town");
      town.anchor.setTo(0.5);
      // each town is enabled for input and has its own up and down listeners
      town.inputEnabled = true;
      town.events.onInputDown.add((s, p) => {
        this.candidateTown = s;
      }, this);
      town.events.onInputUp.add((s, p) => {
        if(this.candidateTown == s){
          this.game.state.start('GamePlay');
        }
      }, this);
      this.mapGroup.add(town);
    }

    // centering the map
    this.mapGroup.x = (this.game.width - this.map.width) / 2;
    this.mapGroup.y = (this.game.height - this.map.height) / 2;

    // listener for the touch
    this.game.input.onDown.add(this.fingerOnMap, this);
  }
  fingerOnMap(){
    // saving touch start position
    this.startX = this.game.input.worldX;
    this.startY = this.game.input.worldY;
    this.saveX = this.mapGroup.x;
    this.saveY = this.mapGroup.y;
    // updating listeners
    this.game.input.onDown.remove(this.fingerOnMap, this);
    this.game.input.onUp.add(this.stopMap, this);
    this.moveIndex = this.game.input.addMoveCallback(this.dragMap, this)
  }
  dragMap() {
    var currentX = this.game.input.worldX;
    var currentY = this.game.input.worldY;
    var deltaX = this.startX - currentX;
    var deltaY = this.startY - currentY;
    if(deltaX * deltaX + deltaY * deltaY > 25){
      this.candidateTown = null;
    }
    this.mapGroup.x = this.saveX - deltaX * this.mapSpeed;
    this.mapGroup.y = this.saveY - deltaY * this.mapSpeed;
    // this is to limit map movement and always have the
    // stage fully covered by the map
    if(this.mapGroup.x < - this.map.width + this.game.width){
      this.mapGroup.x = - this.map.width + this.game.width;
    }
    if(this.mapGroup.x > 0){
      this.mapGroup.x = 0;
    }
    if(this.mapGroup.y < - this.map.height + this.game.height){
      this.mapGroup.y = - this.map.height + this.game.height;
    }
    if(this.mapGroup.y > 0){
      this.mapGroup.y = 0;
    }
  }
  stopMap(){
    this.game.input.onDown.add(this.fingerOnMap, this);
    this.game.input.onUp.remove(this.stopMap, this);
    this.game.input.deleteMoveCallback(this.dragMap, this);
  }
}
