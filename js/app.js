//importar y montar componentes

import { renderHeader, renderFooter } from './components/layout/headerFooter.js'
import { renderLoginView, initLoginView } from './components/views/loginView.js'
import {
  renderRegisterView,
  initRegisterView
} from './components/views/registerView.js'
import { renderHomeView, initHomeView } from './components/views/homeView.js'
import {
  renderUpcomingView,
  initUpcomingView
} from './components/views/upcomingEventsView.js'
import {
  renderAttendedView,
  initAttendedView
} from './components/views/attendedEventsView.js'
import {
  renderGalleryView,
  initGalleryView
} from './components/views/galleryView.js'
import {
  renderUploadMediaView,
  initUploadMediaView
} from './components/views/uploadMediaView.js'
import {
  renderProfileView,
  initProfileView
} from './components/views/profileView.js'

//renderizar

const app = document.getElementById('app')
app.innerHTML = `
  ${renderHeader()}
  <main>
    ${renderLoginView()}
    ${renderRegisterView()}
    ${renderHomeView()}
    ${renderUpcomingView()}
    ${renderAttendedView()}
    ${renderGalleryView()}
    ${renderUploadMediaView()}
    ${renderProfileView()}
    <!-- opcional: ${renderTicketsView()} -->
  </main>
  ${renderFooter()}
`

// incicializar componentes

initLoginView()
initRegisterView()
initHomeView()
initUpcomingView()
initAttendedView()
initGalleryView()
initUploadMediaView()
initProfileView()
