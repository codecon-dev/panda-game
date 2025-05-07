/**
 * Configurações globais do jogo
 * Este arquivo contém todas as configurações ajustáveis do jogo
 */

const GameConfig = {
    // Configurações de pontuação
    score: {
        // Pontos ganhos ao evitar um inseto
        basePoints: 10,
        // Pontos ganhos ao pegar um pato
        duckBonus: 50
    },

    // Configurações de inimigos
    enemies: {
        // Pontuação necessária para que as mariposas comecem a aparecer
        mothStartScore: 2000,
        
        // Configurações de spawn de inimigos (em milissegundos)
        spawnTime: {
            ladybug: { min: 1000, max: 3000 },
            moth: { min: 1500, max: 3500 },
            beetle: { min: 2000, max: 4000 },
            cockroach: { min: 2500, max: 4500 }
        }
    },

    // Configurações de power-ups
    powerUps: {
        // A cada quantos pontos verificar o aparecimento do pato
        duckCheckInterval: 100,
        // Porcentagem de chance do pato aparecer (1-100)
        duckSpawnChance: 3,
        // Duração do efeito especial do pato (em segundos)
        duckEffectDuration: 3
    },

    // Configurações de jogabilidade
    gameplay: {
        // Quantidade inicial de vidas
        startingLives: 10,
        // A cada quantos pontos aumentar a velocidade
        speedIncreaseInterval: 50,
        // Multiplicador de velocidade a cada aumento
        speedMultiplier: 1.02
    }
};

export default GameConfig; 