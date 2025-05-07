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
        this.gameSpeed = 1; // Velocidade inicial do jogo
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
        this.time.delayedCall(Phaser.Math.Between(1500, 3500) / this.gameSpeed, () => {
            this.spawnMoth();
        });
        this.time.delayedCall(Phaser.Math.Between(2000, 4000) / this.gameSpeed, () => {
            this.spawnBeetle();
        });
        this.time.delayedCall(Phaser.Math.Between(2500, 4500) / this.gameSpeed, () => {
            this.spawnCockroach();
        });

        this.ducks = [];
        this.lastDuckScore = 0;

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
        
        // Adiciona texto para a velocidade atual
        this.speedText = this.add.text(this.scale.width - 40, 60, `Vel: 1.00x`, {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#fff',
            align: 'right',
        }).setOrigin(1, 0);

        EventBus.emit("current-scene-ready", this);
    }

    start() {
        this.player.start();
        this.clouds.forEach((cloud) => cloud.update());
    }

    update(time, delta) {
        this.clouds.forEach((cloud) => cloud.update());

        if (this.road) {
            this.road.tilePositionX += 4 * this.gameSpeed;
        }

        if (this.player) {
            this.player.update();
        }

        // Atualiza e move as ladybugs
        this.ladybugs.forEach((ladybug, idx) => {
            ladybug.x -= 4 * this.gameSpeed;
            if (ladybug.x < this.player.x - 32 && !ladybug.passed && !ladybug.hitPlayer) {
                this.incrementScore();
                ladybug.passed = true;
            }
            if (ladybug.x < -ladybug.width) {
                ladybug.destroy();
                this.ladybugs.splice(idx, 1);
                // Ajusta o tempo de spawn com base na velocidade
                const spawnTime = Phaser.Math.Between(1000, 3000) / this.gameSpeed;
                this.time.delayedCall(spawnTime, () => {
                    this.spawnLadybug();
                });
            }
        });

        // Atualiza e move as moths
        this.moths.forEach((moth, idx) => {
            moth.x -= 4 * this.gameSpeed;
            if (moth.x < this.player.x - 32 && !moth.passed && !moth.hitPlayer) {
                this.incrementScore();
                moth.passed = true;
            }
            if (moth.x < -moth.width) {
                moth.destroy();
                this.moths.splice(idx, 1);
                // Ajusta o tempo de spawn com base na velocidade
                const spawnTime = Phaser.Math.Between(1500, 3500) / this.gameSpeed;
                this.time.delayedCall(spawnTime, () => {
                    this.spawnMoth();
                });
            }
        });

        // Atualiza e move os beetles
        this.beetles.forEach((beetle, idx) => {
            beetle.x -= 4 * this.gameSpeed;
            if (beetle.x < this.player.x - 32 && !beetle.passed && !beetle.hitPlayer) {
                this.incrementScore();
                beetle.passed = true;
            }
            if (beetle.x < -beetle.width) {
                beetle.destroy();
                this.beetles.splice(idx, 1);
                // Ajusta o tempo de spawn com base na velocidade
                const spawnTime = Phaser.Math.Between(2000, 4000) / this.gameSpeed;
                this.time.delayedCall(spawnTime, () => {
                    this.spawnBeetle();
                });
            }
        });

        // Atualiza e move as cockroaches
        this.cockroaches.forEach((cockroach, idx) => {
            cockroach.x -= 4 * this.gameSpeed;
            if (cockroach.x < this.player.x - 32 && !cockroach.passed && !cockroach.hitPlayer) {
                this.incrementScore();
                cockroach.passed = true;
            }
            if (cockroach.x < -cockroach.width) {
                cockroach.destroy();
                this.cockroaches.splice(idx, 1);
                // Ajusta o tempo de spawn com base na velocidade
                const spawnTime = Phaser.Math.Between(2500, 4500) / this.gameSpeed;
                this.time.delayedCall(spawnTime, () => {
                    this.spawnCockroach();
                });
            }
        });

        // Atualiza e move os ducks
        this.ducks.forEach((duck, idx) => {
            duck.x -= 4 * this.gameSpeed;
            if (duck.x < -duck.width) {
                duck.destroy();
                this.ducks.splice(idx, 1);
            }
        });

        // Atualiza o texto da pontuação
        this.scoreText.setText(this.formatScore(this.score));
        this.livesText.setText(this.lives.toString());
        this.speedText.setText(`Vel: ${this.gameSpeed.toFixed(2)}x`);
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
            this.time.delayedCall(500 / this.gameSpeed, () => this.spawnLadybug());
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
            this.time.delayedCall(500 / this.gameSpeed, () => this.spawnMoth());
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
            this.time.delayedCall(500 / this.gameSpeed, () => this.spawnBeetle());
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
            this.time.delayedCall(500 / this.gameSpeed, () => this.spawnCockroach());
            return;
        }
        const cockroach = this.add.sprite(x, y, "cockroach");
        cockroach.setOrigin(0.5, 0.5);
        cockroach.setDepth(2);
        this.cockroaches.push(cockroach);
    }

    spawnDuck() {
        const x = this.scale.width + 32;
        const y = this.scale.height - 40 - 16; // topo do chão
        const duck = this.add.sprite(x, y, "duck");
        duck.setOrigin(0.5, 0.5);
        duck.setDepth(2);
        this.ducks.push(duck);
    }

    incrementScore() {
        this.score += 1;
        
        // Aumenta velocidade em 2% a cada 5 pontos
        if (this.score % 5 === 0) {
            this.gameSpeed *= 1.02; // Aumenta 2%
            console.log(`Velocidade aumentada para: ${this.gameSpeed.toFixed(2)}x`);
        }
        
        // Exibe animação de +1 acima do player
        if (this.player) {
            const oneFrames = ["one-8", "one-16", "one-16"];
            let frameIdx = 0;
            const oneSprite = this.add.image(this.player.x, this.player.y - 50, oneFrames[frameIdx]);
            oneSprite.setOrigin(0.5, 1);
            oneSprite.setDepth(20);
            let elapsed = 0;
            const frameDuration = 700; // ms
            const totalDuration = 2100; // ms
            const followAndAnimate = () => {
                if (!oneSprite.active) return;
                oneSprite.setPosition(this.player.x, this.player.y - 50);
                const newFrameIdx = Math.min(Math.floor(elapsed / frameDuration), 2);
                if (newFrameIdx !== frameIdx) {
                    frameIdx = newFrameIdx;
                    oneSprite.setTexture(oneFrames[frameIdx]);
                }
                elapsed += 16;
                if (elapsed < totalDuration) {
                    this.time.delayedCall(16, followAndAnimate);
                } else {
                    oneSprite.destroy();
                }
            };
            followAndAnimate();
        }
        // Lógica do pato: a cada 2 pontos ganhos
        if (this.score - this.lastDuckScore >= 2) {
            this.lastDuckScore = this.score;
            if (Phaser.Math.Between(1, 100) <= 20) { // 20% chance
                this.spawnDuck();
            }
        }
    }

    formatScore(score) {
        return score.toString().padStart(4, '0');
    }
}
