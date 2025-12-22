# LearnHub - Learning Platform (Coursera-like)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Run development server**
```bash
npm run dev
```

3. **Build for production**
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Base UI components (Button, Card, Badge, Input)
│   ├── common/          # Layout components (Header, Footer)
│   └── course/          # Course-specific components (CourseCard, etc.)
├── pages/              # Page components (HomePage, CoursesPage, etc.)
├── types/              # TypeScript interfaces and types
├── lib/
│   ├── utils.ts        # Utility functions
│   └── constants.ts    # Constants and mock data
├── hooks/              # Custom React hooks
├── App.tsx             # Main app component with routing
├── main.tsx            # App entry point
└── index.css           # Global styles with Tailwind
```

## 🎨 Design System

### Colors
- **Primary**: `#4f46e5` (Blue) - Main actions, navigation
- **Secondary**: `#ec4899` (Purple) - Highlights, featured content
- **Success**: `#10b981` (Green) - Completion, ratings
- **Warning**: `#f59e0b` (Orange) - Limited slots, urgent
- **Danger**: `#ef4444` (Red) - Errors

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Regular weight, line-height-relaxed
- **Captions**: Small, neutral-600 color

## 📦 Key Technologies

- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **TailwindCSS 3.3.6** - Styling
- **shadcn/ui components** - UI patterns
- **Lucide React** - Icons
- **React Router DOM 7.0.0** - Routing
- **React Hook Form** - Form management
- **Zod** - Schema validation

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🎯 Features Implemented

### Current
- ✅ Responsive Header with mobile menu
- ✅ Hero section with search
- ✅ Course cards with ratings, pricing, discounts
- ✅ Category cards
- ✅ Instructor cards with verification badge
- ✅ Search bar with clear functionality
- ✅ Filter sidebar with categories, levels, ratings
- ✅ Responsive footer with social links
- ✅ Mobile-first design

### Planned
- 🔄 Authentication system
- 🔄 Course detail page
- 🔄 Instructor profile page
- 🔄 Shopping cart
- 🔄 Payment integration
- 🔄 Quiz system
- 🔄 Certificate generation
- 🔄 Progress tracking
- 🔄 Chat/Q&A system
- 🔄 Dark mode

## 📝 Component Usage

### Button
```tsx
<Button variant="primary" size="md">
  Click me
</Button>
```

### Card
```tsx
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### CourseCard
```tsx
<CourseCard 
  course={courseData} 
  onEnroll={handleEnroll}
  variant="default"
/>
```

## 🔗 Path Aliases

```
@/* → src/*
```

## 📱 Responsive Design

- **Mobile**: sm: 640px
- **Tablet**: md: 768px
- **Desktop**: lg: 1024px, xl: 1280px
- **Large**: 2xl: 1536px

## 🔐 Accessibility

- Semantic HTML
- ARIA labels for icon buttons
- Focus visible states
- Color contrast 4.5:1+
- Keyboard navigation support

## 📚 Naming Conventions

- **Components**: PascalCase (CourseCard.tsx)
- **Utilities/Hooks**: camelCase (useCourseFilter.ts)
- **Constants**: UPPER_SNAKE_CASE (CATEGORIES)
- **Styles**: Tailwind classes only, no CSS files

## 🚀 Performance Tips

1. Use `React.memo()` for frequently rendered components
2. Code split pages with React.lazy()
3. Lazy load images
4. Monitor bundle size

## 📖 Resources

- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Router Guide](https://reactrouter.com)

## 👨‍💻 Development Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and test locally
3. Run linter: `npm run lint`
4. Build: `npm run build`
5. Commit with clear message: `git commit -m "add course detail page"`
6. Push and create PR

## ⚙️ Configuration Files

- **tailwind.config.js** - Tailwind customization
- **vite.config.ts** - Vite build configuration
- **tsconfig.app.json** - TypeScript configuration
- **postcss.config.js** - PostCSS plugins
- **eslint.config.js** - ESLint rules

## 📄 License

MIT

## 🤝 Contributing

1. Follow the coding standards
2. Keep components small and reusable
3. Use proper TypeScript types
4. Write meaningful commit messages

---

**Happy coding! 🎉**
