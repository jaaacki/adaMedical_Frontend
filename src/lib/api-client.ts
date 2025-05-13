import axios from 'axios'

const API_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (r) => r,
  async (error) => {
    const { response, config } = error
    if (response?.status === 401 && !config._retry) {
      config._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${API_URL}/users/refresh`,
            { refresh_token: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          )
          if (data.access_token) {
            localStorage.setItem('accessToken', data.access_token)
            config.headers.Authorization = `Bearer ${data.access_token}`
            return apiClient(config)
          }
        } catch {}
      }
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = `/auth/login?redirect=${encodeURIComponent(
        window.location.pathname
      )}`
    }
    return Promise.reject(error)
  }
)

export default apiClient
