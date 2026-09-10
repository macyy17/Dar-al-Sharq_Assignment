import { Link } from 'react-router-dom';
import { Plus, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/workspace/PageHeader';
import TableCard from '../../components/workspace/TableCard';
import { roles } from '../../data/workspace';

export default function RolesPage() {
    return <div className="space-y-6"><PageHeader eyebrow="Access control" title="Roles" description="Group data-driven privileges into reusable access profiles." actions={<Link to="/admin/roles/create" className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Add role</Link>} /><TableCard columns={['Role', 'Description', 'Users', 'Privileges', 'Actions']}>{roles.map((role)=><tr key={role.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-violet-50 text-violet-700"><ShieldCheck className="h-4 w-4" /></div><span className="font-semibold text-slate-900">{role.name}</span></div></td><td className="max-w-xl px-5 py-4 text-sm text-slate-600">{role.description}</td><td className="px-5 py-4 text-sm text-slate-600">{role.users}</td><td className="px-5 py-4 text-sm text-slate-600">{role.privileges}</td><td className="px-5 py-4"><Link to={`/admin/roles/${role.id}/edit`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">Edit role</Link></td></tr>)}</TableCard></div>;
}
