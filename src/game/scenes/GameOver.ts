import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    finalScore: number = 0;
    scoreText: Phaser.GameObjects.Text;
    gameOverImage1: Phaser.GameObjects.Image;
    gameOverImage2: Phaser.GameObjects.Image;

    constructor ()
    {
        super('GameOver');
    }

    init (data: { score?: number })
    {
        // Recebe a pontuação da cena anterior
        this.finalScore = data.score || 0;
        
        // Salva a pontuação no ranking
        this.saveScore(this.finalScore);
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor('#0301AA'); // Cor de fundo azul escuro
        
        // Centraliza a tela
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        
        // Adiciona a imagem game-over-1.png no centro
        this.gameOverImage1 = this.add.image(centerX, centerY - 70, 'game-over-1');
        this.gameOverImage1.setOrigin(0.5);
        this.gameOverImage1.setScale(1); // Ajuste conforme necessário
        
        // Adiciona a imagem game-over.png abaixo com espaçamento aumentado (+30px acima, +30px abaixo)
        this.gameOverImage2 = this.add.image(centerX, centerY + 40, 'game-over');
        this.gameOverImage2.setOrigin(0.5);
        this.gameOverImage2.setScale(0.8); // Ajuste conforme necessário
        
        // Adiciona texto com a pontuação final (aumentado em +30px para respeitar o novo espaçamento)
        this.scoreText = this.add.text(centerX, centerY + 110, `Pontuação: ${this.finalScore}`, {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        });
        this.scoreText.setOrigin(0.5);
        
        // Adiciona instrução para reiniciar (ajustado também em +30px)
        const restartText = this.add.text(centerX, centerY + 140, 'Pressione ESPAÇO para reiniciar', {
            fontFamily: 'Arial',
            fontSize: 16,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        });
        restartText.setOrigin(0.5);
        
        // Adiciona animação de pulso no texto
        this.tweens.add({
            targets: restartText,
            scale: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        
        // Configura o evento de tecla para reiniciar
        this.input.keyboard?.on('keyup-SPACE', this.changeScene, this);
        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }

    // Método para salvar a pontuação no ranking
    saveScore(score: number) {
        if (score <= 0) return; // Não salva pontuações zeradas
        
        // Recupera as pontuações existentes ou cria um array vazio
        const highScores: number[] = JSON.parse(localStorage.getItem('pandaGameHighScores') || '[]');
        
        // Adiciona a nova pontuação
        highScores.push(score);
        
        // Ordena as pontuações em ordem decrescente
        highScores.sort((a, b) => b - a);
        
        // Mantém apenas as 3 melhores pontuações
        const topScores = highScores.slice(0, 3);
        
        // Salva de volta no localStorage
        localStorage.setItem('pandaGameHighScores', JSON.stringify(topScores));
    }
}
