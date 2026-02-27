import React from 'react';
import TeamCard from '../ui/cards/TeamCard';

const Team = ({ title, subtitle, teamMembers = [] }) => {
  const defaultTeamMembers = [
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

  const displayTeam = teamMembers.length > 0 ? teamMembers : defaultTeamMembers;

  return (
    <section className="section section-lg bg-soft">
      <div className="container">
        <div className="row mb-5 mb-lg-6">
          <div className="col-12 col-md-9 col-lg-8 text-center mx-auto">
            <h2 className="h1 mb-4">{title || 'Funny & Creative Team'}</h2>
            <p className="lead">
              {subtitle || 'We have developed a multi-discipline portfolio as a digital marketing agency, we also have roots in print media and even photography.'}
            </p>
          </div>
        </div>

        <div className="row">
          {displayTeam.map((member) => (
            <div key={member.id} className="col-12 col-md-6 col-lg-4 mb-5 mb-lg-0">
              <TeamCard
                image={member.image}
                name={member.name}
                title={member.title}
                description={member.description}
                socialLinks={member.socialLinks}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
