<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import type { Player } from '../types/game'

const store = useGameStore()

const votedPlayer = computed<Player | undefined>(() =>
  store.players.find((p: Player) => p.id === store.votedPlayerId)
)

const impostor = computed<Player | undefined>(() =>
  store.players.find((p: Player) => p.isImpostor)
)
</script>

<template>
  <div>
    <h2>Resultado</h2>

    <p v-if="votedPlayer">
      Acusaron a: <strong>{{ votedPlayer.name }}</strong>
    </p>

    <p v-if="impostor">
      El impostor era: <strong>{{ impostor.name }}</strong>
    </p>

    <h3 v-if="votedPlayer?.id === impostor?.id">
      🎉 ¡Atraparon al impostor!
    </h3>
    <h3 v-else>
      😈 El impostor escapó
    </h3>

    <button @click="store.resetForNextRound()">
      Nueva ronda
    </button>
  </div>
</template>
