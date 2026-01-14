<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()
const playerName = ref('')
</script>

<template>
  <div class="setup-container">
    <div class="setup-content">
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

      <!-- Contenedor scrolleable para la lista de jugadores -->
      <div class="players-list-container">
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
      </div>

      <!-- Contenedor fijo para advertencias y mensajes -->
      <div class="messages-container">
        <p v-if="store.players.length < 3" class="hint">
          Necesitas al menos 3 jugadores para comenzar
        </p>
        <p v-else class="hint success">
          ¡Listo! Ahora configura el juego
        </p>
      </div>

      <button
        class="next-button"
        :disabled="store.players.length < 3"
        @click="store.goToGameConfig()"
      >
        Siguiente ({{ store.players.length }}/3)
      </button>
    </div>
  </div>
</template>

<style scoped>
.setup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 2rem 1rem;
  box-sizing: border-box;
}

.setup-content {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: white;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.subtitle {
  font-size: 1rem;
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

.input-group {
  display: flex;
  gap: 0.5rem;
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

/* Contenedor scrolleable para la lista de jugadores */
.players-list-container {
  max-height: 350px;
  min-height: 150px;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 0.8rem;
  backdrop-filter: blur(10px);
}

.players-list-container::-webkit-scrollbar {
  width: 8px;
}

.players-list-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.players-list-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.players-list-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

/* Contenedor fijo para mensajes de advertencia */
.messages-container {
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  font-style: italic;
  margin: 0;
}

.hint.success {
  color: rgba(46, 204, 113, 0.9);
  font-weight: 600;
}

.next-button {
  width: 100%;
  padding: 1.2rem;
  font-size: 1.3rem;
  background: rgba(52, 152, 219, 0.8);
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
}

.next-button:hover:not(:disabled) {
  background: rgba(52, 152, 219, 1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
}

.next-button:active:not(:disabled) {
  transform: translateY(0);
}

.next-button:disabled {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
  box-shadow: none;
}

/* Responsive para móvil */
@media (max-width: 768px) {
  .setup-container {
    padding: 1.5rem 1rem;
    align-items: flex-start;
  }

  .setup-content {
    max-width: 100%;
    gap: 1.2rem;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .input-group {
    flex-direction: column;
  }

  .player-input, .add-button {
    font-size: 1rem;
  }

  .players-list-container {
    max-height: 250px;
  }

  .player-name-text {
    font-size: 1.1rem;
  }

  .messages-container {
    min-height: 35px;
  }

  .hint {
    font-size: 0.9rem;
  }

  .next-button {
    font-size: 1.1rem;
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .players-list-container {
    max-height: 220px;
  }
}
</style>
