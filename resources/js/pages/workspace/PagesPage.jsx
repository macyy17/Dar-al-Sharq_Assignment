import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, MoreHorizontal, Plus, Search } from 'lucide-react';
import PageHeader from '../../components/workspace/PageHeader';
import StatusBadge from '../../components/workspace/StatusBadge';
import TableCard from '../../components/workspace/TableCard';
import { pages } from '../../data/workspace';

export default function PagesPage({ role }) {
    const base = `/${role}`;
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('All');
    const filtered = useMemo(() => pages.filter((page) => (status === 'All' || page.status === status) && page.title.toLowerCase().includes(query.toLowerCase())), [query, status]);

    return (
        <div className="space-y-6">
            <PageHeader eyebrow="Content" title="Pages" description="Create, review and manage public website pages and their publishing status." actions={<Link to={`${base}/pages/create`} className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"><Plus className="h-4 w-4" />Create page</Link>} />

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
                <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="Search page titles" />
                </label>
                <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600">
                    <Filter className="h-4 w-4" />
                    <select value={status} onChange={(event) => setStatus(event.target.value)} className="bg-transparent font-medium outline-none">
                        <option>All</option><option>Published</option><option>Draft</option><option>Scheduled</option>
                    </select>
                </label>
            </div>

            <TableCard columns={['Page', 'Menu', 'Status', 'Publish date', 'Updated', 'Actions']} footer={<div className="flex items-center justify-between text-xs text-slate-500"><span>Showing {filtered.length} of {pages.length} pages</span><span>Page 1 of 1</span></div>}>
                {filtered.map((page) => (
                    <tr key={page.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-4"><div><Link to={`${base}/pages/${page.id}/edit`} className="font-semibold text-slate-900 hover:text-teal-700">{page.title}</Link><p className="mt-1 text-xs text-slate-400">/pages/{page.title.toLowerCase().replaceAll(' ', '-').replaceAll('&', 'and')}</p></div></td>
                        <td className="px-5 py-4 text-sm text-slate-600">{page.menu}</td>
                        <td className="px-5 py-4"><StatusBadge>{page.status}</StatusBadge></td>
                        <td className="px-5 py-4 text-sm text-slate-500">{page.publishAt ?? 'Immediately'}</td>
                        <td className="px-5 py-4"><p className="text-sm text-slate-600">{page.updated}</p><p className="mt-1 text-xs text-slate-400">by {page.author}</p></td>
                        <td className="px-5 py-4"><div className="flex items-center gap-2"><Link to={`${base}/pages/${page.id}/edit`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</Link>{role === 'admin' ? <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="More page actions"><MoreHorizontal className="h-4 w-4" /></button> : null}</div></td>
                    </tr>
                ))}
            </TableCard>
        </div>
    );
}
