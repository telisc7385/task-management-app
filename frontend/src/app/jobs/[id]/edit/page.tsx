'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { jobApi, resumeApi } from '@/lib/api';
import { JobFormData, ResumeFile } from '@/types';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string, 10);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [resumes, setResumes] = useState<ResumeFile[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<JobFormData>();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const [jobResponse, resumeResponse] = await Promise.all([
          jobApi.getById(id),
          resumeApi.list(),
        ]);
        const job = jobResponse.data.data!;
        setResumes(resumeResponse.data.data || []);
        reset({
          companyName: job.companyName,
          role: job.role,
          hrName: job.hrName,
          email: job.email,
          phone: job.phone || '',
          location: job.location || '',
          notes: job.notes || '',
          resumeFileName: job.resumeFileName || '',
        });
      } catch {
        setError('Job not found');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchJob();
  }, [id, reset]);

  const onSubmit = async (data: JobFormData) => {
    setError('');
    setLoading(true);
    try {
      await jobApi.update(id, data);
      router.push('/jobs');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Failed to update job.');
    } finally {
      setLoading(false);
    }
  };

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
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Edit Job</h1>
          <p className="text-sm text-slate-500 mt-1">Update job application details</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm border border-slate-200 rounded-2xl p-8 space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name *</label>
              <input type="text" {...register('companyName', { required: 'Required' })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400" />
              {errors.companyName && <p className="text-rose-500 text-xs mt-1">{errors.companyName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Role *</label>
              <input type="text" {...register('role', { required: 'Required' })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400" />
              {errors.role && <p className="text-rose-500 text-xs mt-1">{errors.role.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">HR Name *</label>
              <input type="text" {...register('hrName', { required: 'Required' })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400" />
              {errors.hrName && <p className="text-rose-500 text-xs mt-1">{errors.hrName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
              <input type="email" {...register('email', { required: 'Required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400" />
              {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input type="text" {...register('phone')}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
              <input type="text" {...register('location')}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Resume</label>
            <select {...register('resumeFileName')}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all text-slate-900">
              <option value="">None (no resume)</option>
              {resumes.map((r) => (
                <option key={r.filename} value={r.filename}>{r.filename}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
            <textarea {...register('notes')} rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.back()}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
            <button type="submit" disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Updating...' : 'Update Job'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
