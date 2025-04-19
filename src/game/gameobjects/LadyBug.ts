import { Physics, Scene } from "phaser";

export default class Ladybug extends Physics.Arcade.Sprite {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, "ladybug");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        if (this.body) {
            this.body.setSize(32, 32);
        }

        this.setPushable(false);
    }

    spawn(yPosition: number, speed: number) {
        this.setPosition(this.scene.scale.width + this.width, yPosition);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(-speed);
    }

    isOffScreen(): boolean {
        return this.x < -this.width;
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        if (this.isOffScreen()) {
            this.setActive(false);
            this.setVisible(false);
            this.setVelocityX(0);
        }
    }
}