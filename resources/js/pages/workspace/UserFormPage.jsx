import { Link, useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import PageHeader from '../../components/workspace/PageHeader';
import FormCard from '../../components/workspace/FormCard';
import { users } from '../../data/workspace';

const inputClass = 'mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100';
export default function UserFormPage() {
    const { id } = useParams();
    const user = users.find((item) => String(item.id) === id);
    const editing = Boolean(id);
    return <div className="space-y-6"><PageHeader eyebrow="Access control" title={editing ? `Edit ${user?.name ?? 'user'}` : 'Add user'} description="Configure identity, role assignment and account status." actions={<><Link to="/admin/users" className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">Cancel</Link><button className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"><Save className="h-4 w-4" />Save user</button></>} /><FormCard title="User account" description="Account details used for authentication and authorization." aside="Role permissions are resolved from privilege data. The UI role name is not used as the authorization rule."><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Full name<input defaultValue={user?.name} className={inputClass} placeholder="Full name" /></label><label className="text-sm font-semibold text-slate-700">Email address<input type="email" defaultValue={user?.email} className={inputClass} placeholder="user@example.com" /></label><label className="text-sm font-semibold text-slate-700">Role<select defaultValue={user?.role ?? 'Moderator'} className={inputClass}><option>Admin</option><option>Moderator</option></select></label><label className="text-sm font-semibold text-slate-700">Status<select defaultValue={user?.status ?? 'Active'} className={inputClass}><option>Active</option><option>Suspended</option></select></label>{!editing ? <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Temporary password<input type="password" className={inputClass} placeholder="Set temporary password" /></label> : null}</div></FormCard></div>;
}
