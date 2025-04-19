import { Scene } from "phaser";

import Cloud from "./../gameobjects/Cloud";

export class Background extends Scene {
    constructor() {
        super("Background");
        this.clouds;
    }

    create() {

        this.clouds = [];
        for (let i = 0; i < 5; i++) {
            const cloud = new Cloud(
                this,
                Phaser.Math.Between(100, this.scale.width),
                Phaser.Math.Between(50, this.scale.height / 3),
                "cloud"
            );
            this.clouds.push(cloud);
        }
    }

    update(time, delta) {
        this.clouds.forEach((cloud) => cloud.update());
    }
}