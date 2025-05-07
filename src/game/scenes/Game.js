import { Scene } from "phaser";

import { EventBus } from "./../EventBus";

import Player from "./../gameobjects/Player";
import Cloud from "./../gameobjects/Cloud";

export class Game extends Scene {
    constructor() {
        super("Game");

        this.player;
        this.ground;
        this.road;
    }

    preload() {
        this.load.image("cloud", "assets/cloud.png");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor("#353946");

        this.road = this.add.tileSprite(
            this.scale.width / 2,
            this.scale.height - 40,
            this.scale.width,
            11,
            "road"
        );
        this.road.setOrigin(0.5, 0);
        this.road.setDepth(1);

        this.ground = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height - 20,
            this.scale.width,
            40,
            0x353946
        );
        this.physics.add.existing(this.ground, true);

        this.player = new Player(this);
        this.player.setOrigin(0.5, 0);
        this.player.setDepth(9);

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

        this.ladybugs = [];
        this.moths = [];
        this.beetles = [];
        this.cockroaches = [];
        this.spawnLadybug();
        this.time.delayedCall(Phaser.Math.Between(1500, 3500), () => {
            this.spawnMoth();
        });
        this.time.delayedCall(Phaser.Math.Between(2000, 4000), () => {
            this.spawnBeetle();
        });
        this.time.delayedCall(Phaser.Math.Between(2500, 4500), () => {
            this.spawnCockroach();
        });

        this.score = 0;
        this.lives = 10;
        this.scoreText = this.add.text(this.scale.width - 40, 20, this.formatScore(0), {
            fontFamily: 'Arial',
            fontSize: 35,
            color: '#fff',
            align: 'right',
        }).setOrigin(1, 0);
        this.livesText = this.add.text(40, 20, this.lives.toString(), {
            fontFamily: 'Arial',
            fontSize: 35,
            color: '#fff',
            align: 'left',
        }).setOrigin(0, 0);

        EventBus.emit("current-scene-ready", this);
    }

    start() {
        this.player.start();
        this.clouds.forEach((cloud) => cloud.update());
    }

    update(time, delta) {
        this.clouds.forEach((cloud) => cloud.update());

        if (this.road) {
            this.road.tilePositionX += 4;
        }

        if (this.player) {
            this.player.update();
        }

        // Atualiza e move as ladybugs
        this.ladybugs.forEach((ladybug, idx) => {
            ladybug.x -= 4;
            if (ladybug.x < this.player.x - 32 && !ladybug.passed && !ladybug.hitPlayer) {
                this.incrementScore();
                ladybug.passed = true;
            }
            if (ladybug.x < -ladybug.width) {
                ladybug.destroy();
                this.ladybugs.splice(idx, 1);
                this.time.delayedCall(Phaser.Math.Between(1000, 3000), () => {
                    this.spawnLadybug();
                });
            }
        });

        // Atualiza e move as moths
        this.moths.forEach((moth, idx) => {
            moth.x -= 4;
            if (moth.x < this.player.x - 32 && !moth.passed && !moth.hitPlayer) {
                this.incrementScore();
                moth.passed = true;
            }
            if (moth.x < -moth.width) {
                moth.destroy();
                this.moths.splice(idx, 1);
                this.time.delayedCall(Phaser.Math.Between(1500, 3500), () => {
                    this.spawnMoth();
                });
            }
        });

        // Atualiza e move os beetles
        this.beetles.forEach((beetle, idx) => {
            beetle.x -= 4;
            if (beetle.x < this.player.x - 32 && !beetle.passed && !beetle.hitPlayer) {
                this.incrementScore();
                beetle.passed = true;
            }
            if (beetle.x < -beetle.width) {
                beetle.destroy();
                this.beetles.splice(idx, 1);
                this.time.delayedCall(Phaser.Math.Between(2000, 4000), () => {
                    this.spawnBeetle();
                });
            }
        });

        // Atualiza e move as cockroaches
        this.cockroaches.forEach((cockroach, idx) => {
            cockroach.x -= 4;
            if (cockroach.x < this.player.x - 32 && !cockroach.passed && !cockroach.hitPlayer) {
                this.incrementScore();
                cockroach.passed = true;
            }
            if (cockroach.x < -cockroach.width) {
                cockroach.destroy();
                this.cockroaches.splice(idx, 1);
                this.time.delayedCall(Phaser.Math.Between(2500, 4500), () => {
                    this.spawnCockroach();
                });
            }
        });

        // Atualiza o texto da pontuação
        this.scoreText.setText(this.formatScore(this.score));
        this.livesText.setText(this.lives.toString());
    }

    changeScene() {
        this.scene.start("GameOver");
    }

    // Função utilitária para checar distância mínima entre bugs
    isFarFromOtherBugs(x, y) {
        const allBugs = [
            ...this.ladybugs,
            ...this.moths,
            ...this.beetles,
            ...this.cockroaches
        ];
        return allBugs.every(bug => Phaser.Math.Distance.Between(x, y, bug.x, bug.y) >= 200);
    }

    spawnLadybug() {
        const x = this.scale.width + 32;
        const y = this.scale.height - 40 - 16;
        if (!this.isFarFromOtherBugs(x, y)) {
            this.time.delayedCall(500, () => this.spawnLadybug());
            return;
        }
        const ladybug = this.add.sprite(x, y, "ladybug");
        ladybug.setOrigin(0.5, 0.5);
        ladybug.setDepth(2);
        this.ladybugs.push(ladybug);
    }

    spawnMoth() {
        const x = this.scale.width + 32;
        // Altura fixa para a moth
        const y = this.scale.height - 40 - 32 - 60; // valor fixo acima do chão, 10px mais alto que antes
        if (!this.isFarFromOtherBugs(x, y)) {
            this.time.delayedCall(500, () => this.spawnMoth());
            return;
        }
        const moth = this.add.sprite(x, y, "moth-1");
        moth.setOrigin(0.5, 0.5);
        moth.setDepth(2);
        if (!this.anims.exists("moth-fly")) {
            this.anims.create({
                key: "moth-fly",
                frames: [
                    { key: "moth-1" },
                    { key: "moth-2" }
                ],
                frameRate: 6,
                repeat: -1
            });
        }
        moth.play("moth-fly");
        this.moths.push(moth);
    }

    spawnBeetle() {
        const x = this.scale.width + 32;
        const y = this.scale.height - 40 - 16;
        if (!this.isFarFromOtherBugs(x, y)) {
            this.time.delayedCall(500, () => this.spawnBeetle());
            return;
        }
        const beetle = this.add.sprite(x, y, "beetle");
        beetle.setOrigin(0.5, 0.5);
        beetle.setDepth(2);
        this.beetles.push(beetle);
    }

    spawnCockroach() {
        const x = this.scale.width + 32;
        const y = this.scale.height - 40 - 16;
        if (!this.isFarFromOtherBugs(x, y)) {
            this.time.delayedCall(500, () => this.spawnCockroach());
            return;
        }
        const cockroach = this.add.sprite(x, y, "cockroach");
        cockroach.setOrigin(0.5, 0.5);
        cockroach.setDepth(2);
        this.cockroaches.push(cockroach);
    }

    incrementScore() {
        this.score += 1;
    }

    formatScore(score) {
        return score.toString().padStart(4, '0');
    }
}
