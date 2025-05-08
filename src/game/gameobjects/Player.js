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
        this.isJumping = false;
        this.jumpTimer = 0;

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

    start() {
        this.isAlive = true;
        this.isJumping = false;
        this.jumpTimer = 0;
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
            this.body.setVelocityY(-400);

            this.anims.stop();
            this.play("jumping", true);

            console.log("Jumping animation started");
        } else {
            console.log("Não pode pular - está no ar");
        }
    }

    crouch() { }

    die() { }

    update() {
        if (this.isAlive) {
            if (Phaser.Input.Keyboard.JustDown(this.spacebar) || Phaser.Input.Keyboard.JustDown(this.up)) {
                this.jump();
            }

            const jumpElapsed = this.scene.time.now - this.jumpTimer;

            if (this.isJumping && jumpElapsed > 100) {
                if (this.body.touching.down || this.body.blocked.down || this.body.onFloor()) {
                    this.isJumping = false;
                    this.anims.stop();
                    this.play("running", true);
                }
            }
        }
    }
}
