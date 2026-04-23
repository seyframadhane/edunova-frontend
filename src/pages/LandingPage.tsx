import React from 'react';
import Header from '../components/landingPage/Header';
import Hero from '../components/landingPage/Hero';
import StatsBar from '../components/landingPage/StatsBar';
import FeatureSection from '../components/landingPage/FeatureSection';
import CoursesSection from '../components/landingPage/CoursesSection';
import MasterSkills from '../components/landingPage/MasterSkills';
import Testimonials from '../components/landingPage/Testimonials';
import Footer from '../components/landingPage/Footer';

const LandingPage = (): React.JSX.Element => {
  return (
    <>
      <Header />
      <Hero />
      <StatsBar />
      <FeatureSection />

      <div id="courses">
        <CoursesSection title="Explore top courses" showTabs={true} />
        <CoursesSection title="Explore trending courses" showTabs={true} />
      </div>

      <MasterSkills />
      <Testimonials />
      <Footer />
    </>
  );
};

export default LandingPage;
