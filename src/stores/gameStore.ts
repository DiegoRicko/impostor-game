import { defineStore } from 'pinia'
import type { Player, GamePhase } from '../types/game'

export const useGameStore = defineStore('game', {
  state: () => ({
    players: [] as Player[],
    phase: 'SETUP' as GamePhase,
  }),

  actions: {
    addPlayer(name: string) {
      if (!name.trim()) return
      this.players.push({
        id: Date.now(),
        name,
      })
    },

    removePlayer(id: number) {
      this.players = this.players.filter(p => p.id !== id)
    },

    startGame() {
      if (this.players.length < 3) return
      this.phase = 'ROLE_REVEAL'
    },
  },
})
