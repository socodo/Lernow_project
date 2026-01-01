/**
 * Check if access token exists and is valid
 * @param {string} token - JWT token to validate
 * @returns {boolean}
 */
export const hasValidToken = (token) => {
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    console.log('Token payload:', payload)

    const now = Date.now() / 1000


    // Check if token is expired (with 5 minute buffer)
    return payload.exp > now + 300
  } catch (error) {
    return false
  }
}

/**
 * Get user from token
 * @param {string} token - JWT token to decode
 * @returns {object|null}
 */
export const getUserFromToken = (token) => {
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      userId: payload.userId,
      email: payload.email,
      fullName: payload.fullName,
      role: payload.role
    }
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

