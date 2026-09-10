import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    withXSRFToken: true,
    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
});

export function apiErrorMessage(error, fallback = 'Something went wrong.') {
    return error?.response?.data?.message || Object.values(error?.response?.data?.errors || {})?.flat()?.[0] || fallback;
}

export async function csrf() {
    await axios.get('/sanctum/csrf-cookie', { withCredentials: true, withXSRFToken: true });
}

export default api;
