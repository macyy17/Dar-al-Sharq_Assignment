import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { csrf } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function refresh() {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data.data);
            return data.data;
        } catch (error) {
            if (error?.response?.status !== 401) throw error;
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { refresh(); }, []);

    async function login(credentials) {
        await csrf();
        await api.post('/auth/login', credentials);
        return refresh();
    }

    async function logout() {
        await api.post('/auth/logout');
        setUser(null);
    }

    const value = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        refresh,
        can: (privilege) => Boolean(user?.privileges?.includes(privilege)),
        hasAny: (...privileges) => privileges.some((privilege) => user?.privileges?.includes(privilege)),
    }), [user, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}

export function workspaceFor(user) {
    const privileges = user?.privileges || [];
    return privileges.some((name) => name.startsWith('users.') || name.startsWith('roles.') || name.startsWith('privileges.') || name.startsWith('menus.') || ['pages.delete', 'pages.restore', 'pages.force_delete'].includes(name)) ? '/admin' : '/moderator';
}
