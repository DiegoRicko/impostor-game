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

    impostorCount: 1, // Número de impostores (1-3)

  }),

  getters: {
    maxImpostors(): number {
      return Math.max(1, this.players.length - 1)
    },

    impostorError(): string | null {
      if (this.players.length === 0) return null
      if (this.impostorCount >= this.players.length) {
        return 'El número de impostores debe ser menor al total de jugadores'
      }
      return null
    },

    actualTimer(): number {
      return this.roundDuration
    },
  },

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

      // Ajustar automáticamente el número de impostores si es necesario
      const maxImpostors = Math.max(1, this.players.length - 1)
      if (this.impostorCount >= maxImpostors) {
        this.impostorCount = Math.max(1, maxImpostors)
      }
    },

    setTimer(time: number) {
      const MIN = 60
      const MAX = 300
      this.roundDuration = Math.min(MAX, Math.max(MIN, time))
    },

    blockInvalidKeys(e: KeyboardEvent) {
      const allowedKeys = [
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'Tab',
        'Enter'
      ]

      if (allowedKeys.includes(e.key)) return

      // Solo números
      if (!/^\d$/.test(e.key)) {
        e.preventDefault()
      }
    },

    blockInvalidPaste(e: ClipboardEvent) {
      const pasted = e.clipboardData?.getData('text') ?? ''
      if (!/^\d+$/.test(pasted)) {
        e.preventDefault()
      }
    },

    startGame() {
      if (this.players.length < 3) return
      // Validar que el número de impostores sea válido
      if (this.impostorCount >= this.players.length) {
        this.impostorCount = Math.max(1, this.players.length - 1)
      }
      this.phase = 'CATEGORY_SELECT'
    },

    selectCategory(categoryId: string) {
      this.selectedCategoryId = categoryId

      const category = CATEGORIES.find(c => c.id === categoryId)
      if (!category) return

      const selected =
        category.words[Math.floor(Math.random() * category.words.length)]!

      this.selectedWord = selected.word
      // Seleccionar una pista aleatoria del array de pistas
      const randomClueIndex = Math.floor(Math.random() * selected.clues.length)
      this.selectedClue = selected.clues[randomClueIndex]!

      // Elegir múltiples impostores
      const actualImpostorCount = Math.min(this.impostorCount, this.players.length - 1, 3)
      const impostorIndices: number[] = []

      // Seleccionar índices aleatorios únicos para los impostores
      while (impostorIndices.length < actualImpostorCount) {
        const randomIndex = Math.floor(Math.random() * this.players.length)
        if (!impostorIndices.includes(randomIndex)) {
          impostorIndices.push(randomIndex)
        }
      }

      // Crear array de pistas disponibles (excluyendo la pista ya seleccionada)
      const availableClues = selected.clues.filter((_, idx) => idx !== randomClueIndex)

      // Asignar roles y pistas
      this.players.forEach((p, i) => {
        const isImpostor = impostorIndices.includes(i)
        p.isImpostor = isImpostor

        if (isImpostor && availableClues.length > 0) {
          // Dar una pista diferente a cada impostor
          const clueIndex = impostorIndices.indexOf(i) % availableClues.length
          p.clue = availableClues[clueIndex]
        } else if (!isImpostor) {
          // Los jugadores normales reciben la pista principal
          p.clue = this.selectedClue
        }
      })

      this.currentPlayerIndex = 0
      this.phase = 'ROLE_REVEAL'
    },

    selectRandomCategory() {
      const randomIndex = Math.floor(Math.random() * CATEGORIES.length)
      const randomCategory = CATEGORIES[randomIndex]!
      this.selectCategory(randomCategory.id)
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
        this.players.forEach(p => {
          p.isImpostor = false
          p.clue = undefined
        })
        this.selectedWord = ''
        this.selectedClue = ''
        this.selectedCategoryId = ''
        this.phase = 'CATEGORY_SELECT'
    },

    mainMenu() {
        this.votedPlayerId = null
        this.startingPlayerId = null
        this.currentPlayerIndex = 0
        this.players.forEach(p => {
          p.isImpostor = false
          p.clue = undefined
        })
        this.selectedWord = ''
        this.selectedClue = ''
        this.selectedCategoryId = ''
        this.phase = 'SETUP'
    },

    cancelRound() {
        this.votedPlayerId = null
        this.startingPlayerId = null
        this.currentPlayerIndex = 0
        this.players.forEach(p => {
          p.isImpostor = false
          p.clue = undefined
        })
        this.selectedWord = ''
        this.selectedClue = ''
        this.selectedCategoryId = ''
        this.phase = 'CATEGORY_SELECT'
        if (this.timerId) {
            clearInterval(this.timerId)
            this.timerId = null
        }
    },

    setImpostorCount(count: number) {
      if (count >= 1 && count <= 3) {
        this.impostorCount = count
      }
    },
  },
})