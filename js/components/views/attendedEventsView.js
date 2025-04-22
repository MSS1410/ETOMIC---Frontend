// js/components/views/attendedEventsView.js
import { apiFetch, API_URL } from '../../api.js'
import { showView } from '../../navigation.js'

/**
 * Devuelve el HTML de la vista de eventos asistidos.
 */
export function renderAttendedEventsView() {
  return `
    <section id="attended-events-view" class="view hidden">
      <div class="search-container">
        <input type="text" id="attended-search" placeholder="Search attended events..." />
      </div>
      <div class="events-list" id="attended-full-list"></div>
    </section>
  `
}

/**
 * Inicializa los listeners y la carga de datos para attendedEventsView.
 */
export function initAttendedEventsView() {
  let attendedEventsData = []

  async function loadList() {
    try {
      const events = await apiFetch(`${API_URL}/events/attended`)
      attendedEventsData = events
      renderList(events)
    } catch (err) {
      console.error('Error loading attended events:', err)
    }
  }

  // 2) Filtrado
  document.getElementById('attended-search')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase()
    renderList(
      attendedEventsData.filter((ev) => ev.title.toLowerCase().includes(term))
    )
  })
  loadList()
  // 3) Click en “View Event” o “View Media”
  document
    .getElementById('attended-full-list')
    ?.addEventListener('click', (e) => {
      const item = e.target.closest('.event-item')
      if (!item) return
      const id = item.dataset.eventId
      if (e.target.classList.contains('view-event-btn')) {
        showView('attended-event-singular-view')
        // aquí loadSingularAttended(id)
      } else if (e.target.classList.contains('view-media-btn')) {
        showView('attended-event-gallery-view')
        // aquí loadAttendedEventGallery(id)
      }
    })

  function renderList(events) {
    const container = document.getElementById('attended-full-list')
    if (!events.length) {
      container.innerHTML = `<p>You haven't attended any events yet.</p>`
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
          <button class="view-event-btn">View Event</button>
          <button class="view-media-btn">View Media</button>
        </div>
      </div>
    `
      )
      .join('')
  }
}
