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
  // Back Button
  document
    .getElementById('profile-back')
    .addEventListener('click', () => showView('main-menu-view', true))

  // Cargar datos actuales
  let user
  try {
    user = await apiFetch(`${API_URL}/users/me`)
    const imgEl = document.getElementById('profile-now-image')
    const profileUrl = user.profileImage || user.imageUrl || user.image
    if (profileUrl) imgEl.src = profileUrl
    else imgEl.removeAttribute('src')

    document.getElementById('profile-now-name').textContent = user.name
    document.getElementById('profile-now-email').textContent = user.email
    document.getElementById('profile-name').value = user.name
    document.getElementById('profile-email').value = user.email
  } catch (err) {
    console.error('Error loading profile:', err)
  }

  // Formulario de datos de perfil
  const dataForm = document.getElementById('profile-data-form')
  const dataError = document.getElementById('profile-error')
  const dataSuccess = document.getElementById('profile-success')

  dataForm.onsubmit = async (ev) => {
    ev.preventDefault()
    dataError.textContent = ''
    dataSuccess.textContent = ''

    const name = document.getElementById('profile-name').value.trim()
    const email = document.getElementById('profile-email').value.trim()
    const password = document.getElementById('profile-password').value
    const confirm = document.getElementById('profile-confirm-password').value

    if (password && password !== confirm) {
      showToast('Passwords do not match')
      return
    }

    try {
      await apiFetch(`${API_URL}/users/${user._id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, email, password }),
        headers: {}
      })
      dataSuccess.textContent = 'Profile updated'
      showToast('Profile updated')
      dataForm.reset() // 🔄 reset del formulario de datos
      // Repoblar inputs con nuevos valores
      document.getElementById('profile-name').value = name
      document.getElementById('profile-email').value = email
    } catch (error) {
      dataError.textContent = error.message
      showToast(error.message)
    }
  }

  // Formulario de imagen de perfil
  const imgForm = document.getElementById('profile-image-form')
  const imgError = document.getElementById('profile-error')
  const imgSuccess = document.getElementById('profile-success')

  imgForm.onsubmit = async (e) => {
    e.preventDefault()
    imgError.textContent = ''
    imgSuccess.textContent = ''

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
      imgSuccess.textContent = 'Image updated'
      showToast('Profile image updated')
      imgForm.reset() // 🔄 reset del formulario de imagen
    } catch (error) {
      imgError.textContent = error.message
      showToast(error.message)
    }
  }
}
