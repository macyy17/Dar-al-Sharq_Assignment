export default function FormCard({ title, description, children, aside }) {
    return (
        <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_minmax(15rem,22rem)] lg:p-6">
            <div>
                <h2 className="text-base font-semibold text-slate-950">{title}</h2>
                {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
                <div className="mt-5">{children}</div>
            </div>
            {aside ? <aside className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{aside}</aside> : null}
        </section>
    );
}
