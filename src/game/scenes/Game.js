import { Scene } from "phaser";

import { EventBus } from "./../EventBus";

import Player from "./../gameobjects/Player";
import Cloud from "./../gameobjects/Cloud";
import Road from "./../gameobjects/Road";
import LadyBug from "./../gameobjects/LadyBug";

export class Game extends Scene {
    constructor() {
        super("Game");

        this.player;
        this.ground;
        this.clouds;
        this.obstacles;
        this.obstacleSpeed;
        this.spawnTimer;

        this.obstacleSpeed = 200;
    }

    preload() {
    }

    create() {

        this.ground = new Road(this);
        this.player = new Player(this);

        this.obstacles = this.physics.add.group({
            classType: LadyBug,
            runChildUpdate: true,
        });

        this.physics.add.collider(
            this.player,
            this.obstacles,
            this.handlePlayerObstacleCollision,
            null,
            this
        );

        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.obstacles, this.ground);

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

        this.spawnTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true,
        });

        EventBus.emit("current-scene-ready", this);
    }

    spawnObstacle() {
        const ladyBug = this.obstacles.get(0, 0);
        ladyBug && ladyBug.spawn(
            this.scale.height - (this.ground.body.height * 4),
            this.obstacleSpeed
        );
    }

    handlePlayerObstacleCollision(player, obstacle) {
        if (player.isAlive) {
            player.die();
            this.obstacleSpeed = 0;
            this.spawnTimer.remove();
            this.physics.pause();

            this.time.delayedCall(1000, () => {
                this.changeScene();
            });
        }
    }

    start() {
        this.player.start();

        this.obstacleSpeed = 200;

        if (this.spawnTimer) {
            this.spawnTimer.paused = false;
         } else {
             this.spawnTimer = this.time.addEvent({
                delay: 2000,
                callback: this.spawnObstacle,
                callbackScope: this,
                loop: true,
            });
        }
        this.physics.resume();
    }

    update(time, delta) {
        if (this.player.isAlive) {
            this.ground.update();
            this.player.update();
            this.clouds.forEach((cloud) => cloud.update());
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}