
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import EventCard from '../components/EventCard.vue'
import EstatDades from '../components/EstatDades.vue'

const currentSlide = ref(0)

// Dades llegides de la col·lecció "events" de Firestore
const events = ref([])
const carregant = ref(true)
const errorCarrega = ref('')


const slides = [
  {
    small: 'CULTURA · ART · MÚSICA · EXPERIÈNCIES',
    line1: 'Hi ha coses',
    line2: "que s'han de",
    highlight: 'viure.',
    description:
      'Descobreix nous artistes, espais i experiències. Troba allò que et fa sentir que ets exactament on has de ser.',
    image:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=2200&q=90',
  },
  {
    small: 'ART · CREATIVITAT · NOVES MIRADES',
    line1: 'Mira el món',
    line2: 'des d’una altra',
    highlight: 'perspectiva.',
    description:
      'Deixa’t sorprendre per propostes creatives, noves idees i espais que et fan veure les coses de manera diferent.',
    image:
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=2200&q=85',
  },
  {
    small: 'DESCOBERTA · EMOCIÓ · COMUNITAT',
    line1: 'El millor',
    line2: 'encara està',
    highlight: 'per viure.',
    description:
      'Hi ha moments que no es poden explicar. Només cal trobar-los, compartir-los i deixar que passin.',
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=2200&q=85',
  },
]

let slideTimer

