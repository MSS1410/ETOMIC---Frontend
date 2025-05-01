// js/components/views/gallerySingularView.js
import { apiFetch, API_URL } from '../../../api.js'
import { showView } from '../../../navigation.js'

/**
 * Devuelve el HTML base de la vista de galería singular de un evento específico.
 */
export function renderGallerySingularView() {
  return `
    <section id="gallery-singular-view" class="view hidden">
      <button class="back-btn" id="gallerySingularBack">Back to Gallery</button>
      <button class="back-btn" id="gallerySingularBackEvents">Back to Attended Events</button>
      <h2 id="gallery-singular-title"></h2>
      <div id="gallery-singular-container" class="images-list"></div>
    </section>
  `
}

/**
 * Inicializa la vista de galería singular para un evento dado.
 * Muestra solo las imágenes asociadas a eventId.
 * @param {string} eventId
 */
export async function initGallerySingularView(eventId) {
  const app = document.getElementById('app')
  // 1) Insertar la estructura si no existe
  if (!document.getElementById('gallery-singular-view')) {
    app.insertAdjacentHTML('beforeend', renderGallerySingularView())
  }

  // 2) Mostrar esta vista y ocultar las demás
  showView('gallery-singular-view')

  // 3) Configurar botón Back
  const backBtn = document.getElementById('gallerySingularBack')
  // limpiar listeners
  document
    .getElementById('gallerySingularBack')
    .addEventListener('click', () => showView('gallery-view'))

  // 3) Configurar botón Back
  const backBtnEvents = document.getElementById('gallerySingularBackEvents')
  // limpiar listeners
  document
    .getElementById('gallerySingularBackEvents')
    .addEventListener('click', () => showView('attended-events-view', true))

  // 4) Colocar título del evento
  const titleEl = document.getElementById('gallery-singular-title')
  // Fetch datos del evento si necesitas más info
  const ev = await apiFetch(`${API_URL}/events/${eventId}`)
  titleEl.textContent = ev.title

  // 5) Cargar y renderizar imágenes del evento
  const container = document.getElementById('gallery-singular-container')
  container.innerHTML = ''
  try {
    const media = await apiFetch(`${API_URL}/event-media/${eventId}`)
    if (!Array.isArray(media) || media.length === 0) {
      container.innerHTML =
        '<p class="no-images">No hay imágenes para este evento.</p>'
    } else {
      media.forEach((item) => {
        const img = document.createElement('img')
        img.src = item.imageUrl
        img.alt = ev.title
        container.appendChild(img)
      })
    }
  } catch (err) {
    console.error('Error loading singular gallery:', err)
    container.innerHTML = '<p class="error">Error al cargar las imágenes.</p>'
  }
}
