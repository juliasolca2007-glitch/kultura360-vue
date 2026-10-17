
<script setup>
import { ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import EstatDades from '../components/EstatDades.vue'

const route = useRoute()

// Document de la col·lecció "events" que correspon a l'id de la ruta
const event = ref(null)
const carregant = ref(true)
const errorCarrega = ref('')

async function carregarEsdeveniment(id) {
  carregant.value = true
  errorCarrega.value = ''
  event.value = null

  try {
    const snapshot = await getDoc(doc(db, 'events', String(id)))
    if (snapshot.exists()) {
      event.value = { id: snapshot.id, ...snapshot.data() }
    }
  } catch (error) {
    console.error('Error llegint Firestore:', error)
    errorCarrega.value = "No s'ha pogut carregar l'esdeveniment. Torna-ho a provar més tard."
  } finally {
    carregant.value = false
  }
}

watch(() => route.params.id, id => carregarEsdeveniment(id), { immediate: true })
</script>

<template>
  <main v-if="carregant || errorCarrega" class="detail-state section-wrap">
    <EstatDades
      v-if="carregant"
      tipus="carregant"
      missatge="Carregant l'esdeveniment..."
    />
    <EstatDades v-else tipus="error" :missatge="errorCarrega" />
  </main>

  <main v-else-if="event" class="detail-page">
    <section class="detail-hero">
      <img :src="event.image" :alt="event.title" />
      <div class="detail-hero-overlay"></div>

      <div class="detail-hero-content">
        <RouterLink to="/" class="detail-back">← Tornar a l'inici</RouterLink>
        <p class="eyebrow">{{ event.category }}</p>
        <h1>{{ event.title }}</h1>
        <p>{{ event.location }}</p>
      </div>
    </section>

    <section class="detail-body section-wrap">
      <div class="detail-main">
        <p class="eyebrow section-eyebrow">DESCOBREIX L'EXPERIÈNCIA</p>
        <h2>La cultura es viu, no només s'observa.</h2>
        <p class="detail-description">{{ event.description }}</p>
        <p class="detail-description">
          Kultura360 vol apropar-te a propostes culturals que et permetin
          descobrir noves idees, connectar amb altres persones i crear
          records que vagin més enllà del moment.
        </p>
      </div>

      <aside class="detail-info">
        <p class="eyebrow section-eyebrow">INFORMACIÓ</p>
        <div class="detail-info-row">
          <span>Categoria</span>
          <strong>{{ event.category }}</strong>
        </div>
        <div class="detail-info-row">
          <span>Ubicació</span>
          <strong>{{ event.location }}</strong>
        </div>
        <div class="detail-info-row">
          <span>Data</span>
          <strong>{{ event.date }}</strong>
        </div>
        <RouterLink to="/contacte" class="button button-dark">
          MÉS INFORMACIÓ <span>↗</span>
        </RouterLink>
      </aside>
    </section>

    <section class="detail-end">
      <p class="eyebrow">CONTINUA DESCOBRINT</p>
      <h2>Hi ha molt més<br /><em>per viure.</em></h2>
      <RouterLink to="/galeria" class="button button-light">
        EXPLORA LA GALERIA <span>↗</span>
      </RouterLink>
    </section>
  </main>

  <main v-else class="not-found section-wrap">
    <p class="eyebrow section-eyebrow">404 · EXPERIÈNCIA NO TROBADA</p>
    <h1>Aquesta pàgina<br />no existeix.</h1>
    <RouterLink to="/" class="button button-dark">
      TORNAR A L'INICI <span>↗</span>
    </RouterLink>
  </main>
</template>

<style scoped>
.detail-state {
  padding-top: 120px;
  padding-bottom: 120px;
}

.detail-hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 520px;
  overflow: hidden;
  padding: 80px 8%;
  color: white;
}

.detail-hero img,
.detail-hero-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.detail-hero img {
  object-fit: cover;
}

.detail-hero-overlay {
  background: linear-gradient(0deg, rgba(25, 24, 21, 0.85), rgba(25, 24, 21, 0.2));
}

.detail-hero-content {
  position: relative;
  z-index: 1;
}

.detail-hero-content h1 {
  margin: 12px 0;
  font-size: clamp(42px, 6vw, 80px);
  letter-spacing: -0.07em;
  line-height: 1;
}

.detail-back {
  display: inline-block;
  margin-bottom: 30px;
  color: white;
  font-size: 11px;
  letter-spacing: 0.08em;
}

.detail-body {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 60px;
  padding-top: 90px;
  padding-bottom: 90px;
}

.detail-main h2 {
  margin: 15px 0 25px;
  font-size: clamp(30px, 3.5vw, 46px);
  letter-spacing: -0.06em;
}

.detail-description {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.9;
}

.detail-info-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
}

.detail-info .button {
  margin-top: 30px;
}

.detail-end {
  padding: 90px 8%;
  background: var(--ink);
  color: var(--paper);
}

.detail-end h2 {
  margin: 15px 0 30px;
  font-size: clamp(40px, 6vw, 72px);
  letter-spacing: -0.07em;
  line-height: 1;
}

.not-found {
  padding-top: 120px;
  padding-bottom: 120px;
}

@media (max-width: 800px) {
  .detail-body {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
</style>
