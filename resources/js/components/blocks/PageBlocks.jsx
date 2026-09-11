import { BriefcaseBusiness, ChevronLeft, ChevronRight, ExternalLink, Globe2, Newspaper, ShieldCheck, Sparkles, Star, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const cardIcons = { star: Star, globe: Globe2, shield: ShieldCheck, briefcase: BriefcaseBusiness, users: Users, newspaper: Newspaper, sparkles: Sparkles };

function SmartLink({ href, children, className = '', target = 'same' }) {
    if (!href) return null;
    const newTab = target === 'new';
    if (href.startsWith('/') && !newTab) return <Link to={href} className={className}>{children}</Link>;
    return <a href={href} className={className} target={newTab ? '_blank' : undefined} rel={newTab ? 'noreferrer noopener' : undefined}>{children}</a>;
}

function ActionLink({ href, children, secondary = false, target = 'same' }) {
    return <SmartLink href={href} target={target} className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-bold transition ${secondary ? 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50' : 'bg-teal-700 text-white hover:bg-teal-800'}`}>{children}{target === 'new' ? <ExternalLink className="ms-2 h-4 w-4" /> : null}</SmartLink>;
}

function CarouselBlock({ block }) {
    const slides = (block.slides || []).filter((slide) => slide.image);
    const [index, setIndex] = useState(0);
    useEffect(() => setIndex(0), [block.id]);
    if (!slides.length) return null;
    const slide = slides[index % slides.length];
    const set = (next) => setIndex((next + slides.length) % slides.length);
    const content = <div className="relative overflow-hidden rounded-3xl bg-slate-900">
        <img src={slide.image} alt={slide.title || slide.caption || ''} className="h-[320px] w-full object-cover sm:h-[480px] lg:h-[560px]" />
        {(slide.title || slide.caption) ? <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-6 pb-7 pt-24 text-white sm:px-10 sm:pb-10"><h2 className="max-w-3xl text-3xl font-bold sm:text-4xl">{slide.title}</h2>{slide.caption ? <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">{slide.caption}</p> : null}</div> : null}
    </div>;
    return <section className="page-block page-block-carousel">
        <div className="relative">
            {slide.url ? <SmartLink href={slide.url}>{content}</SmartLink> : content}
            {slides.length > 1 ? <><button type="button" aria-label="Previous slide" onClick={() => set(index - 1)} className="absolute start-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-slate-900 shadow-lg"><ChevronLeft className="h-5 w-5" /></button><button type="button" aria-label="Next slide" onClick={() => set(index + 1)} className="absolute end-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-slate-900 shadow-lg"><ChevronRight className="h-5 w-5" /></button></> : null}
        </div>
        {slides.length > 1 ? <div className="mt-3 flex justify-center gap-2">{slides.map((item, i) => <button key={item.id} type="button" onClick={() => setIndex(i)} aria-label={`Show slide ${i + 1}`} className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-teal-700' : 'w-2 bg-slate-300'}`} />)}</div> : null}
    </section>;
}

function ImageTextBlock({ block }) {
    if (!block.image && !block.heading && !block.description) return null;
    return <section className="page-block grid items-center gap-8 rounded-3xl bg-slate-50 p-6 sm:p-8 lg:grid-cols-2 lg:p-10">
        {block.image ? <img src={block.image} alt="" className={`h-full min-h-72 w-full rounded-2xl object-cover ${block.position === 'right' ? 'lg:order-2' : ''}`} /> : null}
        <div className={block.position === 'right' ? 'lg:order-1' : ''}>{block.heading ? <h2 className="text-3xl font-bold tracking-tight text-slate-950">{block.heading}</h2> : null}{block.description ? <p className="mt-4 whitespace-pre-line text-base leading-7 text-slate-600">{block.description}</p> : null}{block.button_text && block.button_url ? <div className="mt-6"><ActionLink href={block.button_url}>{block.button_text}</ActionLink></div> : null}</div>
    </section>;
}

function CtaBlock({ block }) {
    return <section className="page-block overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white sm:px-10 sm:py-14"><div className="mx-auto flex max-w-4xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div>{block.heading ? <h2 className="text-3xl font-bold tracking-tight">{block.heading}</h2> : null}{block.description ? <p className="mt-3 max-w-2xl leading-7 text-slate-300">{block.description}</p> : null}</div>{block.button_text && block.button_url ? <div className="shrink-0"><ActionLink href={block.button_url}>{block.button_text}</ActionLink></div> : null}</div></section>;
}

function GalleryBlock({ block }) {
    const images = (block.images || []).filter((item) => item.image);
    const [active, setActive] = useState(null);
    useEffect(() => {
        if (active === null) return;
        const key = (event) => { if (event.key === 'Escape') setActive(null); if (event.key === 'ArrowRight') setActive((active + 1) % images.length); if (event.key === 'ArrowLeft') setActive((active - 1 + images.length) % images.length); };
        window.addEventListener('keydown', key);
        return () => window.removeEventListener('keydown', key);
    }, [active, images.length]);
    if (!images.length) return null;
    const current = active !== null ? images[active] : null;
    return <section className="page-block"><div className="grid grid-cols-2 gap-3 md:grid-cols-3">{images.map((item, index) => <button key={item.id} type="button" onClick={() => setActive(index)} className="group overflow-hidden rounded-2xl bg-slate-100 text-start"><img src={item.image} alt={item.caption || ''} className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105" />{item.caption ? <span className="block px-3 py-3 text-sm text-slate-600">{item.caption}</span> : null}</button>)}</div>{current ? <div role="dialog" aria-modal="true" aria-label={current.caption || 'Gallery image'} className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4" onClick={() => setActive(null)}><div className="relative max-h-[92vh] max-w-6xl" onClick={(e) => e.stopPropagation()}><img src={current.image} alt={current.caption || ''} className="max-h-[82vh] max-w-full rounded-xl object-contain" />{current.caption ? <p className="mt-3 text-center text-sm text-white/80">{current.caption}</p> : null}<button type="button" onClick={() => setActive(null)} className="absolute -end-2 -top-12 rounded-full bg-white p-2 text-slate-900" aria-label="Close lightbox"><X className="h-5 w-5" /></button>{images.length > 1 ? <><button type="button" onClick={() => setActive((active - 1 + images.length) % images.length)} className="absolute start-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-900" aria-label="Previous image"><ChevronLeft className="h-5 w-5" /></button><button type="button" onClick={() => setActive((active + 1) % images.length)} className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-900" aria-label="Next image"><ChevronRight className="h-5 w-5" /></button></> : null}</div></div> : null}</section>;
}

function embedUrl(url = '') {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace(/^www\./, '');
        if (host === 'youtu.be') return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
        if (host === 'youtube.com') {
            if (parsed.pathname.startsWith('/embed/')) return url;
            const id = parsed.searchParams.get('v');
            return id ? `https://www.youtube.com/embed/${id}` : '';
        }
        if (host === 'vimeo.com') return `https://player.vimeo.com/video/${parsed.pathname.split('/').filter(Boolean)[0] || ''}`;
        if (host === 'player.vimeo.com') return url;
    } catch { return ''; }
    return '';
}

function VideoBlock({ block }) {
    const src = embedUrl(block.url);
    if (!src) return null;
    return <section className="page-block"><div className="mb-4">{block.title ? <h2 className="text-2xl font-bold text-slate-950">{block.title}</h2> : null}{block.caption ? <p className="mt-2 text-sm leading-6 text-slate-600">{block.caption}</p> : null}</div><div className="aspect-video overflow-hidden rounded-2xl bg-black"><iframe src={src} title={block.title || 'Embedded video'} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div></section>;
}

function AccordionBlock({ block }) {
    const [open, setOpen] = useState(0);
    const items = block.items || [];
    if (!items.length) return null;
    return <section className="page-block space-y-3">{items.map((item, index) => <article key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white"><button type="button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start font-semibold text-slate-900"><span>{item.question}</span><span className="text-xl text-teal-700">{open === index ? '−' : '+'}</span></button>{open === index ? <div className="border-t border-slate-100 px-5 py-4 text-sm leading-7 text-slate-600">{item.answer}</div> : null}</article>)}</section>;
}

function CardsBlock({ block }) {
    const items = block.items || [];
    return <section className="page-block">{block.heading ? <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-950">{block.heading}</h2> : null}<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.map((item) => <article key={item.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">{item.image ? <img src={item.image} alt="" className="aspect-[16/9] w-full object-cover" /> : null}<div className="p-5">{!item.image && item.icon && cardIcons[item.icon] ? (() => { const Icon = cardIcons[item.icon]; return <div className="mb-4 inline-flex rounded-xl bg-teal-50 p-3 text-teal-700"><Icon className="h-6 w-6" /></div>; })() : null}<h3 className="text-lg font-bold text-slate-900">{item.title}</h3>{item.description ? <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p> : null}{item.url ? <div className="mt-4"><SmartLink href={item.url} className="text-sm font-bold text-teal-700">Learn more →</SmartLink></div> : null}</div></article>)}</div></section>;
}

function QuoteBlock({ block }) {
    if (!block.quote) return null;
    return <figure className="page-block rounded-3xl border-s-4 border-teal-600 bg-teal-50 px-6 py-8 sm:px-10"><blockquote className="text-2xl font-semibold leading-10 text-slate-900">“{block.quote}”</blockquote>{block.author ? <figcaption className="mt-4 text-sm font-bold text-teal-800">— {block.author}</figcaption> : null}</figure>;
}

export default function PageBlocks({ blocks = [] }) {
    if (!Array.isArray(blocks) || !blocks.length) return null;
    return <div className="page-blocks space-y-10">{blocks.map((block) => {
        if (block.type === 'carousel') return <CarouselBlock key={block.id} block={block} />;
        if (block.type === 'image_text') return <ImageTextBlock key={block.id} block={block} />;
        if (block.type === 'cta') return <CtaBlock key={block.id} block={block} />;
        if (block.type === 'gallery') return <GalleryBlock key={block.id} block={block} />;
        if (block.type === 'video') return <VideoBlock key={block.id} block={block} />;
        if (block.type === 'accordion') return <AccordionBlock key={block.id} block={block} />;
        if (block.type === 'cards') return <CardsBlock key={block.id} block={block} />;
        if (block.type === 'quote') return <QuoteBlock key={block.id} block={block} />;
        if (block.type === 'divider') return <div key={block.id} className={block.size === 'lg' ? 'py-10' : block.size === 'sm' ? 'py-3' : 'py-6'}><hr className="border-slate-200" /></div>;
        if (block.type === 'button') return <div key={block.id} className="page-block"><ActionLink href={block.url} target={block.target} secondary={block.style === 'secondary'}>{block.text}</ActionLink></div>;
        return null;
    })}</div>;
}
