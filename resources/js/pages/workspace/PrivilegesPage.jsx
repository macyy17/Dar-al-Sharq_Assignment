import { Link } from 'react-router-dom';
import { KeyRound, Plus } from 'lucide-react';
import PageHeader from '../../components/workspace/PageHeader';
import TableCard from '../../components/workspace/TableCard';
import { privileges } from '../../data/workspace';

export default function PrivilegesPage() {
    return <div className="space-y-6"><PageHeader eyebrow="Access control" title="Privileges" description="Maintain the granular capabilities used by the authorization layer." actions={<Link to="/admin/privileges/create" className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Add privilege</Link>} /><TableCard columns={['Privilege', 'Group', 'Description', 'Actions']}>{privileges.map((item)=><tr key={item.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-700"><KeyRound className="h-4 w-4" /></div><code className="text-xs font-semibold text-slate-800">{item.name}</code></div></td><td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{item.group}</span></td><td className="max-w-xl px-5 py-4 text-sm text-slate-600">{item.description}</td><td className="px-5 py-4"><Link to={`/admin/privileges/${item.id}/edit`} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</Link></td></tr>)}</TableCard></div>;
}
