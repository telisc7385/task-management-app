'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { jobApi, emailApi, resumeApi, jobApi as jobApiUpdate } from '@/lib/api';
import { Job, JobStats, ImportResult, ResumeFile } from '@/types';

export default function JobsDashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [emailFilter, setEmailFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [sendingEmail, setSendingEmail] = useState<number | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showResumeManager, setShowResumeManager] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeJobId, setResumeJobId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await jobApi.getAll({
        search: debouncedSearch || undefined,
        emailStatus: emailFilter,
        page,
        limit: 50,
      });
      setJobs(response.data.data || []);
      if (response.data.meta) {
        setTotalPages(response.data.meta.totalPages);
        setTotal(response.data.meta.total);
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Failed to fetch jobs.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, emailFilter, page]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await jobApi.getStats();
      setStats(response.data.data || null);
    } catch { /* ignore */ }
  }, []);

  const fetchResumes = useCallback(async () => {
    try {
      const response = await resumeApi.list();
      setResumes(response.data.data || []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);
  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchResumes(); }, [fetchResumes]);
  useEffect(() => { setPage(1); }, [debouncedSearch, emailFilter]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), 400);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await jobApi.delete(deleteId);
      setDeleteId(null);
      fetchJobs();
      fetchStats();
    } catch {
      setError('Failed to delete job.');
    }
  };

  const handleSendEmail = async (jobId: number) => {
    setSendingEmail(jobId);
    try {
      const response = await emailApi.send(jobId);
      const result = response.data.data;
      if (!result?.success) setError(result?.message || 'Failed to send email');
      fetchJobs();
      fetchStats();
    } catch {
      setError('Failed to send email.');
      fetchJobs();
      fetchStats();
    } finally {
      setSendingEmail(null);
    }
  };

  const handleOpenWhatsapp = (job: Job) => {
    if (!job.phone) { setError('No phone number available'); return; }
    const templateBody = `Hi ${job.hrName},\n\nI am interested in the ${job.role} position at ${job.companyName}.`;
    window.open(`https://wa.me/${job.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(templateBody)}`, '_blank');
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const response = await jobApi.importCsv(file);
      setImportResult(response.data.data || { imported: 0, skipped: 0 });
      fetchJobs();
      fetchStats();
    } catch { setError('Failed to import CSV.'); }
    if (csvInputRef.current) csvInputRef.current.value = '';
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { setError('Only PDF files allowed'); return; }
    setUploading(true);
    try {
      await resumeApi.upload(file);
      fetchResumes();
    } catch { setError('Failed to upload resume.'); }
    finally { setUploading(false); }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteResume = async (filename: string) => {
    try {
      await resumeApi.delete(filename);
      fetchResumes();
    } catch { setError('Failed to delete resume.'); }
  };

  const handleSelectResume = async (jobId: number, filename: string) => {
    try {
      await jobApiUpdate.update(jobId, { resumeFileName: filename });
      setResumeJobId(null);
      fetchJobs();
    } catch { setError('Failed to update resume selection.'); }
  };

  const emailStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
      Sent: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
      Failed: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    };
    return colors[status] || colors.Pending;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-800">JobFlow</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/dashboard')} className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Task Manager</button>
              <button onClick={() => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminEmail'); router.push('/admin/login'); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Job Applications</h1>
            <p className="text-sm text-slate-500 mt-1">Manage and send job applications</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => router.push('/jobs/create')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Add Job
            </button>
            <button onClick={() => csvInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Import CSV
            </button>
            <input ref={csvInputRef} type="file" accept=".csv" className="hidden" onChange={handleCsvImport} />
            <button onClick={() => { fetchResumes(); setShowResumeManager(true); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              Resumes ({resumes.length})
            </button>
            <button onClick={() => router.push('/jobs/templates')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Templates
            </button>
          </div>
        </div>

        {importResult && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
            <span>Imported: {importResult.imported} &middot; Skipped: {importResult.skipped}</span>
            <button onClick={() => setImportResult(null)} className="text-emerald-500 hover:text-emerald-700">&times;</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Jobs', value: stats?.total, color: 'text-slate-900' },
            { label: 'Pending Emails', value: stats?.pending, color: 'text-amber-600' },
            { label: 'Sent', value: stats?.sent, color: 'text-emerald-600' },
            { label: 'Failed', value: stats?.failed, color: 'text-rose-600' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${item.color}`}>{item.value ?? '-'}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search by company or role..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-slate-900 placeholder-slate-400" />
          </div>
          <select value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-slate-700">
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Sent">Sent</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-6">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="flex-1">{error}</span>
            <button onClick={() => setError('')} className="text-rose-500 hover:text-rose-700">&times;</button>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-emerald-600"></div></div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">No jobs yet</h3>
            <p className="mt-1 text-sm text-slate-500">Add a job or import a CSV to get started.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Company</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Role</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">HR Name</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600 hidden lg:table-cell">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Email Status</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">Resume</th>
                      <th className="text-right px-4 py-3 font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900">{job.companyName}</td>
                        <td className="px-4 py-3 text-slate-600">{job.role}</td>
                        <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{job.hrName}</td>
                        <td className="px-4 py-3 text-slate-600 hidden lg:table-cell truncate max-w-[180px]">{job.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${emailStatusBadge(job.emailStatus)}`}>{job.emailStatus}</span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <button
                            onClick={() => { fetchResumes(); setResumeJobId(job.id); }}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                              job.resumeFileName
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-50 text-slate-400 ring-1 ring-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            {job.resumeFileName ? job.resumeFileName.replace(/-\d+-\d+\.pdf$/, '.pdf') : 'Select'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => router.push(`/jobs/${job.id}/edit`)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={() => setDeleteId(job.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                            <button onClick={() => handleSendEmail(job.id)} disabled={sendingEmail === job.id}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50" title="Send Email">
                              {sendingEmail === job.id ? (
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                              )}
                            </button>
                            <button onClick={() => handleOpenWhatsapp(job)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Open WhatsApp">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 bg-white rounded-xl border border-slate-200 px-4 py-3">
                <p className="text-sm text-slate-500">Page {page} of {totalPages} ({total} jobs)</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                    className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                    className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Resume Manager Modal */}
      {showResumeManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowResumeManager(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Resume Manager</h2>
              <button onClick={() => setShowResumeManager(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Upload New Resume</label>
                <div className="flex gap-2">
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50">
                    {uploading ? 'Uploading...' : 'Choose PDF'}
                  </button>
                  <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} />
                </div>
              </div>
              <div className="space-y-2">
                {resumes.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">No resumes uploaded yet.</p>
                ) : (
                  resumes.map((r) => (
                    <div key={r.filename} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-slate-700 truncate">{r.filename}</span>
                        <span className="text-xs text-slate-400">({(r.size / 1024).toFixed(0)} KB)</span>
                      </div>
                      <button onClick={() => handleDeleteResume(r.filename)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Selector Modal */}
      {resumeJobId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setResumeJobId(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Resume</h3>
            {resumes.length === 0 ? (
              <p className="text-sm text-slate-500 mb-4">No resumes available. Upload one first.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                <button
                  onClick={() => handleSelectResume(resumeJobId, '')}
                  className="w-full text-left px-3 py-2 text-sm text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  None (no resume)
                </button>
                {resumes.map((r) => (
                  <button
                    key={r.filename}
                    onClick={() => handleSelectResume(resumeJobId, r.filename)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 bg-slate-50 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors truncate"
                  >
                    {r.filename}
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setResumeJobId(null)}
              className="w-full px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
          </div>
        </div>
      )}

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
                <h3 className="text-lg font-semibold text-slate-900">Delete Job</h3>
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
