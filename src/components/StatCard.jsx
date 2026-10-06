export default function StatCard({ title, value, icon, note }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-start space-x-4">
      {/* Kontainer Ikon */}
      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shrink-0 flex items-center justify-center">
        {icon}
      </div>

      {/* Kontainer Teks & Informasi */}
      <div className="space-y-0.5 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          {value}
        </h2>
        {note && (
          <small className="block text-xs font-medium text-gray-500 pt-0.5">
            {note}
          </small>
        )}
      </div>
    </div>
  );
}