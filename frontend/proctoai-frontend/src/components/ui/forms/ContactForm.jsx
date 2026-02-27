import React, { useState } from 'react';
import FormGroup from './FormGroup';
import Button from '../buttons/Button';

const ContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="card border-0">
      <div className="card-header bg-white text-center">
        <h2>Want to work with us?</h2>
        <p>Cool! Let's talk about your project</p>
      </div>
      <div className="card-body px-5">
        <FormGroup label="Your Name" htmlFor="name" icon="user">
          <input 
            className="form-control" 
            placeholder="James Palmer" 
            type="text" 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup label="Email address" htmlFor="email" icon="at">
          <input 
            className="form-control" 
            placeholder="Email" 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <div className="form-group">
          <label className="h6" htmlFor="message">Your message</label>
          <textarea 
            className="form-control" 
            id="message" 
            placeholder="How can we help?" 
            rows="4"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
      </div>
      <div className="card-footer text-center bg-white pt-0 pb-5">
        <Button type="submit" variant="secondary" className="rounded">
          Send message
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
