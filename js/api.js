export async function fetchUsers() {
  try {
    const response = await fetch('http://localhost:3000/api/users')
    if (!response.ok) throw new Error(`Error:${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Error al obtener usuarios', error)
    return []
  }
}
