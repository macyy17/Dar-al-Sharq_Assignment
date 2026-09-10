import { ArchiveRestore, Trash2 } from 'lucide-react';
import PageHeader from '../../components/workspace/PageHeader';
import TableCard from '../../components/workspace/TableCard';
import { trashedPages } from '../../data/workspace';

export default function TrashPage() {
    return (
        <div className="space-y-6">
            <PageHeader eyebrow="Content" title="Page trash" description="Review soft-deleted pages and restore content when needed." />
            <TableCard columns={['Page', 'Deleted', 'Deleted by', 'Actions']}>
                {trashedPages.map((page) => (
                    <tr key={page.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-4 font-semibold text-slate-900">{page.title}</td>
                        <td className="px-5 py-4 text-sm text-slate-500">{page.deleted}</td>
                        <td className="px-5 py-4 text-sm text-slate-600">{page.deletedBy}</td>
                        <td className="px-5 py-4"><div className="flex gap-2"><button className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"><ArchiveRestore className="h-4 w-4" />Restore</button><button className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" />Delete permanently</button></div></td>
                    </tr>
                ))}
            </TableCard>
        </div>
    );
}
