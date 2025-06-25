import { GameObjects } from "phaser";
import { HEIGHTS, GAMEPLAY } from "../constants";

export default class Cockroach extends Phaser.GameObjects.Image {
    speed: number;
    groundY: number;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        frame?: string | number
    ) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Hitbox focado apenas na parte visível (32x32px na parte inferior)
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(32, 32); // 32x32 pixels
        body.setOffset((this.width - 32) / 2, this.height - 32); // Centralizado na base

        this.speed = GAMEPLAY.BUG_SPEED;
        this.groundY = y;
        this.setDepth(2);

        this.move();
    }

    update() {
        this.move();
    }

    updateWithSpeed(gameSpeed: number) {
        this.moveWithSpeed(gameSpeed);
    }

    recycleBug() {
        this.x =
            this.scene.scale.width +
            this.width +
            Phaser.Math.Between(
                GAMEPLAY.BUG_SPACING_MIN,
                GAMEPLAY.BUG_SPACING_MAX
            );
    }

    move() {
        this.x -= this.speed * GAMEPLAY.BASE_GAME_SPEED; // Usa velocidade base
    }

    moveWithSpeed(gameSpeed: number) {
        this.x -= this.speed * gameSpeed;
    }
}
