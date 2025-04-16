// URL de la API
const PORT = 3050
const API_URL = `http://localhost:${PORT}/api/v1`

// Almacenamos token
let authToken = localStorage.getItem('authToken') || null

// Función de fetch a la API
async function apiFetch(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }
  try {
    const response = await fetch(url, { ...options, headers })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'error on petition')
    }
    return data
  } catch (error) {
    console.error('Fetch to API issue', error)
    throw error
  }
}

// Variable para almacenar historial de vistas
let viewHistorial = []

// Obtener la vista actual visible
function getActualViewId() {
  const actualView = document.querySelector('.view:not(.hidden)')
  return actualView ? actualView.id : null
}

// Función para cambiar de vista
function showView(viewId, cleanHistory) {
  if (cleanHistory) {
    viewHistorial = []
  }
  const actualViewId = getActualViewId()
  if (actualViewId && actualViewId !== viewId) {
    viewHistorial.push(actualViewId)
  }

  // Ocultar todas las vistas
  document.querySelectorAll('.view').forEach((vw) => vw.classList.add('hidden'))

  // Mostrar la vista solicitada
  const view = document.getElementById(viewId)
  if (view) {
    view.classList.remove('hidden')
  } else {
    console.error('No view with id', viewId)
  }

  // Lógica para cabeceras
  const authHeader = document.getElementById('auth-header')
  const mainHeader = document.getElementById('main-header')
  const viewHeader = document.getElementById('view-header')
  if (authHeader) authHeader.classList.add('hidden')
  if (mainHeader) mainHeader.classList.add('hidden')
  if (viewHeader) viewHeader.classList.add('hidden')

  if (viewId === 'login-view' || viewId === 'register-view') {
    if (authHeader) authHeader.classList.remove('hidden')
  } else if (viewId === 'main-menu-view') {
    if (mainHeader) mainHeader.classList.remove('hidden')
  } else {
    if (viewHeader) {
      let viewTitle = ''
      switch (viewId) {
        case 'upcoming-events-view':
          viewTitle = 'Upcoming Events'
          break
        case 'attended-events-view':
          viewTitle = 'Attended Events'
          break
        case 'gallery-view':
          viewTitle = 'ETOMIC Gallery'
          break
        case 'profile-view':
          viewTitle = 'My Profile'
          loadProfileData()
          break
        case 'upload-media-view':
          viewTitle = 'Upload Media'
          loadSelect() // llamo para tener el select en upload
          break
        case 'attended-event-gallery-view':
          viewTitle = 'Event Gallery'
          break
        case 'tickets-view':
          viewTitle = 'My Tickets'
          break
        default:
          viewTitle = ''
      }
      document.querySelector('#view-header .view-header-title').textContent =
        viewTitle
      viewHeader.classList.remove('hidden')
    }
  }

  // Si la vista es la gallery singular del evento, le pongo  botones nuevos
  if (viewId === 'attended-event-gallery-view') {
    const headerTop = document.querySelector('#view-header .view-header-top')
    let extraBtns = document.getElementById('gallery-extra-buttons')
    if (!extraBtns) {
      extraBtns = document.createElement('div')
      extraBtns.id = 'gallery-extra-buttons'
      extraBtns.style.display = 'flex'
      extraBtns.style.gap = '1rem'
      headerTop.appendChild(extraBtns)
    }

    // Chequeamos origen
    const origin = sessionStorage.getItem('galleryOrigin') || 'attended'
    if (origin === 'etomic') {
      // Solo botón back al gallery
      extraBtns.innerHTML = `
        <button id="back-to-gallery-general-btn">Back to Gallery</button>
      `
      document
        .getElementById('back-to-gallery-general-btn')
        .addEventListener('click', () => {
          showView('gallery-view')
          showGallerySubView('gallery-list-view')
          loadPastEventsGallery()
        })
    } else {
      // si el Origen  es attended -> solo botón Back to Attended Event
      extraBtns.innerHTML = `
        <button id="back-to-attended-event-btn">Back to Attended Event</button>
      `
      document
        .getElementById('back-to-attended-event-btn')
        .addEventListener('click', () => {
          showView('attended-event-singular-view', true)
        })
    }
  } else {
    // Eliminar botones  nuevosextra si los tengo en otras vistas
    const extra = document.getElementById('gallery-extra-buttons')
    if (extra) {
      extra.remove()
    }
  }

  // Carga de datos según la vista
  switch (viewId) {
    case 'main-menu-view':
      loadGallery()
      loadUpcomingEvents()
      loadAttendedEvents()
      break
    case 'upcoming-events-view':
      loadUpcomingEventslist()
      break
    case 'attended-events-view':
      loadAttendedEvents()
      break
    case 'gallery-view':
      break
    default:
      break
  }
}

