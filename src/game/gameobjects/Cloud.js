import { GameObjects } from "phaser";

export default class Cloud extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);

        this.speed = 2;
        this.setScale(0.5 + Math.random() * 0.5);
        this.setDepth(0);
        this.setAlpha(0.8);

        this.move();
    }

    update() {
        this.move();

        if (this.x < -this.width) {
            this.recycleCloud();
        }
    }

    recycleCloud() {
        this.x = this.scene.scale.width + this.width;
        this.y = Phaser.Math.Between(50, this.scene.scale.height / 3);
        this.setScale(0.5 + Math.random() * 0.5);
        this.speed = 2 + Math.random() * 5;
    }

    move() {
        this.x -= this.speed;
    }
}
