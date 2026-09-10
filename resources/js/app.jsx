import './bootstrap';
import '../css/app.css';

import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const WorkspaceShell = lazy(() => import('./components/workspace/WorkspaceShell'));
const WorkspaceHome = lazy(() => import('./pages/workspace/WorkspaceHome'));
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
const NotFoundPage = lazy(() => import('./pages/workspace/NotFoundPage'));

function LoadingScreen() {
    return <div className="grid min-h-screen place-items-center bg-[#f6f7fa] text-sm font-medium text-slate-500">Loading workspace…</div>;
}

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingScreen />}>
                <Routes>
                    <Route path="/" element={<WorkspaceHome />} />

                    <Route path="/admin" element={<WorkspaceShell role="admin" />}>
                        <Route index element={<DashboardPage role="admin" />} />
                        <Route path="pages" element={<PagesPage role="admin" />} />
                        <Route path="pages/create" element={<PageFormPage role="admin" />} />
                        <Route path="pages/:id/edit" element={<PageFormPage role="admin" />} />
                        <Route path="trash" element={<TrashPage />} />
                        <Route path="menus" element={<MenusPage />} />
                        <Route path="users" element={<UsersPage />} />
                        <Route path="users/create" element={<UserFormPage />} />
                        <Route path="users/:id/edit" element={<UserFormPage />} />
                        <Route path="roles" element={<RolesPage />} />
                        <Route path="roles/create" element={<RoleFormPage />} />
                        <Route path="roles/:id/edit" element={<RoleFormPage />} />
                        <Route path="privileges" element={<PrivilegesPage />} />
                        <Route path="privileges/create" element={<PrivilegeFormPage />} />
                        <Route path="privileges/:id/edit" element={<PrivilegeFormPage />} />
                    </Route>

                    <Route path="/moderator" element={<WorkspaceShell role="moderator" />}>
                        <Route index element={<DashboardPage role="moderator" />} />
                        <Route path="pages" element={<PagesPage role="moderator" />} />
                        <Route path="pages/create" element={<PageFormPage role="moderator" />} />
                        <Route path="pages/:id/edit" element={<PageFormPage role="moderator" />} />
                        <Route path="*" element={<Navigate to="/moderator" replace />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
