import React from 'react';

const ContactInfo = ({ items = [] }) => {
  const defaultItems = [
    {
      id: 1,
      icon: 'fa-map-marker-alt',
      title: 'Visit us',
      content: 'Silicon Valley\nUSA, California'
    },
    {
      id: 2,
      icon: 'fa-phone-volume',
      title: 'Call',
      content: '+3912345678',
      subtext: 'Mon - Fri, 8am - 4pm'
    },
    {
      id: 3,
      icon: 'fa-paper-plane',
      title: 'Email',
      links: [
        { text: 'contact@company.io' },
        { text: 'marketing@company.io' }
      ]
    }
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  return (
    <div className="row mb-4">
      {displayItems.map((item) => (
        <div key={item.id} className={`col-12 col-sm-${item.id === 2 ? '4' : '6'} col-md-4 text-center`}>
          <div className="icon-box mb-4">
            <div className="icon icon-dark mb-4">
              <span className={`fas ${item.icon}`}></span>
            </div>
            <h2 className="h5 icon-box-title">{item.title}</h2>
            {item.content && (
              <span>
                {item.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < item.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </span>
            )}
            {item.subtext && <div className="text-small text-gray">{item.subtext}</div>}
            {item.links && (
              <div>
                {item.links.map((link, i) => (
                  <React.Fragment key={i}>
                    <a href="#">{link.text}</a>
                    {i < item.links.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactInfo;
