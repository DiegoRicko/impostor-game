<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import type { Player } from '../types/game'

const store = useGameStore()

const votedPlayer = computed<Player | undefined>(() =>
  store.players.find((p: Player) => p.id === store.votedPlayerId)
)

const impostors = computed<Player[]>(() =>
  store.players.filter((p: Player) => p.isImpostor)
)

const isWin = computed(() =>
  votedPlayer.value && impostors.value.some(imp => imp.id === votedPlayer.value?.id)
)
</script>

<template>
  <div class="end-container">
    <div class="result-card">
      <h1 class="title">Resultado</h1>

      <div class="result-icon">
        {{ isWin ? '🎉' : '😈' }}
      </div>

      <h2 v-if="isWin" class="result-title win">
        ¡Atraparon al impostor!
      </h2>
      <h2 v-else class="result-title lose">
        El impostor escapó
      </h2>

      <div class="players-info">
        <div v-if="votedPlayer" class="info-item">
          <span class="info-label">Acusaron a:</span>
          <span class="info-value">{{ votedPlayer.name }}</span>
        </div>

        <div class="info-item impostor-reveal">
          <span class="info-label">{{ impostors.length > 1 ? 'Los impostores eran:' : 'El impostor era:' }}</span>
          <div class="impostors-list">
            <span v-for="imp in impostors" :key="imp.id" class="info-value impostor-name">
              {{ imp.name }}
              <!-- <span v-if="imp.clue" class="impostor-clue">({{ imp.clue }})</span> -->
            </span>
          </div>
        </div>
      </div>

      <button class="next-round-button" @click="store.resetForNextRound()">
        Nueva ronda
      </button>
    </div>
  </div>
</template>

<style scoped>
.end-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.result-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 3rem 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.result-icon {
  font-size: 6rem;
  margin-bottom: 1.5rem;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.result-title {
  font-size: 2.2rem;
  margin-bottom: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.result-title.win {
  color: #2ecc71;
}

.result-title.lose {
  color: #e74c3c;
}

.players-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.info-item {
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item.impostor-reveal {
  background: rgba(231, 76, 60, 0.2);
  border: 2px solid rgba(231, 76, 60, 0.5);
}

.info-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.info-value {
  font-size: 1.8rem;
  color: white;
  font-weight: bold;
}

.impostors-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

.impostor-name {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.impostor-clue {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: normal;
  font-style: italic;
}

.next-round-button {
  width: 100%;
  padding: 1.2rem;
  font-size: 1.4rem;
  background: rgba(52, 152, 219, 0.8);
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
}

.next-round-button:hover {
  background: rgba(52, 152, 219, 1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
}

.next-round-button:active {
  transform: translateY(0);
}

/* Responsive para móvil */
@media (max-width: 768px) {
  .end-container {
    padding: 1.5rem 1rem;
  }

  .result-card {
    padding: 2.5rem 1.5rem;
  }

  .title {
    font-size: 1.8rem;
  }

  .result-icon {
    font-size: 5rem;
  }

  .result-title {
    font-size: 1.8rem;
  }

  .info-value {
    font-size: 1.5rem;
  }

  .next-round-button {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .result-card {
    padding: 2rem 1rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .result-icon {
    font-size: 4rem;
  }

  .result-title {
    font-size: 1.5rem;
  }

  .info-label {
    font-size: 0.9rem;
  }

  .info-value {
    font-size: 1.3rem;
  }

  .next-round-button {
    font-size: 1.1rem;
  }
}
</style>