function goToSlide(index) {
  currentSlide.value = index
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

async function carregarEsdeveniments() {
  carregant.value = true
  errorCarrega.value = ''

  try {
    const consulta = query(collection(db, 'events'), orderBy('number'))
    const querySnapshot = await getDocs(consulta)

    events.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error llegint Firestore:', error)
    errorCarrega.value =
      "No s'han pogut carregar els esdeveniments. Torna-ho a provar més tard."
  } finally {
    carregant.value = false
  }
}

onMounted(() => {
  slideTimer = window.setInterval(nextSlide, 6500)
  carregarEsdeveniments()
})

onUnmounted(() => {
  window.clearInterval(slideTimer)
})
</script>

<template>
  <main class="home-page">
    <!-- HERO PRINCIPAL -->
    <section class="hero">
      <Transition name="hero-fade" mode="out-in">
        <img
          :key="slides[currentSlide].image"
          class="hero-photo"
          :src="slides[currentSlide].image"
          :alt="slides[currentSlide].small"
        />
      </Transition>

      <div class="hero-shade"></div>

      <div class="hero-content">
        <p class="eyebrow hero-eyebrow">
          <span class="eyebrow-dot"></span>
          {{ slides[currentSlide].small }}
        </p>

        <Transition name="text-fade" mode="out-in">
          <div :key="currentSlide" class="hero-copy">
            <h1>
              {{ slides[currentSlide].line1 }}<br />
              {{ slides[currentSlide].line2 }}<br />
              <em>{{ slides[currentSlide].highlight }}</em>
            </h1>

            <p class="hero-description">
              {{ slides[currentSlide].description }}
            </p>
          </div>
        </Transition>

        <a href="#descobreix" class="button button-light">
          DESCOBREIX LA CULTURA
          <span>↗</span>
        </a>
      </div>

      <div class="hero-bottom">
        <span>LA CULTURA, DES D'UNA ALTRA PERSPECTIVA</span>

        <div class="hero-controls">
          <button
            v-for="(slide, index) in slides"
            :key="slide.small"
            type="button"
            :class="{ active: currentSlide === index }"
            :aria-label="`Ves a la diapositiva ${index + 1}`"
            @click="goToSlide(index)"
          >
            <span></span>
          </button>

          <span class="hero-counter">
            0{{ currentSlide + 1 }} / 0{{ slides.length }}
          </span>
        </div>
      </div>
    </section>

    <!-- PRESENTACIÓ -->
    <section class="intro-section">
      <div class="intro-number">K — 360°</div>

      <div class="intro-copy">
        <p class="eyebrow section-eyebrow">MÉS QUE CULTURA</p>

        <h2>
          No es tracta només<br />
          de veure-hi.<br />
          <em>Es tracta de sentir-ho.</em>
        </h2>
      </div>

      <div class="intro-description">
        <p>
          Creiem en la cultura que et remou, que et connecta amb altres
          persones i que et descobreix mons que no sabies que existien.
        </p>

        <RouterLink to="/galeria" class="text-link">
          CONEIX EL NOSTRE UNIVERS <span>↗</span>
        </RouterLink>
      </div>
    </section>

    <!-- ESDEVENIMENTS DESTACATS -->
    <section id="descobreix" class="discover-section section-wrap">
      <div class="section-heading">
        <div>
          <p class="eyebrow section-eyebrow">INSPIRA'T I DESCOBREIX</p>
          <h2>Troba el que et <em>mou.</em></h2>
        </div>

        <RouterLink to="/galeria" class="text-link desktop-link">
          EXPLORA LA GALERIA <span>↗</span>
        </RouterLink>
      </div>

      <p class="section-description">
        Música, art i experiències que et conviden a sortir de la rutina
        i descobrir la cultura des d'una nova perspectiva.
      </p>

      <EstatDades
        v-if="carregant"
        tipus="carregant"
        missatge="Carregant esdeveniments..."
      />
      <EstatDades
        v-else-if="errorCarrega"
        tipus="error"
        :missatge="errorCarrega"
      />
      <EstatDades
        v-else-if="events.length === 0"
        tipus="buit"
        missatge="Encara no hi ha esdeveniments publicats."
      />

      <div v-else class="event-grid">
        <EventCard
          v-for="(event, index) in events"
          :key="event.id"
          :id="event.id"
          :titol="event.title"
          :categoria="event.category"
          :descripcio="event.description"
          :imatge="event.image"
          :data="event.date"
          :numero="event.number"
          :index="index"
        />
      </div>

      <RouterLink to="/galeria" class="button button-dark mobile-gallery-link">
        DESCOBREIX TOTES LES IMATGES <span>↗</span>
      </RouterLink>
    </section>

    <!-- MANIFEST -->
    <section class="manifesto-section">
      <div class="manifesto-image">
        <img
          src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1400&q=85"
          alt="Llum i energia d'un concert en directe"
          loading="lazy"
        />
      </div>

      <div class="manifesto-copy">
        <p class="eyebrow">LA NOSTRA MANERA D'ENTENDRE LA CULTURA</p>

        <h2>
          Hi ha moments<br />
          que no necessiten<br />
          <em>filtres.</em>
        </h2>

        <p>
          Només necessiten que hi siguis. Que miris, escoltis, sentis
          i deixis que la cultura formi part de la teva història.
        </p>

        <RouterLink to="/galeria" class="manifesto-link">
          TROBA EL TEU PROPER MOMENT <span>↗</span>
        </RouterLink>
      </div>
    </section>

    <!-- CRIDA FINAL -->
    <section class="home-contact">
      <div class="contact-orbit" aria-hidden="true">K360</div>

      <div class="home-contact-content">
        <p class="eyebrow">LES BONES IDEES COMENCEN PARLANT</p>

        <h2>
          Fem que passin<br />
          <em>coses.</em>
        </h2>

        <p>
          Tens una proposta, una idea o simplement ganes de descobrir?
          Ens agradarà saber de tu.
        </p>

        <RouterLink to="/contacte" class="button button-light">
          PARLEM? <span>↗</span>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 0.65s ease;
}

.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}

.text-fade-enter-active,
.text-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.text-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.text-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.hero {
  position: relative;
  min-height: clamp(600px, 78vh, 790px);
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 80px 8%;
  background: #282722;
  color: white;
}

.hero-photo,
.hero-shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-photo {
  object-fit: cover;
  object-position: center;
}

