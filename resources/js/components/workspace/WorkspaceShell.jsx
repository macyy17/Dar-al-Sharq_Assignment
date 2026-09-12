import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, ExternalLink, LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { navigationForPrivileges } from '../../data/workspace';
import { useAuth } from '../../auth/AuthContext';

export default function WorkspaceShell({ role }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(() => typeof window === 'undefined' ? true : window.localStorage.getItem('cms-sidebar') !== 'closed');
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const navigation = navigationForPrivileges(user?.privileges || [], `/${role}`);

    useEffect(() => setMobileOpen(false), [location.pathname]);
    useEffect(() => {
        window.localStorage.setItem('cms-sidebar', sidebarOpen ? 'open' : 'closed');
    }, [sidebarOpen]);

    async function signOut() {
        await logout();
        navigate('/login', { replace: true });
    }

    const initials = (user?.name || 'U').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
    const sidebar = <>
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
            <Link to={`/${role}`} className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[0.22em] text-teal-300">Dar Al Sharq</p><p className="mt-1 truncate text-base font-semibold text-white">CMS Workspace</p></Link>
            <button className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X className="h-5 w-5" /></button>
        </div>
        <div className="px-4 py-5"><p className="px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</p><nav className="mt-3 space-y-1">
            {navigation.map(({ label, to, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-teal-500/15 text-teal-200 ring-1 ring-inset ring-teal-400/20' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}><Icon className="h-[18px] w-[18px] shrink-0" /><span>{label}</span><ChevronRight className="ms-auto h-4 w-4 opacity-0 transition group-hover:opacity-60" /></NavLink>)}
        </nav></div>
        <div className="mt-auto border-t border-white/10 p-4"><div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-slate-400">Signed in as</p><p className="mt-1 text-sm font-semibold text-white">{user?.name}</p><span className="mt-2 inline-flex rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-300">{user?.role?.name || 'User'}</span><button onClick={signOut} className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white"><LogOut className="h-4 w-4" />Sign out</button></div></div>
    </>;

    return <div className="min-h-screen bg-[#f6f7fa] text-slate-950">
        <aside className={`fixed inset-y-0 start-0 z-40 hidden w-64 flex-col bg-[#111827] ${sidebarOpen ? 'lg:flex' : 'lg:hidden'}`}>{sidebar}</aside>
        {mobileOpen ? <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" /><aside className="relative flex h-full w-72 flex-col bg-[#111827] shadow-2xl">{sidebar}</aside></div> : null}
        <div className={`transition-[padding] duration-200 ${sidebarOpen ? 'lg:ps-64' : 'lg:ps-0'}`}>
            <div className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
                <button className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
                <button type="button" className="hidden rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 lg:inline-flex" onClick={() => setSidebarOpen((open) => !open)} aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'} title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}>{sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}</button>
                <div className="flex-1" />
                <a href="/" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Public site <ExternalLink className="h-4 w-4" /></a>
                <div className="grid h-9 w-9 place-items-center rounded-full bg-teal-700 text-xs font-bold text-white">{initials}</div>
            </div>
            <main className="mx-auto w-full max-w-[1900px] p-4 sm:p-6 lg:p-8"><Outlet /></main>
        </div>
    </div>;
}
