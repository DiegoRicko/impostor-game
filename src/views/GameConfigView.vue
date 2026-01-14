<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()
</script>

<template>
  <div class="config-container">
    <div class="config-content">
      <button class="back-button" @click="store.backToPlayerSetup()">
          ← 
        </button>
      <h1 class="title">Configuración del juego</h1>
      <h2 class="subtitle">{{ store.players.length }} jugadores listos</h2> 

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
        <div class="impostor-messages">
          <p v-if="store.impostorError" class="error-message">
            ⚠️ {{ store.impostorError }}
          </p>
          <p v-else-if="store.players.length > 0" class="info-message">
            Máximo de impostores: {{ store.maxImpostors }}
          </p>
        </div>
      </div>

      <div class="timer-config">
        <label class="timer-label">Duración de la ronda</label>

        <div class="timer-input-wrapper">
          <button class="arrow-btn" @click="store.roundDuration -= 10" :disabled="store.roundDuration <= 60">−</button>

          <input class="timer-input"
            inputmode="numeric"
            pattern="[0-9]*"
            v-model.number="store.roundDuration"
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
        <div class="timer-messages">
          <p v-if="isNaN(store.roundDuration) || store.roundDuration < 60 || store.roundDuration > 300" class="error-message">
            ⚠️ Segundos no validos
          </p>
        </div>
      </div>

      <div class="button-group">
        <button
          class="start-button"
          :disabled="!!store.impostorError || isNaN(store.roundDuration) || !store.roundDuration || store.roundDuration < 60 || store.roundDuration > 300"
          @click="store.startGame()"
        >
          Iniciar juego
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 2rem 1rem;
  box-sizing: border-box;
}

.config-content {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: white;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.subtitle {
  font-size: 1.1rem;
  margin-bottom: 0;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  font-weight: 600;
}

.impostor-selector {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.impostor-messages {
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 0.8rem 1rem;
  background: rgba(231, 76, 60, 0.2);
  border: 2px solid rgba(231, 76, 60, 0.5);
  border-radius: 10px;
  color: #ff6b6b;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
  animation: shake 0.5s ease;
  margin: 0;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.info-message {
  padding: 0.6rem 1rem;
  background: rgba(52, 152, 219, 0.15);
  border: 1px solid rgba(52, 152, 219, 0.3);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
}

.timer-config {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.timer-messages {
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.button-group {
  display: flex;
  gap: 1rem;
}

.back-button {
  width: 56px;
  height: 56px;
  padding: 1rem;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
  display: block;
  margin-right: auto;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.back-button:active {
  transform: translateY(0);
}

.start-button {
  flex: 2;
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
  .config-container {
    padding: 1.5rem 1rem;
    align-items: flex-start;
  }

  .config-content {
    max-width: 100%;
    gap: 1.5rem;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .impostor-selector {
    padding: 1.2rem;
  }

  .impostor-label {
    font-size: 1.1rem;
  }

  .impostor-count-btn {
    width: 55px;
    height: 55px;
    font-size: 1.3rem;
  }

  .impostor-messages {
    min-height: 45px;
  }

  .error-message,
  .info-message {
    font-size: 0.85rem;
    padding: 0.6rem 0.8rem;
  }

  .timer-config {
    padding: 1.2rem;
  }

  .timer-input {
    font-size: 1rem;
    width: 100px;
  }

  .timer-unit {
    font-size: 0.9rem;
  }

  .timer-hint {
    font-size: 0.75rem;
  }

  .timer-messages {
    min-height: 45px;
  }

  .arrow-btn {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .button-group {
    flex-direction: column;
  }

  .back-button,
  .start-button {
    flex: 1;
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

  .impostor-count-btn {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}
</style>
