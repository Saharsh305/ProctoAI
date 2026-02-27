import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Hero from '../components/sections/Hero';
import ContactForm from '../components/ui/forms/ContactForm';
import ContactInfo from '../components/sections/ContactInfo';
import TeamCard from '../components/ui/cards/TeamCard';

const Contact = () => {
  const supportTeam = [
    {
      id: 1,
      name: 'Christopher M. Wood',
      title: 'Sales',
      image: '/assets/img/team/profile-picture-2.jpg',
      socialLinks: [
        { type: 'facebook', url: '#' },
        { type: 'twitter', url: '#' },
        { type: 'slack-hash', url: '#' },
        { type: 'dribbble', url: '#' }
      ]
    },
    {
      id: 2,
      name: 'Bonnie M. Green',
      title: 'Marketing',
      image: '/assets/img/team/profile-picture-3.jpg',
      socialLinks: [
        { type: 'facebook', url: '#' },
        { type: 'twitter', url: '#' },
        { type: 'slack-hash', url: '#' },
        { type: 'dribbble', url: '#' }
      ]
    },
    {
      id: 3,
      name: 'Neil D. Sims',
      title: 'Invoice',
      image: '/assets/img/team/profile-picture-1.jpg',
      socialLinks: [
        { type: 'facebook', url: '#' },
        { type: 'twitter', url: '#' },
        { type: 'slack-hash', url: '#' },
        { type: 'dribbble', url: '#' }
      ]
    }
  ];

  const handleContactSubmit = (data) => {
    console.log('Contact form submitted:', data);
  };

  return (
    <MainLayout>
      <Hero
        title="Get in touch today"
        description="Have a new project in mind? Drop us a line about your project needs, we answer same day."
        bgColor="bg-primary"
      />

      <div className="section py-0">
        <div className="container mt-n10">
          <div className="row">
            <div className="col-12">
              <iframe
                className="map rounded"
                title="Contact Map"
                id="gmap_canvas"
                src="https://maps.google.com/maps?q=san%20francisco&t=&z=8&ie=UTF8&iwloc=&output=embed"
                style={{ width: '100%', height: '400px', border: 'none' }}
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <section className="section section-lg pt-6">
        <div className="container">
          <div className="row justify-content-center mb-5 mb-lg-6">
            <div className="col-12 col-md-10 col-lg-8">
              <div className="card border-0 p-2 p-md-3">
                <div className="card-body px-0">
                  <ContactInfo />
                  <ContactForm onSubmit={handleContactSubmit} />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2>Our support team</h2>
            </div>
            {supportTeam.map((member) => (
              <div key={member.id} className="col-12 col-md-6 col-lg-4 mb-5 mb-lg-0">
                <TeamCard
                  image={member.image}
                  name={member.name}
                  title={member.title}
                  socialLinks={member.socialLinks}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
