// js/components/views/upcomingEventsView.js
import { apiFetch, API_URL } from '../../api.js'
import { showView, goBack } from '../../navigation.js'

/**
 * Devuelve el HTML de la vista de lista de próximos eventos.
 */

export function renderUpcomingEventsView() {
  return `
    <section id="upcoming-events-view" class="view hidden">
      <button class="back-btn" id="upcoming-back-btn">Back</button>
      <div class="search-container">
        <input type="text" id="event-search" placeholder="Buscar eventos..." />
      </div>
      <div class="events-list" id="upcoming-events-list"></div>

      <!-- Modal para el flyer -->
      <div class="modalFlyer hidden" id="flyer-modal">
        <div class="modalFlyer-content">
          <span class="close-btn" id="flyer-close-btn">&times;</span>
          <img src="" alt="Event Flyer" id="flyer-image" />
        </div>
      </div>
    </section>
  `
}

/**
 * Inicializa los listeners y la carga de datos para upcomingEventsView.
 */
export function initUpcomingEventsView() {
  // Botón ATRÁS
  document
    .getElementById('upcoming-back-btn')
    ?.addEventListener('click', (e) => {
      e.preventDefault()
      goBack()
    })

  let upcomingEventsData = []

  async function loadList() {
    try {
      const events = await apiFetch(`${API_URL}/events/upcoming`)
      upcomingEventsData = events
      renderList(events)
    } catch (err) {
      console.error('Error loading upcoming events:', err)
    }
  }
  loadList()

  // Filtrado en tiempo real
  document.getElementById('event-search')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase()
    renderList(
      upcomingEventsData.filter((ev) => ev.title.toLowerCase().includes(term))
    )
  })

  // Click en botones de cada evento
  document
    .getElementById('upcoming-events-list')
    ?.addEventListener('click', (eve) => {
      const item = eve.target.closest('.event-item')
      if (!item) return
      if (eve.target.classList.contains('view-flyer-btn')) {
        const flyerUrl = eve.target.dataset.flyerUrl
        openFlyerModal(flyerUrl)
      } else if (eve.target.classList.contains('buy-tickets-btn')) {
        // TODO: Lógica de compra de entradas
      }
    })

  // Cerrar modal flyer
  document.getElementById('flyer-close-btn')?.addEventListener('click', () => {
    document.getElementById('flyer-modal').classList.add('hidden')
  })

  function openFlyerModal(url) {
    const modal = document.getElementById('flyer-modal')
    const img = document.getElementById('flyer-image')
    img.src = url
    modal.classList.remove('hidden')
    modal.classList.add('open')
  }

  function renderList(events) {
    const container = document.getElementById('upcoming-events-list')
    if (!events.length) {
      container.innerHTML = `<p>No se encontraron eventos próximos.</p>`
      return
    }
    container.innerHTML = events
      .map(
        (ev) => `
      <div class="event-item" data-event-id="${ev._id}">
        <img src="${ev.image}" alt="${ev.title}" />
        <div class="event-info">
          <h3>${ev.title}</h3>
          <h4>${new Date(ev.date).toLocaleDateString()}</h4>
          <p>${ev.location}</p>
          <p class="event-description">${ev.description}</p>
          <button class="view-flyer-btn" data-flyer-url="${ev.flyer}" 
          id="upcomingflyer">Show Flyer</button>
          <button class="buy-tickets-btn" id="buyTickets">Buy Tickets</button>
        </div>
      </div>
    `
      )
      .join('')
  }
}
