const stats = [
  { value: '10k+', label: 'Active students' },
  { value: '500+', label: 'Expert-led courses' },
  { value: '120+', label: 'Verified instructors' },
  { value: '4.9★', label: 'Average rating' },
];

export default function StatsStrip() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-sm">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white px-6 py-6 sm:py-8 text-center"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F1115]">
                {s.value}
              </div>
              <div className="mt-1 text-xs sm:text-sm text-gray-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}