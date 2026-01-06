<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()
</script>

<template>
  <div class="voting-container">
    <h1 class="title">¿Quién es el impostor?</h1>
    <p class="subtitle">Voten por el jugador sospechoso</p>

    <div class="players-grid">
      <button
        v-for="p in store.players"
        :key="p.id"
        class="player-vote-button"
        @click="store.vote(p.id)"
      >
        <span class="player-icon">🕵️</span>
        <span class="player-name">{{ p.name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.voting-container {
  max-width: 700px;
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

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.2rem;
}

.player-vote-button {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  min-height: 120px;
  justify-content: center;
}

.player-vote-button:hover {
  background: rgba(231, 76, 60, 0.3);
  border-color: rgba(231, 76, 60, 0.6);
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 10px 30px rgba(231, 76, 60, 0.4);
}

.player-vote-button:active {
  transform: translateY(-2px) scale(1.02);
}

.player-icon {
  font-size: 2.5rem;
}

.player-name {
  font-size: 1.3rem;
  color: white;
  font-weight: 600;
}

/* Responsive para móvil */
@media (max-width: 768px) {
  .voting-container {
    padding: 1.5rem 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .players-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .player-vote-button {
    padding: 1.2rem;
    min-height: 100px;
  }

  .player-icon {
    font-size: 2rem;
  }

  .player-name {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.8rem;
  }

  .player-vote-button {
    min-height: 90px;
  }

  .player-icon {
    font-size: 1.8rem;
  }

  .player-name {
    font-size: 1.1rem;
  }
}
</style>
