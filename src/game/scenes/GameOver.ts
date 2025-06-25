import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverImage: Phaser.GameObjects.Image;
    pandaGameOver: Phaser.GameObjects.Sprite;
    scoreText: Phaser.GameObjects.Text;

    constructor() {
        super("GameOver");
    }

    create(data?: { score?: number }) {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor("#0301AA");

        // Criar animação local se não existir
        if (!this.anims.exists("dead")) {
            this.anims.create({
                key: "dead",
                frames: [{ key: "game-over" }, { key: "game-over-2" }],
                frameRate: 3,
                repeat: -1,
            });
        }

        // Imagem de fundo game over
        this.gameOverImage = this.add.image(
            this.scale.width / 2,
            this.scale.height / 2 - 50,
            "game-over-1"
        );
        this.gameOverImage.setOrigin(0.5);

        // Score final no topo direito
        const finalScore = data?.score || 0;
        const highScore = parseInt(
            localStorage.getItem("pandaHighScore") || "0"
        );

        this.scoreText = this.add.text(
            this.scale.width - 30,
            10,
            `HI ${highScore.toString().padStart(5, "0")} ${finalScore
                .toString()
                .padStart(5, "0")}`,
            {
                fontFamily: "monospace",
                fontSize: "16px",
                color: "#FFFFFF",
                align: "right",
            }
        );
        this.scoreText.setOrigin(1, 0);

        // Panda game over com animação
        this.pandaGameOver = this.add.sprite(
            this.scale.width / 2,
            this.scale.height / 2 + 80,
            "game-over"
        );
        this.pandaGameOver.setOrigin(0.5);
        this.pandaGameOver.play("dead", true);

        // Configura o evento de tecla para reiniciar
        this.input.keyboard?.on("keyup", (event: KeyboardEvent) => {
            this.changeScene();
        });

        // Também permite tocar na tela para reiniciar
        this.input.on("pointerdown", () => {
            this.changeScene();
        });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("MainMenu");
    }
}
