<script setup>
// Missatge d'estat per a les dades de Firestore: càrrega, sense dades o error.
defineProps({
  tipus: {
    type: String,
    required: true,
    validator: value => ['carregant', 'buit', 'error'].includes(value)
  },
  missatge: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div
    class="estat-dades"
    :class="`estat-${tipus}`"
    :role="tipus === 'error' ? 'alert' : 'status'"
  >
    <span v-if="tipus === 'carregant'" class="estat-spinner" aria-hidden="true"></span>
    <span v-else class="estat-icona" aria-hidden="true">
      {{ tipus === 'error' ? '!' : '∅' }}
    </span>
    <p>{{ missatge }}</p>
  </div>
</template>

<style scoped>
.estat-dades {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 28px 24px;
  border: 1px solid #e3ddd2;
  background: #f6f3ec;
  color: #555048;
  font-size: 13px;
}

.estat-dades p {
  margin: 0;
}

.estat-error {
  border-color: #d9a99a;
  background: #fbefea;
  color: #8a3b24;
}

.estat-icona {
  display: grid;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-weight: 700;
}

.estat-spinner {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border: 2px solid #ddd4c7;
  border-top-color: #87684f;
  border-radius: 50%;
  animation: girar 0.8s linear infinite;
}

@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}
</style>
