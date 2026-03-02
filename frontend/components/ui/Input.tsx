interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
      <input 
        className={`w-full px-4 py-2 border rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${error ? 'border-red-500' : 'border-slate-200'} ${className}`}
        {...props} 
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};