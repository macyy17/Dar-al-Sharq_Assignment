import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { useAuth, workspaceFor } from '../../auth/AuthContext';
import { apiErrorMessage } from '../../api/client';

export default function LoginPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (user) return <Navigate to={workspaceFor(user)} replace />;

    async function submit(event) {
        event.preventDefault();
        setSubmitting(true); setError('');
        try {
            const authenticated = await login(form);
            navigate(location.state?.from || workspaceFor(authenticated), { replace: true });
        } catch (requestError) {
            setError(apiErrorMessage(requestError, 'Unable to sign in.'));
        } finally { setSubmitting(false); }
    }

    return <main className="grid min-h-screen place-items-center bg-[#f6f7fa] px-5">
        <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-teal-700"><LockKeyhole className="h-6 w-6" /></div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Dar Al Sharq CMS</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Sign in</h1>
            <p className="mt-2 text-sm text-slate-500">Use your administrator or moderator account.</p>
            {error ? <div className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
            <label className="mt-6 block text-sm font-semibold text-slate-700">Email<input className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-teal-500" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label className="mt-4 block text-sm font-semibold text-slate-700">Password<input className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-teal-500" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
            <button disabled={submitting} className="mt-6 w-full rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{submitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
    </main>;
}
