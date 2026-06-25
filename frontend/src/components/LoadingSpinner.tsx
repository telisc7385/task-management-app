export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

  return (
    <div className="flex justify-center items-center py-8">
      <div
        className={`animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600 ${sizeClasses[size]}`}
      ></div>
    </div>
  );
}
