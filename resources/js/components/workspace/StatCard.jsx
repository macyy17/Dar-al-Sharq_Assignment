export default function StatCard({ label, value, detail, icon: Icon }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
                    {detail ? <p className="mt-2 text-xs text-slate-500">{detail}</p> : null}
                </div>
                {Icon ? (
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
                        <Icon className="h-5 w-5" />
                    </div>
                ) : null}
            </div>
        </div>
    );
}
