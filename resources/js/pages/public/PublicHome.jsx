import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import PageBlocks from '../../components/blocks/PageBlocks';

function NavigationLevel({ items, nested = false }) {
    if (!items?.length) return null;

    return <div className={nested ? 'space-y-1' : 'flex flex-wrap items-center gap-5'}>
        {items.map((item) => <div key={item.id} className={nested ? 'relative ps-3' : 'group relative'}>
            {item.url
                ? <Link to={item.url} className="block py-1 text-sm font-semibold text-slate-700 hover:text-teal-700">{item.label}</Link>
                : <span className="block py-1 text-sm font-semibold text-slate-700">{item.label}</span>}
            {item.children?.length ? (
                nested
                    ? <div className="border-s border-slate-200 ps-2"><NavigationLevel items={item.children} nested /></div>
                    : <div className="mt-2 min-w-56 md:absolute md:start-0 md:top-full md:z-20 md:hidden md:rounded-xl md:border md:border-slate-200 md:bg-white md:p-3 md:shadow-lg md:group-hover:block"><NavigationLevel items={item.children} nested /></div>
            ) : null}
        </div>)}
    </div>;
}

export default function PublicHome() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(null);

    useEffect(() => {
        Promise.allSettled([api.get('/public/navigation'), api.get('/public/home')]).then(([navigation, home]) => {
            if (navigation.status === 'fulfilled') setItems(navigation.value.data.data);
            if (home.status === 'fulfilled') setPage(home.value.data.data);
        });
    }, []);

    return <main className="min-h-screen bg-white text-slate-950">
        <header className="border-b border-slate-200">
            <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-6 md:flex-row md:items-center">
                <Link to="/" className="text-lg font-bold tracking-tight">Dar Al Sharq</Link>
                <nav className="md:ms-auto"><NavigationLevel items={items} /></nav>
                <Link to="/login" className="text-sm font-semibold text-teal-700">CMS sign in</Link>
            </div>
        </header>
        <section className="mx-auto max-w-6xl px-6 py-16">
            {page?.cover_image_url ? <img src={page.cover_image_url} alt="" className="mb-10 max-h-[480px] w-full rounded-3xl object-cover" /> : null}
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Home</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight">{page?.title || 'Dar Al Sharq'}</h1>
            <div className="cms-content mt-10" data-testid="home-body" dangerouslySetInnerHTML={{ __html: page?.body || '' }} /><div className="mt-12"><PageBlocks blocks={page?.blocks || []} /></div>
        </section>
    </main>;
}
