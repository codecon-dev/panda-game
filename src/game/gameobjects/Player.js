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
            // Verifica colisão com insetos
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
            if (isHit) {
                // Se for moth, estiver abaixado e no chão, não faz animação de hit
                if (!((this.down.isDown || this.sKey.isDown) && this.body.onFloor() && scene.moths.some(sprite => Phaser.Math.Distance.Between(this.x, this.y, sprite.x, sprite.y) <= 50))) {
                    if (!this.anims.currentAnim || this.anims.currentAnim.key !== "hit") {
                        this.play("hit", true);
                    }
                }
            } else {
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
}
