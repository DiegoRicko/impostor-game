export type Player = {
  id: number
  name: string
  isImpostor: boolean
}

export type GamePhase =
  | 'SETUP'
  | 'CATEGORY_SELECT'
  | 'ROLE_REVEAL'
  | 'PLAYING'
  | 'VOTING'
  | 'END'
