import { apiFetch, API_URL } from '../../../api.js'
import { showView } from '../../../navigation.js'

/**
 * Devuelve el HTML base de la vista de galería,
 * con botón Back, buscador, mosaico y listado.
 */
export function renderGalleryView() {
  return `
    <section id="gallery-view" class="view hidden">
      <button class="back-btn" id="galleryBack">Back</button>
   
      <div id="gallery-mosaic-view" class="gallery-mosaic hidden"></div>
      <div id="gallery-list-view" class="gallery-list"></div>
    </section>
  `
}

/**
 * Muestra la vista de galería,
 * configura navegación y carga el listado
 * de eventos con al menos 5 imágenes cada uno.
 */
export async function initGalleryView() {
  // Asume que la sección #gallery-view ya está definida en el HTML
  showView('gallery-view')

  // Botón Back retorna a home-view
  document.getElementById('galleryBack')?.addEventListener('click', (e) => {
    e.preventDefault()
    showView('main-menu-view', true)
  })
  // Ocultar vista mosaico y limpiar listado
  document.getElementById('gallery-mosaic-view').classList.add('hidden')
  const listView = document.getElementById('gallery-list-view')
  listView.innerHTML = ''

  try {
    // Obtener eventos asistidos y multimedia
    const events = await apiFetch(`${API_URL}/events/attended`)
    const media = await apiFetch(`${API_URL}/event-media`)

    // Agrupar imágenes por evento
    const mediaByEvent = media.reduce((acc, item) => {
      const id = typeof item.event === 'string' ? item.event : item.event._id
      acc[id] = acc[id] || []
      acc[id].push(item)
      return acc
    }, {})

    // Filtrar eventos con al menos 5 imágenes y renderizar
    events.forEach((ev) => {
      const imgs = mediaByEvent[ev._id.toString()].slice(0, 5)
      const section = document.createElement('div')
      section.className = 'gallery-event-section'
      section.innerHTML = `
          <h3>${ev.title}</h3>
          
          <div class="gallery-event-items">
            ${imgs
              .map((img) => `<img src="${img.imageUrl}" alt="${ev.title}" />`)
              .join('')}
          </div>
        `
      listView.appendChild(section)
    })
  } catch (error) {
    console.error('Error loading gallery list by event:', error)
    listView.innerHTML = '<p class="error">Error while loading GALLERYTY.</p>'
  }
}
