import { GameObjects, Physics } from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene, 36, 250, "player");

        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this).setCollideWorldBounds(true);

        this.body.setGravityY(500);
        this.body.setSize(64, 64);

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
                    if (Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), sprite.getBounds())) {
                        isHit = true;
                    }
                });
            });
            if (isHit) {
                if (!this.anims.currentAnim || this.anims.currentAnim.key !== "hit") {
                    this.play("hit", true);
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

            // Aumenta a velocidade de queda se estiver pulando e pressionar S ou seta para baixo
            if (!this.body.onFloor() && (this.down.isDown || this.sKey.isDown)) {
                if (this.body.velocity.y < 0) {
                    // Está subindo, não aumenta a queda
                } else {
                    // Está caindo
                    this.body.setVelocityY(this.body.velocity.y * 1.3);
                }
            }

            if (this.down.isDown || this.sKey.isDown) {
                if (!this.anims.currentAnim || this.anims.currentAnim.key !== "crouching") {
                    this.play("crouching", true);
                }
                return;
            }
        }
    }
}
