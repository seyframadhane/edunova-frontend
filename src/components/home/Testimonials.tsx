import { memo, useEffect, useRef, useState } from 'react';
import { testimonialService } from '../../services/testimonial.service';
import { Section } from '../ui/Section';

interface TestimonialCardData {
  _id?: string;
  image: string;
  name: string;
  handle: string;
  content: string;
  createdAt?: string;
}

const FALLBACK_TESTIMONIALS: TestimonialCardData[] = [
  {
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
    name: 'Amelia Carter',
    handle: '@amelia.codes',
    content:
      'EduNova made switching careers feel doable. The AI tutor explained concepts in ways my old textbooks never could.',
    createdAt: '2025-09-12',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    name: 'Daniel Okafor',
    handle: '@danokafor',
    content:
      'I shipped my first React app two months after starting here. The hands-on projects are gold.',
    createdAt: '2025-08-21',
  },
  {
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    name: 'Priya Raman',
    handle: '@priya.designs',
    content:
      'The design tracks are taught by people who actually ship products. Real briefs, real critiques.',
    createdAt: '2025-10-04',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/12.jpg',
    name: 'Marcus Hill',
    handle: '@marcusbuilds',
    content:
      'I tried three other platforms before this. EduNova is the first one I actually finished a course on.',
    createdAt: '2025-07-30',
  },
  {
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
    name: 'Sofia Alvarez',
    handle: '@sofialvz',
    content:
      'The certificates are taken seriously by recruiters in my city. Two interviews in three weeks.',
    createdAt: '2025-11-02',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/78.jpg',
    name: 'Ravi Sharma',
    handle: '@ravidev',
    content:
      'Quizzes after every lesson keep me honest. I retain way more than just watching videos.',
    createdAt: '2025-06-18',
  },
  {
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    name: 'Hannah Lee',
    handle: '@hannah.learns',
    content:
      'The instructor responses in Q&A are fast and thoughtful. It feels like a real classroom.',
    createdAt: '2025-09-25',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/33.jpg',
    name: 'Tomás Becker',
    handle: '@tomasbecker',
    content:
      'Best part: the curated learning paths. No more wondering what to study next.',
    createdAt: '2025-10-15',
  },
  {
    image: 'https://randomuser.me/api/portraits/women/22.jpg',
    name: 'Yuki Tanaka',
    handle: '@yukitanaka',
    content:
      'I’m a working parent with limited time. Bite-sized lessons made consistent progress possible.',
    createdAt: '2025-08-09',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/65.jpg',
    name: 'Adewale Bakare',
    handle: '@adewale.b',
    content:
      'Got promoted within six months of finishing the data track. Worth every minute.',
    createdAt: '2025-11-20',
  },
  {
    image: 'https://randomuser.me/api/portraits/women/55.jpg',
    name: 'Clara Dubois',
    handle: '@claradubois',
    content:
      'Instructors who actually update their courses. The marketing track had a fresh module on AI tools last month.',
    createdAt: '2025-10-30',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/91.jpg',
    name: 'Kenji Watanabe',
    handle: '@kenjiw',
    content:
      'The community is small but high-signal. Pair-programming sessions changed how I learn.',
    createdAt: '2025-07-11',
  },
];

const TestimonialCard = memo(({ card }: { card: TestimonialCardData }) => (
  <div className="p-4 rounded-lg mx-4 shadow w-72 shrink-0 bg-white border border-gray-100">
    <div className="flex gap-2">
      <img
        className="size-11 rounded-full object-cover"
        src={card.image}
        alt={card.name}
        width={44}
        height={44}
        loading="lazy"
        decoding="async"
      />
      <div className="flex flex-col">
        <p className="font-semibold text-sm">{card.name}</p>
        <span className="text-xs text-slate-500">{card.handle}</span>
      </div>
    </div>
    <p className="text-sm py-4 text-gray-800 line-clamp-4">{card.content}</p>
    <div className="flex items-center justify-between text-slate-500 text-xs">
      <span>Posted on</span>
      <p>
        {card.createdAt ? new Date(card.createdAt).toLocaleDateString() : ''}
      </p>
    </div>
  </div>
));
TestimonialCard.displayName = 'TestimonialCard';

function Testimonials() {
  const [apiCards, setApiCards] = useState<TestimonialCardData[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    testimonialService
      .list()
      .then(({ data }) => setApiCards(data.data ?? []))
      .catch(console.error);
  }, []);

  // Pause marquee whenever the section is offscreen
  useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      { rootMargin: '200px' },
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // Always merge API + curated fallback so the marquee stays full
  const cards = [...apiCards, ...FALLBACK_TESTIMONIALS];

  // Stagger row 2 so it doesn't visually duplicate row 1
  const row1 = [...cards, ...cards];
  const row2 = [...cards.slice(Math.floor(cards.length / 2)), ...cards];
  const row2Doubled = [...row2, ...row2];

  const rowState = running ? 'is-running' : 'is-paused';

  return (
    <Section
      eyebrow="Testimonials"
      title="What our students say"
      description="Real words from learners building real skills on EduNova."
    >
      <div ref={sectionRef}>
        {cards.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No testimonials yet.
          </div>
        ) : (
          <>
            <div
              className={`marquee-row ${rowState} relative w-full overflow-hidden mb-6`}
            >
              <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
              <div className="marquee-inner flex min-w-[200%] py-2">
                {row1.map((card, index) => (
                  <TestimonialCard key={`row1-${index}`} card={card} />
                ))}
              </div>
              <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
            </div>

            <div
              className={`marquee-row ${rowState} relative w-full overflow-hidden`}
            >
              <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
              <div className="marquee-inner marquee-reverse flex min-w-[200%] py-2">
                {row2Doubled.map((card, index) => (
                  <TestimonialCard key={`row2-${index}`} card={card} />
                ))}
              </div>
              <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
            </div>
          </>
        )}
      </div>
    </Section>
  );
}

export default Testimonials;