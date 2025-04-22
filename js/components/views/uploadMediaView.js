// components/views/uploadMediaView.js
import { apiFetch, API_URL } from '../../api.js'
import { showToast } from '../../toast.js'
import { showView } from '../../navigation.js'

// Render function for Upload Media View

export function renderUploadMediaView() {
  return `
    <section id="upload-media-view" class="view hidden">
      <span id="upload-home-button" class="home-button">MyEtomic</span>
      <h2>Upload Event Media</h2>
      <form id="upload-form">
        <select id="upload-event-select" required>
          <option value="">Select an attended event</option>
        </select>
        <input type="file" id="upload-file" accept="image/*" required />
        <input
          type="text"
          id="upload-description"
          placeholder="Image description"
        />
        <button type="submit">Click to Upload</button>
      </form>
      <div id="upload-error" class="error"></div>
      <div id="upload-success" class="success"></div>
    </section>
  `
}

// Initialization for Upload Media View
export function initUploadMediaView() {
  loadSelect() // Populate events dropdown on view show

  // Handle form submission
  document
    .getElementById('upload-form')
    .addEventListener('submit', async (e) => {
      e.preventDefault()
      const errorEl = document.getElementById('upload-error')
      const successEl = document.getElementById('upload-success')
      errorEl.textContent = ''
      successEl.textContent = ''

      const eventId = document.getElementById('upload-event-select').value
      const fileInput = document.getElementById('upload-file')
      const description = document.getElementById('upload-description').value

      const formData = new FormData()
      formData.append('event', eventId)
      formData.append('image', fileInput.files[0])
      formData.append('description', description)

      try {
        await apiFetch(`${API_URL}/event-media`, {
          method: 'POST',
          body: formData,
          headers: {} // Let fetch set multipart/form-data boundary
        })
        successEl.textContent = 'Media uploaded successfully!'
        showToast('Media uploaded successfully!')
      } catch (err) {
        errorEl.textContent = err.message
      }
    })

  // Home button navigates back to main menu
  document
    .getElementById('upload-home-button')
    .addEventListener('click', () => {
      showView('main-menu-view', true)
    })
}

// Helper to load attended events into the select
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
