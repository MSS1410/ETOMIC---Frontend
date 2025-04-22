// js/components/views/profileView.js
import { apiFetch, API_URL } from '../../api.js'
import { showToast } from '../../toast.js'
import { showView } from '../../navigation.js'

/**
 * Render Profile View: user details, avatar and data forms
 */
export function renderProfileView() {
  return `
    <section id="profile-view" class="view hidden">
      <div class="profile-container">
        <div id="profile-details" class="profile-details"></div>
        <div class="profile-forms">
          <form id="profile-image-form" class="profile-form">
            <label for="profile-image-input">Change Profile Image</label>
            <input type="file" id="profile-image-input" accept="image/*" />
            <button type="submit">Upload Image</button>
            <div id="profile-image-error" class="error"></div>
          </form>
          <form id="profile-data-form" class="profile-form">
            <label for="profile-name">Name</label>
            <input type="text" id="profile-name" />
            <label for="profile-email">Email</label>
            <input type="email" id="profile-email" />
            <label for="profile-password">Password</label>
            <input type="password" id="profile-password" placeholder="New Password" />
            <label for="profile-confirm-password">Repeat Password</label>
            <input type="password" id="profile-confirm-password" placeholder="Repeat Password" />
            <button type="submit">Save Changes</button>
            <div id="profile-data-error" class="error"></div>
          </form>
        </div>
      </div>
    </section>
  `
}
// profileView.js
export function initProfileView() {
  // 1) Subida de imagen de perfil
  document
    .getElementById('profile-image-form')
    ?.addEventListener('submit', async (e) => {
      e.preventDefault()
      const file = document.getElementById('profile-image-input').files[0]
      if (!file) return showToast('Selecciona una imagen')
      const form = new FormData()
      form.append('image', file)
      try {
        await apiFetch(`${API_URL}/users/profile/image`, {
          method: 'POST',
          body: form,
          headers: {}
        })
        showToast('Imagen de perfil actualizada')
      } catch (err) {
        showToast(err.message)
      }
    })

  // 2) Actualización de datos y contraseña
  document
    .getElementById('profile-data-form')
    ?.addEventListener('submit', async (e) => {
      e.preventDefault()
      const name = document.getElementById('profile-name').value
      const email = document.getElementById('profile-email').value
      const password = document.getElementById('profile-password').value
      const confirm = document.getElementById('profile-confirm-password').value
      if (password && password !== confirm)
        return showToast('Las contraseñas no coinciden')
      try {
        await apiFetch(`${API_URL}/users/profile`, {
          method: 'PUT',
          body: JSON.stringify({ name, email, password })
        })
        showToast('Perfil guardado')
      } catch (err) {
        showToast(err.message)
      }
    })
}
