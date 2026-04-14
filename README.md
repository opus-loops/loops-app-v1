# Loops - Digital Skills Learning App for Kids 🧠🎮

Loops is the ultimate Progressive Web App (PWA) designed to help kids discover the world of coding in a fun, engaging, and competitive way! Built specifically for young learners aged 9-16, Loops teaches essential digital skills through interactive lessons, playful challenges, and gamified experiences.

## 🌟 Features

- 🚀 **Interactive Learning**: Step-by-step coding lessons through games and activities
- 🏆 **Gamification**: Unlock badges and rewards as you progress
- ⚔️ **Competitive Quizzes**: Join quiz rooms to test skills against friends
- 🎮 **Engaging Experience**: Gamified lessons that turn learning into an adventure
- 👾 **Kid-Friendly Design**: Fun characters and interface designed for ages 9-16
- 📱 **PWA Support**: Works offline and can be installed on any device
- 🌍 **Internationalization**: Multi-language support with React i18n

## 🛠️ Tech Stack

### Frontend Framework

- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **TanStack Start** - Full-stack React framework
- **Vite** - Fast build tool and development server

### State Management & Data Fetching

- **TanStack Query** - Server state management with caching
- **TanStack Router** - Type-safe routing
- **TanStack Form** - Powerful form handling
- **Effect** - Functional error handling and async operations

### UI & Styling

- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Development Tools

- **ESLint** - Code linting with security plugins
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality
- **Vitest** - Fast unit testing
- **Testing Library** - React component testing

### PWA & Performance

- **VitePWA** - Progressive Web App capabilities
- **Axios** - HTTP client for API communication
- **Zod** - Runtime type validation

## 🏗️ Architecture

The project follows a **layered architecture** with clear separation of concerns:

```
src/
├── components/ui/          # Reusable UI components (Shadcn)
├── modules/               # Feature modules
│   ├── account-management/    # User account features
│   ├── authentication/        # Login, register, auth flows
│   ├── content-management/    # Content creation and management
│   ├── learning-experience/   # Core learning features
│   ├── shared/               # Shared utilities and services
│   └── user-onboarding/      # User onboarding flows
├── routes/               # Application routes
└── styles/              # Global styles
```

### Module Structure

Each module follows a consistent structure:

- `features/` - UI components and pages
- `services/` - API calls and business logic
- `types/` - TypeScript type definitions
- `hooks/` - Custom React hooks

### Shared Module

The shared module contains:

- `api/` - API configuration and interceptors
- `components/` - Reusable components
- `domain/` - Domain entities and models
- `guards/` - Route guards and middleware
- `navigation/` - Advanced navigation system with smart routing, completion tracking, and strategy-based content transitions (see `.trae/navigation-module-docs.md`)
- `services/` - Shared business logic
- `utils/` - Utility functions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd loops-client
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure the following variables:

   ```env
   VITE_API_URL="http://localhost:8080/api"
   VITE_SESSION_SECRET_KEY="your-secret-key"
   ```

4. **Start the development server**

   ```bash
   yarn dev
   ```

   The app will be available at `http://localhost:3001`

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn lint:format` - Format code with Prettier
- `yarn lint:fix` - Fix ESLint issues
- `yarn test` - Run tests (when configured)

## 🔧 Development Guidelines

### Code Style

- **Language**: All code and comments in English
- **Naming**: camelCase for variables, PascalCase for React components
- **Files**: kebab-case for file names
- **Folders**: snake_case for folder names

### Architecture Principles

1. **Type Safety First**: Never use `any`, enforce strict typing
2. **Validation at Boundaries**: All API responses validated with Zod
3. **Effect Everywhere**: Use Effect package for error handling
4. **Layered Separation**: Clear separation between UI, routing, services
5. **Single Responsibility**: One file = one purpose

### Error Handling

- All API calls wrapped in **Effect** for typed error handling
- Structured error responses with `code`, `message`, and optional `payload`
- No unhandled promises or silent failures

### Testing

- Unit tests for hooks, services, and utilities
- Integration tests for API layer with mocked responses
- E2E tests for critical user flows
- Target ≥80% code coverage

## 📱 PWA Features

- **Offline Support**: Core functionality works without internet
- **Installable**: Can be installed on mobile devices and desktop
- **Background Sync**: Syncs data when connection is restored
- **Push Notifications**: Engagement through notifications (when implemented)
- **Responsive Design**: Optimized for all screen sizes

## 🌍 Internationalization

The app supports multiple languages using React i18n:

- Default language: English
- Translation keys for all UI text
- RTL support ready
- Easy to add new languages

## 🔒 Security

- **Input Validation**: All inputs validated with Zod schemas
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Secure API communication
- **Secure Headers**: Configure them at the edge or app server before production
- **Environment Variables**: Sensitive data in environment variables

Use `docs/production-readiness-checklist.md` as the release gate before production deployments.

## 🚀 Deployment

### Build for Production

```bash
yarn build
```

### Environment Setup

Ensure production environment variables are configured:

- `VITE_API_URL` - Production API endpoint
- `SESSION_SECRET_KEY` - Strong server-side secret key for sessions
- `VITE_GOOGLE_CLIENT_ID` - Google Sign-In client ID when enabled
- `VITE_SENTRY_DSN` - Optional browser Sentry DSN
- `SENTRY_DSN` - Optional server Sentry DSN
- `SENTRY_AUTH_TOKEN` - Optional build-time token for uploading source maps

### PWA Deployment

The app automatically generates:

- Service worker for offline functionality
- Web app manifest for installation
- Optimized assets for different screen sizes

## 🤝 Contributing

1. Follow the established code style and architecture
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages (`feat:`, `fix:`, `refactor:`)
5. Ensure all linting and formatting passes

## 📄 License

MIT License - see LICENSE file for details

## 🎯 Project Goals

Loops aims to make coding education:

- **Accessible** - Available on any device, works offline
- **Engaging** - Gamified learning that keeps kids motivated
- **Effective** - Structured curriculum with measurable progress
- **Safe** - Kid-friendly environment with appropriate content
- **Competitive** - Social features that encourage friendly competition

---

**Made with ❤️ for young coders everywhere!**
