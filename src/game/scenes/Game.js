import { Scene } from "phaser";

import { EventBus } from "./../EventBus";

import Player from "./../gameobjects/Player";
import Cloud from "./../gameobjects/Cloud";
import Road from "./../gameobjects/Road";

export class Game extends Scene {
    constructor() {
        super("Game");

        this.player;
        this.road;
        this.clouds;
    }

    preload() {
    }

    create() {

        this.road = new Road(this);
        this.player = new Player(this);

        this.physics.add.collider(this.player, this.road);

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
    }

    update() {
        this.road && this.road.update();
        this.player && this.player.update();
        this.clouds.forEach((cloud) => cloud.update());
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}