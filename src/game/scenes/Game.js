import { Scene } from "phaser";

import { EventBus } from "./../EventBus";

import Player from "./../gameobjects/Player";
import Cloud from "./../gameobjects/Cloud";

export class Game extends Scene {
    constructor() {
        super("Game");

        this.player;
        this.ground;
    }

    preload() {
        this.load.image("cloud", "assets/cloud.png");
        this.load.image("road", "assets/road.png");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor("#353946");

        this.ground = this.add.tileSprite(
            this.scale.width / 2,
            this.scale.height - 20,
            this.scale.width,
            20,
            "road"
        );

        this.ground.setScale(1, 1);

        this.ground.setOrigin(0.5, 0.5);

        this.physics.add.existing(this.ground, true);

        this.player = new Player(this);

        this.physics.add.collider(this.player, this.ground);

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

        EventBus.emit("current-scene-ready", this);
    }

    start() {
        this.player.start();
        this.clouds.forEach((cloud) => cloud.update());
    }

    update(time, delta) {
        this.clouds.forEach((cloud) => cloud.update());

        if (this.ground) {
            this.ground.tilePositionX += 2;
        }

        if (this.player) {
            this.player.update();
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}
