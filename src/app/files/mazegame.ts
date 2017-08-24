/**
 * Created by jason on 8/20/2017.
 */
export class MazeGame extends Phaser.State {

  game: Phaser.Game;
  map: Phaser.Tilemap;
  background: Phaser.TilemapLayer;
  foreground: Phaser.TilemapLayer;
  blocked: Phaser.TilemapLayer;
  player: Phaser.Sprite;
  cursors: Phaser.CursorKeys;
  weapon: Phaser.Weapon;
  fire: Phaser.Key;
  enemies: Phaser.Group;
  livingEnemies = [];
  enemyBullets: Phaser.Group;
  enemyBulletTime = 0;
  facing = [false, false, false, false];//up, down, left, right

  constructor() {
    super();
  }

  preload() {
    this.game.height = 810;
    this.game.load.tilemap('realmap', '../../assets/tiles/realmap.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('grass', '../../assets/images/grassland.png');
    //this.game.load.image('player', '../../assets/images/player.png');
    this.game.load.spritesheet('mage', '../../assets/images/mage_f.png', 32, 36, 12);
    this.game.load.image('ninja', '../../assets/images/player.png'); //, 32, 36, 12);
    //this.game.load.image('missile', '../../assets/images/missile.png');
    this.game.load.image('fireball', '../../assets/images/fireball.png');
    this.game.load.image('blueball', '../../assets/images/blueball.png');

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
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.player.animations.add('left', [9, 10, 11], 10, true);
    this.player.animations.add('right', [3, 4, 5], 10, true);
    this.player.animations.add('up', [0, 1, 2], 10, true);
    this.player.animations.add('down', [6, 7, 8], 10, true);


    this.enemies = this.add.group();
    this.enemies.enableBody = true;
    this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
    this.createEnemies(4);

    this.weapon = this.game.add.weapon(15, 'fireball');
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.bulletSpeed = 300;
    this.weapon.fireRate = 400;
    this.weapon.bulletAngleOffset = 90;
    this.weapon.trackSprite(this.player, 32, 16, false);
    //this.weapon.onFire.add(function () { this.fireSfx.play(); }, this);
    this.weapon.bullets.forEach((b) => {
      b.scale.setTo(.05, .05);
      b.body.updateBounds()
    }, this);

    this.fire = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    this.game.camera.follow(this.player);

  }

  update() {

    this.game.physics.arcade.collide(this.player, this.blocked);
    this.game.physics.arcade.collide(this.weapon.bullets, this.blocked, (w, b) => {
      w.kill();
    }, null, this);
    this.game.physics.arcade.overlap(this.weapon.bullets, this.enemies, (b, e) => {
      b.kill();
      e.kill();//change player health, and sfx
    }, null, this);

    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if (this.cursors.up.isDown || this.cursors.down.isDown || this.cursors.left.isDown || this.cursors.right.isDown) {
      if (this.cursors.up.isDown) {
        if (this.cursors.left.isDown) {
          this.player.body.velocity.y -= 75;
          this.player.body.velocity.x -= 75;
          this.player.animations.play('up');
          this.facing[0] = true;
          this.facing[1] = false;
          this.facing[2] = true;
          this.facing[3] = false;
        } else if (this.cursors.right.isDown) {
          this.player.body.velocity.y -= 75;
          this.player.body.velocity.x += 75;
          this.player.animations.play('up');
          this.facing[0] = true;
          this.facing[1] = false;
          this.facing[2] = false;
          this.facing[3] = true;
        } else {
          this.player.body.velocity.y -= 150;
          this.player.animations.play('up');
          this.facing[0] = true;
          this.facing[1] = false;
          this.facing[2] = false;
          this.facing[3] = false;
        }
      }
      else if (this.cursors.down.isDown) {
        if (this.cursors.left.isDown) {
          this.player.body.velocity.y += 75;
          this.player.body.velocity.x -= 75;
          this.player.animations.play('down');
          this.facing[0] = false;
          this.facing[1] = true;
          this.facing[2] = true;
          this.facing[3] = false;
        } else if (this.cursors.right.isDown) {
          this.player.body.velocity.y += 75;
          this.player.body.velocity.x += 75;
          this.player.animations.play('down');
          this.facing[0] = false;
          this.facing[1] = true;
          this.facing[2] = false;
          this.facing[3] = true;
        } else {
          this.player.body.velocity.y += 150;
          this.player.animations.play('down');
          this.facing[0] = false;
          this.facing[1] = true;
          this.facing[2] = false;
          this.facing[3] = false;
        }
      } else {
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
        if (this.facing[2]) {//up left
          this.weapon.fireAngle = Phaser.ANGLE_NORTH_WEST;
          this.weapon.trackSprite(this.player, -16, -24, false);
          this.weapon.bulletAngleOffset = 0;
        } else if (this.facing[3]) {// up right
          this.weapon.fireAngle = Phaser.ANGLE_NORTH_EAST;
          this.weapon.trackSprite(this.player, 48, -24, false);
          this.weapon.bulletAngleOffset = 0;
        } else {//up
          this.weapon.fireAngle = Phaser.ANGLE_UP;
          this.weapon.trackSprite(this.player, 16, -36, false);
          this.weapon.bulletAngleOffset = 0;
        }
      } else if (this.facing[1]) {//down
        if (this.facing [2]) {//down left
          this.weapon.fireAngle = Phaser.ANGLE_SOUTH_WEST;
          this.weapon.trackSprite(this.player, -16, 48, false);
          this.weapon.bulletAngleOffset = 0;
        } else if (this.facing [3]) {//down right
          this.weapon.fireAngle = Phaser.ANGLE_SOUTH_EAST;
          this.weapon.trackSprite(this.player, 48, 48, false);
          this.weapon.bulletAngleOffset = 0;
        } else {//down
          this.weapon.fireAngle = Phaser.ANGLE_DOWN;
          this.weapon.trackSprite(this.player, 16, 48, false);
          this.weapon.bulletAngleOffset = 0;
        }
      } else {
        if (this.facing[2]) {//left
          this.weapon.fireAngle = Phaser.ANGLE_LEFT;
          this.weapon.trackSprite(this.player, -24, 24, false);
          this.weapon.bulletAngleOffset = 0;
        } else if (this.facing[3]) {//right
          this.weapon.fireAngle = Phaser.ANGLE_RIGHT;
          this.weapon.trackSprite(this.player, 56, 24, false);
          this.weapon.bulletAngleOffset = 0;
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

  createEnemies(count: number) {
    for (var y = 0; y < count; y++) {
      for (var x = 0; x < 6; x++) {
        let enemy = this.enemies.create(x * 58, y * 60, 'ninja');
        enemy.anchor.setTo(0.5, 0.5);
        enemy.scale.setTo(2, 2);
        enemy.body.moves = false;
      }
    }
    this.enemies.x = 100;
    this.enemies.y = 50;

    //  moving the group, rather than individually.
    var tween = this.add.tween(this.enemies).to({x: this.game.world.width - 400}, 7000, Phaser.Easing.Linear.None, true, 0, 10000, true);
    tween.onRepeat.add(() => {
      this.enemies.y += 10
    }, this);
  }

  fireEnemyBullet() {
    this.livingEnemies.length = 0;
    this.enemies.forEachAlive((enemy) => {
      this.livingEnemies.push(enemy)
    }, this);

    if (this.time.now > this.enemyBulletTime) {
      let enemyBullet = this.enemyBullets.getFirstExists(false);
      if (enemyBullet && this.livingEnemies.length > 0) {
        //enemyShotSound.play();
        let random = this.rnd.integerInRange(0, this.livingEnemies.length - 1);
        let shooter = this.livingEnemies[random];
        enemyBullet.reset(shooter.body.x, shooter.body.y + 30);
        this.enemyBulletTime = this.time.now + 500;
        this.physics.arcade.moveToObject(enemyBullet, this.player, 600);
      }
    }
  }
}
