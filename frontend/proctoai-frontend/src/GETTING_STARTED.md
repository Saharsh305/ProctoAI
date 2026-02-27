/**
 * Getting Started Guide
 */

# 🚀 Getting Started with React JSX Components

This guide will help you get started with the converted React components.

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
  npm run dev
   ```

3. **Open browser to:**
   ```
  http://localhost:5173
   ```

## Quick Start

### 1. Use a Full Page Component

```jsx
import React from 'react';
import { AboutCompany, Contact } from './pages';

function App() {
  return <AboutCompany />;
}

export default App;
```

### 2. Use Individual Sections

```jsx
import React from 'react';
import { Hero, Stats, Team, MainLayout } from './components';

function MyPage() {
  return (
    <MainLayout>
      <Hero 
        title="Welcome"
        description="This is a great place"
      />
      <Stats />
      <Team />
    </MainLayout>
  );
}

export default MyPage;
```

### 3. Use UI Components

```jsx
import React from 'react';
import { Button, Card, ContactForm } from './components';

function MyComponent() {
  return (
    <div>
      <Card>
        <h2>Contact Us</h2>
        <ContactForm onSubmit={(data) => console.log(data)} />
        <Button variant="primary">Submit</Button>
      </Card>
    </div>
  );
}

export default MyComponent;
```

## Component Hierarchy

```
MainLayout
├── Navigation
├── Main Content
│   ├── Hero
│   ├── Stats
│   ├── Team
│   ├── AboutSection
│   ├── ContactForm
│   └── CTA
└── Footer
```

## Available Components

### Layout
- `MainLayout` - Wraps Navigation, Content, Footer

### Common
- `Navigation` - Top navigation bar
- `Footer` - Footer with links
- `Preloader` - Loading animation

### Sections
- `Hero` - Large banner with CTA
- `Stats` - Display statistics
- `Team` - Team member grid
- `AboutSection` - About company section
- `ContactInfo` - Contact details
- `CTA` - Call-to-action section

### UI Components
- `Button` - Clickable button
- `Card` - Card container
- `TeamCard` - Team member card
- `FormGroup` - Form input wrapper
- `ContactForm` - Full contact form
- `Badge` - Status badge
- `Alert` - Notification alert
- `Breadcrumb` - Navigation breadcrumbs
- `Accordion` - Collapsible sections
- `Carousel` - Image carousel
- `Pagination` - Page navigation

## Styling

All styles are in `src/styles/index.css`. Use CSS classes:

```jsx
<div className="container">
  <div className="row">
    <div className="col-md-6">
      <h1 className="display-2 mb-4">Heading</h1>
      <p className="lead text-muted">Description</p>
      <Button variant="primary">Action</Button>
    </div>
  </div>
</div>
```

## Utility Classes

### Spacing
- `mb-0` to `mb-6` (margin-bottom)
- `mt-0` to `mt-5` (margin-top)
- `ml-2, ml-3, ml-4` (margin-left)
- `mr-2, mr-3, mr-4` (margin-right)
- `px-4, px-5` (padding horizontal)

### Display
- `d-flex` - Flexbox
- `d-block` - Block element
- `d-none` - Hide element
- `d-md-block` - Show on mobile, hide on tablet+

### Alignment
- `text-center` - Center text
- `align-items-center` - Vertical center (flex)
- `justify-content-center` - Horizontal center (flex)

### Grid
- `container` - Fixed width container
- `row` - Flex row
- `col-12` - Full width
- `col-md-6` - 50% on tablet+
- `col-lg-4` - 33% on desktop+

### Colors
- `bg-primary` - Primary color background
- `text-white` - White text
- `text-muted` - Grayed text

## Examples

### Create a Custom Page

```jsx
import React from 'react';
import { MainLayout, Hero, Stats, Team, CTA } from './components';

const MyPage = () => {
  return (
    <MainLayout>
      <Hero
        title="My Title"
        description="My description"
        primaryLink={{ url: '/about', label: 'Learn More' }}
      />
      <Stats stats={[
        { icon: 'fa-users', title: 'Team', value: '50' }
      ]} />
      <Team teamMembers={[...]} />
      <CTA 
        title="Join Us"
        description="Be part of our journey"
      />
    </MainLayout>
  );
};

export default MyPage;
```

### Create a Contact Form

```jsx
import React from 'react';
import { ContactForm, Button } from './components';

const Contact = () => {
  const handleSubmit = async (data) => {
    // Send to API
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  };

  return <ContactForm onSubmit={handleSubmit} />;
};

export default Contact;
```

### Use Utilities

```jsx
import React from 'react';
import { classNames, formatDate, isValidEmail } from './utils/helpers';

const MyForm = () => {
  const classes = classNames('form', 'active', 'mb-4');
  const today = formatDate(new Date());

  return (
    <form className={classes}>
      <p>Today: {today}</p>
    </form>
  );
};

export default MyForm;
```

## Routing Setup

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AboutCompany, Contact } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AboutCompany />} />
        <Route path="/about" element={<AboutCompany />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## Tips & Best Practices

1. **Import from index.js:**
   ```jsx
   import { Button, Card, Hero } from './components';
   ```

2. **Use MainLayout for consistency:**
   ```jsx
   import { MainLayout } from './components';
   <MainLayout><YourContent /></MainLayout>
   ```

3. **Pass data as props:**
   ```jsx
   <Team teamMembers={data} />
   ```

4. **Use CSS classes for styling:**
   ```jsx
   <div className="container mt-5 mb-6">...</div>
   ```

5. **Lazy load large components:**
   ```jsx
   const ThirdPartyComponent = React.lazy(() => import('./ThirdParty'));
   ```

## Troubleshooting

### Components not showing?
- Check if all props are passed correctly
- Verify class names are spelled correctly
- Check console for errors

### Styles not applied?
- Make sure `index.css` is imported in `index.js`
- Verify class names exist in CSS
- Check CSS specificity

### Images not loading?
- Ensure image paths are correct
- Check public folder structure
- Use absolute paths from public folder

## Next Steps

1. Customize colors and branding
2. Add API integration
3. Implement authentication
4. Add state management
5. Optimize performance
6. Deploy to production

---

**Need Help?**
- Check `COMPONENTS.md` for component list
- Review `README.md` for project structure
- Check original HTML in `static/html/` for reference

Happy coding! 🎉
