import { Scene } from "phaser";

import { EventBus } from "./../EventBus";
import { HEIGHTS, GAMEPLAY } from "./../constants";

import Player from "./../gameobjects/Player";
import Cloud from "./../gameobjects/Cloud";
import Duck from "./../gameobjects/Duck";
import Beetle from "./../gameobjects/Beetle";
import Cockroach from "./../gameobjects/Cockroach";
import LadyBug from "./../gameobjects/LadyBug";
import Moth from "./../gameobjects/Moth";

export class Game extends Scene {
    constructor() {
        super("Game");

        this.player;
        this.ground;
        this.bugs = [];
        this.playerHit = false;
        this.score = 0;
        this.highScore = 0;
        this.scoreText;
        this.lastScoreTime = 0;
        this.lastMothSpawn = 0; // Controla quando foi spawned a última mariposa
        this.mothSpawnInterval = 3000; // Intervalo entre mariposas (3 segundos)
        this.ducks = []; // Array de patos
        this.lastDuckSpawn = 0; // Controla quando foi spawned o último pato
        this.duckSpawnInterval = 35000; // Intervalo entre patos (35 segundos)
        this.nextBugX = 0; // Controla posição X do próximo bug
    }

    preload() {
        this.load.image("cloud", "assets/cloud.png");
        this.load.image("road", "assets/road.png");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor("#353946");

        // Carregar highscore do localStorage
        this.highScore = parseInt(
            localStorage.getItem("pandaHighScore") || "0"
        );
        this.score = 0;

        // Chão visual (estrada) - apenas decorativo
        this.roadSprite = this.add.tileSprite(
            this.scale.width / 2,
            this.scale.height + HEIGHTS.GROUND_VISUAL_Y,
            this.scale.width,
            14, // Altura da imagem da estrada
            "road"
        );
        this.roadSprite.setScale(1, 1);
        this.roadSprite.setOrigin(0.5, 0.5);
        // NÃO adicionar física na estrada decorativa

        // Chão invisível para colisão - onde o panda vai andar
        this.ground = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height + HEIGHTS.GROUND_COLLISION_Y,
            this.scale.width,
            10 // Altura pequena para colisão
        );
        this.ground.setVisible(false); // Invisível
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

        // Criar bugs no chão - menos bugs e mais espalhados
        this.bugs = [];
        // Apenas bugs do chão no início (sem mariposas)
        const bugTypes = [
            { texture: "beetle", class: Beetle },
            { texture: "cockroach", class: Cockroach },
            { texture: "ladybug", class: LadyBug },
        ];

        for (let i = 0; i < 3; i++) {
            const bugType = Phaser.Utils.Array.GetRandom(bugTypes);
            const bug = new bugType.class(
                this,
                this.scale.width +
                    200 + // Começam mais próximos
                    i * GAMEPLAY.INITIAL_BUG_SPACING,
                this.scale.height + HEIGHTS.GROUND_BUGS_Y,
                bugType.texture
            );
            this.bugs.push(bug);
        }

        // Remover mariposa de teste - só aparece depois de 600 pontos

        // Adicionar colisão entre player e bugs
        this.bugs.forEach((bug) => {
            this.physics.add.overlap(
                this.player,
                bug,
                this.handleCollision,
                null,
                this
            );
        });

        // Criar texto do score no canto superior direito
        this.scoreText = this.add.text(
            this.scale.width - 30,
            10,
            this.formatScore(),
            {
                fontFamily: "monospace",
                fontSize: "16px",
                color: "#ffffff",
                align: "right",
            }
        );
        this.scoreText.setOrigin(1, 0);

        // Iniciar o jogo automaticamente
        this.start();

