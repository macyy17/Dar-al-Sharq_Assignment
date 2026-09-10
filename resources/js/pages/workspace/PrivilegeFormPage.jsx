import { Link, useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import PageHeader from '../../components/workspace/PageHeader';
import FormCard from '../../components/workspace/FormCard';
import { privileges } from '../../data/workspace';

export default function PrivilegeFormPage() {
    const { id }=useParams(); const privilege=privileges.find((item)=>String(item.id)===id); const editing=Boolean(id); const input='mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100';
    return <div className="space-y-6"><PageHeader eyebrow="Access control" title={editing?`Edit ${privilege?.name ?? 'privilege'}`:'Add privilege'} description="Define a small, explicit capability that can be attached to roles." actions={<><Link to="/admin/privileges" className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">Cancel</Link><button className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"><Save className="h-4 w-4" />Save privilege</button></>} /><FormCard title="Privilege details" description="Use stable capability names that describe the action being authorized." aside="Example naming pattern: resource.action — such as pages.update or users.manage."><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Name<input defaultValue={privilege?.name} className={input} placeholder="pages.publish" /></label><label className="text-sm font-semibold text-slate-700">Group<input defaultValue={privilege?.group} className={input} placeholder="Pages" /></label><label className="text-sm font-semibold text-slate-700 sm:col-span-2">Description<textarea defaultValue={privilege?.description} rows="4" className={`${input} font-normal`} placeholder="Describe what this privilege allows." /></label></div></FormCard></div>;
}
