import './bootstrap';
import '../css/app.css';

import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { RequireAuth, RequirePrivilege, RequireWorkspace } from './auth/RouteGuards';

const LoginPage = lazy(() => import('./pages/workspace/LoginPage'));
const WorkspaceShell = lazy(() => import('./components/workspace/WorkspaceShell'));
const DashboardPage = lazy(() => import('./pages/workspace/DashboardPage'));
const PagesPage = lazy(() => import('./pages/workspace/PagesPage'));
const PageFormPage = lazy(() => import('./pages/workspace/PageFormPage'));
const TrashPage = lazy(() => import('./pages/workspace/TrashPage'));
const MenusPage = lazy(() => import('./pages/workspace/MenusPage'));
const UsersPage = lazy(() => import('./pages/workspace/UsersPage'));
const UserFormPage = lazy(() => import('./pages/workspace/UserFormPage'));
const RolesPage = lazy(() => import('./pages/workspace/RolesPage'));
const RoleFormPage = lazy(() => import('./pages/workspace/RoleFormPage'));
const PrivilegesPage = lazy(() => import('./pages/workspace/PrivilegesPage'));
const PrivilegeFormPage = lazy(() => import('./pages/workspace/PrivilegeFormPage'));
const PublicHome = lazy(() => import('./pages/public/PublicHome'));
const PublicPage = lazy(() => import('./pages/public/PublicPage'));
const NotFoundPage = lazy(() => import('./pages/workspace/NotFoundPage'));

function LoadingScreen() {
    return <div className="grid min-h-screen place-items-center bg-[#f6f7fa] text-sm font-medium text-slate-500">Loading…</div>;
}

function AdminRoutes() {
    return <RequireWorkspace type="admin"><WorkspaceShell role="admin" /></RequireWorkspace>;
}

function ModeratorRoutes() {
    return <RequireWorkspace type="moderator"><WorkspaceShell role="moderator" /></RequireWorkspace>;
}

function App() {
    return <AuthProvider><BrowserRouter><Suspense fallback={<LoadingScreen />}><Routes>
        <Route path="/" element={<PublicHome />} />
        <Route path="/:slug" element={<PublicPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin" element={<RequireAuth><AdminRoutes /></RequireAuth>}>
            <Route index element={<DashboardPage role="admin" />} />
            <Route path="pages" element={<RequirePrivilege privilege="pages.view"><PagesPage role="admin" /></RequirePrivilege>} />
            <Route path="pages/create" element={<RequirePrivilege privilege="pages.create"><PageFormPage role="admin" /></RequirePrivilege>} />
            <Route path="pages/:id/edit" element={<RequirePrivilege privilege="pages.update"><PageFormPage role="admin" /></RequirePrivilege>} />
            <Route path="trash" element={<RequirePrivilege privilege="pages.restore"><TrashPage /></RequirePrivilege>} />
            <Route path="menus" element={<RequirePrivilege privilege="menus.view"><MenusPage /></RequirePrivilege>} />
            <Route path="users" element={<RequirePrivilege privilege="users.view"><UsersPage /></RequirePrivilege>} />
            <Route path="users/create" element={<RequirePrivilege privilege="users.create"><UserFormPage /></RequirePrivilege>} />
            <Route path="users/:id/edit" element={<RequirePrivilege privilege="users.update"><UserFormPage /></RequirePrivilege>} />
            <Route path="roles" element={<RequirePrivilege privilege="roles.view"><RolesPage /></RequirePrivilege>} />
            <Route path="roles/create" element={<RequirePrivilege privilege="roles.create"><RoleFormPage /></RequirePrivilege>} />
            <Route path="roles/:id/edit" element={<RequirePrivilege privilege="roles.update"><RoleFormPage /></RequirePrivilege>} />
            <Route path="privileges" element={<RequirePrivilege privilege="privileges.view"><PrivilegesPage /></RequirePrivilege>} />
            <Route path="privileges/create" element={<RequirePrivilege privilege="privileges.create"><PrivilegeFormPage /></RequirePrivilege>} />
            <Route path="privileges/:id/edit" element={<RequirePrivilege privilege="privileges.update"><PrivilegeFormPage /></RequirePrivilege>} />
        </Route>

        <Route path="/moderator" element={<RequireAuth><ModeratorRoutes /></RequireAuth>}>
            <Route index element={<DashboardPage role="moderator" />} />
            <Route path="pages" element={<PagesPage role="moderator" />} />
            <Route path="pages/create" element={<PageFormPage role="moderator" />} />
            <Route path="pages/:id/edit" element={<PageFormPage role="moderator" />} />
            <Route path="*" element={<Navigate to="/moderator" replace />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
    </Routes></Suspense></BrowserRouter></AuthProvider>;
}

createRoot(document.getElementById('app')).render(<React.StrictMode><App /></React.StrictMode>);
