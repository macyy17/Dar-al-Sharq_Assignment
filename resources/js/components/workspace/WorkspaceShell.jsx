import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Bell, ChevronRight, ExternalLink, Menu, Search, X } from 'lucide-react';
import { navigationForRole } from '../../data/workspace';

function roleLabel(role) {
    return role === 'admin' ? 'Administrator' : 'Moderator';
}

export default function WorkspaceShell({ role }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigation = navigationForRole(role);

    useEffect(() => setMobileOpen(false), [location.pathname]);

    const sidebar = (
        <>
            <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
                <Link to={`/${role}`} className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-teal-300">Dar Al Sharq</p>
                    <p className="mt-1 truncate text-base font-semibold text-white">CMS Workspace</p>
                </Link>
                <button className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
                    <X className="h-5 w-5" />
                </button>
            </div>
            <div className="px-4 py-5">
                <p className="px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</p>
                <nav className="mt-3 space-y-1">
                    {navigation.map(({ label, to, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-teal-500/15 text-teal-200 ring-1 ring-inset ring-teal-400/20' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                        >
                            <Icon className="h-[18px] w-[18px] shrink-0" />
                            <span>{label}</span>
                            <ChevronRight className="ms-auto h-4 w-4 opacity-0 transition group-hover:opacity-60" />
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className="mt-auto border-t border-white/10 p-4">
                <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="mt-1 text-sm font-semibold text-white">{role === 'admin' ? 'Fatima Al-Kuwari' : 'Omar Hassan'}</p>
                    <span className="mt-2 inline-flex rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-300">{roleLabel(role)}</span>
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-[#f6f7fa] text-slate-950">
            <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 flex-col bg-[#111827] lg:flex">{sidebar}</aside>
            {mobileOpen ? (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />
                    <aside className="relative flex h-full w-72 flex-col bg-[#111827] shadow-2xl">{sidebar}</aside>
                </div>
            ) : null}

            <div className="lg:ps-64">
                <div className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
                    <button className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="hidden min-w-0 flex-1 items-center sm:flex">
                        <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400">
                            <Search className="h-4 w-4" />
                            <span>Search pages and records</span>
                            <span className="ms-auto rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">⌘ K</span>
                        </div>
                    </div>
                    <a href="/" className="ms-auto inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 sm:ms-0">
                        Public site <ExternalLink className="h-4 w-4" />
                    </a>
                    <button className="relative rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" aria-label="Notifications">
                        <Bell className="h-4 w-4" />
                        <span className="absolute end-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                    </button>
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-teal-700 text-xs font-bold text-white">{role === 'admin' ? 'FA' : 'OH'}</div>
                </div>

                <main className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
