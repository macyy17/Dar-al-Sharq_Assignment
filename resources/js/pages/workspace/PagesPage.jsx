import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Plus, Search, Trash2 } from 'lucide-react';
import api, { apiErrorMessage } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import PageHeader from '../../components/workspace/PageHeader';
import StatusBadge from '../../components/workspace/StatusBadge';
import TableCard from '../../components/workspace/TableCard';

export default function PagesPage({ role }) {
    const base = `/${role}`;
    const { can } = useAuth();
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('all');
    const [result, setResult] = useState({ data: [], meta: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function load(page = 1) {
        setLoading(true); setError('');
        try {
            const params = { page };
            if (query.trim()) params.search = query.trim();
            if (status !== 'all') params.status = status;
            const { data } = await api.get('/pages', { params });
            setResult(data);
        } catch (requestError) {
            setError(apiErrorMessage(requestError, 'Unable to load pages.'));
        } finally { setLoading(false); }
    }

    useEffect(() => { const timer = setTimeout(() => load(1), 250); return () => clearTimeout(timer); }, [query, status]);

    async function remove(page) {
        if (!window.confirm(`Move “${page.title}” to trash?`)) return;
        try { await api.delete(`/pages/${page.id}`); await load(result.meta?.current_page || 1); }
        catch (requestError) { setError(apiErrorMessage(requestError, 'Unable to delete page.')); }
    }

    return <div className="space-y-6">
        <PageHeader eyebrow="Content" title="Pages" description="Create, review and manage public website pages and publishing state." actions={can('pages.create') ? <Link to={`${base}/pages/create`} className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Create page</Link> : null} />
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center"><label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"><Search className="h-4 w-4 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search page titles" /></label><label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600"><Filter className="h-4 w-4" /><select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-transparent font-medium outline-none"><option value="all">All</option><option value="published">Published</option><option value="draft">Draft</option><option value="scheduled">Scheduled</option></select></label></div>
        {error ? <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}
        <TableCard columns={['Page', 'Status', 'Publish date', 'Updated', 'Actions']} footer={<div className="flex items-center justify-between text-xs text-slate-500"><span>{loading ? 'Loading…' : `${result.meta?.total ?? result.data.length} pages`}</span><div className="flex gap-2">{result.meta?.current_page > 1 ? <button onClick={() => load(result.meta.current_page - 1)} className="font-semibold text-teal-700">Previous</button> : null}{result.meta?.current_page < result.meta?.last_page ? <button onClick={() => load(result.meta.current_page + 1)} className="font-semibold text-teal-700">Next</button> : null}</div></div>}>
            {!loading && result.data.length === 0 ? <tr><td colSpan="5" className="px-5 py-10 text-center text-sm text-slate-500">No pages found.</td></tr> : null}
            {result.data.map((page) => <tr key={page.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><Link to={`${base}/pages/${page.id}/edit`} className="font-semibold text-slate-900 hover:text-teal-700">{page.title}</Link><p className="mt-1 text-xs text-slate-400">{page.is_home ? '/' : `/${page.slug}`}{page.is_home ? ' · Home' : ''}</p></td><td className="px-5 py-4"><StatusBadge>{page.publishing_state}</StatusBadge></td><td className="px-5 py-4 text-sm text-slate-500">{page.publish_at ? new Date(page.publish_at).toLocaleString() : 'Immediately'}</td><td className="px-5 py-4 text-sm text-slate-500">{page.updated_at ? new Date(page.updated_at).toLocaleString() : '—'}<p className="mt-1 text-xs text-slate-400">by {page.updater?.name || page.creator?.name || '—'}</p></td><td className="px-5 py-4"><div className="flex items-center gap-2">{can('pages.update') ? <Link to={`${base}/pages/${page.id}/edit`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</Link> : null}{can('pages.delete') ? <button onClick={() => remove(page)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label={`Delete ${page.title}`}><Trash2 className="h-4 w-4" /></button> : null}</div></td></tr>)}
        </TableCard>
    </div>;
}
