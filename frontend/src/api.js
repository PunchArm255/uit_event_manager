/**
 * UIT Event Manager API Client
 * Connects to Spring Boot 3 REST controller endpoints at /api
 */

const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = '';
    let status = response.status;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || '';
    } catch {
      // Body may not be JSON
    }

    // Friendly French fallback messages according to HTTP status code
    if (!errorMessage || errorMessage.toLowerCase() === 'bad request') {
      if (status === 400 || status === 409) {
        errorMessage = 'Cet email est déjà associé à un compte ou les données saisies sont invalides.';
      } else if (status === 401 || status === 403) {
        errorMessage = 'Identifiants incorrects ou accès non autorisé.';
      } else if (status === 404) {
        errorMessage = 'Ressource introuvable.';
      } else {
        errorMessage = `Une erreur est survenue (Code ${status}). Veuillez réessayer.`;
      }
    }

    const error = new Error(errorMessage);
    error.status = status;
    throw error;
  }

  // Handle empty responses (like DELETE)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return null;
}

export const api = {
  auth: {
    login: (email, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    signup: (userData) =>
      request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
  },

  events: {
    getAll: () => request('/events'),
    create: (eventData) =>
      request('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      }),
    delete: (id) =>
      request(`/events/${id}`, {
        method: 'DELETE',
      }),
  },

  registrations: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams();
      if (params.eventId) searchParams.append('eventId', params.eventId);
      if (params.email) searchParams.append('email', params.email);
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return request(`/registrations${query}`);
    },
    register: (eventId, regData) =>
      request(`/events/${eventId}/register`, {
        method: 'POST',
        body: JSON.stringify(regData),
      }),
    verify: (badgeCode) =>
      request(`/badges/verify/${encodeURIComponent(badgeCode.trim())}`, {
        method: 'POST',
      }),
    invalidateByCode: (badgeCode) =>
      request(`/badges/invalidate/${encodeURIComponent(badgeCode.trim())}`, {
        method: 'POST',
      }),
    checkin: (id) =>
      request(`/registrations/${id}/checkin`, {
        method: 'POST',
      }),
    invalidate: (id) =>
      request(`/registrations/${id}/invalidate`, {
        method: 'POST',
      }),
  },
};
