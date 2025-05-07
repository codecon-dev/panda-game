import { Scene } from "phaser";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        // Define cor de fundo preta para a tela de boot
        this.cameras.main.setBackgroundColor('#000000');
        
        // Adiciona texto simples
        const bootText = this.add.text(this.scale.width / 2, this.scale.height / 2, "Iniciando...", {
            fontFamily: "Arial",
            fontSize: 24,
            color: "#ffffff",
        });
        bootText.setOrigin(0.5);
        
        this.load.image("sprites", "assets/sprite.png");
    }

    create() {
        this.scene.start("Preloader");
    }
}
