export type Player = {
  id: number
  name: string
  isImpostor: boolean
  clue?: string // Pista específica para cada jugador
}

export type GamePhase =
  | 'SETUP'
  | 'GAME_CONFIG'
  | 'CATEGORY_SELECT'
  | 'ROLE_REVEAL'
  | 'PLAYING'
  | 'VOTING'
  | 'END'
