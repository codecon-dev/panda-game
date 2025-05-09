import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    player: Phaser.GameObjects.Sprite;
    logoTween: Phaser.Tweens.Tween | null;
    clouds: Phaser.GameObjects.Image[];

    constructor() {
        super("MainMenu");
    }

    create() {

        this.cameras.main.setBackgroundColor('#000000');
        this.player = this.add.sprite(36, this.scale.height - 40, "running-1");
        this.player.setOrigin(0.5, 1);
        this.player.setDepth(9);

        const road = this.add.tileSprite(
            this.scale.width / 2,
            this.scale.height - 40,
            this.scale.width,
            11,
            "road"
        );
        road.setOrigin(0.5, 0);
        road.setDepth(1);

        this.clouds = [];
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(50, this.scale.width - 50);
            const y = Phaser.Math.Between(30, this.scale.height / 3);
            const cloud = this.add.image(x, y, "cloud");

            cloud.setScale(0.5 + Math.random() * 0.5);
            cloud.setDepth(0);
            cloud.setAlpha(0.8);
            this.clouds.push(cloud);
        }

        // Configura o evento de tecla
        this.input.keyboard?.on("keyup", (event: KeyboardEvent) => {
            if (event.code === "Space") {
                this.changeScene();
            }
        });
        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("Game");
    }
}