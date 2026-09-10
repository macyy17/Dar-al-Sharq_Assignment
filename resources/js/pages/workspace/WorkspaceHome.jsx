import { Link } from 'react-router-dom';
import { ShieldCheck, UserRoundCog } from 'lucide-react';

export default function WorkspaceHome() {
    return (
        <main className="min-h-screen bg-[#f6f7fa] px-5 py-16">
            <div className="mx-auto max-w-5xl">
                <div className="max-w-2xl">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Dar Al Sharq CMS</p>
                    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Workspace design preview</h1>
                    <p className="mt-4 text-base leading-7 text-slate-600">Choose a role to preview the complete administration experience. These screens are design-ready and intentionally use mock data until the API layer is connected.</p>
                </div>
                <div className="mt-10 grid gap-5 md:grid-cols-2">
                    <Link to="/admin" className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-teal-700"><ShieldCheck className="h-6 w-6" /></div>
                        <h2 className="mt-8 text-xl font-semibold">Administrator</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">Pages, trash restore, menus, users, roles and privileges.</p>
                        <p className="mt-6 text-sm font-semibold text-teal-700">Open admin workspace →</p>
                    </Link>
                    <Link to="/moderator" className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-700"><UserRoundCog className="h-6 w-6" /></div>
                        <h2 className="mt-8 text-xl font-semibold">Moderator</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">Focused page listing, creation and editing without destructive administration.</p>
                        <p className="mt-6 text-sm font-semibold text-sky-700">Open moderator workspace →</p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
