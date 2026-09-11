import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import api, { apiErrorMessage } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import PageHeader from '../../components/workspace/PageHeader';
import StatusBadge from '../../components/workspace/StatusBadge';
import TableCard from '../../components/workspace/TableCard';

export default function UsersPage() {
    const { can, user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    async function load() {
        try { const { data } = await api.get('/users'); setUsers(data.data); }
        catch (e) { setError(apiErrorMessage(e, 'Unable to load users.')); }
    }
    useEffect(() => { load(); }, []);

    async function remove(user) {
        if (!window.confirm(`Delete ${user.name}?`)) return;
        try { await api.delete(`/users/${user.id}`); await load(); }
        catch (e) { setError(apiErrorMessage(e, 'Unable to delete user.')); }
    }

    return <div className="space-y-6"><PageHeader eyebrow="Access control" title="Users" description="Manage CMS accounts, assigned roles and account status." actions={can('users.create') ? <Link to="/admin/users/create" className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Add user</Link> : null} />{error ? <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}<TableCard columns={['User', 'Role', 'Status', 'Last seen', 'Actions']} footer={<span className="text-xs text-slate-500">{users.length} users</span>}>{users.length === 0 ? <tr><td colSpan="5" className="px-5 py-10 text-center text-sm text-slate-500">No users found.</td></tr> : users.map((user) => <tr key={user.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><p className="font-semibold text-slate-900">{user.name}</p><p className="mt-1 text-xs text-slate-400">{user.email}</p></td><td className="px-5 py-4"><StatusBadge>{user.role?.name || 'No role'}</StatusBadge></td><td className="px-5 py-4"><StatusBadge>{user.status}</StatusBadge></td><td className="px-5 py-4 text-sm text-slate-500">{user.last_seen_at ? new Date(user.last_seen_at).toLocaleString() : 'Never'}</td><td className="px-5 py-4"><div className="flex items-center gap-2">{can('users.update') ? <Link to={`/admin/users/${user.id}/edit`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</Link> : null}{can('users.delete') && currentUser?.id !== user.id ? <button onClick={() => remove(user)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label={`Delete ${user.name}`}><Trash2 className="h-4 w-4" /></button> : null}</div></td></tr>)}</TableCard></div>;
}
