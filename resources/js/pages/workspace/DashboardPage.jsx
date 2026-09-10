import { Link } from 'react-router-dom';
import { CalendarClock, FileText, Plus, Send, Users } from 'lucide-react';
import PageHeader from '../../components/workspace/PageHeader';
import StatCard from '../../components/workspace/StatCard';
import StatusBadge from '../../components/workspace/StatusBadge';
import TableCard from '../../components/workspace/TableCard';
import { pages, users } from '../../data/workspace';

export default function DashboardPage({ role }) {
    const base = `/${role}`;
    const published = pages.filter((page) => page.status === 'Published').length;
    const drafts = pages.filter((page) => page.status === 'Draft').length;
    const scheduled = pages.filter((page) => page.status === 'Scheduled').length;

    return (
        <div className="space-y-7">
            <PageHeader
                eyebrow={role === 'admin' ? 'Administration' : 'Moderator workspace'}
                title="Overview"
                description={role === 'admin' ? 'Monitor publishing activity and manage the content system from one place.' : 'Review your page workload and continue publishing tasks.'}
                actions={<Link to={`${base}/pages/create`} className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"><Plus className="h-4 w-4" />New page</Link>}
            />

            <div className={`grid gap-4 sm:grid-cols-2 ${role === 'admin' ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}>
                <StatCard label="Published pages" value={published} detail="Visible on the public site" icon={Send} />
                <StatCard label="Draft pages" value={drafts} detail="Waiting for completion" icon={FileText} />
                <StatCard label="Scheduled" value={scheduled} detail="Publishing automatically" icon={CalendarClock} />
                {role === 'admin' ? <StatCard label="Active users" value={users.filter((user) => user.status === 'Active').length} detail="Across all CMS roles" icon={Users} /> : null}
            </div>

            <section>
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div><h2 className="text-lg font-semibold text-slate-950">Recent pages</h2><p className="mt-1 text-sm text-slate-500">Latest content activity across the workspace.</p></div>
                    <Link to={`${base}/pages`} className="text-sm font-semibold text-teal-700 hover:text-teal-800">View all pages</Link>
                </div>
                <TableCard columns={['Page', 'Menu', 'Status', 'Updated', 'Owner']}>
                    {pages.slice(0, 4).map((page) => (
                        <tr key={page.id} className="hover:bg-slate-50/70">
                            <td className="px-5 py-4"><Link to={`${base}/pages/${page.id}/edit`} className="font-semibold text-slate-900 hover:text-teal-700">{page.title}</Link></td>
                            <td className="px-5 py-4 text-sm text-slate-600">{page.menu}</td>
                            <td className="px-5 py-4"><StatusBadge>{page.status}</StatusBadge></td>
                            <td className="px-5 py-4 text-sm text-slate-500">{page.updated}</td>
                            <td className="px-5 py-4 text-sm text-slate-600">{page.author}</td>
                        </tr>
                    ))}
                </TableCard>
            </section>
        </div>
    );
}
