// js/components/views/galleryView.js

// Assumes apiFetch and showView are still globals or imported elsewhere,
// and Swiper is available on window (we're using the same CDN you had).
export function renderGalleryView() {
  return `
    <section id="gallery-view" class="view hidden">
      <div class="search-container">
        <input type="text" id="gallery-search" placeholder="Search Gallery..." />
      </div>
      <section id="gallery-mosaic-view" class="view hidden">
        <div id="gallery-full-list"></div>
      </section>
      <section id="gallery-list-view" class="view hidden">
        <div id="gallery-list-container"></div>
      </section>
      <!-- Zoom modal -->
      <div id="gallery-modal" class="modalGallery hidden">
        <div class="modalGallery-content">
          <span class="close-btn" id="gallery-modal-close">&times;</span>
          <img id="gallery-modal-img" alt="Zoomed Image" />
        </div>
      </div>
    </section>
  `
}

export function initGalleryView() {
  // Show gallery list on sidebar/menu click
  const link = document.getElementById('link-gallery')
  if (link) {
    link.addEventListener('click', (ev) => {
      ev.preventDefault()
      showView('gallery-view')
      showGallerySubView('gallery-list-view')
      loadPastEventsGallery()
    })
  }

  // Close modal on background or close‑btn click
  const modal = document.getElementById('gallery-modal')
  if (modal) {
    modal.addEventListener('click', (ev) => {
      if (
        ev.target.id === 'gallery-modal' ||
        ev.target.id === 'gallery-modal-close'
      ) {
        closeGalleryModal()
      }
    })
  }
}

// === Helpers & Data Loaders ===

// Switch between mosaic and list
function showGallerySubView(subViewId) {
  ;['gallery-mosaic-view', 'gallery-list-view'].forEach((id) =>
    document.getElementById(id).classList.add('hidden')
  )
  document.getElementById(subViewId).classList.remove('hidden')
}

// Load & display a simple Swiper of ALL past‑event media
async function loadGallery() {
  const mediaItems = await apiFetch(`${API_URL}/event-media`)
  const filtered = mediaItems.filter(
    (m) => m.event?.date && new Date(m.event.date) < new Date()
  )
  const wrapper = document.getElementById('gallery-full-list')
  wrapper.innerHTML = filtered
    .map(
      (m) => `
    <div class="swiper-slide">
      <img src="${m.imageUrl}" alt="${m.description}" />
      <p>${m.description}</p>
    </div>
  `
    )
    .join('')
  new Swiper('#gallery-swiper', {
    slidesPerView: 3,
    loop: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
    speed: 1000
  })
}

// Build the list‑view: one section per past event, up to 4 pics each
async function loadPastEventsGallery() {
  try {
    const events = await apiFetch(`${API_URL}/events`)
    const past = events.filter((e) => new Date(e.date) < new Date())
    const container = document.getElementById('gallery-list-container')
    container.innerHTML = ''
    for (let evt of past) {
      const media = await apiFetch(`${API_URL}/event-media/${evt._id}`)
      const slice = media.slice(0, 4)
      const section = document.createElement('div')
      section.className = 'gallery-event-section'
      section.innerHTML = `
        <h3 onclick="showEventGalleryFromEtomic('${
          evt._id
        }')" style="cursor:pointer;">
          ${evt.title}
        </h3>
        <div class="gallery-event-items">
          ${slice
            .map(
              (m) =>
                `<img src="${m.imageUrl}" alt="${m.description}" onclick="openGalleryModal('${m.imageUrl}')" />`
            )
            .join('')}
        </div>
      `
      container.appendChild(section)
    }
  } catch (err) {
    console.error('error loading past events gallery:', err)
  }
}

function openGalleryModal(url) {
  const modal = document.getElementById('gallery-modal')
  document.getElementById('gallery-modal-img').src = url
  modal.classList.remove('hidden')
}

function closeGalleryModal() {
  const modal = document.getElementById('gallery-modal')
  modal.classList.add('hidden')
  document.getElementById('gallery-modal-img').src = ''
}
