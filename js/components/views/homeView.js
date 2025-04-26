import { showView } from '../../navigation.js'
import { apiFetch, API_URL } from '../../api.js'

/**
 * Render the Home (Main Menu) view, showing Upcoming, Attended, and Gallery sliders.
 */
export function renderHomeView() {
  return `
    <section id="main-menu-view" class="principal view hidden">
      <main class="content">
        <!-- Upcoming Events Section -->
        <section class="events-section">
          <h2><a href="#" id="link-upcoming">UPCOMING EVENTS</a></h2>
          <div class="swiper" id="upcoming-swiper">
            <div class="swiper-wrapper" id="upcoming-wrapper"></div>
            <div class="swiper-button-prev" id="upcoming-prev"></div>
            <div class="swiper-button-next" id="upcoming-next"></div>
          </div>
        </section>

        <!-- Attended Events Section -->
        <section class="events-section">
          <h2><a href="#" id="link-attended">ATTENDED EVENTS</a></h2>
          <div class="swiper" id="attended-swiper">
            <div class="swiper-wrapper" id="attended-wrapper"></div>
            <div class="swiper-button-prev" id="attended-prev"></div>
            <div class="swiper-button-next" id="attended-next"></div>
          </div>
        </section>

        <!-- ETOMIC Gallery Section -->
        <section class="events-section">
          <h2><a href="#" id="link-gallery">ETOMIC GALLERY</a></h2>
          <div class="swiper" id="gallery-swiper">
            <div class="swiper-wrapper" id="gallery-wrapper"></div>
            <div class="swiper-button-prev" id="gallery-prev"></div>
            <div class="swiper-button-next" id="gallery-next"></div>
          </div>
        </section>
      </main>
    </section>
  `
}

/**
 * Initialize Home view: attach listeners and load initial slider data.
 */

export async function initHomeView() {
  // Al clicar en los enlaces del título:
  document.getElementById('link-upcoming')?.addEventListener('click', (e) => {
    e.preventDefault()
    showView('upcoming-events-view')
  })
  document.getElementById('link-attended')?.addEventListener('click', (e) => {
    e.preventDefault()
    showView('attended-events-view')
  })
  document.getElementById('link-gallery')?.addEventListener('click', (e) => {
    e.preventDefault()
    showView('gallery-view')
  })

  // Inicializar sub-vistas de home para que el slider cargue
  await initUpcomingCarousel()
  await initAttendedCarousel()
  await initGalleryCarousel()
}

async function initUpcomingCarousel() {
  const wrapper = document.getElementById('upcoming-wrapper')
  const events = await apiFetch(`${API_URL}/events/upcoming`)
  wrapper.innerHTML = events
    .map(
      (ev) => `
    <div class="swiper-slide">
      <img src="${ev.image}" alt="${ev.title}" />
      <div class="overimg"><p>${ev.title}</p></div>
    </div>
  `
    )
    .join('')

  /* global Swiper */
  new Swiper('#upcoming-swiper', {
    slidesPerView: 3,
    spaceBetween: 20,
    navigation: {
      prevEl: '#upcoming-prev',
      nextEl: '#upcoming-next'
    }
  })
}

async function initAttendedCarousel() {
  const wrapper = document.getElementById('attended-wrapper')
  const events = await apiFetch(`${API_URL}/events/attended`)
  wrapper.innerHTML = events
    .map(
      (ev) => `
    <div class="swiper-slide">
      <img src="${ev.image}" alt="${ev.title}" />
      <div class="overimg"><p>${ev.title}</p></div>
    </div>
  `
    )
    .join('')

  new Swiper('#attended-swiper', {
    slidesPerView: 3,
    spaceBetween: 20,
    navigation: {
      prevEl: '#attended-prev',
      nextEl: '#attended-next'
    }
  })
}

async function initGalleryCarousel() {
  const wrapper = document.getElementById('gallery-wrapper')
  const items = await apiFetch(`${API_URL}/event-media`)
  wrapper.innerHTML = items
    .map(
      (m) => `
    <div class="swiper-slide">
      <img src="${m.imageUrl}" alt="${m.description}" />
      <div class="overimg"><p>${m.description}</p></div>
    </div>
  `
    )
    .join('')

  new Swiper('#gallery-swiper', {
    slidesPerView: 3,
    spaceBetween: 20,
    navigation: {
      prevEl: '#gallery-prev',
      nextEl: '#gallery-next'
    }
  })
}
