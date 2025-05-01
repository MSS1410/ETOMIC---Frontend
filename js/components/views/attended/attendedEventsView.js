import { apiFetch, API_URL } from '../../../api.js'
import { showView } from '../../../navigation.js'
import { loadAttendedEventDetail } from './attendedEventDetailView.js'
import { initGallerySingularView } from '../gallery/gallerySingularView.js'

export function renderAttendedEventsView() {
  return `
  <section id="attended-events-view" class="view hidden">
    <button class="back-btn" id="attended-back-btn">Back</button>
    <div class="search-container">
      <input type="text" id="attended-search" placeholder="Buscar eventos asistidos..." />
    </div>
    <div class="events-list" id="attended-full-list"></div>
  </section>
`
}

export function initAttendedEventsView() {
  // Back to main menu
  document
    .getElementById('attended-back-btn')
    ?.addEventListener('click', (e) => {
      e.preventDefault()
      showView('main-menu-view', true)
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
            <button class="view-media-btn" id="viewMedia">Event Media</button>
          </div>
        </div>
      `
      )
      .join('')
    attachListeners()
  }

  function attachListeners() {
    listContainer.querySelectorAll('.view-event-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('.event-item').dataset.eventId
        loadAttendedEventDetail(id)
      })
    })
    listContainer.querySelectorAll('.view-media-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('.event-item').dataset.eventId
        initGallerySingularView(id)
      })
    })
  }
}
