import { Scene } from "phaser";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        this.load.image("sprites", "assets/sprite.png");
    }

    create() {
        this.scene.start("Preloader");
    }
}
