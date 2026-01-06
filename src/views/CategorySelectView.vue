<script setup lang="ts">
import { CATEGORIES } from '../data/categories'
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()
</script>

<template>
  <div>
    <h2>Selecciona una categoría</h2>

    <button
      v-for="c in CATEGORIES"
      :key="c.id"
      @click="store.selectCategory(c.id)"
    >
      {{ c.name }}
    </button>
  </div>
</template>
