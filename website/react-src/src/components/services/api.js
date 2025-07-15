const authFetch = async (url, options = {}, navigate) => {
  const response = await fetch(url, options);
  if (response.status === 401) {
    localStorage.removeItem('token');
    if (navigate) {
      navigate('/login');
    } else {
      window.location.href = '/login';
    }
    return { ok: false, data: null };
  }
  const data = await response.json();
  if (response.ok && navigate) {
    navigate('/');
  }
  return { ok: response.ok, data };
};

export const api = {

  uploadFile: async (file, navigate) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return { ok: false, data: null };
    }

    const formData = new FormData();
    formData.append('file', file);

    return await authFetch('http://localhost:8000/api/upload-file', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    }, navigate);
  },

  login: async (email, password) => {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  },

  register: async (name, email, password) => {
    const response = await fetch('http://localhost:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  },

  forgotPassword: async (email) => {
    const response = await fetch('http://localhost:8000/api/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  },

  resetPassword: async (token, email, password, password_confirmation, id) => {
    const response = await fetch(`http://localhost:8000/api/reset-password/${token}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password, password_confirmation, id: Number(id) }),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  },

  validateResetToken: async (token) => {
    const response = await fetch(`http://localhost:8000/api/reset-password/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    const data = await response.json();
    return { ok: response.ok, data };
  },

  logout: async (navigate) => {
    const token = localStorage.getItem('token');
    const response = await authFetch('http://localhost:8000/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
    }, navigate);
    if (response.ok) {
      localStorage.removeItem('token');
    }
    return response;
  },
};