import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import api, { apiErrorMessage } from '../../api/client';
import PageHeader from '../../components/workspace/PageHeader';
import FormCard from '../../components/workspace/FormCard';

const input='mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100';
export default function PrivilegeFormPage() {
    const { id }=useParams(); const editing=Boolean(id); const navigate=useNavigate(); const [form,setForm]=useState({name:'',group:'',description:''}); const [error,setError]=useState('');
    useEffect(()=>{ if(editing) api.get(`/privileges/${id}`).then(({data})=>setForm({name:data.data.name,group:data.data.group||'',description:data.data.description||''})).catch((e)=>setError(apiErrorMessage(e)));},[id]);
    async function submit(e){e.preventDefault();setError('');try{editing?await api.patch(`/privileges/${id}`,form):await api.post('/privileges',form);navigate('/admin/privileges');}catch(err){setError(apiErrorMessage(err,'Unable to save privilege.'));}}
    return <form onSubmit={submit} className="space-y-6"><PageHeader eyebrow="Access control" title={editing?'Edit privilege':'Add privilege'} description="Define a small, explicit capability that can be attached to roles." actions={<><Link to="/admin/privileges" className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold">Cancel</Link><button className="inline-flex h-10 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"><Save className="h-4 w-4" />Save privilege</button></>} />{error?<div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>:null}<FormCard title="Privilege details" description="Use stable resource.action capability names." aside="Example: pages.update or users.create."><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Name<input required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className={input} placeholder="pages.publish" /></label><label className="text-sm font-semibold">Group<input value={form.group} onChange={(e)=>setForm({...form,group:e.target.value})} className={input} placeholder="Pages" /></label><label className="text-sm font-semibold sm:col-span-2">Description<textarea value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} rows="4" className={`${input} font-normal`} /></label></div></FormCard></form>;
}
