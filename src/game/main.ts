import { AUTO, Game } from "phaser";

import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";

export const GLOBAL_GRAVITY_Y = 300

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: "game-container",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 640,
        height: 360,
    },
    backgroundColor: "#353946",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: GLOBAL_GRAVITY_Y },
            debug: false,
        },
    },
    scene: [Boot, MainMenu, MainGame, GameOver],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
