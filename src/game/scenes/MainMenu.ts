import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    loadText: GameObjects.Text;

    constructor() {
        super("MainMenu");
    }

    preload () {
        this.loadText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "aperte espaço para começar",
            {
                fontFamily: "Arial",
                fontSize: 32,
            }
        );
        this.loadText.setOrigin(0.5, 0.5);
    }

    create() {
        EventBus.emit("current-scene-ready", this);

        this.input.keyboard?.on("keyup", (event: KeyboardEvent) => {
            if (event.code === "Space") {
                this.changeScene();
            }
        });

        // @TODO: remove this when mainmenu is ready
        this.changeScene();
    }

    changeScene() {
        this.scene.start("Game");
    }
}
