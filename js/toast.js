export function showToast(message, type = 'info') {
  // 1) Obtén o crea el contenedor único
  let container = document.getElementById('toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'toast-container'
    container.style.position = 'fixed'
    container.style.top = '1rem'
    container.style.right = '1rem'
    container.style.zIndex = '9999'
    document.body.appendChild(container)
  }

  // 2) Borra cualquier toast previo para evitar duplicados
  container.innerHTML = ''

  // 3) Crea el nuevo toast
  const toast = document.createElement('div')
  toast.className = `toast toast--${type}` // .toast y .toast--info/.toast--error en tu CSS
  toast.innerText = message
  container.appendChild(toast)

  // 4) Elimina el toast tras 3 s
  setTimeout(() => {
    toast.remove()
  }, 3000)
}
