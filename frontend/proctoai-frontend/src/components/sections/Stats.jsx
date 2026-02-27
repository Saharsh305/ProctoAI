import React from 'react';

const Stats = ({ stats = [] }) => {
  const defaultStats = [
    { icon: 'fa-user', title: 'Team Members', value: '500' },
    { icon: 'fa-money-check', title: 'Projects Published', value: '2400' },
    { icon: 'fa-globe-europe', title: 'Countries', value: '80' }
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <section className="section section-lg">
      <div className="container">
        <div className="row">
          {displayStats.map((stat, index) => (
            <div key={index} className="col-md-4 col-lg-4 text-center">
              <div className="icon-box mb-4">
                <div className="icon icon-primary mb-4">
                  <span className={`fas ${stat.icon}`}></span>
                </div>
                <h3 className="h5 icon-box-title">{stat.title}</h3>
                <span className="counter display-3 text-gray d-block">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
