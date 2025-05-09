import { GameObjects } from "phaser";

export default class Cloud extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);

        this.baseSpeed = 2;
        this.speedMultiplier = 0.5 + Math.random() * 0.5; // Clouds move at different relative speeds
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
        this.speedMultiplier = 0.5 + Math.random() * 0.5;
    }

    move() {
        // Get the current game speed from the scene
        const gameSpeed = this.scene.currentSpeed || this.baseSpeed;
        
        // Each cloud moves at its own relative speed based on the game speed
        this.x -= gameSpeed * this.speedMultiplier;
    }
}
