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
        
        // Adiciona o ranking das melhores pontuações
        this.displayHighScores();

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

    // Método para exibir as três melhores pontuações
    displayHighScores() {
        // Recupera as pontuações salvas
        const highScores: number[] = JSON.parse(localStorage.getItem('pandaGameHighScores') || '[]');
        
        // Adiciona o título do ranking
        const rankingTitle = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, "RANK", {
            fontFamily: "Arial",
            fontSize: 18,
            color: "#ffdd00",
            stroke: "#000000",
            strokeThickness: 3,
            align: "center"
        });
        rankingTitle.setOrigin(0.5);
        
        // Se não houver pontuações, mostra mensagem
        if (highScores.length === 0) {
            const noScores = this.add.text(this.scale.width / 2, this.scale.height / 2 + 80, "Nenhuma pontuação registrada", {
                fontFamily: "Arial",
                fontSize: 16,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 2,
                align: "center"
            });
            noScores.setOrigin(0.5);
            return;
        }
        
        // Adiciona as três melhores pontuações
        const positions = ["1º", "2º", "3º"];
        
        highScores.forEach((score, index) => {
            if (index < 3) { // Garante que mostraremos apenas as 3 melhores
                const y = this.scale.height / 2 + 80 + (index * 25);
                
                // Adiciona o texto com a posição e pontuação
                const scoreText = this.add.text(this.scale.width / 2, y, `${positions[index]}: ${score} pontos`, {
                    fontFamily: "Arial",
                    fontSize: 16,
                    color: index === 0 ? "#ffd700" : index === 1 ? "#c0c0c0" : "#cd7f32", // Cores ouro, prata e bronze
                    stroke: "#000000",
                    strokeThickness: 2,
                    align: "center"
                });
                scoreText.setOrigin(0.5);
            }
        });
    }
}