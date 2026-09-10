export default function TableCard({ columns, children, footer }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                    <thead className="bg-slate-50/80">
                        <tr>
                            {columns.map((column) => (
                                <th key={column} className="whitespace-nowrap px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">{children}</tbody>
                </table>
            </div>
            {footer ? <div className="border-t border-slate-200 bg-slate-50/50 px-5 py-3">{footer}</div> : null}
        </div>
    );
}
