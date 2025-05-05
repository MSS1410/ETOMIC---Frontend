/* js/api.js */
export const API_URL = 'http://localhost:3059/api/v1'

let authToken = localStorage.getItem('authToken')

/**
 * apiFetch: Envolver fetch para llamar a la API con JSON y Bearer token
 * @param {string} url - URL completa (API_URL + endpoint)
 * @param {object} options - { method, body, headers, ... }
 */
export async function apiFetch(endpoint, options = {}) {
  // tener la url completa
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`

  const headers = { ...options.headers }

  const isForm = options.body instanceof FormData
  // Solo añadir JSON si NO es FormData
  if (!isForm && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  try {
    const response = await fetch(url, { ...options, headers })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('Error while apiFetch:', error)
    throw error
  }
}

/**
 * Función auxiliar para actualizar el token después del login o registro
 * @param {string|null} token
 */
export function setAuthToken(token) {
  authToken = token
  if (token) {
    localStorage.setItem('authToken', token)
  } else {
    localStorage.removeItem('authToken')
  }
}
