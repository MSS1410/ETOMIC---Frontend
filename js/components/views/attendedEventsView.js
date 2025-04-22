// ============================= Attended Events Component =============================
// Archivo: frontend/js/components/views/attendedEventsView.js

import { apiFetch, API_URL } from '../../api.js'

let attendedSwiperInicial = null
let attendedEventsData = []

// Render de la vista de Attended Events y su singular
export function renderAttendedEventsView() {
  return `
    <section id="attended-events-view" class="view hidden">
      <h2>Attended Events</h2>
      <div id="attended-wrapper" class="swiper-container"></div>
      <div id="attended-full-list"></div>
    </section>
    <section id="attended-event-singular-view" class="view hidden">
      <h3 id="attended-event-title"></h3>
      <img id="attended-event-image" alt="Event Image" />
      <p id="attended-event-description"></p>
      <button id="btn-view-media">View Media</button>
      <button id="btn-back-to-list">Back to Attended</button>
    </section>
  `
}

// Inicialización: slider list y listeners
export function initAttendedEvents() {
  loadAttendedEvents()
  loadAttendedEventsList()

  document.getElementById('link-attended').addEventListener('click', (ev) => {
    ev.preventDefault()
    showAttendedEventsView()
  })
}

// Mostrar la sección principal
export function showAttendedEventsView() {
  showView('attended-events-view')
}

// Slider de attended events
async function loadAttendedEvents() {
  try {
    const events = await apiFetch(`${API_URL}/events/attended`)
    const wrapper = document.getElementById('attended-wrapper')
    wrapper.innerHTML = events
      .map(
        (event) => `
      <div class="swiper-slide event-slide" data-event-id="${event._id}">
        <img src="${event.image}" alt="${event.title}" />
        <div class="overimg"><p>${event.title}</p></div>
      </div>
    `
      )
      .join('')

    if (attendedSwiperInicial) {
      attendedSwiperInicial.destroy(true, true)
    }
    attendedSwiperInicial = new Swiper('#attended-wrapper', {
      slidesPerView: 3,
      spaceBetween: 0,
      loop: true,
      autoplay: { delay: 2500, disableOnInteraction: false }
    })
  } catch (error) {
    console.error('error loading attended events media:', error)
  }
}

// Lista completa de attended events
async function loadAttendedEventsList() {
  try {
    const events = await apiFetch(`${API_URL}/events/attended`)
    attendedEventsData = events
    configAttendedEventsList(events)
  } catch (error) {
    console.error('error loading attended list', error)
  }
}

function configAttendedEventsList(events) {
  const listContainer = document.getElementById('attended-full-list')
  if (!events.length) {
    listContainer.innerHTML = `<p>You haven't attended any events yet</p>`
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
      <div class="event-item attended-item">
        <img src="${event.image}" alt="${event.title}" />
        <div class="event-info attended-info">
          <h3>${event.title}</h3>
          <p><span class="label">Date:</span> ${formattedDate}</p>
          <p><span class="label">Location:</span> ${event.location}</p>
          <p>${event.description}</p>
          <button onclick="goToAttendedSingular('${event._id}')">View Event</button>
          <button onclick="goToEventGallery('${event._id}')">View Media</button>
        </div>
      </div>
    `
    })
    .join('')
}

document.getElementById('attended-wrapper').addEventListener('click', (ev) => {
  const slide = ev.target.closest('.event-slide')
  if (slide) {
    const eventId = slide.getAttribute('data-event-id')
    goToAttendedSingular(eventId)
  }
})

// Singular attended event
async function loadSingularAttended(eventId) {
  try {
    const event = await apiFetch(`${API_URL}/events/${eventId}`)
    document.getElementById('attended-event-title').textContent = event.title
    document.getElementById('attended-event-image').src = event.image
    document.getElementById('attended-event-description').textContent =
      event.description
    window.currentEventId = eventId
  } catch (error) {
    console.error('Error loading attended singular:', error)
  }
}

export function goToAttendedSingular(eventId) {
  showView('attended-event-singular-view')
  loadSingularAttended(eventId)
}

// Manejo de botones en singular view
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-back-to-list').addEventListener('click', () => {
    showView('attended-events-view', true)
  })
  document.getElementById('btn-view-media').addEventListener('click', () => {
    if (window.currentEventId) {
      sessionStorage.setItem('galleryOrigin', 'attended')
      showEventGallery(window.currentEventId)
    }
  })
})
