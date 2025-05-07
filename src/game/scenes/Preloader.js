export class Preloader extends Phaser.Scene {
    constructor() {
        super("Preloader");

        this.loadText;
    }

    preload() {
        this.load.setBaseURL("http://localhost:8080");
        this.loadText = this.add.text(512, 360, "Loading ...", {
            fontFamily: "Arial",
            fontSize: 74,
            color: "#e3f2ed",
        });
        this.loadText.setOrigin(0.5);
        this.loadText.setStroke("#203c5b", 6);
        this.loadText.setShadow(2, 2, "#2d2d2d", 4, true, false);

        this.load.image("running-1", "assets/running-1.png");
        this.load.image("running-2", "assets/running-2.png");
        this.load.image("jumping", "assets/jumping.png");
        this.load.image("crouch-1", "assets/crouch-1.png");
        this.load.image("crouch-2", "assets/crouch-2.png");
        this.load.image("road", "assets/road.png");
        this.load.image("ladybug", "assets/ladybug.png");
        this.load.image("moth-1", "assets/moth-1.png");
        this.load.image("moth-2", "assets/moth-2.png");
        this.load.image("beetle", "assets/beetle.png");
        this.load.image("cockroach", "assets/cockroach.png");
        this.load.image("hit", "assets/hit.png");
        this.load.image("zero-8", "assets/zero-8.png");
        this.load.image("zero-16", "assets/zero-16.png");
        this.load.image("zero-24", "assets/zero-24.png");
        this.load.image("one-8", "assets/one-8.png");
        this.load.image("one-16", "assets/one-16.png");
        this.load.image("duck", "assets/duck.png");
        this.load.image("running-special-1", "assets/running-special-1.png");
        this.load.image("running-special-2", "assets/running-special-2.png");
        this.load.image("game-over-1", "assets/game-over-1.png");
        this.load.image("game-over", "assets/game-over.png");
        this.load.image("moon", "assets/moon.png");
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
            frameRate: 1,
            repeat: 0,
        });

        this.anims.create({
            key: "crouching",
            frames: [{ key: "crouch-1" }, { key: "crouch-2" }],
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "hit",
            frames: [{ key: "hit" }],
            frameRate: 1,
            repeat: -1,
        });

        this.anims.create({
            key: "zero-hit",
            frames: [
                { key: "zero-8" },
                { key: "zero-16" },
                { key: "zero-24" }
            ],
            frameRate: 1.5, // 3 frames em 2 segundos (cada frame ~0.66s)
            repeat: 0,
        });

        this.anims.create({
            key: "running-special",
            frames: [
                { key: "running-special-1" },
                { key: "running-special-2" }
            ],
            frameRate: 10,
            repeat: -1,
        });

        this.scene.start("MainMenu");
    }
}
