export class Preloader extends Phaser.Scene {
    constructor() {
        super("Preloader");

        this.loadText;
    }

    preload() {
        this.load.setBaseURL("http://localhost:8080");
        this.load.image("running-1", "assets/running-1.png");
        this.load.image("running-2", "assets/running-2.png");
        this.load.image("running-special-1", "assets/running-special-1.png");
        this.load.image("running-special-2", "assets/running-special-2.png");
        this.load.image("jumping", "assets/jumping.png");
        this.load.image("road", "assets/road.png");
        this.load.image("cloud", "assets/cloud.png");
        this.load.image("crouching-1", "assets/crouch-1.png");
        this.load.image("crouching-2", "assets/crouch-2.png");

        // Hit e Game Over
        this.load.image("hit", "assets/hit.png");
        this.load.image("game-over", "assets/game-over.png");
        this.load.image("game-over-1", "assets/game-over-1.png");
        this.load.image("game-over-2", "assets/game-over-2.png");

        // Bugs/Enemies
        this.load.image("beetle", "assets/beetle.png");
        this.load.image("cockroach", "assets/cockroach.png");
        this.load.image("ladybug", "assets/ladybug.png");
        this.load.image("moth-1", "assets/moth-1.png");
        this.load.image("moth-2", "assets/moth-2.png");

        // Pato especial
        this.load.image("duck", "assets/duck.png");
    }

    create() {
        //  Create our global animations
        this.anims.create({
            key: "running",
            frames: [{ key: "running-1" }, { key: "running-2" }],
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: "running-special",
            frames: [
                { key: "running-special-1" },
                { key: "running-special-2" },
            ],
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: "jumping",
            frames: [{ key: "jumping" }],
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "crouching",
            frames: [{ key: "crouching-1" }, { key: "crouching-2" }],
            frameRate: 5,
            repeat: -1,
        });

        // Animação do panda morto
        this.anims.create({
            key: "dead",
            frames: [{ key: "game-over" }, { key: "game-over-2" }],
            frameRate: 3,
            repeat: -1,
        });

        // Animação da mariposa
        this.anims.create({
            key: "moth-flying",
            frames: [{ key: "moth-1" }, { key: "moth-2" }],
            frameRate: 8,
            repeat: -1,
        });

        this.scene.start("MainMenu");
    }
}
