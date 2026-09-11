import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, FileText, Plus, Send, Users } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import PageHeader from '../../components/workspace/PageHeader';
import StatCard from '../../components/workspace/StatCard';
import StatusBadge from '../../components/workspace/StatusBadge';
import TableCard from '../../components/workspace/TableCard';

export default function DashboardPage({ role }) {
    const base = `/${role}`;
    const { can } = useAuth();
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => { api.get('/dashboard').then(({ data }) => setData(data)).catch(() => setError('Unable to load dashboard.')); }, []);

    return <div className="space-y-7">
        <PageHeader eyebrow={role === 'admin' ? 'Administration' : 'Moderator workspace'} title="Overview" description="Monitor content and publishing activity." actions={can('pages.create') ? <Link to={`${base}/pages/create`} className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"><Plus className="h-4 w-4" />New page</Link> : null} />
        {error ? <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}
        <div className={`grid gap-4 sm:grid-cols-2 ${data?.active_users !== undefined ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}><StatCard label="Published pages" value={data?.published ?? '—'} detail="Visible on public site" icon={Send} /><StatCard label="Draft pages" value={data?.drafts ?? '—'} detail="Waiting for completion" icon={FileText} /><StatCard label="Scheduled" value={data?.scheduled ?? '—'} detail="Publish automatically when due" icon={CalendarClock} />{data?.active_users !== undefined ? <StatCard label="Active users" value={data.active_users} detail="Across CMS roles" icon={Users} /> : null}</div>
        <section><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold">Recent pages</h2><p className="mt-1 text-sm text-slate-500">Latest content activity.</p></div><Link to={`${base}/pages`} className="text-sm font-semibold text-teal-700">View all pages</Link></div><TableCard columns={['Page', 'Status', 'Updated', 'Owner']}>{(data?.recent_pages?.data || data?.recent_pages || []).map((page) => <tr key={page.id}><td className="px-5 py-4"><Link className="font-semibold hover:text-teal-700" to={`${base}/pages/${page.id}/edit`}>{page.title}</Link></td><td className="px-5 py-4"><StatusBadge>{page.publishing_state}</StatusBadge></td><td className="px-5 py-4 text-sm text-slate-500">{page.updated_at ? new Date(page.updated_at).toLocaleString() : '—'}</td><td className="px-5 py-4 text-sm text-slate-600">{page.updater?.name || page.creator?.name || '—'}</td></tr>)}</TableCard></section>
    </div>;
}
