// js/components/views/homeView.js

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
          </div>
        </section>

        <!-- Attended Events Section -->
        <section class="events-section">
          <h2><a href="#" id="link-attended">ATTENDED EVENTS</a></h2>
          <div class="swiper" id="attended-swiper">
            <div class="swiper-wrapper" id="attended-wrapper"></div>
          </div>
        </section>

        <!-- ETOMIC Gallery Section -->
        <section class="events-section">
          <h2><a href="#" id="link-gallery">ETOMIC GALLERY</a></h2>
          <div class="swiper" id="gallery-swiper">
            <div class="swiper-wrapper" id="gallery-wrapper"></div>
          </div>
        </section>
      </main>
    </section>
  `
}

/**
 * Initialize Home view: attach listeners and load initial slider data.
 */
export function initHomeView() {
  // Navigation links
  document.getElementById('link-upcoming')?.addEventListener('click', (ev) => {
    ev.preventDefault()
    showView('upcoming-events-view')
  })
  document.getElementById('link-attended')?.addEventListener('click', (ev) => {
    ev.preventDefault()
    showView('attended-events-view')
  })
  document.getElementById('link-gallery')?.addEventListener('click', (ev) => {
    ev.preventDefault()
    showView('gallery-view')
  })

  // On entering home, load all three sliders
  loadUpcomingEvents()
  loadAttendedEvents()
  loadGallery()
}