        EventBus.emit("current-scene-ready", this);
    }

    formatScore() {
        const currentScore = this.score.toString().padStart(5, "0");
        const highScore = this.highScore.toString().padStart(5, "0");
        return `HI ${highScore} ${currentScore}`;
    }

    getCurrentGameSpeed() {
        // Calcula quantos milestones de 100 pontos foram atingidos
        const milestones = Math.floor(this.score / GAMEPLAY.SPEED_MILESTONE);
        // Velocidade base + (milestones * aumento por milestone)
        return GAMEPLAY.BASE_GAME_SPEED + milestones * GAMEPLAY.SPEED_INCREASE;
    }

    getCurrentBugSpacing() {
        // Até 1000 pontos: espaçamento fixo de 1800px
        if (this.score < GAMEPLAY.BUG_SPACING_REDUCTION_SCORE) {
            return GAMEPLAY.BUG_SPACING_FIXED;
        }

        // Após 1000 pontos: reduz gradualmente até o mínimo
        const progressScore = this.score - GAMEPLAY.BUG_SPACING_REDUCTION_SCORE;
        const reductionRate = 0.1; // Reduz 0.1px por ponto extra
        const reduction = progressScore * reductionRate;

        return Math.max(
            GAMEPLAY.BUG_SPACING_MIN,
            GAMEPLAY.BUG_SPACING_FIXED - reduction
        );
    }

    updateScore(points) {
        this.score += points;
        this.scoreText.setText(this.formatScore());
    }

    checkJumpOverBug() {
        // Verifica se o player está pulando e passou por cima de algum bug
        if (this.player.isJumping) {
            this.bugs.forEach((bug) => {
                const playerBounds = this.player.getBounds();
                const bugBounds = bug.getBounds();

                // Se o player está acima do bug horizontalmente mas passou por ele
                if (
                    playerBounds.right > bugBounds.left &&
                    playerBounds.left < bugBounds.right &&
                    playerBounds.bottom < bugBounds.top + 20
                ) {
                    // Se o bug ainda não foi "pulado"
                    if (!bug.jumped) {
                        bug.jumped = true;
                        this.updateScore(10); // Bônus por pular por cima
                    }
                }
            });
        }
    }

    recycleBug(bug) {
        // Remove o bug atual
        const bugIndex = this.bugs.indexOf(bug);
        if (bugIndex > -1) {
            this.bugs.splice(bugIndex, 1);
        }
        bug.destroy();

        // Sempre criar bugs do chão na reciclagem (mariposas são spawnadas separadamente)
        const bugTypes = [
            { texture: "beetle", class: Beetle },
            { texture: "cockroach", class: Cockroach },
            { texture: "ladybug", class: LadyBug },
        ];

        const bugType = Phaser.Utils.Array.GetRandom(bugTypes);

        // Calcula posição baseada no último bug mais distante
        const rightmostBugX = Math.max(
            ...this.bugs.map((b) => b.x),
            this.scale.width
        );
        const newBugX = rightmostBugX + this.getCurrentBugSpacing();

        const newBug = new bugType.class(
            this,
            newBugX,
            this.scale.height + HEIGHTS.GROUND_BUGS_Y,
            bugType.texture
        );

        this.bugs.push(newBug);

        // Adicionar colisão com o novo bug
        this.physics.add.overlap(
            this.player,
            newBug,
            this.handleCollision,
            null,
            this
        );
    }

    spawnMothIfNeeded(currentTime) {
        // Só spawna mariposas após 600 pontos
        if (this.score < 400) return;

        // Verifica se passou tempo suficiente desde a última mariposa
        if (currentTime - this.lastMothSpawn > this.mothSpawnInterval) {
            // 30% de chance de spawnar mariposa
            if (Math.random() < 0.3) {
                // Calcula posição baseada no último obstáculo mais distante
                const rightmostX = Math.max(
                    ...this.bugs.map((b) => b.x),
                    this.scale.width
                );
                const mothX = rightmostX + this.getCurrentBugSpacing();

                const newMoth = new Moth(
                    this,
                    mothX,
                    this.scale.height + HEIGHTS.FLYING_BUGS_Y,
                    "moth-1"
                );

                this.bugs.push(newMoth);

                // Adicionar colisão com a nova mariposa
                this.physics.add.overlap(
                    this.player,
                    newMoth,
                    this.handleCollision,
                    null,
                    this
                );

                this.lastMothSpawn = currentTime;
            } else {
                // Se não spawnou, espera menos tempo para tentar novamente
                this.lastMothSpawn = currentTime - this.mothSpawnInterval * 0.5;
            }
        }
    }

    spawnDuckIfNeeded(currentTime) {
        // Verifica se passou tempo suficiente desde o último pato
        if (currentTime - this.lastDuckSpawn > this.duckSpawnInterval) {
            const newDuck = new Duck(
                this,
                this.scale.width + Phaser.Math.Between(300, 1200), // Posição mais aleatória
                this.scale.height + HEIGHTS.DUCK_Y // Altura específica do pato
            );

            this.ducks.push(newDuck);

            // Adicionar colisão com o pato (coleta)
            this.physics.add.overlap(
                this.player,
                newDuck,
                this.handleDuckCollection,
                null,
                this
            );

            this.lastDuckSpawn = currentTime;
        }
    }

    handleDuckCollection(player, duck) {
        duck.collect();
        player.activateSpecial();

        // Remove o pato do array
        const duckIndex = this.ducks.indexOf(duck);
        if (duckIndex > -1) {
            this.ducks.splice(duckIndex, 1);
        }
    }

    handleCollision(player, bug) {
        if (player.isSpecial) {
            // Evita múltiplas colisões com o mesmo bug
            if (bug.hitBySpecial) return;
            bug.hitBySpecial = true;

            // No modo especial, faz o bug voar para um lado aleatório
            const flyDirection = Math.random() < 0.5 ? -1 : 1; // Esquerda ou direita
            const flyForceX = Phaser.Math.Between(200, 400) * flyDirection;
            const flyForceY = Phaser.Math.Between(-300, -500);

            // Se o bug tem física, aplica força
            if (bug.body) {
                bug.body.setVelocity(flyForceX, flyForceY);
                bug.body.setGravityY(500); // Adiciona gravidade para cair
            }

            return; // Não mata o player
        }

        // Comportamento normal - mata o player
        player.hit();

        // Salvar highscore se necessário
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem("pandaHighScore", this.highScore.toString());
            this.scoreText.setText(this.formatScore());
        }
    }

    start() {
        // Reset completo do estado do jogo
        this.playerHit = false;
        this.score = 0;
        this.lastScoreTime = this.time.now;
        this.lastMothSpawn = this.time.now; // Reset timer das mariposas
        this.lastDuckSpawn = this.time.now; // Reset timer dos patos

        // Reset dos bugs
        this.bugs.forEach((bug) => {
            bug.jumped = false;
        });

        this.player.start();
        this.clouds.forEach((cloud) => cloud.update());
        this.scoreText.setText(this.formatScore());
    }

    update(time, delta) {
        // Se o player foi atingido, para tudo
        if (!this.playerHit) {
            this.clouds.forEach((cloud) =>
                cloud.updateWithSpeed(this.getCurrentGameSpeed())
            );

            // Atualizar bugs e reciclar quando saem da tela
            this.bugs.forEach((bug) => {
                bug.updateWithSpeed(this.getCurrentGameSpeed());
                if (bug.x < -50) {
                    this.recycleBug(bug);
                }
            });

            // Atualizar patos e remover quando saem da tela
            this.ducks.forEach((duck, index) => {
                duck.updateWithSpeed(this.getCurrentGameSpeed());
                if (duck.x < -50) {
                    duck.destroy();
                    this.ducks.splice(index, 1);
                }
            });

            if (this.roadSprite) {
                this.roadSprite.tilePositionX +=
                    GAMEPLAY.BACKGROUND_SPEED * this.getCurrentGameSpeed(); // Aplica velocidade dinâmica
            }

            // Pontuação por passos (a cada 100ms = 1 ponto)
            if (time - this.lastScoreTime > 100) {
                this.updateScore(1);
                this.lastScoreTime = time;
            }

            // Verificar se pulou por cima de algum bug
            this.checkJumpOverBug();

            // Spawnar mariposas após 600 pontos
            this.spawnMothIfNeeded(time);

            // Spawnar patos após 600 pontos
            this.spawnDuckIfNeeded(time);
        }

        if (this.player) {
            this.player.update();
            // Atualiza framerate da animação de corrida baseado na velocidade
            this.player.updateRunningSpeed(this.getCurrentGameSpeed());
        }
    }

    changeScene() {
        this.scene.start("GameOver", { score: this.score });
    }
}
