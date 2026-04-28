import { Link } from 'react-router-dom';
import { Code2, Palette, LineChart, Megaphone, Camera, BrainCircuit } from 'lucide-react';
import { Section } from '../ui/Section';

const categories = [
  { name: 'Development', icon: Code2, color: 'from-indigo-500 to-violet-500' },
  { name: 'Design', icon: Palette, color: 'from-pink-500 to-rose-500' },
  { name: 'Business', icon: LineChart, color: 'from-emerald-500 to-teal-500' },
  { name: 'Marketing', icon: Megaphone, color: 'from-amber-500 to-orange-500' },
  { name: 'Photography', icon: Camera, color: 'from-sky-500 to-blue-500' },
  { name: 'AI & Data', icon: BrainCircuit, color: 'from-fuchsia-500 to-purple-500' },
];

export default function CategoryStrip() {
  return (
    <Section
      eyebrow="Browse by topic"
      title="Find what you want to learn next"
      description="Hand-picked categories to help you start where you are and grow where you want to be."
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(({ name, icon: Icon, color }) => (
          <Link
            key={name}
            to={`/courses?category=${encodeURIComponent(name)}`}
            className="group relative rounded-2xl border border-gray-100 bg-white p-5 transition-[box-shadow,border-color] duration-200 hover:border-gray-200 hover:shadow-md"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} text-white grid place-items-center mb-3 shadow-sm`}>
              <Icon size={18} />
            </div>
            <div className="text-sm font-semibold text-gray-900">{name}</div>
            <div className="mt-0.5 text-xs text-gray-500 transition-colors group-hover:text-violet-600">
              Explore →
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}