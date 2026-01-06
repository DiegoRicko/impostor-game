<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()
</script>

<template>
  <div>
    <h2>¿Quién es el impostor?</h2>

    <ul>
      <li v-for="p in store.players" :key="p.id">
        <button @click="store.vote(p.id)">
          {{ p.name }}
        </button>
      </li>
    </ul>
  </div>
</template>
