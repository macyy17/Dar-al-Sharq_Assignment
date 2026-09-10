export default function PageHeader({ eyebrow, title, description, actions }) {
    return (
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
                {eyebrow ? <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">{eyebrow}</p> : null}
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
                {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </header>
    );
}
