// js/components/views/upcomingEventsView.js
import { apiFetch, API_URL } from '../../api.js'
import { showView } from '../../navigation.js'

/**
 * Devuelve el HTML de la vista de lista de próximos eventos.
 */
export function renderUpcomingEventsView() {
  return `
    <section id="upcoming-events-view" class="view hidden">
      <div class="search-container">
        <input type="text" id="event-search" placeholder="Search events..." />
      </div>
      <div class="events-list" id="upcoming-events-list"></div>
    </section>
  `
}

/**
 * Inicializa los listeners y la carga de datos para upcomingEventsView.
 */
export function initUpcomingEventsView() {
  let upcomingEventsData = []
  //  1 carga de datos+

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

  // 2) Filtrado en tiempo real
  document.getElementById('event-search')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase()
    renderList(
      upcomingEventsData.filter((ev) => ev.title.toLowerCase().includes(term))
    )
  })

  // 3) Click en cada evento para ir a la vista singular
  document
    .getElementById('upcoming-events-list')
    ?.addEventListener('click', (e) => {
      const item = e.target.closest('.event-item')
      if (!item) return
      const id = item.dataset.eventId
      showView('upcoming-event-singular-view')
      // aquí deberías llamar a tu función loadSingularUpcoming(id)
    })

  function renderList(events) {
    const container = document.getElementById('upcoming-events-list')
    if (!events.length) {
      container.innerHTML = `<p>No upcoming events found.</p>`
      return
    }
    container.innerHTML = events
      .map(
        (ev) => `
      <div class="event-item" data-event-id="${ev._id}">
        <img src="${ev.image}" alt="${ev.title}" />
        <div class="event-info">
          <h3>${ev.title}</h3>
          <p>${new Date(ev.date).toLocaleDateString()}</p>
          <p>${ev.location}</p>
        </div>
      </div>
    `
      )
      .join('')
  }
}
