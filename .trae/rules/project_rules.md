# Loops PWA Project Rules

## 1. Language and Style

- Always write code in **English**, including comments and variable names.
- Use **camelCase** for variables, **PascalCase** for React components.
- Maintain concise and clear naming consistent across components and hooks.

## 2. UI Components & Forms

- Use **Shadcn UI** components styled with **TailwindCSS**.
- Forms should use **TanStack Form**, with input validation via **Zod**.
- Keep forms accessible and mobile-friendly for child users.

## 3. Internationalization (i18n)

- All UI components must support **React i18n** translations.
- Default text should fallback to English; ensure translation keys are provided for all languages.

## 4. Error Handling

- Handle all errors explicitly with `Effect` types; do not ignore bad paths.
- Parse backend errors consistently: `code`, `message`, and details in structured format.
- Provide user-friendly error messages, especially for learner interactions.

## 5. Performance & Data Caching

- Use **TanStack Query** for data fetching with caching and background refresh.
- Optimize requests to reduce bandwidth—batch queries where possible.
- Add loading skeletons or placeholders for slow components.

## 6. PWA Best Practices

- Use **VitePWA** for offline capabilities: caching assets and API routes needed for learning flows.
- Prioritize offline readiness for key features: content exploration, in-progress states, and certificates.

## 7. Layer Interaction & Modularity

- Communicate between layers via well-typed hooks and server functions.
- Leverage **TanStack Start** server functions for server-side logic.
- Avoid direct DOM manipulation; use React’s declarative model.

## 8. Testing & Maintainability

- Always include unit tests for critical components, hooks, and forms using Jest or React Testing Library.
- Write smoke tests for main flows: registration, content browsing, quiz completion.
- Follow readable commit message conventions (e.g., `feat:`, `fix:`, `refactor:`).
