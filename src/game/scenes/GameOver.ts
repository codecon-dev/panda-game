import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;

    constructor () {
        super('GameOver');
    }

    preload () {
        this.gameOverText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "Game Over! Aperte espaço \n para começar novamente",
            {
                fontFamily: "Arial",
                fontSize: 32,
            }
        );
        this.gameOverText.setOrigin(0.5, 0.5);
    }

    create() {
        EventBus.emit("current-scene-ready", this);

        this.input.keyboard?.on("keyup", (event: KeyboardEvent) => {
            if (event.code === "Space") {
                this.changeScene();
            }
        });
    }

    changeScene () {
        this.scene.start('MainMenu');
    }
}
