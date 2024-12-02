# Edit Menu Next

A fully responsive, interactive menu builder using **Next.js**, **React**, and **Zustand** for state management. This project includes support for drag-and-drop functionality, customizable styles, and multi-level navigation menus.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Development](#development)
- [Scripts](#scripts)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [License](#license)

---

## Features

- Interactive menu builder
- Drag-and-drop functionality
- Multi-level navigation support
- State management with **Zustand**
- Styled with **Tailwind CSS** and SCSS utilities
- Tests written using **Jest** and **Testing Library**
- Form validation with **React Hook Form** and **Yup**

---

## Technologies Used

- **Next.js 15.0.3**
- **React 18.3.1**
- **Zustand** for state management
- **Dnd-kit** for drag-and-drop
- **Tailwind CSS**
- **SCSS** for custom styling
- **React Hook Form** with **Yup**
- **Jest** and **Testing Library** for tests
- **TypeScript** for type safety

---

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** (>=16.x recommended)
- **npm** or **yarn**

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/jaman7/builder-menu-next.git
   cd edit-menu-next
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables (if any):
   - Create a `.env.local` file in the root directory.
   - Add any necessary environment variables as needed for the project.

---

## Development

### Run the Development Server

To start the development server, run:

```bash
npm run dev
```

This will start a local server on `http://localhost:3000`.

### Build for Production

To create a production build, run:

```bash
npm run build
```

To serve the production build locally:

```bash
npm start
```

---

## Scripts

### Linting

To lint the codebase:

```bash
npm run lint
```

To fix linting issues automatically:

```bash
npm run lint:fix
```

### Formatting

To format the codebase using Prettier:

```bash
npm run prettier:format
```

---

## Testing

### Run Tests

To execute all tests in watch mode:

```bash
npm run test
```

For continuous integration (CI) testing:

```bash
npm run test:ci
```

---

## Project Structure

```
src/
├── app/
│   ├── components/           # Reusable React components
│   ├── shared/               # Shared components, helpers, and utilities
│   ├── store/                # Zustand store and related logic
│   ├── head.tsx              # <head> metadata
│   ├── layout.tsx            # Global layout component
│   └── page.tsx              # Entry point for the Home page
├── assets/                   # Static assets (e.g., images, fonts, SCSS)
├── scss/                     # Global and utility SCSS styles
```

---

## License

This project is licensed under the [MIT License](LICENSE).
