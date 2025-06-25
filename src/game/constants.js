// Constantes de altura para o jogo
export const HEIGHTS = {
    GROUND_VISUAL_Y: -50, // Altura da estrada visual
    GROUND_COLLISION_Y: -20, // Altura do chão de colisão invisível
    PLAYER_Y: -80, // Altura inicial do panda
    GROUND_BUGS_Y: -60, // Altura dos bugs do chão
    DUCK_Y: -40, // Altura do pato (mais baixo que os bugs)
    FLYING_BUGS_Y: -100, // Altura das mariposas
};

// Constantes de gameplay
export const GAMEPLAY = {
    BASE_GAME_SPEED: 0.7, // Velocidade base inicial (70% da velocidade)
    SPEED_INCREASE: 0.02, // Aumento de velocidade por milestone
    SPEED_MILESTONE: 100, // A cada quantos pontos aumenta a velocidade
    BUG_SPEED: 2, // Velocidade dos bugs
    BACKGROUND_SPEED: 2, // Velocidade do fundo
    BUG_SPACING_FIXED: 600, // Espaçamento fixo entre bugs (pixels) - reduzido
    BUG_SPACING_REDUCTION_SCORE: 1000, // A partir de quantos pontos reduz espaçamento
    BUG_SPACING_MIN: 300, // Espaçamento mínimo (quando fica mais difícil)
    BUG_SPACING_MAX: 2000, // Espaçamento máximo entre bugs
    INITIAL_BUG_DISTANCE: 600, // Distância inicial dos bugs
    INITIAL_BUG_SPACING: 600, // Espaçamento inicial entre bugs - reduzido
};
