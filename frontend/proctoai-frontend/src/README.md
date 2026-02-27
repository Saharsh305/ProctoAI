# React JSX Components - MyProctor UI Conversion

This directory contains React/JSX components converted from the HTML static components.

## 📁 Project Structure

```
src/
├── components/
│   ├── common/              # Shared layout components
│   │   ├── Navigation.jsx   # Top navigation bar
│   │   ├── Footer.jsx       # Footer component
│   │   └── Preloader.jsx    # Loading animation
│   ├── ui/                  # Atomic UI components
│   │   ├── buttons/
│   │   │   └── Button.jsx
│   │   ├── cards/
│   │   │   ├── Card.jsx
│   │   │   └── TeamCard.jsx
│   │   └── forms/
│   │       ├── FormGroup.jsx
│   │       └── ContactForm.jsx
│   ├── sections/            # Reusable page sections
│   │   ├── Hero.jsx
│   │   ├── Stats.jsx
│   │   ├── Team.jsx
│   │   ├── CTA.jsx
│   │   ├── ContactInfo.jsx
│   │   └── AboutSection.jsx
│   └── layout/
│       └── MainLayout.jsx   # Main layout wrapper
├── pages/                   # Full page components
│   ├── AboutCompany.jsx
│   └── Contact.jsx
├── hooks/                   # Custom React hooks
│   └── useNavigation.js
├── utils/                   # Utility functions & constants
│   └── constants.js
├── styles/                  # CSS stylesheets
│   └── index.css
├── App.jsx                  # Main app component
└── main.jsx                 # Vite entry point

```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs the app in development mode (Vite default) at [http://localhost:5173](http://localhost:5173)

### Build

```bash
npm run build
```

Builds the app for production to the `dist` folder.

## 📦 Components Overview

### Common Components

- **Navigation**: Responsive navbar with dropdown menus
- **Footer**: Footer with social links and subscription form
- **Preloader**: Loading animation SVG

### UI Components

- **Button**: Flexible button component with variants (primary, secondary, tertiary)
- **Card**: Generic card component with customizable styling
- **TeamCard**: Specialized card for displaying team member profiles
- **FormGroup**: Form input wrapper with label and icon support
- **ContactForm**: Complete contact form with validation

### Section Components

- **Hero**: Large header section with CTA
- **Stats**: Statistics display section (Team Members, Projects, Countries)
- **Team**: Team members grid display
- **CTA**: Call-to-action section
- **ContactInfo**: Contact details display (address, phone, email)
- **AboutSection**: About company section with images and signature

### Layout

- **MainLayout**: Main wrapper component combining Navigation, Footer, and content

## 📄 Page Components

- **AboutCompany**: About company page combining multiple sections
- **Contact**: Contact page with map, form, and team members

## 🎨 Styling

All styles are in `src/styles/index.css` with:
- CSS variables for theme colors
- Utility classes (spacing, display, alignment, etc.)
- Responsive design with mobile-first approach
- Bootstrap-like grid system (12 columns)

### Color Palette

- Primary: `#5e72e4` (Blue)
- Secondary: `#825ee4` (Purple)
- Tertiary: `#11cdef` (Cyan)
- Dark: `#32325d` (Navy)
- Light: `#f7fafc` (Off-white)

## 🔧 Key Features

✅ Responsive design  
✅ Modular component structure  
✅ Reusable sections and components  
✅ React Router integration  
✅ Form handling  
✅ CSS utility classes  
✅ No external CSS framework dependency  

## 📝 Usage Examples

### Using Hero Section

```jsx
import Hero from '../components/sections/Hero';

<Hero
  title="Welcome to MyProctor"
  description="AI-based online examination proctoring system"
  primaryLink={{ url: '/about', label: 'Learn More' }}
  imageUrl="/assets/img/hero.jpg"
/>
```

### Using ContactForm

```jsx
import ContactForm from '../components/ui/forms/ContactForm';

<ContactForm onSubmit={(data) => console.log(data)} />
```

### Using Team Section

```jsx
import Team from '../components/sections/Team';

<Team
  title="Our Team"
  teamMembers={[
    {
      id: 1,
      name: 'John Doe',
      title: 'Developer',
      image: '/img/john.jpg',
      socialLinks: [...]
    }
  ]}
/>
```

## 🔗 Routing

Set up routes in `App.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/about" element={<AboutCompany />} />
    <Route path="/contact" element={<Contact />} />
  </Routes>
</BrowserRouter>
```

## 📚 Best Practices

1. **Component Organization**: Group related components in folders
2. **Reusability**: Create small, focused components
3. **Props**: Pass data via props rather than hard-coding
4. **Styling**: Use CSS classes with utility classes for styling
5. **Code Splitting**: Use React.lazy() for route-based code splitting

## 🎯 Next Steps

- [ ] Add more pages (Pricing, Services, Sign In, Sign Up)
- [ ] Implement API integration
- [ ] Add state management (Context API or Redux)
- [ ] Implement form validation
- [ ] Add animations and transitions
- [ ] SEO optimization
- [ ] Dark mode support
- [ ] Accessibility improvements

## 📞 Support

For issues or questions, please refer to the original HTML files in `static/html/`

---

**Created**: 2026  
**Framework**: React 18+  
**Build Tool**: React Scripts  
**Styling**: Vanilla CSS
