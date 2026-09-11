import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CalendarDays, Image, Info, Save } from 'lucide-react';
import api, { apiErrorMessage } from '../../api/client';
import PageContentEditor from '../../components/editor/PageContentEditor';
import PageHeader from '../../components/workspace/PageHeader';
import FormCard from '../../components/workspace/FormCard';

const inputClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100';
const labelClass = 'text-sm font-semibold text-slate-700';
const empty = { title: '', slug: '', body: '', status: 'draft', publish_at: '', cover_image: null };

function toLocalInput(value) {
    if (!value) return '';
    const date = new Date(value);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
}

export default function PageFormPage({ role }) {
    const { id } = useParams();
    const editing = Boolean(id);
    const base = `/${role}`;
    const navigate = useNavigate();
    const [form, setForm] = useState(empty);
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(editing);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (!editing) return;

        api.get(`/pages/${id}`)
            .then(({ data }) => {
                const record = data.data;
                setPage(record);
                setForm({
                    title: record.title,
                    slug: record.slug,
                    body: record.body || '',
                    status: record.status,
                    publish_at: toLocalInput(record.publish_at),
                    cover_image: null,
                });
            })
            .catch((requestError) => setError(apiErrorMessage(requestError, 'Unable to load page.')))
            .finally(() => setLoading(false));
    }, [editing, id]);

    function change(name, value) {
        setForm((current) => ({ ...current, [name]: value }));
    }

    function titleChanged(value) {
        setForm((current) => ({
            ...current,
            title: value,
            slug: editing || current.slug
                ? current.slug
                : value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        }));
    }

    async function submit(event) {
        event.preventDefault();
        setSubmitting(true);
        setError('');
        setFieldErrors({});

        const payload = new FormData();
        payload.append('title', form.title);
        payload.append('slug', form.slug);
        payload.append('body', form.body || '');
        payload.append('status', form.status);
        if (form.publish_at) payload.append('publish_at', new Date(form.publish_at).toISOString());
        if (form.cover_image) payload.append('cover_image', form.cover_image);
        if (editing) payload.append('_method', 'PATCH');

        try {
            await api.post(editing ? `/pages/${id}` : '/pages', payload);
            navigate(`${base}/pages`);
        } catch (requestError) {
            setFieldErrors(requestError?.response?.data?.errors || {});
            setError(apiErrorMessage(requestError, 'Unable to save page.'));
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <div className="text-sm text-slate-500">Loading page…</div>;

    return <form onSubmit={submit} className="space-y-6">
        <PageHeader
            eyebrow="Content"
            title={editing ? `Edit ${page?.title || 'page'}` : 'Create page'}
            description="Configure page content, metadata, cover image and publishing."
            actions={<>
                <Link to={`${base}/pages`} className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">Cancel</Link>
                <button disabled={submitting} className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white disabled:opacity-60"><Save className="h-4 w-4" />{submitting ? 'Saving…' : editing ? 'Save changes' : 'Create page'}</button>
            </>}
        />

        {error ? <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}

        <FormCard title="Page details" description="Core information used in listings and public navigation.">
            <div className="grid gap-5 sm:grid-cols-2">
                <label className="sm:col-span-2">
                    <span className={labelClass}>Title</span>
                    <input required value={form.title} onChange={(e) => titleChanged(e.target.value)} className={inputClass} placeholder="Enter page title" />
                    {fieldErrors.title ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.title[0]}</p> : null}
                </label>
                <label>
                    <span className={labelClass}>URL slug</span>
                    <input required value={form.slug} onChange={(e) => change('slug', e.target.value)} className={inputClass} placeholder="page-slug" />
                    {fieldErrors.slug ? <p className="mt-1 text-xs text-rose-600">{fieldErrors.slug[0]}</p> : null}
                </label>
            </div>
        </FormCard>

        <FormCard title="Page content" description="Rich text shown on the public page." aside="Images inserted here are uploaded to Laravel storage.">
            <PageContentEditor value={form.body} onChange={(body) => change('body', body)} />
            {fieldErrors.body ? <p className="mt-2 text-xs text-rose-600">{fieldErrors.body[0]}</p> : null}
        </FormCard>

        <FormCard title="Cover image" description="Upload the public page cover image." aside={<><Image className="mb-2 h-5 w-5 text-teal-700" /><p>JPG, PNG or WebP up to 8 MB.</p></>}>
            <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
                <Image className="h-7 w-7 text-teal-700" />
                <span className="mt-3 text-sm font-semibold text-slate-800">{form.cover_image?.name || (page?.cover_image_url ? 'Replace current cover image' : 'Choose cover image')}</span>
                <input type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" onChange={(e) => change('cover_image', e.target.files?.[0] || null)} />
            </label>
        </FormCard>

        <FormCard title="Publishing" description="Publish immediately, schedule publication, or keep the page as draft." aside={<><CalendarDays className="mb-2 h-5 w-5 text-indigo-600" /><p>A published page with a future publish date stays hidden until due.</p></>}>
            <div className="grid gap-5 sm:grid-cols-2">
                <label><span className={labelClass}>Status</span><select value={form.status} onChange={(e) => change('status', e.target.value)} className={inputClass}><option value="draft">Draft</option><option value="published">Published</option></select></label>
                <label><span className={labelClass}>Publish date</span><input type="datetime-local" value={form.publish_at} onChange={(e) => change('publish_at', e.target.value)} className={inputClass} /></label>
            </div>
            <div className="mt-5 flex gap-3 rounded-xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-900"><Info className="mt-0.5 h-5 w-5 shrink-0" /><p>Future publish dates remain hidden until due.</p></div>
        </FormCard>
    </form>;
}
