import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Plus, Trash2 } from 'lucide-react';
import api, { apiErrorMessage } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import PageHeader from '../../components/workspace/PageHeader';
import TableCard from '../../components/workspace/TableCard';

export default function PrivilegesPage() {
    const { can } = useAuth(); const [items, setItems] = useState([]); const [error, setError] = useState('');
    async function load() { try { const { data } = await api.get('/privileges'); setItems(data.data); } catch (e) { setError(apiErrorMessage(e)); } }
    useEffect(() => { load(); }, []);
    async function remove(item) { if (!window.confirm(`Delete privilege “${item.name}”?`)) return; try { await api.delete(`/privileges/${item.id}`); await load(); } catch (e) { setError(apiErrorMessage(e)); } }
    return <div className="space-y-6"><PageHeader eyebrow="Access control" title="Privileges" description="Maintain granular capabilities used by the authorization layer." actions={can('privileges.create') ? <Link to="/admin/privileges/create" className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Add privilege</Link> : null} />{error ? <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}<TableCard columns={['Privilege', 'Group', 'Description', 'Actions']}>{items.map((item) => <tr key={item.id}><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-700"><KeyRound className="h-4 w-4" /></div><code className="text-xs font-semibold">{item.name}</code></div></td><td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">{item.group}</span></td><td className="px-5 py-4 text-sm text-slate-600">{item.description}</td><td className="px-5 py-4"><div className="flex gap-2">{can('privileges.update') ? <Link to={`/admin/privileges/${item.id}/edit`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold">Edit</Link> : null}{can('privileges.delete') ? <button onClick={() => remove(item)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button> : null}</div></td></tr>)}</TableCard></div>;
}
