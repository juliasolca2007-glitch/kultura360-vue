
<script setup>
const photos = [
  {
    title: 'L’energia del directe',
    category: 'MÚSICA',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=85'
  },
  {
    title: 'L’art de mirar',
    category: 'ART',
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Moments compartits',
    category: 'EXPERIÈNCIES',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'Una altra perspectiva',
    category: 'CREATIVITAT',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=85'
  },
  {
    title: 'L’escenari és nostre',
    category: 'CULTURA',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=85'
  },
  {
    title: 'La ciutat desperta',
    category: 'COMUNITAT',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=85'
  }
]
</script>

<template>
  <main class="gallery-page">
    <section class="page-intro">
      <p class="eyebrow section-eyebrow">UN MÓN DE POSSIBILITATS</p>
      <h1>La cultura<br />en <em>imatges.</em></h1>
      <p>
        Moments, espais i emocions que expliquen per què la cultura
        és molt més del que veiem.
      </p>
    </section>

    <section class="gallery-grid section-wrap">
      <article
        v-for="(photo, index) in photos"
        :key="photo.title"
        class="gallery-card"
        :class="{ 'gallery-card-tall': index === 1 || index === 4 }"
      >
        <img :src="photo.image" :alt="photo.title" loading="lazy" />
        <div class="gallery-caption">
          <span>{{ photo.category }}</span>
          <h2>{{ photo.title }}</h2>
        </div>
      </article>
    </section>
  </main>
</template>
