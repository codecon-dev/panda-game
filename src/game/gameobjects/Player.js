import { GameObjects, Physics } from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene, 36, 250, "player");

        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this).setCollideWorldBounds(true);

        this.body.setGravityY(300 * 1.9);
        this.body.setSize(60 * 0.7, 60 * 0.7);
        this.body.setOffset((60 - 60 * 0.7) / 2, (60 - 60 * 0.7) / 2);

        this.isAlive = true;

        this.spacebar = this.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.up = this.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.UP
        );
        this.down = this.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.DOWN
        );
        this.sKey = this.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.S
        );

        this.play("running");

        this.zeroSprite = null;
        this.zeroTimeout = null;
    }

    start() {
        this.isAlive = true;
        this.play("running", true);
    }

    jump() {
        if (
            this.body.touching.down ||
            this.body.blocked.down ||
            this.body.onFloor()
        ) {
            this.body.setVelocityY(-400);
            if (!this.anims.currentAnim || this.anims.currentAnim.key !== "jumping") {
                this.play("jumping", true);
            }
        } else {
            console.log("Não pode pular - está no ar");
        }
    }

    crouch() {}

    die() {}

    update() {
        if (this.isAlive) {
            // PRIORIDADE: modo especial
            if (this.isSpecialRunning) {
                this.play("running-special", true);
                return;
            }
            // Verifica colisão com bugs
            const scene = this.scene;
            let isHit = false;
            [scene.ladybugs, scene.moths, scene.beetles, scene.cockroaches].forEach((group) => {
                group.forEach((sprite) => {
                    const playerCenter = { x: this.x, y: this.y };
                    const bugCenter = { x: sprite.x, y: sprite.y };
                    const dist = Phaser.Math.Distance.Between(playerCenter.x, playerCenter.y, bugCenter.x, bugCenter.y);
                    // Se for moth, estiver abaixado e no chão, ignora colisão
                    if (
                        group === scene.moths &&
                        (this.down.isDown || this.sKey.isDown) &&
                        this.body.onFloor()
                    ) {
                        // Ignora colisão com moth
                        return;
                    }
                    if (dist <= 50) {
                        isHit = true;
                        if (!sprite.hitPlayer) {
                            scene.lives = Math.max(0, scene.lives - 1);
                            sprite.hitPlayer = true;
                        }
                    }
                });
            });
            // Verifica colisão com duck (bônus)
            if (scene.ducks) {
                scene.ducks.forEach((duck) => {
                    const playerCenter = { x: this.x, y: this.y };
                    const duckCenter = { x: duck.x, y: duck.y };
                    const dist = Phaser.Math.Distance.Between(playerCenter.x, playerCenter.y, duckCenter.x, duckCenter.y);
                    if (dist <= 50 && !duck.collected) {
                        duck.collected = true;
                        duck.destroy();
                        this.activateSpecialRun();
                        if (scene.score !== undefined) {
                            scene.score += 5;
                        }
                    }
                });
            }
            if (isHit) {
                // Se for moth, estiver abaixado e no chão, não faz animação de hit
                if (!((this.down.isDown || this.sKey.isDown) && this.body.onFloor() && scene.moths.some(sprite => Phaser.Math.Distance.Between(this.x, this.y, sprite.x, sprite.y) <= 50))) {
                    if (!this.anims.currentAnim || this.anims.currentAnim.key !== "hit") {
                        this.play("hit", true);
                    }
                    // Exibe as três imagens zero-8, zero-16, zero-24 acima do player por 2.1s, trocando a cada 0.7s e seguindo o player
                    const zeroFrames = ["zero-8", "zero-16", "zero-24"];
                    let frameIdx = 0;
                    const zeroSprite = this.scene.add.image(this.x, this.y - 50, zeroFrames[frameIdx]);
                    zeroSprite.setOrigin(0.5, 1);
                    zeroSprite.setDepth(20);
                    let elapsed = 0;
                    const frameDuration = 100; // ms
                    const totalDuration = 500; // ms
                    const followAndAnimate = () => {
                        if (!zeroSprite.active) return;
                        zeroSprite.setPosition(this.x, this.y - 50);
                        const newFrameIdx = Math.min(Math.floor(elapsed / frameDuration), 2);
                        if (newFrameIdx !== frameIdx) {
                            frameIdx = newFrameIdx;
                            zeroSprite.setTexture(zeroFrames[frameIdx]);
                        }
                        elapsed += 16;
                        if (elapsed < totalDuration) {
                            this.scene.time.delayedCall(16, followAndAnimate);
                        } else {
                            zeroSprite.destroy();
                        }
                    };
                    followAndAnimate();
                }
            } else {
                // Remove zero se não está mais em hit
                if (this.zeroSprite) {
                    this.zeroSprite.destroy();
                    this.zeroSprite = null;
                }
                // Volta para animação normal
                if (this.body.onFloor()) {
                    if (!this.anims.currentAnim || this.anims.currentAnim.key !== "running") {
                        this.play("running", true);
                    }
                } else {
                    if (!this.anims.currentAnim || this.anims.currentAnim.key !== "jumping") {
                        this.play("jumping", true);
                    }
                }
            }

            if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
                this.jump();
            }

            if (this.down.isDown || this.sKey.isDown) {
                if (!this.anims.currentAnim || this.anims.currentAnim.key !== "crouching") {
                    this.play("crouching", true);
                }
                // Não alterar offset ou size que mudem a posição visual
                // Apenas animação
                return;
            } else {
                // Não alterar offset ou size
            }
        }
    }

    activateSpecialRun() {
        if (this.specialRunTimeout) {
            this.scene.time.removeEvent(this.specialRunTimeout);
        }
        
        // Limpa qualquer contador anterior
        if (this.countdownText) {
            this.countdownText.destroy();
        }
        
        this.isSpecialRunning = true;
        if (!this.anims.currentAnim || this.anims.currentAnim.key !== "running-special") {
            this.play("running-special", true);
        }
        
        // Cria o texto de contagem regressiva no centro da tela
        let remainingSeconds = 3;
        this.countdownText = this.scene.add.text(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2,
            remainingSeconds.toString(),
            {
                fontFamily: 'Arial',
                fontSize: 64,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
                shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 2, stroke: true, fill: true }
            }
        );
        this.countdownText.setOrigin(0.5);
        this.countdownText.setDepth(100); // Certifica que fica na frente de tudo
        
        // Timer para atualizar a contagem a cada segundo
        this.countdownTimer = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                remainingSeconds--;
                if (remainingSeconds >= 0) {
                    this.countdownText.setText(remainingSeconds.toString());
                }
                // Na última iteração (0), não remove o texto ainda, deixa para o final do efeito
            },
            repeat: 2
        });
        
        // Timer para encerrar o efeito após 3 segundos
        this.specialRunTimeout = this.scene.time.delayedCall(3000, () => {
            this.isSpecialRunning = false;
            this.play("running", true);
            
            // Remove o texto de contagem
            if (this.countdownText) {
                this.countdownText.destroy();
                this.countdownText = null;
            }
            
            // Para o timer de contagem, se ainda estiver ativo
            if (this.countdownTimer) {
                this.countdownTimer.remove();
                this.countdownTimer = null;
            }
        });
    }
}
