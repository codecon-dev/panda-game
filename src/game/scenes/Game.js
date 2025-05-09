import { Scene } from "phaser";

import { EventBus } from "./../EventBus";

import Player from "./../gameobjects/Player";
import Cloud from "./../gameobjects/Cloud";

export class Game extends Scene {
    constructor() {
        super("Game");

        this.player;
        this.ground;
        this.score = 0;
        this.highScore = 0;
        this.scoreText;
        this.highScoreText;
        this.distanceTraveled = 0;
        this.baseSpeed = 2;
        this.currentSpeed = 2;
    }

    preload() {
        this.load.image("cloud", "assets/cloud.png");
        this.load.image("road", "assets/road.png");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor("#353946");

        // Load high score from local storage if available
        const storedHighScore = localStorage.getItem('pandaHighScore');
        if (storedHighScore) {
            this.highScore = parseInt(storedHighScore);
        }

        this.ground = this.add.tileSprite(
            this.scale.width / 2,
            this.scale.height - 50,
            this.scale.width,
            0,
            "road"
        );

        this.ground.setScale(1, 1);

        this.ground.setOrigin(0.5, 0.5);

        this.physics.add.existing(this.ground, true);

        this.player = new Player(this);

        this.physics.add.collider(this.player, this.ground);

        this.clouds = [];
        for (let i = 0; i < 5; i++) {
            const cloud = new Cloud(
                this,
                Phaser.Math.Between(100, this.scale.width),
                Phaser.Math.Between(50, this.scale.height / 3),
                "cloud"
            );
            this.clouds.push(cloud);
        }

        // Create score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '24px', 
            fill: '#FFF',
            stroke: '#000',
            strokeThickness: 4
        });
        this.scoreText.setDepth(10);

        // Create high score text
        this.highScoreText = this.add.text(16, 50, 'High Score: ' + this.highScore, { 
            fontSize: '18px', 
            fill: '#FFF',
            stroke: '#000',
            strokeThickness: 3
        });
        this.highScoreText.setDepth(10);

        // Reset score and speed
        this.score = 0;
        this.distanceTraveled = 0;
        this.currentSpeed = this.baseSpeed;

        EventBus.emit("current-scene-ready", this);
    }

    start() {
        this.score = 0;
        this.distanceTraveled = 0;
        this.currentSpeed = this.baseSpeed;
        this.scoreText.setText('Score: 0');
        
        this.player.start();
        this.clouds.forEach((cloud) => cloud.update());
    }

    update(time, delta) {
        // Update current speed before updating clouds
        this.currentSpeed = this.baseSpeed + (Math.floor(this.score / 100) * 0.1);
        
        // Update clouds with the new speed
        this.clouds.forEach((cloud) => cloud.update());

        if (this.ground) {
            // Update distance and score
            this.distanceTraveled += this.currentSpeed;
            
            // Every 10 pixels adds 1 point
            if (this.distanceTraveled >= 10) {
                this.score += Math.floor(this.distanceTraveled / 10);
                this.distanceTraveled %= 10; // Keep remainder for next update
                this.scoreText.setText('Score: ' + this.score);
            }
            
            this.ground.tilePositionX += this.currentSpeed;
        }

        if (this.player) {
            this.player.update();
        }
    }

    changeScene() {
        // Update high score if needed
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('pandaHighScore', this.highScore.toString());
        }
        
        this.scene.start("GameOver", { score: this.score });
    }
}
