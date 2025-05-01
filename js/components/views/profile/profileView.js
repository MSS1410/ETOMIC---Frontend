import { apiFetch, API_URL } from '../../../api.js'
import { showToast } from '../../../toast.js'
import { showView } from '../../../navigation.js'

/**
 * Renderiza la estructura base de la vista de perfil.
 */
export function renderProfileView() {
  return `
    <section id="profile-view" class="view hidden">
      <button class="back-btn" id="profile-back">Back</button>
      <h2>My Profile</h2>

      <div class="profile-section">
        <form id="profile-image-form">
          <label for="profile-image-input">Profile Image:</label>
          <input type="file" id="profile-image-input" />
          <button type="submit" id="profile-image-submit">Upload Image</button>
        </form>
      </div>

      <div class="profile-section">
        <form id="profile-data-form">
          <label for="profile-name">Name:</label>
          <input type="text" id="profile-name" />

          <label for="profile-email">Email:</label>
          <input type="email" id="profile-email" />

          <label for="profile-password">Password:</label>
          <input type="password" id="profile-password" />

          <label for="profile-confirm-password">Confirm Password:</label>
          <input type="password" id="profile-confirm-password" />

          <button type="submit" id="profile-data-submit">Save Profile</button>
        </form>
      </div>

      <p id="profile-error" class="error"></p>
      <p id="profile-success" class="success"></p>
    </section>
  `
}

/**
 * Inicializa la vista Profile:
 * - Configura el botón Back
 * - Gestiona formularios de imagen y datos
 */
export function initProfileView() {
  // Botón Back: volver al menú principal
  document
    .getElementById('profile-back')
    .addEventListener('click', () => showView('main-menu-view'))

  // Formulario de imagen de perfil
  document
    .getElementById('profile-image-form')
    .addEventListener('submit', async (e) => {
      e.preventDefault()
      const file = document.getElementById('profile-image-input').files[0]
      if (!file) return showToast('Please select an image')
      const formData = new FormData()
      formData.append('image', file)
      try {
        await apiFetch(`${API_URL}/users/profile/image`, {
          method: 'POST',
          body: formData,
          headers: {}
        })
        document.getElementById('profile-success').textContent =
          'Image updated successfully'
        showToast('Profile image updated')
      } catch (err) {
        document.getElementById('profile-error').textContent = err.message
        showToast(err.message)
      }
    })

  // Formulario de datos de perfil
  document
    .getElementById('profile-data-form')
    .addEventListener('submit', async (e) => {
      e.preventDefault()
      const name = document.getElementById('profile-name').value
      const email = document.getElementById('profile-email').value
      const password = document.getElementById('profile-password').value
      const confirm = document.getElementById('profile-confirm-password').value

      if (password && password !== confirm) {
        showToast('Passwords do not match')
        return
      }

      try {
        await apiFetch(`${API_URL}/users/profile`, {
          method: 'PUT',
          body: JSON.stringify({ name, email, password })
        })
        document.getElementById('profile-success').textContent =
          'Profile saved successfully'
        showToast('Profile updated')
      } catch (err) {
        document.getElementById('profile-error').textContent = err.message
        showToast(err.message)
      }
    })
}
