// js/components/views/profile/profileView.js
import { apiFetch, API_URL } from '../../../api.js'
import { showToast } from '../../../toast.js'
import { showView } from '../../../navigation.js'

/**
 * Renderiza la vista de perfil en dos columnas:
 *  - profile-info: imagen, nombre y correo actuales
 *  - profile-form: formularios de actualización
 */
export function renderProfileView() {
  return `
    <section id="profile-view" class="view hidden">
      <button class="back-btn" id="profile-back">Back</button>
      <h2>My Profile</h2>
      <div class="profile-container">
        <div class="profile-info">
          <img id="profile-now-image" src="" alt="Profile Image" />
          <h3 id="profile-now-name"></h3>
          <p id="profile-now-email"></p>
        </div>
        <div class="profile-form">
          <form id="profile-data-form">
            <h3>Update Details</h3>
            <label for="profile-name">Name:</label>
            <input type="text" id="profile-name" />
            <label for="profile-email">Email:</label>
            <input type="email" id="profile-email" />
            <label for="profile-password">New Password:</label>
            <input type="password" id="profile-password" />
            <label for="profile-confirm-password">Confirm Password:</label>
            <input type="password" id="profile-confirm-password" />
            <button type="submit" class="btn-primary">Save Changes</button>
          </form>
          <form id="profile-image-form">
            <h3>Update Image</h3>
            <input type="file" id="profile-image-input" />
            <button type="submit" class="btn-primary">Upload Image</button>
          </form>
          <p id="profile-error" class="error"></p>
          <p id="profile-success" class="success"></p>
        </div>
      </div>
    </section>
  `
}

/**
 * Inicializa la vista Profile:
 *  - Botón Back
 *  - Carga y muestra datos actuales
 *  - Gestiona formularios de datos y de imagen
 */
export async function initProfileView() {
  // Back
  document
    .getElementById('profile-back')
    .addEventListener('click', () => showView('main-menu-view', true))

  // Cargar datos actuales
  let user
  try {
    user = await apiFetch(`${API_URL}/users/me`)
    // Asignar imagen
    const imgEl = document.getElementById('profile-now-image')
    const profileUrl = user.profileImage || user.imageUrl || user.image
    if (profileUrl) imgEl.src = profileUrl
    // preguntar si puedo mandar un mensaje por pantalla como no tiene imagen de perfil
    else imgEl.removeAttribute('src')

    document.getElementById('profile-now-name').textContent = user.name
    document.getElementById('profile-now-email').textContent = user.email
    document.getElementById('profile-name').value = user.name
    document.getElementById('profile-email').value = user.email
  } catch (err) {
    console.error('Error loading profile:', err)
  }

  // Formulario de datos
  document
    .getElementById('profile-data-form')
    .addEventListener('submit', async (ev) => {
      ev.preventDefault()
      const name = document.getElementById('profile-name').value
      const email = document.getElementById('profile-email').value
      const password = document.getElementById('profile-password').value
      const confirm = document.getElementById('profile-confirm-password').value
      if (password && password !== confirm) {
        showToast('Passwords do not match')
        return
      }
      try {
        // Usa el mismo user._id obtenido antes
        await apiFetch(`${API_URL}/users/${user._id}`, {
          method: 'PUT',
          body: JSON.stringify({ name, email, password })
        })
        document.getElementById('profile-success').textContent =
          'Profile updated'
        showToast('Profile updated')
      } catch (error) {
        document.getElementById('profile-error').textContent = error.message
        showToast(error.message)
      }
    })

  // Formulario de imagen
  document
    .getElementById('profile-image-form')
    .addEventListener('submit', async (e) => {
      e.preventDefault()
      const file = document.getElementById('profile-image-input').files[0]
      if (!file) {
        showToast('Please select an image')
        return
      }
      const formData = new FormData()

      formData.append('img', file)
      try {
        await apiFetch(`${API_URL}/users/profile/profile-image`, {
          method: 'PUT',
          body: formData,
          headers: {} // multipart
        })
        document.getElementById('profile-success').textContent = 'Image updated'
        showToast('Profile image updated')
      } catch (error) {
        document.getElementById('profile-error').textContent = error.message
        showToast(error.message)
      }
    })
}
