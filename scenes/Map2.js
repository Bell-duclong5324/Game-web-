import BaseMap from "./Basemap.js";

export default class Map2 extends BaseMap {
     constructor() {
        super("Map2");
    }

    create() {
        this.createMap("map2", 100, 485);
    }

    update() {
        this.updatePlayer();
    }
}




