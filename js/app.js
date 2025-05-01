// js/app.js
import { renderAuthHeader, innitAppHeader } from './components/layout/header.js'

import { showView } from './navigation.js'

import {
  renderLoginView,
  initLoginView
} from './components/views/Log-Reg/loginView.js'

import {
  initRegisterView,
  renderRegisterView
} from './components/views/Log-Reg/registerView.js'

import {
  renderHomeView,
  initHomeView
} from './components/views/home/homeView.js'

import {
  renderUpcomingEventsView,
  initUpcomingEventsView
} from './components/views/upcoming/upcomingEventsView.js'

import {
  renderAttendedEventsView,
  initAttendedEventsView
} from './components/views/attended/attendedEventsView.js'

import {
  renderAttendedEventDetailView,
  initAttendedEventDetailView
} from './components/views/attended/attendedEventDetailView.js'

import {
  renderGalleryView,
  initGalleryView
} from './components/views/gallery/galleryView.js'

import {
  renderUploadMediaView,
  initUploadMediaView
} from './components/views/upload/uploadMediaView.js'

import {
  renderProfileView,
  initProfileView
} from './components/views/profile/profileView.js'

import { renderFooter } from './components/layout/footer.js'

// 1) Montamos el HTML base: header + todas las vistas ocultas + footer
const app = document.getElementById('app')
app.innerHTML = `
<div id="header-container">
${renderAuthHeader()}

</div>

<main>
  ${renderLoginView()}
  ${renderRegisterView()}
  ${renderHomeView()}
  ${renderUpcomingEventsView()}
  ${renderAttendedEventsView()}
  ${renderAttendedEventDetailView()}
  ${renderGalleryView()}
  ${renderUploadMediaView()}
  ${renderProfileView()}
</main>
${renderFooter()}
`

// 2) Al DOMContentLoaded inicializamos cada módulo y forzamos login
document.addEventListener('DOMContentLoaded', () => {
  // Inicializaciones (añaden event‑listeners, fetch iniciales, etc)
  initLoginView()
  initRegisterView()
  initHomeView()
  initUpcomingEventsView()
  initAttendedEventsView()
  initAttendedEventDetailView()
  initGalleryView()
  initUploadMediaView()
  initProfileView()

  //config header para navegacion

  innitAppHeader()

  // Forzamos que la primera vista al cargar sea la de Login
  showView('login-view', true)
})
