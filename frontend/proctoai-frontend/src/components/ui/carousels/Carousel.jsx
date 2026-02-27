import React, { useState } from 'react';

const Carousel = ({ items = [], autoplay = true, interval = 5000 }) => {
  const [current, setCurrent] = useState(0);

  React.useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoplay, interval, items.length]);

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="carousel">
      <div className="carousel-inner">
        {items.map((item, index) => (
          <div
            key={index}
            className={`carousel-item ${index === current ? 'active' : ''}`}
          >
            {item.image && <img src={item.image} alt={item.title} />}
            {item.content && <div className="carousel-content">{item.content}</div>}
          </div>
        ))}
      </div>
      <button className="carousel-control prev" onClick={goToPrevious}>
        <span className="fas fa-chevron-left"></span>
      </button>
      <button className="carousel-control next" onClick={goToNext}>
        <span className="fas fa-chevron-right"></span>
      </button>
      <div className="carousel-indicators">
        {items.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
