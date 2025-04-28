import { apiFetch, API_URL } from '../../api.js'
import { showView, goBack } from '../../navigation.js'

/**
 * Renderiza la vista de eventos asistidos.
 */
export function renderAttendedEventsView() {
  return `

  <!-- Lista de eventos asistidos -->

    <section id="attended-events-view" class="view hidden">
      <button class="back-btn" id="attended-back-btn">Back</button>
      <div class="search-container">
        <input type="text" id="attended-search" placeholder="Buscar eventos asistidos..." />
      </div>
      <div class="events-list" id="attended-full-list"></div>


      <!-- Vista singular de evento asistido -->

      <section id="attended-event-singular-view" class="view hidden">
        <button class="back-btn" id="attended-detail-back">Back to Events</button>
        <div id="attended-event-detail"></div>
      </section>


    </section>
  `
}

/**
 * Inicializa los listeners y la carga de datos para attendedEventsView.
 */
export function initAttendedEventsView() {
  // Asegura el modal de media

  // Botón Atrás
  document
    .getElementById('attended-back-btn')
    ?.addEventListener('click', (e) => {
      e.preventDefault()
      showView('main-menu-view', true)
    })

  document
    .getElementById('attended-detail-back')
    ?.addEventListener('click', (ev) => {
      ev.preventDefault(showView('attended-events-view', true))
    })

  let attendedEventsData = []
  const listContainer = document.getElementById('attended-full-list')

  async function loadList() {
    try {
      const events = await apiFetch(`${API_URL}/events/attended`)
      attendedEventsData = events
      renderList(events)
    } catch (err) {
      console.error('Error cargando eventos asistidos:', err)
    }
  }
  loadList()

  // Filtrado en vivo
  document.getElementById('attended-search')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase()
    renderList(
      attendedEventsData.filter((ev) => ev.title.toLowerCase().includes(term))
    )
  })

  function renderList(events) {
    if (!events.length) {
      listContainer.innerHTML = `<p>No events assisted yet.</p>`
      return
    }
    listContainer.innerHTML = events
      .map(
        (ev) => `
      <div class="event-item" data-event-id="${ev._id}">
        <img src="${ev.image}" alt="${ev.title}" />
        <div class="event-info">
          <h3>${ev.title}</h3>
          <p>${new Date(ev.date).toLocaleDateString()}</p>
          
            <button class="view-event-btn" id="viewEvent">Show Event</button>
            <button class="view-media-btn" id="viewMedia">Event media</button>
          </div>
        </div>
      </div>
    `
      )
      .join('')
    actOnAttendedListeners()
  }

  // Engancha los clicks de “Ver evento” y “Ver media”
  function actOnAttendedListeners() {
    listContainer.querySelectorAll('.view-event-btn').forEach((btn) => {
      btn.addEventListener('click', (eve) => {
        const id = eve.target.closest('.event-item').dataset.eventId
        showEventDetail(id)
      })
    })
    listContainer.querySelectorAll('.view-media-btn').forEach((btn) => {
      btn.addEventListener('click', (eve) => {
        const id = eve.target.closest('.event-item').dataset.eventId
        showEventMedia(id)
      })
    })
  }
}

/**
 * Muestra la vista singular del evento asistido.
 */
async function showEventDetail(eventId) {
  // 1) Cambia a la vista singular
  showView('attended-event-singular-view', true)

  // 2) Carga los datos del evento
  try {
    const ev = await apiFetch(`${API_URL}/events/${eventId}`)
    // 3) Rellena el HTML de la vista detalle:
    document.getElementById('attended-event-detail').innerHTML = `
      <h2>${ev.title}</h2>
      <p><strong>Fecha:</strong> ${new Date(ev.date).toLocaleDateString()}</p>
      <p>${ev.description}</p>
      <img src="${ev.image}" alt="${ev.title}" />
    `
  } catch (err) {
    console.error('Error cargando detalle de evento:', err)
  }
}

/**
 * Muestra el modal con la galería de media del evento.
 */
async function showEventMedia(eventId) {
  try {
    // 1) Ir a la galería general
    showView('gallery-view', true)

    // 2) Traer solo la media de este evento
    const media = await apiFetch(`${API_URL}/event-media/${eventId}`)

    // 3) Rellenar el mosaic de la Galería
    const mosaic = document.getElementById('gallery-mosaic-view')
    mosaic.innerHTML = media
      .map(
        (m) => `
        <div class="gallery-item">
          <img src="${m.imageUrl}" alt="${m.description}" />
          <p>${m.description}</p>
        </div>
      `
      )
      .join('')

    // 4) (Re)iniciar el slider si lo usas aquí:
    if (typeof initGalleryCarousel === 'function') {
      initGalleryCarousel()
    }
  } catch (err) {
    console.error('Error cargando media de evento:', err)
  }
}
