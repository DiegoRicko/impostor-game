<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()
const playerName = ref('')
</script>

<template>
  <div class="setup-container">
    <h1 class="title">Impostor Game</h1>
    <h2 class="subtitle">Configuración de jugadores</h2>

    <div class="input-group">
      <input
        v-model="playerName"
        placeholder="Nombre del jugador"
        class="player-input"
        @keyup.enter="store.addPlayer(playerName); playerName = ''"
      />

      <button
        class="add-button"
        @click="store.addPlayer(playerName); playerName = ''"
      >
        Agregar
      </button>
    </div>

    <div class="players-list">
      <div
        v-for="p in store.players"
        :key="p.id"
        class="player-item"
      >
        <span class="player-name-text">{{ p.name }}</span>
        <button
          class="remove-button"
          @click="store.removePlayer(p.id)"
        >
          ❌
        </button>
      </div>
    </div>

    <p v-if="store.players.length < 3" class="hint">
      Necesitas al menos 3 jugadores para comenzar
    </p>

    <button
      class="start-button"
      :disabled="store.players.length < 3"
      @click="store.startGame()"
    >
      Iniciar juego ({{ store.players.length }}/3)
    </button>
  </div>
</template>

<style scoped>
.setup-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: white;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.player-input {
  flex: 1;
  padding: 0.8rem 1.2rem;
  font-size: 1.1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.player-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.player-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.add-button {
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  font-weight: 600;
}

.add-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.add-button:active {
  transform: scale(0.95);
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 2rem;
  min-height: 100px;
}

.player-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.player-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.player-name-text {
  font-size: 1.2rem;
  color: white;
  font-weight: 500;
}

.remove-button {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 0.2rem;
}

.remove-button:hover {
  transform: scale(1.2);
}

.remove-button:active {
  transform: scale(0.9);
}

.hint {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin-bottom: 1rem;
  font-style: italic;
}

.start-button {
  width: 100%;
  padding: 1.2rem;
  font-size: 1.3rem;
  background: rgba(46, 204, 113, 0.8);
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
  box-shadow: 0 6px 20px rgba(46, 204, 113, 0.3);
}

.start-button:hover:not(:disabled) {
  background: rgba(46, 204, 113, 1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.4);
}

.start-button:active:not(:disabled) {
  transform: translateY(0);
}

.start-button:disabled {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
  box-shadow: none;
}

/* Responsive para móvil */
@media (max-width: 768px) {
  .setup-container {
    padding: 1.5rem 1rem;
  }

  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .input-group {
    flex-direction: column;
  }

  .player-input, .add-button {
    font-size: 1rem;
  }

  .player-name-text {
    font-size: 1.1rem;
  }

  .start-button {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}
</style>
