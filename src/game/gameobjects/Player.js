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

        this.play("running");
    }

    jump() {
        if (
            this.body.touching.down ||
            this.body.blocked.down ||
            this.body.onFloor()
        ) {
            this.body.setVelocityY(-400);
            this.play("jumping");
        } else {
            console.log("Não pode pular - está no ar");
        }
    }

    crouch() {}

    die() {
        this.isAlive = false
    }

    update() {
        if (this.isAlive) {
            if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
                this.jump();
            }

            if (
                this.body.touching.down &&
                this.anims.currentAnim.key !== "running"
            ) {
                this.play("running", true);
            }
        }
    }
}
