// js/navigation.js

// Historial de vistas para "back"
let viewHistory = []

/**
 * Muestra la vista indicada y oculta las demás.
 * @param {string} viewId - id de la sección .view a mostrar.
 * @param {boolean} [clearHistory=false] - si limpiar historial.
 */
export function showView(viewId, clearHistory = false) {
  if (clearHistory) viewHistory = []
  const current = document.querySelector('.view:not(.hidden)')
  if (current && current.id !== viewId) viewHistory.push(current.id)

  document.querySelectorAll('.view').forEach((v) => v.classList.add('hidden'))
  const target = document.getElementById(viewId)
  if (target) target.classList.remove('hidden')

  // Header logic
  document
    .getElementById('auth-header')
    ?.classList.toggle(
      'hidden',
      !(viewId === 'login-view' || viewId === 'register-view')
    )
  document
    .getElementById('main-header')
    ?.classList.toggle('hidden', viewId !== 'main-menu-view')
  document
    .getElementById('view-header')
    ?.classList.toggle(
      'hidden',
      ['login-view', 'register-view', 'main-menu-view'].includes(viewId)
    )
}

/**
 * Navegar a la vista anterior en historial.
 */
export function goBack() {
  const prev = viewHistory.pop() || 'main-menu-view'
  showView(prev)
}
