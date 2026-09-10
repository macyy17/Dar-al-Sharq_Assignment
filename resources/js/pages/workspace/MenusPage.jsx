import { GripVertical, MoreHorizontal, Plus } from 'lucide-react';
import PageHeader from '../../components/workspace/PageHeader';

const menuItems = [
    { id: 1, label: 'Company', page: null, depth: 0 },
    { id: 2, label: 'About Dar Al Sharq', page: 'About Dar Al Sharq', depth: 1 },
    { id: 3, label: 'Editorial Standards', page: 'Editorial Standards', depth: 1 },
    { id: 4, label: 'Community', page: null, depth: 0 },
    { id: 5, label: 'Community Initiatives', page: 'Community Initiatives', depth: 1 },
    { id: 6, label: 'Contact', page: 'Contact & Offices', depth: 0 },
];

export default function MenusPage() {
    return (
        <div className="space-y-6">
            <PageHeader eyebrow="Navigation" title="Menu structure" description="Design the public navigation hierarchy and page placement. Drag-and-drop persistence will be connected to the menu API later." actions={<button className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Add menu item</button>} />
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4"><h2 className="font-semibold text-slate-950">Primary navigation</h2><p className="mt-1 text-sm text-slate-500">Drag items to reorder. Indented items represent nested navigation.</p></div>
                    <div className="space-y-2">
                        {menuItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm" style={{ marginInlineStart: `${item.depth * 32}px` }}>
                                <GripVertical className="h-5 w-5 cursor-grab text-slate-300" />
                                <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-800">{item.label}</p><p className="mt-0.5 text-xs text-slate-400">{item.page ? `Linked page: ${item.page}` : 'Navigation group'}</p></div>
                                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{item.depth ? 'Child' : 'Root'}</span>
                                <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><MoreHorizontal className="h-4 w-4" /></button>
                            </div>
                        ))}
                    </div>
                </section>
                <aside className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold text-slate-950">Menu item settings</h2><p className="mt-1 text-sm text-slate-500">Select an item to edit its label and destination.</p><div className="mt-5 space-y-4"><label className="block text-sm font-semibold text-slate-700">Label<input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-teal-500" defaultValue="Company" /></label><label className="block text-sm font-semibold text-slate-700">Linked page<select className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-teal-500"><option>No page — group only</option><option>About Dar Al Sharq</option><option>Editorial Standards</option></select></label><button className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Save item</button></div></div>
                </aside>
            </div>
        </div>
    );
}
