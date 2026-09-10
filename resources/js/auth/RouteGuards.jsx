import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, workspaceFor } from './AuthContext';

function Loading() {
    return <div className="grid min-h-screen place-items-center bg-[#f6f7fa] text-sm font-medium text-slate-500">Loading…</div>;
}

export function RequireAuth({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading) return <Loading />;
    if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    return children ?? <Outlet />;
}

export function RequireWorkspace({ type, children }) {
    const { user, loading, hasAny } = useAuth();
    if (loading) return <Loading />;
    if (!user) return <Navigate to="/login" replace />;
    const isAdmin = hasAny('users.view', 'roles.view', 'privileges.view', 'menus.view', 'pages.delete', 'pages.restore');
    if (type === 'admin' && !isAdmin) return <Navigate to={workspaceFor(user)} replace />;
    if (type === 'moderator' && isAdmin) return <Navigate to={workspaceFor(user)} replace />;
    return children;
}

export function RequirePrivilege({ privilege, children }) {
    const { can, user, loading } = useAuth();
    if (loading) return <Loading />;
    if (!user) return <Navigate to="/login" replace />;
    if (!can(privilege)) return <Navigate to={workspaceFor(user)} replace />;
    return children;
}
