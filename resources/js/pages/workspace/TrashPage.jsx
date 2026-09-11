import { useEffect, useState } from 'react';
import { ArchiveRestore, Trash2 } from 'lucide-react';
import api, { apiErrorMessage } from '../../api/client';
import PageHeader from '../../components/workspace/PageHeader';
import TableCard from '../../components/workspace/TableCard';

export default function TrashPage() {
    const [pages, setPages] = useState([]);
    const [error, setError] = useState('');

    async function load() {
        try { const { data } = await api.get('/pages/trash'); setPages(data.data); }
        catch (requestError) { setError(apiErrorMessage(requestError, 'Unable to load trash.')); }
    }
    useEffect(() => { load(); }, []);

    async function restore(id) { try { await api.post(`/pages/${id}/restore`); await load(); } catch (e) { setError(apiErrorMessage(e)); } }
    async function forceDelete(page) { if (!window.confirm(`Permanently delete “${page.title}”? This cannot be undone.`)) return; try { await api.delete(`/pages/${page.id}/force`); await load(); } catch (e) { setError(apiErrorMessage(e)); } }

    return <div className="space-y-6"><PageHeader eyebrow="Content" title="Page trash" description="Review soft-deleted pages and restore or permanently emove them." />{error ? <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}<TableCard columns={['Page', 'Deleted', 'Deleted by', 'Actions']}>{pages.length === 0 ? <tr><td colSpan="4" className="px-5 py-10 text-center text-sm text-slate-500">Trash is empty.</td></tr> : pages.map((page) => <tr key={page.id}><td className="px-5 py-4 font-semibold">{page.title}</td><td className="px-5 py-4 text-sm text-slate-500">{page.deleted_at ? new Date(page.deleted_at).toLocaleString() : '—'}</td><td className="px-5 py-4 text-sm text-slate-600">{page.deleter?.name || '—'}</td><td className="px-5 py-4"><div className="flex gap-2"><button onClick={() => restore(page.id)} className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"><ArchiveRestore className="h-4 w-4" />Restore</button><button onClick={() => forceDelete(page)} className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" />Delete permanently</button></div></td></tr>)}</TableCard></div>;
}