.hero-shade {
  background: linear-gradient(
    90deg,
    rgba(25, 24, 21, 0.83) 0%,
    rgba(25, 24, 21, 0.58) 48%,
    rgba(25, 24, 21, 0.13) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  width: min(1100px, 100%);
  margin: 0 auto;
}

.eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.17em;
  line-height: 1.8;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 28px;
  color: rgba(255, 255, 255, 0.85);
}

.eyebrow-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d8c2a8;
}

.hero-copy h1 {
  margin: 0;
  color: white;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(55px, 8vw, 105px);
  font-weight: 600;
  letter-spacing: -0.085em;
  line-height: 0.99;
}

.hero-copy h1 em {
  color: #d8c2a8;
  font-weight: 500;
}

.hero-description {
  max-width: 455px;
  margin: 28px 0 30px;
  color: rgba(255, 255, 255, 0.83);
  font-size: 14px;
  line-height: 1.9;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  min-height: 50px;
  padding: 0 20px;
  border: 1px solid transparent;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: background 0.25s, color 0.25s, transform 0.25s;
}

.button:hover {
  transform: translateY(-2px);
}

.button-light {
  border-color: rgba(255, 255, 255, 0.65);
  color: white;
}

.button-light:hover {
  background: white;
  color: #24231f;
}

.button-dark {
  background: #24231f;
  color: white;
}

.hero-bottom {
  position: absolute;
  right: 8%;
  bottom: 25px;
  left: 8%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.75);
  font-size: 9px;
  letter-spacing: 0.13em;
}

.hero-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-controls button {
  width: 23px;
  height: 20px;
  padding: 8px 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.hero-controls button span {
  display: block;
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.4);
  transition: background 0.2s;
}

.hero-controls button.active span {
  background: #e4cdb1;
}

.hero-counter {
  margin-left: 8px;
}

.intro-section {
  display: grid;
  grid-template-columns: 0.6fr 2fr 1.2fr;
  align-items: center;
  gap: 35px;
  padding: 100px 8%;
  background: #f6f3ec;
}

.intro-number {
  align-self: start;
  color: #87684f;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.section-eyebrow {
  color: #87684f;
}

.intro-copy h2 {
  margin: 15px 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(34px, 4.5vw, 57px);
  font-weight: 500;
  letter-spacing: -0.065em;
  line-height: 1.14;
}

.intro-copy h2 em {
  color: #87684f;
}

.intro-description {
  padding-top: 25px;
}

.intro-description > p {
  color: #777168;
  font-size: 13px;
  line-height: 1.9;
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  margin-top: 14px;
  padding-bottom: 7px;
  border-bottom: 1px solid #b7a18a;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-decoration: none;
}

.text-link span {
  font-size: 15px;
}

.discover-section {
  padding-top: 90px;
  padding-bottom: 105px;
  background: #fcfaf6;
}

.section-wrap {
  padding-right: 8%;
  padding-left: 8%;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 30px;
}

.section-heading .eyebrow {
  margin-bottom: 17px;
}

.section-heading h2 {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(38px, 5vw, 62px);
  font-weight: 500;
  letter-spacing: -0.07em;
}

.section-heading h2 em {
  color: #87684f;
}

.section-description {
  max-width: 530px;
  margin: 20px 0 38px;
  color: #777168;
  font-size: 13px;
  line-height: 1.9;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 25px;
}

.mobile-gallery-link {
  display: none;
}

.manifesto-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 530px;
  background: #e9e1d5;
}

.manifesto-image {
  min-height: 530px;
  overflow: hidden;
}

.manifesto-image img {
  width: 100%;
  height: 100%;
  min-height: 530px;
  object-fit: cover;
}

.manifesto-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 75px 12%;
}

.manifesto-copy > .eyebrow {
  margin-bottom: 23px;
  color: #87684f;
}

.manifesto-copy h2 {
  margin: 0 0 24px;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(39px, 5vw, 64px);
  font-weight: 500;
  letter-spacing: -0.07em;
  line-height: 1.04;
}

