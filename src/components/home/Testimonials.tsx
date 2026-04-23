import { useEffect, useState } from 'react';
import { testimonialService } from '../../services/testimonial.service';

interface TestimonialCardData {
    _id?: string;
    image: string;
    name: string;
    handle: string;
    content: string;
    createdAt?: string;
}

const TestimonialCard = ({ card }: { card: TestimonialCardData }) => (
    <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 bg-white border border-gray-100">
        <div className="flex gap-2">
            <img className="size-11 rounded-full object-cover" src={card.image} alt="User" />
            <div className="flex flex-col">
                <p className="font-semibold text-sm">{card.name}</p>
                <span className="text-xs text-slate-500">{card.handle}</span>
            </div>
        </div>
        <p className="text-sm py-4 text-gray-800">{card.content}</p>
        <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Posted on</span>
            <p>{card.createdAt ? new Date(card.createdAt).toLocaleDateString() : ''}</p>
        </div>
    </div>
);

function Testimonials() {
    const [cards, setCards] = useState<TestimonialCardData[]>([]);

    useEffect(() => {
        testimonialService.list()
            .then(({ data }) => setCards(data.data))
            .catch(console.error);
    }, []);

    const doubledCards = cards.length ? [...cards, ...cards, ...cards] : [];

    return (
        <div className="rounded-3xl py-12 overflow-hidden bg-white">
            <style>
                {`
                @keyframes marqueeScroll {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-inner { animation: marqueeScroll 25s linear infinite; }
                .marquee-reverse { animation-direction: reverse; }
                `}
            </style>

            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-[#1a1c20]">Testimonials</h2>
                <p className="text-gray-500 mt-2">What our valuable users say about us</p>
            </div>

            {doubledCards.length === 0 ? (
                <div className="text-center text-gray-400 py-12">No testimonials yet.</div>
            ) : (
                <>
                    <div className="marquee-row w-full mx-auto max-w-[100vw] overflow-hidden relative mb-6">
                        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
                        <div className="marquee-inner flex min-w-[200%] pt-2 pb-2">
                            {doubledCards.map((card, index) => (
                                <TestimonialCard key={`row1-${index}`} card={card} />
                            ))}
                        </div>
                        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
                    </div>

                    <div className="marquee-row w-full mx-auto max-w-[100vw] overflow-hidden relative">
                        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
                        <div className="marquee-inner marquee-reverse flex min-w-[200%] pt-2 pb-2">
                            {doubledCards.map((card, index) => (
                                <TestimonialCard key={`row2-${index}`} card={card} />
                            ))}
                        </div>
                        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Testimonials;