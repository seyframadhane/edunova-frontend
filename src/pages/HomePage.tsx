import HeroSection from '../components/home/HeroSection';
import { ContinueLearning } from '../components/home/ContinueLearning';
import CourseList from '../components/home/CourseList';
import Instructors from '../components/home/Instructors';
import Testimonials from '../components/home/Testimonials';

function Home() {
  return (
    <div className='bg-gray-50 min-h-screen'>
      <HeroSection />

      <div className='my-8'>
        <ContinueLearning />
      </div>

      <CourseList title="Trending Courses" />
      <CourseList title="Top Rated Courses" />
      <CourseList title="New on Platform" />

      <div className='my-12'>
        <Instructors />
      </div>

      <Testimonials />
    </div>
  )
}

export default Home