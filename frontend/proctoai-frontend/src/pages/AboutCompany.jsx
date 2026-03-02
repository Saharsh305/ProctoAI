import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Hero from '../components/sections/Hero';
import AboutSection from '../components/sections/AboutSection';
import Stats from '../components/sections/Stats';
import CTA from '../components/sections/CTA';

const AboutCompany = () => {
  const stats = [
    { icon: 'fa-user-graduate', title: 'Students Monitored', value: '10,000+' },
    { icon: 'fa-clipboard-check', title: 'Exams Proctored', value: '5,000+' },
    { icon: 'fa-globe', title: 'Institutions', value: '200+' }
  ];

  return (
    <MainLayout>
      <Hero
        title="AI-Powered Exam Proctoring"
        description="ProctoAI delivers intelligent, real-time monitoring to ensure academic integrity — empowering educators and supporting students worldwide."
        primaryLink={{ url: '/signup', label: 'Get Started' }}
        secondaryLink={{ url: '/about', label: 'Learn More' }}
      />

      <AboutSection
        title="Built for integrity,"
        subtitle="Powered by AI."
        description={[
          'ProctoAI is an advanced online proctoring platform that uses artificial intelligence to detect suspicious behavior during online exams, ensuring a fair and secure testing environment.',
          'From gaze tracking and head movement analysis to phone detection and window-switch monitoring, ProctoAI gives institutions the confidence that every exam result is authentic.'
        ]}
      />

      <Stats stats={stats} />

      <CTA
        title="Start proctoring today"
        description="Create your account and set up your first proctored exam in minutes. No hardware required."
        buttonText="Sign Up Free"
        buttonLink="/signup"
      />
    </MainLayout>
  );
};

export default AboutCompany;
