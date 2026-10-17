<script setup>
// Targeta d'un esdeveniment. Rep les dades del pare (HomeView),
// que les ha llegit de Firestore. Només les mostra: no les modifica.
defineProps({
  id: {
    type: String,
    required: true
  },
  titol: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    default: 'CULTURA'
  },
  descripcio: {
    type: String,
    default: 'Descobreix una nova experiència cultural.'
  },
  imatge: {
    type: String,
    default: ''
  },
  data: {
    type: String,
    default: 'Properament'
  },
  numero: {
    type: Number,
    default: 0
  },
  index: {
    type: Number,
    default: 0
  }
})
</script>

<template>
  <RouterLink
    :to="`/esdeveniments/${id}`"
    class="event-card"
    :style="{ '--card-index': index }"
    :aria-label="`Descobreix ${titol}`"
  >
    <div class="event-image-wrap">
      <img
        v-if="imatge"
        :src="imatge"
        :alt="titol"
        class="event-image"
        loading="lazy"
      />
      <div v-else class="event-image-placeholder">
        K<span>360</span>
      </div>

      <span v-if="numero" class="event-number">
        {{ String(numero).padStart(2, '0') }}
      </span>
      <span class="event-arrow">↗</span>
      <span class="event-image-label">KULTURA360 SELECCIÓ</span>
    </div>

    <div class="event-copy">
      <p class="event-category">{{ categoria }}</p>
      <h3>{{ titol }}</h3>
      <p class="event-description">{{ descripcio }}</p>

      <div class="event-card-footer">
        <span>{{ data }}</span>
        <span class="event-read">DESCOBREIX ↗</span>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.event-card {
  display: block;
  min-width: 0;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  animation: card-appear 0.6s both;
  animation-delay: calc(var(--card-index) * 100ms);
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.event-image-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 4.6;
  background: #ddd4c7;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.event-image-placeholder {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: #87684f;
  font-size: 48px;
  font-weight: 700;
}

.event-card:hover .event-image,
.event-card:focus-visible .event-image {
  transform: scale(1.05);
}

.event-number {
  position: absolute;
  top: 15px;
  left: 15px;
  display: grid;
  width: 35px;
  height: 35px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.75);
  color: white;
  font-size: 10px;
}

.event-arrow {
  position: absolute;
  right: 15px;
  bottom: 15px;
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
  background: #f6f3ec;
  color: #24231f;
  font-size: 18px;
  transition: transform 0.25s;
}

.event-card:hover .event-arrow {
  transform: rotate(45deg);
}

.event-image-label {
  position: absolute;
  bottom: 20px;
  left: 15px;
  color: white;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.event-copy {
  padding-top: 20px;
}

.event-category {
  margin-bottom: 9px;
  color: #87684f;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.13em;
}

.event-copy h3 {
  margin-bottom: 9px;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(20px, 2.2vw, 27px);
  font-weight: 600;
  letter-spacing: -0.055em;
  line-height: 1.2;
}

.event-description {
  margin-bottom: 18px;
  color: #777168;
  font-size: 12px;
  line-height: 1.8;
}

.event-card-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-top: 13px;
  border-top: 1px solid #e3ddd2;
  color: #777168;
  font-size: 8px;
  letter-spacing: 0.07em;
}

.event-read {
  color: #24231f;
  font-weight: 700;
}

@media (max-width: 600px) {
  .event-image-wrap {
    aspect-ratio: 1.15;
  }

  .event-copy h3 {
    font-size: 25px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .event-card {
    animation: none;
  }
}
</style>
