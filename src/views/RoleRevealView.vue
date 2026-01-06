<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()

const player = computed(() => {
  return store.players[store.currentPlayerIndex]
})
</script>

<template>
  <div v-if="player">
    <h2>Turno de {{ player.name }}</h2>

    <div v-if="player.isImpostor">
      <h3>🕵️ Eres el IMPOSTOR</h3>
      <p>Pista: {{ store.selectedClue }}</p>
    </div>

    <div v-else>
      <h3>😊 No eres el impostor</h3>
      <p>Palabra secreta: {{ store.selectedWord }}</p>
    </div>

    <button @click="store.nextPlayer()">
      Siguiente jugador
    </button>
  </div>
</template>