// Función para logout
function logout() {
  localStorage.removeItem('authToken')
  authToken = null
  showView('login-view', true)
}

// Asignación de listeners con el domcontentloaded
document.addEventListener('DOMContentLoaded', () => {
  // Enlaces del menú lateral (sidebar)
  const profileLink = document.getElementById('profile-link')
  if (profileLink) {
    profileLink.addEventListener('click', (e) => {
      e.preventDefault()
      showView('profile-view')
    })
  }
  const ticketsLink = document.getElementById('tickets-link')
  if (ticketsLink) {
    ticketsLink.addEventListener('click', (e) => {
      e.preventDefault()
      showView('tickets-view')
    })
  }
  const uploadLink = document.getElementById('link-upload')
  if (uploadLink) {
    uploadLink.addEventListener('click', (e) => {
      e.preventDefault()
      showView('upload-media-view')
    })
  }
  const sidebarLogoutLink = document.getElementById('sidebar-logout-link')
  if (sidebarLogoutLink) {
    sidebarLogoutLink.addEventListener('click', (e) => {
      e.preventDefault()
      logout()
    })
  }
  // Botón de logout en la cabecera principal
  const logoutButton = document.getElementById('logout-button')
  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault()
      logout()
    })
  }

  //  no consigo eliminar el duplicado en gallery la primera vez que se entra
  const linkgallery = document.getElementById('link-gallery')
  if (linkgallery) {
    // una sola vez el listener
    linkgallery.addEventListener('click', (ev) => {
      ev.preventDefault()
      showView('gallery-view')
      showGallerySubView('gallery-list-view')
      loadPastEventsGallery()
    })
  }

  const attendedHomeBtn = document.getElementById('attended-home-btn')
  if (attendedHomeBtn) {
    attendedHomeBtn.addEventListener('click', () => {
      showView('main-menu-view', true)
    })
  }
  const homeBtn = document.getElementById('home-btn')
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      showView('main-menu-view', true)
    })
  }
  const attendedBackToListBtn = document.getElementById(
    'attended-back-to-list-btn'
  )
  if (attendedBackToListBtn) {
    attendedBackToListBtn.addEventListener('click', () => {
      showView('attended-events-view', true)
    })
  }

  // boton back ( desuso)
  document.querySelectorAll('.back-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      if (viewHistorial.length > 0) {
        const previousView = viewHistorial.pop()
        showView(previousView)
      } else {
        showView('main-menu-view')
      }
    })
  })
})

// Cargar username
async function loadUserName() {
  try {
    const user = await apiFetch(`${API_URL}/users/me`)
    document.getElementById('username').textContent = user.name
  } catch (error) {
    console.error('error loading username:', error)
  }
}

