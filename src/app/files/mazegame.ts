/**
 * Created by jason on 8/20/2017.
 */
/**
 * Created by jason on 8/17/2017.
 */
export class mazegame {

  game: Phaser.Game;
  map: Phaser.Tilemap;
  background: Phaser.TilemapLayer;
  foreground: Phaser.TilemapLayer;
  blocked: Phaser.TilemapLayer;
  player: Phaser.Sprite;
  cursors: Phaser.CursorKeys;
  weapon: Phaser.Weapon;
  fire: Phaser.Key;
  facing = [false, false, false, false];//up, down, left, right

  constructor() {
    this.game = new Phaser.Game(632, 600, Phaser.AUTO, 'content', this);
  }

  preload() {
    this.game.load.tilemap('realmap', '../../assets/tiles/realmap.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('grass', '../../assets/images/grassland.png');
    //this.game.load.image('player', '../../assets/images/player.png');
    this.game.load.spritesheet('mage', '../../assets/images/mage_f.png', 32, 36, 12);
    this.game.load.image('missile', '../../assets/images/missile.png');
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  }

  create() {
    this.map = this.game.add.tilemap('realmap');
    this.map.addTilesetImage('grassland', 'grass');

    this.background = this.map.createLayer('backgroundlayer');
    this.blocked = this.map.createLayer('blockedlayer');
    this.foreground = this.map.createLayer('foregroundlayer');
    this.background.resizeWorld();

    // this.foreground.debug = true;
    this.player = this.game.add.sprite(175, 175, 'mage');
    this.player.frame = 3;
    this.foreground.bringToTop();
    this.map.setCollisionBetween(1, 10000, true, this.blocked);
    this.game.physics.enable(this.player);
    this.player.body.collideWorldBounds = true;
    this.game.camera.follow(this.player);
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.player.animations.add('left', [9, 10, 11], 10, true);
    this.player.animations.add('right', [3, 4, 5], 10, true);
    this.player.animations.add('up', [0, 1, 2], 10, true);
    this.player.animations.add('down', [6, 7, 8], 10, true);



    this.weapon = this.game.add.weapon(15, 'missile');
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.bulletSpeed = 300;
    this.weapon.fireRate = 400;
    this.weapon.bulletAngleOffset = 90;
    this.weapon.trackSprite(this.player, 32, 16, false);
    //this.weapon.onFire.add(function () { this.fireSfx.play(); }, this);

    this.fire = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

  }

  update(){

    this.game.physics.arcade.collide(this.player, this.blocked);

    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if(this.cursors.up.isDown || this.cursors.down.isDown || this.cursors.left.isDown || this.cursors.right.isDown) {
      if (this.cursors.up.isDown) {
        if(this.cursors.left.isDown){
            this.player.body.velocity.y -= 75;
            this.player.body.velocity.x -= 75;
            this.player.animations.play('up');
            this.facing[0] = true;
            this.facing[1] = false;
            this.facing[2] = true;
            this.facing[3] = false;
        }else if (this.cursors.right.isDown){
          this.player.body.velocity.y -= 75;
          this.player.body.velocity.x += 75;
            this.player.animations.play('up');
            this.facing[0] = true;
            this.facing[1] = false;
            this.facing[2] = false;
            this.facing[3] = true;
        }else{
            this.player.body.velocity.y -= 150;
            this.player.animations.play('up');
            this.facing[0] = true;
            this.facing[1] = false;
            this.facing[2] = false;
            this.facing[3] = false;
        }
      }
      else if (this.cursors.down.isDown) {
        if(this.cursors.left.isDown){
          this.player.body.velocity.y += 75;
          this.player.body.velocity.x -= 75;
          this.player.animations.play('down');
          this.facing[0] = false;
          this.facing[1] = true;
          this.facing[2] = true;
          this.facing[3] = false;
        }else if (this.cursors.right.isDown){
          this.player.body.velocity.y += 75;
          this.player.body.velocity.x += 75;
          this.player.animations.play('down');
          this.facing[0] = false;
          this.facing[1] = true;
          this.facing[2] = false;
          this.facing[3] = true;
        }else {
          this.player.body.velocity.y += 150;
          this.player.animations.play('down');
          this.facing[0] = false;
          this.facing[1] = true;
          this.facing[2] = false;
          this.facing[3] = false;
        }
      }else{
        if (this.cursors.left.isDown) {
          this.player.body.velocity.x -= 150;
          this.player.animations.play('left');
          this.facing[0] = false;
          this.facing[1] = false;
          this.facing[2] = true;
          this.facing[3] = false;
        }
        else if (this.cursors.right.isDown) {
          this.player.body.velocity.x += 150;
          this.player.animations.play('right');
          this.facing[0] = false;
          this.facing[1] = false;
          this.facing[2] = false;
          this.facing[3] = true;
        }
      }
    }

      if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
        this.player.animations.stop();
      }

      if (this.fire.isDown) {
        //U,D,L,R
        if (this.facing[0]) {//up
          if(this.facing[2]){//up left
            this.weapon.fireAngle = Phaser.ANGLE_NORTH_WEST;
            this.weapon.trackSprite(this.player, 16, 0, false);
            this.weapon.bulletAngleOffset = 90;
        } else if (this.facing[3]) {// up right
            this.weapon.fireAngle = Phaser.ANGLE_NORTH_EAST;
            this.weapon.trackSprite(this.player, 16, 0, false);
            this.weapon.bulletAngleOffset = 90;
        } else {//up
            this.weapon.fireAngle = Phaser.ANGLE_UP;
            this.weapon.trackSprite(this.player, 16, 0, false);
            this.weapon.bulletAngleOffset = 90;
        }
      }else if(this.facing[1]){//down
        if (this.facing [2]) {//down left
            this.weapon.fireAngle = Phaser.ANGLE_SOUTH_WEST;
            this.weapon.trackSprite(this.player, 16, 48, false);
            this.weapon.bulletAngleOffset = 90;
          } else if (this.facing [3]) {//down right
            this.weapon.fireAngle = Phaser.ANGLE_SOUTH_EAST;
            this.weapon.trackSprite(this.player, 16, 48, false);
            this.weapon.bulletAngleOffset = 90;
          } else {//down
            this.weapon.fireAngle = Phaser.ANGLE_DOWN;
            this.weapon.trackSprite(this.player, 16, 48, false);
            this.weapon.bulletAngleOffset = 90;
          }
        }else{
          if (this.facing[2]) {//left
            this.weapon.fireAngle = Phaser.ANGLE_LEFT;
            this.weapon.trackSprite(this.player, -8, 16, false);
            this.weapon.bulletAngleOffset = 90;
          } else if (this.facing[3]) {//right
            this.weapon.fireAngle = Phaser.ANGLE_RIGHT;
            this.weapon.trackSprite(this.player, 32, 16, false);
            this.weapon.bulletAngleOffset = 90;
          }
        }




        //this.weapon.fire(null, 1000, this.player.y);
        this.weapon.fire();
      }

  }

  render() {

    //  Useful debug things you can turn on to see what's happening

    // game.debug.spriteBounds(sprite);
    // game.debug.cameraInfo(game.camera, 32, 32);
    // game.debug.body(sprite);
    //this.game.debug.bodyInfo(this.player, 32, 32);

  }
}
