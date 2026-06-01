const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/* Generic fetch wrapper */
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('mc_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'API Error')
  return data
}

/* ── Medicines ── */
export const medicineApi = {
  /** GET /medicines?page&limit&category&search&sort&minPrice&maxPrice */
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return apiFetch(`/medicines${qs ? `?${qs}` : ''}`)
  },

  /** GET /medicines/featured  →  { success, data: [] } */
  getFeatured: () => apiFetch('/medicines/featured'),

  /** GET /medicines/categories  →  { success, data: [{ _id, count }] } */
  getCategories: () => apiFetch('/medicines/categories'),

  /** GET /medicines/:slug */
  getBySlug: (slug) => apiFetch(`/medicines/${slug}`),

  /** GET /medicines/:id/related */
  getRelated: (id) => apiFetch(`/medicines/${id}/related`),

  /** POST /medicines/:id/review  (auth required) */
  addReview: (id, { rating, comment }) =>
    apiFetch(`/medicines/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    }),

  /* ── Admin ── */
  /** POST /medicines  (admin, multipart) */
  create: (formData) => {
    const token = localStorage.getItem('mc_token')
    return fetch(`${BASE}/medicines`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then(r => r.json())
  },

  /** PUT /medicines/:id  (admin) */
  update: (id, body) =>
    apiFetch(`/medicines/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  /** DELETE /medicines/:id  (admin) */
  remove: (id) => apiFetch(`/medicines/${id}`, { method: 'DELETE' }),

  /** GET /medicines/admin/near-expiry?days=90  (admin) */
  getNearExpiry: (days = 90) =>
    apiFetch(`/medicines/admin/near-expiry?days=${days}`),
}

export default medicineApi