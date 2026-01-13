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

    <div class="impostor-selector">
      <label class="impostor-label">Número de impostores:</label>
      <div class="impostor-buttons">
        <button
          v-for="count in [1, 2, 3]"
          :key="count"
          :class="['impostor-count-btn', {
            active: store.impostorCount === count,
            disabled: count >= store.players.length
          }]"
          :disabled="count >= store.players.length"
          @click="store.setImpostorCount(count)"
        >
          {{ count }}
        </button>
      </div>
      <p v-if="store.impostorError" class="error-message">
        ⚠️ {{ store.impostorError }}
      </p>
      <p v-else-if="store.players.length > 0" class="info-message">
        Máximo de impostores: {{ store.maxImpostors }}
      </p>
    </div>

    <p v-if="store.players.length < 3" class="hint">
      Necesitas al menos 3 jugadores para comenzar
    </p>

    <div class="timer-config">
      <label class="timer-label">Duración de la ronda</label>

      <div class="timer-input-wrapper">

        <button class="arrow-btn" @click="store.roundDuration -= 10" :disabled="store.roundDuration <= 60">−</button>

        <input class="timer-input" 
          inputmode="numeric"
          pattern="[0-9]*"
          v-model.number= "store.roundDuration"
          @keydown="store.blockInvalidKeys"
          @paste="store.blockInvalidPaste"
          @keyup.enter="(isNaN(store.roundDuration) || !store.roundDuration || store.roundDuration < 60 || store.roundDuration > 300) ? store.roundDuration = 60 : store.roundDuration"
          @focusout="(isNaN(store.roundDuration) || !store.roundDuration || store.roundDuration < 60 || store.roundDuration > 300) ? store.roundDuration = 60 : store.roundDuration"
        />

        <button class="arrow-btn" @click="store.roundDuration += 10" :disabled="store.roundDuration >= 300">+</button>
      </div>
      <span class="timer-unit">segundos</span>
      <p class="timer-hint">
        Entre {{ 60 }} y {{ 300 }} segundos
      </p>
      <p v-if="isNaN(store.roundDuration) || store.roundDuration < 60 || store.roundDuration > 300" class="error-message">
        ⚠️ Segundos no validos
      </p>
    </div>

    <button
      class="start-button"
      :disabled="store.players.length < 3 || !!store.impostorError || isNaN(store.roundDuration) || !store.roundDuration || store.roundDuration < 60 || store.roundDuration > 300"
      @click="store.startGame()"
    >
      Iniciar juego ({{ store.players.length }}/3)
    </button>
  </div>
</template>

<style scoped>
.setup-container {
  width: 600px;
  margin: 0 auto;
  padding: 2rem;
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

.impostor-selector {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.impostor-label {
  display: block;
  text-align: center;
  font-size: 1.2rem;
  color: white;
  margin-bottom: 1rem;
  font-weight: 600;
}

.impostor-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.impostor-count-btn {
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
  font-weight: 700;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.impostor-count-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.impostor-count-btn.active {
  background: rgba(231, 76, 60, 0.8);
  border-color: rgba(231, 76, 60, 1);
  box-shadow: 0 0 20px rgba(231, 76, 60, 0.5);
  transform: scale(1.15);
}

.impostor-count-btn:active {
  transform: scale(0.95);
}

.impostor-count-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 0.8rem 1rem;
  background: rgba(231, 76, 60, 0.2);
  border: 2px solid rgba(231, 76, 60, 0.5);
  border-radius: 10px;
  color: #ff6b6b;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.info-message {
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  background: rgba(52, 152, 219, 0.15);
  border: 1px solid rgba(52, 152, 219, 0.3);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  text-align: center;
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

.timer-config {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.timer-label {
  font-weight: 600;
  color: #ddd;
  font-size: 1rem;
}

.timer-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.timer-input {
  width: 120px;
  padding: 0.6rem;
  font-size: 1.2rem;
  text-align: center;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.timer-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.timer-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.timer-unit {
  font-size: 1rem;
  color: #ffffff;
}

.timer-hint {
  font-size: 0.8rem;
  color: #ffffff;
}

.arrow-btn {
  width: 40px;
  height: 40px;
  padding: 0.8rem;
  align-content: center;
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

.arrow-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.arrow-btn:active {
  transform: scale(0.95);
}

.arrow-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Responsive para móvil */
@media (max-width: 768px) {
  .setup-container {
    width: 312px;
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

  .impostor-label {
    font-size: 1.1rem;
  }

  .impostor-count-btn {
    width: 55px;
    height: 55px;
    font-size: 1.3rem;
  }

  .error-message,
  .info-message {
    font-size: 0.85rem;
  }

  .start-button {
    font-size: 1.2rem;
  }

  .timer-input {
    font-size: 1rem;
  }

  .timer-unit {
    font-size: 0.8rem;
  }

  .timer-hint {
    font-size: 0.7rem;
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
