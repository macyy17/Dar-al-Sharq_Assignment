import { useEffect, useState } from 'react';
import PageBlocks from '../blocks/PageBlocks';

export default function PageLivePreview({ form, page }) {
    const [localCoverUrl, setLocalCoverUrl] = useState('');

    useEffect(() => {
        if (!form.cover_image) {
            setLocalCoverUrl('');
            return undefined;
        }

        const url = URL.createObjectURL(form.cover_image);
        setLocalCoverUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [form.cover_image]);

    const cover = localCoverUrl || page?.cover_image_url || '';
    const route = form.is_home ? '/' : `/${form.slug || 'page-slug'}`;

    function keepPreviewInPlace(event) {
        if (event.target.closest('a')) event.preventDefault();
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-24">
            <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="min-w-0 flex-1 truncate rounded-md border border-slate-200 bg-white px-3 py-1.5 text-center text-[11px] font-medium text-slate-500">
                    {route}
                </div>
                <span className="rounded-full bg-teal-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">Live preview</span>
            </div>

            <div className="max-h-[calc(100vh-9rem)] overflow-y-auto" onClickCapture={keepPreviewInPlace}>
                <main className="min-h-[720px] bg-white text-slate-950">
                    <header className="border-b border-slate-200">
                        <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-7">
                            <span className="text-sm font-bold tracking-tight">Dar Al Sharq</span>
                            <span className="text-xs font-semibold text-teal-700">{form.is_home ? 'Home' : 'Page preview'}</span>
                        </div>
                    </header>

                    <article className="px-5 py-8 sm:px-7 sm:py-10">
                        {cover ? <img src={cover} alt="" className="mb-7 max-h-[330px] w-full rounded-2xl object-cover" /> : null}
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700">{form.is_home ? 'Home' : form.status === 'draft' ? 'Draft preview' : 'Published page'}</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{form.title || 'Untitled page'}</h1>
                        <div className="cms-content mt-7" dangerouslySetInnerHTML={{ __html: form.body || '' }} />
                        <div className="mt-9"><PageBlocks blocks={form.blocks || []} /></div>
                    </article>
                </main>
            </div>
        </section>
    );
}
