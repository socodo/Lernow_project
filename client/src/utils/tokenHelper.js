import axios from 'axios'

/**
 * Refresh access token using refresh token cookie
 * @returns {Promise<string>} New access token
 * @throws {Error} If refresh fails
 */
export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
      {},
      { withCredentials: true }
    )

    return response.data.data.accessToken
  } catch (error) {
    console.error('Failed to refresh token:', error)
    throw error
  }
}
