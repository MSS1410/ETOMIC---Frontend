// js/api.js

export const API_URL = 'http://localhost:3050/api/v1'
let authToken = localStorage.getItem('authToken')

/**
 * Fetch wrapper que añade headers y parsea JSON.
 */
export async function apiFetch(pathOrUrl, options = {}) {
  const url = pathOrUrl.startsWith('http')
    ? pathOrUrl
    : `${API_URL}${pathOrUrl}`
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  const opts = { ...options, headers }
  const response = await fetch(url, opts)
  const data =
    opts.body instanceof FormData
      ? await response.json()
      : await response.json()
  if (!response.ok) throw new Error(data.message || 'Error en petición')
  return data
}

/**
 * Actualiza token tras login.
 */
export function setAuthToken(token) {
  authToken = token
  localStorage.setItem('authToken', token)
}