// Menu lateral //entro y salgo del toggle
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.menu-toggle').forEach((menubtn) => {
    menubtn.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open')
    })
  })
  document.querySelectorAll('#sidebar a').forEach((link) => {
    link.addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open')
    })
  })
})
const closeSideBarBtn = document.getElementById('close-sidebar')
if (closeSideBarBtn) {
  closeSideBarBtn.addEventListener('click', (ev) => {
    ev.preventDefault()
    sidebar.classList.remove('open')
  })
}

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value
  try {
    const data = await apiFetch(`${API_URL}/users/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    authToken = data.token
    localStorage.setItem('authToken', authToken)
    console.log('success login', data)
    showView('main-menu-view')
  } catch (error) {
    document.getElementById('login-error').textContent = error.message
  }
})

// Register
document
  .getElementById('register-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = document.getElementById('register-name').value
    const email = document.getElementById('register-email').value
    const password = document.getElementById('register-password').value
    try {
      const data = await apiFetch(`${API_URL}/users/register`, {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      })
      localStorage.removeItem('authToken')
      authToken = null
      console.log('Registro exitoso', data)
      showView('login-view')
    } catch (error) {
      document.getElementById('register-error').textContent = error.message
    }
  })

// Alternar entre login y register
document.getElementById('show-register').addEventListener('click', (e) => {
  e.preventDefault()
  showView('register-view')
})
document.getElementById('show-login').addEventListener('click', (e) => {
  e.preventDefault()
  showView('login-view')
})

// Swiper para Upcoming
let upcomingSwiperInicial = null
async function loadUpcomingEvents() {
  try {
    const data = await apiFetch(`${API_URL}/events`)
    const wrapper = document.getElementById('upcoming-wrapper')
    wrapper.innerHTML = data
      .map(
        (event) =>
          `<div class="swiper-slide event-slide" data-event-id="${event._id}">
             <img src="${event.image}" alt="${event.title}" />
             <div class="overimg">
               <p>${event.title}</p>
             </div>
           </div>`
      )
      .join('')
    if (upcomingSwiperInicial) {
      upcomingSwiperInicial.destroy(true, true)
    }
    upcomingSwiperInicial = new Swiper('#upcoming-swiper', {
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
// ============================ upcoming ============================
// List view de upcoming
let upcomingEventsData = []
async function loadUpcomingEventslist() {
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
          <img src="${event.image}" alt="${event.title}" />
          <div class="event-info">
            <h3 class="event-title-card">${event.title}</h3>
            <p class="event-date">
              <span class="label">Date:</span>
              <span class="value">${formattedDate}</span>
            </p>
            <p class="event-location">
              <span class="label">Location:</span>
              <span class="value">${event.location}</span>
            </p>
            <p class="event-description-card">${event.description}</p>
            <button onclick="buyTicket('${event._id}')">Buy Tickets</button>
            <button onclick="showFlyer('${event._id}')">Flyer</button>
          </div>
        </div>
      `
    })
    .join('')
}
document.getElementById('event-search').addEventListener('input', function () {
  const filterText = this.value.toLowerCase()
  const filteredEvents = upcomingEventsData.filter((event) =>
    event.title.toLowerCase().includes(filterText)
  )
  configUpcomingEventsList(filteredEvents)
})

async function loadSingularUpcoming(eventId) {
  try {
    const event = await apiFetch(`${API_URL}/events/${eventId}`)
    document.getElementById('upcoming-event-title').textContent = event.title
    document.getElementById('upcoming-event-img').src = event.image
    document.getElementById('upcoming-event-flyer').src = event.flyer
    document.getElementById('upcoming-event-description').textContent =
      event.description
    window.currentUpcomingEventId = eventId
  } catch (error) {}
}

// async function showFlyer(eventId) {
//   try {
//     console.log('show flyer for event:', eventId)
//     const event = await apiFetch(`${API_URL}/events/${eventId}`)
//     openFlyerModal(event.flyer, event.title)
//   } catch (error) {}
// }

document.getElementById('upcoming-wrapper').addEventListener('click', (ev) => {
  const slide = ev.target.closest('.event-slide')
  if (slide) {
    const eventId = slide.getAttribute('data-event-id')
    goToUpcomingSingular(eventId)
  }
})

function showUpcomingEventsView() {
  showView('upcoming-events-view')
  loadUpcomingEventslist()
}

