# KULTURA360 · Vue

**Temàtica:** agenda cultural. KULTURA360 és una web per descobrir propostes culturals (música en directe, art i experiències). La portada mostra una selecció d'esdeveniments llegits de **Cloud Firestore**, cada esdeveniment té la seva pàgina de detall, i hi ha una galeria d'imatges i una pàgina de contacte.

Feta amb **Vue 3**, **Vue Router**, **Vite** i **Firebase** (Cloud Firestore + Hosting).

**Web publicada:** https://kultura360-vue-julia.web.app

## Instal·lació i execució

Cal tenir Node.js (22.18 o superior) i la Firebase CLI (`npm install -g firebase-tools`).

```bash
# 1. Instal·lar les dependències
npm install

# 2. Executar-la en local (http://localhost:5173)
npm run dev

# 3. Generar la versió de producció (carpeta dist/)
npm run build

# 4. Desplegar a Firebase Hosting i les regles de Firestore
firebase login
firebase deploy
```

## Components propis

| Component | Funció |
|---|---|
| `src/components/Navbar.vue` | Capçalera amb el logotip i el menú de navegació (`RouterLink`) entre les rutes. |
| `src/components/Footer.vue` | Peu de pàgina amb enllaços a l'inici i a contacte. |
| `src/components/EventCard.vue` | Targeta d'un esdeveniment: imatge, categoria, títol, descripció i data. Enllaça a la pàgina de detall. |
| `src/components/EstatDades.vue` | Missatge d'estat de les dades: carregant, sense dades o error. |

A més hi ha les vistes `HomeView`, `GaleriaView`, `ContacteView` i `EventDetailView` (a `src/views/`) i el component arrel `App.vue`, que mostra la vista activa amb `RouterView`.

## Exemple de comunicació amb props

- **Pare:** `src/views/HomeView.vue`
- **Fill:** `src/components/EventCard.vue`
- **Dades:** cada document de la col·lecció `events` llegit de Firestore.

`HomeView` llegeix la col·lecció `events` i, per a cada document, crea un `EventCard` passant-li les dades:

```vue
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
```

`EventCard` declara aquestes props amb `defineProps` (tipus, obligatòries i valors per defecte) i només les mostra, sense modificar-les. `EstatDades` també rep per props el `tipus` d'estat i el `missatge`.

## Rutes (Vue Router)

Definides a `src/router/index.ts` amb `createWebHistory`:

| Ruta | Vista | Contingut |
|---|---|---|
| `/` | `HomeView` | Portada amb carrusel, esdeveniments llegits de Firestore i crida a contactar. |
| `/galeria` | `GaleriaView` | Galeria d'imatges de cultura, música i art. |
| `/contacte` | `ContacteView` | Formulari de contacte (només validació, no envia dades). |
| `/esdeveniments/:id` | `EventDetailView` | Detall d'un esdeveniment, llegit de Firestore pel seu id. |

Com que el router fa servir el mode *history*, `firebase.json` té una regla `rewrites` que envia totes les rutes a `index.html`. Així funcionen també en accedir-hi directament o en recarregar la pàgina.

## Cloud Firestore

**Col·lecció:** `events` (un document per esdeveniment; l'id del document és l'identificador de la ruta, p. ex. `art-mirar`).

| Camp | Tipus | Descripció |
|---|---|---|
| `title` | string | Títol de l'esdeveniment |
| `category` | string | Categoria (MÚSICA EN DIRECTE, ART I CREATIVITAT...) |
| `description` | string | Descripció breu |
| `image` | string | URL de la imatge |
| `location` | string | Lloc o tipus d'espai |
| `date` | string | Data de l'esdeveniment |
| `number` | number | Ordre en què es mostren |

**Vistes que en mostren les dades:** `HomeView` (llista d'esdeveniments, ordenats per `number`) i `EventDetailView` (un esdeveniment). Totes dues mostren un missatge mentre carreguen, si no hi ha dades i si la lectura falla.

**Regles** (`firestore.rules`): lectura pública de `events` i cap escriptura. Qualsevol altra col·lecció queda tancada.

Les dades inicials són a `scripts/events.json` i es poden carregar amb `node scripts/seed-firestore.mjs` (cal permetre l'escriptura temporalment i tornar a desplegar les regles després).

La configuració web de Firebase (`src/firebase.js`) és pública per disseny; el repositori no conté claus privades ni credencials de comptes de servei.
