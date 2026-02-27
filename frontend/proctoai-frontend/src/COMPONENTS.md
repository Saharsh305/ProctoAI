# React Component File Structure & Content

Complete JSX conversion of HTML components with organized folder structure.

## 📂 Complete File Tree

```
src/
├── components/
│   ├── common/
│   │   ├── Navigation.jsx       ✓ Responsive navbar
│   │   ├── Footer.jsx           ✓ Footer with links & newsletter
│   │   └── Preloader.jsx        ✓ Animated loader
│   │
│   ├── ui/
│   │   ├── buttons/
│   │   │   └── Button.jsx       ✓ Versatile button component
│   │   ├── cards/
│   │   │   ├── Card.jsx         ✓ Generic card
│   │   │   └── TeamCard.jsx     ✓ Team member card with socials
│   │   ├── forms/
│   │   │   ├── FormGroup.jsx    ✓ Form input wrapper
│   │   │   └── ContactForm.jsx  ✓ Complete contact form
│   │   ├── badges/
│   │   │   └── Badge.jsx        ✓ Badge component
│   │   ├── alerts/
│   │   │   └── Alert.jsx        ✓ Alert/notification
│   │   ├── breadcrumbs/
│   │   │   └── Breadcrumb.jsx   ✓ Breadcrumb navigation
│   │   ├── accordions/
│   │   │   └── Accordion.jsx    ✓ Accordion/collapsible
│   │   ├── carousels/
│   │   │   └── Carousel.jsx     ✓ Image carousel
│   │   └── pagination/
│   │       └── Pagination.jsx   ✓ Pagination control
│   │
│   ├── sections/
│   │   ├── Hero.jsx             ✓ Hero banner section
│   │   ├── Stats.jsx            ✓ Statistics display
│   │   ├── Team.jsx             ✓ Team members grid
│   │   ├── CTA.jsx              ✓ Call-to-action section
│   │   ├── ContactInfo.jsx      ✓ Contact details
│   │   └── AboutSection.jsx     ✓ About company section
│   │
│   └── layout/
│       └── MainLayout.jsx       ✓ Master layout wrapper
│
├── pages/
│   ├── AboutCompany.jsx         ✓ About page
│   ├── Contact.jsx              ✓ Contact page
│   ├── Pricing.jsx              ○ Coming soon
│   ├── Services.jsx             ○ Coming soon
│   ├── SignIn.jsx               ○ Coming soon
│   └── SignUp.jsx               ○ Coming soon
│
├── hooks/
│   └── useNavigation.js         ✓ Navigation state hook
│
├── utils/
│   └── constants.js             ✓ App constants
│
├── styles/
│   └── index.css                ✓ Global styles
│
├── App.jsx                      ✓ Main app component
├── index.js                     ✓ Entry point
├── package.json                 ✓ Dependencies
└── README.md                    ✓ Documentation

```

## ✨ Component Features

### Navigation Component
- Responsive mobile menu
- Dropdown navigation items
- Logo switching (light/dark)
- Hamburger toggle

### Footer Component
- Social media links
- Footer links sections
- Newsletter subscription
- Copyright year auto-update

### Button Component
- Multiple variants (primary, secondary, tertiary)
- Size options (sm, md, lg)
- Block layout option
- Customizable styling

### Forms
- FormGroup wrapper with icons
- ContactForm with validation
- Text inputs and textarea
- State management

### Cards
- Generic Card component
- Specialized TeamCard with social links
- Image support
- Flexible content

### Sections
- Hero with CTA buttons
- Stats counter display
- Team member grid
- CTA sections
- Contact information display
- About section with images

### Layout
- MainLayout wrapper
- Navigation + Content + Footer
- Preloader option
- Responsive container

## 🎨 Styling System

### Color Variables
```css
--primary: #5e72e4
--secondary: #825ee4
--tertiary: #11cdef
--success: #2dce89
--danger: #f5365c
--warning: #fb6340
--dark: #32325d
--light: #f7fafc
```

### Utility Classes
- Spacing: `mb-0` to `mb-6`, `mt-0` to `mt-5`, etc.
- Display: `d-flex`, `d-block`, `d-none`, etc.
- Text: `text-center`, `text-white`, `text-muted`, etc.
- Alignment: `align-items-center`, `justify-content-center`, etc.
- Grid: `col-12`, `col-md-6`, `col-lg-4`, etc.

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Usage Examples

### Create a Hero Section
```jsx
import Hero from '@/components/sections/Hero';

<Hero
  title="Welcome"
  description="Explore our platform"
  primaryLink={{ url: '/services', label: 'Start Now' }}
  imageUrl="/img/hero.jpg"
/>
```

### Add a Contact Form
```jsx
import ContactForm from '@/components/ui/forms/ContactForm';

<ContactForm onSubmit={(data) => {
  console.log('Form data:', data);
}} />
```

### Use Team Display
```jsx
import Team from '@/components/sections/Team';

<Team
  title="Our Team"
  teamMembers={teamData}
/>
```

### Add Navigation
```jsx
import Navigation from '@/components/common/Navigation';

<Navigation />
```

## 🔧 Component Props

### Button Props
```jsx
<Button
  variant="primary"        // 'primary', 'secondary', 'tertiary'
  size="md"               // 'sm', 'md', 'lg'
  block={false}           // Full width
  className=""            // Additional classes
>
  Click Me
</Button>
```

### ContactForm Props
```jsx
<ContactForm
  onSubmit={(data) => {}} // Form submission handler
/>
```

### Hero Props
```jsx
<Hero
  title=""                // Main heading
  description=""          // Description text
  primaryLink={{}}        // Primary CTA button
  imageUrl=""             // Hero image
  bgColor=""              // Background color class
/>
```

### Team Props
```jsx
<Team
  title=""                // Section title
  subtitle=""             // Subtitle
  teamMembers={[]}        // Array of team members
/>
```

## 📋 Next Components to Create

- [ ] Pricing Page with pricing cards
- [ ] Services Page with service cards
- [ ] Sign In form page
- [ ] Sign Up form page
- [ ] Modal/Dialog component
- [ ] Tooltip component
- [ ] Popover component
- [ ] Tab component
- [ ] Dropdown menu
- [ ] Toast notifications
- [ ] Progress bars
- [ ] Spinners/Loaders

## 🎯 Implementation Tips

1. **Reusability**: Create smaller components for better reuse
2. **Props**: Pass data via props for flexibility
3. **CSS Classes**: Use utility classes for consistent styling
4. **State Management**: Use hooks for component state
5. **Responsive**: Test on mobile, tablet, desktop
6. **Accessibility**: Use semantic HTML and aria labels
7. **Performance**: Lazy load components and optimize images

## 📞 Support

Refer to original HTML files in `static/html/` for reference design.

---

**Status**: ✅ Core components ready  
**Last Updated**: 2026-02-27
