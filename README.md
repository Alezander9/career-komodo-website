# Career Komodo Website

A platform for high schoolers where a conversational AI agent (Career Komodo) teaches them about career paths and alternatives to four-year college education.

## Project Overview

This project is a collaborative effort by Stanford first-year undergraduates as part of the intro to website design course. The website features:

- A modern, space-themed dark UI
- Authentication with Clerk
- Backend powered by Convex
- Chat interface with the Career Komodo AI agent
- Individual student pages for experimentation

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: ShadCN UI, Tailwind CSS
- **Backend**: Convex
- **Authentication**: Clerk
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/career-komodo-website.git
cd career-komodo-website
```

2. Install dependencies:

```bash
npm install
```

3. Set up Convex:

```bash
npx convex dev
```

This will prompt you to log in to Convex and create a new project. Once completed, it will generate a `.env.local` file with your Convex deployment information.

4. Start the development server:

```bash
npm run dev
```

This will start both the Convex backend and the Vite development server.

## Project Structure

- `src/` - Frontend code
  - `components/` - Reusable UI components
    - `ui/` - ShadCN UI components
  - `pages/` - Page components
  - `lib/` - Utility functions
- `convex/` - Backend code
  - `schema.ts` - Database schema
  - `queries.ts` - Data queries
  - `mutations.ts` - Data mutations
- `public/` - Static assets

## Student Pages

Each student has their own page to experiment with:

- `/sabrina` - Sabrina's page
- `/ryan` - Ryan's page
- `/michelle` - Michelle's page
- `/mariem` - Mariem's page
- `/seyma` - Seyma's page
- `/kat` - Kat's page

## Development Guidelines

1. **Path Aliases**: Use the `@/` prefix for imports from the `src` directory and `@convex/` for imports from the `convex` directory.

2. **Component Structure**: Follow the established component patterns:

   - Use the `cn` utility for combining class names
   - Use TypeScript interfaces for props
   - Keep components focused on a single responsibility

3. **Styling**: Use Tailwind CSS for styling. The project uses a space-themed dark color palette.

4. **Theme System**: We've implemented a simple theme system with CSS variables:

   - Core colors are defined in `src/index.css`
   - The theme is dark-only for simplicity
   - Students can extend the theme by adding new color variables
   - All colors use the OKLCH color model for better perceptual uniformity

5. **State Management**: Use React hooks for local state and Convex for global state.

6. **Authentication**: Use Clerk for authentication. The `useUser` hook provides the current user information.

## Deployment

The project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set up the environment variables in Vercel:
   - `VITE_CONVEX_URL`
   - `VITE_CLERK_PUBLISHABLE_KEY`
3. Deploy!

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ShadCN UI Documentation](https://ui.shadcn.com/)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
