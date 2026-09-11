import { useEffect, useMemo, useState } from 'react';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Save, Trash2 } from 'lucide-react';
import api, { apiErrorMessage } from '../../api/client';
import PageHeader from '../../components/workspace/PageHeader';

function SortableRow({ item, selected, onSelect }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
    return <button ref={setNodeRef} type="button" onClick={() => onSelect(item.id)} style={{ transform: CSS.Transform.toString(transform), transition, marginInlineStart: `${item.depth * 28}px` }} className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left shadow-sm ${selected ? 'border-teal-400 bg-teal-50/40' : 'border-slate-200 bg-white'}`}>
        <span {...attributes} {...listeners} onClick={(e) => e.stopPropagation()} className="cursor-grab touch-none text-slate-300"><GripVertical className="h-5 w-5" /></span>
        <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-800">{item.label}</span><span className="mt-0.5 block text-xs text-slate-400">{item.page?.title ? `Linked page: ${item.page.title}` : 'Navigation group'}</span></span>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{item.depth ? 'Child' : 'Root'}</span>
    </button>;
}

function flatten(items) {
    const byParent = new Map();
    items.forEach((item) => {
        const key = item.parent_id ?? 'root';
        byParent.set(key, [...(byParent.get(key) || []), item]);
    });
    for (const values of byParent.values()) values.sort((a, b) => a.position - b.position);
    const output = [];
    const visit = (parent, depth) => (byParent.get(parent) || []).forEach((item) => { output.push({ ...item, depth }); visit(item.id, depth + 1); });
    visit('root', 0);
    return output;
}

export default function MenusPage() {
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
    const [items, setItems] = useState([]);
    const [pages, setPages] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [draft, setDraft] = useState({ label: '', page_id: '', parent_id: '' });
    const [error, setError] = useState('');
    const flattened = useMemo(() => flatten(items), [items]);
    const selected = items.find((item) => item.id === selectedId) || null;

    async function load() {
        try {
            const [{ data: menuResponse }, { data: pageResponse }] = await Promise.all([api.get('/menu-items'), api.get('/pages', { params: { per_page: 100 } })]);
            setItems(menuResponse.data);
            setPages(pageResponse.data);
            if (!selectedId && menuResponse.data[0]) setSelectedId(menuResponse.data[0].id);
        } catch (e) { setError(apiErrorMessage(e, 'Unable to load menu.')); }
    }
    useEffect(() => { load(); }, []);
    useEffect(() => { if (selected) setDraft({ label: selected.label, page_id: selected.page_id ? String(selected.page_id) : '', parent_id: selected.parent_id ? String(selected.parent_id) : '' }); }, [selectedId, items]);

    async function addItem() {
        try {
            const { data } = await api.post('/menu-items', { label: 'New menu item', page_id: null, parent_id: null });
            await load(); setSelectedId(data.data.id);
        } catch (e) { setError(apiErrorMessage(e, 'Unable to add menu item.')); }
    }

    async function saveItem() {
        if (!selected) return;
        try {
            await api.patch(`/menu-items/${selected.id}`, { label: draft.label, page_id: draft.page_id ? Number(draft.page_id) : null, parent_id: draft.parent_id ? Number(draft.parent_id) : null, position: selected.position });
            await load();
        } catch (e) { setError(apiErrorMessage(e, 'Unable to save menu item.')); }
    }

    async function removeItem() {
        if (!selected || !window.confirm(`Delete “${selected.label}” and its nested children?`)) return;
        try { await api.delete(`/menu-items/${selected.id}`); setSelectedId(null); await load(); }
        catch (e) { setError(apiErrorMessage(e, 'Unable to delete menu item.')); }
    }

    async function dragEnd({ active, over }) {
        if (!over || active.id === over.id) return;
        const oldIndex = flattened.findIndex((item) => item.id === active.id);
        const newIndex = flattened.findIndex((item) => item.id === over.id);
        const moved = arrayMove(flattened, oldIndex, newIndex);
        const next = moved.map((item, index) => ({ ...item, position: index }));
        setItems((current) => current.map((item) => ({ ...item, position: next.find((row) => row.id === item.id)?.position ?? item.position })));
        try { await api.put('/menu-items/reorder', { items: next.map((item) => ({ id: item.id, parent_id: item.parent_id, position: item.position })) }); await load(); }
        catch (e) { setError(apiErrorMessage(e, 'Unable to save menu order.')); await load(); }
    }

    return <div className="space-y-6">
        <PageHeader eyebrow="Navigation" title="Menu structure" description="Reorder navigation items and assign nesting, labels and page destinations." actions={<button type="button" onClick={addItem} className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Add menu item</button>} />
        {error ? <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4"><h2 className="font-semibold text-slate-950">Primary navigation</h2><p className="mt-1 text-sm text-slate-500">Drag to reorder. Use Parent in settings to nest an item.</p></div><DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragEnd}><SortableContext items={flattened.map((item) => item.id)} strategy={verticalListSortingStrategy}><div className="space-y-2">{flattened.map((item) => <SortableRow key={item.id} item={item} selected={selectedId === item.id} onSelect={setSelectedId} />)}{flattened.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">No menu items yet.</div> : null}</div></SortableContext></DndContext></section>
            <aside><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold text-slate-950">Menu item settings</h2><p className="mt-1 text-sm text-slate-500">{selected ? 'Edit the selected item.' : 'Select an item to edit it.'}</p>{selected ? <div className="mt-5 space-y-4"><label className="block text-sm font-semibold text-slate-700">Label<input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-teal-500" /></label><label className="block text-sm font-semibold text-slate-700">Linked page<select value={draft.page_id} onChange={(e) => setDraft({ ...draft, page_id: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-teal-500"><option value="">No page — group only</option>{pages.map((page) => <option key={page.id} value={page.id}>{page.title}</option>)}</select></label><label className="block text-sm font-semibold text-slate-700">Parent<select value={draft.parent_id} onChange={(e) => setDraft({ ...draft, parent_id: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-teal-500"><option value="">Root item</option>{flattened.filter((item) => item.id !== selected.id).map((item) => <option key={item.id} value={item.id}>{'— '.repeat(item.depth)}{item.label}</option>)}</select></label><button type="button" onClick={saveItem} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"><Save className="h-4 w-4" />Save item</button><button type="button" onClick={removeItem} className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" />Delete item</button></div> : null}</div></aside>
        </div>
    </div>;
}
