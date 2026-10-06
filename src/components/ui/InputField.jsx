export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
  children, // Untuk nampung tombol atau ikon di dalam input (seperti toggle password)
}) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 ${
            children ? "pr-10" : ""
          }`}
        />
        {children}
      </div>
    </div>
  );
}