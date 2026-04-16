import BaseMap from "./Basemap.js";

export default class Map1 extends BaseMap {
   constructor() {
        super("Map1");
    }

    create() {
        this.createMap("map1", 50, 485);
        this.createNPC();
        this.createEnemies();
    }

    update() {

        this.updatePlayer();
        if(this.enemies){
            this.updateEnemies();
        }

        if (!this.isChangingScene && this.player.x > this.map.widthInPixels - 100) {
            this.isChangingScene = true;
            this.scene.start("Map2");
        }
           this.player.setDepth(this.player.y);
        if(this.npc){
            this.npc.setDepth(this.npc.y);
        }
    if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
    this.attack();
    }
    }

}
