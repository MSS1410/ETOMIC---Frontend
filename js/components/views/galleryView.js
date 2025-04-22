// js/components/views/galleryView.js
import { apiFetch, API_URL } from '../../api.js'
import { showView } from '../../navigation.js'

/**
 * Devuelve el HTML de la vista de galería.
 */
export function renderGalleryView() {
  return `
    <section id="gallery-view" class="view hidden">
      <div class="search-container">
        <input type="text" id="gallery-search" placeholder="Search gallery..." />
      </div>
      <div id="gallery-mosaic-view" class="gallery-mosaic"></div>
      <div id="gallery-list-view" class="gallery-list hidden"></div>
    </section>
  `
}

/**
 * Inicializa los listeners y la carga de datos para galleryView.
 */
export function initGalleryView() {
  let galleryData = []

  // 1) Carga inicial
  async function loadAll() {
    try {
      const items = await apiFetch(`${API_URL}/event-media`)
      galleryData = items
      renderMosaic(items)
    } catch (err) {
      console.error('Error loading gallery:', err)
    }
  }
  loadAll()

  // 2) Filtrado
  document.getElementById('gallery-search')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase()
    const filtered = galleryData.filter((m) =>
      m.description.toLowerCase().includes(term)
    )
    renderMosaic(filtered)
  })

  // 3) Opciones mosaic / list (si añades botones para cambiar)
  // document.getElementById('show-mosaic-btn')?.addEventListener(...)
  // document.getElementById('show-list-btn')?.addEventListener(...)

  // 4) Click en imagen para modal
  document
    .getElementById('gallery-mosaic-view')
    ?.addEventListener('click', (e) => {
      const img = e.target.closest('img')
      if (!img) return
      showView('gallery-modal-view')
      // aquí openGalleryModal(img.src)
    })

  function renderMosaic(items) {
    const cont = document.getElementById('gallery-mosaic-view')
    cont.innerHTML = items
      .map(
        (m) => `
      <div class="gallery-item">
        <img src="${m.imageUrl}" alt="${m.description}" />
        <p>${m.description}</p>
      </div>
    `
      )
      .join('')
  }
}
