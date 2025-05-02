// header para login y registro

import { initUploadMediaView } from '../views/upload/uploadMediaView.js'
import { initProfileView } from '../views/profile/profileView.js'
import { showView } from '../../navigation.js'

export function renderAuthHeader() {
  return `
    <header class="auth-header">
      <div class="auth-header-content">
        <img src="./assets/e-logo.png" alt="ETOMIC Logo" class="auth-logo"/>
        <h1>ETOMIC</h1>
      </div>
    </header>
  `
}

// header completo para home y sub views
export function renderAppHeader() {
  return `
    <header class="app-header">
      <div class="app-header-left">
        <img src="/assets/e-logo.png" alt="ETOMIC Logo" class="app-logo"/>
        <h1 class="app-title">Electronic Techno Music Events </h1>
      </div>
      <nav class="app-nav">
        <ul>
          <li><a href="#" id="nav-upload">Upload Media</a></li>
          <li><a href="#" id="nav-tickets">Tickets</a></li>
          <li><a href="#" id="nav-profile">Profile</a></li>
        </ul>
      </nav>
    </header>
  `
}

export function innitAppHeader() {
  document.getElementById('nav-upload')?.addEventListener('click', (ev) => {
    ev.preventDefault()
    showView('upload-media-view', true)
    initUploadMediaView()
  })
  document.getElementById('nav-profile')?.addEventListener('click', (ev) => {
    ev.preventDefault()
    showView('profile-view', true)
    initProfileView()
  })
}
