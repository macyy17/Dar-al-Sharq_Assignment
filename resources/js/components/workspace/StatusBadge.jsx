const tones = {
    Published: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    Active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    Draft: 'bg-slate-100 text-slate-700 ring-slate-600/15',
    Scheduled: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
    Suspended: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    Admin: 'bg-violet-50 text-violet-700 ring-violet-600/20',
    Moderator: 'bg-sky-50 text-sky-700 ring-sky-600/20',
};

export default function StatusBadge({ children }) {
    const tone = tones[children] ?? 'bg-slate-100 text-slate-700 ring-slate-600/15';

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tone}`}>
            {children}
        </span>
    );
}
