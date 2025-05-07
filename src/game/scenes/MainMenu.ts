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
        // Define a cor de fundo
        this.cameras.main.setBackgroundColor('#353946');

        // Adiciona o título
        this.title = this.add.text(this.scale.width / 2, this.scale.height / 3, "PANDA GAME", {
            fontFamily: "Arial",
            fontSize: 48,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 6,
            align: "center"
        });
        this.title.setOrigin(0.5);

        // Adiciona instruções
        const instructions = this.add.text(this.scale.width / 2, this.scale.height / 2, "Pressione ESPAÇO para começar", {
            fontFamily: "Arial",
            fontSize: 24,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4,
            align: "center"
        });
        instructions.setOrigin(0.5);

        // Adiciona animação de pulso no texto
        this.tweens.add({
            targets: instructions,
            scale: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Configura o evento de tecla
        this.input.keyboard?.on("keyup", (event: KeyboardEvent) => {
            if (event.code === "Space") {
                this.changeScene();
            }
        });

        // Emite o evento de cena pronta
        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("Game");
    }
}