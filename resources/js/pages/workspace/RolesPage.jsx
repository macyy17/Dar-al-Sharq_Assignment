import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShieldCheck, Trash2 } from 'lucide-react';
import api, { apiErrorMessage } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import PageHeader from '../../components/workspace/PageHeader';
import TableCard from '../../components/workspace/TableCard';

export default function RolesPage() {
    const { can } = useAuth();
    const [roles, setRoles] = useState([]); const [error, setError] = useState('');
    async function load() { try { const { data } = await api.get('/roles'); setRoles(data.data); } catch (e) { setError(apiErrorMessage(e)); } }
    useEffect(() => { load(); }, []);
    async function remove(role) { if (!window.confirm(`Delete role “${role.name}”?`)) return; try { await api.delete(`/roles/${role.id}`); await load(); } catch (e) { setError(apiErrorMessage(e, 'Unable to delete role.')); } }
    return <div className="space-y-6"><PageHeader eyebrow="Access control" title="Roles" description="Group data-driven privileges into reusable access profiles." actions={can('roles.create') ? <Link to="/admin/roles/create" className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Add role</Link> : null} />{error ? <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}<TableCard columns={['Role', 'Description', 'Users', 'Privileges', 'Actions']}>{roles.map((role) => <tr key={role.id}><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-violet-50 text-violet-700"><ShieldCheck className="h-4 w-4" /></div><span className="font-semibold">{role.name}</span></div></td><td className="px-5 py-4 text-sm text-slate-600">{role.description}</td><td className="px-5 py-4 text-sm">{role.users_count ?? 0}</td><td className="px-5 py-4 text-sm">{role.privileges_count ?? role.privileges?.length ?? 0}</td><td className="px-5 py-4"><div className="flex gap-2">{can('roles.update') ? <Link to={`/admin/roles/${role.id}/edit`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold">Edit role</Link> : null}{can('roles.delete') ? <button onClick={() => remove(role)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button> : null}</div></td></tr>)}</TableCard></div>;
}
