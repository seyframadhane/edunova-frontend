import HeroSection from '../components/home/HeroSection';
import RecommendedCourses from '../components/home/RecommendedCourses';
import CourseList from '../components/home/CourseList';
import Instructors from '../components/home/Instructors';
import Testimonials from '../components/home/Testimonials';

function Home() {
  return (
    <>
      <HeroSection />
      <RecommendedCourses />
      <CourseList title="Trending Courses" trending />
      <CourseList title="New on Platform" />
      <Instructors />
      <Testimonials />
    </>
  );
}

export default Home;