.manifesto-copy h2 em {
  color: #87684f;
}

.manifesto-copy > p:not(.eyebrow) {
  max-width: 410px;
  margin-bottom: 22px;
  color: #696157;
  font-size: 13px;
  line-height: 1.9;
}

.manifesto-link {
  display: inline-flex;
  gap: 15px;
  padding-bottom: 7px;
  border-bottom: 1px solid #b7a18a;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-decoration: none;
}

.home-contact {
  position: relative;
  overflow: hidden;
  padding: 100px 8%;
  background: #25241f;
  color: #f6f3ec;
}

.home-contact-content {
  position: relative;
  z-index: 1;
  max-width: 760px;
}

.home-contact .eyebrow {
  margin-bottom: 24px;
  color: #c9ad8e;
}

.home-contact h2 {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(55px, 8vw, 96px);
  font-weight: 500;
  letter-spacing: -0.08em;
  line-height: 0.98;
}

.home-contact h2 em {
  color: #c9ad8e;
}

.home-contact-content > p:not(.eyebrow) {
  max-width: 420px;
  margin: 25px 0 30px;
  color: #c7c0b4;
  font-size: 13px;
  line-height: 1.9;
}

.contact-orbit {
  position: absolute;
  top: 50%;
  right: 6%;
  color: rgba(255, 255, 255, 0.035);
  font-family: 'Manrope', sans-serif;
  font-size: clamp(130px, 25vw, 360px);
  font-weight: 800;
  letter-spacing: -0.12em;
  transform: translateY(-50%);
  pointer-events: none;
}

@media (max-width: 900px) {
  .intro-section {
    grid-template-columns: 0.5fr 2fr;
    gap: 25px;
    padding: 75px 6%;
  }

  .intro-description {
    grid-column: 2;
    padding-top: 0;
  }

  .section-wrap {
    padding-right: 6%;
    padding-left: 6%;
  }

  .event-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 35px 20px;
  }

  .event-card:last-child {
    grid-column: 1 / -1;
    max-width: calc(50% - 10px);
  }

  .manifesto-copy {
    padding: 55px 8%;
  }
}

@media (max-width: 600px) {
  .hero {
    min-height: 650px;
    padding: 65px 24px;
  }

  .hero-copy h1 {
    font-size: clamp(49px, 12.5vw, 68px);
  }

  .hero-eyebrow {
    max-width: 280px;
    font-size: 8px;
  }

  .hero-description {
    font-size: 13px;
  }

  .hero-bottom {
    right: 24px;
    left: 24px;
    font-size: 8px;
  }

  .hero-bottom > span:first-child {
    max-width: 155px;
  }

  .intro-section {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 65px 24px;
  }

  .intro-number {
    margin-bottom: 8px;
  }

  .intro-description {
    grid-column: auto;
  }

  .intro-copy h2 {
    font-size: 38px;
  }

  .discover-section {
    padding-top: 65px;
    padding-bottom: 70px;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }

  .section-heading h2 {
    font-size: 41px;
  }

  .desktop-link {
    display: none;
  }

  .section-description {
    margin-bottom: 30px;
  }

  .event-grid {
    grid-template-columns: 1fr;
    gap: 35px;
  }

  .event-card:last-child {
    grid-column: auto;
    max-width: none;
  }

  .mobile-gallery-link {
    display: inline-flex;
    margin-top: 35px;
  }

  .manifesto-section {
    grid-template-columns: 1fr;
  }

  .manifesto-image,
  .manifesto-image img {
    min-height: 300px;
    max-height: 350px;
  }

  .manifesto-copy {
    padding: 55px 24px 65px;
  }

  .manifesto-copy h2 {
    font-size: 47px;
  }

  .home-contact {
    padding: 75px 24px;
  }

  .home-contact h2 {
    font-size: 62px;
  }

  .contact-orbit {
    top: 15%;
    right: -5%;
    font-size: 150px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