document.getElementById('link-upcoming').addEventListener('click', (ev) => {
  ev.preventDefault()
  showUpcomingEventsView()
})

function goToUpcomingSingular(eventId) {
  showView('upcoming-event-singular-view')
  loadSingularUpcoming(eventId)
}

// ============================ Attended Events ============================
async function loadAttendedEvents() {
  try {
    const data = await apiFetch(`${API_URL}/events/attended`)
    const wrapper = document.getElementById('attended-wrapper')
    wrapper.innerHTML = data
      .map(
        (event) => `
          <div class="swiper-slide event-slide" data-event-id="${event._id}">
            <img src="${event.image}" alt="${event.title}" />
            <div class="overimg">
              <p>${event.title}</p>
            </div>
          </div>
        `
      )
      .join('')
    new Swiper('#attended-swiper', {
      slidesPerView: 3,
      spaceBetween: 0,
      loop: true,
      autoplay: { delay: 2500, disableOnInteraction: false }
    })
  } catch (error) {
    console.error('error loading attended events media:', error)
  }
}

document.getElementById('attended-wrapper').addEventListener('click', (ev) => {
  const slide = ev.target.closest('.event-slide')
  if (slide) {
    const eventId = slide.getAttribute('data-event-id')
    goToAttendedSingular(eventId)
  }
})

