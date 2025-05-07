import { Scene } from "phaser";

import { EventBus } from "./../EventBus";
import GameConfig from "./../config/GameConfig";

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
        // Configura a gravidade para esta cena específica
        this.physics.world.gravity.y = 300;
        
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
        this.mothsStarted = false; // Flag para controlar quando as mariposas começam a aparecer
        this.spawnLadybug();
        
        // A mariposa só será iniciada quando o jogador atingir a pontuação configurada
        // this.time.delayedCall(Phaser.Math.Between(1500, 3500) / this.gameSpeed, () => {
        //    this.spawnMoth();
        // });
        
        this.time.delayedCall(Phaser.Math.Between(
            GameConfig.enemies.spawnTime.beetle.min, 
            GameConfig.enemies.spawnTime.beetle.max) / this.gameSpeed, () => {
            this.spawnBeetle();
        });
        
        this.time.delayedCall(Phaser.Math.Between(
            GameConfig.enemies.spawnTime.cockroach.min, 
            GameConfig.enemies.spawnTime.cockroach.max) / this.gameSpeed, () => {
            this.spawnCockroach();
        });

        this.ducks = [];
        this.lastDuckScore = 0;

        this.score = 0;
        this.lives = GameConfig.gameplay.startingLives;
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
        
        // Adiciona a lua no canto superior direito, abaixo do marcador de velocidade
        this.moon = this.add.image(this.scale.width - 250, 90, 'moon');
        this.moon.setOrigin(0.5);
        this.moon.setScale(1); // Escala da lua
        this.moon.setDepth(0); // Profundidade menor para que as nuvens passem na frente
        this.moonSpeed = 0.2; // Velocidade lenta de movimento da lua
        
        EventBus.emit("current-scene-ready", this);
    }

    start() {
        this.player.start();
        this.clouds.forEach((cloud) => cloud.update());
    }

    update(time, delta) {
        // Verifica se o jogador perdeu todas as vidas
        if (this.lives <= 0) {
            this.changeScene();
            return;
        }
        
        // Atualiza a posição da lua (movimento lento para a esquerda)
        if (this.moon) {
            this.moon.x -= this.moonSpeed;
            
            // Se a lua sair completamente pela esquerda, reposiciona na direita
            if (this.moon.x < -this.moon.width / 2) {
                this.moon.x = this.scale.width + this.moon.width / 2;
            }
        }
        
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

        // Atualiza e move as moths (apenas se já atingiu 300 pontos)
        if (this.mothsStarted) {
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
        }

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
        // Reset da velocidade do jogo para 1 (velocidade inicial)
        this.gameSpeed = 1;
        
        this.scene.start("GameOver", { score: this.score });
    }

    // Função utilitária para checar distância mínima entre bugs
    isFarFromOtherBugs(x, y) {
        const allBugs = [
            ...this.ladybugs,
            ...this.moths,
            ...this.beetles,
            ...this.cockroaches
        ];
        return allBugs.every(bug => Phaser.Math.Distance.Between(x, y, bug.x, bug.y) >= 300);
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
        this.score += GameConfig.score.basePoints;
        
        // Verifica se a pontuação atingiu o limite para começar a spawnar mariposas
        if (this.score >= GameConfig.enemies.mothStartScore && this.moths.length === 0 && !this.mothsStarted) {
            this.mothsStarted = true; // Flag para garantir que o primeiro spawn ocorra apenas uma vez
            console.log("Mariposas começaram a aparecer!");
            this.time.delayedCall(Phaser.Math.Between(
                GameConfig.enemies.spawnTime.moth.min, 
                GameConfig.enemies.spawnTime.moth.max) / this.gameSpeed, () => {
                this.spawnMoth();
            });
        }
        
        // Aumenta velocidade conforme configuração
        if (this.score % GameConfig.gameplay.speedIncreaseInterval === 0) {
            this.gameSpeed *= GameConfig.gameplay.speedMultiplier;
            console.log(`Velocidade aumentada para: ${this.gameSpeed.toFixed(2)}x`);
        }
        
        // Exibe animação de pontos acima do player
        if (this.player) {
            // Usa texto estilizado em vez das imagens
            const scoreText = this.add.text(this.player.x, this.player.y - 50, `+${GameConfig.score.basePoints}`, {
                fontFamily: 'Arial',
                fontSize: 24,
                color: '#ffdd00', // Amarelo brilhante
                stroke: '#000000',
                strokeThickness: 4,
                align: 'center'
            });
            scoreText.setOrigin(0.5, 1);
            scoreText.setDepth(20);
            
            // Animação de subida e desaparecimento
            this.tweens.add({
                targets: scoreText,
                y: scoreText.y - 50, // Move para cima
                alpha: 0, // Desaparece gradualmente
                duration: 1500,
                ease: 'Power1',
                onComplete: () => {
                    scoreText.destroy();
                }
            });
        }
        
        // Lógica do pato: verifica spawn conforme configuração
        if (this.score - this.lastDuckScore >= GameConfig.powerUps.duckCheckInterval) {
            this.lastDuckScore = this.score;
            if (Phaser.Math.Between(1, 100) <= GameConfig.powerUps.duckSpawnChance) {
                this.spawnDuck();
            }
        }
    }

    formatScore(score) {
        return score.toString().padStart(4, '0');
    }
}
