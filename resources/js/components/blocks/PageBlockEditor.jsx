import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowDown, ArrowUp, GripVertical, ImagePlus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import api from '../../api/client';

const input = 'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100';
const textarea = `${input} min-h-24 resize-y`;
const label = 'text-xs font-semibold uppercase tracking-wide text-slate-500';

const definitions = [
    ['carousel', 'Carousel / Slider'],
    ['image_text', 'Image + Text'],
    ['cta', 'CTA'],
    ['gallery', 'Gallery'],
    ['video', 'Video Embed'],
    ['accordion', 'Accordion / FAQ'],
    ['cards', 'Cards / Feature Grid'],
    ['quote', 'Quote / Highlight'],
    ['divider', 'Divider / Spacer'],
    ['button', 'Button'],
];

const uid = (prefix = 'block') => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

function emptyBlock(type) {
    const id = uid(type);
    const item = () => ({ id: uid('item') });
    return {
        carousel: { id, type, slides: [{ ...item(), image: '', title: '', caption: '', url: '' }] },
        image_text: { id, type, image: '', position: 'left', heading: '', description: '', button_text: '', button_url: '' },
        cta: { id, type, heading: '', description: '', button_text: 'Learn more', button_url: '' },
        gallery: { id, type, images: [{ ...item(), image: '', caption: '' }] },
        video: { id, type, url: '', title: '', caption: '' },
        accordion: { id, type, items: [{ ...item(), question: '', answer: '' }] },
        cards: { id, type, heading: '', items: [{ ...item(), image: '', title: '', description: '', url: '' }] },
        quote: { id, type, quote: '', author: '' },
        divider: { id, type, size: 'md' },
        button: { id, type, text: 'Learn more', url: '', target: 'same', style: 'primary' },
    }[type];
}

