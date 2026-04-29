import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  Camera,
  Code2,
  LineChart,
  Megaphone,
  Palette,
} from 'lucide-react';
import { Section } from '../ui/Section';

const categories = [
  { name: 'Development', icon: Code2 },
  { name: 'Design', icon: Palette },
  { name: 'Business', icon: LineChart },
  { name: 'Marketing', icon: Megaphone },
  { name: 'Photography', icon: Camera },
  { name: 'AI & Data', icon: BrainCircuit },
];

export default function CategoryStrip() {
  return (
    <Section
      eyebrow="Categories"
      title="Explore learning paths"
      description="Choose a topic and start learning with carefully selected courses."
      className="bg-[#F8FAFC]"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {categories.map(({ name, icon: Icon }) => (
          <Link
            key={name}
            to={`/courses?category=${encodeURIComponent(name)}`}
            className="group rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-100 hover:shadow-xl hover:shadow-purple-100/60"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 transition group-hover:scale-105 group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:text-white">
              <Icon className="h-7 w-7" />
            </div>

            <h3 className="text-base font-black text-slate-950">{name}</h3>

            <p className="mt-2 text-sm font-semibold text-slate-500 transition group-hover:text-purple-700">
              Explore →
            </p>
          </Link>
        ))}
      </div>
    </Section>
  );
}