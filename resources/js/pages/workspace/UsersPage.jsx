import { Link } from 'react-router-dom';
import { MoreHorizontal, Plus } from 'lucide-react';
import PageHeader from '../../components/workspace/PageHeader';
import StatusBadge from '../../components/workspace/StatusBadge';
import TableCard from '../../components/workspace/TableCard';
import { users } from '../../data/workspace';

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <PageHeader eyebrow="Access control" title="Users" description="Manage CMS accounts, assigned roles and account status." actions={<Link to="/admin/users/create" className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Add user</Link>} />
            <TableCard columns={['User', 'Role', 'Status', 'Last seen', 'Actions']} footer={<span className="text-xs text-slate-500">{users.length} users</span>}>
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><p className="font-semibold text-slate-900">{user.name}</p><p className="mt-1 text-xs text-slate-400">{user.email}</p></td><td className="px-5 py-4"><StatusBadge>{user.role}</StatusBadge></td><td className="px-5 py-4"><StatusBadge>{user.status}</StatusBadge></td><td className="px-5 py-4 text-sm text-slate-500">{user.lastSeen}</td><td className="px-5 py-4"><div className="flex items-center gap-2"><Link to={`/admin/users/${user.id}/edit`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</Link><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><MoreHorizontal className="h-4 w-4" /></button></div></td></tr>
                ))}
            </TableCard>
        </div>
    );
}
