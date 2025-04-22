// js/components/views/upcomingEventsView.js

import { apiFetch, API_URL } from '../../api.js'

let upcomingSwiperInicial
let upcomingEventsData = []

// Render de la vista
export function renderUpcomingEventsView() {
  return `
    <section id="upcoming-events-view" class="view hidden">
      <h2>Upcoming Events</h2>
      <div id="upcoming-wrapper" class="swiper-container"></div>
      <div id="upcoming-events-list"></div>
      <!-- Contenedor para singular -->
      <section id="upcoming-event-singular-view" class="view hidden">
        <h3 id="upcoming-event-title"></h3>
        <img id="upcoming-event-img" alt="">
        <img id="upcoming-event-flyer" alt="">
        <p id="upcoming-event-description"></p>
        <button onclick="closeFlyerModal()">Close Flyer</button>
      </section>
    </section>
  `
}

// Inicialización de eventos y carga
export function initUpcomingEvents() {
  // Destruye slider previo si existía
  if (upcomingSwiperInicial) {
    upcomingSwiperInicial.destroy(true, true)
  }
  loadUpcomingEventsSlider()
  loadUpcomingEventsList()
  document
    .getElementById('link-upcoming')
    .addEventListener('click', showUpcomingEventsView)
}

// Lógica de slider
async function loadUpcomingEventsSlider() {
  try {
    const events = await apiFetch(`${API_URL}/events/upcoming`)
    // Asigna global
    upcomingEventsData = events
    // Construye slider HTML
    document.getElementById('upcoming-wrapper').innerHTML = events
      .map(
        (event) => `
        <div class="swiper-slide event-slide" data-event-id="${event._id}">
          <img src="${event.image}" alt="${event.title}">
          <div class="overimg"><p>${event.title}</p></div>
        </div>
      `
      )
      .join('')

    upcomingSwiperInicial = new Swiper('#upcoming-wrapper', {
      slidesPerView: 3,
      spaceBetween: 0,
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      speed: 1000
    })
  } catch (error) {
    console.error('error loading upcoming events:', error)
  }
}

// Lista completa
async function loadUpcomingEventsList() {
  try {
    const events = await apiFetch(`${API_URL}/events/upcoming`)
    upcomingEventsData = events
    configUpcomingEventsList(events)
  } catch (error) {
    console.error('error loading upcoming events list:', error)
  }
}
function configUpcomingEventsList(events) {
  const listContainer = document.getElementById('upcoming-events-list')
  if (!events.length) {
    listContainer.innerHTML = `<p>No upcoming events found.</p>`
    return
  }
  listContainer.innerHTML = events
    .map((event) => {
      const formattedDate = new Date(event.date).toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      return `
      <div class="event-item">
        <img src="${event.image}" alt="${event.title}">
        <div class="event-info">
          <h3 class="event-title-card">${event.title}</h3>
          <p class="event-date"><span class="label">Date:</span> <span class="value">${formattedDate}</span></p>
          <p class="event-location"><span class="label">Location:</span> <span class="value">${event.location}</span></p>
          <p class="event-description-card">${event.description}</p>
          <button onclick="buyTicket('${event._id}')">Buy Tickets</button>
          <button onclick="showFlyer('${event._id}')">Flyer</button>
        </div>
      </div>
    `
    })
    .join('')
}

// Filtro por búsqueda
document.getElementById('event-search').addEventListener('input', function () {
  const filterText = this.value.toLowerCase()
  const filtered = upcomingEventsData.filter((e) =>
    e.title.toLowerCase().includes(filterText)
  )
  configUpcomingEventsList(filtered)
})

// Eventos de slide click
document.getElementById('upcoming-wrapper').addEventListener('click', (ev) => {
  const slide = ev.target.closest('.event-slide')
  if (slide) {
    const id = slide.getAttribute('data-event-id')
    goToUpcomingSingular(id)
  }
})

// Mostrar vista Upcoming
export function showUpcomingEventsView() {
  showView('upcoming-events-view')
}

// Singular
async function loadSingularUpcoming(id) {
  try {
    const event = await apiFetch(`${API_URL}/events/${id}`)
    document.getElementById('upcoming-event-title').textContent = event.title
    document.getElementById('upcoming-event-img').src = event.image
    document.getElementById('upcoming-event-flyer').src = event.flyer
    document.getElementById('upcoming-event-description').textContent =
      event.description
    window.currentUpcomingEventId = id
  } catch {}
}

function goToUpcomingSingular(id) {
  showView('upcoming-event-singular-view')
  loadSingularUpcoming(id)
}
