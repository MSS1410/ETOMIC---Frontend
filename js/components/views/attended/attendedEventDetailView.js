// js/components/views/attendedEventDetailView.js
import { apiFetch, API_URL } from '../../../api.js'
import { showView } from '../../../navigation.js'

/**
 * Renderiza la vista detalle de un evento asistido.
 */
export function renderAttendedEventDetailView() {
  return `
    <section id="attended-event-detail-view" class="view hidden">
      <button class="back-btn" id="attended-back">Attended List</button>
      <div id="attended-event-info-container"></div>
    </section>
  `
}

/**
 * Inicializa los listeners para la vista detalle.
 */
export function initAttendedEventDetailView() {
  document.getElementById('attended-back')?.addEventListener('click', (e) => {
    e.preventDefault()
    showView('attended-events-view', true)
  })
}

/**
 * Carga y muestra los datos del evento seleccionado.
 * @param {string} eventId
 */
export async function loadAttendedEventDetail(eventId) {
  // 1) Mostrar la vista detalle
  showView('attended-event-detail-view', true)

  // 2) Fetch de datos
  const container = document.getElementById('attended-event-info-container')
  try {
    const ev = await apiFetch(`${API_URL}/events/${eventId}`)
    container.innerHTML = `
      <div class="detail-card">
        <h2>${ev.title}</h2>
        <p><strong>Fecha:</strong> ${new Date(ev.date).toLocaleDateString()}</p>
        <h3>${ev.description}</h3>
        <img src="${ev.image}" alt="${ev.title}" />
      </div>
    `
  } catch (err) {
    console.error('Error cargando detalle de evento:', err)
    container.innerHTML = `<p class="error">No se pudo cargar el detalle del evento.</p>`
  }
}
