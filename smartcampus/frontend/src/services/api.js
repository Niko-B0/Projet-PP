const API_BASE = '/api'

function parseJson(response) {
  return response.json().then((data) => {
    if (!response.ok || data.success === false) {
      const message = data.message || 'Erreur du serveur'
      throw new Error(message)
    }
    return data.data
  })
}

const api = {
  request(path, method = 'GET', body) {
    const options = {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    if (body) options.body = JSON.stringify(body)
    return fetch(`${API_BASE}${path}`, options).then(parseJson)
  },
  get(path) {
    return this.request(path, 'GET')
  },
  post(path, body) {
    return this.request(path, 'POST', body)
  },
  put(path, body) {
    return this.request(path, 'PUT', body)
  },
  delete(path) {
    return this.request(path, 'DELETE')
  }
}

export default api
