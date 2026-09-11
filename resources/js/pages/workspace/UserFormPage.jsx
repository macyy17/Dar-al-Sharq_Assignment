import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import api, { apiErrorMessage } from '../../api/client';
import PageHeader from '../../components/workspace/PageHeader';
import FormCard from '../../components/workspace/FormCard';

const input = 'mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100';

export default function UserFormPage() {
    const { id } = useParams();
    const editing = Boolean(id);
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', password: '', role_id: '', is_active: true });
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        Promise.all([api.get('/roles'), editing ? api.get(`/users/${id}`) : Promise.resolve(null)]).then(([rolesResponse, userResponse]) => {
            setRoles(rolesResponse.data.data);
            if (userResponse) {
                const user = userResponse.data.data;
                setForm({ name: user.name, email: user.email, password: '', role_id: String(user.role?.id || ''), is_active: user.is_active });
            } else if (rolesResponse.data.data[0]) setForm((f) => ({ ...f, role_id: String(rolesResponse.data.data[0].id) }));
        }).catch((e) => setError(apiErrorMessage(e, 'Unable to load form data.')));
    }, [id]);

    async function submit(event) {
        event.preventDefault(); setSubmitting(true); setError(''); setErrors({});
        const payload = { ...form, role_id: Number(form.role_id), is_active: Boolean(form.is_active) };
        if (editing && !payload.password) delete payload.password;
        try { editing ? await api.patch(`/users/${id}`, payload) : await api.post('/users', payload); navigate('/admin/users'); }
        catch (e) { setErrors(e?.response?.data?.errors || {}); setError(apiErrorMessage(e, 'Unable to save user.')); }
        finally { setSubmitting(false); }
    }

    return <form onSubmit={submit} className="space-y-6"><PageHeader eyebrow="Access control" title={editing ? 'Edit user' : 'Add user'} description="Configure identity, role assignment and account status." actions={<><Link to="/admin/users" className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">Cancel</Link><button disabled={submitting} className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white disabled:opacity-60"><Save className="h-4 w-4" />{submitting ? 'Saving…' : 'Save user'}</button></>} />{error ? <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}<FormCard title="User account" description="Account details used for authentication and authorization." aside="Permissions are resolved from the selected role's privilege records."><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />{errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name[0]}</p> : null}</label><label className="text-sm font-semibold text-slate-700">Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />{errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email[0]}</p> : null}</label><label className="text-sm font-semibold text-slate-700">Role<select required value={form.role_id} onChange={(e) => setForm({ ...form, role_id: e.target.value })} className={input}>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label><label className="text-sm font-semibold text-slate-700">Status<select value={form.is_active ? '1' : '0'} onChange={(e) => setForm({ ...form, is_active: e.target.value === '1' })} className={input}><option value="1">Active</option><option value="0">Suspended</option></select></label><label className="text-sm font-semibold text-slate-700 sm:col-span-2">{editing ? 'New password (optional)' : 'Temporary password'}<input required={!editing} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={input} />{errors.password ? <p className="mt-1 text-xs text-rose-600">{errors.password[0]}</p> : null}</label></div></FormCard></form>;
}
