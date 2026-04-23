import { Link } from 'react-router-dom';
import img404 from '../assets/images/404_img.png';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
            <div className="w-full max-w-2xl text-center">
                <img
                    src={img404}
                    alt="404 Not Found"
                    className="w-full h-auto object-contain mx-auto mb-8 max-w-[600px]"
                />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-wide mb-3">
                    PAGE NOT FOUND
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mb-8 font-medium">
                    Your search has ventured beyond the known universe.
                </p>
                <Link
                    to="/home"
                    className="inline-block px-8 py-3 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
