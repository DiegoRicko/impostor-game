export type Player = {
  id: number
  name: string
}

export type GamePhase =
  | 'SETUP'
  | 'ROLE_REVEAL'
  | 'PLAYING'
  | 'VOTING'
  | 'END'
