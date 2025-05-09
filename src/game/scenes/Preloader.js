export class Preloader extends Phaser.Scene {
    constructor() {
        super("Preloader");

        this.loadText;
    }

    preload() {
        this.load.setBaseURL("http://localhost:8080");
        this.load.image("running-1", "assets/running-1.png");
        this.load.image("running-2", "assets/running-2.png");
        this.load.image("jumping", "assets/jumping.png");
        this.load.image("road", "assets/road.png");
        this.load.image("cloud", "assets/cloud.png");
        this.load.image("crouching-1", "assets/crouch-1.png");
        this.load.image("crouching-2", "assets/crouch-2.png");
    }

    create() {
        //  Create our global animations
        this.anims.create({
            key: "running",
            frames: [{ key: "running-1" }, { key: "running-2" }],
            frameRate: 10,
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
            frameRate: 10,
            repeat: -1,
        })

        this.scene.start("MainMenu");
    }
}
