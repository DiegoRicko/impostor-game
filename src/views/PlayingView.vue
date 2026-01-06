<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()
</script>

<template>
  <div class="playing-container">
    <h2 class="subtitle">Ronda en curso</h2>

    <div class="timer-circle">
      <h1 class="timer">{{ store.timeLeft }}</h1>
      <span class="timer-label">segundos</span>
    </div>

    <p class="instruction">Describan la palabra sin decirla…</p>
    <p class="hint">El impostor debe intentar adivinar</p>
  </div>
</template>

<style scoped>
.playing-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.subtitle {
  font-size: 1.8rem;
  margin-bottom: 3rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

.timer-circle {
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 5px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
  }
}

.timer {
  font-size: 6rem;
  margin: 0;
  color: white;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  line-height: 1;
}

.timer-label {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.5rem;
}

.instruction {
  font-size: 1.8rem;
  color: white;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hint {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  font-style: italic;
}

/* Responsive para móvil */
@media (max-width: 768px) {
  .playing-container {
    padding: 1.5rem 1rem;
  }

  .subtitle {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .timer-circle {
    width: 220px;
    height: 220px;
  }

  .timer {
    font-size: 4.5rem;
  }

  .timer-label {
    font-size: 1rem;
  }

  .instruction {
    font-size: 1.5rem;
  }

  .hint {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .timer-circle {
    width: 180px;
    height: 180px;
  }

  .timer {
    font-size: 3.5rem;
  }

  .instruction {
    font-size: 1.3rem;
  }
}
</style>
