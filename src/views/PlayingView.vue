<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()
</script>

<template>
  <div>
    <h2>Ronda en curso</h2>

    <h1>{{ store.timeLeft }}s</h1>

    <p>Describan la palabra sin decirla…</p>
  </div>
</template>
