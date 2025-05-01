// js/components/views/profileView.js
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
          <button type="submit">Upload Image</button>
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
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </section>
  `
}

/**
 * Inicializa la vista de perfil:
 * - Inserta HTML si no existe
 * - Muestra la vista
 * - Configura formularios y botón Back
 */
export function initProfileView() {
  const app = document.getElementById('app')
  if (!document.getElementById('profile-view')) {
    app.insertAdjacentHTML('beforeend', renderProfileView())
  }
  showView('profile-view')

  // Botón Back
  const backBtn = document.getElementById('profile-back')
  backBtn.replaceWith(backBtn.cloneNode(true))
  document
    .getElementById('profile-back')
    .addEventListener('click', () => showView('main-menu-view'))

  // Formulario de imagen
  const imgForm = document.getElementById('profile-image-form')
  imgForm.replaceWith(imgForm.cloneNode(true))
  document
    .getElementById('profile-image-form')
    .addEventListener('submit', async (e) => {
      e.preventDefault()
      const file = document.getElementById('profile-image-input').files[0]
      if (!file) return showToast('Selecciona una imagen')
      const formData = new FormData()
      formData.append('image', file)
      try {
        await apiFetch(`${API_URL}/users/profile/image`, {
          method: 'POST',
          body: formData,
          headers: {}
        })
        showToast('Imagen de perfil actualizada')
      } catch (error) {
        showToast(error.message)
      }
    })

  // Formulario de datos
  const dataForm = document.getElementById('profile-data-form')
  dataForm.replaceWith(dataForm.cloneNode(true))
  document
    .getElementById('profile-data-form')
    .addEventListener('submit', async (e) => {
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
      } catch (error) {
        showToast(error.message)
      }
    })
}
