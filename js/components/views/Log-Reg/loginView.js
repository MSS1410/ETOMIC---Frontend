import { apiFetch, API_URL, setAuthToken } from '../../../api.js'
import { showView } from '../../../navigation.js'
import { innitAppHeader, renderAppHeader } from '../../layout/header.js'
import { initProfileView } from '../profile/profileView.js'
/**
 * Renderiza la vista de login.
 */

export function renderLoginView() {
  return `
    <section id="login-view" class="view login-page">
      <div class="login-container-mix">
        <div class="login-left">
          <h2>Access to your account</h2>
          <form id="login-form">
            <label for="login-email">Email</label>
            <input type="email" id="login-email" name="email" placeholder="Email" required />
            <label for="login-password">Password</label>
            <div class="password-field">
              <input type="password" id="login-password" name="password" placeholder="Password" required />
              <button type="button" id="toggle-password" class="toggle-pwd-btn">Show</button>
            </div>
            <p id="login-error" class="error"></p>
            <button type="submit" class="login-submit-btn">Log In</button>
            <a href="#" id="forgot-link" class="forgot-link">Forgot your password?</a>
          </form>
        </div>
        <div class="login-right">
          <h2>New at Etomic?</h2>
          <button id="show-register" class="register-btn">Sign Up</button>
        </div>
      </div>
    </section>
  `
}

/**
 * Inicializa los listeners de login.
 */
export function initLoginView() {
  const form = document.getElementById('login-form')
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value

    try {
      const { token } = await apiFetch(`${API_URL}/users/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      setAuthToken(token)

      //montar header en dom
      document.getElementById('header-container').innerHTML = renderAppHeader()
      //pongo los enlaces en activo
      innitAppHeader()
      initProfileView()

      // Ir a vista principal
      showView('main-menu-view', true)
    } catch (error) {
      document.getElementById('login-error').textContent = error.message
    }
  })

  // Toggle mostrar/ocultar password
  const togglePwd = document.getElementById('toggle-password')
  togglePwd?.addEventListener('click', () => {
    const pw = document.getElementById('login-password')
    if (pw.type === 'password') {
      pw.type = 'text'
      togglePwd.textContent = 'Hide'
    } else {
      pw.type = 'password'
      togglePwd.textContent = 'Show'
    }
  })

  // Ir a registro
  document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault()
    showView('register-view', true)
  })
}
