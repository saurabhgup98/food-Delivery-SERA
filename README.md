# SERA Food Delivery App

A modern, responsive food delivery web application built with React, TypeScript, and Tailwind CSS.

## Features

- **Modern UI/UX**: Dark theme with pink accents, inspired by modern food delivery apps
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **TypeScript**: Full type safety for better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Router**: Client-side routing for smooth navigation
- **Lucide Icons**: Beautiful, customizable icons

## Design System

### Colors
- **Primary**: Pink (#ff6b9d) - Main brand color
- **Secondary**: Blue (#3b82f6) - Secondary actions
- **Accent**: Orange (#f97316) - CTAs and highlights
- **Yellow**: (#fbbf24) - Notifications and badges
- **Dark**: (#0f172a) - Background and text

### Typography
- **Display Font**: Poppins (Headings)
- **Body Font**: Inter (Body text)

## Project Structure

```
src/
├── components/
│   ├── Header/
│   │   └── Header.tsx
│   └── HeroSection/
│       └── HeroSection.tsx
├── types/
│   └── index.ts
├── App.tsx
├── index.tsx
└── index.css
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Components

### Header Component
- SERA branding with animated scooter logo
- Navigation links (Home, Explore, Contact Us)
- Search functionality
- User authentication (Login/Register)
- Shopping cart with item count
- Mobile-responsive hamburger menu
- Location picker
- Notifications

### Hero Section
- Full-screen hero with background image
- SERA branding and tagline
- Call-to-action buttons
- Feature highlights
- Statistics display
- Floating animated elements
- Scroll indicator

## Future Enhancements

- [ ] Authentication system
- [ ] Restaurant listing and details
- [ ] Menu browsing and cart functionality
- [ ] Order management
- [ ] User profiles
- [ ] Admin dashboard
- [ ] Business owner dashboard
- [ ] Payment integration
- [ ] Real-time order tracking

## Technologies Used

- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React Router**: Navigation
- **Lucide React**: Icons

## License

This project is licensed under the MIT License.
