import { Link, useParams } from 'react-router-dom';
import { CalendarDays, Image, Info, Save } from 'lucide-react';
import PageHeader from '../../components/workspace/PageHeader';
import FormCard from '../../components/workspace/FormCard';
import { pages } from '../../data/workspace';

const inputClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100';
const labelClass = 'text-sm font-semibold text-slate-700';

export default function PageFormPage({ role }) {
    const { id } = useParams();
    const page = pages.find((item) => String(item.id) === id);
    const editing = Boolean(id);
    const base = `/${role}`;

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Content"
                title={editing ? `Edit ${page?.title ?? 'page'}` : 'Create page'}
                description="Configure page metadata, navigation placement and publishing settings. The body editor will be added in a later implementation step."
                actions={<><Link to={`${base}/pages`} className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</Link><button className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"><Save className="h-4 w-4" />{editing ? 'Save changes' : 'Create page'}</button></>}
            />

            <div className="space-y-5">
                <FormCard title="Page details" description="Core information used in page listings and public navigation." aside={<><strong className="text-slate-800">Content editor excluded</strong><p className="mt-2">No CKEditor UI is included in this step. This screen is intentionally limited to the rest of the page-management design.</p></>}>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="sm:col-span-2"><span className={labelClass}>Title</span><input defaultValue={page?.title} className={inputClass} placeholder="Enter page title" /></label>
                        <label><span className={labelClass}>URL slug</span><div className="mt-2 flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100"><span className="bg-slate-50 px-3 py-2.5 text-sm text-slate-400">/pages/</span><input defaultValue={page?.title.toLowerCase().replaceAll(' ', '-').replaceAll('&', 'and')} className="min-w-0 flex-1 px-3 py-2.5 text-sm outline-none" placeholder="page-slug" /></div></label>
                        <label><span className={labelClass}>Menu</span><select defaultValue={page?.menu ?? 'Company'} className={inputClass}><option>Company</option><option>Community</option><option>Contact</option><option>None</option></select></label>
                    </div>
                </FormCard>

                <FormCard title="Cover image" description="Upload the image used by public page templates and previews." aside={<><Image className="mb-2 h-5 w-5 text-teal-700" /><p>Recommended landscape image, at least 1600 × 900 px. JPG, PNG or WebP.</p></>}>
                    <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center hover:border-teal-500 hover:bg-teal-50/40">
                        <Image className="h-7 w-7 text-teal-700" />
                        <span className="mt-3 text-sm font-semibold text-slate-800">Drop cover image here or browse</span>
                        <span className="mt-1 text-xs text-slate-500">Maximum file size 8 MB</span>
                        <input type="file" className="sr-only" accept="image/*" />
                    </label>
                </FormCard>

                <FormCard title="Publishing" description="Control whether and when this page becomes publicly visible." aside={<><CalendarDays className="mb-2 h-5 w-5 text-indigo-600" /><p>Scheduled pages remain hidden until the configured publish time is due.</p></>}>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <label><span className={labelClass}>Status</span><select defaultValue={page?.status === 'Published' ? 'Published' : 'Draft'} className={inputClass}><option>Draft</option><option>Published</option></select></label>
                        <label><span className={labelClass}>Publish date</span><input type="datetime-local" className={inputClass} /></label>
                    </div>
                    <div className="mt-5 flex gap-3 rounded-xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-900"><Info className="mt-0.5 h-5 w-5 shrink-0" /><p>Published pages with a future publish date will still stay hidden until that date arrives.</p></div>
                </FormCard>

                {editing ? <FormCard title="Audit information" description="Read-only ownership and update details." aside="These values will be populated from authenticated API actions."><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Created by</p><p className="mt-2 text-sm font-semibold text-slate-800">{page?.author}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Last updated</p><p className="mt-2 text-sm font-semibold text-slate-800">{page?.updated}</p></div></div></FormCard> : null}
            </div>
        </div>
    );
}
