# Vite Starter React

A modern React starter template built with Vite, TypeScript, and TailwindCSS.

## Features

- ⚡️ [Vite](https://vitejs.dev/) - Lightning fast frontend tooling
- ⚛️ [React 19](https://react.dev/) with TypeScript
- 🎨 [TailwindCSS](https://tailwindcss.com/) for styling
- ✅ Testing Setup
  - [Vitest](https://vitest.dev/) for unit and integration tests
  - [Testing Library](https://testing-library.com/) for React component testing
  - [Cypress](https://www.cypress.io/) for E2E testing
- 📝 Linting and Formatting
  - [ESLint](https://eslint.org/) with React hooks rules
  - [Prettier](https://prettier.io/) with import sorting
- 🔧 Git Hooks with [Husky](https://typicode.github.io/husky/)
  - Pre-commit: Lint and format check
  - Commit message: Conventional commits enforced
- 🔍 VS Code Configuration
  - Debugging setup for Chrome
  - Recommended extensions
  - Task configuration for dev server

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn or pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/duynguyenvp/vite-starter-react.git
   cd vite-starter-react
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

Visit http://localhost:5173 to see your app.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run coverage` - Generate test coverage report
- `npm run cy:open` - Open Cypress for E2E testing
- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Fix linting errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
vite-starter-kit/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── routes/         # Routing configuration
│   ├── styles/         # Global styles
│   ├── App.tsx         # Root component
│   └── main.tsx        # Entry point
├── public/             # Public static files
├── .vscode/           # VS Code configuration
├── .husky/            # Git hooks
└── [Config Files]     # Various configuration files
```

## VS Code Integration

This template includes VS Code settings for optimal development experience:

- Debugging configuration for Chrome
- Task configuration for running development server
- Recommended extensions for React development

## Git Commit Convention

Commit messages must follow this structure:

```
<type>[optional scope]: <description>
```

Rules:

- Header length must not exceed 150 characters
- Type must be one of:
  - `feat`: New features
  - `fix`: Bug fixes
  - `docs`: Documentation changes
  - `style`: Code style changes (formatting, etc)
  - `refactor`: Code refactoring
  - `perf`: Performance improvements
  - `test`: Adding or updating tests
  - `chore`: Maintenance tasks
  - `ci`: CI/CD changes
  - `build`: Build system changes
  - `revert`: Reverting changes
- Type and description are required
- Description must not end with a period

## License

This project is licensed under the MIT License.
