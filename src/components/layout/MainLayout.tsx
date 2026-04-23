import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Navigation from './Navigation';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-[#1a1c20] font-sans">
            {/* Sidebar Navigation */}
            <Navigation />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative pl-20 transition-all duration-300 min-h-screen">

                <Header />

                <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8 scroll-smooth">
                    <Outlet />

                    <div className="mt-12">
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
