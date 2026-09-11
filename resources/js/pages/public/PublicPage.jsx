import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/client';
import PageBlocks from '../../components/blocks/PageBlocks';

export default function PublicPage() {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [missing, setMissing] = useState(false);
    useEffect(() => { setMissing(false); api.get(`/public/pages/${slug}`).then(({ data }) => setPage(data.data)).catch((error) => { if (error?.response?.status === 404) setMissing(true); }); }, [slug]);
    if (missing) return <main className="grid min-h-screen place-items-center bg-white p-6 text-center"><div><p className="text-sm font-bold text-teal-700">404</p><h1 className="mt-2 text-3xl font-semibold">Page not available</h1><Link to="/" className="mt-6 inline-block text-sm font-semibold text-teal-700">Back to public site</Link></div></main>;
    if (!page) return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Loading page…</div>;
    return <main className="min-h-screen bg-white text-slate-950"><header className="border-b border-slate-200"><div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6"><Link to="/" className="text-lg font-bold">Dar Al Sharq</Link><Link to="/" className="text-sm font-semibold text-teal-700">Home</Link></div></header><article className="mx-auto max-w-5xl px-6 py-16">{page.cover_image_url ? <img src={page.cover_image_url} alt="" className="mb-10 max-h-[420px] w-full rounded-3xl object-cover" /> : null}<p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Published page</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{page.title}</h1><div className="cms-content mt-10" data-testid="page-body" dangerouslySetInnerHTML={{ __html: page.body || '' }} /><div className="mt-12"><PageBlocks blocks={page.blocks || []} /></div></article></main>;
}
