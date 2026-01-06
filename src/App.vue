<script setup lang="ts">
import { useGameStore } from './stores/gameStore'
import SetupView from './views/SetupView.vue'
import CategorySelectView from './views/CategorySelectView.vue'
import RoleRevealView from './views/RoleRevealView.vue'
import PlayingView from './views/PlayingView.vue'
import VotingView from './views/VotingView.vue'
import EndView from './views/EndView.vue'

const store = useGameStore()
</script>

<template>
  <SetupView v-if="store.phase === 'SETUP'" />
  <CategorySelectView v-if="store.phase === 'CATEGORY_SELECT'" />
  <RoleRevealView v-if="store.phase === 'ROLE_REVEAL'" />
  <PlayingView v-if="store.phase === 'PLAYING'" />
  <VotingView v-if="store.phase === 'VOTING'" />
  <EndView v-if="store.phase === 'END'" />
</template>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
