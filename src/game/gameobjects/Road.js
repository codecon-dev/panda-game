import { GameObjects, Scene } from "phaser";

export default class Road extends GameObjects.TileSprite {
    constructor(scene) {
        const roadHeight = 14;
        const y = scene.scale.height - roadHeight;

        super(
            scene,
            0,
            y,
            scene.scale.width,
            roadHeight,
            "road"
        );

        this.setOrigin(0, 0.5);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        this.speed = 2;
    }

    update() {
        this.tilePositionX += this.speed;
    }
}