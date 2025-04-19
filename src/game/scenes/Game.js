import { Scene } from "phaser";

import { EventBus } from "./../EventBus";

import Player from "./../gameobjects/Player";
import Road from "./../gameobjects/Road";
import LadyBug from "./../gameobjects/LadyBug";

import Background from "./../scenes/Background";

export class Game extends Scene {
    constructor() {
        super("Game");

        this.player;
        this.ground;
        this.clouds;
        this.obstacles;

        this.obstaclesSpawnTimer;

        this.obstacleSpeed = 200;
    }

    create() {

        this.scene.launch('Background', Background)

        this.ground = new Road(this);
        this.player = new Player(this);

        this.obstacles = this.physics.add.group({
            classType: LadyBug,
            runChildUpdate: true,
        });

        this.physics.add.collider(
            this.player,
            this.obstacles,
            this._handlePlayerObstacleCollision,
            null,
            this
        );

        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.obstacles, this.ground);

        this.obstaclesSpawnTimer = this.time.addEvent({
            delay: 2000,
            callback: this._spawnObstacle,
            callbackScope: this,
            loop: true,
        });

        EventBus.emit("current-scene-ready", this);
    }

    update(time, delta) {
        if (this.player.isAlive) {
            this.ground.update();
            this.player.update();
        }
    }

    _spawnObstacle() {
        const ladyBug = this.obstacles.get(0, 0);
        ladyBug && ladyBug.spawn(
            this.scale.height - (this.ground.body.height * 4),
            this.obstacleSpeed
        );
    }

    _handlePlayerObstacleCollision(player, obstacle) {
        if (player.isAlive) {
            player.die();
            this.obstaclesSpawnTimer.remove();
            this.time.delayedCall(1000, () => {
                this.scene.start("GameOver");
            });
        }
    }
}