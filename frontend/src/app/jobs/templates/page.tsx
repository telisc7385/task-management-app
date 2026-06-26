'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { templateApi } from '@/lib/api';
import { EmailTemplate, WhatsappTemplate } from '@/types';

type Tab = 'email' | 'whatsapp';
type EditorMode = 'list' | 'create' | 'edit';

export default function TemplatesPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('email');
  const [mode, setMode] = useState<EditorMode>('list');
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsappTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editId, setEditId] = useState<number | null>(null);
  const [formName, setFormName] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formBody, setFormBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const [emailRes, whatsappRes] = await Promise.all([
        templateApi.listEmail(),
        templateApi.listWhatsapp(),
      ]);
      setEmailTemplates(emailRes.data.data || []);
      setWhatsappTemplates(whatsappRes.data.data || []);
    } catch {
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTemplates(); }, []);

  const resetForm = () => {
    setFormName('');
    setFormSubject('');
    setFormBody('');
    setEditId(null);
    setMessage('');
  };

  const handleCreate = () => {
    resetForm();
    setMode('create');
  };

  const handleEdit = async (id: number) => {
    setMessage('');
    setError('');
    try {
      if (tab === 'email') {
        const res = await templateApi.getEmail(id);
        const t = res.data.data!;
        setFormName(t.name);
        setFormSubject(t.subject);
        setFormBody(t.body);
      } else {
        const res = await templateApi.getWhatsapp(id);
        const t = res.data.data!;
        setFormName(t.name);
        setFormBody(t.body);
        setFormSubject('');
      }
      setEditId(id);
      setMode('edit');
    } catch {
      setError('Failed to load template');
    }
  };

  const handleSave = async () => {
    if (!formName.trim()) { setMessage('Name is required'); return; }
    setSaving(true);
    setMessage('');
    try {
      if (tab === 'email') {
        if (!formSubject.trim()) { setMessage('Subject is required'); setSaving(false); return; }
        if (!formBody.trim()) { setMessage('Body is required'); setSaving(false); return; }
        if (mode === 'create') {
          await templateApi.createEmail({ name: formName, subject: formSubject, body: formBody });
        } else if (editId) {
          await templateApi.updateEmail(editId, { name: formName, subject: formSubject, body: formBody });
        }
      } else {
        if (!formBody.trim()) { setMessage('Body is required'); setSaving(false); return; }
        if (mode === 'create') {
          await templateApi.createWhatsapp({ name: formName, body: formBody });
        } else if (editId) {
          await templateApi.updateWhatsapp(editId, { name: formName, body: formBody });
        }
      }
      setMessage('Template saved successfully');
      setMode('list');
      fetchTemplates();
    } catch {
      setMessage('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      if (tab === 'email') {
        await templateApi.deleteEmail(deleteId);
      } else {
        await templateApi.deleteWhatsapp(deleteId);
      }
      setDeleteId(null);
      fetchTemplates();
    } catch {
      setError('Failed to delete template');
    }
  };

  const insertPlaceholder = (field: 'subject' | 'body', placeholder: string) => {
    if (field === 'subject') setFormSubject((prev) => prev + placeholder);
    else setFormBody((prev) => prev + placeholder);
  };

  const PlaceholderBtn = ({ field, label }: { field: 'subject' | 'body'; label: string }) => (
    <button
      type="button"
      onClick={() => insertPlaceholder(field, label)}
      className="px-2 py-1 text-xs font-mono bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
    >
      {label}
    </button>
  );

  const templates = tab === 'email' ? emailTemplates : whatsappTemplates;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <button onClick={() => router.push('/jobs')} className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">
              &larr; Back to Jobs
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
          <p className="text-sm text-slate-500 mt-1">Manage email and WhatsApp message templates</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm mb-6">{error}</div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
          <button
            onClick={() => { setTab('email'); setMode('list'); resetForm(); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'email' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Email Templates
          </button>
          <button
            onClick={() => { setTab('whatsapp'); setMode('list'); resetForm(); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'whatsapp' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            WhatsApp Templates
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-emerald-600"></div></div>
        ) : mode === 'list' ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">{templates.length} template{templates.length !== 1 ? 's' : ''}</p>
              <button onClick={handleCreate}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                New Template
              </button>
            </div>
            {templates.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">No {tab} templates yet</h3>
                <p className="mt-1 text-sm text-slate-500">Create your first template to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map((t) => (
                  <div key={t.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900 truncate">{t.name}</p>
                      {tab === 'email' && (t as EmailTemplate).subject && (
                        <p className="text-sm text-slate-500 truncate mt-0.5">{(t as EmailTemplate).subject}</p>
                      )}
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {t.body.substring(0, 120)}{t.body.length > 120 ? '...' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => handleEdit(t.id!)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => setDeleteId(t.id!)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Create / Edit Form */
          <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                {mode === 'create' ? `New ${tab === 'email' ? 'Email' : 'WhatsApp'} Template` : 'Edit Template'}
              </h2>
              <button onClick={() => { setMode('list'); resetForm(); }} className="text-sm text-slate-400 hover:text-slate-600">&larr; Back</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Template Name</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all text-slate-900"
                  placeholder="e.g. Frontend Developer, Backend Engineer" />
              </div>

              {tab === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs text-slate-400 self-center">Insert:</span>
                    <PlaceholderBtn field="subject" label="{company}" />
                    <PlaceholderBtn field="subject" label="{role}" />
                    <PlaceholderBtn field="subject" label="{hrName}" />
                  </div>
                  <input type="text" value={formSubject} onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all text-slate-900"
                    placeholder="Application for {role} – Suchit Teli" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Body</label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  <span className="text-xs text-slate-400 self-center">Insert:</span>
                  <PlaceholderBtn field="body" label="{company}" />
                  <PlaceholderBtn field="body" label="{role}" />
                  <PlaceholderBtn field="body" label="{hrName}" />
                </div>
                <textarea value={formBody} onChange={(e) => setFormBody(e.target.value)} rows={tab === 'email' ? 10 : 6}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all text-slate-900 font-mono text-sm resize-none"
                  placeholder={tab === 'email' ? 'Dear {hrName},...' : 'Hi {hrName},...'} />
              </div>

              {message && (
                <div className={`text-sm ${message.includes('success') ? 'text-emerald-600' : 'text-rose-600'}`}>{message}</div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setMode('list'); resetForm(); }}
                  className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : mode === 'create' ? 'Create Template' : 'Update Template'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteId(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Delete Template</h3>
                <p className="text-sm text-slate-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
