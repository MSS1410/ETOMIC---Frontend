// js/components/views/uploadMediaView.js
import { apiFetch, API_URL } from '../../../api.js'
import { showToast } from '../../../toast.js'

/**
 * Renderiza la estructura base de la vista de subida de media.
 */
export function renderUploadMediaView() {
  return `
    <section id="upload-media-view" class="view hidden">
      <button class="back-btn" id="upload-media-back">Back</button>
      <h2>Upload Media</h2>
      <div class="form-container">
        <select id="upload-event-select">
          <option value="">Select an event</option>
        </select>
        <input type="file" id="upload-file" />
        <textarea id="upload-description" placeholder="Description"></textarea>
        <button id="upload-submit-btn">Upload</button>
        <p id="upload-error" class="error"></p>
        <p id="upload-success" class="success"></p>
      </div>
    </section>
  `
}

/**
 * Inicializa la vista Upload Media:
 * - Muestra la vista existente
 * - Carga eventos en el select
 * - Gestiona el formulario de subida
 * - Configura botón Back
 */
export async function initUploadMediaView() {
  // Botón Back: mostrar vista principal
  document.getElementById('upload-media-back').addEventListener('click', () => {
    // asume que showView se llama externamente cuando corresponde
    showView('main-menu-view')
  })

  // Cargar eventos asistidos
  try {
    const events = await apiFetch(`${API_URL}/events/attended`)
    const sel = document.getElementById('upload-event-select')
    sel.innerHTML = '<option value="">Select an event</option>'
    events.forEach((ev) => {
      const opt = document.createElement('option')
      opt.value = ev._id
      opt.textContent = ev.title
      sel.appendChild(opt)
    })
  } catch (err) {
    console.error('Error loading events:', err)
    showToast('Error loading events')
  }

  // Configurar envío
  const submitBtn = document.getElementById('upload-submit-btn')
  submitBtn.addEventListener('click', async () => {
    const errEl = document.getElementById('upload-error')
    const okEl = document.getElementById('upload-success')
    errEl.textContent = ''
    okEl.textContent = ''

    const eventId = document.getElementById('upload-event-select').value
    const file = document.getElementById('upload-file').files[0]
    const desc = document.getElementById('upload-description').value
    if (!eventId || !file) return showToast('Please select event and file')

    const formData = new FormData()
    formData.append('event', eventId)
    formData.append('image', file)
    formData.append('description', desc)

    try {
      await apiFetch(`${API_URL}/event-media`, {
        method: 'POST',
        body: formData,
        headers: {}
      })
      okEl.textContent = 'Upload successful'
      showToast('Media uploaded')
    } catch (error) {
      errEl.textContent = error.message
    }
  })
}
