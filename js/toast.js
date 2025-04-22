// floating messages para mejorar disposicion con usuario
export function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container')
  const toast = document.createElement('div')
  toast.className = 'toast'
  toast.textContent = message
  container.appendChild(toast)
  setTimeout(() => {
    toast.classList.add('fade-out')
    setTimeout(() => {
      container.removeChild(toast)
    }, 500)
  }, duration)
}

showToast()
