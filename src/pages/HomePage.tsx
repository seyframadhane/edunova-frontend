import HeroSection from '../components/home/HeroSection';
import StatsStrip from '../components/home/StatsStrip';
import CategoryStrip from '../components/home/CategoryStrip';
import RecommendedCourses from '../components/home/RecommendedCourses';
import CourseList from '../components/home/CourseList';
import ValueProps from '../components/home/ValueProps';
import Instructors from '../components/home/Instructors';
import Testimonials from '../components/home/Testimonials';

function Home() {
  return (
    <main className="bg-white">
      <HeroSection />
      <StatsStrip />
      <RecommendedCourses />
      <CategoryStrip />
      <CourseList title="Trending Courses" trending />
      <ValueProps />
      <CourseList title="New on Platform" />
      <Instructors />
      <Testimonials />
    </main>
  );
}

export default Home;