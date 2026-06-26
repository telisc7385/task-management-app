'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { templateApi } from '@/lib/api';
import { EmailTemplate, WhatsappTemplate } from '@/types';

export default function TemplatesPage() {
  const router = useRouter();
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate>({ subject: '', body: '' });
  const [whatsappTemplate, setWhatsappTemplate] = useState<WhatsappTemplate>({ body: '' });
  const [emailLoading, setEmailLoading] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [emailMessage, setEmailMessage] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const [emailRes, whatsappRes] = await Promise.all([
          templateApi.getEmail(),
          templateApi.getWhatsapp(),
        ]);
        if (emailRes.data.data) setEmailTemplate(emailRes.data.data);
        if (whatsappRes.data.data) setWhatsappTemplate(whatsappRes.data.data);
      } catch {
        setError('Failed to load templates');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleSaveEmail = async () => {
    setEmailLoading(true);
    setEmailMessage('');
    try {
      await templateApi.updateEmail(emailTemplate);
      setEmailMessage('Email template saved successfully');
    } catch {
      setEmailMessage('Failed to save email template');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleSaveWhatsapp = async () => {
    setWhatsappLoading(true);
    setWhatsappMessage('');
    try {
      await templateApi.updateWhatsapp(whatsappTemplate);
      setWhatsappMessage('WhatsApp template saved successfully');
    } catch {
      setWhatsappMessage('Failed to save WhatsApp template');
    } finally {
      setWhatsappLoading(false);
    }
  };

  const insertPlaceholder = (type: 'email-subject' | 'email-body' | 'whatsapp-body', placeholder: string) => {
    if (type === 'email-subject') {
      setEmailTemplate((prev) => ({ ...prev, subject: prev.subject + placeholder }));
    } else if (type === 'email-body') {
      setEmailTemplate((prev) => ({ ...prev, body: prev.body + placeholder }));
    } else {
      setWhatsappTemplate((prev) => ({ ...prev, body: prev.body + placeholder }));
    }
  };

  const PlaceholderBtn = ({ type, label }: { type: string; label: string }) => (
    <button
      type="button"
      onClick={() => insertPlaceholder(type as any, label)}
      className="px-2 py-1 text-xs font-mono bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
    >
      {label}
    </button>
  );

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-emerald-600"></div>
      </div>
    );
  }

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
          <p className="text-sm text-slate-500 mt-1">Edit email and WhatsApp message templates</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        {/* Email Template */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Email Template</h2>
          <p className="text-sm text-slate-500 mb-4">Use placeholders to personalize emails. They will be replaced when sending.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
              <div className="flex gap-2 mb-2">
                <span className="text-xs text-slate-400 self-center">Insert:</span>
                <PlaceholderBtn type="email-subject" label="{company}" />
                <PlaceholderBtn type="email-subject" label="{role}" />
                <PlaceholderBtn type="email-subject" label="{hrName}" />
              </div>
              <input
                type="text"
                value={emailTemplate.subject}
                onChange={(e) => setEmailTemplate((prev) => ({ ...prev, subject: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all text-slate-900"
                placeholder="Application for {role} - Suchit Teli"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Body</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                <span className="text-xs text-slate-400 self-center">Insert:</span>
                <PlaceholderBtn type="email-body" label="{company}" />
                <PlaceholderBtn type="email-body" label="{role}" />
                <PlaceholderBtn type="email-body" label="{hrName}" />
              </div>
              <textarea
                value={emailTemplate.body}
                onChange={(e) => setEmailTemplate((prev) => ({ ...prev, body: e.target.value }))}
                rows={10}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all text-slate-900 font-mono text-sm resize-none"
                placeholder="Dear {hrName},..."
              />
            </div>
            {emailMessage && (
              <div className={`text-sm ${emailMessage.includes('success') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {emailMessage}
              </div>
            )}
            <button
              onClick={handleSaveEmail}
              disabled={emailLoading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {emailLoading ? 'Saving...' : 'Save Email Template'}
            </button>
          </div>
        </div>

        {/* WhatsApp Template */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">WhatsApp Template</h2>
          <p className="text-sm text-slate-500 mb-4">
            This template is used when opening WhatsApp. The message will be pre-filled via wa.me link.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Message Body</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                <span className="text-xs text-slate-400 self-center">Insert:</span>
                <PlaceholderBtn type="whatsapp-body" label="{company}" />
                <PlaceholderBtn type="whatsapp-body" label="{role}" />
                <PlaceholderBtn type="whatsapp-body" label="{hrName}" />
              </div>
              <textarea
                value={whatsappTemplate.body}
                onChange={(e) => setWhatsappTemplate((prev) => ({ ...prev, body: e.target.value }))}
                rows={6}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all text-slate-900 font-mono text-sm resize-none"
                placeholder="Hi {hrName},..."
              />
            </div>
            {whatsappMessage && (
              <div className={`text-sm ${whatsappMessage.includes('success') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {whatsappMessage}
              </div>
            )}
            <button
              onClick={handleSaveWhatsapp}
              disabled={whatsappLoading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {whatsappLoading ? 'Saving...' : 'Save WhatsApp Template'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
