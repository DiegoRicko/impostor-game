<script setup lang="ts">
import { CATEGORIES } from '../data/categories'
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()
</script>

<template>
  <div class="category-container">
    <h1 class="title">Selecciona una categoría</h1>
    <p class="subtitle">Elige el tema para esta ronda</p>

    <div class="categories-grid">
      <button
        v-for="c in CATEGORIES"
        :key="c.id"
        class="category-button"
        @click="store.selectCategory(c.id)"
      >
        <span class="category-name">{{ c.name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.category-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: white;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.category-button {
  padding: 2rem;
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  font-weight: 600;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-button:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.category-button:active {
  transform: translateY(-2px) scale(1.02);
}

.category-name {
  font-size: 1.8rem;
}

/* Responsive para móvil */
@media (max-width: 768px) {
  .category-container {
    padding: 1.5rem 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .categories-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .category-button {
    padding: 1.5rem;
    font-size: 1.3rem;
    min-height: 100px;
  }

  .category-name {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.8rem;
  }

  .category-button {
    padding: 1.2rem;
    min-height: 80px;
  }

  .category-name {
    font-size: 1.3rem;
  }
}
</style>
