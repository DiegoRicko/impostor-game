<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()

const player = computed(() => {
  return store.players[store.currentPlayerIndex]
})

const isLastPlayer = computed(() => {
  return store.currentPlayerIndex === store.players.length - 1
})

// Estado de la cortina
const curtainRevealed = ref(false)
const curtainPosition = ref(0) // Posición en píxeles desde arriba
const isDragging = ref(false)
const startY = ref(0)
const hasSeenRole = ref(false) // Marca si el jugador ya vio su rol

// Resetear cortina cuando cambia de jugador
watch(() => store.currentPlayerIndex, () => {
  curtainRevealed.value = false
  curtainPosition.value = 0
  hasSeenRole.value = false
})

// Funciones de arrastre para mouse
const handleMouseDown = (e: MouseEvent) => {
  e.preventDefault()
  isDragging.value = true
  startY.value = e.clientY + curtainPosition.value

  // Agregar listeners globales
  document.addEventListener('mousemove', handleGlobalMouseMove)
  document.addEventListener('mouseup', handleGlobalMouseUp)
}

const handleGlobalMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return

  // Invertido: resta la posición Y para que suba cuando se arrastra hacia arriba
  const newPosition = startY.value - e.clientY
  if (newPosition >= 0) {
    curtainPosition.value = newPosition

    // Marcar que vio su rol si levantó la cortina lo suficiente
    if (newPosition > 150 && !hasSeenRole.value) {
      hasSeenRole.value = true
      curtainRevealed.value = true
    }
  }
}

const handleGlobalMouseUp = () => {
  isDragging.value = false

  // Limpiar listeners globales
  document.removeEventListener('mousemove', handleGlobalMouseMove)
  document.removeEventListener('mouseup', handleGlobalMouseUp)

  // Siempre hacer caer la cortina cuando se suelta
  curtainPosition.value = 0
}

// Funciones de arrastre para touch (móvil)
const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  if (!touch) return

  isDragging.value = true
  startY.value = touch.clientY + curtainPosition.value
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return

  const touch = e.touches[0]
  if (!touch) return

  // Invertido: resta la posición Y para que suba cuando se desliza hacia arriba
  const newPosition = startY.value - touch.clientY
  if (newPosition >= 0) {
    curtainPosition.value = newPosition

    // Marcar que vio su rol si levantó la cortina lo suficiente
    if (newPosition > 150 && !hasSeenRole.value) {
      hasSeenRole.value = true
      curtainRevealed.value = true
    }
  }
}

const handleTouchEnd = () => {
  isDragging.value = false

  // Siempre hacer caer la cortina cuando se suelta
  curtainPosition.value = 0
}

const handleNextPlayer = () => {
  store.nextPlayer()
}
</script>

<template>
  <div v-if="player" class="reveal-container">
    <!-- Contenido del rol (siempre visible debajo de la cortina) -->
    <div class="role-content">
      <div v-if="player.isImpostor" class="role-info impostor">
        <h3>🕵️ Eres el IMPOSTOR</h3>
        <p class="clue">Pista: {{ store.selectedClue }}</p>
      </div>

      <div v-else class="role-info player">
        <h3>No eres el impostor</h3>
        <p class="word">Palabra secreta: <strong>{{ store.selectedWord }}</strong></p>
      </div>
    </div>

    <!-- Cortina que cubre el contenido -->
    <div
      class="curtain"
      :class="{ dragging: isDragging }"
      :style="{ transform: `translateY(-${curtainPosition}px)` }"
      @mousedown="handleMouseDown"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <h2 class="player-name">{{ player.name }}</h2>
      <p class="instruction">Arrastra hacia arriba para revelar tu rol</p>
      <div class="curtain-handle">
        <div class="arrow-up">▲</div>
        <div class="arrow-up">▲</div>
        <div class="arrow-up">▲</div>
      </div>
    </div>

    <!-- Botón que solo aparece después de revelar la cortina -->
    <button
      v-if="curtainRevealed"
      class="next-button"
      :style="{ transform: `translate(-50%, calc(-${curtainPosition}px - 60px))` }"
      @click="handleNextPlayer"
    >
      {{ isLastPlayer ? 'Iniciar partida' : 'Siguiente jugador' }}
    </button>
  </div>
</template>

<style scoped>
.reveal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.role-content {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;
  padding: 2rem;
}

.role-info h3 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.role-info.impostor h3 {
  color: #e74c3c;
  text-shadow: 0 0 10px rgba(231, 76, 60, 0.3);
}

.role-info.player h3 {
  color: #2ecc71;
  text-shadow: 0 0 10px rgba(46, 204, 113, 0.3);
}

.clue {
  font-size: 1.5rem;
  color: #ffffff;
  font-style: italic;
  padding: 1.5rem;
  background: rgba(231, 76, 60, 0.3);
  border: 2px solid #e74c3c;
  border-radius: 12px;
  font-weight: 500;
}

.word {
  font-size: 1.5rem;
  color: #ffffff;
  padding: 1.5rem;
  background: rgba(46, 204, 113, 0.3);
  border: 2px solid #2ecc71;
  border-radius: 12px;
  font-weight: 500;
}

.word strong {
  font-size: 2.2rem;
  display: block;
  margin-top: 0.5rem;
  color: #2ecc71;
  font-weight: bold;
}

.curtain {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: grab;
  touch-action: none;
  user-select: none;
  transition: transform 0.3s ease-out;
}

.curtain.dragging {
  transition: none;
  cursor: grabbing;
}

.curtain-handle {
  position: absolute;
  bottom: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}

.arrow-up {
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.9);
  animation: arrowBounce 1.5s infinite;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.arrow-up:nth-child(2) {
  animation-delay: 0.2s;
}

.arrow-up:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes arrowBounce {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.player-name {
  font-size: 3.5rem;
  color: white;
  margin: 0;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
  font-weight: bold;
}

.instruction {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 1);
  margin-top: 2.5rem;
  animation: bounce 2s infinite;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.next-button {
  position: absolute;
  bottom: 40px;
  left: 50%;
  z-index: 20;
  padding: 1.2rem 2.5rem;
  font-size: 1.3rem;
  background: #000000;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.2s ease, background 0.2s ease;
  animation: fadeIn 0.5s ease;
  font-weight: 600;
}

.next-button:hover {
  background: #1a1a1a;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.next-button:active {
  background: #0a0a0a;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Estilos responsive para móvil */
@media (max-width: 768px) {
  .player-name {
    font-size: 2.5rem;
  }

  .instruction {
    font-size: 1.1rem;
    padding: 0 1rem;
  }

  .curtain-handle {
    bottom: 30px;
  }

  .arrow-up {
    font-size: 1.5rem;
  }

  .role-info h3 {
    font-size: 1.5rem;
  }

  .clue, .word {
    font-size: 1.2rem;
    padding: 1.2rem;
  }

  .word strong {
    font-size: 1.8rem;
  }

  .next-button {
    bottom: 30px;
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .player-name {
    font-size: 2rem;
  }

  .instruction {
    font-size: 1rem;
  }

  .arrow-up {
    font-size: 1.3rem;
    gap: 10px;
  }

  .role-info h3 {
    font-size: 1.3rem;
  }

  .clue, .word {
    font-size: 1.1rem;
    padding: 1rem;
  }

  .word strong {
    font-size: 1.5rem;
  }

  .next-button {
    bottom: 20px;
    padding: 0.9rem 1.8rem;
    font-size: 1rem;
  }
}
</style>

