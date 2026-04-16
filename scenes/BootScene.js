export default class BootScene extends Phaser.Scene{
        constructor() {
        super("Boot");
    }

    preload() {

        this.load.tilemapTiledJSON("map1", "decor/mapgame.tmj");
        this.load.tilemapTiledJSON("map2", "decor/map2.tmj");

        this.load.image("tiles", "decor/block1.png");
        this.load.image("collision", "decor/collision.png");

        this.load.spritesheet("player", "decor/Main.png", {
            frameWidth: 80,
            frameHeight: 59
        });

        this.load.image("npc", "decor/king.png");
        this.load.spritesheet("enemy_walk", "decor/crep.png", {
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.image("bg1", "decor/mountain4.png");
        this.load.image("bg2", "decor/mountain3.png");
        this.load.image("bg3", "decor/mountain.png");
        this.load.image("bg4", "decor/main-mountain.png");
    }

    create() {
        this.scene.start("Map1");
    }
}
