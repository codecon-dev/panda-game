import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor() {
        super("MainMenu");
    }

    create() {
        // this.background = this.add.image(512, 384, "background");
        EventBus.emit("current-scene-ready", this);

        this.input.keyboard?.on("keyup", (event: KeyboardEvent) => {
            if (event.code === "Space") {
                this.changeScene();
            }
        });
    }

    changeScene() {
        this.scene.start("Game");
    }
}
