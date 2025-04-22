// js/components/views/uploadMediaView.js
import { apiFetch, API_URL } from '../../api.js'
import { showToast } from '../../toast.js'
import { showView } from '../../navigation.js'

/**
 * Devuelve el HTML de la vista de subida de media.
 */
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
        <button type="submit">Upload</button>
      </form>
      <p id="upload-error" class="error"></p>
      <p id="upload-success" class="success"></p>
    </section>
  `
}

/**
 * Inicializa los listeners y la carga de datos para uploadMediaView.
 */
export function initUploadMediaView() {
  // 1) Carga de eventos en el <select>
  ;(async function loadSelect() {
    try {
      const events = await apiFetch(`${API_URL}/events/attended`)
      const sel = document.getElementById('upload-event-select')
      sel.innerHTML = '<option value="">Select an attended event</option>'
      events.forEach((ev) => {
        const o = document.createElement('option')
        o.value = ev._id
        o.textContent = ev.title
        sel.appendChild(o)
      })
    } catch (err) {
      console.error('Error loading select:', err)
    }
  })()

  // 2) Envío de formulario
  document
    .getElementById('upload-form')
    ?.addEventListener('submit', async (e) => {
      e.preventDefault()
      const errEl = document.getElementById('upload-error')
      const okEl = document.getElementById('upload-success')
      errEl.textContent = ''
      okEl.textContent = ''

      const eventId = document.getElementById('upload-event-select').value
      const file = document.getElementById('upload-file').files[0]
      const desc = document.getElementById('upload-description').value

      if (!eventId || !file) {
        return showToast('Please select event and file')
      }

      const form = new FormData()
      form.append('event', eventId)
      form.append('image', file)
      form.append('description', desc)

      try {
        await apiFetch(`${API_URL}/event-media`, {
          method: 'POST',
          body: form,
          headers: {} // multipart boundary lo pone fetch
        })
        okEl.textContent = 'Upload successful!'
        showToast('Media uploaded successfully!')
      } catch (err) {
        errEl.textContent = err.message
      }
    })

  // 3) Botón “MyEtomic” para volver al home
  document
    .getElementById('upload-home-button')
    ?.addEventListener('click', () => {
      showView('main-menu-view', true)
    })
}