async function loadAttendedEventsList() {
  try {
    const events = await apiFetch(`${API_URL}/events/attended`)
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
        <div class="event-item">
          <img src="${event.image}" alt="${event.title}" />
          <div class="event-info">
            <h3 class="event-title-card">${event.title}</h3>
            <p class="event-date">
              <span class="label">Date:</span>
              <span class="value">${formattedDate}</span>
            </p>
            <p class="event-location">
              <span class="label">Location:</span>
              <span class="value">${event.location}</span>
            </p>
            <p class="event-description-card">${event.description}</p>
            <button onclick="goToAttendedSingular('${event._id}')">View Event</button>
            <button onclick="goToEventGallery('${event._id}')">View Media</button>
          </div>
        </div>
      `
    })
    .join('')
}

document.getElementById('link-attended').addEventListener('click', (ev) => {
  ev.preventDefault()
  loadAttendedEventsList()
  showView('attended-events-view')
})

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

function goToAttendedSingular(eventId) {
  showView('attended-event-singular-view')
  loadSingularAttended(eventId)
}

//  function para entrar a la galería desde un evento Attended -btn view media
function goToEventGallery(eventId) {
  if (eventId) {
    sessionStorage.setItem('galleryOrigin', 'attended')
    showEventGallery(eventId)
  }
}

// Funcipn para el botón Event Gallery en la vista singular de un evento (no funciona)
function showAttendedEventGallery() {
  if (window.currentEventId) {
    sessionStorage.setItem('galleryOrigin', 'attended')
    showEventGallery(window.currentEventId)
  }
}

// function para gallery de evento desde gallery
function showEventGalleryFromEtomic(eventId) {
  sessionStorage.setItem('galleryOrigin', 'etomic')
  showEventGallery(eventId)
}

function showEventGallery(eventId) {
  showView('attended-event-gallery-view')
  loadAttendedEventGallery(eventId)
}

async function loadAttendedEventGallery(eventId) {
  try {
    const mediaItems = await apiFetch(`${API_URL}/event-media/${eventId}`)
    const singularContainer = document.getElementById(
      'attended-event-gallery-container'
    )
    if (!mediaItems.length) {
      singularContainer.innerHTML = `<p>No media found for this event.</p>`
      return
    }
    singularContainer.innerHTML = mediaItems
      .map(
        (media) => `
          <div class="gallery-item">
            <img src="${media.imageUrl}" alt="${media.description}" onclick="openImgModal('${media.imageUrl}')" />
          </div>
        `
      )
      .join('')
  } catch (error) {
    console.error('error loading event gallery:', error)
  }
}

function openImgModal(imageUrl) {
  const modal = document.getElementById('flyer-modal')
  modal.querySelector('img').src = imageUrl
  modal.classList.remove('hidden')
  modal.classList.add('open')
}

// ============================ gallery ============================
// Cargar gallery P
async function loadGallery() {
  const mediaItems = await apiFetch(`${API_URL}/event-media`)
  const filteredMedia = mediaItems.filter((media) => {
    if (media.event && media.event.date) {
      return new Date(media.event.date) < new Date()
    }
    return false
  })
  const wrapper = document.getElementById('gallery-wrapper')
  wrapper.innerHTML = filteredMedia
    .map(
      (media) => `
        <div class="swiper-slide">
          <img src="${media.imageUrl}" alt="${media.description}" />
          <p>${media.description}</p>
        </div>
      `
    )
    .join('')
  new Swiper('#gallery-swiper', {
    slidesPerView: 3,
    spaceBetween: 0,
    loop: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
    speed: 1000
  })
}

//controlo click en etomic ngallery parta mostrar view
document.getElementById('link-gallery').addEventListener('click', (ev) => {
  ev.preventDefault()
  showView('gallery-view')
  showGallerySubView('gallery-list-view')
  loadPastEventsGallery()
})

function showGallerySubView(subViewId) {
  const subViews = ['gallery-mosaic-view', 'gallery-list-view']
  subViews.forEach((id) => {
    document.getElementById(id).classList.add('hidden')
  })
  document.getElementById(subViewId).classList.remove('hidden')
}

function backToGalleryList() {
  const individualView = document.getElementById('attended-event-gallery-view')
  if (individualView) {
    individualView.classList.add('hidden')
  }
  showView('gallery-view')
  showGallerySubView('gallery-list-view')
}

// eventos pasados y con su gallery
let galleryData = []
async function loadPastEventsGallery() {
  try {
    const events = await apiFetch(`${API_URL}/events`)
    const pastEvents = events.filter(
      (event) => new Date(event.date) < new Date()
    )
    const listContainer = document.getElementById('gallery-list-container')
    listContainer.innerHTML = ''

    const mediaPromises = pastEvents.map((event) =>
      apiFetch(`${API_URL}/event-media/${event._id}`).catch((error) => {
        console.error(`Error fetching media for event ${event._id}:`, error)
        return []
      })
    )
    const mediaArrays = await Promise.all(mediaPromises)

    pastEvents.forEach((event, index) => {
      const mediaItems = mediaArrays[index] || []
      const selectMedia = mediaItems.slice(0, 4) // Muestro 4 imágenes max
      const eventHTML = `
        <div class="gallery-event-section">
          <h3 onclick="showEventGalleryFromEtomic('${
            event._id
          }')" style="cursor:pointer;">
            ${event.title}
          </h3>
          <div class="gallery-event-items">
            ${selectMedia
              .map(
                (media) =>
                  `<img src="${media.imageUrl}" alt="${media.description}" onclick="openGalleryModal('${media.imageUrl}')" />`
              )
              .join('')}
          </div>
        </div>
      `
      listContainer.innerHTML += eventHTML
    })
  } catch (error) {
    console.error('error loading past events gallery:', error)
  }
}

function openGalleryModal(imageUrl) {
  const modal = document.getElementById('gallery-modal')
  const modalImg = document.getElementById('gallery-modal-img')
  modalImg.src = imageUrl
  modal.classList.remove('hidden')
}

function closeGalleryModal() {
  const modal = document.getElementById('gallery-modal')
  modal.classList.add('hidden')
  document.getElementById('gallery-modal-img').src = ''
}

document
  .getElementById('gallery-modal')
  .addEventListener('click', function (event) {
    if (event.target == this) {
      closeGalleryModal()
    }
  })

// Mostrar flyer en modal
async function showFlyer(eventId) {
  try {
    const event = await apiFetch(`${API_URL}/events/${eventId}`)
    openFlyerModal(event.flyer, event.title)
  } catch (error) {
    console.error('error showing flyer for event', error)
  }
}

function openFlyerModal(flyerUrl, eventTitle) {
  const modalFlyer = document.getElementById('flyer-modal')
  modalFlyer.querySelector('img').src = flyerUrl
  modalFlyer.querySelector('.modalFlyer-title').textContent = eventTitle
  modalFlyer.classList.remove('hidden')
  modalFlyer.classList.add('open')
}

function closeFlyerModal() {
  const modalFlyer = document.getElementById('flyer-modal')
  modalFlyer.classList.remove('open')
  modalFlyer.classList.add('hidden')
}

// floating messages para mejorar disposicion con usuario
function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container')
  const toast = document.createElement('div')
  toast.className = 'toast'
  toast.textContent = message
  container.appendChild(toast)
  setTimeout(() => {
    toast.classList.add('fade-out')
    setTimeout(() => {
      container.removeChild(toast)
    }, 500)
  }, duration)
}

// en seccion login, mostrar o ocultar pwd
const showPasswordBtn = document.getElementById('toggle-password')
if (showPasswordBtn) {
  showPasswordBtn.addEventListener('click', () => {
    const placePwrd = document.getElementById('login-password')
    if (placePwrd.type === 'password') {
      placePwrd.type = 'text'
      showPasswordBtn.textContent = 'Hide'
    } else {
      placePwrd.type = 'password'
      showPasswordBtn.textContent = 'Show'
    }
  })
}

// en seccion register, mostrar o ocultar pwd

const toggleRegisterPasswordBtn = document.getElementById(
  'toggle-register-password'
)
if (toggleRegisterPasswordBtn) {
  toggleRegisterPasswordBtn.addEventListener('click', () => {
    const pwdField = document.getElementById('register-password')
    if (pwdField.type === 'password') {
      pwdField.type = 'text'
      toggleRegisterPasswordBtn.textContent = 'Hide'
    } else {
      pwdField.type = 'password'
      toggleRegisterPasswordBtn.textContent = 'Show'
    }
  })
}

const toggleRegisterConfirmPasswordBtn = document.getElementById(
  'toggle-register-confirm-password'
)
if (toggleRegisterConfirmPasswordBtn) {
  toggleRegisterConfirmPasswordBtn.addEventListener('click', () => {
    const pwdField = document.getElementById('register-confirm-password')
    if (pwdField.type === 'password') {
      pwdField.type = 'text'
      toggleRegisterConfirmPasswordBtn.textContent = 'Hide'
    } else {
      pwdField.type = 'password'
      toggleRegisterConfirmPasswordBtn.textContent = 'Show'
    }
  })
}

// cargar los eventos en el select de postmedia
async function loadSelect() {
  try {
    const events = await apiFetch(`${API_URL}/events/attended`)
    const selectEl = document.getElementById('upload-event-select')
    selectEl.innerHTML = `<option value="">Select an attended event</option>`
    events.forEach((event) => {
      const option = document.createElement('option')
      option.value = event._id
      option.textContent = event.title
      selectEl.appendChild(option)
    })
  } catch (error) {
    console.error('Error loading attended events for upload:', error)
  }
}

//cargar los datos de mi perfil
async function loadProfileData() {
  try {
    const user = await apiFetch(`${API_URL}/users/me`)

    const profileDetailsDiv = document.getElementById('profile-details')

    // html con los datos del user
    profileDetailsDiv.innerHTML = `
      <img 
        src="${user.profileImage || 'https://via.placeholder.com/150'}" 
        alt="Profile Image" 
      />
      <h3>${user.name}</h3>
      <p>${user.email}</p>
    `

    // precargo la columna de la right
    document.getElementById('profile-name').value = user.name || ''
    document.getElementById('profile-email').value = user.email || ''
  } catch (error) {
    console.error('Error cargando datos de perfil:', error)
  }
}
