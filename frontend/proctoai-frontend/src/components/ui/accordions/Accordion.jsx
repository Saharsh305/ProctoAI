import React, { useState } from 'react';

const Accordion = ({ items = [], allowMultiple = false }) => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (allowMultiple) {
      if (newOpenItems.has(id)) {
        newOpenItems.delete(id);
      } else {
        newOpenItems.add(id);
      }
    } else {
      if (newOpenItems.has(id)) {
        newOpenItems.delete(id);
      } else {
        newOpenItems.clear();
        newOpenItems.add(id);
      }
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index} className="accordion-item">
          <button
            className={`accordion-header ${openItems.has(index) ? 'active' : ''}`}
            onClick={() => toggleItem(index)}
          >
            {item.title}
          </button>
          {openItems.has(index) && (
            <div className="accordion-body">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
