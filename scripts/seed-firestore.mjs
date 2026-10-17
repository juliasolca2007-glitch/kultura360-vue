// Carrega les dades inicials de scripts/events.json a la col·lecció "events".
// Ús: node scripts/seed-firestore.mjs
// Cal que les regles permetin escriure temporalment a "events"; després
// es tornen a desplegar les regles de només lectura (firestore.rules).
import { readFile } from 'node:fs/promises'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../src/firebase.js'

const events = JSON.parse(await readFile(new URL('./events.json', import.meta.url), 'utf8'))

for (const { id, ...data } of events) {
  await setDoc(doc(db, 'events', id), data)
  console.log(`events/${id} desat`)
}

process.exit(0)
