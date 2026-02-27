import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Hero from '../components/sections/Hero';
import AboutSection from '../components/sections/AboutSection';
import Stats from '../components/sections/Stats';
import Team from '../components/sections/Team';
import ContactForm from '../components/ui/forms/ContactForm';
import CTA from '../components/sections/CTA';

const AboutCompany = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Joseph Garth',
      title: 'Co-Founder',
      image: '/assets/img/team/profile-picture-1.jpg',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content.',
      socialLinks: [
        { type: 'facebook', url: '#' },
        { type: 'twitter', url: '#' },
        { type: 'slack-hash', url: '#' },
        { type: 'dribbble', url: '#' }
      ]
    },
    {
      id: 2,
      name: 'Bonnie Green',
      title: 'Web Developer',
      image: '/assets/img/team/profile-picture-3.jpg',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content.',
      socialLinks: [
        { type: 'facebook', url: '#' },
        { type: 'twitter', url: '#' },
        { type: 'slack-hash', url: '#' },
        { type: 'dribbble', url: '#' }
      ]
    },
    {
      id: 3,
      name: 'Jose Leos',
      title: 'Web publications designer',
      image: '/assets/img/team/profile-picture-2.jpg',
      description: 'Some quick example text to build on the card title and make up the bulk of the card content.',
      socialLinks: [
        { type: 'facebook', url: '#' },
        { type: 'twitter', url: '#' },
        { type: 'slack-hash', url: '#' },
        { type: 'dribbble', url: '#' }
      ]
    }
  ];

  const stats = [
    { icon: 'fa-user', title: 'Team Members', value: '500' },
    { icon: 'fa-money-check', title: 'Projects Published', value: '2400' },
    { icon: 'fa-globe-europe', title: 'Countries', value: '80' }
  ];

  const handleContactSubmit = (data) => {
    console.log('Contact form submitted:', data);
  };

  return (
    <MainLayout>
      <Hero
        title="Full-Service Digital Agency"
        description="Themesberg can help you build a modern website, a creative logo or PWA, that will bring you customers and stay on top of your competition."
        primaryLink={{ url: '/services', label: 'What we do' }}
        imageUrl="/assets/img/illustrations/about-illustration.svg"
      />

      <AboutSection
        title="Small team,"
        subtitle="Big hearts."
        description={[
          'Themesberg is an experienced and passionate group of designers, developers, project managers, writers and artists. Every client we work with becomes a part of the team. Together we face the challenges and celebrate the victories.',
          'With a culture of collaboration, a roster of talent, and several office pooches, the Themesberg team is active in the creative community, endlessly interested in what\'s next, and generally pleasant to be around.'
        ]}
        images={[
          { src: '/assets/img/sections/about-us-3.jpg', alt: 'Themesberg Office' },
          { src: '/assets/img/sections/about-us-2.jpg', alt: 'Pixel Office' }
        ]}
        signature="/assets/img/signature.svg"
      />

      <Stats stats={stats} />

      <Team title="Funny & Creative Team" teamMembers={teamMembers} />

      <section className="section section-lg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8">
              <ContactForm onSubmit={handleContactSubmit} />
            </div>
          </div>
        </div>
      </section>

      <CTA
        title="Become one of us"
        description="Do you want to join our team and work remotely from anywhere you'd like? We can't wait to hear from you!"
        buttonText="Check Careers"
        imageUrl="/assets/img/illustrations/reading-side.svg"
      />
    </MainLayout>
  );
};

export default AboutCompany;
