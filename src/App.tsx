import { useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "./game/PhaserGame";
import { Game } from "./game/scenes/Game";
import { MainMenu } from "./game/scenes/MainMenu";
import { GameOver } from "./game/scenes/GameOver";

function App() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [backgroundColor, setBackgroundColor] = useState("#000000");
    const [currentScene, setCurrentScene] = useState("MainMenu");
    const [lastClickTime, setLastClickTime] = useState(0);
    const [isCrouching, setIsCrouching] = useState(false);
    const [lastCrouchTime, setLastCrouchTime] = useState(0);

    const handleJump = () => {
        // Debounce para evitar cliques duplos
        const now = Date.now();
        if (now - lastClickTime < 300) {
            return;
        }
        setLastClickTime(now);

        if (phaserRef.current) {
            const scene = phaserRef.current.scene;

            // Se estamos no GameOver, reinicia o jogo
            if (scene && scene.scene.key === "GameOver") {
                const gameOverScene = scene as GameOver;
                gameOverScene.changeScene();
                return;
            }

            // Se estamos no MainMenu, navega para Game
            if (scene && scene.scene.key === "MainMenu") {
                const mainMenuScene = scene as MainMenu;
                mainMenuScene.changeScene();
                return;
            }

            // Se estamos na cena Game, executa o pulo
            if (scene && scene.scene.key === "Game") {
                const gameScene = scene as Game;
                if (gameScene.player && !gameScene.player.isHit) {
                    gameScene.player.jump();
                }
            }
        }
    };

    const handleCrouchStart = () => {
        const now = Date.now();
        if (now - lastCrouchTime < 100) return; // Debounce de 100ms
        setLastCrouchTime(now);

        if (!isCrouching) {
            setIsCrouching(true);
            if (phaserRef.current) {
                const scene = phaserRef.current.scene;
                if (scene && scene.scene.key === "Game") {
                    const gameScene = scene as Game;
                    if (gameScene.player && !gameScene.player.isHit) {
                        gameScene.player.crouch();
                    }
                }
            }
        }
    };

    const handleCrouchEnd = () => {
        if (isCrouching) {
            setIsCrouching(false);
            if (phaserRef.current) {
                const scene = phaserRef.current.scene;
                if (scene && scene.scene.key === "Game") {
                    const gameScene = scene as Game;
                    if (gameScene.player && !gameScene.player.isHit) {
                        gameScene.player.stopCrouching();
                    }
                }
            }
        }
    };

    const currentActiveScene = (scene: Phaser.Scene) => {
        setCurrentScene(scene.scene.key);

        // Muda cor de fundo baseada na cena
        if (scene.scene.key === "Game") {
            setBackgroundColor("#353946");
        } else if (scene.scene.key === "MainMenu") {
            setBackgroundColor("#000000");
        } else if (scene.scene.key === "GameOver") {
            setBackgroundColor("#0301AA");
        }
    };

    const getButtonText = () => {
        switch (currentScene) {
            case "GameOver":
                return "REINICIAR 🔄";
            case "MainMenu":
                return "INICIAR 🐼";
            default:
                return "PULAR 🐼";
        }
    };

    return (
        <div
            id="app"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: backgroundColor,
            }}
        >
            <PhaserGame
                ref={phaserRef}
                currentActiveScene={currentActiveScene}
            />
            <div style={{ marginTop: "20px" }}>
                {currentScene === "Game" ? (
                    // Dois botões durante o jogo
                    <div style={{ display: "flex", gap: "15px" }}>
                        <button
                            onClick={handleJump}
                            onContextMenu={(e) => e.preventDefault()}
                            style={{
                                padding: "15px 30px",
                                fontSize: "18px",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                userSelect: "none",
                                WebkitUserSelect: "none",
                                WebkitTapHighlightColor: "transparent",
                                WebkitTouchCallout: "none",
                                touchAction: "manipulation",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                    "#45a049")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                    "#4CAF50")
                            }
                        >
                            PULAR 🐼
                        </button>
                        <button
                            onMouseDown={handleCrouchStart}
                            onMouseUp={handleCrouchEnd}
                            onMouseLeave={handleCrouchEnd}
                            onTouchStart={(e) => {
                                e.preventDefault();
                                handleCrouchStart();
                            }}
                            onTouchEnd={(e) => {
                                e.preventDefault();
                                handleCrouchEnd();
                            }}
                            onTouchCancel={handleCrouchEnd}
                            onContextMenu={(e) => e.preventDefault()}
                            style={{
                                padding: "15px 30px",
                                fontSize: "18px",
                                backgroundColor: isCrouching
                                    ? "#FF9800"
                                    : "#2196F3",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                userSelect: "none",
                                WebkitUserSelect: "none",
                                WebkitTapHighlightColor: "transparent",
                                WebkitTouchCallout: "none",
                                touchAction: "manipulation",
                            }}
                        >
                            AGACHAR 🦆
                        </button>
                    </div>
                ) : (
                    // Botão único para menu e game over
                    <button
                        onClick={handleJump}
                        style={{
                            padding: "15px 30px",
                            fontSize: "18px",
                            backgroundColor:
                                currentScene === "GameOver"
                                    ? "#FF6B6B"
                                    : "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            WebkitTapHighlightColor: "transparent",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                currentScene === "GameOver"
                                    ? "#FF5252"
                                    : "#45a049")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                currentScene === "GameOver"
                                    ? "#FF6B6B"
                                    : "#4CAF50")
                        }
                    >
                        {getButtonText()}
                    </button>
                )}
            </div>
        </div>
    );
}

export default App;
