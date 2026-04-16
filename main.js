import BootScene from "./scenes/BootScene.js"
import Map1 from "./scenes/Map1.js";
import Map2 from "./scenes/Map2.js";

const config = {
    type: Phaser.AUTO,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: window.innerWidth,
        height: window.innerHeight
    },
    scene: [BootScene, Map1, Map2],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 600 },
            debug: true
        }
    }
};
new Phaser.Game(config);