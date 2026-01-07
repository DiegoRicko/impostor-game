import { defineStore } from 'pinia'
import type { Player, GamePhase } from '../types/game'
import { CATEGORIES } from '../data/categories'

export const useGameStore = defineStore('game', {
  state: () => ({
    players: [] as Player[],
    phase: 'SETUP' as GamePhase,

    currentPlayerIndex: 0,

    selectedCategoryId: '' as string,
    selectedWord: '',
    selectedClue: '',

    roundDuration: 60,
    timeLeft: 0,
    timerId: null as number | null,

    votedPlayerId: null as number | null,
    startingPlayerId: null as number | null,

  }),

  actions: {
    addPlayer(name: string) {
      if (!name.trim()) return

      this.players.push({
        id: Date.now(),
        name,
        isImpostor: false,
      })
    },

    removePlayer(id: number) {
      this.players = this.players.filter(p => p.id !== id)
    },

    startGame() {
      if (this.players.length < 3) return
      this.phase = 'CATEGORY_SELECT'
    },

    selectCategory(categoryId: string) {
      this.selectedCategoryId = categoryId

      const category = CATEGORIES.find(c => c.id === categoryId)
      if (!category) return

      const selected =
        category.words[Math.floor(Math.random() * category.words.length)]!

      this.selectedWord = selected.word
      this.selectedClue = selected.clue

      // Elegir impostor
      const impostorIndex = Math.floor(Math.random() * this.players.length)
      this.players.forEach((p, i) => {
        p.isImpostor = i === impostorIndex
      })

      this.currentPlayerIndex = 0
      this.phase = 'ROLE_REVEAL'
    },

    nextPlayer() {
        if (this.currentPlayerIndex < this.players.length - 1) {
            this.currentPlayerIndex++
        } else {
            // Seleccionar jugador aleatorio para comenzar
            const randomIndex = Math.floor(Math.random() * this.players.length)
            this.startingPlayerId = this.players[randomIndex]!.id

            this.phase = 'PLAYING'
            this.startTimer()
        }
    },

    startTimer() {
        this.timeLeft = this.roundDuration

        if (this.timerId) {
            clearInterval(this.timerId)
        }

        this.timerId = window.setInterval(() => {
            if (this.timeLeft > 0) {
            this.timeLeft--
            } else {
            this.stopTimer()
            this.phase = 'VOTING'
            }
        }, 1000)
    },

    stopTimer() {
        if (this.timerId) {
            clearInterval(this.timerId)
            this.timerId = null
        }
    },

    endVoting() {
      // Al terminar votación → nueva ronda
      this.phase = 'CATEGORY_SELECT'
    },

    vote(playerId: number) {
        this.votedPlayerId = playerId
        this.stopTimer()
        this.phase = 'END'
    },

    resetForNextRound() {
        this.votedPlayerId = null
        this.startingPlayerId = null
        this.currentPlayerIndex = 0
        this.players.forEach(p => (p.isImpostor = false))
        this.selectedWord = ''
        this.selectedClue = ''
        this.selectedCategoryId = ''
        this.phase = 'CATEGORY_SELECT'
    },
  },
})