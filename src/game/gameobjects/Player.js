import { GameObjects, Physics } from "phaser";
import { HEIGHTS } from "../constants";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene, 60, scene.scale.height + HEIGHTS.PLAYER_Y, "player");

        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this).setCollideWorldBounds(true);

        this.body.setGravityY(1300);
        this.body.setSize(64, 64);
        this.body.setOffset(0, 0);

        // Player sempre na frente dos bugs
        this.setDepth(10);

        this.isAlive = true;
        this.isJumping = false;
        this.jumpTimer = 0;
        this.isCrouching = false;
        this.crouchTimer = 0;
        this.isHit = false;
        this.hitTimer = 0;
        this.isSpecial = false; // Reset especial
        this.specialTimer = 0;
        this.specialDuration = 5000; // 5 segundos de especial

        this.play("running");
    }

    start() {
        this.isAlive = true;
        this.isJumping = false;
        this.jumpTimer = 0;
        this.isCrouching = false;
        this.crouchTimer = 0;
        this.isHit = false;
        this.hitTimer = 0;

        // Garantir que o player esteja no chão
        this.setPosition(60, this.scene.scale.height + HEIGHTS.PLAYER_Y);
        this.body.setVelocityY(0);
        this.body.setVelocityX(0);

        this.play("running", true);
    }

    jump() {
        if (
            (this.body.touching.down ||
                this.body.blocked.down ||
                this.body.onFloor()) &&
            !this.isJumping
        ) {
            this.isJumping = true;
            this.jumpTimer = this.scene.time.now;
            this.body.setVelocityY(-600);

            this.anims.stop();
            this.play("jumping", true);
        } else {
            console.error("Não pode pular - está no ar");
        }
    }

    crouch() {
        if (!this.isCrouching && !this.isJumping) {
            this.isCrouching = true;
            this.crouchTimer = this.scene.time.now;

            // Reduz hitbox para altura de agachado
            this.body.setSize(48, 24); // Altura reduzida de 48 para 24
            this.body.setOffset((64 - 48) / 2, 64 - 24); // Ajusta offset para manter na base

            // Apenas muda a animação
            this.anims.stop();
            this.play("crouching", true);
        }
    }

    stopCrouching() {
        if (this.isCrouching) {
            this.isCrouching = false;

            // Volta hitbox normal
            this.body.setSize(64, 64);
            this.body.setOffset(0, 0);

            // Apenas volta pra animação de corrida
            this.anims.stop();
            const runningAnim = this.isSpecial ? "running-special" : "running";
            this.play(runningAnim, true);
        }
    }

    hit() {
        if (!this.isHit && this.isAlive) {
            this.isHit = true;
            this.isAlive = false;
            this.hitTimer = this.scene.time.now;

            // Para todas as animações e mostra a imagem de hit
            this.anims.stop();
            this.setTexture("hit");

            // Para o panda no ar
            this.body.setVelocityY(0);
            this.body.setVelocityX(0);

            // Notifica a cena que o player foi atingido
            this.scene.playerHit = true;
        }
    }

    die() {}

    activateSpecial() {
        this.isSpecial = true;
        this.specialTimer = this.scene.time.now;

        // Muda para animação especial se estiver correndo
        if (!this.isJumping && !this.isCrouching) {
            this.anims.stop();
            this.play("running-special", true);
        }
    }

    deactivateSpecial() {
        this.isSpecial = false;

        // Volta para animação normal se estiver correndo
        if (!this.isJumping && !this.isCrouching) {
            this.anims.stop();
            this.play("running", true);
        }
    }

    updateRunningSpeed(gameSpeed) {
        // Framerate base é 5, aumenta proporcionalmente com a velocidade
        const baseFrameRate = 5;
        const newFrameRate = Math.round(baseFrameRate * (gameSpeed / 1)); // 0.7 é a velocidade base

        // Atualiza framerate para animação de corrida normal ou especial
        if (
            this.anims.currentAnim &&
            (this.anims.currentAnim.key === "running" ||
                this.anims.currentAnim.key === "running-special")
        ) {
            this.anims.currentAnim.frameRate = newFrameRate;
        }
    }

    update() {
        if (this.isHit) {
            // Após 1 segundo de hit, muda para animação de morto
            const hitElapsed = this.scene.time.now - this.hitTimer;
            if (hitElapsed > 1000 && hitElapsed < 1100) {
                // Troca para animação de morto
                this.anims.stop();
                this.play("dead", true);
            }
            if (hitElapsed > 2500) {
                this.scene.changeScene();
            }
            return;
        }

        if (this.isAlive) {
            // Controla duração do especial
            if (this.isSpecial) {
                const specialElapsed = this.scene.time.now - this.specialTimer;
                if (specialElapsed > this.specialDuration) {
                    this.deactivateSpecial();
                }
            }

            const jumpElapsed = this.scene.time.now - this.jumpTimer;

            if (this.isJumping && jumpElapsed > 100) {
                if (
                    this.body.touching.down ||
                    this.body.blocked.down ||
                    this.body.onFloor()
                ) {
                    this.isJumping = false;
                    // Se não está agachado, volta pra corrida
                    if (!this.isCrouching) {
                        this.anims.stop();
                        const runningAnim = this.isSpecial
                            ? "running-special"
                            : "running";
                        this.play(runningAnim, true);
                    }
                }
            }
        }
    }
}
