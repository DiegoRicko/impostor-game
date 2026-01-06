<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()
const playerName = ref('')
</script>

<template>
  <div>
    <h2>Configuración de jugadores</h2>

    <input
      v-model="playerName"
      placeholder="Nombre del jugador"
    />

    <button @click="store.addPlayer(playerName); playerName = ''">
      Agregar
    </button>

    <ul>
      <li v-for="p in store.players" :key="p.id">
        {{ p.name }}
        <button @click="store.removePlayer(p.id)">❌</button>
      </li>
    </ul>

    <button
      :disabled="store.players.length < 3"
      @click="store.startGame()"
    >
      Iniciar juego
    </button>
  </div>
</template>