function ImageField({ value, onChange }) {
    const [uploading, setUploading] = useState(false);
    async function upload(file) {
        if (!file) return;
        setUploading(true);
        const data = new FormData();
        data.append('upload', file);
        try {
            const response = await api.post('/editor/images', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            onChange(response.data.url);
        } finally {
            setUploading(false);
        }
    }
    return <div>
        <span className={label}>Image</span>
        <div className="mt-1.5 flex gap-2">
            <input value={value || ''} onChange={(e) => onChange(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500" placeholder="/storage/... or https://..." />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                <ImagePlus className="h-4 w-4" />{uploading ? 'Uploading…' : 'Upload'}
                <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={(e) => upload(e.target.files?.[0])} />
            </label>
        </div>
        {value ? <img src={value} alt="" className="mt-2 h-24 w-40 rounded-lg object-cover" /> : null}
    </div>;
}

function ItemControls({ index, count, onMove, onRemove }) {
    return <div className="flex items-center gap-1">
        <button type="button" disabled={index === 0} onClick={() => onMove(index, index - 1)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Move item up"><ArrowUp className="h-4 w-4" /></button>
        <button type="button" disabled={index === count - 1} onClick={() => onMove(index, index + 1)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30" aria-label="Move item down"><ArrowDown className="h-4 w-4" /></button>
        <button type="button" onClick={onRemove} className="rounded p-1.5 text-rose-600 hover:bg-rose-50" aria-label="Remove item"><Trash2 className="h-4 w-4" /></button>
    </div>;
}

function Repeater({ items, onChange, createItem, addLabel, children }) {
    const update = (index, patch) => onChange(items.map((item, i) => i === index ? { ...item, ...patch } : item));
    const remove = (index) => onChange(items.filter((_, i) => i !== index));
    const move = (from, to) => onChange(arrayMove(items, from, to));
    return <div className="space-y-3">
        {items.map((item, index) => <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-slate-400">Item {index + 1}</span><ItemControls index={index} count={items.length} onMove={move} onRemove={() => remove(index)} /></div>
            {children(item, (patch) => update(index, patch), index)}
        </div>)}
        <button type="button" onClick={() => onChange([...items, createItem()])} className="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50"><Plus className="h-4 w-4" />{addLabel}</button>
    </div>;
}

function BlockFields({ block, update }) {
    if (block.type === 'carousel') return <Repeater items={block.slides || []} onChange={(slides) => update({ slides })} createItem={() => ({ id: uid('slide'), image: '', title: '', caption: '', url: '' })} addLabel="Add slide">
        {(item, patch) => <div className="grid gap-3 sm:grid-cols-2"><div className="sm:col-span-2"><ImageField value={item.image} onChange={(image) => patch({ image })} /></div><label><span className={label}>Title</span><input className={input} value={item.title || ''} onChange={(e) => patch({ title: e.target.value })} /></label><label><span className={label}>Link</span><input className={input} value={item.url || ''} onChange={(e) => patch({ url: e.target.value })} placeholder="/about-us" /></label><label className="sm:col-span-2"><span className={label}>Caption</span><textarea className={textarea} value={item.caption || ''} onChange={(e) => patch({ caption: e.target.value })} /></label></div>}
    </Repeater>;

    if (block.type === 'image_text') return <div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><ImageField value={block.image} onChange={(image) => update({ image })} /></div><label><span className={label}>Image position</span><select className={input} value={block.position || 'left'} onChange={(e) => update({ position: e.target.value })}><option value="left">Image left / text right</option><option value="right">Image right / text left</option></select></label><label><span className={label}>Heading</span><input className={input} value={block.heading || ''} onChange={(e) => update({ heading: e.target.value })} /></label><label className="sm:col-span-2"><span className={label}>Description</span><textarea className={textarea} value={block.description || ''} onChange={(e) => update({ description: e.target.value })} /></label><label><span className={label}>Button text</span><input className={input} value={block.button_text || ''} onChange={(e) => update({ button_text: e.target.value })} /></label><label><span className={label}>Button URL</span><input className={input} value={block.button_url || ''} onChange={(e) => update({ button_url: e.target.value })} /></label></div>;

    if (block.type === 'cta') return <div className="grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2"><span className={label}>Heading</span><input className={input} value={block.heading || ''} onChange={(e) => update({ heading: e.target.value })} /></label><label className="sm:col-span-2"><span className={label}>Description</span><textarea className={textarea} value={block.description || ''} onChange={(e) => update({ description: e.target.value })} /></label><label><span className={label}>Button text</span><input className={input} value={block.button_text || ''} onChange={(e) => update({ button_text: e.target.value })} /></label><label><span className={label}>Button URL</span><input className={input} value={block.button_url || ''} onChange={(e) => update({ button_url: e.target.value })} /></label></div>;

    if (block.type === 'gallery') return <Repeater items={block.images || []} onChange={(images) => update({ images })} createItem={() => ({ id: uid('image'), image: '', caption: '' })} addLabel="Add image">
        {(item, patch) => <div className="space-y-3"><ImageField value={item.image} onChange={(image) => patch({ image })} /><label className="block"><span className={label}>Caption</span><input className={input} value={item.caption || ''} onChange={(e) => patch({ caption: e.target.value })} /></label></div>}
    </Repeater>;

    if (block.type === 'video') return <div className="grid gap-4"><label><span className={label}>YouTube / Vimeo URL</span><input className={input} value={block.url || ''} onChange={(e) => update({ url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." /></label><label><span className={label}>Title</span><input className={input} value={block.title || ''} onChange={(e) => update({ title: e.target.value })} /></label><label><span className={label}>Caption</span><textarea className={textarea} value={block.caption || ''} onChange={(e) => update({ caption: e.target.value })} /></label></div>;

    if (block.type === 'accordion') return <Repeater items={block.items || []} onChange={(items) => update({ items })} createItem={() => ({ id: uid('faq'), question: '', answer: '' })} addLabel="Add question">
        {(item, patch) => <div className="grid gap-3"><label><span className={label}>Question</span><input className={input} value={item.question || ''} onChange={(e) => patch({ question: e.target.value })} /></label><label><span className={label}>Answer</span><textarea className={textarea} value={item.answer || ''} onChange={(e) => patch({ answer: e.target.value })} /></label></div>}
    </Repeater>;

    if (block.type === 'cards') return <div className="space-y-4"><label className="block"><span className={label}>Section heading</span><input className={input} value={block.heading || ''} onChange={(e) => update({ heading: e.target.value })} /></label><Repeater items={block.items || []} onChange={(items) => update({ items })} createItem={() => ({ id: uid('card'), image: '', icon: '', title: '', description: '', url: '' })} addLabel="Add card">{(item, patch) => <div className="grid gap-3 sm:grid-cols-2"><div className="sm:col-span-2"><ImageField value={item.image} onChange={(image) => patch({ image })} /></div><label><span className={label}>Icon (used when there is no image)</span><select className={input} value={item.icon || ''} onChange={(e) => patch({ icon: e.target.value })}><option value="">No icon</option><option value="star">Star</option><option value="globe">Globe</option><option value="shield">Shield</option><option value="briefcase">Briefcase</option><option value="users">Users</option><option value="newspaper">Newspaper</option><option value="sparkles">Sparkles</option></select></label><label><span className={label}>Title</span><input className={input} value={item.title || ''} onChange={(e) => patch({ title: e.target.value })} /></label><label className="sm:col-span-2"><span className={label}>Link</span><input className={input} value={item.url || ''} onChange={(e) => patch({ url: e.target.value })} /></label><label className="sm:col-span-2"><span className={label}>Description</span><textarea className={textarea} value={item.description || ''} onChange={(e) => patch({ description: e.target.value })} /></label></div>}</Repeater></div>;

    if (block.type === 'quote') return <div className="grid gap-4"><label><span className={label}>Quote</span><textarea className={textarea} value={block.quote || ''} onChange={(e) => update({ quote: e.target.value })} /></label><label><span className={label}>Author</span><input className={input} value={block.author || ''} onChange={(e) => update({ author: e.target.value })} /></label></div>;

    if (block.type === 'divider') return <label className="block"><span className={label}>Spacing</span><select className={input} value={block.size || 'md'} onChange={(e) => update({ size: e.target.value })}><option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option></select></label>;

    if (block.type === 'button') return <div className="grid gap-4 sm:grid-cols-2"><label><span className={label}>Text</span><input className={input} value={block.text || ''} onChange={(e) => update({ text: e.target.value })} /></label><label><span className={label}>URL</span><input className={input} value={block.url || ''} onChange={(e) => update({ url: e.target.value })} /></label><label><span className={label}>Open</span><select className={input} value={block.target || 'same'} onChange={(e) => update({ target: e.target.value })}><option value="same">Same tab</option><option value="new">New tab</option></select></label><label><span className={label}>Style</span><select className={input} value={block.style || 'primary'} onChange={(e) => update({ style: e.target.value })}><option value="primary">Primary</option><option value="secondary">Secondary</option></select></label></div>;

    return null;
}

function SortableBlock({ block, onUpdate, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
    const name = definitions.find(([type]) => type === block.type)?.[1] || block.type;
    return <section ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`rounded-2xl border border-slate-200 bg-white ${isDragging ? 'z-20 shadow-xl' : ''}`}>
        <header className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
            <button type="button" {...attributes} {...listeners} className="cursor-grab rounded-lg p-2 text-slate-400 hover:bg-slate-100 active:cursor-grabbing" aria-label={`Reorder ${name}`}><GripVertical className="h-4 w-4" /></button>
            <div className="min-w-0 flex-1"><p className="text-sm font-bold text-slate-800">{name}</p><p className="text-xs text-slate-400">Drag this block to reorder the page.</p></div>
            <button type="button" onClick={onRemove} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label={`Remove ${name}`}><Trash2 className="h-4 w-4" /></button>
        </header>
        <div className="p-4"><BlockFields block={block} update={onUpdate} /></div>
    </section>;
}

export default function PageBlockEditor({ value = [], onChange }) {
    const sensors = useSensors(useSensor(PointerSensor));
    const blocks = Array.isArray(value) ? value : [];

    function update(id, patch) {
        onChange(blocks.map((block) => block.id === id ? { ...block, ...patch } : block));
    }

    function dragEnd(event) {
        if (!event.over || event.active.id === event.over.id) return;
        const oldIndex = blocks.findIndex((block) => block.id === event.active.id);
        const newIndex = blocks.findIndex((block) => block.id === event.over.id);
        onChange(arrayMove(blocks, oldIndex, newIndex));
    }

    return <div className="space-y-5">
        {blocks.length ? <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragEnd}><SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}><div className="space-y-4">{blocks.map((block) => <SortableBlock key={block.id} block={block} onUpdate={(patch) => update(block.id, patch)} onRemove={() => onChange(blocks.filter((item) => item.id !== block.id))} />)}</div></SortableContext></DndContext> : <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">No structured blocks yet. Add one below.</div>}
        <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Add component</p>
            <div className="flex flex-wrap gap-2">{definitions.map(([type, name]) => <button key={type} type="button" onClick={() => onChange([...blocks, emptyBlock(type)])} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"><Plus className="h-3.5 w-3.5" />{name}</button>)}</div>
        </div>
    </div>;
}
