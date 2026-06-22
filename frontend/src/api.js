const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9099'

const request = async (path, { method = 'GET', body, auth = true } = {}) => {
    const headers = {}
    if (body) {
        headers['Content-Type'] = 'application/json'
    }

    const token = localStorage.getItem('token')
    if (auth && token) {
        headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data.message || 'Request failed')
    }

    return data
}

export const api = {
    get: (path, opts) => request(path, { ...opts, method: 'GET' }),
    post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
}

export { API_URL }
