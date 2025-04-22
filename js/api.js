// js/api.js

export const API_URL = 'http://localhost:3051/api/v1'

let authToken = localStorage.getItem('authToken')

/**
 * apiFetch: Envolver fetch para llamar a la API con JSON y Bearer token
 @param {string} url      URL completa (API_URL + endpoint)
@param {object} options  { method, body, headers, ... }
 */

export async function apiFetch(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (authToken) {
    headers['Authorization'] = ` Bearer ${authToken}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    })
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

// para actualizar el token despues del login
/**
 * Función auxiliar para actualizar el token después del login
 * @param {string} token
 */
export function setAuthToken(token) {
  authToken = token
  localStorage.setItem('authToken', token)
}
