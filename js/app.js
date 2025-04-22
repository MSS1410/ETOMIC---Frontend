// js/app.js
import { showView } from './navigation.js'
import { initLoginView, renderLoginView } from './components/views/loginView.js'
import {
  initRegisterView,
  renderRegisterView
} from './components/views/registerView.js'
import { initHomeView, renderHomeView } from './components/views/homeView.js'
import {
  initUpcomingEventsView,
  renderUpcomingEventsView
} from './components/views/upcomingEventsView.js'
import {
  initAttendedEvents,
  renderAttendedEventsView
} from './components/views/attendedEventsView.js'
import {
  initGalleryView,
  renderGalleryView
} from './components/views/galleryView.js'
import {
  initUploadMediaView,
  renderUploadMediaView
} from './components/views/uploadMediaView.js'
import {
  initProfileView,
  renderProfileView
} from './components/views/profileView.js'
import { renderHeader } from './components/header.js'
import { renderFooter } from './components/footer.js'
import { showToast } from './toast.js'

// 1) Montamos el HTML base: header + todas las vistas ocultas + footer
const app = document.getElementById('app')
app.innerHTML = `
  ${renderHeader()}

  <main>
    <section id="login-view" class="view hidden">
      ${renderLoginView()}
    </section>

    <section id="register-view" class="view hidden">
      ${renderRegisterView()}
    </section>

    <section id="main-menu-view" class="view hidden">
      ${renderHomeView()}
    </section>

    <section id="upcoming-events-view" class="view hidden">
      ${renderUpcomingEventsView()}
    </section>

    <section id="attended-events-view" class="view hidden">
      ${renderAttendedEventsView()}
    </section>

    <section id="gallery-view" class="view hidden">
      ${renderGalleryView()}
    </section>

    <section id="upload-media-view" class="view hidden">
      ${renderUploadMediaView()}
    </section>

    <section id="profile-view" class="view hidden">
      ${renderProfileView()}
    </section>
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
  initGalleryView()
  initUploadMediaView()
  initProfileView()

  // Forzamos que la primera vista al cargar sea la de Login
  showView('login-view', true)
})
