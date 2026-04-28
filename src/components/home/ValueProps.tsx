import { Sparkles, ShieldCheck, Trophy } from 'lucide-react';
import { Section } from '../ui/Section';

const items = [
  { icon: Sparkles,    title: 'AI study companion',     desc: 'Summaries, quizzes, and explanations generated from each lesson — on demand.' },
  { icon: ShieldCheck, title: 'Verified instructors',   desc: 'Every instructor is reviewed by our team so you learn from people who actually do the work.' },
  { icon: Trophy,      title: 'Certificates that count', desc: 'Earn shareable certificates and showcase what you’ve built, not just what you watched.' },
];

export default function ValueProps() {
  return (
    <Section
      tone="muted"
      eyebrow="Why EduNova"
      title="Built for how people actually learn"
      description="Less passive watching, more active learning. EduNova combines great content with tools that adapt to you."
    >
      <div className="grid md:grid-cols-3 gap-6">
        {items.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl bg-white border border-gray-100 p-6 transition-shadow duration-200 hover:shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 grid place-items-center mb-4">
              <Icon size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}